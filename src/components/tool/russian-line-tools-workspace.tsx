"use client";

import { useState } from "react";
import { copyText } from "@/lib/copy-to-clipboard";
import { processText } from "@/lib/text/process-text";

type LineToolSlug = "shuffle-lines" | "add-line-numbers" | "remove-line-numbers" | "remove-empty-lines" | "remove-duplicate-lines" | "sort-lines";

const copy = {
  input: "Введите или вставьте текст",
  placeholder: "Каждая строка будет обработана отдельно",
  order: "Порядок сортировки",
  ascending: "По возрастанию",
  descending: "По убыванию",
  run: "Обработать строки",
  busy: "Обработка…",
  reset: "Сбросить",
  result: "Результат",
  copy: "Копировать результат",
  empty: "Введите текст для обработки.",
  failed: "Не удалось обработать текст.",
  privacy: "Текст обрабатывается в браузере и не отправляется на сервер.",
  titles: {
    "shuffle-lines": "Перемешивание строк",
    "add-line-numbers": "Добавление номеров строк",
    "remove-line-numbers": "Удаление номеров строк",
    "remove-empty-lines": "Удаление пустых строк",
    "remove-duplicate-lines": "Удаление повторяющихся строк",
    "sort-lines": "Сортировка строк",
  },
} as const;

export function RussianLineToolsWorkspace({ slug }: { slug: LineToolSlug }) {
  const [text, setText] = useState("");
  const [option, setOption] = useState("asc");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function run() {
    if (text.length === 0) { setError(copy.empty); setResult(""); return; }
    setBusy(true); setError(""); setResult("");
    try {
      const processed = await processText(slug, text, "", option, 1, "ru");
      setResult(processed.result);
    } catch (cause) { setError(cause instanceof Error ? cause.message : copy.failed); }
    finally { setBusy(false); }
  }

  function reset() { setText(""); setResult(""); setError(""); }

  return <section aria-label={copy.titles[slug]} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <label htmlFor="line-tool-input" className="mb-2 block text-sm font-medium text-slate-800">{copy.input}<textarea id="line-tool-input" value={text} onChange={(event) => { setText(event.target.value); setError(""); }} rows={9} placeholder={copy.placeholder} className="mt-2 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" /></label>
    {slug === "sort-lines" && <label htmlFor="line-sort-order" className="mt-4 block text-sm font-medium">{copy.order}<select id="line-sort-order" value={option} onChange={(event) => setOption(event.target.value === "desc" ? "desc" : "asc")} className="mt-2 block min-h-11 w-full rounded-xl border p-3 sm:max-w-sm"><option value="asc">{copy.ascending}</option><option value="desc">{copy.descending}</option></select></label>}
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void run()} disabled={busy} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60">{busy ? copy.busy : copy.run}</button><button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">{copy.reset}</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {result && <div className="mt-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">{copy.result}</h2><button type="button" onClick={() => void copyText(result)} className="min-h-10 rounded-xl border border-slate-300 px-4 text-sm font-medium">{copy.copy}</button></div><pre role="status" aria-live="polite" className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{result}</pre></div>}
    <p className="mt-4 text-sm text-slate-600">{copy.privacy}</p>
  </section>;
}
