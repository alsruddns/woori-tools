import type { PDFDocument as PdfDocumentType } from "pdf-lib";
import { getMessages } from "@/i18n/messages";
import type { Locale } from "@/i18n/routing";

const MAX_PDF=50*1024*1024;
export type ProcessedPdf={result:string;blob?:Blob};

export async function processPdf(slug:string,files:File[],option:string,text:string,locale:Locale="ko"):Promise<ProcessedPdf>{
  const messages=getMessages(locale);
  if(slug==="images-to-pdf")return imagesToPdf(files,locale);
  if(!files.length)throw new Error(messages.errors.noPdf);
  if(files.reduce((sum,file)=>sum+file.size,0)>MAX_PDF)throw new Error(messages.errors.pdfTotal);
  const {PDFDocument,StandardFonts,degrees,rgb}=await import("pdf-lib");
  let docs;
  try { docs=await Promise.all(files.map(async(file)=>PDFDocument.load(await file.arrayBuffer()))); }
  catch { throw new Error(messages.errors.invalidPdf); }
  if(slug==="pdf-metadata-viewer"){const pdf=docs[0];return{result:`${messages.title}: ${pdf.getTitle()||"(—)"}\n${messages.author}: ${pdf.getAuthor()||"(—)"}\n${messages.subject}: ${pdf.getSubject()||"(—)"}\n${messages.keywords}: ${pdf.getKeywords()||"(—)"}\n${messages.pageCount}: ${pdf.getPageCount()}\n${messages.creator}: ${pdf.getCreator()||"(—)"}`};}
  let output:PdfDocumentType;
  if(slug==="pdf-merge"){
    output=await PDFDocument.create();for(const doc of docs)for(const page of await output.copyPages(doc,doc.getPageIndices()))output.addPage(page);
  }else{
    output=docs[0];const count=output.getPageCount();
    if(slug==="pdf-split"||slug==="pdf-delete-pages"){
      const selected=parsePageList(option,count,messages.errors.invalidPage);const keep=slug==="pdf-split"?selected:output.getPageIndices().filter((index)=>!selected.includes(index+1));
      if(!keep.length)throw new Error(messages.errors.emptyPdf);
      const next=await PDFDocument.create();for(const page of await next.copyPages(output,keep))next.addPage(page);output=next;
    }else if(slug==="pdf-reorder-pages"){
      const order=option.split(/[\s,]+/).filter(Boolean).map(Number).map((number)=>number-1);
      if(order.length!==count||order.some((index)=>!Number.isInteger(index)||index<0||index>=count))throw new Error(`${messages.errors.pageOrder} (${Array.from({length:count},(_,index)=>index+1).join(",")})`);
      const next=await PDFDocument.create();for(const page of await next.copyPages(output,order))next.addPage(page);output=next;
    }else if(slug==="pdf-rotate-pages")output.getPages().forEach((page)=>page.setRotation(degrees((page.getRotation().angle+Number(option))%360)));
    else if(slug==="pdf-add-page-numbers"||slug==="pdf-watermark"){
      const font=await output.embedFont(StandardFonts.Helvetica);
      output.getPages().forEach((page,index)=>{const{width,height}=page.getSize();const watermark=slug==="pdf-watermark";page.drawText(watermark?(text||"Woori Tools"):String(index+1),{x:watermark?width/2-50:width/2-4,y:watermark?height/2:24,size:watermark?30:11,font,color:rgb(.45,.45,.45),opacity:.35,rotate:watermark?degrees(-30):degrees(0)});});
    }else if(slug==="pdf-remove-metadata"){output.setTitle("");output.setAuthor("");output.setSubject("");output.setKeywords([]);output.setCreator("");output.setProducer("");}
  }
  const bytes=await output.save();return{blob:new Blob([bytes as BlobPart],{type:"application/pdf"}),result:`${messages.completedStatus} ${output.getPageCount()} · ${messages.pageCount} PDF`};
}

async function imagesToPdf(files:File[],locale:Locale):Promise<ProcessedPdf>{
  const messages=getMessages(locale);
  if(!files.length)throw new Error(messages.errors.noImages);
  if(files.reduce((sum,file)=>sum+file.size,0)>MAX_PDF)throw new Error(messages.errors.pdfTotal);
  const{PDFDocument}=await import("pdf-lib");const pdf=await PDFDocument.create();
  for(const file of files){const bitmap=await createImageBitmap(file);if(bitmap.width*bitmap.height>40_000_000){bitmap.close();throw new Error(messages.errors.pixels);}const canvas=document.createElement("canvas");canvas.width=bitmap.width;canvas.height=bitmap.height;canvas.getContext("2d")?.drawImage(bitmap,0,0);bitmap.close();const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob((value)=>value?resolve(value):reject(new Error(messages.errors.invalidImage)),"image/png"));canvas.width=0;canvas.height=0;const image=await pdf.embedPng(await blob.arrayBuffer());const page=pdf.addPage([image.width,image.height]);page.drawImage(image,{x:0,y:0,width:image.width,height:image.height});}
  const bytes=await pdf.save();return{blob:new Blob([bytes as BlobPart],{type:"application/pdf"}),result:`${messages.completedStatus} ${pdf.getPageCount()} · ${messages.pageCount} PDF`};
}

function parsePageList(input:string,count:number,errorMessage:string){const pages=input.split(",").flatMap((part)=>{const[first,last]=part.trim().split("-").map(Number);if(!Number.isInteger(first)||first<1||first>count||last!==undefined&&(!Number.isInteger(last)||last<first||last>count))throw new Error(`${errorMessage} (1–${count})`);return last===undefined?[first]:Array.from({length:last-first+1},(_,index)=>first+index);});if(!pages.length)throw new Error(errorMessage);return[...new Set(pages)];}
