export type ImageOptions = { quality:number;width:number;height:number;keepRatio:boolean;amount:number;option:string;text?:string };
export type ProcessedImage = { result:string;blob?:Blob };
import { getMessages } from "@/i18n/messages";
import type { Locale } from "@/i18n/routing";

const MAX_PIXELS=40_000_000;

export async function processImage(slug:string,file:File,options:ImageOptions,locale:Locale="ko"):Promise<ProcessedImage>{
  const messages=getMessages(locale);
  if(file.size>30*1024*1024)throw new Error(messages.errors.tooLarge.replace("{size}","30"));
  let source:Blob=file;
  if(/\.heic$/i.test(file.name)||file.type==="image/heic"||file.type==="image/heif"){
    const heic2any=(await import("heic2any")).default;
    const converted=await heic2any({blob:file,toType:"image/jpeg",quality:options.quality});
    source=Array.isArray(converted)?converted[0]:converted;
  }
  const bitmap=await createImageBitmap(source);
  try{
    if(bitmap.width*bitmap.height>MAX_PIXELS)throw new Error(messages.errors.pixels);
    if(slug==="image-info")return{result:`${messages.fileName}: ${file.name}\n${messages.mime}: ${file.type||messages.unknown}\n${messages.fileWidth}: ${bitmap.width}px\n${messages.fileHeight}: ${bitmap.height}px\n${messages.fileSize}: ${(file.size/1024).toFixed(1)} KB\n${messages.ratio}: ${(bitmap.width/bitmap.height).toFixed(3)}:1`};
    if(slug==="instagram-grid-split")return await splitImageGrid(bitmap,Number(options.option)||9);
    const canvas=document.createElement("canvas");let w=bitmap.width,h=bitmap.height;
    if(slug==="favicon-generator"){w=32;h=32;}
    if(slug==="image-resize"){w=Math.max(1,Math.min(12000,Number(options.width)||1));h=options.keepRatio?Math.max(1,Math.round(w*bitmap.height/bitmap.width)):Math.max(1,Math.min(12000,Number(options.height)||1));}
    const socialSizes:Record<string,[number,number]>={square:[1080,1080],portrait:[1080,1350],story:[1080,1920],youtube:[1280,720],x:[1600,900],facebook:[1200,630]};
    if(slug==="social-image-resize"){[w,h]=socialSizes[options.option]??socialSizes.square;}
    if(slug==="image-crop"){const ratio=Number(options.option)||1;if(w/h>ratio)w=Math.round(h*ratio);else h=Math.round(w/ratio);}
    const rotated=slug==="image-rotate"&&[90,270].includes(Number(options.option));canvas.width=rotated?h:w;canvas.height=rotated?w:h;
    const ctx=canvas.getContext("2d");if(!ctx)throw new Error(messages.errors.canvas);
    if(["png-to-jpg","webp-to-jpg","heic-to-jpg"].includes(slug)){ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);}
    ctx.filter=slug==="image-grayscale"?"grayscale(1)":slug==="image-brightness"?`brightness(${options.amount}%)`:slug==="image-contrast"?`contrast(${options.amount}%)`:slug==="image-blur"?`blur(${Math.max(0,options.amount/10)}px)`:"none";
    ctx.save();
    if(slug==="image-rotate"){ctx.translate(canvas.width/2,canvas.height/2);ctx.rotate(Number(options.option)*Math.PI/180);ctx.drawImage(bitmap,-w/2,-h/2,w,h);}
    else if(slug==="image-flip"){ctx.translate(options.option==="vertical"?0:canvas.width,options.option==="vertical"?canvas.height:0);ctx.scale(options.option==="vertical"?1:-1,options.option==="vertical"?-1:1);ctx.drawImage(bitmap,0,0,w,h);}
    else if(slug==="image-crop")ctx.drawImage(bitmap,(bitmap.width-w)/2,(bitmap.height-h)/2,w,h,0,0,w,h);
    else if(slug==="social-image-resize"){const ratio=Math.max(w/bitmap.width,h/bitmap.height),sw=w/ratio,sh=h/ratio;ctx.drawImage(bitmap,(bitmap.width-sw)/2,(bitmap.height-sh)/2,sw,sh,0,0,w,h);}
    else if(slug==="image-pixelate"){const sw=Math.max(1,Math.round(w/Math.max(4,options.amount))),sh=Math.max(1,Math.round(h/Math.max(4,options.amount)));const small=document.createElement("canvas");small.width=sw;small.height=sh;small.getContext("2d")?.drawImage(bitmap,0,0,sw,sh);ctx.imageSmoothingEnabled=false;ctx.drawImage(small,0,0,w,h);small.width=0;small.height=0;}
    else ctx.drawImage(bitmap,0,0,w,h);
    if(slug==="add-text-to-image"){const caption=(options.text??"").trim();if(!caption)throw new Error(messages.errors.noContent);ctx.font=`bold ${Math.max(18,Math.round(Math.min(w,h)*0.06))}px sans-serif`;ctx.textAlign="center";ctx.textBaseline="bottom";ctx.lineWidth=Math.max(3,Math.round(Math.min(w,h)*0.008));ctx.strokeStyle="#000";ctx.fillStyle="#fff";ctx.strokeText(caption,w/2,h-Math.max(16,h*0.04),w*0.9);ctx.fillText(caption,w/2,h-Math.max(16,h*0.04),w*0.9);}
    ctx.restore();const outWidth=canvas.width,outHeight=canvas.height;
    try{const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob((value)=>value?resolve(value):reject(new Error(messages.errors.imageOutput)),outputMime(slug),options.quality));return{blob,result:`${messages.completedStatus} ${(blob.size/1024).toFixed(1)} KB · ${outWidth} × ${outHeight}px`};}
    finally{canvas.width=0;canvas.height=0;}
  }finally{bitmap.close();}
}

