"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const copy = {
  title: "Создание фотоколлажа",
  choose: "Выберите изображения или перетащите их сюда",
  limit: "Добавьте от 2 до 6 изображений · до 30 МБ на файл · до 100 МБ всего",
  layout: "Макет коллажа",
  four: "4 фотографии · 2 × 2",
  six: "6 фотографий · 3 × 2",
  create: "Создать коллаж",
  processing: "Создание коллажа…",
  download: "Скачать коллаж",
  clear: "Очистить выбор",
  count: (maximum: number) => `Для этого макета выберите от 2 до ${maximum} изображений.`,
  type: "Выберите только файлы изображений.",
  fileSize: "Размер каждого файла не должен превышать 30 МБ.",
  totalSize: "Общий размер выбранных файлов не должен превышать 100 МБ.",
  pixels: "Общее количество пикселей превышает безопасный лимит обработки.",
  canvas: "Не удалось запустить обработку изображений.",
  output: "Не удалось создать файл коллажа.",
  result: (count: number, width: number, height: number) => `Создан коллаж из ${count} фотографий · ${width} × ${height} пикс.`,
} as const;

export function RussianImageCollageWorkspace() {
  const [files, setFiles] = useState<File[]>([]);
  const [layout, setLayout] = useState<"4" | "6">("4");
  const [quality, setQuality] = useState(0.82);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [outputUrl, setOutputUrl] = useState("");

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
  }, [previewUrl, outputUrl]);

  function chooseFiles(list?: FileList | File[]) {
    if (!list) return;
    const selected = Array.from(list);
    setError(""); setResult(""); setOutputUrl("");
    if (selected.some((file) => !file.type.startsWith("image/") && !/\.(heic|heif)$/i.test(file.name))) { setFiles([]); setPreviewUrl(""); setError(copy.type); return; }
    if (selected.some((file) => file.size > 30 * 1024 * 1024)) { setFiles([]); setPreviewUrl(""); setError(copy.fileSize); return; }
    if (selected.length > 6 || selected.reduce((sum, file) => sum + file.size, 0) > 100 * 1024 * 1024) { setFiles([]); setPreviewUrl(""); setError(copy.totalSize); return; }
    setFiles(selected);
    const previewable = selected.find((file) => !/\.(heic|heif)$/i.test(file.name));
    setPreviewUrl(previewable ? URL.createObjectURL(previewable) : "");
  }

  async function createCollage() {
    const columns = layout === "6" ? 3 : 2;
    const maximum = columns * 2;
    if (files.length < 2 || files.length > maximum) { setError(copy.count(maximum)); return; }
    setBusy(true); setError(""); setResult(""); setOutputUrl("");
    const bitmaps: ImageBitmap[] = [];
    const canvas = document.createElement("canvas");
    try {
      bitmaps.push(...await Promise.all(files.map((file) => createImageBitmap(file))));
      if (bitmaps.reduce((sum, bitmap) => sum + bitmap.width * bitmap.height, 0) > 80_000_000) throw new Error(copy.pixels);
      const cell = 480, gap = 12, rows = 2;
      canvas.width = columns * cell + (columns + 1) * gap;
      canvas.height = rows * cell + (rows + 1) * gap;
      const context = canvas.getContext("2d");
      if (!context) throw new Error(copy.canvas);
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      bitmaps.forEach((bitmap, index) => {
        const ratio = Math.max(cell / bitmap.width, cell / bitmap.height);
        const sourceWidth = cell / ratio, sourceHeight = cell / ratio;
        const sourceX = (bitmap.width - sourceWidth) / 2, sourceY = (bitmap.height - sourceHeight) / 2;
        const x = gap + (index % columns) * (cell + gap), y = gap + Math.floor(index / columns) * (cell + gap);
        context.drawImage(bitmap, sourceX, sourceY, sourceWidth, sourceHeight, x, y, cell, cell);
      });
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error(copy.output)), "image/jpeg", quality));
      setOutputUrl(URL.createObjectURL(blob));
      setResult(copy.result(files.length, canvas.width, canvas.height));
    } catch (cause) { setError(cause instanceof Error ? cause.message : copy.output); }
    finally { bitmaps.forEach((bitmap) => bitmap.close()); canvas.width = 0; canvas.height = 0; setBusy(false); }
  }

  function clear() { setFiles([]); setPreviewUrl(""); setOutputUrl(""); setResult(""); setError(""); }

  return <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <label htmlFor="image-collage-files" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFiles(event.dataTransfer.files); }}
      className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:border-indigo-400">
      <span className="font-semibold text-slate-800">{copy.choose}</span><span className="mt-2 text-sm text-slate-500">{copy.limit}</span>
    </label>
    <input id="image-collage-files" type="file" accept="image/*,.heic,.heif" multiple onChange={(event) => chooseFiles(event.target.files ?? undefined)} className="sr-only" />
    {files.length > 0 && <div className="mt-4 rounded-xl bg-slate-50 p-4"><ul className="space-y-2 text-sm">{files.map((file, index) => <li key={`${file.name}-${index}`} className="flex justify-between gap-3"><span className="truncate">{file.name}</span><span className="shrink-0 text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} МБ</span></li>)}</ul><button type="button" onClick={clear} className="mt-3 text-sm font-medium text-rose-700 underline">{copy.clear}</button></div>}
    {previewUrl && <Image unoptimized src={previewUrl} alt="Предварительный просмотр выбранного изображения" width={960} height={600} className="mt-4 max-h-72 max-w-full rounded-xl border border-slate-200 object-contain" />}
    <label htmlFor="image-collage-layout" className="mt-5 block text-sm font-medium text-slate-800">{copy.layout}<select id="image-collage-layout" value={layout} onChange={(event) => setLayout(event.target.value === "6" ? "6" : "4")} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 sm:max-w-md"><option value="4">{copy.four}</option><option value="6">{copy.six}</option></select></label>
    <label htmlFor="image-collage-quality" className="mt-4 block text-sm font-medium text-slate-800">Качество JPEG · {Math.round(quality * 100)}%<input id="image-collage-quality" type="range" min="0.4" max="1" step="0.02" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="mt-2 block w-full sm:max-w-md" /></label>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void createCollage()} disabled={busy} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60">{busy ? copy.processing : copy.create}</button>{outputUrl && <a href={outputUrl} download="image-collage.jpg" className="inline-flex min-h-12 items-center rounded-xl bg-emerald-700 px-5 font-semibold text-white">{copy.download}</a>}</div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}{result && <p role="status" aria-live="polite" className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">{result}</p>}
  </section>;
}
