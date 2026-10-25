"use client";

import { useState } from "react";
import { copyText } from "@/lib/copy-to-clipboard";
import { formatCanadaPostalCode, formatPhone, formatUkPostcode, formatUsZip } from "@/lib/country-tools";

export type RussianAddressSlug = "us-phone-number-formatter" | "us-zip-code-formatter" | "canada-postal-code-formatter" | "uk-postcode-formatter";

const labels: Record<RussianAddressSlug, { title: string; input: string; placeholder: string; example: string }> = {
  "us-phone-number-formatter": { title: "Форматирование телефонного номера США", input: "Номер телефона США", placeholder: "2025550123", example: "Вставьте номер из 10 цифр или номер с кодом страны +1." },
  "us-zip-code-formatter": { title: "Форматирование почтового индекса США", input: "Почтовый индекс США", placeholder: "100011234", example: "Поддерживаются ZIP из 5 цифр и ZIP+4 из 9 цифр." },
  "canada-postal-code-formatter": { title: "Форматирование почтового индекса Канады", input: "Почтовый индекс Канады", placeholder: "K1A0B1", example: "Введите канадский индекс, например K1A 0B1." },
  "uk-postcode-formatter": { title: "Форматирование почтового индекса Великобритании", input: "Почтовый индекс Великобритании", placeholder: "SW1A1AA", example: "Введите британский почтовый индекс, например SW1A 1AA." },
};

export function RussianAddressWorkspace({ slug }: { slug: RussianAddressSlug }) {
  const text = labels[slug];
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  function format() {
    setResult(""); setError("");
    if (!input.trim()) { setError("Введите значение для форматирования."); return; }
    try {
      const value = slug === "us-phone-number-formatter" ? formatPhone(slug, input) : slug === "us-zip-code-formatter" ? formatUsZip(input) : slug === "canada-postal-code-formatter" ? formatCanadaPostalCode(input) : formatUkPostcode(input);
      setResult(value);
    }
    catch { setError("Проверьте длину номера и допустимые символы для выбранной страны."); }
  }
  return <section aria-label={text.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <h2 className="text-xl font-semibold text-slate-900">{text.title}</h2>
    <label htmlFor="address-format-input" className="mt-5 block text-sm font-medium text-slate-800">{text.input}<input id="address-format-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder={text.placeholder} autoComplete="off" className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 font-mono text-base sm:max-w-lg" /></label>
    <p className="mt-2 text-sm text-slate-600">{text.example}</p>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={format} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white">Форматировать</button><button type="button" onClick={() => { setInput(""); setResult(""); setError(""); }} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Очистить</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {result && <div className="mt-5 rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold">Результат</h3><p role="status" aria-live="polite" className="mt-2 font-mono text-lg">{result}</p><button type="button" onClick={() => void copyText(result)} className="mt-3 min-h-10 rounded-lg border px-4">Копировать результат</button></div>}
    <p className="mt-4 text-sm text-slate-600">Ввод обрабатывается локально в браузере. Проверяется только формат, существование номера или адреса не подтверждается.</p>
  </section>;
}
