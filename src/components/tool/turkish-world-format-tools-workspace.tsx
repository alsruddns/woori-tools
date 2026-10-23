"use client";

import { useState } from "react";
import { runCountryTool } from "@/lib/country-tools";
import type { CountryToolSlug } from "@/lib/country-tool-slugs";

export type TurkishWorldFormatSlug = Extract<CountryToolSlug,
  "dutch-date-format-converter" | "brazil-cpf-validator" | "brazil-cnpj-validator" | "brazil-phone-number-formatter" | "brazil-cep-formatter" | "vietnam-phone-number-formatter" | "vietnam-number-format-converter" | "italy-fiscal-code-format-validator" | "italy-vat-number-validator" | "italy-number-format-converter" | "italian-date-format-converter" | "australia-postcode-formatter" | "english-date-format-converter"
>;

type Copy = { title: string; label: string; placeholder: string; action: string; hint: string };
const copyBySlug: Record<TurkishWorldFormatSlug, Copy> = {
  "dutch-date-format-converter": { title: "Felemenkçe Tarih Biçimi Dönüştürücü", label: "Tarih", placeholder: "2026-10-23", action: "Tarihi dönüştür", hint: "ISO tarihini Felemenkçe gün-ay-yıl biçimine çevirin veya yeniden ISO'ya dönüştürün." },
  "brazil-cpf-validator": { title: "Brezilya CPF Biçim Denetleyici", label: "CPF numarası", placeholder: "529.982.247-25", action: "CPF'yi denetle", hint: "CPF biçimini ve kontrol basamaklarını denetler; kimlik sahibini veya resmî kaydı doğrulamaz." },
  "brazil-cnpj-validator": { title: "Brezilya CNPJ Biçim Denetleyici", label: "CNPJ numarası", placeholder: "12.ABC.345/01DE-35", action: "CNPJ'yi denetle", hint: "CNPJ biçimini ve kontrol basamaklarını denetler; şirket kaydını doğrulamaz." },
  "brazil-phone-number-formatter": { title: "Brezilya Telefon Numarası Biçimlendirici", label: "Telefon numarası", placeholder: "11987654321", action: "Numarayı biçimlendir", hint: "Numarayı Brezilya ülke kodu ve yerel alan koduyla biçimlendirir." },
  "brazil-cep-formatter": { title: "Brezilya CEP Biçimlendirici", label: "CEP posta kodu", placeholder: "01001000", action: "CEP kodunu biçimlendir", hint: "Sekiz basamaklı CEP kodunu standart tireli biçime dönüştürür." },
  "vietnam-phone-number-formatter": { title: "Vietnam Telefon Numarası Biçimlendirici", label: "Telefon numarası", placeholder: "0912345678", action: "Numarayı biçimlendir", hint: "Numarayı Vietnam ülke koduyla ve okunabilir gruplarla gösterir." },
  "vietnam-number-format-converter": { title: "Vietnamca Sayı Biçimi Dönüştürücü", label: "Sayı", placeholder: "1234567.89", action: "Sayıyı dönüştür", hint: "Sayıyı Vietnamca bölgesel ayırıcılara göre biçimlendirir." },
  "italy-fiscal-code-format-validator": { title: "İtalya Codice Fiscale Denetleyici", label: "Codice Fiscale", placeholder: "RSSMRA85T10A562S", action: "Kodu denetle", hint: "Yapıyı ve kontrol harfini denetler; kişinin kimliğini veya vergi kaydını doğrulamaz." },
  "italy-vat-number-validator": { title: "İtalya KDV Numarası Denetleyici", label: "Partita IVA", placeholder: "01114601006", action: "Numarayı denetle", hint: "Biçimi ve kontrol basamağını denetler; vergi kaydını sorgulamaz." },
  "italy-number-format-converter": { title: "İtalyanca Sayı Biçimi Dönüştürücü", label: "Sayı", placeholder: "1234567.89", action: "Sayıyı dönüştür", hint: "Sayıyı İtalyanca bölgesel ayırıcılarla gösterir." },
  "italian-date-format-converter": { title: "İtalyanca Tarih Biçimi Dönüştürücü", label: "Tarih", placeholder: "2026-10-23", action: "Tarihi dönüştür", hint: "ISO tarihini İtalyanca gün/ay/yıl biçimine çevirin veya tersine dönüştürün." },
  "australia-postcode-formatter": { title: "Avustralya Posta Kodu Denetleyici", label: "Posta kodu", placeholder: "2000", action: "Kodu denetle", hint: "Posta kodunun dört basamaklı biçimini denetler; adresi veya teslimatı doğrulamaz." },
  "english-date-format-converter": { title: "İngilizce Tarih Biçimi Dönüştürücü", label: "Tarih", placeholder: "2026-03-04", action: "Tarihi dönüştür", hint: "ABD veya Birleşik Krallık gün-ay sırasıyla ISO tarihini dönüştürün; seçilen sırayı doğrulayın." },
};

