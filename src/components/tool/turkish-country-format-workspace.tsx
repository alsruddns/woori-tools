"use client";

import { useState } from "react";
import { runCountryTool } from "@/lib/country-tools";

export type TurkishCountryFormatSlug = "us-phone-number-formatter" | "us-zip-code-formatter" | "canada-postal-code-formatter" | "uk-postcode-formatter";
const labels: Record<TurkishCountryFormatSlug, { title: string; input: string; placeholder: string; action: string }> = {
  "us-phone-number-formatter": { title: "ABD telefon numarası biçimlendirici", input: "Telefon numarası", placeholder: "Örnek: (212) 555-0123", action: "Numarayı biçimlendir" },
  "us-zip-code-formatter": { title: "ABD ZIP kodu biçimlendirici", input: "ZIP kodu", placeholder: "Örnek: 10001 veya 10001-1234", action: "ZIP kodunu biçimlendir" },
  "canada-postal-code-formatter": { title: "Kanada posta kodu biçimlendirici", input: "Posta kodu", placeholder: "Örnek: K1A 0B1", action: "Posta kodunu biçimlendir" },
  "uk-postcode-formatter": { title: "Birleşik Krallık posta kodu biçimlendirici", input: "Posta kodu", placeholder: "Örnek: SW1A 1AA", action: "Posta kodunu biçimlendir" },
};

export function TurkishCountryFormatWorkspace({ slug }: { slug: TurkishCountryFormatSlug }) {
  const copy = labels[slug];
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  function run() {
    setResult(""); setError("");
    if (!input.trim()) { setError("Biçimlendirilecek bir değer girin."); return; }
    try {
      const formatted = runCountryTool(slug, input.trim());
      if (typeof formatted === "string") setResult(formatted);
      else if (formatted.valid) setResult(formatted.level === "checksum" ? "Kontrol basamağı geçerli." : "Biçim geçerli.");
      else setError("Girdi biçimini kontrol edip yeniden deneyin.");
    }
    catch { setError("Girdi biçimini kontrol edip yeniden deneyin."); }
  }
  return <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <h2 className="text-xl font-semibold text-slate-900">{copy.title}</h2>
    <label htmlFor={`tr-${slug}-input`} className="mt-5 block text-sm font-medium text-slate-800">{copy.input}<input id={`tr-${slug}-input`} value={input} onChange={(event) => setInput(event.target.value)} placeholder={copy.placeholder} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3" /></label>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={run} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white">{copy.action}</button><button type="button" onClick={() => { setInput(""); setResult(""); setError(""); }} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Sıfırla</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {result && <div className="mt-5"><h3 className="font-semibold">Sonuç</h3><output className="mt-2 block break-all rounded-xl bg-slate-50 p-4 text-sm" aria-live="polite">{result}</output></div>}
    <p className="mt-4 text-sm text-slate-600">Biçim, seçilen ülkenin yaygın numara kuralına göre denetlenir. Girdi tarayıcınızda kalır ve sunucuya gönderilmez.</p>
  </section>;
}
