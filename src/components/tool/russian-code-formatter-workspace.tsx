"use client";

import { useState } from "react";
import { copyText } from "@/lib/copy-to-clipboard";
import { processText } from "@/lib/text/process-text";

export type RussianCodeFormatterSlug = "sql-formatter" | "html-formatter" | "css-formatter" | "javascript-formatter";

const copyBySlug: Record<RussianCodeFormatterSlug, { title: string; placeholder: string }> = {
  "sql-formatter": { title: "Форматирование SQL", placeholder: "Вставьте SQL-запрос…" },
  "html-formatter": { title: "Форматирование HTML", placeholder: "Вставьте HTML-код…" },
  "css-formatter": { title: "Форматирование CSS", placeholder: "Вставьте CSS-код…" },
  "javascript-formatter": { title: "Форматирование JavaScript", placeholder: "Вставьте JavaScript-код…" },
};

const runLabel = "Отформатировать";
const emptyMessage = "Вставьте текст, который нужно отформатировать.";
const failureMessage = "Не удалось отформатировать текст. Проверьте его синтаксис и попробуйте снова.";

export function RussianCodeFormatterWorkspace({ slug }: { slug: RussianCodeFormatterSlug }) {
  const copy = copyBySlug[slug];
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function format() {
    if (!value.trim()) {
      setError(emptyMessage);
      setResult("");
      return;
    }

    setBusy(true);
    setError("");
    setResult("");
    try {
      const processed = await processText(slug, value, "", "", 1, "ru");
      setResult(processed.result);
    } catch {
      setError(failureMessage);
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setValue("");
    setResult("");
    setError("");
  }

  return (
    <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <label htmlFor="formatter-input" className="block text-sm font-medium text-slate-800">
        {copy.title}
        <textarea
          id="formatter-input"
          value={value}
          onChange={(event) => { setValue(event.target.value); setError(""); }}
          placeholder={copy.placeholder}
          rows={10}
          spellCheck={false}
          className="mt-2 block min-h-56 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm leading-6"
        />
      </label>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={() => void format()} disabled={busy} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60">
          {busy ? "Форматирование…" : runLabel}
        </button>
        <button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Очистить</button>
      </div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
      {result && (
        <div className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold">Результат</h2>
            <button type="button" onClick={() => void copyText(result)} className="min-h-10 rounded-xl border border-slate-300 px-4 text-sm font-medium">Копировать результат</button>
          </div>
          <pre role="status" aria-live="polite" className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{result}</pre>
        </div>
      )}
      <p className="mt-4 text-sm text-slate-600">Обработка выполняется в браузере. Код не отправляется на сервер.</p>
    </section>
  );
}
