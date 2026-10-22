"use client";

import { useState } from "react";
import { copyText } from "@/lib/copy-to-clipboard";
import { processText } from "@/lib/text/process-text";

type TextToolSlug = "remove-characters" | "text-repeater" | "remove-spaces" | "remove-line-breaks" | "text-case-converter" | "reverse-text" | "remove-duplicate-words" | "character-count";

const copy = {
  titles: {
    "remove-characters": "Удаление символов из текста",
    "text-repeater": "Повторение текста",
    "remove-spaces": "Удаление пробелов",
    "remove-line-breaks": "Удаление переносов строк",
    "text-case-converter": "Изменение регистра текста",
    "reverse-text": "Обратный порядок символов",
    "remove-duplicate-words": "Удаление повторяющихся слов",
    "character-count": "Подсчёт символов и слов",
  },
  input: "Введите или вставьте текст",
  option: "Параметр обработки",
  removeDigits: "Удалить цифры",
  removeLatin: "Удалить латинские буквы",
  removeHangul: "Удалить корейские слоги",
  removeSpecial: "Удалить знаки пунктуации и символы",
  removeText: "Удалить указанный фрагмент",
  repeatedWhitespace: "Сжать повторяющиеся пробелы",
  allWhitespace: "Удалить все пробельные символы",
  lower: "Строчные буквы",
  upper: "Заглавные буквы",
  titleCase: "С заглавной буквы в каждом слове",
  repeatCount: "Количество повторов",
  separator: "Разделитель между повторами",
  second: "Фрагмент для удаления",
  run: "Обработать текст",
  busy: "Обработка…",
  reset: "Сбросить",
  result: "Результат",
  copy: "Копировать результат",
  empty: "Введите текст для обработки.",
  tooLong: "Результат ограничен одним миллионом символов. Уменьшите количество повторов или длину текста.",
  failed: "Не удалось обработать текст.",
  privacy: "Текст обрабатывается в браузере и не отправляется на сервер.",
} as const;

export function RussianTextToolsWorkspace({ slug }: { slug: TextToolSlug }) {
  const [text, setText] = useState("");
  const [secondText, setSecondText] = useState("");
  const [option, setOption] = useState(() => slug === "remove-characters" ? "digits" : slug === "remove-spaces" ? "all" : slug === "text-case-converter" ? "lower" : "");
  const [amount, setAmount] = useState(3);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function run() {
    if (text.length === 0) { setError(copy.empty); setResult(""); return; }
    if (slug === "text-repeater" && text.length * Math.max(1, amount) > 1_000_000) { setError(copy.tooLong); setResult(""); return; }
    setBusy(true); setError(""); setResult("");
    try {
      const processed = await processText(slug, text, secondText, option, amount, "ru");
      setResult(processed.result);
    } catch (cause) { setError(cause instanceof Error && cause.message.includes("1,000,000") ? copy.tooLong : cause instanceof Error ? cause.message : copy.failed); }
    finally { setBusy(false); }
  }

  function reset() { setText(""); setSecondText(""); setResult(""); setError(""); }

  return <section aria-label={copy.titles[slug]} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <label htmlFor="russian-text-input" className="mb-2 block text-sm font-medium text-slate-800">{copy.input}<textarea id="russian-text-input" value={text} onChange={(event) => { setText(event.target.value); setError(""); }} rows={9} className="mt-2 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" /></label>
    {slug === "remove-characters" && <><label htmlFor="remove-character-option" className="mt-4 block text-sm font-medium">{copy.option}<select id="remove-character-option" value={option} onChange={(event) => setOption(event.target.value)} className="mt-2 block min-h-11 w-full rounded-xl border p-3 sm:max-w-md"><option value="digits">{copy.removeDigits}</option><option value="latin">{copy.removeLatin}</option><option value="hangul">{copy.removeHangul}</option><option value="special">{copy.removeSpecial}</option><option value="substring">{copy.removeText}</option></select></label>{option === "substring" && <label htmlFor="remove-substring" className="mt-4 block text-sm font-medium">{copy.second}<input id="remove-substring" value={secondText} onChange={(event) => setSecondText(event.target.value)} className="mt-2 block min-h-11 w-full rounded-xl border p-3" /></label>}</>}
    {slug === "remove-spaces" && <label htmlFor="remove-spaces-option" className="mt-4 block text-sm font-medium">{copy.option}<select id="remove-spaces-option" value={option} onChange={(event) => setOption(event.target.value)} className="mt-2 block min-h-11 w-full rounded-xl border p-3 sm:max-w-md"><option value="collapse">{copy.repeatedWhitespace}</option><option value="all">{copy.allWhitespace}</option></select></label>}
    {slug === "text-case-converter" && <label htmlFor="text-case-option" className="mt-4 block text-sm font-medium">{copy.option}<select id="text-case-option" value={option} onChange={(event) => setOption(event.target.value)} className="mt-2 block min-h-11 w-full rounded-xl border p-3 sm:max-w-md"><option value="lower">{copy.lower}</option><option value="upper">{copy.upper}</option><option value="title">{copy.titleCase}</option></select></label>}
    {slug === "text-repeater" && <div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium">{copy.repeatCount}<input type="number" min={1} max={100} value={amount} onChange={(event) => setAmount(Math.max(1, Math.min(100, Number(event.target.value) || 1)))} className="mt-2 block min-h-11 w-full rounded-xl border p-3" /></label><label className="text-sm font-medium">{copy.separator}<input value={option} onChange={(event) => setOption(event.target.value)} placeholder=", " className="mt-2 block min-h-11 w-full rounded-xl border p-3" /></label></div>}
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void run()} disabled={busy} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60">{busy ? copy.busy : copy.run}</button><button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">{copy.reset}</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {result && <div className="mt-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">{copy.result}</h2><button type="button" onClick={() => void copyText(result)} className="min-h-10 rounded-xl border border-slate-300 px-4 text-sm font-medium">{copy.copy}</button></div><pre role="status" aria-live="polite" className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{result}</pre></div>}
    <p className="mt-4 text-sm text-slate-600">{copy.privacy}</p>
  </section>;
}
