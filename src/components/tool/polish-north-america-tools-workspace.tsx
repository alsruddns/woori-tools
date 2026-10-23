"use client";

import { useState } from "react";
import { runCountryTool } from "@/lib/country-tools";
import type { CountryToolSlug } from "@/lib/country-tool-slugs";

export type PolishNorthAmericaSlug = Extract<CountryToolSlug, "us-phone-number-formatter" | "us-zip-code-formatter" | "canada-postal-code-formatter" | "uk-postcode-formatter">;
type ToolCopy = { title: string; label: string; placeholder: string; action: string; hint: string };
const copy: Record<PolishNorthAmericaSlug, ToolCopy> = {
  "us-phone-number-formatter": { title: "Formater amerykańskiego numeru telefonu", label: "Numer telefonu", placeholder: "+1 212 555 0123", action: "Formatuj numer", hint: "Formatuje numer telefonu USA według numeru kierunkowego i lokalnego. Nie sprawdza, czy numer jest aktywny." },
  "us-zip-code-formatter": { title: "Formater amerykańskiego kodu ZIP", label: "Kod ZIP lub ZIP+4", placeholder: "10001-1234", action: "Formatuj kod", hint: "Normalizuje pięciocyfrowy kod ZIP lub rozszerzony format ZIP+4." },
  "canada-postal-code-formatter": { title: "Formater kanadyjskiego kodu pocztowego", label: "Kod pocztowy", placeholder: "K1A 0B1", action: "Formatuj kod", hint: "Sprawdza układ liter i cyfr kanadyjskiego kodu oraz normalizuje odstęp." },
  "uk-postcode-formatter": { title: "Formater brytyjskiego kodu pocztowego", label: "Kod pocztowy", placeholder: "SW1A 1AA", action: "Formatuj kod", hint: "Normalizuje zapis brytyjskiego kodu pocztowego. Nie sprawdza, czy kod przypisano do konkretnego adresu." },
};

export function PolishNorthAmericaToolsWorkspace({ slug }: { slug: PolishNorthAmericaSlug }) {
  const item = copy[slug];
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  function run() {
    setResult(""); setError("");
    if (!input.trim()) { setError("Wpisz wartość do sprawdzenia lub sformatowania."); return; }
    try {
      const value = runCountryTool(slug, input.trim());
      if (typeof value === "string") setResult(value);
      else setResult(value.valid ? "Format jest prawidłowy." : "Format jest nieprawidłowy.");
    } catch { setError("Nie można przetworzyć tej wartości. Sprawdź format i spróbuj ponownie."); }
  }
  return <section aria-label={item.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
    <p className="mt-3 text-sm text-slate-600">{item.hint}</p>
    <label className="mt-5 block text-sm font-medium text-slate-800">{item.label}<input aria-label={item.label} value={input} onChange={(event) => setInput(event.target.value)} placeholder={item.placeholder} autoComplete="off" className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 font-mono sm:max-w-lg" /></label>
    <p className="mt-3 text-xs text-slate-500">Wartości są przetwarzane w przeglądarce i nie są wysyłane na serwer.</p>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={run} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white">{item.action}</button><button type="button" onClick={() => { setInput(""); setResult(""); setError(""); }} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Wyczyść</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {result && <section aria-live="polite" className="mt-5 rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold">{slug.includes("formatter") ? "Wynik" : "Wynik formatowania"}</h3><output className="mt-2 block break-words font-mono text-sm">{result}</output></section>}
  </section>;
}