const validatorSlugs = new Set<TurkishWorldFormatSlug>(["brazil-cpf-validator", "brazil-cnpj-validator", "italy-fiscal-code-format-validator", "italy-vat-number-validator", "australia-postcode-formatter"]);
const reversibleDateSlugs = new Set<TurkishWorldFormatSlug>(["dutch-date-format-converter", "italian-date-format-converter"]);

export function TurkishWorldFormatToolsWorkspace({ slug }: { slug: TurkishWorldFormatSlug }) {
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
  const dateMode = slug === "english-date-format-converter";
  return <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <h2 className="text-xl font-semibold text-slate-900">{copy.title}</h2>
    <p className="mt-3 text-sm text-slate-600">{copy.hint}</p>
    {(reversibleDateSlugs.has(slug) || dateMode) && <fieldset className="mt-4 flex flex-wrap gap-2"><legend className="mb-2 text-sm font-medium">Tarih biçimi ve yönü</legend>
      {dateMode ? <><button type="button" aria-pressed={mode === "us"} onClick={() => setMode("us")} className="min-h-10 rounded-lg border px-3">ABD (ay/gün/yıl)</button><button type="button" aria-pressed={mode === "uk"} onClick={() => setMode("uk")} className="min-h-10 rounded-lg border px-3">Birleşik Krallık (gün/ay/yıl)</button><button type="button" aria-pressed={mode === "us-reverse"} onClick={() => setMode("us-reverse")} className="min-h-10 rounded-lg border px-3">ABD → ISO</button><button type="button" aria-pressed={mode === "uk-reverse"} onClick={() => setMode("uk-reverse")} className="min-h-10 rounded-lg border px-3">Birleşik Krallık → ISO</button></> : <><button type="button" aria-pressed={mode === "forward"} onClick={() => setMode("forward")} className="min-h-10 rounded-lg border px-3">ISO → yerel tarih</button><button type="button" aria-pressed={mode === "reverse"} onClick={() => setMode("reverse")} className="min-h-10 rounded-lg border px-3">Yerel tarih → ISO</button></>}
    </fieldset>}
    <label className="mt-5 block text-sm font-medium">{copy.label}<input aria-label={copy.label} value={input} onChange={(event) => setInput(event.target.value)} placeholder={copy.placeholder} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 font-mono" /></label>
    <p className="mt-3 text-xs text-slate-500">İşlem tarayıcınızda yapılır; girdiğiniz veriler sunucuya gönderilmez.</p>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={run} className="min-h-11 rounded-xl bg-indigo-600 px-5 font-semibold text-white">{copy.action}</button><button type="button" onClick={() => { setInput(""); setMode("forward"); setOutput(""); setError(""); }} className="min-h-11 rounded-xl border px-5">Temizle</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {output && <section aria-live="polite" className="mt-5 rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold">{validatorSlugs.has(slug) ? "Denetim sonucu" : "Sonuç"}</h3><output className="mt-2 block break-words font-mono text-sm">{output}</output></section>}
  </section>;
}
