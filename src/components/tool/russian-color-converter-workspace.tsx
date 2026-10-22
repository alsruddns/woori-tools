"use client";

import { useState } from "react";
import { copyText } from "@/lib/copy-to-clipboard";
import { processText } from "@/lib/text/process-text";

const copy = {
  title: "Конвертер цветовых кодов",
  input: "Введите цвет",
  placeholder: "HEX, например #3366FF; rgb(51, 102, 255) или hsl(225, 100%, 60%)",
  run: "Преобразовать цвет",
  busy: "Преобразование…",
  reset: "Сбросить",
  result: "Представления цвета",
  copy: "Копировать результат",
  empty: "Введите цвет в формате HEX, RGB или HSL.",
  privacy: "Преобразование выполняется в браузере.",
} as const;

export function RussianColorConverterWorkspace() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function convert() {
    if (!value.trim()) { setError(copy.empty); setResult(""); return; }
    setBusy(true); setError(""); setResult("");
    try { const processed = await processText("color-converter", value, "", "", 1, "ru"); setResult(processed.result); }
    catch (cause) { setError(cause instanceof Error ? cause.message : copy.empty); }
    finally { setBusy(false); }
  }

  function reset() { setValue(""); setResult(""); setError(""); }

  return <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <label htmlFor="color-converter-input" className="block text-sm font-medium text-slate-800">{copy.input}<input id="color-converter-input" value={value} onChange={(event) => { setValue(event.target.value); setError(""); }} onKeyDown={(event) => { if (event.key === "Enter") void convert(); }} placeholder={copy.placeholder} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm" /></label>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void convert()} disabled={busy} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60">{busy ? copy.busy : copy.run}</button><button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">{copy.reset}</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {result && <div className="mt-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">{copy.result}</h2><button type="button" onClick={() => void copyText(result)} className="min-h-10 rounded-xl border border-slate-300 px-4 text-sm font-medium">{copy.copy}</button></div><pre role="status" aria-live="polite" className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{result}</pre></div>}
    <p className="mt-4 text-sm text-slate-600">{copy.privacy}</p>
  </section>;
}
