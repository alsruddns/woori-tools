"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { processImage } from "@/lib/image/process-image";

export type RussianImageUtilitySlug = "remove-image-metadata" | "image-info" | "favicon-generator";

const titles: Record<RussianImageUtilitySlug, string> = {
  "remove-image-metadata": "Удаление метаданных изображения",
  "image-info": "Информация об изображении",
  "favicon-generator": "Генератор favicon",
};

export function RussianImageUtilityWorkspace({ slug }: { slug: RussianImageUtilitySlug }) {
  const [file, setFile] = useState<File>();
  const [outputUrl, setOutputUrl] = useState("");
  const [outputName, setOutputName] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => () => { if (outputUrl) URL.revokeObjectURL(outputUrl); }, [outputUrl]);

  function choose(selected?: File) {
    setFile(undefined);
    setOutputUrl("");
    setOutputName("");
    setResult("");
    setError("");
    if (!selected) return;
    if (selected.size > 30 * 1024 * 1024) {
      setError("Размер файла не должен превышать 30 МБ.");
      return;
    }
    if (!selected.type.startsWith("image/")) {
      setError("Выберите файл изображения.");
      return;
    }
    setFile(selected);
  }

  async function run() {
    if (!file) { setError("Сначала выберите изображение."); return; }
    setBusy(true);
    setError("");
    setResult("");
    try {
      if (slug === "image-info") {
        const bitmap = await createImageBitmap(file);
        setResult(`Имя файла: ${file.name}\nТип: ${file.type || "неизвестно"}\nРазмер: ${(file.size / 1024).toFixed(1)} КБ\nШирина: ${bitmap.width} пикс.\nВысота: ${bitmap.height} пикс.\nСоотношение сторон: ${(bitmap.width / bitmap.height).toFixed(3)}:1`);
        bitmap.close();
      } else {
        const processed = await processImage(slug, file, { quality: 0.9, width: 800, height: 600, keepRatio: true, amount: 25, option: "" }, "ru");
        if (!processed.blob) throw new Error("No image output");
        setOutputUrl(URL.createObjectURL(processed.blob));
        const extension = slug === "favicon-generator" ? "png" : "jpg";
        setOutputName(`${file.name.replace(/\.[^.]+$/, "") || "image"}-${slug}.${extension}`);
        setResult(`Готово. Размер результата: ${(processed.blob.size / 1024).toFixed(1)} КБ.`);
      }
    } catch {
      setError("Не удалось обработать изображение. Проверьте файл и попробуйте снова.");
    } finally {
      setBusy(false);
    }
  }

  function reset() { setFile(undefined); setOutputUrl(""); setOutputName(""); setResult(""); setError(""); }

  return (
    <section aria-label={titles[slug]} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <label htmlFor="image-utility-file" className="block text-sm font-medium text-slate-800">Изображение<input id="image-utility-file" type="file" accept="image/*,.heic,.heif" onChange={(event) => choose(event.currentTarget.files?.[0])} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 text-sm" /></label>
      <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); choose(event.dataTransfer.files[0]); }} className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-600">Перетащите сюда изображение. Файл остаётся в браузере, лимит — 30 МБ.</div>
      {file && <p className="mt-3 break-all text-sm text-slate-600">Выбран файл: {file.name}</p>}
      <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void run()} disabled={busy} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60">{busy ? "Обработка…" : slug === "image-info" ? "Показать информацию" : "Обработать изображение"}</button><button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Сбросить</button></div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
      {result && <div className="mt-5 space-y-3"><h2 className="font-semibold">Результат</h2><pre role="status" aria-live="polite" className="whitespace-pre-wrap rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{result}</pre>{outputUrl && <><div className="relative h-96 w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200"><Image src={outputUrl} alt={`Результат: ${titles[slug]}`} fill unoptimized sizes="(max-width: 768px) 100vw, 672px" className="object-contain" /></div><a href={outputUrl} download={outputName} className="inline-flex min-h-12 items-center rounded-xl bg-emerald-700 px-5 font-semibold text-white">Скачать {outputName}</a></>}</div>}
    </section>
  );
}
