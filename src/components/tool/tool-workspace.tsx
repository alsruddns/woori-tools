"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import NextImage from "next/image";
import type { ToolDefinition } from "@/registry/tools";
import { targetLocalePublication } from "@/registry/target-locale-publication";
import type { Dictionary } from "@/i18n/messages";
import { isLocale, isPlannedLocale, isPublishedTargetLocale, isTargetLocale, type RouteLocale, type TargetLocale } from "@/i18n/routing";
import { targetCoreMessages } from "@/i18n/target-locale-copy";
import { isTargetPageMessageLocale } from "@/i18n/target-page-messages";
import { getTargetFileProcessorCopy } from "@/i18n/target-file-processor-copy";
import { getTargetImageCollageCopy } from "@/i18n/target-image-collage-copy";
import { getTargetRandomProcessorCopy } from "@/i18n/target-random-processor-copy";
import { processImage as processImageFile } from "@/lib/image/process-image";
import { processPdf as processPdfFile } from "@/lib/pdf/process-pdf";
import { processText as processTextTool } from "@/lib/text/process-text";
import { parseRenameOptions, renameFileNames } from "@/lib/file-renamer.mjs";
import { copyText } from "@/lib/copy-to-clipboard";
import { CountdownWorkspace } from "@/components/tool/countdown-workspace";
import { WorldClockWorkspace } from "@/components/tool/world-clock-workspace";
import { QrWorkspace } from "@/components/tool/qr-workspace";
import { MarkdownWorkspace } from "@/components/tool/markdown-workspace";
import { BarcodeWorkspace } from "@/components/tool/barcode-workspace";
import { PolishRegexWorkspace } from "@/components/tool/polish-regex-workspace";
import { PolishChinaToolsWorkspace } from "@/components/tool/polish-china-tools-workspace";
import type { RussianChinaSlug } from "@/components/tool/russian-china-tools-workspace";
import { PolishIndiaToolsWorkspace } from "@/components/tool/polish-india-tools-workspace";
import type { RussianIndiaSlug } from "@/components/tool/russian-india-tools-workspace";
import { PolishGermanyToolsWorkspace } from "@/components/tool/polish-germany-tools-workspace";
import type { PolishGermanySlug } from "@/components/tool/polish-germany-tools-workspace";
import { PolishWesternEuropeToolsWorkspace } from "@/components/tool/polish-western-europe-tools-workspace";
import type { PolishWesternEuropeSlug } from "@/components/tool/polish-western-europe-tools-workspace";
import { PolishBrazilToolsWorkspace } from "@/components/tool/polish-brazil-tools-workspace";
import type { PolishBrazilSlug } from "@/components/tool/polish-brazil-tools-workspace";
import { PolishFinalCountryToolsWorkspace } from "@/components/tool/polish-final-country-tools-workspace";
import type { PolishFinalCountrySlug } from "@/components/tool/polish-final-country-tools-workspace";
import { PolishNorthAmericaToolsWorkspace } from "@/components/tool/polish-north-america-tools-workspace";
import type { PolishNorthAmericaSlug } from "@/components/tool/polish-north-america-tools-workspace";
import { RandomStringWorkspace } from "@/components/tool/random-string-workspace";
import { LadderWorkspace } from "@/components/tool/ladder-workspace";
import { DailyFortuneWorkspace, TarotWorkspace } from "@/components/tool/fortune-workspace";
import { SajuWorkspace } from "@/components/tool/saju-workspace";
import { JapanToolsWorkspace } from "@/components/tool/japan-tools-workspace";
import { COUNTRY_TOOL_SLUGS } from "@/lib/country-tool-slugs";
import { getRenameCopy, getTargetToolOptionLabel, isPlannedToolOptionLocale, selectionCopy, targetSelectionLimitMessages, type ToolOptionLocale } from "@/registry/tool-option-copy";
import { BrowserDeveloperToolsWorkspace } from "@/components/tool/browser-developer-tools-workspace";
import { CoinFlipWorkspace, DiceWorkspace, LottoWorkspace, RandomNameWorkspace, RandomNumberWorkspace, RandomOrderWorkspace, RandomSeatWorkspace, RandomTeamWorkspace, RandomWheelWorkspace, RussianDutyPickerWorkspace } from "@/components/tool/special-random-workspaces";

const MAX_IMAGE = 30 * 1024 * 1024;
const MAX_PDF = 50 * 1024 * 1024;
type ToolWorkspaceLocale = TargetLocale;
function getWorkspaceUnavailableMessage(locale: ToolWorkspaceLocale): string {
  if (!isPlannedLocale(locale)) throw new Error(`Workspace locale ${locale} must be publishable or planned`);
  return targetCoreMessages[locale].workspaceUnavailable;
}
function getWorkspaceProcessorLocale(locale: ToolWorkspaceLocale): TargetLocale {
  if (isTargetLocale(locale)) return locale;
  throw new Error(`Unknown workspace locale: ${locale}`);
}
const CountryToolsWorkspace = dynamic(() => import("@/components/tool/country-tools-workspace").then((module) => module.CountryToolsWorkspace));
const selectionLimitMessages: Record<ToolOptionLocale, { files: string; images: string }> = {
  ko:{files:"파일은 최대 100개, 전체 용량은 200MB까지 선택할 수 있습니다.",images:"이미지는 최대 6개, 전체 용량은 100MB까지 선택할 수 있습니다."},
  en:{files:"Select up to 100 files and 200 MB total.",images:"Select up to 6 images and 100 MB total."},
  ja:{files:"ファイルは最大100件、合計200 MBまで選択できます。",images:"画像は最大6枚、合計100 MBまで選択できます。"},
  zh:{files:"最多可选择 100 个文件，总大小不超过 200 MB。",images:"最多可选择 6 张图片，总大小不超过 100 MB。"},
  es:{files:"Selecciona hasta 100 archivos y un total máximo de 200 MB.",images:"Selecciona hasta 6 imágenes y un total máximo de 100 MB."},
  "pt-br":{files:"Selecione até 100 arquivos, com no máximo 200 MB no total.",images:"Selecione até 6 imagens, com no máximo 100 MB no total."},
  de:{files:"Wähle bis zu 100 Dateien mit insgesamt höchstens 200 MB aus.",images:"Wähle bis zu 6 Bilder mit insgesamt höchstens 100 MB aus."},
  fr:{files:"Sélectionnez jusqu’à 100 fichiers, pour un total maximal de 200 Mo.",images:"Sélectionnez jusqu’à 6 images, pour un total maximal de 100 Mo."},
  vi:{files:"Chọn tối đa 100 tệp với tổng dung lượng không quá 200 MB.",images:"Chọn tối đa 6 ảnh với tổng dung lượng không quá 100 MB."},
  id:{files:"Pilih maksimal 100 file dengan total ukuran hingga 200 MB.",images:"Pilih maksimal 6 gambar dengan total ukuran hingga 100 MB."},
  th:{files:"เลือกไฟล์ได้สูงสุด 100 ไฟล์ รวมไม่เกิน 200 MB",images:"เลือกรูปภาพได้สูงสุด 6 รูป รวมไม่เกิน 100 MB"},
  "zh-tw":{files:"最多可選擇 100 個檔案，總大小不得超過 200 MB。",images:"最多可選擇 6 張圖片，總大小不得超過 100 MB。"},
  it:{files:"Seleziona fino a 100 file, per un totale massimo di 200 MB.",images:"Seleziona fino a 6 immagini, per un totale massimo di 100 MB."},
  nl:{files:"Selecteer maximaal 100 bestanden met in totaal maximaal 200 MB.",images:"Selecteer maximaal 6 afbeeldingen met in totaal maximaal 100 MB."},
  hi:{files:"अधिकतम 100 फ़ाइलें चुनें, जिनका कुल आकार 200 MB तक हो।",images:"अधिकतम 6 चित्र चुनें, जिनका कुल आकार 100 MB तक हो।"},
  ...targetSelectionLimitMessages,
};

