"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { processImage } from "@/lib/image/process-image";

export type RussianImageEffectSlug = "image-compress" | "image-resize" | "image-crop" | "image-rotate" | "image-flip" | "image-grayscale" | "image-brightness" | "image-contrast" | "image-blur" | "image-pixelate" | "social-image-resize" | "add-text-to-image";

const titles: Record<RussianImageEffectSlug, string> = {
  "image-compress": "Сжатие изображения",
  "image-resize": "Изменение размера изображения",
  "image-crop": "Обрезка изображения",
  "image-rotate": "Поворот изображения",
  "image-flip": "Отражение изображения",
  "image-grayscale": "Чёрно-белое изображение",
  "image-brightness": "Яркость изображения",
  "image-contrast": "Контрастность изображения",
  "image-blur": "Размытие изображения",
  "image-pixelate": "Пикселизация изображения",
  "social-image-resize": "Изменение размера изображения для социальных сетей",
  "add-text-to-image": "Добавление текста на изображение",
};

const maxBytes = 30 * 1024 * 1024;

export function RussianImageEffectsWorkspace({ slug }: { slug: RussianImageEffectSlug }) {
  const [file, setFile] = useState<File>();
  const [outputUrl, setOutputUrl] = useState("");
  const [outputName, setOutputName] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [quality, setQuality] = useState(82);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [keepRatio, setKeepRatio] = useState(true);
  const [amount, setAmount] = useState(25);
  const [option, setOption] = useState(slug === "image-crop" ? "1" : slug === "image-rotate" ? "90" : "horizontal");
  const [caption, setCaption] = useState("");

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
    if (!selected.type.startsWith("image/")) {
      setError("Выберите файл изображения.");
      return;
    }
    setFile(selected);
  }

  async function process() {
    if (!file) {
      setError("Сначала выберите изображение.");
      return;
    }
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const processed = await processImage(slug, file, { quality: quality / 100, width, height, keepRatio, amount, option, text: caption }, "ru");
      if (!processed.blob) throw new Error("No image output");
      const url = URL.createObjectURL(processed.blob);
      setOutputUrl(url);
      setOutputName(`${file.name.replace(/\.[^.]+$/, "") || "image"}-${slug}.${slug.includes("png") ? "png" : slug.includes("webp") ? "webp" : "jpg"}`);
      setStatus(`Готово. Размер результата: ${(processed.blob.size / 1024).toFixed(1)} КБ.`);
    } catch {
      setError("Не удалось обработать изображение. Проверьте файл и попробуйте снова.");
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
    setCaption("");
  }

  return (
    <section aria-label={titles[slug]} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <label htmlFor="image-effect-file" className="block text-sm font-medium text-slate-800">
        Изображение
        <input id="image-effect-file" type="file" accept="image/*,.heic,.heif" onChange={(event) => selectFile(event.currentTarget.files?.[0])} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 text-sm" />
      </label>
      <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files[0]); }} className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-600">
        Перетащите сюда изображение. Обработка выполняется в браузере, лимит файла — 30 МБ.
      </div>
      {file && <p className="mt-3 break-all text-sm text-slate-600">Выбран файл: {file.name}</p>}
      {slug === "image-compress" && <label className="mt-5 block text-sm">Качество: {quality}%<input type="range" min="30" max="100" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="mt-2 block w-full accent-indigo-600" /></label>}
      {slug === "image-resize" && <div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="text-sm">Ширина<input type="number" min="1" max="12000" value={width} onChange={(event) => setWidth(Number(event.target.value))} className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 p-2" /></label><label className="text-sm">Высота<input type="number" min="1" max="12000" value={height} onChange={(event) => setHeight(Number(event.target.value))} disabled={keepRatio} className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 p-2 disabled:bg-slate-100" /></label><label className="flex min-h-11 items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={keepRatio} onChange={(event) => setKeepRatio(event.target.checked)} />Сохранить пропорции</label></div>}
      {slug === "image-crop" && <label className="mt-5 block text-sm">Соотношение сторон<select value={option} onChange={(event) => setOption(event.target.value)} className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 p-2"><option value="1">1:1 — квадрат</option><option value="0.75">3:4 — портрет</option><option value="1.5">3:2 — альбом</option><option value="1.7778">16:9 — широкий формат</option></select></label>}
      {slug === "image-rotate" && <label className="mt-5 block text-sm">Угол поворота<select value={option} onChange={(event) => setOption(event.target.value)} className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 p-2"><option value="90">90°</option><option value="180">180°</option><option value="270">270°</option></select></label>}
      {slug === "image-flip" && <label className="mt-5 block text-sm">Направление отражения<select value={option} onChange={(event) => setOption(event.target.value)} className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 p-2"><option value="horizontal">По горизонтали</option><option value="vertical">По вертикали</option></select></label>}
      {slug === "social-image-resize" && <label className="mt-5 block text-sm">Формат для платформы<select value={option} onChange={(event) => setOption(event.target.value)} className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 p-2"><option value="square">Instagram · квадрат 1080 × 1080</option><option value="portrait">Instagram · публикация 1080 × 1350</option><option value="story">История · 1080 × 1920</option><option value="youtube">YouTube · обложка 1280 × 720</option><option value="x">X · публикация 1600 × 900</option><option value="facebook">Facebook · публикация 1200 × 630</option></select></label>}
      {slug === "add-text-to-image" && <label className="mt-5 block text-sm">Текст на изображении<input value={caption} onChange={(event) => setCaption(event.target.value)} maxLength={160} placeholder="Введите надпись (до 160 символов)" className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3" /></label>}
      {["image-brightness", "image-contrast", "image-blur", "image-pixelate"].includes(slug) && <label className="mt-5 block text-sm">{slug === "image-brightness" ? "Яркость" : slug === "image-contrast" ? "Контрастность" : slug === "image-blur" ? "Сила размытия" : "Размер пикселя"}: {amount}<input type="range" min={slug === "image-pixelate" ? 4 : 0} max={slug === "image-blur" ? 100 : slug === "image-pixelate" ? 80 : 200} value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="mt-2 block w-full accent-indigo-600" /></label>}
      <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void process()} disabled={busy} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60">{busy ? "Обработка…" : "Обработать изображение"}</button><button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Сбросить</button></div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
      {status && outputUrl && <div className="mt-5 space-y-3"><p role="status" aria-live="polite" className="text-sm text-emerald-800">{status}</p><div className="relative h-96 w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200"><Image src={outputUrl} alt={`Результат: ${titles[slug]}`} fill unoptimized sizes="(max-width: 768px) 100vw, 672px" className="object-contain" /></div><a href={outputUrl} download={outputName} className="inline-flex min-h-12 items-center rounded-xl bg-emerald-700 px-5 font-semibold text-white">Скачать {outputName}</a></div>}
    </section>
  );
}
