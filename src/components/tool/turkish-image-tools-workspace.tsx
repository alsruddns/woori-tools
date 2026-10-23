"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { processImage } from "@/lib/image/process-image";

type ImageToolSlug = "social-image-resize" | "add-text-to-image" | "jpg-to-png" | "png-to-jpg" | "webp-to-jpg" | "webp-to-png" | "jpg-to-webp" | "png-to-webp" | "heic-to-jpg" | "image-compress" | "image-resize" | "image-crop" | "image-rotate" | "image-flip" | "image-grayscale" | "image-brightness" | "image-contrast" | "image-blur" | "image-pixelate" | "remove-image-metadata" | "image-info" | "favicon-generator";

const labels: Record<ImageToolSlug, { title: string; file: string; drop: string; text: string; action: string; busy: string; reset: string; download: string; empty: string; invalid: string; tooLarge: string; failed: string; privacy: string }> = {
  "social-image-resize": {
    title: "Sosyal medya görseli boyutlandırıcı", file: "Görsel seçin", drop: "Görseli buraya sürükleyin veya dosya seçin", text: "Görsel biçimi", action: "Görseli boyutlandır", busy: "Görsel hazırlanıyor…", reset: "Sıfırla", download: "Görseli indir", empty: "Önce bir görsel seçin.", invalid: "JPG, PNG, WebP veya HEIC görseli seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Görsel işlenemedi. Başka bir dosya deneyin.", privacy: "Görseliniz tarayıcınızda işlenir ve sunucuya gönderilmez.",
  },
  "add-text-to-image": {
    title: "Görsele metin ekle", file: "Görsel seçin", drop: "Görseli buraya sürükleyin veya dosya seçin", text: "Görsel üzerine eklenecek metin", action: "Metni görsele ekle", busy: "Görsel hazırlanıyor…", reset: "Sıfırla", download: "Görseli indir", empty: "Bir görsel seçin ve eklenecek metni yazın.", invalid: "JPG, PNG, WebP veya HEIC görseli seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Görsel işlenemedi. Dosyayı ve metni kontrol edip yeniden deneyin.", privacy: "Görseliniz tarayıcınızda işlenir ve sunucuya gönderilmez.",
  },
  "jpg-to-png": { title: "JPG'den PNG'ye dönüştürücü", file: "JPG görseli seçin", drop: "JPG görselini buraya sürükleyin veya dosya seçin", text: "", action: "PNG'ye dönüştür", busy: "Görsel dönüştürülüyor…", reset: "Sıfırla", download: "PNG dosyasını indir", empty: "Önce bir JPG görseli seçin.", invalid: "Geçerli bir JPG görseli seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Görsel PNG biçimine dönüştürülemedi. Yeniden deneyin.", privacy: "Görseliniz tarayıcınızda dönüştürülür ve sunucuya gönderilmez." },
  "png-to-jpg": { title: "PNG'den JPG'ye dönüştürücü", file: "PNG görseli seçin", drop: "PNG görselini buraya sürükleyin veya dosya seçin", text: "", action: "JPG'ye dönüştür", busy: "Görsel dönüştürülüyor…", reset: "Sıfırla", download: "JPG dosyasını indir", empty: "Önce bir PNG görseli seçin.", invalid: "Geçerli bir PNG görseli seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Görsel JPG biçimine dönüştürülemedi. Yeniden deneyin.", privacy: "Görseliniz tarayıcınızda dönüştürülür ve sunucuya gönderilmez." },
  "webp-to-jpg": { title: "WebP'den JPG'ye dönüştürücü", file: "WebP görseli seçin", drop: "WebP görselini buraya sürükleyin veya dosya seçin", text: "", action: "JPG'ye dönüştür", busy: "Görsel dönüştürülüyor…", reset: "Sıfırla", download: "JPG dosyasını indir", empty: "Önce bir WebP görseli seçin.", invalid: "Geçerli bir WebP görseli seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Görsel JPG biçimine dönüştürülemedi. Yeniden deneyin.", privacy: "Görseliniz tarayıcınızda dönüştürülür ve sunucuya gönderilmez." },
  "webp-to-png": { title: "WebP'den PNG'ye dönüştürücü", file: "WebP görseli seçin", drop: "WebP görselini buraya sürükleyin veya dosya seçin", text: "", action: "PNG'ye dönüştür", busy: "Görsel dönüştürülüyor…", reset: "Sıfırla", download: "PNG dosyasını indir", empty: "Önce bir WebP görseli seçin.", invalid: "Geçerli bir WebP görseli seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Görsel PNG biçimine dönüştürülemedi. Yeniden deneyin.", privacy: "Görseliniz tarayıcınızda dönüştürülür ve sunucuya gönderilmez." },
  "jpg-to-webp": { title: "JPG'den WebP'ye dönüştürücü", file: "JPG görseli seçin", drop: "JPG görselini buraya sürükleyin veya dosya seçin", text: "", action: "WebP'ye dönüştür", busy: "Görsel dönüştürülüyor…", reset: "Sıfırla", download: "WebP dosyasını indir", empty: "Önce bir JPG görseli seçin.", invalid: "Geçerli bir JPG görseli seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Görsel WebP biçimine dönüştürülemedi. Yeniden deneyin.", privacy: "Görseliniz tarayıcınızda dönüştürülür ve sunucuya gönderilmez." },
  "png-to-webp": { title: "PNG'den WebP'ye dönüştürücü", file: "PNG görseli seçin", drop: "PNG görselini buraya sürükleyin veya dosya seçin", text: "", action: "WebP'ye dönüştür", busy: "Görsel dönüştürülüyor…", reset: "Sıfırla", download: "WebP dosyasını indir", empty: "Önce bir PNG görseli seçin.", invalid: "Geçerli bir PNG görseli seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Görsel WebP biçimine dönüştürülemedi. Yeniden deneyin.", privacy: "Görseliniz tarayıcınızda dönüştürülür ve sunucuya gönderilmez." },
  "heic-to-jpg": { title: "HEIC'den JPG'ye dönüştürücü", file: "HEIC veya HEIF görseli seçin", drop: "HEIC veya HEIF görselini buraya sürükleyin", text: "", action: "JPG'ye dönüştür", busy: "Görsel dönüştürülüyor…", reset: "Sıfırla", download: "JPG dosyasını indir", empty: "Önce bir HEIC veya HEIF görseli seçin.", invalid: "Geçerli bir HEIC veya HEIF görseli seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "HEIC görseli JPG biçimine dönüştürülemedi. Yeniden deneyin.", privacy: "Görseliniz tarayıcınızda dönüştürülür ve sunucuya gönderilmez." },
  "image-compress": { title: "Görsel sıkıştırıcı", file: "Sıkıştırılacak görseli seçin", drop: "Görseli buraya sürükleyin veya dosya seçin", text: "Görsel kalitesi", action: "Görseli sıkıştır", busy: "Görsel sıkıştırılıyor…", reset: "Sıfırla", download: "Sıkıştırılmış görseli indir", empty: "Önce bir görsel seçin.", invalid: "Geçerli bir görsel dosyası seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Görsel sıkıştırılamadı. Başka bir dosya deneyin.", privacy: "Görseliniz tarayıcınızda sıkıştırılır ve sunucuya gönderilmez." },
  "image-resize": { title: "Görsel boyutlandırıcı", file: "Boyutlandırılacak görseli seçin", drop: "Görseli buraya sürükleyin veya dosya seçin", text: "Yeni boyutlar", action: "Görseli boyutlandır", busy: "Görsel boyutlandırılıyor…", reset: "Sıfırla", download: "Boyutlandırılmış görseli indir", empty: "Önce bir görsel seçin.", invalid: "Geçerli bir görsel dosyası seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Görsel boyutlandırılamadı. Yeniden deneyin.", privacy: "Görseliniz tarayıcınızda boyutlandırılır ve sunucuya gönderilmez." },
  "image-crop": { title: "Görsel kırpıcı", file: "Kırpılacak görseli seçin", drop: "Görseli buraya sürükleyin veya dosya seçin", text: "Kırpma oranı", action: "Görseli kırp", busy: "Görsel kırpılıyor…", reset: "Sıfırla", download: "Kırpılmış görseli indir", empty: "Önce bir görsel seçin.", invalid: "Geçerli bir görsel dosyası seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Görsel kırpılamadı. Yeniden deneyin.", privacy: "Görseliniz tarayıcınızda kırpılır ve sunucuya gönderilmez." },
  "image-rotate": { title: "Görsel döndürücü", file: "Döndürülecek görseli seçin", drop: "Görseli buraya sürükleyin veya dosya seçin", text: "Döndürme açısı", action: "Görseli döndür", busy: "Görsel döndürülüyor…", reset: "Sıfırla", download: "Döndürülmüş görseli indir", empty: "Önce bir görsel seçin.", invalid: "Geçerli bir görsel dosyası seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Görsel döndürülemedi. Yeniden deneyin.", privacy: "Görseliniz tarayıcınızda döndürülür ve sunucuya gönderilmez." },
  "image-flip": { title: "Görsel çevirici", file: "Çevrilecek görseli seçin", drop: "Görseli buraya sürükleyin veya dosya seçin", text: "Çevirme yönü", action: "Görseli çevir", busy: "Görsel çevriliyor…", reset: "Sıfırla", download: "Çevrilmiş görseli indir", empty: "Önce bir görsel seçin.", invalid: "Geçerli bir görsel dosyası seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Görsel çevrilemedi. Yeniden deneyin.", privacy: "Görseliniz tarayıcınızda çevrilir ve sunucuya gönderilmez." },
  "image-grayscale": { title: "Gri tonlama görsel filtresi", file: "Düzenlenecek görseli seçin", drop: "Görseli buraya sürükleyin veya dosya seçin", text: "", action: "Gri tonlamaya dönüştür", busy: "Görsel düzenleniyor…", reset: "Sıfırla", download: "Düzenlenmiş görseli indir", empty: "Önce bir görsel seçin.", invalid: "Geçerli bir görsel dosyası seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Görsel düzenlenemedi. Yeniden deneyin.", privacy: "Görseliniz tarayıcınızda düzenlenir ve sunucuya gönderilmez." },
  "image-brightness": { title: "Görsel parlaklığı ayarlayıcı", file: "Parlaklığı ayarlanacak görseli seçin", drop: "Görseli buraya sürükleyin veya dosya seçin", text: "Parlaklık", action: "Parlaklığı uygula", busy: "Görsel düzenleniyor…", reset: "Sıfırla", download: "Düzenlenmiş görseli indir", empty: "Önce bir görsel seçin.", invalid: "Geçerli bir görsel dosyası seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Parlaklık ayarlanamadı. Yeniden deneyin.", privacy: "Görseliniz tarayıcınızda düzenlenir ve sunucuya gönderilmez." },
  "image-contrast": { title: "Görsel kontrastı ayarlayıcı", file: "Kontrastı ayarlanacak görseli seçin", drop: "Görseli buraya sürükleyin veya dosya seçin", text: "Kontrast", action: "Kontrastı uygula", busy: "Görsel düzenleniyor…", reset: "Sıfırla", download: "Düzenlenmiş görseli indir", empty: "Önce bir görsel seçin.", invalid: "Geçerli bir görsel dosyası seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Kontrast ayarlanamadı. Yeniden deneyin.", privacy: "Görseliniz tarayıcınızda düzenlenir ve sunucuya gönderilmez." },
  "image-blur": { title: "Görsel bulanıklığı aracı", file: "Bulanıklaştırılacak görseli seçin", drop: "Görseli buraya sürükleyin veya dosya seçin", text: "Bulanıklık düzeyi", action: "Bulanıklığı uygula", busy: "Görsel düzenleniyor…", reset: "Sıfırla", download: "Düzenlenmiş görseli indir", empty: "Önce bir görsel seçin.", invalid: "Geçerli bir görsel dosyası seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Bulanıklık uygulanamadı. Yeniden deneyin.", privacy: "Görseliniz tarayıcınızda düzenlenir ve sunucuya gönderilmez." },
  "image-pixelate": { title: "Görsel pikselleştirme aracı", file: "Pikselleştirilecek görseli seçin", drop: "Görseli buraya sürükleyin veya dosya seçin", text: "Piksel boyutu", action: "Pikselleştir", busy: "Görsel düzenleniyor…", reset: "Sıfırla", download: "Düzenlenmiş görseli indir", empty: "Önce bir görsel seçin.", invalid: "Geçerli bir görsel dosyası seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Görsel pikselleştirilemedi. Yeniden deneyin.", privacy: "Görseliniz tarayıcınızda düzenlenir ve sunucuya gönderilmez." },
  "remove-image-metadata": { title: "Görsel metaverilerini kaldır", file: "Metaverileri temizlenecek görseli seçin", drop: "Görseli buraya sürükleyin veya dosya seçin", text: "", action: "Metaverileri kaldır", busy: "Görsel işleniyor…", reset: "Sıfırla", download: "Temizlenmiş görseli indir", empty: "Önce bir görsel seçin.", invalid: "Geçerli bir görsel dosyası seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Görsel metaverileri kaldırılamadı. Yeniden deneyin.", privacy: "Görseliniz tarayıcınızda işlenir ve sunucuya gönderilmez." },
  "image-info": { title: "Görsel bilgisi", file: "İncelenecek görseli seçin", drop: "Görseli buraya sürükleyin veya dosya seçin", text: "", action: "Görsel bilgisini göster", busy: "Bilgiler okunuyor…", reset: "Sıfırla", download: "", empty: "Önce bir görsel seçin.", invalid: "Geçerli bir görsel dosyası seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Görsel bilgisi okunamadı. Yeniden deneyin.", privacy: "Görsel bilgisi tarayıcınızda okunur ve sunucuya gönderilmez." },
  "favicon-generator": { title: "Favicon oluşturucu", file: "Favicon'a dönüştürülecek görseli seçin", drop: "Görseli buraya sürükleyin veya dosya seçin", text: "", action: "Favicon oluştur", busy: "Favicon hazırlanıyor…", reset: "Sıfırla", download: "PNG favicon dosyasını indir", empty: "Önce bir görsel seçin.", invalid: "Geçerli bir görsel dosyası seçin.", tooLarge: "Görsel 30 MB sınırını aşıyor.", failed: "Favicon oluşturulamadı. Başka bir dosya deneyin.", privacy: "Görseliniz tarayıcınızda işlenir ve sunucuya gönderilmez." },
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
  const defaultOption = slug === "image-flip" ? "horizontal" : slug === "image-crop" ? "1" : "90";
  const [file, setFile] = useState<File>();
  const [caption, setCaption] = useState("");
  const [preset, setPreset] = useState("square");
  const [quality, setQuality] = useState(0.82);
  const [option, setOption] = useState(defaultOption);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [keepRatio, setKeepRatio] = useState(true);
  const [amount, setAmount] = useState(slug === "image-pixelate" ? 25 : 100);
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
      if (slug === "image-info") {
        const bitmap = await createImageBitmap(file);
        setResult(`Boyutlar: ${bitmap.width} × ${bitmap.height} piksel\nDosya türü: ${file.type || "Bilinmiyor"}\nDosya boyutu: ${(file.size / 1024).toFixed(1)} KB\nEn-boy oranı: ${(bitmap.width / bitmap.height).toFixed(3)}:1`);
        bitmap.close();
        return;
      }
      const processed = await processImage(slug, file, { quality: slug === "image-compress" ? quality : 0.9, width, height, keepRatio, amount, option: slug === "social-image-resize" ? preset : option, text: caption.trim() }, "tr");
      if (!processed.blob) throw new Error("missing output");
      const bitmap = await createImageBitmap(processed.blob);
      const outputWidth = bitmap.width; const outputHeight = bitmap.height; bitmap.close();
      setOutputBlob(processed.blob);
      setOutputUrl(URL.createObjectURL(processed.blob));
      setResult(`Hazır · ${(processed.blob.size / 1024).toFixed(1)} KB · ${outputWidth} × ${outputHeight} piksel`);
    } catch {
      setError(copy.failed);
    } finally { setBusy(false); }
  }

  function reset() { setFile(undefined); setCaption(""); setPreset("square"); setQuality(0.82); setOption(defaultOption); setWidth(800); setHeight(600); setKeepRatio(true); setAmount(slug === "image-pixelate" ? 25 : 100); setOutputUrl(""); setOutputBlob(undefined); setResult(""); setError(""); }

  const extension = slug === "favicon-generator" || slug.includes("png") ? "png" : slug.includes("webp") ? "webp" : "jpg";

  return <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <label htmlFor={`tr-${slug}-file`} className="block text-sm font-medium text-slate-800">{copy.file}<input id={`tr-${slug}-file`} type="file" accept="image/*,.heic,.heif" onChange={(event) => chooseFile(event.currentTarget.files?.[0])} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 text-sm" /></label>
    <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files[0]); }} className="mt-4 rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-600">{copy.drop} <span className="block pt-1 text-xs">En fazla 30 MB</span></div>
    {file && <p className="mt-3 break-all text-sm text-slate-600">Seçilen dosya: {file.name}</p>}
    {slug === "social-image-resize" && <label htmlFor="tr-social-preset" className="mt-4 block text-sm font-medium">{copy.text}<select id="tr-social-preset" value={preset} onChange={(event) => setPreset(event.target.value)} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3">{presets.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>}
    {slug === "add-text-to-image" && <label htmlFor="tr-image-caption" className="mt-4 block text-sm font-medium">{copy.text}<input id="tr-image-caption" value={caption} maxLength={160} onChange={(event) => setCaption(event.target.value)} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3" /></label>}
    {slug === "image-compress" && <label htmlFor="tr-image-quality" className="mt-4 block text-sm font-medium">{copy.text} · {Math.round(quality * 100)}%<input id="tr-image-quality" type="range" min="0.3" max="0.95" step="0.05" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="mt-2 block w-full sm:max-w-md" /></label>}
    {slug === "image-resize" && <div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium">Genişlik (piksel)<input type="number" min={1} max={12000} value={width} onChange={(event) => setWidth(Math.max(1, Math.min(12000, Number(event.target.value) || 1)))} className="mt-2 block min-h-11 w-full rounded-xl border border-slate-300 p-3" /></label><label className="text-sm font-medium">Yükseklik (piksel)<input type="number" min={1} max={12000} value={height} onChange={(event) => setHeight(Math.max(1, Math.min(12000, Number(event.target.value) || 1)))} disabled={keepRatio} className="mt-2 block min-h-11 w-full rounded-xl border border-slate-300 p-3 disabled:bg-slate-100" /></label><label className="flex min-h-11 items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={keepRatio} onChange={(event) => setKeepRatio(event.target.checked)} />En-boy oranını koru</label></div>}
    {slug === "image-crop" && <label htmlFor="tr-crop-ratio" className="mt-4 block text-sm font-medium">{copy.text}<select id="tr-crop-ratio" value={option} onChange={(event) => setOption(event.target.value)} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 sm:max-w-sm"><option value="1">Kare · 1:1</option><option value="1.333333">Yatay · 4:3</option><option value="1.777778">Geniş ekran · 16:9</option><option value="0.666667">Dikey · 2:3</option></select></label>}
    {slug === "image-rotate" && <label htmlFor="tr-rotate-angle" className="mt-4 block text-sm font-medium">{copy.text}<select id="tr-rotate-angle" value={option} onChange={(event) => setOption(event.target.value)} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 sm:max-w-sm"><option value="90">Saat yönünde 90°</option><option value="180">180°</option><option value="270">Saat yönünün tersine 90°</option></select></label>}
    {slug === "image-flip" && <label htmlFor="tr-flip-axis" className="mt-4 block text-sm font-medium">{copy.text}<select id="tr-flip-axis" value={option} onChange={(event) => setOption(event.target.value)} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 sm:max-w-sm"><option value="horizontal">Yatay</option><option value="vertical">Dikey</option></select></label>}
    {["image-brightness", "image-contrast", "image-blur", "image-pixelate"].includes(slug) && <label htmlFor="tr-effect-amount" className="mt-4 block text-sm font-medium">{copy.text} · {slug === "image-blur" ? `${amount}%` : slug === "image-pixelate" ? amount : `${amount}%`}<input id="tr-effect-amount" type="range" min={slug === "image-pixelate" ? 4 : 0} max={slug === "image-pixelate" ? 80 : slug === "image-blur" ? 50 : 200} step="1" value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="mt-2 block w-full sm:max-w-md" /></label>}
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void run()} disabled={busy} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60">{busy ? copy.busy : copy.action}</button><button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">{copy.reset}</button>{outputUrl && <a href={outputUrl} download={`${file?.name.replace(/\.[^.]+$/, "") || "gorsel"}-${slug}.${extension}`} className="inline-flex min-h-12 items-center rounded-xl bg-emerald-700 px-5 font-semibold text-white">{copy.download}</a>}</div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {result && <div className="mt-5 space-y-3"><h2 className="font-semibold">{copy.title}</h2>{outputUrl ? <div className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200"><Image src={outputUrl} alt={`${copy.title} sonucu`} fill unoptimized sizes="(max-width: 768px) 100vw, 672px" className="object-contain" /></div> : <pre role="status" aria-live="polite" className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{result}</pre>}<p aria-live="polite" className="text-sm text-slate-600">{result}</p></div>}
    {outputBlob && <p className="sr-only" aria-live="polite">{result}</p>}
    <p className="mt-4 text-sm text-slate-600">{copy.privacy}</p>
  </section>;
}
