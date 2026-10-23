"use client";

import { useState } from "react";
import { copyText } from "@/lib/copy-to-clipboard";
import { formatPhone, indianNumber, lakhCrore, validateGstin, validatePan } from "@/lib/country-tools";
import type { RussianIndiaSlug } from "@/components/tool/russian-india-tools-workspace";

const tools: Record<RussianIndiaSlug, { title: string; input: string; placeholder: string; note: string }> = {
  "indian-number-format-converter": { title: "Formatowanie liczb w indyjskim systemie liczbowym", input: "Liczba", placeholder: "12345678.9", note: "Grupowanie cyfr jest zgodne z indyjskim systemem zapisu liczb." },
  "lakh-crore-converter": { title: "Konwerter lakh i crore", input: "Liczba lub wartość lakh/crore", placeholder: "2500000 lub 25 lakh", note: "1 lakh = 100 000; 1 crore = 10 000 000." },
  "pan-format-validator": { title: "Sprawdzanie formatu PAN", input: "Numer PAN", placeholder: "ABCDE1234F", note: "Sprawdzana jest wyłącznie struktura identyfikatora. Narzędzie nie potwierdza tożsamości ani rejestracji." },
  "gstin-format-validator": { title: "Sprawdzanie formatu GSTIN", input: "Numer GSTIN", placeholder: "27AAPFU0939F1ZV", note: "Sprawdzane są format i znak kontrolny. Narzędzie nie odpytuje państwowych baz rejestracyjnych." },
  "india-phone-number-formatter": { title: "Formatowanie indyjskiego numeru telefonu", input: "Numer telefonu w Indiach", placeholder: "9876543210", note: "Numer jest formatowany lokalnie. Narzędzie nie sprawdza, czy numer istnieje." },
};

export function PolishIndiaToolsWorkspace({ slug }: { slug: RussianIndiaSlug }) {
  const copy = tools[slug];
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  function run() {
    setError(""); setResult("");
    if (!input.trim()) { setError("Wpisz wartość do sprawdzenia lub przetworzenia."); return; }
    try {
      if (slug === "indian-number-format-converter") setResult(indianNumber(input));
      else if (slug === "lakh-crore-converter") setResult(lakhCrore(input));
      else if (slug === "india-phone-number-formatter") setResult(formatPhone(slug, input));
      else {
        const outcome = slug === "pan-format-validator" ? validatePan(input) : validateGstin(input);
        const status = outcome.valid ? "Format jest poprawny" : "Format jest niepoprawny";
        const level = outcome.level === "checksum" ? "Suma kontrolna" : "Struktura";
        setResult(`${status}\nPoziom sprawdzenia: ${level}`);
      }
    } catch {
      setError("Nie udało się przetworzyć podanej wartości. Sprawdź jej format.");
    }
  }

  return <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <h2 className="text-xl font-semibold text-slate-900">{copy.title}</h2>
    <label htmlFor="polish-india-tool-input" className="mt-5 block text-sm font-medium text-slate-800">{copy.input}<input id="polish-india-tool-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder={copy.placeholder} autoComplete="off" className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 font-mono text-base sm:max-w-lg" /></label>
    <p className="mt-2 text-sm text-slate-600">{copy.note}</p>
    <p className="mt-3 text-xs text-slate-500">Dane są przetwarzane w przeglądarce i nie są wysyłane na serwer.</p>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={run} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white">{slug.includes("validator") ? "Sprawdź format" : slug.includes("formatter") ? "Formatuj numer" : "Konwertuj"}</button><button type="button" onClick={() => { setInput(""); setResult(""); setError(""); }} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Wyczyść</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {result && <div className="mt-5 rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold">Wynik</h3><pre role="status" aria-live="polite" className="mt-2 whitespace-pre-wrap break-words font-mono text-sm">{result}</pre><button type="button" onClick={() => void copyText(result)} className="mt-3 min-h-10 rounded-lg border px-4">Kopiuj wynik</button></div>}
  </section>;
}
