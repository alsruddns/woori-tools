"use client";

import { useEffect, useMemo, useState } from "react";
import NextImage from "next/image";
import type { ToolDefinition } from "@/registry/tools";
import { processImage as processImageFile } from "@/lib/image/process-image";
import { processPdf as processPdfFile } from "@/lib/pdf/process-pdf";
import { processText as processTextTool } from "@/lib/text/process-text";

const MAX_IMAGE = 30 * 1024 * 1024;
const MAX_PDF = 50 * 1024 * 1024;

export function ToolWorkspace({ tool }: { tool: ToolDefinition }) {
  const isImage = tool.category === "image";
  const isPdf = tool.category === "pdf" || tool.slug === "images-to-pdf";
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [secondText, setSecondText] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [quality, setQuality] = useState(0.82);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [keepRatio, setKeepRatio] = useState(true);
  const [amount, setAmount] = useState(25);
  const [option, setOption] = useState(defaultOption(tool.slug));
  const [outputUrl, setOutputUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    return () => { if (outputUrl) URL.revokeObjectURL(outputUrl); };
  }, [outputUrl]);
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const fileName = useMemo(() => {
    if (!files[0]) return "download";
    const stem = files[0].name.replace(/\.[^.]+$/, "").replace(/[\\/:*?"<>|]/g, "-");
    return stem || "download";
  }, [files]);

  function selectFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);
    const limit = isImage ? MAX_IMAGE : MAX_PDF;
    const bad = incoming.find((file) => file.size > limit);
    if (bad) { setError(`파일이 너무 커 브라우저에서 안전하게 처리하기 어렵습니다. (최대 ${isImage ? 30 : 50}MB)`); return; }
    const valid = incoming.filter((file) => isImage ? (/^image\//.test(file.type) || /\.heic$/i.test(file.name)) : (file.type === "application/pdf" || /\.pdf$/i.test(file.name)));
    if (valid.length !== incoming.length) { setError(isImage ? "이미지 파일만 선택할 수 있습니다." : "PDF 파일만 선택할 수 있습니다."); return; }
    const selected = (isPdf && tool.slug !== "pdf-split" && tool.slug !== "pdf-delete-pages" && tool.slug !== "pdf-rotate-pages" && tool.slug !== "pdf-add-page-numbers" && tool.slug !== "pdf-watermark" && tool.slug !== "pdf-metadata-viewer" && tool.slug !== "pdf-remove-metadata") ? valid : valid.slice(0, 1);
    setFiles(selected);
    setPreviewUrl(selected[0] && isImage && !/\.heic$/i.test(selected[0].name) ? URL.createObjectURL(selected[0]) : "");
    setError(""); setResult(""); setOutputUrl("");
  }

  async function process() {
    setError(""); setResult(""); setOutputUrl(""); setBusy(true);
    try {
      if (isImage && tool.slug !== "images-to-pdf") await processImage();
      else if (isPdf) await processPdf();
      else await processText();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "처리할 수 없습니다. 입력이나 파일을 확인해 주세요.");
    } finally { setBusy(false); }
  }

  async function processImage() {
    const file=files[0]; if(!file) throw new Error("먼저 이미지 파일을 선택해 주세요.");
    const processed=await processImageFile(tool.slug,file,{quality,width,height,keepRatio,amount,option});
    if(processed.blob) setOutputUrl(URL.createObjectURL(processed.blob));
    setResult(processed.result);
  }

  async function processPdf() {
    const processed=await processPdfFile(tool.slug,files,option,text);
    if(processed.blob) setOutputUrl(URL.createObjectURL(processed.blob));
    setResult(processed.result);
  }

  async function processText() {
    const processed=await processTextTool(tool.slug,text,secondText,option,amount);
    if(processed.download) setOutputUrl(URL.createObjectURL(processed.download));
    setResult(processed.result);
  }
  const needsFiles=isImage||isPdf;
  const needsSecond=tool.slug==="text-compare";
  return <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-label={`${tool.title} 작업 영역`}>
    <p className="mb-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">🔒 파일은 서버에 업로드되지 않고 브라우저에서 직접 처리됩니다.</p>
    {needsFiles ? <div>
      <label htmlFor="tool-files" onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>{e.preventDefault();selectFiles(e.dataTransfer.files);}} className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:border-indigo-400"><span className="font-semibold text-slate-800">파일을 여기에 놓거나 클릭해서 선택</span><span className="mt-2 text-sm text-slate-500">최대 파일 크기 {isImage?"30":"50"}MB · 선택 순서대로 처리</span></label>
      <input id="tool-files" type="file" accept={isImage?"image/*,.heic,.heif":"application/pdf,.pdf"} multiple={tool.slug==="pdf-merge"||tool.slug==="images-to-pdf"} onChange={(e)=>selectFiles(e.target.files)} className="sr-only" />
      {files.length>0&&<div className="mt-4 rounded-xl bg-slate-50 p-4"><ul className="space-y-2">{files.map((file,i)=><li key={`${file.name}-${i}`} className="flex justify-between gap-3 text-sm"><span className="truncate">{file.name}</span><span className="shrink-0 text-slate-500">{(file.size/1024/1024).toFixed(2)} MB</span></li>)}</ul><button type="button" onClick={()=>{setFiles([]);setPreviewUrl("");setResult("");setOutputUrl("");}} className="mt-3 text-sm font-medium text-rose-700 underline">선택 초기화</button></div>}
      {previewUrl&&tool.slug!=="image-color-picker"&&<NextImage unoptimized src={previewUrl} alt="선택한 이미지 미리보기" width={960} height={600} className="mt-4 max-h-72 max-w-full rounded-xl border border-slate-200 object-contain" />}
      {previewUrl&&tool.slug==="image-color-picker"&&<div className="mt-4"><p className="mb-2 text-sm">이미지를 눌러 색상을 확인하세요.</p><ColorPicker src={previewUrl} onPick={setResult}/></div>}
    </div> : <div className="grid gap-4 sm:grid-cols-2">
      <div><label htmlFor="input-text" className="mb-2 block text-sm font-medium">{needsSecond?"첫 번째 텍스트":"입력"}</label><textarea id="input-text" value={text} onChange={(e)=>setText(e.target.value)} rows={9} placeholder={tool.slug==="timestamp-converter"?"Unix timestamp 또는 ISO 8601 날짜 입력":"여기에 텍스트를 입력하세요"} className="w-full rounded-xl border border-slate-300 p-3 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />{tool.slug==="timestamp-converter"&&<p className="mt-2 text-xs text-slate-500">날짜·시간 옵션은 브라우저 현지 시간 기준으로 해석합니다. 결과에 현지 시간과 UTC를 함께 표시합니다.</p>}</div>
      {needsSecond&&<div><label htmlFor="second-text" className="mb-2 block text-sm font-medium">두 번째 텍스트</label><textarea id="second-text" value={secondText} onChange={(e)=>setSecondText(e.target.value)} rows={9} className="w-full rounded-xl border border-slate-300 p-3 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" /></div>}
    </div>}
    <ToolOptions tool={tool} {...{quality,setQuality,width,setWidth,height,setHeight,keepRatio,setKeepRatio,amount,setAmount,option,setOption,text,setText}} />
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={process} disabled={busy} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">{busy?"처리 중…":tool.category==="image"||tool.category==="pdf"?"처리하기":"실행"}</button><button type="button" onClick={()=>{setText("");setSecondText("");setResult("");setOutputUrl("");setError("");}} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium hover:bg-slate-50">초기화</button></div>
    <p role="status" aria-live="polite" className="sr-only">{busy?"처리 중입니다.":result?"처리가 완료되었습니다.":""}</p>
    {error&&<p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {result&&<div className="mt-5"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold">결과</h3>{outputUrl&&<a href={outputUrl} download={downloadName(tool.slug,fileName)} className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">다운로드</a>}{!needsFiles&&<button type="button" onClick={()=>void navigator.clipboard.writeText(result)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium hover:bg-slate-50">복사</button>}</div><pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{result}</pre></div>}
  </section>;
}

function ToolOptions({tool,quality,setQuality,width,setWidth,height,setHeight,keepRatio,setKeepRatio,amount,setAmount,option,setOption,text,setText}:{tool:ToolDefinition;quality:number;setQuality:(v:number)=>void;width:number;setWidth:(v:number)=>void;height:number;setHeight:(v:number)=>void;keepRatio:boolean;setKeepRatio:(v:boolean)=>void;amount:number;setAmount:(v:number)=>void;option:string;setOption:(v:string)=>void;text:string;setText:(v:string)=>void}) {
  const slug=tool.slug;
  if (["image-compress","jpg-to-webp","png-to-webp","png-to-jpg","webp-to-jpg","heic-to-jpg"].includes(slug)) return <label className="mt-5 block text-sm">품질: {Math.round(quality*100)}% <input type="range" min="0.2" max="1" step="0.01" value={quality} onChange={(e)=>setQuality(Number(e.target.value))} className="mt-2 block w-full accent-indigo-600" /></label>;
  if (slug==="image-resize") return <div className="mt-5 flex flex-wrap items-end gap-4"><label className="text-sm">너비 (px)<input type="number" min="1" max="12000" value={width} onChange={(e)=>setWidth(Number(e.target.value))} className="mt-1 block w-28 rounded-lg border p-2" /></label><label className="text-sm">높이 (px)<input type="number" min="1" max="12000" value={height} onChange={(e)=>setHeight(Number(e.target.value))} disabled={keepRatio} className="mt-1 block w-28 rounded-lg border p-2 disabled:bg-slate-100" /></label><label className="flex min-h-10 items-center gap-2 text-sm"><input type="checkbox" checked={keepRatio} onChange={(e)=>setKeepRatio(e.target.checked)} />비율 유지</label></div>;
  if (slug==="image-rotate") return <SelectOption label="회전 각도" value={option} onChange={setOption} options={[["90","90°"],["180","180°"],["270","270°"]]} />;
  if (slug==="image-flip") return <SelectOption label="뒤집기 방향" value={option} onChange={setOption} options={[["horizontal","가로"],["vertical","세로"]]} />;
  if (slug==="image-crop") return <SelectOption label="자르기 비율 (가로/세로)" value={option} onChange={setOption} options={[["1","정사각형 1:1"],["1.7778","가로 16:9"],["0.75","세로 3:4"]]} />;
  if (["image-brightness","image-contrast","image-blur","image-pixelate"].includes(slug)) return <label className="mt-5 block text-sm">{slug==="image-brightness"?"밝기":slug==="image-contrast"?"대비":slug==="image-blur"?"흐림": "모자이크 크기"}: {amount}<input type="range" min={slug==="image-blur"?0:slug==="image-pixelate"?4:0} max={slug==="image-blur"?100:slug==="image-pixelate"?80:200} value={amount} onChange={(e)=>setAmount(Number(e.target.value))} className="mt-2 block w-full accent-indigo-600" /></label>;
  if (["remove-spaces","sort-lines","text-case-converter","json-formatter","base64","url-encode-decode","timestamp-converter"].includes(slug)) {
    const opts=slug==="remove-spaces"?[["all","모든 공백 제거"],["collapse","연속 공백 정리"]]:slug==="sort-lines"?[["asc","오름차순"],["desc","내림차순"]]:slug==="text-case-converter"?[["lower","소문자"],["upper","대문자"],["title","Title Case"]]:slug==="json-formatter"?[["format","보기 좋게 정렬"],["minify","압축"]]:slug==="base64"?[["encode","인코딩"],["decode","디코딩"]]:slug==="url-encode-decode"?[["encode","인코딩"],["decode","디코딩"]]:[["seconds","Unix 초"],["milliseconds","Unix 밀리초"],["date","날짜 입력"]];
    return <SelectOption label="옵션" value={option} onChange={setOption} options={opts as [string,string][]} />;
  }
  if (slug==="uuid-generator") return <label className="mt-4 block text-sm">생성 개수<input type="number" min="1" max="100" value={amount} onChange={(e)=>setAmount(Number(e.target.value))} className="ml-3 w-24 rounded-lg border p-2" /></label>;
  if (["pdf-split","pdf-delete-pages"].includes(slug)) return <label className="mt-4 block text-sm">페이지 번호 또는 범위 (예: 1, 3-5)<input value={option} onChange={(e)=>setOption(e.target.value)} placeholder="1, 3-5" className="mt-1 block w-full rounded-lg border p-3" /></label>;
  if (slug==="pdf-reorder-pages") return <label className="mt-4 block text-sm">새 페이지 순서 (예: 3,1,2)<input value={option} onChange={(e)=>setOption(e.target.value)} placeholder="페이지 번호 순서" className="mt-1 block w-full rounded-lg border p-3" /></label>;
  if (slug==="pdf-rotate-pages") return <SelectOption label="회전 각도" value={option} onChange={setOption} options={[["90","90°"],["180","180°"],["270","270°"]]} />;
  if (slug==="pdf-watermark") return <label className="mt-4 block text-sm">워터마크 문구<input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Woori Tools" className="mt-1 block w-full rounded-lg border p-3" /></label>;
  if (slug==="uuid-generator") return null;
  return null;
}
function SelectOption({label,value,onChange,options}:{label:string;value:string;onChange:(v:string)=>void;options:[string,string][]}){return <label className="mt-4 block text-sm">{label}<select value={value} onChange={(e)=>onChange(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-3">{options.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>;}
function defaultOption(slug:string){return slug==="image-rotate"||slug==="pdf-rotate-pages"?"90":slug==="image-flip"?"horizontal":slug==="image-crop"?"1":slug==="sort-lines"?"asc":slug==="text-case-converter"?"lower":slug==="json-formatter"?"format":slug==="base64"||slug==="url-encode-decode"?"encode":slug==="timestamp-converter"?"seconds":slug==="remove-spaces"?"all":"";}
function downloadName(slug:string,stem:string){if(slug==="images-to-pdf"||slug.startsWith("pdf-"))return`${stem}-${slug==="pdf-merge"?"merged":"processed"}.pdf`;const extension=slug.includes("png")||slug==="favicon-generator"?"png":slug.includes("webp")?"webp":"jpg";return`${stem}-${slug}.${extension}`;}
function ColorPicker({src,onPick}:{src:string;onPick:(v:string)=>void}){return <canvas aria-label="이미지 색상 추출 캔버스" ref={(canvas)=>{if(!canvas)return;const img=new Image();img.onload=()=>{const scale=Math.min(1,800/img.width);canvas.width=img.width*scale;canvas.height=img.height*scale;canvas.getContext("2d")?.drawImage(img,0,0,canvas.width,canvas.height);};img.src=src;}} onClick={(e)=>{const canvas=e.currentTarget,rect=canvas.getBoundingClientRect(),x=Math.floor((e.clientX-rect.left)*canvas.width/rect.width),y=Math.floor((e.clientY-rect.top)*canvas.height/rect.height),data=canvas.getContext("2d")?.getImageData(x,y,1,1).data;if(data){const hex=`#${[data[0],data[1],data[2]].map((n)=>n.toString(16).padStart(2,"0")).join("").toUpperCase()}`;onPick(`${hex} · RGB(${data[0]}, ${data[1]}, ${data[2]})`);}}} className="max-h-96 max-w-full cursor-crosshair rounded-lg" />;}
