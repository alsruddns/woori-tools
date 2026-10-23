"use client";

import { useState } from "react";
import { runCountryTool } from "@/lib/country-tools";
import type { CountryToolSlug } from "@/lib/country-tool-slugs";

export type TurkishEuropeSlug = Extract<CountryToolSlug,
  "germany-iban-validator" | "german-number-format-converter" | "german-date-format-converter" | "spain-dni-validator" | "spain-nie-validator" | "spanish-number-format-converter" | "spanish-date-format-converter" | "france-phone-number-formatter" | "french-number-format-converter" | "french-date-format-converter" | "netherlands-iban-validator" | "dutch-number-format-converter"
>;

type Copy = { title: string; label: string; placeholder: string; action: string; hint: string };
const copyBySlug: Record<TurkishEuropeSlug, Copy> = {
  "germany-iban-validator": { title: "Almanya IBAN Denetleyici", label: "IBAN", placeholder: "DE89370400440532013000", action: "IBAN'ı denetle", hint: "IBAN yapısını ve MOD 97 denetimini tarayıcınızda kontrol eder; banka hesabının varlığını doğrulamaz." },
  "german-number-format-converter": { title: "Almanca Sayı Biçimi Dönüştürücü", label: "Sayı", placeholder: "1234567.89", action: "Sayıyı dönüştür", hint: "Ondalık ve binlik ayırıcıları Almanca biçimde gösterir." },
  "german-date-format-converter": { title: "Almanca Tarih Biçimi Dönüştürücü", label: "ISO tarih", placeholder: "2026-10-23", action: "Tarihi dönüştür", hint: "Geçerli bir ISO tarihi Almanca gün.ay.yıl biçiminde gösterir." },
  "spain-dni-validator": { title: "İspanya DNI Biçim Denetleyici", label: "DNI numarası", placeholder: "12345678Z", action: "DNI'ı denetle", hint: "DNI yapısını ve kontrol harfini denetler; kimlik sahibini veya resmî kaydı doğrulamaz." },
  "spain-nie-validator": { title: "İspanya NIE Biçim Denetleyici", label: "NIE numarası", placeholder: "X1234567L", action: "NIE'yi denetle", hint: "NIE yapısını ve kontrol harfini denetler; kimlik sahibini veya resmî kaydı doğrulamaz." },
  "spanish-number-format-converter": { title: "İspanyolca Sayı Biçimi Dönüştürücü", label: "Sayı", placeholder: "1234567.89", action: "Sayıyı dönüştür", hint: "Sayıyı İspanyolca bölgesel ayırıcılarla gösterir." },
  "spanish-date-format-converter": { title: "İspanyolca Tarih Biçimi Dönüştürücü", label: "Tarih", placeholder: "2026-10-23", action: "Tarihi dönüştür", hint: "ISO tarihi İspanyolca gün/ay/yıl biçimine dönüştürür; ters yönde ISO'ya çevirebilirsiniz." },
  "france-phone-number-formatter": { title: "Fransa Telefon Numarası Biçimlendirici", label: "Telefon numarası", placeholder: "0612345678", action: "Numarayı biçimlendir", hint: "Fransa telefon numarasını ülke kodu ve yerel gruplarla biçimlendirir." },
  "french-number-format-converter": { title: "Fransızca Sayı Biçimi Dönüştürücü", label: "Sayı", placeholder: "1234567.89", action: "Sayıyı dönüştür", hint: "Sayıyı Fransızca bölgesel ayırıcılarla gösterir." },
  "french-date-format-converter": { title: "Fransızca Tarih Biçimi Dönüştürücü", label: "ISO tarih", placeholder: "2026-10-23", action: "Tarihi dönüştür", hint: "Geçerli bir ISO tarihini Fransızca gün/ay/yıl biçiminde gösterir." },
  "netherlands-iban-validator": { title: "Hollanda IBAN Denetleyici", label: "IBAN", placeholder: "NL91ABNA0417164300", action: "IBAN'ı denetle", hint: "IBAN yapısını ve MOD 97 denetimini tarayıcınızda kontrol eder; banka hesabının varlığını doğrulamaz." },
  "dutch-number-format-converter": { title: "Felemenkçe Sayı Biçimi Dönüştürücü", label: "Sayı", placeholder: "1234567.89", action: "Sayıyı dönüştür", hint: "Sayıyı Felemenkçe bölgesel ayırıcılarla gösterir." },
};

const reversibleDates = new Set<TurkishEuropeSlug>(["spanish-date-format-converter"]);
const validatorSlugs = new Set<TurkishEuropeSlug>(["germany-iban-validator", "spain-dni-validator", "spain-nie-validator", "netherlands-iban-validator"]);

export function TurkishEuropeToolsWorkspace({ slug }: { slug: TurkishEuropeSlug }) {
  const copy = copyBySlug[slug];
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("forward");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  function run() {
    setOutput(""); setError("");
    if (!input.trim()) { setError("İşlem için bir değer girin."); return; }
    try {
      const result = runCountryTool(slug, input.trim(), mode);
      if (typeof result === "string") setOutput(result);
      else setOutput(result.valid ? result.level === "checksum" ? "Biçim ve kontrol değeri geçerli." : "Biçim geçerli." : result.level === "checksum" ? "Kontrol değeri eşleşmiyor." : "Biçim geçersiz.");
    } catch { setError("Değeri ve giriş biçimini kontrol edin."); }
  }
  return <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <h2 className="text-xl font-semibold text-slate-900">{copy.title}</h2>
    <p className="mt-3 text-sm text-slate-600">{copy.hint}</p>
    {reversibleDates.has(slug) && <fieldset className="mt-4 flex flex-wrap gap-2"><legend className="mb-2 text-sm font-medium">Dönüştürme yönü</legend><button type="button" aria-pressed={mode === "forward"} onClick={() => setMode("forward")} className="min-h-10 rounded-lg border px-3">ISO → İspanyolca</button><button type="button" aria-pressed={mode === "reverse"} onClick={() => setMode("reverse")} className="min-h-10 rounded-lg border px-3">İspanyolca → ISO</button></fieldset>}
    <label className="mt-5 block text-sm font-medium">{copy.label}<input aria-label={copy.label} value={input} onChange={(event) => setInput(event.target.value)} placeholder={copy.placeholder} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 font-mono" /></label>
    <p className="mt-3 text-xs text-slate-500">İşlem tarayıcınızda yapılır; girdiğiniz veriler sunucuya gönderilmez.</p>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={run} className="min-h-11 rounded-xl bg-indigo-600 px-5 font-semibold text-white">{copy.action}</button><button type="button" onClick={() => { setInput(""); setMode("forward"); setOutput(""); setError(""); }} className="min-h-11 rounded-xl border px-5">Temizle</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {output && <section aria-live="polite" className="mt-5 rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold">{validatorSlugs.has(slug) ? "Denetim sonucu" : "Sonuç"}</h3><output className="mt-2 block break-words font-mono text-sm">{output}</output></section>}
  </section>;
}
