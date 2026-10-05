import type { PDFDocument as PdfDocumentType } from "pdf-lib";

const MAX_PDF=50*1024*1024;
export type ProcessedPdf={result:string;blob?:Blob};

export async function processPdf(slug:string,files:File[],option:string,text:string):Promise<ProcessedPdf>{
  if(slug==="images-to-pdf")return imagesToPdf(files);
  if(!files.length)throw new Error("먼저 PDF 파일을 선택해 주세요.");
  if(files.reduce((sum,file)=>sum+file.size,0)>MAX_PDF)throw new Error("선택한 파일의 총 크기가 50MB를 초과합니다.");
  const {PDFDocument,StandardFonts,degrees,rgb}=await import("pdf-lib");
  const docs=await Promise.all(files.map(async(file)=>PDFDocument.load(await file.arrayBuffer())));
  if(slug==="pdf-metadata-viewer"){const pdf=docs[0];return{result:`제목: ${pdf.getTitle()||"(없음)"}\n작성자: ${pdf.getAuthor()||"(없음)"}\n주제: ${pdf.getSubject()||"(없음)"}\n키워드: ${pdf.getKeywords()||"(없음)"}\n페이지 수: ${pdf.getPageCount()}\n생성 앱: ${pdf.getCreator()||"(없음)"}`};}
  let output:PdfDocumentType;
  if(slug==="pdf-merge"){
    output=await PDFDocument.create();for(const doc of docs)for(const page of await output.copyPages(doc,doc.getPageIndices()))output.addPage(page);
  }else{
    output=docs[0];const count=output.getPageCount();
    if(slug==="pdf-split"||slug==="pdf-delete-pages"){
      const selected=parsePageList(option,count);const keep=slug==="pdf-split"?selected:output.getPageIndices().filter((index)=>!selected.includes(index+1));
      if(!keep.length)throw new Error("선택한 페이지를 제외하면 문서가 비게 됩니다.");
      const next=await PDFDocument.create();for(const page of await next.copyPages(output,keep))next.addPage(page);output=next;
    }else if(slug==="pdf-reorder-pages"){
      const order=option.split(/[\s,]+/).filter(Boolean).map(Number).map((number)=>number-1);
      if(order.length!==count||order.some((index)=>!Number.isInteger(index)||index<0||index>=count))throw new Error(`전체 ${count}개 페이지 번호를 빠짐없이 입력해 주세요. 예: ${Array.from({length:count},(_,index)=>index+1).join(",")}`);
      const next=await PDFDocument.create();for(const page of await next.copyPages(output,order))next.addPage(page);output=next;
    }else if(slug==="pdf-rotate-pages")output.getPages().forEach((page)=>page.setRotation(degrees((page.getRotation().angle+Number(option))%360)));
    else if(slug==="pdf-add-page-numbers"||slug==="pdf-watermark"){
      const font=await output.embedFont(StandardFonts.Helvetica);
      output.getPages().forEach((page,index)=>{const{width,height}=page.getSize();const watermark=slug==="pdf-watermark";page.drawText(watermark?(text||"Woori Tools"):String(index+1),{x:watermark?width/2-50:width/2-4,y:watermark?height/2:24,size:watermark?30:11,font,color:rgb(.45,.45,.45),opacity:.35,rotate:watermark?degrees(-30):degrees(0)});});
    }else if(slug==="pdf-remove-metadata"){output.setTitle("");output.setAuthor("");output.setSubject("");output.setKeywords([]);output.setCreator("");output.setProducer("");}
  }
  const bytes=await output.save();return{blob:new Blob([bytes as BlobPart],{type:"application/pdf"}),result:`완료: ${output.getPageCount()}페이지 PDF`};
}

async function imagesToPdf(files:File[]):Promise<ProcessedPdf>{
  if(!files.length)throw new Error("이미지를 한 장 이상 선택해 주세요.");
  if(files.reduce((sum,file)=>sum+file.size,0)>MAX_PDF)throw new Error("선택한 파일의 총 크기가 50MB를 초과합니다.");
  const{PDFDocument}=await import("pdf-lib");const pdf=await PDFDocument.create();
  for(const file of files){const bitmap=await createImageBitmap(file);if(bitmap.width*bitmap.height>40_000_000){bitmap.close();throw new Error("이미지 해상도가 너무 커 안전하게 처리하기 어렵습니다.");}const canvas=document.createElement("canvas");canvas.width=bitmap.width;canvas.height=bitmap.height;canvas.getContext("2d")?.drawImage(bitmap,0,0);bitmap.close();const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob((value)=>value?resolve(value):reject(new Error("이미지를 PDF로 변환하지 못했습니다.")),"image/png"));canvas.width=0;canvas.height=0;const image=await pdf.embedPng(await blob.arrayBuffer());const page=pdf.addPage([image.width,image.height]);page.drawImage(image,{x:0,y:0,width:image.width,height:image.height});}
  const bytes=await pdf.save();return{blob:new Blob([bytes as BlobPart],{type:"application/pdf"}),result:`완료: ${pdf.getPageCount()}페이지 PDF`};
}

function parsePageList(input:string,count:number){const pages=input.split(",").flatMap((part)=>{const[first,last]=part.trim().split("-").map(Number);if(!Number.isInteger(first)||first<1||first>count||last!==undefined&&(!Number.isInteger(last)||last<first||last>count))throw new Error(`페이지 범위를 1부터 ${count} 사이로 입력해 주세요.`);return last===undefined?[first]:Array.from({length:last-first+1},(_,index)=>first+index);});if(!pages.length)throw new Error("페이지 번호 또는 범위를 입력해 주세요.");return[...new Set(pages)];}
