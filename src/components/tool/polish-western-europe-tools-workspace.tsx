"use client";

import { useState } from "react";
import { runCountryTool } from "@/lib/country-tools";
import type { CountryToolSlug } from "@/lib/country-tool-slugs";

export type PolishWesternEuropeSlug = Extract<CountryToolSlug,
  "spain-dni-validator" | "spain-nie-validator" | "spanish-number-format-converter" | "spanish-date-format-converter" |
  "france-phone-number-formatter" | "french-number-format-converter" | "french-date-format-converter" |
  "netherlands-iban-validator" | "dutch-number-format-converter" | "dutch-date-format-converter"
>;

type ToolCopy = { title: string; label: string; placeholder: string; action: string; hint: string };
const copy: Record<PolishWesternEuropeSlug, ToolCopy> = {
  "spain-dni-validator": { title: "Walidator hiszpańskiego numeru DNI", label: "Numer DNI", placeholder: "12345678Z", action: "Sprawdź DNI", hint: "Sprawdza format DNI i literę kontrolną. Nie potwierdza tożsamości ani rejestracji urzędowej." },
  "spain-nie-validator": { title: "Walidator hiszpańskiego numeru NIE", label: "Numer NIE", placeholder: "X1234567L", action: "Sprawdź NIE", hint: "Sprawdza format NIE i literę kontrolną. Nie potwierdza tożsamości ani rejestracji urzędowej." },
  "spanish-number-format-converter": { title: "Konwerter hiszpańskiego formatu liczb", label: "Liczba", placeholder: "1234567.89", action: "Formatuj liczbę", hint: "Zapisuje liczbę z hiszpańskimi separatorami regionalnymi." },
  "spanish-date-format-converter": { title: "Konwerter hiszpańskiego formatu daty", label: "Data ISO lub data hiszpańska", placeholder: "2026-10-24", action: "Formatuj datę", hint: "Zamienia datę ISO na zapis dzień/miesiąc/rok lub przywraca format ISO." },
  "france-phone-number-formatter": { title: "Formater francuskiego numeru telefonu", label: "Numer telefonu", placeholder: "0612345678", action: "Formatuj numer", hint: "Porządkuje francuski numer telefonu i dodaje prefiks kraju, jeśli jest potrzebny. Nie sprawdza, czy numer istnieje." },
  "french-number-format-converter": { title: "Konwerter francuskiego formatu liczb", label: "Liczba", placeholder: "1234567.89", action: "Formatuj liczbę", hint: "Zapisuje liczbę z francuskimi separatorami regionalnymi." },
  "french-date-format-converter": { title: "Konwerter francuskiego formatu daty", label: "Data ISO", placeholder: "2026-10-24", action: "Formatuj datę", hint: "Przekształca prawidłową datę ISO na francuski zapis dzień/miesiąc/rok." },
  "netherlands-iban-validator": { title: "Walidator holenderskiego numeru IBAN", label: "Numer IBAN", placeholder: "NL91ABNA0417164300", action: "Sprawdź IBAN", hint: "Sprawdza strukturę holenderskiego IBAN i sumę kontrolną MOD 97. Nie potwierdza istnienia rachunku ani jego właściciela." },
  "dutch-number-format-converter": { title: "Konwerter niderlandzkiego formatu liczb", label: "Liczba", placeholder: "1234567.89", action: "Formatuj liczbę", hint: "Zapisuje liczbę z niderlandzkimi separatorami regionalnymi." },
  "dutch-date-format-converter": { title: "Konwerter niderlandzkiego formatu daty", label: "Data ISO lub data niderlandzka", placeholder: "2026-10-24", action: "Formatuj datę", hint: "Zamienia datę ISO na zapis dzień-miesiąc-rok lub przywraca format ISO." },
};

const validators = new Set<PolishWesternEuropeSlug>(["spain-dni-validator", "spain-nie-validator", "netherlands-iban-validator"]);
const reversibleDates = new Set<PolishWesternEuropeSlug>(["spanish-date-format-converter", "dutch-date-format-converter"]);

export function PolishWesternEuropeToolsWorkspace({ slug }: { slug: PolishWesternEuropeSlug }) {
  const item = copy[slug];
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"forward" | "reverse">("forward");
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
    {reversibleDates.has(slug) && <fieldset className="mt-4 flex flex-wrap gap-2"><legend className="mb-2 text-sm font-medium">Kierunek konwersji</legend><button type="button" aria-pressed={mode === "forward"} onClick={() => setMode("forward")} className="min-h-10 rounded-lg border px-3">ISO → zapis lokalny</button><button type="button" aria-pressed={mode === "reverse"} onClick={() => setMode("reverse")} className="min-h-10 rounded-lg border px-3">Zapis lokalny → ISO</button></fieldset>}
    <label className="mt-5 block text-sm font-medium text-slate-800">{item.label}<input aria-label={item.label} value={input} onChange={(event) => setInput(event.target.value)} placeholder={item.placeholder} autoComplete="off" className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 font-mono sm:max-w-lg" /></label>
    <p className="mt-3 text-xs text-slate-500">Wartości są przetwarzane w przeglądarce i nie są wysyłane na serwer.</p>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={run} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white">{item.action}</button><button type="button" onClick={() => { setInput(""); setMode("forward"); setResult(""); setError(""); }} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Wyczyść</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {result && <section aria-live="polite" className="mt-5 rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold">{validators.has(slug) ? "Wynik sprawdzania" : "Wynik"}</h3><output className="mt-2 block break-words font-mono text-sm">{result}</output></section>}
  </section>;
}
