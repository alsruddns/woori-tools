"use client";

import { useState } from "react";
import { runCountryTool } from "@/lib/country-tools";
import type { CountryToolSlug } from "@/lib/country-tool-slugs";

export type PolishGermanySlug = Extract<CountryToolSlug, "germany-iban-validator" | "german-number-format-converter" | "german-date-format-converter">;

const copy: Record<PolishGermanySlug, { title: string; label: string; placeholder: string; action: string; hint: string }> = {
  "germany-iban-validator": { title: "Walidator niemieckiego numeru IBAN", label: "Numer IBAN", placeholder: "DE89370400440532013000", action: "Sprawdź IBAN", hint: "Sprawdza strukturę niemieckiego IBAN i sumę kontrolną MOD 97. Nie potwierdza istnienia rachunku ani jego właściciela." },
  "german-number-format-converter": { title: "Konwerter niemieckiego formatu liczb", label: "Liczba", placeholder: "1234567.89", action: "Formatuj liczbę", hint: "Zapisuje liczbę z niemieckimi separatorami: kropką dla tysięcy i przecinkiem dziesiętnym." },
  "german-date-format-converter": { title: "Konwerter niemieckiego formatu daty", label: "Data ISO", placeholder: "2026-10-23", action: "Formatuj datę", hint: "Przekształca prawidłową datę ISO na niemiecki zapis dzień.miesiąc.rok." },
};

export function PolishGermanyToolsWorkspace({ slug }: { slug: PolishGermanySlug }) {
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
      else setResult(value.valid ? value.level === "checksum" ? "Numer IBAN i suma kontrolna są prawidłowe." : "Format jest prawidłowy." : value.level === "checksum" ? "Suma kontrolna IBAN jest nieprawidłowa." : "Format jest nieprawidłowy.");
    } catch { setError("Nie można przetworzyć tej wartości. Sprawdź jej format i spróbuj ponownie."); }
  }

  return <section aria-label={item.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
    <p className="mt-3 text-sm text-slate-600">{item.hint}</p>
    <label className="mt-5 block text-sm font-medium text-slate-800">{item.label}<input aria-label={item.label} value={input} onChange={(event) => setInput(event.target.value)} placeholder={item.placeholder} autoComplete="off" className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 font-mono sm:max-w-lg" /></label>
    <p className="mt-3 text-xs text-slate-500">Przetwarzanie odbywa się w przeglądarce. Wpisane dane nie są wysyłane na serwer.</p>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={run} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white">{item.action}</button><button type="button" onClick={() => { setInput(""); setResult(""); setError(""); }} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Wyczyść</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {result && <section aria-live="polite" className="mt-5 rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold">{slug === "germany-iban-validator" ? "Wynik walidacji" : "Wynik"}</h3><output className="mt-2 block break-words font-mono text-sm">{result}</output></section>}
  </section>;
}
