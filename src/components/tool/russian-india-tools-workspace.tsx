"use client";

import { useState } from "react";
import { copyText } from "@/lib/copy-to-clipboard";
import { formatPhone, indianNumber, lakhCrore, validateGstin, validatePan } from "@/lib/country-tools";

export type RussianIndiaSlug = "indian-number-format-converter" | "lakh-crore-converter" | "pan-format-validator" | "gstin-format-validator" | "india-phone-number-formatter";

const tools: Record<RussianIndiaSlug, { title: string; input: string; placeholder: string; note: string }> = {
  "indian-number-format-converter": { title: "Форматирование чисел в индийской системе", input: "Число", placeholder: "12345678.9", note: "Группировка цифр выполняется по индийской системе разрядов." },
  "lakh-crore-converter": { title: "Конвертер lakh и crore", input: "Число или значение с lakh/crore", placeholder: "2500000 или 25 lakh", note: "1 lakh = 100 000; 1 crore = 10 000 000." },
  "pan-format-validator": { title: "Проверка формата PAN", input: "Номер PAN", placeholder: "ABCDE1234F", note: "Проверяется только структура идентификатора. Личность или регистрация не подтверждаются." },
  "gstin-format-validator": { title: "Проверка GSTIN и контрольного символа", input: "Номер GSTIN", placeholder: "27AAPFU0939F1ZV", note: "Проверяются формат и контрольный символ. Регистрация не проверяется по государственным базам." },
  "india-phone-number-formatter": { title: "Форматирование телефонного номера Индии", input: "Номер телефона Индии", placeholder: "9876543210", note: "Форматирование выполняется локально; существование номера не проверяется." },
};

export function RussianIndiaToolsWorkspace({ slug }: { slug: RussianIndiaSlug }) {
  const copy = tools[slug];
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  function run() {
    setError(""); setResult("");
    if (!input.trim()) { setError("Введите значение для обработки."); return; }
    try {
      if (slug === "indian-number-format-converter") setResult(indianNumber(input));
      else if (slug === "lakh-crore-converter") setResult(lakhCrore(input));
      else if (slug === "india-phone-number-formatter") setResult(formatPhone(slug, input));
      else {
        const outcome = slug === "pan-format-validator" ? validatePan(input) : validateGstin(input);
        setResult(`${outcome.valid ? "Формат корректен" : "Формат некорректен"}\nУровень проверки: ${outcome.level === "checksum" ? "контрольная сумма" : "структура"}`);
      }
    } catch { setError("Проверьте введённое значение и поддерживаемый формат."); }
  }
  return <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <h2 className="text-xl font-semibold text-slate-900">{copy.title}</h2>
    <label htmlFor="india-tool-input" className="mt-5 block text-sm font-medium text-slate-800">{copy.input}<input id="india-tool-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder={copy.placeholder} autoComplete="off" className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 font-mono text-base sm:max-w-lg" /></label>
    <p className="mt-2 text-sm text-slate-600">{copy.note}</p>
    <p className="mt-3 text-xs text-slate-500">Данные остаются в браузере и не отправляются на сервер.</p>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={run} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white">{slug.includes("validator") ? "Проверить формат" : slug.includes("formatter") ? "Форматировать" : "Преобразовать"}</button><button type="button" onClick={() => { setInput(""); setResult(""); setError(""); }} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Очистить</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {result && <div className="mt-5 rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold">Результат</h3><pre role="status" aria-live="polite" className="mt-2 whitespace-pre-wrap break-words font-mono text-sm">{result}</pre><button type="button" onClick={() => void copyText(result)} className="mt-3 min-h-10 rounded-lg border px-4">Копировать результат</button></div>}
  </section>;
}