async function splitImageGrid(bitmap:ImageBitmap,tileCount:number):Promise<ProcessedImage>{
  if(![3,6,9].includes(tileCount))throw new Error("Choose 3, 6, or 9 tiles.");
  const columns=3,rows=tileCount/columns,targetRatio=columns/rows,sourceRatio=bitmap.width/bitmap.height;
  const cropWidth=sourceRatio>targetRatio?bitmap.height*targetRatio:bitmap.width,cropHeight=sourceRatio>targetRatio?bitmap.height:bitmap.width/targetRatio;
  const left=(bitmap.width-cropWidth)/2,top=(bitmap.height-cropHeight)/2,tileWidth=cropWidth/columns,tileHeight=cropHeight/rows,size=Math.max(1,Math.floor(Math.min(tileWidth,tileHeight)));
  const {zip}=await import("fflate");const files:Record<string,Uint8Array>={};let total=0;
  for(let row=0;row<rows;row++)for(let column=0;column<columns;column++){const canvas=document.createElement("canvas");canvas.width=size;canvas.height=size;const ctx=canvas.getContext("2d");if(!ctx)throw new Error("Could not start image processing.");ctx.drawImage(bitmap,left+column*tileWidth,top+row*tileHeight,tileWidth,tileHeight,0,0,size,size);const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error("Could not export a tile.")),"image/png"));canvas.width=0;canvas.height=0;total+=blob.size;if(total>80*1024*1024)throw new Error("The generated tiles exceed the 80 MB browser limit.");files[`tile-${String(row*columns+column+1).padStart(2,"0")}.png`]=new Uint8Array(await blob.arrayBuffer());}
  const data=await new Promise<Uint8Array>((resolve,reject)=>zip(files,{level:2},(error,result)=>error?reject(error):resolve(result)));const buffer=new ArrayBuffer(data.byteLength);new Uint8Array(buffer).set(data);return{blob:new Blob([buffer],{type:"application/zip"}),result:`${tileCount} square PNG tiles · ${size} × ${size}px`};
}

function outputMime(slug:string){if(slug.includes("png")||slug==="favicon-generator")return"image/png";if(slug.includes("webp"))return"image/webp";return"image/jpeg";}
