"use client";

import { useState } from "react";
import { runCountryTool } from "@/lib/country-tools";
import type { CountryToolSlug } from "@/lib/country-tool-slugs";

export type TurkishIndiaSlug = Extract<CountryToolSlug, "indian-number-format-converter" | "lakh-crore-converter" | "pan-format-validator" | "gstin-format-validator" | "india-phone-number-formatter">;

const copyBySlug: Record<TurkishIndiaSlug, { title: string; label: string; placeholder: string; action: string; hint: string }> = {
  "indian-number-format-converter": { title: "Hindistan Sayı Biçimi Dönüştürücü", label: "Sayı", placeholder: "1234567.89", action: "Sayıyı dönüştür", hint: "Hindistan sayı gruplamasını kullanarak değeri biçimlendirir." },
  "lakh-crore-converter": { title: "Lakh ve Crore Dönüştürücü", label: "Sayı veya lakh/crore değeri", placeholder: "100000 veya 2 crore", action: "Değeri dönüştür", hint: "Hindistan sayı ölçeğindeki lakh ve crore değerlerini dönüştürür." },
  "pan-format-validator": { title: "PAN Biçim Denetleyici", label: "PAN numarası", placeholder: "ABCPA1234F", action: "Biçimi denetle", hint: "Yalnızca PAN biçimini denetler; kişi kimliğini veya resmî kaydı doğrulamaz." },
  "gstin-format-validator": { title: "GSTIN Biçim Denetleyici", label: "GSTIN numarası", placeholder: "27ABCPE1234F1Z5", action: "Biçimi denetle", hint: "GSTIN yapısını ve denetim karakterini yerel olarak kontrol eder; vergi kaydını sorgulamaz." },
  "india-phone-number-formatter": { title: "Hindistan Telefon Numarası Biçimlendirici", label: "Telefon numarası", placeholder: "9876543210", action: "Numarayı biçimlendir", hint: "Numarayı Hindistan ülke kodu ve yerel numara gruplarıyla biçimlendirir." },
};

export function TurkishIndiaToolsWorkspace({ slug }: { slug: TurkishIndiaSlug }) {
  const copy = copyBySlug[slug];
  const validator = slug === "pan-format-validator" || slug === "gstin-format-validator";
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  function run() {
    setOutput(""); setError("");
    if (!input.trim()) { setError("İşlem için bir değer girin."); return; }
    try {
      const result = runCountryTool(slug, input.trim());
      if (typeof result === "string") setOutput(result);
      else setOutput(result.valid ? result.level === "checksum" ? "Biçim ve kontrol karakteri geçerli." : "Biçim geçerli." : result.level === "checksum" ? "Kontrol karakteri eşleşmiyor." : "Biçim geçersiz.");
    } catch { setError("Değeri ve giriş biçimini kontrol edin."); }
  }
  return <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <h2 className="text-xl font-semibold text-slate-900">{copy.title}</h2>
    <p className="mt-3 text-sm text-slate-600">{copy.hint}</p>
    <label className="mt-5 block text-sm font-medium">{copy.label}<input aria-label={copy.label} inputMode="text" value={input} onChange={(event) => setInput(event.target.value)} placeholder={copy.placeholder} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 font-mono" /></label>
    <p className="mt-3 text-xs text-slate-500">İşlem tarayıcınızda yapılır; girdiğiniz veriler sunucuya gönderilmez.</p>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={run} className="min-h-11 rounded-xl bg-indigo-600 px-5 font-semibold text-white">{copy.action}</button><button type="button" onClick={() => { setInput(""); setOutput(""); setError(""); }} className="min-h-11 rounded-xl border px-5">Temizle</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {output && <section aria-live="polite" className="mt-5 rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold">{validator ? "Denetim sonucu" : "Sonuç"}</h3><output className="mt-2 block break-words font-mono text-sm">{output}</output></section>}
  </section>;
}
