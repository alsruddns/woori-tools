"use client";

import { useState } from "react";
import { copyText } from "@/lib/copy-to-clipboard";
import { runCountryTool } from "@/lib/country-tools";
import type { CountryToolSlug } from "@/lib/country-tool-slugs";

export type RussianInternationalSlug = "germany-iban-validator" | "german-number-format-converter" | "german-date-format-converter" | "spain-dni-validator" | "spain-nie-validator" | "spanish-number-format-converter" | "spanish-date-format-converter" | "france-phone-number-formatter" | "french-number-format-converter" | "french-date-format-converter" | "brazil-cpf-validator" | "brazil-cnpj-validator" | "brazil-phone-number-formatter" | "brazil-cep-formatter" | "netherlands-iban-validator" | "dutch-number-format-converter" | "dutch-date-format-converter" | "vietnam-phone-number-formatter" | "vietnam-number-format-converter" | "italy-fiscal-code-format-validator" | "italy-vat-number-validator" | "italy-number-format-converter" | "italian-date-format-converter" | "australia-postcode-formatter" | "english-date-format-converter";

const titles: Record<RussianInternationalSlug, { title: string; placeholder: string }> = {
  "germany-iban-validator": { title: "Проверка немецкого IBAN", placeholder: "DE89370400440532013000" },
  "german-number-format-converter": { title: "Форматирование чисел по немецким правилам", placeholder: "1.234,56" },
  "german-date-format-converter": { title: "Преобразование немецкого формата даты", placeholder: "2026-10-23" },
  "spain-dni-validator": { title: "Проверка контрольной буквы DNI", placeholder: "12345678Z" },
  "spain-nie-validator": { title: "Проверка контрольной буквы NIE", placeholder: "X1234567L" },
  "spanish-number-format-converter": { title: "Форматирование чисел по испанским правилам", placeholder: "1.234,56" },
  "spanish-date-format-converter": { title: "Преобразование испанского формата даты", placeholder: "2026-10-23" },
  "france-phone-number-formatter": { title: "Форматирование телефонного номера Франции", placeholder: "0612345678" },
  "french-number-format-converter": { title: "Форматирование чисел по французским правилам", placeholder: "1 234,56" },
  "french-date-format-converter": { title: "Преобразование французского формата даты", placeholder: "2026-10-23" },
  "brazil-cpf-validator": { title: "Проверка контрольной суммы CPF", placeholder: "529.982.247-25" },
  "brazil-cnpj-validator": { title: "Проверка контрольной суммы CNPJ", placeholder: "12.345.678/0001-95" },
  "brazil-phone-number-formatter": { title: "Форматирование телефонного номера Бразилии", placeholder: "11987654321" },
  "brazil-cep-formatter": { title: "Форматирование бразильского почтового индекса CEP", placeholder: "01001000" },
  "netherlands-iban-validator": { title: "Проверка нидерландского IBAN", placeholder: "NL91ABNA0417164300" },
  "dutch-number-format-converter": { title: "Форматирование чисел по нидерландским правилам", placeholder: "1.234,56" },
  "dutch-date-format-converter": { title: "Преобразование нидерландского формата даты", placeholder: "2026-10-23" },
  "vietnam-phone-number-formatter": { title: "Форматирование телефонного номера Вьетнама", placeholder: "0912345678" },
  "vietnam-number-format-converter": { title: "Форматирование чисел по вьетнамским правилам", placeholder: "1.234,56" },
  "italy-fiscal-code-format-validator": { title: "Проверка формата итальянского Codice Fiscale", placeholder: "RSSMRA85T10A562S" },
  "italy-vat-number-validator": { title: "Проверка контрольной суммы итальянского VAT", placeholder: "12345678903" },
  "italy-number-format-converter": { title: "Форматирование чисел по итальянским правилам", placeholder: "1.234,56" },
  "italian-date-format-converter": { title: "Преобразование итальянского формата даты", placeholder: "2026-10-23" },
  "australia-postcode-formatter": { title: "Проверка формата австралийского почтового индекса", placeholder: "2000" },
  "english-date-format-converter": { title: "Преобразование британского и американского форматов даты", placeholder: "2026-10-23" },
};
const dateSlugs = new Set<RussianInternationalSlug>(["spanish-date-format-converter", "dutch-date-format-converter", "italian-date-format-converter", "english-date-format-converter"]);
const validationSlugs = new Set<RussianInternationalSlug>(["germany-iban-validator", "spain-dni-validator", "spain-nie-validator", "brazil-cpf-validator", "brazil-cnpj-validator", "netherlands-iban-validator", "italy-fiscal-code-format-validator", "italy-vat-number-validator", "australia-postcode-formatter"]);