export function ToolWorkspace({ tool, phaseLocale, optionLocale = phaseLocale, messages }: { tool: ToolDefinition; phaseLocale:ToolWorkspaceLocale; optionLocale?: ToolOptionLocale; messages: Dictionary }) {
  const specializedLocale: RouteLocale = phaseLocale === "pl" ? "en" : isLocale(phaseLocale) ? phaseLocale : "en";
  const expandedRandomWorkspace = isTargetPageMessageLocale(phaseLocale) && ["random-number", "random-name-picker", "draw-lots", "random-team-maker", "dice-roller", "coin-flip", "random-order", "random-seat"].includes(tool.slug);
  const randomWorkspaceCopy = isPlannedLocale(phaseLocale) ? getTargetRandomProcessorCopy(phaseLocale) : undefined;
  const targetCollageCopy = isPlannedLocale(phaseLocale) ? getTargetImageCollageCopy(phaseLocale) : undefined;
  const isImage = tool.category === "image";
  const isPdf = tool.category === "pdf" || tool.slug === "images-to-pdf";
  const isFileTool = ["file-hash","mime-type-checker","file-extension-checker","file-size-checker","duplicate-file-checker","zip-files","bulk-file-renamer","filename-cleaner"].includes(tool.slug);
  const inputlessExpandedRandom = expandedRandomWorkspace && ["dice-roller", "coin-flip"].includes(tool.slug);
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
  if (!isPublishedTargetLocale(phaseLocale) || (isPlannedLocale(phaseLocale) && !targetLocalePublication[phaseLocale].uiVerifiedToolSlugs.includes(tool.slug))) return <p role="status">{getWorkspaceUnavailableMessage(phaseLocale)}</p>;
  if (tool.slug.startsWith("jwt-") || ["url-query-parameter-parser","user-agent-parser","ip-cidr-calculator","base32-encoder-decoder","ulid-generator","uuid-v7-generator","hash-compare","regex-replace","html-entity-encoder-decoder","chmod-calculator","json-path-tester","csv-tsv-converter","url-slug-generator","unicode-code-point-checker","pdf-page-size-checker"].includes(tool.slug)) return <BrowserDeveloperToolsWorkspace slug={tool.slug} locale={phaseLocale === "pl" || isPlannedLocale(phaseLocale) ? phaseLocale : specializedLocale} title={tool.title} />;
  if ((COUNTRY_TOOL_SLUGS as readonly string[]).includes(tool.slug)) return <CountryToolsWorkspace slug={tool.slug as (typeof COUNTRY_TOOL_SLUGS)[number]} locale={isTargetPageMessageLocale(phaseLocale) ? phaseLocale : specializedLocale} />;
  if (["wareki-converter", "hiragana-katakana-converter", "fullwidth-halfwidth-converter", "japanese-romaji-converter", "japanese-number-kanji-converter", "yakudoshi-calculator", "japanese-zodiac-calculator", "numbers3-number-generator", "numbers4-number-generator", "bingo5-number-generator"].includes(tool.slug)) return <JapanToolsWorkspace slug={tool.slug} locale={isTargetPageMessageLocale(phaseLocale) ? phaseLocale : phaseLocale === "pl" ? "pl" : specializedLocale} />;
  if (tool.slug === "tarot-card") return <TarotWorkspace locale={phaseLocale === "pl" || isPlannedLocale(phaseLocale) ? phaseLocale : specializedLocale} />;
  if (tool.slug === "daily-fortune") return <DailyFortuneWorkspace locale={phaseLocale === "pl" || isPlannedLocale(phaseLocale) ? phaseLocale : specializedLocale} />;
  if (tool.slug === "saju") return <SajuWorkspace locale={phaseLocale} />;
  if (tool.slug === "lotto-number-generator") return <LottoWorkspace locale={phaseLocale} />;
  if (tool.slug === "powerball-number-generator") return <LottoWorkspace locale={phaseLocale} min={1} max={69} numberCount={5} historyKey="lottery-history:powerball-number-generator" specialBall={{ min: 1, max: 26, label: Object.fromEntries(["ko","en","ja","zh","es","pt-br","de","fr","vi","id","th","zh-tw","it","nl","hi","ru","tr","pl"].map((key)=>[key,"Powerball"])) }} />;
  if (tool.slug === "mega-millions-number-generator") return <LottoWorkspace locale={phaseLocale} min={1} max={70} numberCount={5} historyKey="lottery-history:mega-millions-number-generator" specialBall={{ min: 1, max: 24, label: Object.fromEntries(["ko","en","ja","zh","es","pt-br","de","fr","vi","id","th","zh-tw","it","nl","hi","ru","tr","pl"].map((key)=>[key,"Mega Ball"])) }} />;
  if (tool.slug === "japan-loto6-number-generator") return <LottoWorkspace locale={phaseLocale} min={1} max={43} numberCount={6} historyKey="lottery-history:japan-loto6-number-generator" />;
  if (tool.slug === "japan-loto7-number-generator") return <LottoWorkspace locale={phaseLocale} min={1} max={37} numberCount={7} historyKey="lottery-history:japan-loto7-number-generator" />;
  if (tool.slug === "japan-mini-loto-number-generator") return <LottoWorkspace locale={phaseLocale} min={1} max={31} numberCount={5} historyKey="lottery-history:japan-mini-loto-number-generator" />;
  if (tool.slug === "dice-roller" && !expandedRandomWorkspace) return <DiceWorkspace locale={phaseLocale === "pl" ? "pl" : specializedLocale} />;
  if (tool.slug === "coin-flip" && phaseLocale === "pl") return <CoinFlipWorkspace locale="pl" />;
  if (tool.slug === "random-number" && !expandedRandomWorkspace) return <RandomNumberWorkspace locale={phaseLocale === "pl" ? "pl" : specializedLocale} />;
  if ((tool.slug === "random-name-picker" || tool.slug === "draw-lots") && !expandedRandomWorkspace) return <RandomNameWorkspace slug={tool.slug} locale={phaseLocale === "pl" ? "pl" : specializedLocale} />;
  if (tool.slug === "random-team-maker" && !expandedRandomWorkspace) return <RandomTeamWorkspace locale={phaseLocale === "pl" ? "pl" : specializedLocale} />;
  if (tool.slug === "random-order" && !expandedRandomWorkspace) return <RandomOrderWorkspace locale={phaseLocale === "pl" ? "pl" : specializedLocale} />;
  if (tool.slug === "random-seat" && !expandedRandomWorkspace) return <RandomSeatWorkspace locale={phaseLocale === "pl" ? "pl" : specializedLocale} />;
  if (tool.slug === "duty-picker" && isPlannedLocale(phaseLocale)) return <RussianDutyPickerWorkspace locale={phaseLocale} />;
  if (tool.slug === "duty-picker" && phaseLocale === "pl") return <RussianDutyPickerWorkspace locale="pl" />;
  if (["password-generator","random-string-generator"].includes(tool.slug)) return <RandomStringWorkspace slug={tool.slug} locale={phaseLocale === "pl" || isPlannedLocale(phaseLocale) ? phaseLocale : specializedLocale} />;
  if (tool.slug === "ladder-game") return <LadderWorkspace locale={specializedLocale} />;
  if (tool.slug === "markdown-preview") return <MarkdownWorkspace locale={phaseLocale} />;
  if (tool.slug === "barcode-generator") return <BarcodeWorkspace locale={phaseLocale} title={tool.title} />;
  if (tool.slug === "regex-tester" && phaseLocale === "pl") return <PolishRegexWorkspace />;
  if (phaseLocale === "pl" && isPolishChinaSlug(tool.slug)) return <PolishChinaToolsWorkspace slug={tool.slug} />;
  if (phaseLocale === "pl" && isPolishIndiaSlug(tool.slug)) return <PolishIndiaToolsWorkspace slug={tool.slug} />;
  if (phaseLocale === "pl" && isPolishGermanySlug(tool.slug)) return <PolishGermanyToolsWorkspace slug={tool.slug} />;
  if (phaseLocale === "pl" && isPolishWesternEuropeSlug(tool.slug)) return <PolishWesternEuropeToolsWorkspace slug={tool.slug} />;
  if (phaseLocale === "pl" && isPolishBrazilSlug(tool.slug)) return <PolishBrazilToolsWorkspace slug={tool.slug} />;
  if (phaseLocale === "pl" && isPolishFinalCountrySlug(tool.slug)) return <PolishFinalCountryToolsWorkspace slug={tool.slug} />;
  if (phaseLocale === "pl" && isPolishNorthAmericaSlug(tool.slug)) return <PolishNorthAmericaToolsWorkspace slug={tool.slug} />;
  if (["wifi-qr","contact-qr","phone-qr","email-qr"].includes(tool.slug)) return <QrWorkspace slug={tool.slug} locale={phaseLocale === "pl" || isPlannedLocale(phaseLocale) ? phaseLocale : specializedLocale} />;
  if (tool.slug === "random-wheel") return <RandomWheelWorkspace locale={phaseLocale} />;
  if (tool.slug === "timer" || tool.slug === "pomodoro-timer") return <CountdownWorkspace slug={tool.slug} locale={phaseLocale === "pl" || isPlannedLocale(phaseLocale) ? phaseLocale : specializedLocale} />;
  if (tool.slug === "world-clock") return <WorldClockWorkspace locale={phaseLocale === "pl" || isPlannedLocale(phaseLocale) ? phaseLocale : specializedLocale} />;
  if (tool.slug === "stopwatch") return <DateTimeTool slug={tool.slug} locale={phaseLocale === "pl" || isPlannedLocale(phaseLocale) ? phaseLocale : specializedLocale} />;
  if (tool.category === "date-time") return <DateTimeTool slug={tool.slug} locale={specializedLocale} />;

  function selectFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);
    const selectionLimits = isPlannedToolOptionLocale(phaseLocale) ? targetSelectionLimitMessages[phaseLocale] : selectionLimitMessages[phaseLocale];
    const limit = isImage ? MAX_IMAGE : isPdf ? MAX_PDF : 100 * 1024 * 1024;
    const bad = incoming.find((file) => file.size > limit);
    if (bad) { setError(messages.errors.tooLarge.replace("{size}", String(isImage ? 30 : 50))); return; }
    if(isFileTool&&(incoming.length>100||incoming.reduce((sum,file)=>sum+file.size,0)>200*1024*1024)){setError(selectionLimits.files);return;}
    if(tool.slug==="image-collage"&&(incoming.length>6||incoming.reduce((sum,file)=>sum+file.size,0)>100*1024*1024)){setError(selectionLimits.images);return;}
    const valid = incoming.filter((file) => isImage ? (/^image\//.test(file.type) || /\.heic$/i.test(file.name) || /\.heif$/i.test(file.name)) : isPdf ? (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) : true);
    if (valid.length !== incoming.length) { setError(isImage ? messages.errors.imageOnly : messages.errors.pdfOnly); return; }
    const selected = tool.slug==="image-collage" || isFileTool || (isPdf && tool.slug !== "pdf-split" && tool.slug !== "pdf-delete-pages" && tool.slug !== "pdf-rotate-pages" && tool.slug !== "pdf-add-page-numbers" && tool.slug !== "pdf-watermark" && tool.slug !== "pdf-metadata-viewer" && tool.slug !== "pdf-remove-metadata") ? valid : valid.slice(0, 1);
    setFiles(selected);
    setPreviewUrl(selected[0] && isImage && !/\.(heic|heif)$/i.test(selected[0].name) ? URL.createObjectURL(selected[0]) : "");
    setError(""); setResult(""); setOutputUrl("");
  }

  async function process() {
    setError(""); setResult(""); setOutputUrl(""); setBusy(true);
    try {
      if (isImage && tool.slug !== "images-to-pdf") await processImage();
      else if (isPdf) await processPdf();
      else if (isFileTool) await processFileTool();
      else await processText();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : messages.errors.processing);
    } finally { setBusy(false); }
  }

  async function processImage() {
    if(tool.slug==="image-collage"){await processCollage();return;}
    const file=files[0]; if(!file) throw new Error(messages.errors.noImage);
    const processorLocale = getWorkspaceProcessorLocale(phaseLocale);
    const processed=await processImageFile(tool.slug,file,{quality,width,height,keepRatio,amount,option,text},processorLocale);
    if(processed.blob) setOutputUrl(URL.createObjectURL(processed.blob));
    setResult(processed.result);
  }

  async function processPdf() {
    const processorLocale = getWorkspaceProcessorLocale(phaseLocale);
    const processed=await processPdfFile(tool.slug,files,option,text,processorLocale);
    if(processed.blob) setOutputUrl(URL.createObjectURL(processed.blob));
    setResult(processed.result);
  }

  async function processText() {
    const processorLocale = getWorkspaceProcessorLocale(phaseLocale);
    const processed=await processTextTool(tool.slug,text,secondText,option,amount,processorLocale);
    if(processed.download) setOutputUrl(URL.createObjectURL(processed.download));
    setResult(processed.result);
  }
  async function processCollage(){const columns=option==="6"?3:2,maximum=columns*2;if(files.length<2||files.length>maximum)throw new Error(({ko:`이 배치에는 사진 ${maximum}장이 필요합니다.`,en:`Select 2–${maximum} images for this layout.`,ja:`このレイアウトには画像が2～${maximum}枚必要です。`,zh:`此版式需要选择 2–${maximum} 张图片。`,es:`Selecciona entre 2 y ${maximum} imágenes para este diseño.`,"pt-br":`Selecione de 2 a ${maximum} imagens para este layout.`,de:`Wähle 2 bis ${maximum} Bilder für dieses Layout aus.`,fr:`Sélectionnez de 2 à ${maximum} images pour cette mise en page.`,vi:`Chọn từ 2 đến ${maximum} ảnh cho bố cục này.`,id:`Pilih 2 hingga ${maximum} gambar untuk tata letak ini.`,th:`เลือกรูปภาพ 2 ถึง ${maximum} รูปสำหรับเลย์เอาต์นี้`,"zh-tw":`此版面請選取 2 到 ${maximum} 張圖片。`,it:`Seleziona da 2 a ${maximum} immagini per questo layout.`,nl:`Selecteer 2 tot ${maximum} afbeeldingen voor deze indeling.`,hi:`इस लेआउट के लिए 2 से ${maximum} छवियाँ चुनें।`} as Record<string,string>)[phaseLocale] ?? targetCollageCopy?.countError(maximum) ?? messages.errors.imageOutput);const bitmaps:ImageBitmap[]=[];try{for(const file of files)bitmaps.push(await createImageBitmap(file))}catch{bitmaps.forEach(bitmap=>bitmap.close());throw new Error(targetCollageCopy?.invalidImage??messages.errors.invalidImage)}const pixels=bitmaps.reduce((sum,b)=>sum+b.width*b.height,0);if(pixels>80_000_000){bitmaps.forEach(b=>b.close());throw new Error(messages.errors.pixels);}const cell=480,gap=12,rows=2,canvas=document.createElement("canvas");canvas.width=columns*cell+(columns+1)*gap;canvas.height=rows*cell+(rows+1)*gap;const ctx=canvas.getContext("2d");if(!ctx){bitmaps.forEach(b=>b.close());throw new Error(messages.errors.canvas);}ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);try{bitmaps.forEach((bitmap,index)=>{const ratio=Math.max(cell/bitmap.width,cell/bitmap.height),sw=cell/ratio,sh=cell/ratio,sx=(bitmap.width-sw)/2,sy=(bitmap.height-sh)/2,x=gap+(index%columns)*(cell+gap),y=gap+Math.floor(index/columns)*(cell+gap);ctx.drawImage(bitmap,sx,sy,sw,sh,x,y,cell,cell)});const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error(messages.errors.imageOutput)),"image/jpeg",quality));setOutputUrl(URL.createObjectURL(blob));setResult(targetCollageCopy ? targetCollageCopy.result(files.length,canvas.width,canvas.height) : `${files.length} photos ? ${canvas.width} ? ${canvas.height}px`);}finally{bitmaps.forEach(bitmap=>bitmap.close());canvas.width=0;canvas.height=0;}}
  async function processFileTool(){if(!files.length)throw new Error(messages.errors.noContent);const targetFileCopy=isPlannedLocale(phaseLocale)?getTargetFileProcessorCopy(phaseLocale):undefined;if(tool.slug==="duplicate-file-checker"){const hashed=await Promise.all(files.map(async file=>{const digest=await crypto.subtle.digest("SHA-256",await file.arrayBuffer());return {name:file.name,hash:Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,"0")).join("")}}));const groups=new Map<string,string[]>();hashed.forEach(({name,hash})=>groups.set(hash,[...(groups.get(hash)??[]),name]));const duplicates=[...groups.values()].filter(group=>group.length>1);setResult(duplicates.length?duplicates.map((group,i)=>`${targetFileCopy?.duplicateGroup(i+1)??`${phaseLocale==="pl"?"Grupa":"Group"} ${i+1}`}:\n${group.join("\n")}`).join("\n\n"):targetFileCopy?.noDuplicates??(phaseLocale==="pl"?"Nie znaleziono identycznej zawartości plików.":"No identical file contents found."));return;}if(tool.slug==="zip-files"||tool.slug==="bulk-file-renamer"||tool.slug==="filename-cleaner"){const {zip}=await import("fflate");const entries:Record<string,Uint8Array>={};const report:string[]=[];const renamed=tool.slug==="bulk-file-renamer"?renameFileNames(files.map(file=>file.name),parseRenameOptions(text)):[];for(const [index,file] of files.entries()){const original=file.name.split(/[\\/]/).pop()||`file-${index+1}`;let name=original;if(tool.slug==="bulk-file-renamer"){const [prefix="",suffix="",find="",replace=""]=text.split("\n");const dot=original.lastIndexOf(".");const stem=dot>0?original.slice(0,dot):original,ext=dot>0?original.slice(dot):"";name=`${prefix}${find?stem.replaceAll(find,replace):stem}${suffix}${ext}`;}if(tool.slug==="bulk-file-renamer")name=renamed[index];if(tool.slug==="filename-cleaner")name=original.normalize("NFKC").replace(/[<>:"/\\|?*\u0000-\u001f]/g,"").trim().replace(/\s+/g,"_").replace(/_+/g,"_")||`file-${index+1}`;name=safeArchiveName(name);const unique=uniqueName(name,entries);entries[unique]=new Uint8Array(await file.arrayBuffer());report.push(`${original} → ${unique}`);}const data=await new Promise<Uint8Array>((resolve,reject)=>zip(entries,{level:3},(error,result)=>error?reject(error):resolve(result)));const archive=new ArrayBuffer(data.byteLength);new Uint8Array(archive).set(data);setOutputUrl(URL.createObjectURL(new Blob([archive],{type:"application/zip"})));setResult(report.join("\n"));return;}const rows=await Promise.all(files.map(async file=>{const parts=file.name.split("."),extension=parts.length>1?parts.pop()!.toLowerCase():"(none)";if(tool.slug==="file-size-checker")return `${file.name}\t${formatFileSize(file.size)}`;if(tool.slug==="file-extension-checker")return `${file.name}\t.${extension}\t${file.type||(phaseLocale==="pl"?"nieznany typ MIME":targetFileCopy?.unknownMime??"unknown MIME")}`;if(tool.slug==="file-hash"){const digest=await crypto.subtle.digest("SHA-256",await file.arrayBuffer());return `${file.name}\tSHA-256\t${Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,"0")).join("")}`;}const bytes=new Uint8Array(await file.slice(0,16).arrayBuffer());const signature=signatureType(bytes);return `${file.name}\t${file.type||(phaseLocale==="pl"?"nieznany typ MIME":targetFileCopy?.unknownMime??"unknown MIME")}\t${signature}`;}));setResult(rows.join("\n"));}
  const needsFiles=isImage||isPdf||isFileTool;
  const needsSecond=tool.slug==="text-compare"||tool.slug==="regex-tester"||tool.slug==="remove-characters"||tool.slug==="duty-picker";
  return <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-label={messages.workspaceLabel.replace("{tool}", tool.title)}>
    {needsFiles ? <div>
      <label htmlFor="tool-files" onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>{e.preventDefault();selectFiles(e.dataTransfer.files);}} className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:border-indigo-400"><span className="font-semibold text-slate-800">{messages.chooseOrDrop}</span><span className="mt-2 text-sm text-slate-500">{messages.fileLimit.replace("{size}",isImage?"30":"50")}</span></label>
      <input id="tool-files" type="file" accept={isImage?"image/*,.heic,.heif":isPdf?"application/pdf,.pdf":undefined} multiple={isFileTool||tool.slug==="image-collage"||tool.slug==="pdf-merge"||tool.slug==="images-to-pdf"} onChange={(e)=>selectFiles(e.target.files)} className="sr-only" />
      {files.length>0&&<div className="mt-4 rounded-xl bg-slate-50 p-4"><ul className="space-y-2">{files.map((file,i)=><li key={`${file.name}-${i}`} className="flex justify-between gap-3 text-sm"><span className="truncate">{file.name}</span><span className="shrink-0 text-slate-500">{(file.size/1024/1024).toFixed(2)} MB</span></li>)}</ul><button type="button" onClick={()=>{setFiles([]);setPreviewUrl("");setResult("");setOutputUrl("");}} className="mt-3 text-sm font-medium text-rose-700 underline">{messages.resetSelection}</button></div>}
      {previewUrl&&tool.slug!=="image-color-picker"&&<NextImage unoptimized src={previewUrl} alt={messages.selectedImageAlt} width={960} height={600} className="mt-4 max-h-72 max-w-full rounded-xl border border-slate-200 object-contain" />}
      {previewUrl&&tool.slug==="image-color-picker"&&<div className="mt-4"><p className="mb-2 text-sm">{messages.clickImageColor}</p><ColorPicker src={previewUrl} label={messages.colorPickerLabel} onPick={setResult}/></div>}
    </div> : inputlessExpandedRandom ? null : <div className="grid gap-4 sm:grid-cols-2">
      <div><label htmlFor="input-text" className="mb-2 block text-sm font-medium">{needsSecond?messages.firstText:messages.input}</label><textarea id="input-text" value={text} onChange={(e)=>setText(e.target.value)} rows={9} placeholder={tool.slug==="timestamp-converter"?messages.timestampPlaceholder:tool.slug==="random-number"?(randomWorkspaceCopy?.rangeHint??messages.textPlaceholder):tool.slug==="color-converter"?"#3366FF":messages.textPlaceholder} className="w-full rounded-xl border border-slate-300 p-3 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />{tool.slug==="timestamp-converter"&&<p className="mt-2 text-xs text-slate-500">{messages.timestampHint}</p>}</div>
      {needsSecond&&<div><label htmlFor="second-text" className="mb-2 block text-sm font-medium">{messages.secondText}</label><textarea id="second-text" value={secondText} onChange={(e)=>setSecondText(e.target.value)} rows={9} className="w-full rounded-xl border border-slate-300 p-3 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" /></div>}
    </div>}
    <ToolOptions tool={tool} locale={optionLocale} messages={messages} files={files} {...{quality,setQuality,width,setWidth,height,setHeight,keepRatio,setKeepRatio,amount,setAmount,option,setOption,text,setText}} />
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={process} disabled={busy} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">{busy?messages.processing:tool.category==="image"||tool.category==="pdf"?messages.process:messages.run}</button><button type="button" onClick={()=>{setText("");setSecondText("");setResult("");setOutputUrl("");setError("");}} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium hover:bg-slate-50">{messages.reset}</button></div>
    <p role="status" aria-live="polite" className="sr-only">{busy?messages.processingStatus:result?messages.completedStatus:""}</p>
    {error&&<p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {result&&<div className="mt-5"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold">{messages.result}</h3>{outputUrl&&<a href={outputUrl} download={downloadName(tool.slug,fileName)} className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">{messages.download}</a>}{!needsFiles&&<button type="button" onClick={()=>void copyText(result)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium transition-transform active:scale-[0.98] hover:bg-slate-50">{messages.copy}</button>}</div><pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{result}</pre></div>}
  </section>;
}

function BulkRenameOptions({locale,files,value,onChange}:{locale:ToolOptionLocale;files:File[];value:string;onChange:(value:string)=>void}) {
  const t=getRenameCopy(locale);
  const options=parseRenameOptions(value); const fields:[keyof ReturnType<typeof parseRenameOptions>,string][]=[["prefix",t.prefix],["suffix",t.suffix],["find",t.find],["replace",t.replace],["startNumber",t.start],["padding",t.padding]];
  function update(key:keyof ReturnType<typeof parseRenameOptions>,next:string){onChange(fields.map(([field])=>field===key?next:options[field]??"").join("\n"));}
  const renamed=renameFileNames(files.map((file)=>file.name),options);
  return <div className="mt-4"><div className="grid gap-3 sm:grid-cols-2">{fields.map(([key,label])=><label key={key} className="text-sm font-medium">{label}<input type={key==="startNumber"||key==="padding"?"number":"text"} min={key==="padding"?0:undefined} max={key==="padding"?12:undefined} value={options[key]??""} onChange={(event)=>update(key,event.target.value)} className="mt-1 block min-h-10 w-full rounded-lg border p-2"/></label>)}</div><div className="mt-4 overflow-auto rounded-xl border"><table className="w-full min-w-[480px] text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-2">{t.before}</th><th className="p-2">{t.after}</th></tr></thead><tbody>{files.length?files.map((file,index)=><tr key={`${file.name}-${index}`} className="border-t"><td className="max-w-56 truncate p-2">{file.name}</td><td className="max-w-56 truncate p-2 font-medium">{renamed[index]}</td></tr>):<tr><td colSpan={2} className="p-3 text-slate-500">{t.empty}</td></tr>}</tbody></table></div></div>;
}

function ToolOptions({tool,locale,messages,files,quality,setQuality,width,setWidth,height,setHeight,keepRatio,setKeepRatio,amount,setAmount,option,setOption,text,setText}:{tool:ToolDefinition;locale:ToolOptionLocale;messages:Dictionary;files:File[];quality:number;setQuality:(v:number)=>void;width:number;setWidth:(v:number)=>void;height:number;setHeight:(v:number)=>void;keepRatio:boolean;setKeepRatio:(v:boolean)=>void;amount:number;setAmount:(v:number)=>void;option:string;setOption:(v:string)=>void;text:string;setText:(v:string)=>void}) {
  const slug=tool.slug;
  if (slug==="image-collage") return <SelectOption label={messages.option} value={option||"4"} onChange={setOption} options={[["4",localizedOptionLabel(locale,"collage4")],["6",localizedOptionLabel(locale,"collage6")]]} />;
  if (slug==="instagram-grid-split") return <SelectOption label={messages.option} value={option||"9"} onChange={setOption} options={[["3",localizedOptionLabel(locale,"grid3")],["6",localizedOptionLabel(locale,"grid6")],["9",localizedOptionLabel(locale,"grid9")]]} />;
  if (slug==="bulk-file-renamer") return <BulkRenameOptions locale={locale} files={files} value={text} onChange={setText} />;
  if (slug==="social-image-resize") return <SelectOption label={messages.option} value={option||"square"} onChange={setOption} options={[["square",localizedOptionLabel(locale,"square")],["portrait",localizedOptionLabel(locale,"portraitPreset")],["story",localizedOptionLabel(locale,"story")],["youtube",localizedOptionLabel(locale,"youtube")],["x",localizedOptionLabel(locale,"xpost")],["facebook",localizedOptionLabel(locale,"facebook")]]} />;
  if (slug==="add-text-to-image") return <label className="mt-4 block text-sm">{messages.input}<input value={text} onChange={e=>setText(e.target.value)} maxLength={160} className="mt-1 block w-full rounded-lg border p-3"/></label>;
  if (["random-number","random-name-picker","random-wheel","draw-lots","random-team-maker","random-order","dice-roller","coin-flip","password-generator","random-string-generator","uuid-generator","text-repeater","lorem-ipsum"].includes(slug)) return <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm">{messages.generateCount}<input type="number" min="1" max={slug==="coin-flip"?1000:100} value={amount} onChange={(e)=>setAmount(Number(e.target.value))} className="mt-1 block w-full rounded-lg border p-2" /></label>{["random-number","random-name-picker","random-wheel","draw-lots"].includes(slug)&&<SelectOption label={messages.option} value={option} onChange={setOption} options={[["unique",localizedOptionLabel(locale,"noRepeat")],["repeat",localizedOptionLabel(locale,"repeat")]]} />}{slug==="dice-roller"&&<SelectOption label={messages.option} value={option||"6"} onChange={setOption} options={[["4","D4"],["6","D6"],["8","D8"],["10","D10"],["12","D12"],["20","D20"]]} />}{slug==="text-repeater"&&<label className="text-sm">{messages.option}<input value={option} onChange={(e)=>setOption(e.target.value)} placeholder=", " className="mt-1 block w-full rounded-lg border p-2" /></label>}</div>;
  if (slug==="remove-characters") return <SelectOption label={messages.option} value={option||"digits"} onChange={setOption} options={[["digits",localizedOptionLabel(locale,"digits")],["latin",localizedOptionLabel(locale,"latin")],["hangul",localizedOptionLabel(locale,"hangul")],["special",localizedOptionLabel(locale,"special")],["custom",localizedOptionLabel(locale,"custom")]]} />;
  if (["image-compress","jpg-to-webp","png-to-webp","png-to-jpg","webp-to-jpg","heic-to-jpg"].includes(slug)) return <label className="mt-5 block text-sm">{messages.quality}: {Math.round(quality*100)}% <input type="range" min="0.2" max="1" step="0.01" value={quality} onChange={(e)=>setQuality(Number(e.target.value))} className="mt-2 block w-full accent-indigo-600" /></label>;
  if (slug==="image-resize") return <div className="mt-5 flex flex-wrap items-end gap-4"><label className="text-sm">{messages.width}<input type="number" min="1" max="12000" value={width} onChange={(e)=>setWidth(Number(e.target.value))} className="mt-1 block w-28 rounded-lg border p-2" /></label><label className="text-sm">{messages.height}<input type="number" min="1" max="12000" value={height} onChange={(e)=>setHeight(Number(e.target.value))} disabled={keepRatio} className="mt-1 block w-28 rounded-lg border p-2 disabled:bg-slate-100" /></label><label className="flex min-h-10 items-center gap-2 text-sm"><input type="checkbox" checked={keepRatio} onChange={(e)=>setKeepRatio(e.target.checked)} />{messages.keepRatio}</label></div>;
  if (slug==="image-rotate") return <SelectOption label={messages.rotation} value={option} onChange={setOption} options={[["90","90°"],["180","180°"],["270","270°"]]} />;
  if (slug==="image-flip") return <SelectOption label={messages.flipDirection} value={option} onChange={setOption} options={[["horizontal",messages.horizontal],["vertical",messages.vertical]]} />;
  if (slug==="image-crop") return <SelectOption label={messages.cropAspect} value={option} onChange={setOption} options={[["1",messages.square],["1.7778",messages.landscape],["0.75",messages.portrait]]} />;
  if (["image-brightness","image-contrast","image-blur","image-pixelate"].includes(slug)) return <label className="mt-5 block text-sm">{slug==="image-brightness"?messages.brightness:slug==="image-contrast"?messages.contrast:slug==="image-blur"?messages.blur: messages.mosaic}: {amount}<input type="range" min={slug==="image-blur"?0:slug==="image-pixelate"?4:0} max={slug==="image-blur"?100:slug==="image-pixelate"?80:200} value={amount} onChange={(e)=>setAmount(Number(e.target.value))} className="mt-2 block w-full accent-indigo-600" /></label>;
  if (["remove-spaces","sort-lines","text-case-converter","json-formatter","base64","url-encode-decode","timestamp-converter"].includes(slug)) {
    const opts=slug==="remove-spaces"?[["all",messages.removeAllSpaces],["collapse",messages.collapseSpaces]]:slug==="sort-lines"?[["asc",messages.ascending],["desc",messages.descending]]:slug==="text-case-converter"?[["lower",messages.lowercase],["upper",messages.uppercase],["title",messages.titleCase]]:slug==="json-formatter"?[["format",messages.prettyPrint],["minify",messages.minify]]:slug==="base64"?[["encode",messages.encode],["decode",messages.decode]]:slug==="url-encode-decode"?[["encode",messages.encode],["decode",messages.decode]]:[["seconds",messages.unixSeconds],["milliseconds",messages.unixMilliseconds],["date",messages.enterDate]];
    return <SelectOption label={messages.option} value={option} onChange={setOption} options={opts as [string,string][]} />;
  }
  if (slug==="uuid-generator") return <label className="mt-4 block text-sm">{messages.generateCount}<input type="number" min="1" max="100" value={amount} onChange={(e)=>setAmount(Number(e.target.value))} className="ml-3 w-24 rounded-lg border p-2" /></label>;
  if (["pdf-split","pdf-delete-pages"].includes(slug)) return <label className="mt-4 block text-sm">{messages.pageRange}<input value={option} onChange={(e)=>setOption(e.target.value)} placeholder="1, 3-5" className="mt-1 block w-full rounded-lg border p-3" /></label>;
  if (slug==="pdf-reorder-pages") return <label className="mt-4 block text-sm">{messages.pageOrder}<input value={option} onChange={(e)=>setOption(e.target.value)} placeholder="3,1,2" className="mt-1 block w-full rounded-lg border p-3" /></label>;
  if (slug==="pdf-rotate-pages") return <SelectOption label={messages.rotation} value={option} onChange={setOption} options={[["90","90°"],["180","180°"],["270","270°"]]} />;
  if (slug==="pdf-watermark") return <label className="mt-4 block text-sm">{messages.watermark}<input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Woori Tools" className="mt-1 block w-full rounded-lg border p-3" /></label>;
  if (slug==="uuid-generator") return null;
  return null;
}
function SelectOption({label,value,onChange,options}:{label:string;value:string;onChange:(v:string)=>void;options:[string,string][]}){return <label className="mt-4 block text-sm">{label}<select value={value} onChange={(e)=>onChange(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-3">{options.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>;}
function defaultOption(slug:string){return slug==="image-rotate"||slug==="pdf-rotate-pages"?"90":slug==="image-flip"?"horizontal":slug==="image-crop"?"1":slug==="sort-lines"?"asc":slug==="text-case-converter"?"lower":slug==="json-formatter"?"format":slug==="base64"||slug==="url-encode-decode"?"encode":slug==="timestamp-converter"?"seconds":slug==="remove-spaces"?"all":["random-number","random-name-picker","random-wheel","draw-lots"].includes(slug)?"unique":"";}

function isPolishChinaSlug(slug: string): slug is RussianChinaSlug {
  return slug === "simplified-traditional-chinese-converter" || slug === "chinese-number-kanji-converter" || slug === "rmb-uppercase-converter" || slug === "chinese-zodiac-calculator" || slug === "chinese-sexagenary-cycle-calculator" || slug === "chinese-phone-number-formatter" || slug === "taiwan-phone-number-formatter";
}

function isPolishIndiaSlug(slug: string): slug is RussianIndiaSlug {
  return slug === "indian-number-format-converter" || slug === "lakh-crore-converter" || slug === "pan-format-validator" || slug === "gstin-format-validator" || slug === "india-phone-number-formatter";
}

function isPolishGermanySlug(slug: string): slug is PolishGermanySlug {
  return slug === "germany-iban-validator" || slug === "german-number-format-converter" || slug === "german-date-format-converter";
}

function isPolishWesternEuropeSlug(slug: string): slug is PolishWesternEuropeSlug {
  return slug === "spain-dni-validator" || slug === "spain-nie-validator" || slug === "spanish-number-format-converter" || slug === "spanish-date-format-converter" || slug === "france-phone-number-formatter" || slug === "french-number-format-converter" || slug === "french-date-format-converter" || slug === "netherlands-iban-validator" || slug === "dutch-number-format-converter" || slug === "dutch-date-format-converter";
}

function isPolishBrazilSlug(slug: string): slug is PolishBrazilSlug {
  return slug === "brazil-cpf-validator" || slug === "brazil-cnpj-validator" || slug === "brazil-phone-number-formatter" || slug === "brazil-cep-formatter";
}

function isPolishFinalCountrySlug(slug: string): slug is PolishFinalCountrySlug {
  return slug === "vietnam-phone-number-formatter" || slug === "vietnam-number-format-converter" || slug === "italy-fiscal-code-format-validator" || slug === "italy-vat-number-validator" || slug === "italy-number-format-converter" || slug === "italian-date-format-converter" || slug === "australia-postcode-formatter" || slug === "english-date-format-converter";
}

function isPolishNorthAmericaSlug(slug: string): slug is PolishNorthAmericaSlug {
  return slug === "us-phone-number-formatter" || slug === "us-zip-code-formatter" || slug === "canada-postal-code-formatter" || slug === "uk-postcode-formatter";
}
const polishOptionLabels:Record<string,string>={square:"Instagram — kwadrat",portraitPreset:"Instagram — pionowo",story:"Relacja na Instagramie",youtube:"Miniatura YouTube",xpost:"Post na X",facebook:"Post na Facebooku",grid3:"3 kafelki (3 × 1)",grid6:"6 kafelków (3 × 2)",grid9:"9 kafelków (3 × 3)",collage4:"4 zdjęcia (2 × 2)",collage6:"6 zdjęć (3 × 2)"};
function localizedOptionLabel(locale:ToolOptionLocale,key:string){if(isPlannedToolOptionLocale(locale))return getTargetToolOptionLabel(locale,key)??key;return legacyLocaleLabel(locale,key);}
function legacyLocaleLabel(locale:ToolOptionLocale,key:string){if(locale==="pl")return polishOptionLabels[key]??key;const labels:Record<string,Record<string,string>>={ko:{noRepeat:"중복 없이",repeat:"중복 허용",digits:"숫자",latin:"영문",hangul:"한글",special:"특수문자",custom:"사용자 지정",square:"Instagram 정사각형",portraitPreset:"Instagram 세로",story:"Instagram 스토리",youtube:"YouTube 썸네일",xpost:"X 게시물",facebook:"Facebook 게시물",grid3:"3개 (3 × 1)",grid6:"6개 (3 × 2)",grid9:"9개 (3 × 3)",collage4:"4장 (2 × 2)",collage6:"6장 (3 × 2)",renameRules:"줄마다 접두사, 접미사, 찾을 글자, 바꿀 글자를 입력",renameHint:"생략한 줄은 무시합니다. 변경본은 ZIP으로 받습니다."},en:{noRepeat:"Without repeats",repeat:"Allow repeats",digits:"Digits",latin:"Latin letters",hangul:"Korean characters",special:"Special characters",custom:"Custom string",square:"Instagram square",portraitPreset:"Instagram portrait",story:"Instagram story",youtube:"YouTube thumbnail",xpost:"X post",facebook:"Facebook post",grid3:"3 tiles (3 × 1)",grid6:"6 tiles (3 × 2)",grid9:"9 tiles (3 × 3)",collage4:"4 photos (2 × 2)",collage6:"6 photos (3 × 2)",renameRules:"Enter prefix, suffix, find, and replace on separate lines",renameHint:"Leave a line empty to skip that rule. Renamed copies are downloaded as a ZIP."},ja:{noRepeat:"重複なし",repeat:"重複あり",digits:"数字",latin:"英字",hangul:"ハングル",special:"記号",custom:"指定文字列",square:"Instagram正方形",portraitPreset:"Instagram縦長",story:"Instagramストーリー",youtube:"YouTubeサムネイル",xpost:"X投稿",facebook:"Facebook投稿",grid3:"3枚 (3 × 1)",grid6:"6枚 (3 × 2)",grid9:"9枚 (3 × 3)",collage4:"4枚 (2 × 2)",collage6:"6枚 (3 × 2)",renameRules:"接頭辞、接尾辞、検索文字、置換文字を各行に入力",renameHint:"空欄の規則は無視します。変更後のファイルはZIPで保存します。"},zh:{noRepeat:"不重复",repeat:"允许重复",digits:"数字",latin:"英文字母",hangul:"韩文",special:"特殊字符",custom:"自定义字符",square:"Instagram方形",portraitPreset:"Instagram竖版",story:"Instagram限时动态",youtube:"YouTube缩略图",xpost:"X帖子",facebook:"Facebook帖子",grid3:"3张（3 × 1）",grid6:"6张（3 × 2）",grid9:"9张（3 × 3）",collage4:"4张（2 × 2）",collage6:"6张（3 × 2）",renameRules:"每行输入前缀、后缀、查找内容和替换内容",renameHint:"留空的规则将跳过。重命名后的副本将打包为ZIP下载."}};
const localized:Record<string,Record<string,string>>={es:{square:"Instagram cuadrado",portraitPreset:"Instagram vertical",story:"Historia de Instagram",youtube:"Miniatura de YouTube",xpost:"Publicación de X",facebook:"Publicación de Facebook",grid3:"3 mosaicos (3 × 1)",grid6:"6 mosaicos (3 × 2)",grid9:"9 mosaicos (3 × 3)",collage4:"4 fotos (2 × 2)",collage6:"6 fotos (3 × 2)"},"pt-br":{square:"Instagram quadrado",portraitPreset:"Instagram vertical",story:"Story do Instagram",youtube:"Miniatura do YouTube",xpost:"Publicação no X",facebook:"Publicação no Facebook",grid3:"3 peças (3 × 1)",grid6:"6 peças (3 × 2)",grid9:"9 peças (3 × 3)",collage4:"4 fotos (2 × 2)",collage6:"6 fotos (3 × 2)"},de:{square:"Instagram quadratisch",portraitPreset:"Instagram Hochformat",story:"Instagram-Story",youtube:"YouTube-Thumbnail",xpost:"X-Beitrag",facebook:"Facebook-Beitrag",grid3:"3 Kacheln (3 × 1)",grid6:"6 Kacheln (3 × 2)",grid9:"9 Kacheln (3 × 3)",collage4:"4 Fotos (2 × 2)",collage6:"6 Fotos (3 × 2)"},fr:{square:"Carré Instagram",portraitPreset:"Portrait Instagram",story:"Story Instagram",youtube:"Miniature YouTube",xpost:"Publication X",facebook:"Publication Facebook",grid3:"3 vignettes (3 × 1)",grid6:"6 vignettes (3 × 2)",grid9:"9 vignettes (3 × 3)",collage4:"4 photos (2 × 2)",collage6:"6 photos (3 × 2)"},vi:{square:"Instagram vuông",portraitPreset:"Instagram dọc",story:"Tin Instagram",youtube:"Ảnh thu nhỏ YouTube",xpost:"Bài đăng X",facebook:"Bài đăng Facebook",grid3:"3 ô (3 × 1)",grid6:"6 ô (3 × 2)",grid9:"9 ô (3 × 3)",collage4:"4 ảnh (2 × 2)",collage6:"6 ảnh (3 × 2)"},id:{square:"Instagram persegi",portraitPreset:"Instagram potret",story:"Instagram Story",youtube:"Thumbnail YouTube",xpost:"Postingan X",facebook:"Postingan Facebook",grid3:"3 ubin (3 × 1)",grid6:"6 ubin (3 × 2)",grid9:"9 ubin (3 × 3)",collage4:"4 foto (2 × 2)",collage6:"6 foto (3 × 2)"},th:{square:"Instagram สี่เหลี่ยม",portraitPreset:"Instagram แนวตั้ง",story:"สตอรี่ Instagram",youtube:"ภาพปก YouTube",xpost:"โพสต์ X",facebook:"โพสต์ Facebook",grid3:"3 ช่อง (3 × 1)",grid6:"6 ช่อง (3 × 2)",grid9:"9 ช่อง (3 × 3)",collage4:"4 ภาพ (2 × 2)",collage6:"6 ภาพ (3 × 2)"},"zh-tw":{square:"Instagram 正方形",portraitPreset:"Instagram 直式",story:"Instagram 限時動態",youtube:"YouTube 縮圖",xpost:"X 貼文",facebook:"Facebook 貼文",grid3:"3 張拼圖 (3 × 1)",grid6:"6 張拼圖 (3 × 2)",grid9:"9 張拼圖 (3 × 3)",collage4:"4 張照片 (2 × 2)",collage6:"6 張照片 (3 × 2)"},it:{square:"Instagram quadrato",portraitPreset:"Instagram verticale",story:"Storia Instagram",youtube:"Miniatura YouTube",xpost:"Post su X",facebook:"Post Facebook",grid3:"3 riquadri (3 × 1)",grid6:"6 riquadri (3 × 2)",grid9:"9 riquadri (3 × 3)",collage4:"4 foto (2 × 2)",collage6:"6 foto (3 × 2)"},nl:{square:"Instagram vierkant",portraitPreset:"Instagram staand",story:"Instagram-verhaal",youtube:"YouTube-miniatuur",xpost:"X-bericht",facebook:"Facebook-bericht",grid3:"3 tegels (3 × 1)",grid6:"6 tegels (3 × 2)",grid9:"9 tegels (3 × 3)",collage4:"4 foto's (2 × 2)",collage6:"6 foto's (3 × 2)"},hi:{square:"Instagram वर्ग",portraitPreset:"Instagram पोर्ट्रेट",story:"Instagram स्टोरी",youtube:"YouTube थंबनेल",xpost:"X पोस्ट",facebook:"Facebook पोस्ट",grid3:"3 टाइल (3 × 1)",grid6:"6 टाइल (3 × 2)",grid9:"9 टाइल (3 × 3)",collage4:"4 तस्वीरें (2 × 2)",collage6:"6 तस्वीरें (3 × 2)"}};return selectionCopy[locale][key as keyof typeof selectionCopy[typeof locale]]??localized[locale]?.[key]??labels[locale]?.[key]??key;}
function downloadName(slug:string,stem:string){if(slug==="images-to-pdf"||slug.startsWith("pdf-"))return`${stem}-${slug==="pdf-merge"?"merged":"processed"}.pdf`;if(slug==="text-to-file")return `${stem}.txt`;if(["zip-files","bulk-file-renamer","filename-cleaner","instagram-grid-split"].includes(slug))return `${slug}.zip`;const extension=slug.includes("png")||slug==="favicon-generator"?"png":slug.includes("webp")?"webp":"jpg";return`${stem}-${slug}.${extension}`;}
function safeArchiveName(value:string){return value.replace(/^[. ]+|[. ]+$/g,"").replace(/[<>:"/\\|?*\u0000-\u001f]/g,"_")||"file";}
function uniqueName(name:string,entries:Record<string,Uint8Array>){if(!entries[name])return name;const dot=name.lastIndexOf("."),stem=dot>0?name.slice(0,dot):name,ext=dot>0?name.slice(dot):"";let n=2;while(entries[`${stem} (${n})${ext}`])n++;return `${stem} (${n})${ext}`;}
function formatFileSize(size:number){if(size<1024)return `${size} B`;if(size<1024*1024)return `${(size/1024).toFixed(1)} KB`;return `${(size/1024/1024).toFixed(2)} MB`;}
function signatureType(bytes:Uint8Array){if(bytes[0]===0x89&&bytes[1]===0x50&&bytes[2]===0x4e&&bytes[3]===0x47)return "PNG signature";if(bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff)return "JPEG signature";if(String.fromCharCode(...bytes.slice(0,4))==="%PDF")return "PDF signature";if(String.fromCharCode(...bytes.slice(0,3))==="GIF")return "GIF signature";if(String.fromCharCode(...bytes.slice(0,2))==="PK")return "ZIP signature";return "Unknown signature";}
function ColorPicker({src,label,onPick}:{src:string;label:string;onPick:(v:string)=>void}){return <canvas aria-label={label} ref={(canvas)=>{if(!canvas)return;const img=new Image();img.onload=()=>{const scale=Math.min(1,800/img.width);canvas.width=img.width*scale;canvas.height=img.height*scale;canvas.getContext("2d")?.drawImage(img,0,0,canvas.width,canvas.height);};img.src=src;}} onClick={(e)=>{const canvas=e.currentTarget,rect=canvas.getBoundingClientRect(),x=Math.floor((e.clientX-rect.left)*canvas.width/rect.width),y=Math.floor((e.clientY-rect.top)*canvas.height/rect.height),data=canvas.getContext("2d")?.getImageData(x,y,1,1).data;if(data){const hex=`#${[data[0],data[1],data[2]].map((n)=>n.toString(16).padStart(2,"0")).join("").toUpperCase()}`;onPick(`${hex} · RGB(${data[0]}, ${data[1]}, ${data[2]})`);}}} className="max-h-96 max-w-full cursor-crosshair rounded-lg" />;}

function DateTimeTool({slug,locale}:{slug:string;locale:TargetLocale}) {
  const labels:Record<string,Record<string,string>>={ko:{start:"시작",pause:"일시정지",resume:"계속",reset:"초기화",lap:"랩 기록",laps:"랩",hours:"시",minutes:"분",seconds:"초",remaining:"남은 시간",done:"시간 종료",cities:"세계 주요 도시",focus:"집중",break:"휴식",session:"세션"},en:{start:"Start",pause:"Pause",resume:"Resume",reset:"Reset",lap:"Lap",laps:"Laps",hours:"Hours",minutes:"Minutes",seconds:"Seconds",remaining:"Remaining",done:"Time is up",cities:"World cities",focus:"Focus",break:"Break",session:"Session"},ja:{start:"開始",pause:"一時停止",resume:"再開",reset:"リセット",lap:"ラップ",laps:"ラップ記録",hours:"時",minutes:"分",seconds:"秒",remaining:"残り時間",done:"時間終了",cities:"世界の都市",focus:"集中",break:"休憩",session:"セッション"},zh:{start:"开始",pause:"暂停",resume:"继续",reset:"重置",lap:"计圈",laps:"计圈记录",hours:"时",minutes:"分",seconds:"秒",remaining:"剩余时间",done:"时间到",cities:"世界城市",focus:"专注",break:"休息",session:"阶段"},pl:{start:"Start",pause:"Wstrzymaj",resume:"Wzn\u00F3w",reset:"Resetuj",lap:"Okr\u0105\u017Cenie",laps:"Okr\u0105\u017Cenia",hours:"Godziny",minutes:"Minuty",seconds:"Sekundy",remaining:"Pozosta\u0142y czas",done:"Czas min\u0105\u0142",cities:"Miasta na\u00A0\u015Bwiecie",focus:"Skupienie",break:"Przerwa",session:"Sesja"}};
  const translated:Record<string,string[]>={
    ru:["Запустить","Пауза","Продолжить","Сбросить","Круг","Круги","Часы","Минуты","Секунды","Прошло","Время вышло","Города мира","Фокус","Перерыв","Сессия"],
    es:["Iniciar","Pausar","Continuar","Reiniciar","Vuelta","Vueltas","Horas","Minutos","Segundos","Tiempo restante","Se acabó el tiempo","Ciudades del mundo","Concentración","Descanso","Sesión"],
    "pt-br":["Iniciar","Pausar","Continuar","Redefinir","Volta","Voltas","Horas","Minutos","Segundos","Tempo restante","O tempo acabou","Cidades do mundo","Foco","Pausa","Sessão"],
    de:["Starten","Pausieren","Fortsetzen","Zurücksetzen","Runde","Runden","Stunden","Minuten","Sekunden","Verbleibende Zeit","Die Zeit ist abgelaufen","Weltstädte","Fokus","Pause","Einheit"],
    fr:["Démarrer","Mettre en pause","Reprendre","Réinitialiser","Tour","Tours","Heures","Minutes","Secondes","Temps restant","Le temps est écoulé","Villes du monde","Concentration","Pause","Session"],
    vi:["Bắt đầu","Tạm dừng","Tiếp tục","Đặt lại","Vòng","Các vòng","Giờ","Phút","Giây","Thời gian còn lại","Đã hết giờ","Các thành phố trên thế giới","Tập trung","Nghỉ","Phiên"],
    id:["Mulai","Jeda","Lanjutkan","Atur ulang","Putaran","Putaran","Jam","Menit","Detik","Waktu tersisa","Waktu habis","Kota-kota dunia","Fokus","Istirahat","Sesi"],
    th:["เริ่ม","หยุดชั่วคราว","ทำต่อ","รีเซ็ต","รอบ","รอบ","ชั่วโมง","นาที","วินาที","เวลาที่เหลือ","หมดเวลาแล้ว","เมืองทั่วโลก","จดจ่อ","พัก","รอบ"],
    "zh-tw":["開始","暫停","繼續","重設","圈","圈數","小時","分鐘","秒","剩餘時間","時間到了","世界城市","專注","休息","階段"],
    it:["Avvia","Pausa","Riprendi","Reimposta","Giro","Giri","Ore","Minuti","Secondi","Tempo rimanente","Tempo scaduto","Città del mondo","Concentrazione","Pausa","Sessione"],
    nl:["Starten","Pauzeren","Hervatten","Opnieuw instellen","Ronde","Rondes","Uren","Minuten","Seconden","Resterende tijd","De tijd is om","Wereldsteden","Focus","Pauze","Sessie"],
    hi:["शुरू करें","रोकें","जारी रखें","रीसेट करें","चक्र","चक्र","घंटे","मिनट","सेकंड","शेष समय","समय पूरा हुआ","दुनिया के शहर","ध्यान","विराम","सत्र"]
  };
  translated.tr=["Başlat","Duraklat","Sürdür","Sıfırla","Tur kaydet","Turlar","Saat","Dakika","Saniye","Kalan süre","Süre doldu","Dünya şehirleri","Odaklanma","Mola","Oturum"];
  Object.assign(translated, {
    fil: ["Simulan", "I-pause", "Ipagpatuloy", "I-reset", "Lap", "Mga lap", "Oras", "Minuto", "Segundo", "Natitirang oras", "Tapos na ang oras", "Mga lungsod sa mundo", "Pokus", "Pahinga", "Sesyon"],
    bn: ["শুরু করুন", "বিরতি দিন", "চালিয়ে যান", "রিসেট করুন", "ল্যাপ", "ল্যাপসমূহ", "ঘণ্টা", "মিনিট", "সেকেন্ড", "বাকি সময়", "সময় শেষ", "বিশ্বের শহর", "মনোযোগ", "বিরতি", "সেশন"],
    uk: ["Почати", "Пауза", "Продовжити", "Скинути", "Коло", "Кола", "Години", "Хвилини", "Секунди", "Залишилося", "Час вийшов", "Міста світу", "Зосередження", "Перерва", "Сеанс"],
    ms: ["Mula", "Jeda", "Sambung", "Tetapkan semula", "Pusingan", "Pusingan", "Jam", "Minit", "Saat", "Baki masa", "Masa tamat", "Bandar dunia", "Fokus", "Rehat", "Sesi"],
    sv: ["Starta", "Pausa", "Fortsätt", "Återställ", "Varv", "Varv", "Timmar", "Minuter", "Sekunder", "Återstående tid", "Tiden är ute", "Världens städer", "Fokus", "Paus", "Session"],
    cs: ["Spustit", "Pozastavit", "Pokračovat", "Vynulovat", "Kolo", "Kola", "Hodiny", "Minuty", "Sekundy", "Zbývající čas", "Čas vypršel", "Světová města", "Soustředění", "Přestávka", "Blok"],
    ro: ["Pornește", "Pauză", "Continuă", "Resetează", "Tură", "Ture", "Ore", "Minute", "Secunde", "Timp rămas", "Timpul a expirat", "Orașe din lume", "Concentrare", "Pauză", "Sesiune"],
    el: ["Έναρξη", "Παύση", "Συνέχεια", "Επαναφορά", "Γύρος", "Γύροι", "Ώρες", "Λεπτά", "Δευτερόλεπτα", "Χρόνος που απομένει", "Ο χρόνος έληξε", "Πόλεις του κόσμου", "Συγκέντρωση", "Διάλειμμα", "Συνεδρία"],
  });
  const labelKeys=["start","pause","resume","reset","lap","laps","hours","minutes","seconds","remaining","done","cities","focus","break","session"];
  const t={...labels[locale],...(translated[locale]?Object.fromEntries(labelKeys.map((key,index)=>[key,translated[locale][index]])): {})};
  const cityNames:Record<string,string[]>={es:["Seúl","Tokio","Nueva York","Los Ángeles","Londres","París","Singapur","Sídney"],"pt-br":["Seul","Tóquio","Nova York","Los Angeles","Londres","Paris","Singapura","Sydney"],de:["Seoul","Tokio","New York","Los Angeles","London","Paris","Singapur","Sydney"],fr:["Séoul","Tokyo","New York","Los Angeles","Londres","Paris","Singapour","Sydney"],vi:["Seoul","Tokyo","New York","Los Angeles","Luân Đôn","Paris","Singapore","Sydney"],id:["Seoul","Tokyo","New York","Los Angeles","London","Paris","Singapura","Sydney"],th:["โซล","โตเกียว","นิวยอร์ก","ลอสแอนเจลิส","ลอนดอน","ปารีส","สิงคโปร์","ซิดนีย์"],"zh-tw":["首爾","東京","紐約","洛杉磯","倫敦","巴黎","新加坡","雪梨"],it:["Seoul","Tokyo","New York","Los Angeles","Londra","Parigi","Singapore","Sydney"],nl:["Seoel","Tokio","New York","Los Angeles","Londen","Parijs","Singapore","Sydney"],hi:["सियोल","टोक्यो","न्यूयॉर्क","लॉस एंजिलिस","लंदन","पेरिस","सिंगापुर","सिडनी"]}; const [running,setRunning]=useState(false); const [hours,setHours]=useState(0); const [minutes,setMinutes]=useState(slug==="pomodoro-timer"?25:0); const [seconds,setSeconds]=useState(0); const [remaining,setRemaining]=useState(0); const [clock,setClock]=useState(0); const [mode,setMode]=useState(false); const [hasStarted,setHasStarted]=useState(false);
  useEffect(()=>{if(slug==="stopwatch")return;let previous=Date.now(),timerElapsed=0;const id=window.setInterval(()=>{const now=Date.now(),delta=now-previous;setClock(now);if(running){timerElapsed+=delta;if(timerElapsed>=1000){const secondsPassed=Math.floor(timerElapsed/1000);timerElapsed%=1000;if(remaining<=secondsPassed)setRunning(false);setRemaining(v=>Math.max(0,v-secondsPassed));}}previous=now;},250);return()=>window.clearInterval(id);},[running,slug,remaining]);
  const format=(n:number)=>{const total=Math.floor(n/1000);return `${String(Math.floor(total/3600)).padStart(2,"0")}:${String(Math.floor(total/60)%60).padStart(2,"0")}:${String(total%60).padStart(2,"0")}.${String(n%1000).padStart(3,"0")}`;};
  if(slug==="world-clock") { const cities=[["Seoul","Asia/Seoul"],["Tokyo","Asia/Tokyo"],["New York","America/New_York"],["Los Angeles","America/Los_Angeles"],["London","Europe/London"],["Paris","Europe/Paris"],["Singapore","Asia/Singapore"],["Sydney","Australia/Sydney"]] as const; const localizedCities=cityNames[locale]??cities.map(([name])=>name); return <section className="rounded-3xl border bg-white p-6"><h2 className="text-xl font-semibold">{t.cities}</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{cities.map(([city,zone],index)=><article key={zone} className="rounded-xl bg-slate-50 p-4"><h3 className="font-medium">{localizedCities[index]??city}</h3><p className="mt-1 font-mono text-2xl">{new Intl.DateTimeFormat(locale,{timeZone:zone,hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(clock)}</p><p className="text-sm text-slate-500">{new Intl.DateTimeFormat(locale,{timeZone:zone,dateStyle:"medium"}).format(clock)}</p></article>)}</div></section>; }
  if(slug==="stopwatch")return <Stopwatch labels={t}/>;
  const begin=(next:number)=>{setRemaining(next);setRunning(true);setHasStarted(true)}; const timerMode=slug==="timer"; const total=timerMode?(hours*3600+minutes*60+seconds):mode?5*60:25*60;
  return <section className="rounded-3xl border bg-white p-6 text-center"><p className="text-sm font-medium text-slate-500">{slug==="pomodoro-timer"?`${mode?t.break:t.focus} · ${t.session}`:t.remaining}</p><p className="mt-2 font-mono text-5xl tabular-nums sm:text-6xl">{format(remaining*1000).slice(0,8)}</p>{!running&&<div className="mx-auto mt-5 grid max-w-md grid-cols-3 gap-3">{[[t.hours,hours,setHours],[t.minutes,minutes,setMinutes],[t.seconds,seconds,setSeconds]].map(([label,value,setter])=><label key={String(label)} className="text-sm">{String(label)}<input type="number" min="0" max="999" value={Number(value)} onChange={e=>(setter as (n:number)=>void)(Math.max(0,Number(e.target.value)||0))} className="mt-1 w-full rounded-lg border p-2 text-center" /></label>)}</div>}<div className="mt-5 flex flex-wrap justify-center gap-3"><button className="rounded-xl bg-indigo-600 px-5 py-3 text-white" onClick={()=>running?setRunning(false):begin(remaining||total)}>{running?t.pause:t.start}</button><button className="rounded-xl border px-5 py-3" onClick={()=>{setRunning(false);setRemaining(0);setHasStarted(false)}}>{t.reset}</button>{slug==="pomodoro-timer"&&<button className="rounded-xl border px-5 py-3" onClick={()=>{setMode(!mode);setRunning(false);setRemaining((mode?25:5)*60)}}>{mode?t.focus:t.break}</button>}</div>{hasStarted&&remaining===0&&!running&&<p aria-live="polite" className="mt-4 text-amber-700">{t.done}</p>}</section>;
}

export function RussianStopwatchWorkspace() { return <DateTimeTool slug="stopwatch" locale="ru" />; }
export function TurkishStopwatchWorkspace() { return <DateTimeTool slug="stopwatch" locale="tr" />; }

function Stopwatch({labels}:{labels:Record<string,string>}) {
  const [running,setRunning]=useState(false);
  const [elapsed,setElapsed]=useState(0);
  const [laps,setLaps]=useState<number[]>([]);
  const accumulatedRef=useRef(0);
  const [startedAt,setStartedAt]=useState<number | null>(null);
  const toggle=()=>{
    if(running){
      const now=performance.now();
      const total=accumulatedRef.current+(now-(startedAt??now));
      accumulatedRef.current=total;
      setStartedAt(null);
      setElapsed(total);
      setRunning(false);
    }else{
      setStartedAt(performance.now());
      setRunning(true);
    }
  };
  const lap=()=>{
    const current=accumulatedRef.current+(startedAt===null?0:performance.now()-startedAt);
    setLaps((items)=>[current,...items].slice(0,100));
  };
  const reset=()=>{setStartedAt(null);accumulatedRef.current=0;setElapsed(0);setLaps([]);setRunning(false);};
  return <section className="rounded-3xl border bg-white p-6 text-center"><StopwatchReadout accumulated={elapsed} startedAt={startedAt} running={running}/><div className="mt-6 flex flex-wrap justify-center gap-3"><button className="rounded-xl bg-indigo-600 px-5 py-3 text-white" onClick={toggle}>{running?labels.pause:elapsed?labels.resume:labels.start}</button><button className="rounded-xl border px-5 py-3" onClick={reset}>{labels.reset}</button><button disabled={!running} className="rounded-xl border px-5 py-3 disabled:opacity-50" onClick={lap}>{labels.lap}</button></div>{laps.length>0&&<><h3 className="mt-6 text-left font-semibold">{labels.laps}</h3><ol className="mt-2 space-y-2 text-left">{laps.map((value,index)=>{const split=value-(index===laps.length-1?0:laps[index+1]);return <li key={`${value}-${index}`} className="grid grid-cols-3 items-center border-b py-2 text-sm"><span>{labels.laps} {laps.length-index}</span><span className="font-mono text-slate-600">{formatStopwatch(split)}</span><span className="text-right font-mono">{formatStopwatch(value)}</span></li>})}</ol></>}</section>;
}

function StopwatchReadout({accumulated,startedAt,running}:{accumulated:number;startedAt:number|null;running:boolean}) {
  const [displayed,setDisplayed]=useState(accumulated);
  useEffect(()=>{
    if(!running||startedAt===null)return;
    let frame=0;
    let lastHundredth=-1;
    const update=()=>{
      const elapsed=accumulated+(performance.now()-startedAt);
      const hundredth=Math.floor(elapsed/10);
      if(hundredth!==lastHundredth){lastHundredth=hundredth;setDisplayed(hundredth*10);}
      frame=window.requestAnimationFrame(update);
    };
    frame=window.requestAnimationFrame(update);
    return()=>window.cancelAnimationFrame(frame);
  },[accumulated,startedAt,running]);
  return <p className="font-mono text-4xl tabular-nums sm:text-6xl">{formatStopwatch(running?displayed:accumulated)}</p>;
}

function formatStopwatch(milliseconds:number){
  const totalSeconds=Math.floor(milliseconds/1000);
  const hours=Math.floor(totalSeconds/3600);
  const minutes=Math.floor(totalSeconds/60)%60;
  const seconds=totalSeconds%60;
  const hundredths=Math.floor(milliseconds/10)%100;
  return `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}.${String(hundredths).padStart(2,"0")}`;
}
