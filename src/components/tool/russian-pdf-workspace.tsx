"use client";

import { useEffect, useState } from "react";
import { processPdf } from "@/lib/pdf/process-pdf";

export type RussianPdfSlug = "images-to-pdf" | "pdf-merge" | "pdf-split" | "pdf-delete-pages" | "pdf-reorder-pages" | "pdf-rotate-pages" | "pdf-add-page-numbers" | "pdf-watermark" | "pdf-metadata-viewer" | "pdf-remove-metadata" | "pdf-page-size-checker";

const titles: Record<RussianPdfSlug, string> = {
  "images-to-pdf": "Изображения в PDF", "pdf-merge": "Объединение PDF", "pdf-split": "Разделение PDF",
  "pdf-delete-pages": "Удаление страниц PDF", "pdf-reorder-pages": "Изменение порядка страниц PDF",
  "pdf-rotate-pages": "Поворот страниц PDF", "pdf-add-page-numbers": "Нумерация страниц PDF",
  "pdf-watermark": "Водяной знак PDF", "pdf-metadata-viewer": "Метаданные PDF",
  "pdf-remove-metadata": "Удаление метаданных PDF", "pdf-page-size-checker": "Размер страницы PDF",
};
const multiFileSlugs: RussianPdfSlug[] = ["images-to-pdf", "pdf-merge"];

export function RussianPdfWorkspace({ slug }: { slug: RussianPdfSlug }) {
  const [files, setFiles] = useState<File[]>([]);
  const [option, setOption] = useState(slug === "pdf-rotate-pages" ? "90" : "");
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [outputUrl, setOutputUrl] = useState("");
  const [outputName, setOutputName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => () => { if (outputUrl) URL.revokeObjectURL(outputUrl); }, [outputUrl]);

  function select(selected: FileList | null) {
    setFiles([]); setResult(""); setError(""); setOutputUrl(""); setOutputName("");
    if (!selected?.length) return;
    const chosen = Array.from(selected).slice(0, multiFileSlugs.includes(slug) ? 20 : 1);
    if (chosen.some((file) => file.size > 50 * 1024 * 1024)) { setError("Размер каждого файла не должен превышать 50 МБ."); return; }
    const images = slug === "images-to-pdf";
    if (chosen.some((file) => images ? !file.type.startsWith("image/") : file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf"))) { setError(images ? "Выберите файлы изображений." : "Выберите PDF-файл."); return; }
    setFiles(chosen);
  }

  async function run() {
    if (!files.length) { setError(slug === "images-to-pdf" ? "Выберите хотя бы одно изображение." : "Выберите PDF-файл."); return; }
    setBusy(true); setResult(""); setError("");
    try {
      if (slug === "pdf-page-size-checker") {
        const { PDFDocument } = await import("pdf-lib");
        const pdf = await PDFDocument.load(await files[0].arrayBuffer());
        setResult(pdf.getPages().map((page, index) => { const size = page.getSize(); return `Страница ${index + 1}: ${size.width.toFixed(1)} × ${size.height.toFixed(1)} пт (${(size.width / 72).toFixed(2)} × ${(size.height / 72).toFixed(2)} дюйма)`; }).join("\n"));
        return;
      }
      const processed = await processPdf(slug, files, option, text, "ru");
      setResult(slug === "pdf-metadata-viewer" ? processed.result : `Обработка завершена. Размер результата: ${((processed.blob?.size ?? 0) / 1024).toFixed(1)} КБ.`);
      if (processed.blob) {
        setOutputUrl(URL.createObjectURL(processed.blob));
        setOutputName(`${files[0].name.replace(/\.pdf$/i, "") || "document"}-${slug}.pdf`);
      }
    } catch {
      setError("Не удалось обработать файл. Проверьте его и параметры, затем попробуйте снова.");
    } finally { setBusy(false); }
  }

  function reset() { setFiles([]); setResult(""); setError(""); setOutputUrl(""); setOutputName(""); setOption(""); setText(""); }
  const accept = slug === "images-to-pdf" ? "image/*" : "application/pdf,.pdf";

  return <section aria-label={titles[slug]} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <label htmlFor="pdf-input" className="block text-sm font-medium text-slate-800">{slug === "images-to-pdf" ? "Изображения" : "PDF-файл"}<input id="pdf-input" type="file" accept={accept} multiple={multiFileSlugs.includes(slug)} onChange={(event) => select(event.currentTarget.files)} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 text-sm" /></label>
    <p className="mt-3 text-sm text-slate-600">Файлы обрабатываются в браузере. Максимальный размер — 50 МБ на файл.</p>
    {files.length > 0 && <ul className="mt-3 list-inside list-disc break-all text-sm text-slate-600">{files.map((file) => <li key={`${file.name}-${file.size}`}>{file.name}</li>)}</ul>}
    {["pdf-split", "pdf-delete-pages"].includes(slug) && <label className="mt-5 block text-sm">Страницы или диапазоны, например 1, 3-5<input value={option} onChange={(event) => setOption(event.target.value)} placeholder="1, 3-5" className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 p-3" /></label>}
    {slug === "pdf-reorder-pages" && <label className="mt-5 block text-sm">Новый порядок страниц<input value={option} onChange={(event) => setOption(event.target.value)} placeholder="3, 1, 2" className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 p-3" /></label>}
    {slug === "pdf-rotate-pages" && <label className="mt-5 block text-sm">Угол поворота<select value={option} onChange={(event) => setOption(event.target.value)} className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 p-3"><option value="90">90°</option><option value="180">180°</option><option value="270">270°</option></select></label>}
    {slug === "pdf-watermark" && <label className="mt-5 block text-sm">Текст водяного знака<input value={text} onChange={(event) => setText(event.target.value)} placeholder="Woori Tools" className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 p-3" /></label>}
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void run()} disabled={busy} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60">{busy ? "Обработка…" : "Обработать"}</button><button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Сбросить</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {result && <div className="mt-5 space-y-3"><h2 className="font-semibold">Результат</h2><pre role="status" aria-live="polite" className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{result}</pre>{outputUrl && <a href={outputUrl} download={outputName} className="inline-flex min-h-12 items-center rounded-xl bg-emerald-700 px-5 font-semibold text-white">Скачать {outputName}</a>}</div>}
  </section>;
}
