"use client";

import { useState } from "react";
import { runCountryTool } from "@/lib/country-tools";
import type { CountryToolSlug } from "@/lib/country-tool-slugs";

export type PolishFinalCountrySlug = Extract<CountryToolSlug,
  "vietnam-phone-number-formatter" | "vietnam-number-format-converter" |
  "italy-fiscal-code-format-validator" | "italy-vat-number-validator" | "italy-number-format-converter" | "italian-date-format-converter" |
  "australia-postcode-formatter" | "english-date-format-converter"
>;
type ToolCopy = { title: string; label: string; placeholder: string; action: string; hint: string };
const copy: Record<PolishFinalCountrySlug, ToolCopy> = {
  "vietnam-phone-number-formatter": { title: "Formater wietnamskiego numeru telefonu", label: "Numer telefonu", placeholder: "+84 912 345 678", action: "Formatuj numer", hint: "Porządkuje wietnamski numer telefonu z prefiksem kraju lub bez niego. Nie sprawdza, czy numer istnieje." },
  "vietnam-number-format-converter": { title: "Konwerter wietnamskiego formatu liczb", label: "Liczba", placeholder: "1234567.89", action: "Formatuj liczbę", hint: "Zapisuje liczbę z separatorami używanymi w wietnamskim formacie regionalnym." },
  "italy-fiscal-code-format-validator": { title: "Walidator włoskiego kodu podatkowego", label: "Codice Fiscale", placeholder: "RSSMRA85T10A562S", action: "Sprawdź kod", hint: "Sprawdza strukturę i znak kontrolny Codice Fiscale. Nie weryfikuje tożsamości ani rejestracji." },
  "italy-vat-number-validator": { title: "Walidator włoskiego numeru VAT", label: "Numer VAT", placeholder: "12345678903", action: "Sprawdź numer VAT", hint: "Sprawdza format i cyfrę kontrolną włoskiego numeru VAT. Nie odpytuje rejestru podatkowego." },
  "italy-number-format-converter": { title: "Konwerter włoskiego formatu liczb", label: "Liczba", placeholder: "1234567.89", action: "Formatuj liczbę", hint: "Zapisuje liczbę z włoskimi separatorami regionalnymi." },
  "italian-date-format-converter": { title: "Konwerter włoskiego formatu daty", label: "Data ISO lub data włoska", placeholder: "2026-10-24", action: "Formatuj datę", hint: "Zamienia datę ISO na zapis dzień/miesiąc/rok lub przywraca format ISO." },
  "australia-postcode-formatter": { title: "Sprawdzanie formatu australijskiego kodu pocztowego", label: "Kod pocztowy", placeholder: "2000", action: "Sprawdź kod", hint: "Sprawdza, czy kod pocztowy składa się z czterech cyfr. Nie sprawdza przypisania do adresu." },
  "english-date-format-converter": { title: "Konwerter angielskiego formatu daty", label: "Data ISO lub data lokalna", placeholder: "2026-10-24", action: "Formatuj datę", hint: "Konwertuje datę ISO na zapis brytyjski lub amerykański i pozwala odwrócić konwersję." },
};
const validators = new Set<PolishFinalCountrySlug>(["italy-fiscal-code-format-validator", "italy-vat-number-validator", "australia-postcode-formatter"]);
export function PolishFinalCountryToolsWorkspace({ slug }: { slug: PolishFinalCountrySlug }) {
  const item = copy[slug];
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("forward");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  function run() {
    setResult(""); setError("");
    if (!input.trim()) { setError("Wpisz wartość do sprawdzenia lub sformatowania."); return; }
    try {
      const value = runCountryTool(slug, input.trim(), mode);
      if (typeof value === "string") setResult(value);
      else if (value.valid) setResult(value.level === "checksum" ? "Format i suma kontrolna są prawidłowe." : "Format jest prawidłowy.");
      else setResult(value.level === "checksum" ? "Suma kontrolna jest nieprawidłowa." : "Format jest nieprawidłowy.");
    } catch { setError("Nie można przetworzyć tej wartości. Sprawdź format i spróbuj ponownie."); }
  }
  return <section aria-label={item.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
    <p className="mt-3 text-sm text-slate-600">{item.hint}</p>
    {slug === "english-date-format-converter" && <fieldset className="mt-4 flex flex-wrap gap-2"><legend className="mb-2 text-sm font-medium">Format daty</legend>{([["forward", "ISO → brytyjski"], ["reverse", "Brytyjski → ISO"], ["us", "ISO → amerykański"], ["us-reverse", "Amerykański → ISO"]] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={mode === value} onClick={() => setMode(value)} className="min-h-10 rounded-lg border px-3">{label}</button>)}</fieldset>}
    {slug === "italian-date-format-converter" && <fieldset className="mt-4 flex flex-wrap gap-2"><legend className="mb-2 text-sm font-medium">Kierunek konwersji</legend><button type="button" aria-pressed={mode === "forward"} onClick={() => setMode("forward")} className="min-h-10 rounded-lg border px-3">ISO → włoski</button><button type="button" aria-pressed={mode === "reverse"} onClick={() => setMode("reverse")} className="min-h-10 rounded-lg border px-3">Włoski → ISO</button></fieldset>}
    <label className="mt-5 block text-sm font-medium text-slate-800">{item.label}<input aria-label={item.label} value={input} onChange={(event) => setInput(event.target.value)} placeholder={item.placeholder} autoComplete="off" className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 font-mono sm:max-w-lg" /></label>
    <p className="mt-3 text-xs text-slate-500">Wartości są przetwarzane w przeglądarce i nie są wysyłane na serwer.</p>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={run} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white">{item.action}</button><button type="button" onClick={() => { setInput(""); setMode("forward"); setResult(""); setError(""); }} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Wyczyść</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {result && <section aria-live="polite" className="mt-5 rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold">{validators.has(slug) ? "Wynik sprawdzania" : "Wynik"}</h3><output className="mt-2 block break-words font-mono text-sm">{result}</output></section>}
  </section>;
}
