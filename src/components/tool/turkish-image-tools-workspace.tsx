"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { processImage } from "@/lib/image/process-image";

type ImageToolSlug = "social-image-resize" | "add-text-to-image";

const labels: Record<ImageToolSlug, { title: string; file: string; drop: string; text: string; action: string; busy: string; reset: string; download: string; empty: string; invalid: string; tooLarge: string; failed: string; privacy: string }> = {
  "social-image-resize": {
    title: "Sosyal medya görseli boyutlandırıcı", file: "Görsel seçin", drop: "Görseli buraya sürükleyin veya dosya seçin", text: "Görsel biçimi", action: "Görseli boyutlandır", busy: "Görsel hazırlanıyor…", reset: "Sıfırla", download: "Görseli indir", empty: "Önce bir görsel seçin.", invalid: "JPG, PNG, WebP veya HEIC görseli seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Görsel işlenemedi. Başka bir dosya deneyin.", privacy: "Görseliniz tarayıcınızda işlenir ve sunucuya gönderilmez.",
  },
  "add-text-to-image": {
    title: "Görsele metin ekle", file: "Görsel seçin", drop: "Görseli buraya sürükleyin veya dosya seçin", text: "Görsel üzerine eklenecek metin", action: "Metni görsele ekle", busy: "Görsel hazırlanıyor…", reset: "Sıfırla", download: "Görseli indir", empty: "Bir görsel seçin ve eklenecek metni yazın.", invalid: "JPG, PNG, WebP veya HEIC görseli seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Görsel işlenemedi. Dosyayı ve metni kontrol edip yeniden deneyin.", privacy: "Görseliniz tarayıcınızda işlenir ve sunucuya gönderilmez.",
  },
};

const presets = [
  ["square", "Kare gönderi · 1080 × 1080"],
  ["portrait", "Dikey gönderi · 1080 × 1350"],
  ["story", "Hikâye veya Reels · 1080 × 1920"],
  ["youtube", "YouTube küçük resmi · 1280 × 720"],
  ["x", "X gönderisi · 1600 × 900"],
  ["facebook", "Facebook gönderisi · 1200 × 630"],
] as const;

export function TurkishImageToolsWorkspace({ slug }: { slug: ImageToolSlug }) {
  const copy = labels[slug];
  const [file, setFile] = useState<File>();
  const [caption, setCaption] = useState("");
  const [preset, setPreset] = useState("square");
  const [outputUrl, setOutputUrl] = useState("");
  const [outputBlob, setOutputBlob] = useState<Blob>();
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => () => { if (outputUrl) URL.revokeObjectURL(outputUrl); }, [outputUrl]);

  function chooseFile(next?: File) {
    setError(""); setOutputUrl(""); setOutputBlob(undefined); setResult("");
    if (!next) { setFile(undefined); return; }
    if (next.size > 30 * 1024 * 1024) { setFile(undefined); setError(copy.tooLarge); return; }
    if (!next.type.startsWith("image/") && !/\.(heic|heif)$/i.test(next.name)) { setFile(undefined); setError(copy.invalid); return; }
    setFile(next);
  }

  async function run() {
    if (!file || (slug === "add-text-to-image" && !caption.trim())) { setError(copy.empty); return; }
    setBusy(true); setError(""); setOutputUrl(""); setOutputBlob(undefined); setResult("");
    try {
      const processed = await processImage(slug, file, { quality: 0.9, width: 800, height: 600, keepRatio: true, amount: 25, option: preset, text: caption.trim() }, "tr");
      if (!processed.blob) throw new Error("missing output");
      setOutputBlob(processed.blob);
      setOutputUrl(URL.createObjectURL(processed.blob));
      setResult(`Hazır · ${(processed.blob.size / 1024).toFixed(1)} KB`);
    } catch {
      setError(copy.failed);
    } finally { setBusy(false); }
  }

  function reset() { setFile(undefined); setCaption(""); setPreset("square"); setOutputUrl(""); setOutputBlob(undefined); setResult(""); setError(""); }

  return <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <label htmlFor={`tr-${slug}-file`} className="block text-sm font-medium text-slate-800">{copy.file}<input id={`tr-${slug}-file`} type="file" accept="image/*,.heic,.heif" onChange={(event) => chooseFile(event.currentTarget.files?.[0])} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 text-sm" /></label>
    <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files[0]); }} className="mt-4 rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-600">{copy.drop} <span className="block pt-1 text-xs">En fazla 30 MB</span></div>
    {file && <p className="mt-3 break-all text-sm text-slate-600">Seçilen dosya: {file.name}</p>}
    {slug === "social-image-resize" && <label htmlFor="tr-social-preset" className="mt-4 block text-sm font-medium">{copy.text}<select id="tr-social-preset" value={preset} onChange={(event) => setPreset(event.target.value)} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3">{presets.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>}
    {slug === "add-text-to-image" && <label htmlFor="tr-image-caption" className="mt-4 block text-sm font-medium">{copy.text}<input id="tr-image-caption" value={caption} maxLength={160} onChange={(event) => setCaption(event.target.value)} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3" /></label>}
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void run()} disabled={busy} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60">{busy ? copy.busy : copy.action}</button><button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">{copy.reset}</button>{outputUrl && <a href={outputUrl} download={`${file?.name.replace(/\.[^.]+$/, "") || "gorsel"}-${slug}.jpg`} className="inline-flex min-h-12 items-center rounded-xl bg-emerald-700 px-5 font-semibold text-white">{copy.download}</a>}</div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {result && outputUrl && <div className="mt-5 space-y-3"><h2 className="font-semibold">{result}</h2><div className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200"><Image src={outputUrl} alt={`${copy.title} sonucu`} fill unoptimized sizes="(max-width: 768px) 100vw, 672px" className="object-contain" /></div></div>}
    {outputBlob && <p className="sr-only" aria-live="polite">{result}</p>}
    <p className="mt-4 text-sm text-slate-600">{copy.privacy}</p>
  </section>;
}
