"use client";

import { useState } from "react";
import { copyText } from "@/lib/copy-to-clipboard";

const paragraphs = [
  "В повседневной жизни мы используем разные инструменты, чтобы быстрее справляться с небольшими задачами. Хороший сервис понятен с первого взгляда и помогает сосредоточиться на результате.",
  "Удобный рабочий процесс начинается с простой идеи: убрать лишние шаги, сохранить контроль и получить аккуратный результат. Попробуйте разные варианты и выберите тот, который подходит именно вам.",
  "Изображения, документы и заметки часто становятся частью общего проекта. Если заранее продумать структуру и порядок действий, работать с материалами будет намного проще.",
  "Новые привычки формируются постепенно. Небольшое улучшение каждый день помогает поддерживать порядок, экономить время и спокойнее решать привычные задачи.",
] as const;

const copy = {
  title: "Генератор текста-заполнителя",
  count: "Количество абзацев",
  generate: "Создать текст",
  result: "Сгенерированный текст",
  copy: "Копировать текст",
  reset: "Сбросить",
  privacy: "Текст создаётся в браузере и не отправляется на сервер.",
} as const;

export function RussianLoremWorkspace() {
  const [count, setCount] = useState(3);
  const [result, setResult] = useState("");

  function generate() {
    setResult(Array.from({ length: count }, (_, index) => paragraphs[index % paragraphs.length]).join("\n\n"));
  }

  return <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <label htmlFor="lorem-paragraph-count" className="block text-sm font-medium text-slate-800">{copy.count}<input id="lorem-paragraph-count" type="number" min={1} max={20} value={count} onChange={(event) => setCount(Math.max(1, Math.min(20, Number(event.target.value) || 1)))} className="mt-2 block min-h-11 w-full rounded-xl border p-3 sm:max-w-sm" /></label>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={generate} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white">{copy.generate}</button><button type="button" onClick={() => setResult("")} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">{copy.reset}</button></div>
    {result && <div className="mt-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">{copy.result}</h2><button type="button" onClick={() => void copyText(result)} className="min-h-10 rounded-xl border border-slate-300 px-4 text-sm font-medium">{copy.copy}</button></div><pre role="status" aria-live="polite" className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-800">{result}</pre></div>}
    <p className="mt-4 text-sm text-slate-600">{copy.privacy}</p>
  </section>;
}
