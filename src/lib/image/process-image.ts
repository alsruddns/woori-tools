export type ImageOptions = { quality:number;width:number;height:number;keepRatio:boolean;amount:number;option:string };
export type ProcessedImage = { result:string;blob?:Blob };

const MAX_PIXELS=40_000_000;

export async function processImage(slug:string,file:File,options:ImageOptions):Promise<ProcessedImage>{
  if(file.size>30*1024*1024)throw new Error("파일이 너무 커 브라우저에서 안전하게 처리하기 어렵습니다. (최대 30MB)");
  let source:Blob=file;
  if(/\.heic$/i.test(file.name)||file.type==="image/heic"||file.type==="image/heif"){
    const heic2any=(await import("heic2any")).default;
    const converted=await heic2any({blob:file,toType:"image/jpeg",quality:options.quality});
    source=Array.isArray(converted)?converted[0]:converted;
  }
  const bitmap=await createImageBitmap(source);
  try{
    if(bitmap.width*bitmap.height>MAX_PIXELS)throw new Error("이미지 해상도가 너무 커 브라우저에서 안전하게 처리하기 어렵습니다.");
    if(slug==="image-info")return{result:`파일명: ${file.name}\nMIME: ${file.type||"알 수 없음"}\n너비: ${bitmap.width}px\n높이: ${bitmap.height}px\n용량: ${(file.size/1024).toFixed(1)} KB\n비율: ${(bitmap.width/bitmap.height).toFixed(3)}:1`};
    const canvas=document.createElement("canvas");let w=bitmap.width,h=bitmap.height;
    if(slug==="favicon-generator"){w=32;h=32;}
    if(slug==="image-resize"){w=Math.max(1,Math.min(12000,Number(options.width)||1));h=options.keepRatio?Math.max(1,Math.round(w*bitmap.height/bitmap.width)):Math.max(1,Math.min(12000,Number(options.height)||1));}
    if(slug==="image-crop"){const ratio=Number(options.option)||1;if(w/h>ratio)w=Math.round(h*ratio);else h=Math.round(w/ratio);}
    const rotated=slug==="image-rotate"&&[90,270].includes(Number(options.option));canvas.width=rotated?h:w;canvas.height=rotated?w:h;
    const ctx=canvas.getContext("2d");if(!ctx)throw new Error("이미지 처리를 시작할 수 없습니다.");
    if(["png-to-jpg","webp-to-jpg","heic-to-jpg"].includes(slug)){ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);}
    ctx.filter=slug==="image-grayscale"?"grayscale(1)":slug==="image-brightness"?`brightness(${options.amount}%)`:slug==="image-contrast"?`contrast(${options.amount}%)`:slug==="image-blur"?`blur(${Math.max(0,options.amount/10)}px)`:"none";
    ctx.save();
    if(slug==="image-rotate"){ctx.translate(canvas.width/2,canvas.height/2);ctx.rotate(Number(options.option)*Math.PI/180);ctx.drawImage(bitmap,-w/2,-h/2,w,h);}
    else if(slug==="image-flip"){ctx.translate(options.option==="vertical"?0:canvas.width,options.option==="vertical"?canvas.height:0);ctx.scale(options.option==="vertical"?1:-1,options.option==="vertical"?-1:1);ctx.drawImage(bitmap,0,0,w,h);}
    else if(slug==="image-crop")ctx.drawImage(bitmap,(bitmap.width-w)/2,(bitmap.height-h)/2,w,h,0,0,w,h);
    else if(slug==="image-pixelate"){const sw=Math.max(1,Math.round(w/Math.max(4,options.amount))),sh=Math.max(1,Math.round(h/Math.max(4,options.amount)));const small=document.createElement("canvas");small.width=sw;small.height=sh;small.getContext("2d")?.drawImage(bitmap,0,0,sw,sh);ctx.imageSmoothingEnabled=false;ctx.drawImage(small,0,0,w,h);small.width=0;small.height=0;}
    else ctx.drawImage(bitmap,0,0,w,h);
    ctx.restore();const outWidth=canvas.width,outHeight=canvas.height;
    try{const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob((value)=>value?resolve(value):reject(new Error("이 브라우저에서 해당 이미지 형식을 만들지 못했습니다.")),outputMime(slug),options.quality));return{blob,result:`완료: ${(blob.size/1024).toFixed(1)} KB · ${outWidth} × ${outHeight}px`};}
    finally{canvas.width=0;canvas.height=0;}
  }finally{bitmap.close();}
}

function outputMime(slug:string){if(slug.includes("png")||slug==="favicon-generator")return"image/png";if(slug.includes("webp"))return"image/webp";return"image/jpeg";}
