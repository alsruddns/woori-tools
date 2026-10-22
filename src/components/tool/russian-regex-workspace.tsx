"use client";

import { useState } from "react";
import { copyText } from "@/lib/copy-to-clipboard";
import { processText } from "@/lib/text/process-text";

const copy = {
  title: "Проверка регулярных выражений",
  pattern: "Регулярное выражение",
  sample: "Текст для проверки",
  placeholder: "Например: /\\d+/g",
  run: "Найти совпадения",
  busy: "Проверка…",
  reset: "Сбросить",
  result: "Результат проверки",
  copy: "Копировать результат",
  empty: "Введите регулярное выражение и текст для проверки.",
  privacy: "Проверка выполняется в отдельном браузерном потоке с ограничением времени. Данные не отправляются на сервер.",
} as const;

export function RussianRegexWorkspace() {
  const [pattern, setPattern] = useState("");
  const [sample, setSample] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function run() {
    if (!pattern.trim() || !sample) { setError(copy.empty); setResult(""); return; }
    setBusy(true); setError(""); setResult("");
    try {
      const processed = await processText("regex-tester", pattern, sample, "", 1, "ru");
      setResult(processed.result);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Не удалось проверить выражение."); }
    finally { setBusy(false); }
  }

  function reset() { setPattern(""); setSample(""); setResult(""); setError(""); }

  return <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <label htmlFor="regex-pattern" className="block text-sm font-medium text-slate-800">{copy.pattern}<input id="regex-pattern" value={pattern} onChange={(event) => { setPattern(event.target.value); setError(""); }} placeholder={copy.placeholder} maxLength={220} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm" /></label>
    <label htmlFor="regex-sample" className="mt-4 block text-sm font-medium text-slate-800">{copy.sample}<textarea id="regex-sample" value={sample} onChange={(event) => { setSample(event.target.value); setError(""); }} rows={8} maxLength={20000} className="mt-2 block w-full rounded-xl border border-slate-300 p-3 font-mono text-sm" /></label>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void run()} disabled={busy} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60">{busy ? copy.busy : copy.run}</button><button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">{copy.reset}</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {result && <div className="mt-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">{copy.result}</h2><button type="button" onClick={() => void copyText(result)} className="min-h-10 rounded-xl border border-slate-300 px-4 text-sm font-medium">{copy.copy}</button></div><pre role="status" aria-live="polite" className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{result}</pre></div>}
    <p className="mt-4 text-sm text-slate-600">{copy.privacy}</p>
  </section>;
}
