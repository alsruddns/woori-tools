"use client";

import { useState } from "react";
import { processText } from "@/lib/text/process-text";

export function RussianTextCompareWorkspace() {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [result, setResult] = useState("");

  async function compare() {
    const processed = await processText("text-compare", first, second, "", 1, "ru");
    setResult(processed.result);
  }

  function reset() { setFirst(""); setSecond(""); setResult(""); }

  return <section aria-label="Сравнение текста" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <div className="grid gap-4 md:grid-cols-2">
      <label htmlFor="compare-first" className="block text-sm font-medium text-slate-800">Первый текст<textarea id="compare-first" value={first} onChange={(event) => setFirst(event.target.value)} rows={10} className="mt-2 block min-h-56 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm leading-6" /></label>
      <label htmlFor="compare-second" className="block text-sm font-medium text-slate-800">Второй текст<textarea id="compare-second" value={second} onChange={(event) => setSecond(event.target.value)} rows={10} className="mt-2 block min-h-56 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm leading-6" /></label>
    </div>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void compare()} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white">Сравнить тексты</button><button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Очистить</button></div>
    {result && <div className="mt-5"><h2 className="font-semibold">Различия</h2><pre role="status" aria-live="polite" className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{result}</pre></div>}
    <p className="mt-4 text-sm text-slate-600">Сравнение выполняется в браузере. Тексты не отправляются на сервер.</p>
  </section>;
}
