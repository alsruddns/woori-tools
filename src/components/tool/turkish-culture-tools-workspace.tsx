"use client";

import { useState } from "react";
import { copyText } from "@/lib/copy-to-clipboard";
import { runCountryTool } from "@/lib/country-tools";
import type { CountryToolSlug } from "@/lib/country-tool-slugs";

export type TurkishCultureSlug = Extract<CountryToolSlug,
  "simplified-traditional-chinese-converter" | "chinese-number-kanji-converter" | "rmb-uppercase-converter" | "chinese-zodiac-calculator" | "chinese-sexagenary-cycle-calculator" | "chinese-phone-number-formatter" | "taiwan-phone-number-formatter"
>;

const copyBySlug: Record<TurkishCultureSlug, { title: string; label: string; placeholder: string; example: string; hint: string }> = {
  "simplified-traditional-chinese-converter": { title: "Basitleştirilmiş ve Geleneksel Çince Dönüştürücü", label: "Çince metin", placeholder: "简体中文或繁體中文", example: "汉字与繁體中文", hint: "Metni basitleştirilmiş ve geleneksel karakterler arasında dönüştürün." },
  "chinese-number-kanji-converter": { title: "Çince Sayı ve Karakter Dönüştürücü", label: "Sayı veya Çince sayı yazımı", placeholder: "12345 veya 一万二千三百四十五", example: "12345", hint: "Arap rakamlarını Çince sayı karakterlerine veya tersine dönüştürün." },
  "rmb-uppercase-converter": { title: "Renminbi Tutarını Büyük Harfle Yazma Aracı", label: "Tutar", placeholder: "1234.56", example: "1234.56", hint: "Tutarı finansal belgelerde kullanılan Çince büyük sayı yazımına dönüştürür." },
  "chinese-zodiac-calculator": { title: "Çin Burcu Hesaplayıcı", label: "Yıl", placeholder: "1990", example: "1990", hint: "Hesaplama Gregoryen yılına dayanır; Ay Yeni Yılı çevresindeki tarihler önceki burca ait olabilir." },
  "chinese-sexagenary-cycle-calculator": { title: "Çin Altmışlık Döngü Hesaplayıcı", label: "Yıl", placeholder: "2024", example: "2024", hint: "Yıl için geleneksel göksel gövde ve yersel dal eşleşmesini gösterir." },
  "chinese-phone-number-formatter": { title: "Çin Telefon Numarası Biçimlendirici", label: "Çin telefon numarası", placeholder: "13800138000", example: "13800138000", hint: "Biçim ve uzunluğu denetler; numaranın tahsisini veya sahibini doğrulamaz." },
  "taiwan-phone-number-formatter": { title: "Tayvan Telefon Numarası Biçimlendirici", label: "Tayvan telefon numarası", placeholder: "0912345678", example: "0912345678", hint: "Biçim ve uzunluğu denetler; numaranın tahsisini veya sahibini doğrulamaz." },
};

const forwardLabel: Record<TurkishCultureSlug, string> = {
  "simplified-traditional-chinese-converter": "Basitleştirilmiş → Geleneksel",
  "chinese-number-kanji-converter": "Sayı → Çince karakter",
  "rmb-uppercase-converter": "Büyük harfli tutar yazımı",
  "chinese-zodiac-calculator": "Burcu hesapla",
  "chinese-sexagenary-cycle-calculator": "Döngüyü hesapla",
  "chinese-phone-number-formatter": "Numarayı biçimlendir",
  "taiwan-phone-number-formatter": "Numarayı biçimlendir",
};

export function TurkishCultureToolsWorkspace({ slug }: { slug: TurkishCultureSlug }) {
  const copy = copyBySlug[slug];
  const directional = slug === "simplified-traditional-chinese-converter" || slug === "chinese-number-kanji-converter";
  const yearTool = slug === "chinese-zodiac-calculator" || slug === "chinese-sexagenary-cycle-calculator";
  const [input, setInput] = useState("");
  const [reverse, setReverse] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  function run() {
    setError(""); setResult("");
    if (!input.trim()) { setError("İşlem için bir değer girin."); return; }
    try {
      const output = runCountryTool(slug, input.trim(), reverse ? "reverse" : "forward");
      setResult(typeof output === "string" ? output : output.valid ? "Biçim geçerli." : "Biçim geçersiz veya denetim toplamı eşleşmiyor.");
    } catch {
      setError("Değeri ve giriş biçimini kontrol edin.");
    }
  }

  return <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <h2 className="text-xl font-semibold text-slate-900">{copy.title}</h2>
    {directional && <fieldset className="mt-4 flex flex-wrap gap-2"><legend className="mb-2 text-sm font-medium">Dönüştürme yönü</legend>
      <button type="button" aria-pressed={!reverse} onClick={() => setReverse(false)} className={`min-h-10 rounded-lg border px-3 ${!reverse ? "border-indigo-600 bg-indigo-50" : ""}`}>{forwardLabel[slug]}</button>
      <button type="button" aria-pressed={reverse} onClick={() => setReverse(true)} className={`min-h-10 rounded-lg border px-3 ${reverse ? "border-indigo-600 bg-indigo-50" : ""}`}>{slug === "simplified-traditional-chinese-converter" ? "Geleneksel → Basitleştirilmiş" : "Çince karakter → sayı"}</button>
    </fieldset>}
    <p className="mt-4 text-sm text-slate-600">{copy.hint}</p>
    <label className="mt-4 block text-sm font-medium">{copy.label}<textarea aria-label={copy.label} rows={yearTool ? 1 : 5} inputMode={yearTool ? "numeric" : "text"} value={input} onChange={(event) => setInput(event.target.value)} placeholder={copy.placeholder} className="mt-2 block min-h-11 w-full rounded-xl border border-slate-300 p-3 font-mono" /></label>
    <button type="button" onClick={() => setInput(copy.example)} className="mt-2 min-h-9 rounded-lg border px-3 text-sm">Örneği kullan</button>
    <p className="mt-3 text-xs text-slate-500">İşlem tarayıcınızda yapılır; girdiğiniz veriler sunucuya gönderilmez.</p>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={run} className="min-h-11 rounded-xl bg-indigo-600 px-5 font-semibold text-white">{directional ? "Dönüştür" : yearTool ? "Hesapla" : "Biçimlendir"}</button><button type="button" onClick={() => { setInput(""); setResult(""); setError(""); setReverse(false); }} className="min-h-11 rounded-xl border px-5">Temizle</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {result && <section aria-live="polite" className="mt-5 rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold">Sonuç</h3><pre className="mt-2 whitespace-pre-wrap break-words font-mono text-sm">{result}</pre><button type="button" onClick={() => void copyText(result)} className="mt-3 min-h-10 rounded-lg border px-4">Sonucu kopyala</button></section>}
  </section>;
}
