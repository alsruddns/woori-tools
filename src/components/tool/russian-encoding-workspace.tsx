"use client";

import { useState } from "react";
import { processText } from "@/lib/text/process-text";
import { copyText } from "@/lib/copy-to-clipboard";
import { createUlid, createUuidV7, decodeBase32, encodeBase32 } from "@/lib/browser-developer-tools";

export type RussianEncodingSlug = "base64" | "url-encode-decode" | "timestamp-converter" | "uuid-generator" | "uuid-v7-generator" | "ulid-generator" | "base32-encoder-decoder";

const details: Record<RussianEncodingSlug, { title: string; label: string; placeholder: string; action: string; initial: string }> = {
  base64: { title: "Кодирование и декодирование Base64", label: "Текст или строка Base64", placeholder: "Введите текст для кодирования или строку Base64 для декодирования", action: "Преобразовать", initial: "encode" },
  "url-encode-decode": { title: "Кодирование и декодирование URL", label: "Текст или URL-кодированная строка", placeholder: "Например: привет мир", action: "Преобразовать", initial: "encode" },
  "timestamp-converter": { title: "Конвертер Unix timestamp", label: "Timestamp или дата", placeholder: "Например: 1712345678 или 2024-04-05T12:00:00Z", action: "Преобразовать дату", initial: "seconds" },
  "uuid-generator": { title: "Генератор UUID", label: "Количество UUID", placeholder: "1", action: "Создать UUID", initial: "" },
  "uuid-v7-generator": { title: "Генератор UUID версии 7", label: "Количество идентификаторов", placeholder: "1", action: "Создать UUID v7", initial: "" },
  "ulid-generator": { title: "Генератор ULID", label: "Количество идентификаторов", placeholder: "1", action: "Создать ULID", initial: "" },
  "base32-encoder-decoder": { title: "Кодирование и декодирование Base32", label: "Текст или строка Base32", placeholder: "Введите текст или строку Base32", action: "Преобразовать", initial: "encode" },
};

export function RussianEncodingWorkspace({ slug }: { slug: RussianEncodingSlug }) {
  const words = details[slug];
  const [input, setInput] = useState("");
  const [option, setOption] = useState(words.initial);
  const [amount, setAmount] = useState("1");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function run() {
    setError(""); setResult("");
    try {
      if (slug === "uuid-generator" || slug === "uuid-v7-generator" || slug === "ulid-generator") {
        const count = Math.max(1, Math.min(100, Math.trunc(Number(amount)) || 1));
        const values = Array.from({ length: count }, () => slug === "uuid-generator" ? crypto.randomUUID() : slug === "uuid-v7-generator" ? createUuidV7() : createUlid());
        setResult(values.join("\n")); return;
      }
      if (!input.trim()) { setError("Введите значение для обработки."); return; }
      if (slug === "base32-encoder-decoder") {
        setResult(option === "decode" ? decodeBase32(input) : encodeBase32(input)); return;
      }
      const processed = await processText(slug, input, "", option, Number(amount) || 1, "ru");
      setResult(processed.result);
    } catch {
      setError(slug === "timestamp-converter" ? "Проверьте timestamp или формат даты." : "Не удалось обработать ввод. Проверьте формат и выбранное действие.");
    }
  }

  const isGenerator = slug === "uuid-generator" || slug === "uuid-v7-generator" || slug === "ulid-generator";
  return <section aria-label={words.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <h2 className="text-xl font-semibold text-slate-900">{words.title}</h2>
    {isGenerator ? <label htmlFor="id-count" className="mt-5 block text-sm font-medium text-slate-800">{words.label}<input id="id-count" type="number" min="1" max="100" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder={words.placeholder} className="mt-2 block min-h-11 w-full rounded-xl border border-slate-300 p-3 sm:max-w-xs" /></label> : <label htmlFor="encoding-input" className="mt-5 block text-sm font-medium text-slate-800">{words.label}<textarea id="encoding-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder={words.placeholder} rows={8} className="mt-2 block min-h-48 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm leading-6" /></label>}
    {slug === "timestamp-converter" && <label htmlFor="timestamp-mode" className="mt-4 block text-sm font-medium text-slate-800">Единицы timestamp<select id="timestamp-mode" value={option} onChange={(event) => setOption(event.target.value)} className="mt-2 block min-h-11 rounded-xl border border-slate-300 px-3"><option value="seconds">Секунды</option><option value="milliseconds">Миллисекунды</option><option value="date">Дата и время</option></select></label>}
    {(slug === "base64" || slug === "url-encode-decode" || slug === "base32-encoder-decoder") && <label htmlFor="encoding-mode" className="mt-4 block text-sm font-medium text-slate-800">Действие<select id="encoding-mode" value={option} onChange={(event) => setOption(event.target.value)} className="mt-2 block min-h-11 rounded-xl border border-slate-300 px-3"><option value="encode">Кодировать</option><option value="decode">Декодировать</option></select></label>}
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void run()} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white">{words.action}</button><button type="button" onClick={() => { setInput(""); setResult(""); setError(""); }} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Очистить</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {result && <div className="mt-5"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold">Результат</h3><button type="button" onClick={() => void copyText(result)} className="min-h-10 rounded-lg border border-slate-300 px-3 text-sm">Копировать</button></div><pre role="status" aria-live="polite" className="mt-3 max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{result}</pre></div>}
    <p className="mt-4 text-sm text-slate-600">Обработка выполняется в браузере. Введённые данные не отправляются на сервер.</p>
  </section>;
}