function isValidationResult(value: unknown): value is { valid: boolean; level: string } {
  return typeof value === "object" && value !== null && "valid" in value && typeof value.valid === "boolean" && "level" in value && typeof value.level === "string";
}

export function RussianInternationalToolsWorkspace({ slug }: { slug: RussianInternationalSlug }) {
  const copy = titles[slug];
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("forward");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  function run() {
    setResult(""); setError("");
    if (!input.trim()) { setError("Введите значение для обработки."); return; }
    try {
      const output: unknown = runCountryTool(slug satisfies CountryToolSlug, input, mode);
      if (isValidationResult(output)) {
        const level = output.level === "checksum" ? "контрольная сумма" : "формат";
        setResult(`${output.valid ? "Проверка пройдена" : "Проверка не пройдена"}\nПроверено: ${level}`);
      } else setResult(String(output));
    } catch { setError("Проверьте значение и поддерживаемый формат."); }
  }
  const isEnglishDate = slug === "english-date-format-converter";
  return <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <h2 className="text-xl font-semibold text-slate-900">{copy.title}</h2>
    {dateSlugs.has(slug) && <label className="mt-4 block text-sm font-medium">{isEnglishDate ? "Регион и направление" : "Направление преобразования"}<select value={mode} onChange={(event) => setMode(event.target.value)} className="mt-2 block min-h-11 rounded-xl border border-slate-300 bg-white px-3">{isEnglishDate ? <><option value="uk">Великобритания: ISO → день/месяц/год</option><option value="uk-reverse">Великобритания: день/месяц/год → ISO</option><option value="us">США: ISO → месяц/день/год</option><option value="us-reverse">США: месяц/день/год → ISO</option></> : <><option value="forward">ISO → местная дата</option><option value="reverse">Местная дата → ISO</option></>}</select></label>}
    <label htmlFor="international-tool-input" className="mt-5 block text-sm font-medium text-slate-800">{validationSlugs.has(slug) ? "Значение для проверки" : "Значение"}<input id="international-tool-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder={copy.placeholder} autoComplete="off" className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 font-mono text-base sm:max-w-lg" /></label>
    {slug === "germany-iban-validator" || slug === "netherlands-iban-validator" ? <p className="mt-2 text-sm text-slate-600">Проверяется формат IBAN и контрольная сумма MOD 97. Наличие банковского счёта не подтверждается.</p> : slug === "spain-dni-validator" || slug === "spain-nie-validator" || slug === "brazil-cpf-validator" || slug === "brazil-cnpj-validator" || slug === "italy-vat-number-validator" || slug === "italy-fiscal-code-format-validator" ? <p className="mt-2 text-sm text-slate-600">Проверяется формат и контрольная сумма там, где она предусмотрена. Личность и государственная регистрация не проверяются.</p> : slug === "australia-postcode-formatter" ? <p className="mt-2 text-sm text-slate-600">Выполняется только проверка четырёхзначного формата почтового индекса.</p> : null}
    <p className="mt-3 text-xs text-slate-500">Обработка выполняется локально в браузере; данные не отправляются на сервер.</p>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={run} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white">{validationSlugs.has(slug) ? "Проверить" : slug.endsWith("formatter") ? "Форматировать" : "Преобразовать"}</button><button type="button" onClick={() => { setInput(""); setResult(""); setError(""); }} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Очистить</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {result && <div className="mt-5 rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold">Результат</h3><pre role="status" aria-live="polite" className="mt-2 whitespace-pre-wrap break-words font-mono text-sm">{result}</pre><button type="button" onClick={() => void copyText(result)} className="mt-3 min-h-10 rounded-lg border px-4">Копировать результат</button></div>}
  </section>;
}
