"use client";

import { useState } from "react";
import { copyText } from "@/lib/copy-to-clipboard";
import { chineseCycle, chineseToNumber, convertSimplifiedTraditional, formatPhone, numberToChinese, rmbUppercase } from "@/lib/country-tools";

export type RussianChinaSlug = "simplified-traditional-chinese-converter" | "chinese-number-kanji-converter" | "rmb-uppercase-converter" | "chinese-zodiac-calculator" | "chinese-sexagenary-cycle-calculator" | "chinese-phone-number-formatter" | "taiwan-phone-number-formatter";

const titles: Record<RussianChinaSlug, { title: string; label: string; placeholder: string }> = {
  "simplified-traditional-chinese-converter": { title: "Преобразователь упрощённых и традиционных китайских иероглифов", label: "Китайский текст", placeholder: "输入或粘贴中文文本" },
  "chinese-number-kanji-converter": { title: "Конвертер китайских чисел и иероглифов", label: "Число или китайская запись", placeholder: "12345 или 一万二千三百四十五" },
  "rmb-uppercase-converter": { title: "Сумма в юанях прописью китайскими финансовыми иероглифами", label: "Сумма в юанях", placeholder: "1234.56" },
  "chinese-zodiac-calculator": { title: "Китайский зодиак по году рождения", label: "Год", placeholder: "1990" },
  "chinese-sexagenary-cycle-calculator": { title: "Китайский шестидесятилетний цикл", label: "Год", placeholder: "2024" },
  "chinese-phone-number-formatter": { title: "Форматирование телефонного номера Китая", label: "Телефонный номер Китая", placeholder: "13800138000" },
  "taiwan-phone-number-formatter": { title: "Форматирование телефонного номера Тайваня", label: "Телефонный номер Тайваня", placeholder: "0912345678" },
};
const zodiacNames = ["Крыса", "Бык", "Тигр", "Кролик", "Дракон", "Змея", "Лошадь", "Коза", "Обезьяна", "Петух", "Собака", "Свинья"];

export function RussianChinaToolsWorkspace({ slug }: { slug: RussianChinaSlug }) {
  const copy = titles[slug];
  const [input, setInput] = useState("");
  const [reverse, setReverse] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const directional = slug === "simplified-traditional-chinese-converter" || slug === "chinese-number-kanji-converter";
  function run() {
    setResult(""); setError("");
    if (!input.trim()) { setError("Введите значение для обработки."); return; }
    try {
      let value: string;
      switch (slug) {
        case "simplified-traditional-chinese-converter": value = convertSimplifiedTraditional(input, reverse ? "to-simplified" : "to-traditional"); break;
        case "chinese-number-kanji-converter": value = reverse ? String(chineseToNumber(input)) : numberToChinese(input); break;
        case "rmb-uppercase-converter": value = rmbUppercase(input); break;
        case "chinese-zodiac-calculator": { const cycle = chineseCycle(Number(input)); const index = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"].indexOf(cycle.zodiac); value = `Животное зодиака: ${zodiacNames[index]} (${cycle.zodiac})`; break; }
        case "chinese-sexagenary-cycle-calculator": { const cycle = chineseCycle(Number(input)); value = `Шестидесятилетний цикл: ${cycle.cycle}\nНебесный ствол: ${cycle.stem}\nЗемная ветвь: ${cycle.branch}`; break; }
        case "chinese-phone-number-formatter": case "taiwan-phone-number-formatter": value = formatPhone(slug, input); break;
      }
      setResult(value);
    } catch { setError("Проверьте значение и формат ввода."); }
  }
  return <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <h2 className="text-xl font-semibold text-slate-900">{copy.title}</h2>
    {directional && <fieldset className="mt-4 flex flex-wrap gap-2"><legend className="mb-2 text-sm font-medium">Направление преобразования</legend><button type="button" aria-pressed={!reverse} onClick={() => setReverse(false)} className={`min-h-10 rounded-lg border px-3 ${!reverse ? "border-indigo-600 bg-indigo-50" : ""}`}>{slug === "simplified-traditional-chinese-converter" ? "Упрощённые → традиционные" : "Число → китайские иероглифы"}</button><button type="button" aria-pressed={reverse} onClick={() => setReverse(true)} className={`min-h-10 rounded-lg border px-3 ${reverse ? "border-indigo-600 bg-indigo-50" : ""}`}>{slug === "simplified-traditional-chinese-converter" ? "Традиционные → упрощённые" : "Китайские иероглифы → число"}</button></fieldset>}
    <label htmlFor="china-tool-input" className="mt-5 block text-sm font-medium text-slate-800">{copy.label}<textarea id="china-tool-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder={copy.placeholder} rows={5} className="mt-2 block min-h-36 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm" /></label>
    {slug === "rmb-uppercase-converter" && <p className="mt-2 text-sm text-slate-600">Поддерживаются суммы с точностью до двух знаков после запятой.</p>}
    {(slug === "chinese-zodiac-calculator" || slug === "chinese-sexagenary-cycle-calculator") && <p className="mt-2 text-sm text-slate-600">Используется традиционный цикл, отсчитываемый от года 4 нашей эры.</p>}
    <p className="mt-3 text-xs text-slate-500">Ввод обрабатывается локально в браузере и не отправляется на сервер.</p>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={run} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white">{slug.includes("phone-number") ? "Форматировать номер" : slug.includes("calculator") ? "Рассчитать" : "Преобразовать"}</button><button type="button" onClick={() => { setInput(""); setResult(""); setError(""); }} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Очистить</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {result && <div className="mt-5 rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold">Результат</h3><pre role="status" aria-live="polite" className="mt-2 whitespace-pre-wrap break-words font-mono text-sm">{result}</pre><button type="button" onClick={() => void copyText(result)} className="mt-3 min-h-10 rounded-lg border px-4">Копировать результат</button></div>}
    {(slug === "chinese-phone-number-formatter" || slug === "taiwan-phone-number-formatter") && <p className="mt-4 text-sm text-slate-600">Проверяется формат и длина. Существование номера или его владельца инструмент не подтверждает.</p>}
  </section>;
}
