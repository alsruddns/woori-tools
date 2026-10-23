"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { processImage } from "@/lib/image/process-image";

const russianCopy = {
  title: "Разделение изображения на сетку Instagram",
  choose: "Выберите изображение или перетащите его сюда",
  format: "Количество квадратных фрагментов",
  process: "Разделить изображение",
  processing: "Обработка…",
  download: "Скачать ZIP-архив",
  reset: "Сбросить",
  imageOnly: "Выберите файл изображения.",
  tooLarge: "Размер изображения не должен превышать 30 МБ.",
} as const;

const turkishCopy = { title:"Instagram i\u00E7in g\u00F6rseli karelere b\u00F6l",choose:"Bir g\u00F6rsel se\u00E7in veya buraya b\u0131rak\u0131n",format:"Kare par\u00E7a d\u00FCzeni",process:"G\u00F6rseli b\u00F6l",processing:"\u0130\u015Fleniyor?",download:"ZIP ar\u015Fivini indir",reset:"S\u0131f\u0131rla",imageOnly:"Bir g\u00F6rsel dosyas\u0131 se\u00E7in.",tooLarge:"G\u00F6rsel 30 MB boyut s\u0131n\u0131r\u0131n\u0131 a\u015Fmamal\u0131d\u0131r." } as const;

const polishCopy = { title:"Podziel obraz na kafelki na Instagram",choose:"Wybierz obraz lub przeciągnij go tutaj",format:"Układ kwadratowych kafelków",process:"Podziel obraz",processing:"Przetwarzanie…",download:"Pobierz archiwum ZIP",reset:"Wyczyść wybór",imageOnly:"Wybierz plik obrazu.",tooLarge:"Obraz nie może przekraczać 30 MB." } as const;

const gridOptions = [
  { value: 3, label: "3 фрагмента · 3 × 1" },
  { value: 6, label: "6 фрагментов · 3 × 2" },
  { value: 9, label: "9 фрагментов · 3 × 3" },
] as const;

export function RussianInstagramGridWorkspace({ locale = "ru" }: { locale?: "ru" | "tr" | "pl" }) {
  const copy = locale === "tr" ? turkishCopy : locale === "pl" ? polishCopy : russianCopy;
  const options = locale === "tr" ? [{value:3,label:"3 kare (3 × 1)"},{value:6,label:"6 kare (3 × 2)"},{value:9,label:"9 kare (3 × 3)"}] : locale === "pl" ? [{value:3,label:"3 kafelki (3 × 1)"},{value:6,label:"6 kafelków (3 × 2)"},{value:9,label:"9 kafelków (3 × 3)"}] : gridOptions;
  const [file, setFile] = useState<File | null>(null);
  const [tileCount, setTileCount] = useState(9);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  }, [previewUrl, downloadUrl]);

  function selectImage(candidate?: File) {
    if (!candidate) return;
    setError(""); setResult(""); setDownloadUrl("");
    if (!candidate.type.startsWith("image/") && !/\.(heic|heif)$/i.test(candidate.name)) { setFile(null); setPreviewUrl(""); setError(copy.imageOnly); return; }
    if (candidate.size > 30 * 1024 * 1024) { setFile(null); setPreviewUrl(""); setError(copy.tooLarge); return; }
    setFile(candidate);
    setPreviewUrl(URL.createObjectURL(candidate));
  }

  async function split() {
    if (!file) { setError(copy.imageOnly); return; }
    setBusy(true); setError(""); setResult(""); setDownloadUrl("");
    try {
      const processed = await processImage("instagram-grid-split", file, {
        quality: 0.82, width: 800, height: 600, keepRatio: true, amount: 25,
        option: String(tileCount),
      }, locale === "pl" ? "en" : locale);
      if (!processed.blob) throw new Error(locale === "pl" ? "Nie udało się utworzyć archiwum ZIP." : "Не удалось создать ZIP-архив.");
      setDownloadUrl(URL.createObjectURL(processed.blob));
      setResult(locale === "pl" ? `Utworzono ${tileCount} kwadratowych kafelków.` : processed.result);
    } catch (cause) {
      if (locale === "pl") { setError("Nie udało się przetworzyć obrazu."); return; }
      if (locale === "tr") { setError("G\u00F6rsel i\u015Flenirken bir sorun olu\u015Ftu."); return; }
      setError(cause instanceof Error ? cause.message : "Не удалось обработать изображение.");
    } finally { setBusy(false); }
  }

  function reset() {
    setFile(null); setPreviewUrl(""); setDownloadUrl(""); setResult(""); setError("");
  }

  return <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <label htmlFor="instagram-grid-file" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectImage(event.dataTransfer.files[0]); }}
      className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:border-indigo-400">
      <span className="font-semibold text-slate-800">{copy.choose}</span>
      <span className="mt-2 text-sm text-slate-500">{locale === "tr" ? "JPEG, PNG, WebP veya HEIC · en fazla 30 MB" : locale === "pl" ? "JPEG, PNG, WebP lub HEIC · maks. 30 MB" : "JPEG, PNG, WebP или HEIC · до 30 МБ"}</span>
    </label>
    <input id="instagram-grid-file" type="file" accept="image/*,.heic,.heif" onChange={(event) => selectImage(event.target.files?.[0])} className="sr-only" />
    {file && <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-4 text-sm">
      <span className="truncate">{file.name} ? {(file.size / 1024 / 1024).toFixed(2)} MB</span>
      <button type="button" onClick={reset} className="shrink-0 font-medium text-rose-700 underline">{copy.reset}</button>
    </div>}
    {previewUrl && !/\.(heic|heif)$/i.test(file?.name ?? "") && <Image unoptimized src={previewUrl} alt={locale === "tr" ? "Se\u00E7ilen g\u00F6rselin \u00F6nizlemesi" : locale === "pl" ? "Podgląd wybranego obrazu" : "Предварительный просмотр выбранного изображения"} width={960} height={600} className="mt-4 max-h-72 max-w-full rounded-xl border border-slate-200 object-contain" />}
    <label htmlFor="instagram-grid-count" className="mt-5 block text-sm font-medium text-slate-800">{copy.format}
      <select id="instagram-grid-count" value={tileCount} onChange={(event) => setTileCount(Number(event.target.value))} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 sm:max-w-md">
        {options.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
      </select>
    </label>
    <div className="mt-5 flex flex-wrap gap-3">
      <button type="button" onClick={() => void split()} disabled={busy} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60">{busy ? copy.processing : copy.process}</button>
      {downloadUrl && <a href={downloadUrl} download="instagram-grid.zip" className="inline-flex min-h-12 items-center rounded-xl bg-emerald-700 px-5 font-semibold text-white">{copy.download}</a>}
    </div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {result && <p role="status" aria-live="polite" className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">{result}</p>}
  </section>;
}
