"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { processImage } from "@/lib/image/process-image";

export type RussianImageConversionSlug = "jpg-to-png" | "png-to-jpg" | "webp-to-jpg" | "webp-to-png" | "jpg-to-webp" | "png-to-webp" | "heic-to-jpg";

const formats: Record<RussianImageConversionSlug, { title: string; accept: string; output: string }> = {
  "jpg-to-png": { title: "JPG в PNG", accept: "image/jpeg,.jpg,.jpeg", output: "png" },
  "png-to-jpg": { title: "PNG в JPG", accept: "image/png,.png", output: "jpg" },
  "webp-to-jpg": { title: "WebP в JPG", accept: "image/webp,.webp", output: "jpg" },
  "webp-to-png": { title: "WebP в PNG", accept: "image/webp,.webp", output: "png" },
  "jpg-to-webp": { title: "JPG в WebP", accept: "image/jpeg,.jpg,.jpeg", output: "webp" },
  "png-to-webp": { title: "PNG в WebP", accept: "image/png,.png", output: "webp" },
  "heic-to-jpg": { title: "HEIC в JPG", accept: "image/heic,image/heif,.heic,.heif", output: "jpg" },
};

const maxBytes = 30 * 1024 * 1024;

export function RussianImageConversionWorkspace({ slug }: { slug: RussianImageConversionSlug }) {
  const format = formats[slug];
  const [file, setFile] = useState<File>();
  const [outputUrl, setOutputUrl] = useState("");
  const [outputName, setOutputName] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => () => { if (outputUrl) URL.revokeObjectURL(outputUrl); }, [outputUrl]);

  function selectFile(selected?: File) {
    setError("");
    setStatus("");
    setOutputUrl("");
    setOutputName("");
    setFile(undefined);
    if (!selected) return;
    if (selected.size > maxBytes) {
      setError("Размер файла не должен превышать 30 МБ.");
      return;
    }
    setFile(selected);
  }

  async function convert() {
    if (!file) {
      setError("Выберите изображение для преобразования.");
      return;
    }
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const processed = await processImage(slug, file, { quality: 0.9, width: 800, height: 600, keepRatio: true, amount: 25, option: "" }, "ru");
      if (!processed.blob) throw new Error("No image output");
      const url = URL.createObjectURL(processed.blob);
      setOutputUrl(url);
      const stem = file.name.replace(/\.[^.]+$/, "") || "image";
      setOutputName(`${stem}.${format.output}`);
      setStatus(`Готово. Размер результата: ${(processed.blob.size / 1024).toFixed(1)} КБ.`);
    } catch {
      setError("Не удалось преобразовать изображение. Проверьте файл и попробуйте снова.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFile(undefined);
    setOutputUrl("");
    setOutputName("");
    setStatus("");
    setError("");
  }

  return (
    <section aria-label={format.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <label htmlFor="image-conversion-file" className="block text-sm font-medium text-slate-800">
        Изображение для преобразования
        <input
          id="image-conversion-file"
          type="file"
          accept={format.accept}
          onChange={(event) => selectFile(event.currentTarget.files?.[0])}
          className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:font-medium file:text-indigo-800"
        />
      </label>
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files[0]); }}
        className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-600"
      >
        Перетащите сюда изображение. Файл обрабатывается только в браузере, максимум 30 МБ.
      </div>
      {file && <p className="mt-3 break-all text-sm text-slate-600">Выбран файл: {file.name}</p>}
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={() => void convert()} disabled={busy} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60">
          {busy ? "Преобразование…" : "Преобразовать"}
        </button>
        <button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Сбросить</button>
      </div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
      {status && outputUrl && (
        <div className="mt-5 space-y-3">
          <p role="status" aria-live="polite" className="text-sm text-emerald-800">{status}</p>
          <div className="relative h-96 w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200">
            <Image src={outputUrl} alt={`Результат: ${format.title}`} fill unoptimized sizes="(max-width: 768px) 100vw, 672px" className="object-contain" />
          </div>
          <a href={outputUrl} download={outputName} className="inline-flex min-h-12 items-center rounded-xl bg-emerald-700 px-5 font-semibold text-white">Скачать {outputName}</a>
        </div>
      )}
    </section>
  );
}
