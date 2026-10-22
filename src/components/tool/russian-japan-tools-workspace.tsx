"use client";

import { useEffect, useState } from "react";
import { copyText } from "@/lib/copy-to-clipboard";
import { BINGO5_RANGES, convertKana, convertWidth, generateBingo5, generateNumbersGame, gregorianToWareki, japaneseZodiac, kanaToRomaji, kanjiToNumber, numberToKanji, warekiToGregorian, yakudoshi } from "@/lib/japanese-tools";

export type RussianJapanSlug = "wareki-converter" | "hiragana-katakana-converter" | "fullwidth-halfwidth-converter" | "japanese-romaji-converter" | "japanese-number-kanji-converter" | "yakudoshi-calculator" | "japanese-zodiac-calculator" | "numbers3-number-generator" | "numbers4-number-generator" | "bingo5-number-generator";

const eras = ["明治", "大正", "昭和", "平成", "令和"] as const;
const eraNames: Record<(typeof eras)[number], string> = { 明治: "Мэйдзи", 大正: "Тайсё", 昭和: "Сёва", 平成: "Хэйсэй", 令和: "Рэйва" };

export function RussianJapanToolsWorkspace({ slug }: { slug: RussianJapanSlug }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [reverse, setReverse] = useState(false);
  const [era, setEra] = useState<(typeof eras)[number]>("令和");
  const [eraYear, setEraYear] = useState("元");
  const [month, setMonth] = useState("5");
  const [day, setDay] = useState("1");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [currentYear, setCurrentYear] = useState(String(new Date().getFullYear()));
  const [count, setCount] = useState("1");
  const [history, setHistory] = useState<string[]>([]);
  const [historyReady, setHistoryReady] = useState(false);
  const lottery = ["numbers3-number-generator", "numbers4-number-generator", "bingo5-number-generator"].includes(slug);
  const historyKey = `japan-tool-history:${slug}`;

  useEffect(() => {
    if (!lottery) return;
    const timer = window.setTimeout(() => {
      try { const saved: unknown = JSON.parse(localStorage.getItem(historyKey) || "[]"); if (Array.isArray(saved) && saved.every((item) => typeof item === "string")) setHistory(saved.slice(0, 5)); } catch { setHistory([]); }
      setHistoryReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [historyKey, lottery]);
  useEffect(() => { if (lottery && historyReady) localStorage.setItem(historyKey, JSON.stringify(history)); }, [history, historyKey, historyReady, lottery]);

  const converter = ["wareki-converter", "hiragana-katakana-converter", "fullwidth-halfwidth-converter", "japanese-number-kanji-converter"].includes(slug);
  const title: Record<RussianJapanSlug, string> = {
    "wareki-converter": "Конвертер японского летоисчисления",
    "hiragana-katakana-converter": "Конвертер хираганы и катаканы",
    "fullwidth-halfwidth-converter": "Конвертер полноширинных и полуширинных символов",
    "japanese-romaji-converter": "Преобразование японской каны в ромадзи",
    "japanese-number-kanji-converter": "Конвертер японских чисел и кандзи",
    "yakudoshi-calculator": "Калькулятор якудоси",
    "japanese-zodiac-calculator": "Японский зодиак и шестидесятилетний цикл",
    "numbers3-number-generator": "Генератор Numbers 3",
    "numbers4-number-generator": "Генератор Numbers 4",
    "bingo5-number-generator": "Генератор Bingo 5",
  };

  function run() {
    setError(""); setOutput("");
    try {
      let value = "";
      switch (slug) {
        case "wareki-converter": value = reverse ? warekiToGregorian(era, eraYear, month, day) : (() => { const date = gregorianToWareki(input); return `${eraNames[date.era as keyof typeof eraNames] ?? date.era} ${date.yearLabel} · ${date.date}`; })(); break;
        case "hiragana-katakana-converter": value = convertKana(input, reverse ? "to-hiragana" : "to-katakana"); break;
        case "fullwidth-halfwidth-converter": value = convertWidth(input, reverse ? "to-half" : "to-full"); break;
        case "japanese-romaji-converter": value = kanaToRomaji(input); break;
        case "japanese-number-kanji-converter": value = reverse ? String(kanjiToNumber(input)) : numberToKanji(input); break;
        case "yakudoshi-calculator": {
          const years = yakudoshi(Number(input), Number(currentYear), gender);
          value = years.length ? years.map(({ year, age, phase }) => `${year} · ${age} лет · ${phase === "maeyaku" ? "предварительный год" : phase === "honyaku" ? "основной год" : "последующий год"}`).join("\n") : `${currentYear}: нет особых лет`;
          break;
        }
        case "japanese-zodiac-calculator": { const zodiac = japaneseZodiac(Number(input)); value = `Знак зодиака: ${zodiac.branch}\nШестидесятилетний цикл: ${zodiac.eto}`; break; }
        case "numbers3-number-generator": value = generateNumbersGame(3, Number(count)).join("\n"); break;
        case "numbers4-number-generator": value = generateNumbersGame(4, Number(count)).join("\n"); break;
        case "bingo5-number-generator": value = generateBingo5().map((number) => number === null ? "БЕСПЛАТНО" : String(number)).join(" · "); break;
      }
      setOutput(value);
      if (lottery) setHistory((previous) => [value, ...previous].slice(0, 5));
    } catch { setError("Проверьте введённые данные и формат даты."); }
  }

  return <section aria-label={title[slug]} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <h2 className="text-xl font-semibold text-slate-900">{title[slug]}</h2>
    {converter && slug !== "japanese-romaji-converter" && <fieldset className="mt-4 flex flex-wrap gap-2"><legend className="mb-2 text-sm font-medium">Направление преобразования</legend><button type="button" aria-pressed={!reverse} onClick={() => setReverse(false)} className={`min-h-10 rounded-lg border px-3 ${!reverse ? "border-indigo-600 bg-indigo-50" : ""}`}>{slug === "wareki-converter" ? "Григорианская дата → японская эра" : slug === "japanese-number-kanji-converter" ? "Число → японские цифры" : slug === "fullwidth-halfwidth-converter" ? "Полуширинные → полноширинные" : "Хирагана → катакана"}</button><button type="button" aria-pressed={reverse} onClick={() => setReverse(true)} className={`min-h-10 rounded-lg border px-3 ${reverse ? "border-indigo-600 bg-indigo-50" : ""}`}>{slug === "wareki-converter" ? "Японская эра → григорианская дата" : slug === "japanese-number-kanji-converter" ? "Японские цифры → число" : slug === "fullwidth-halfwidth-converter" ? "Полноширинные → полуширинные" : "Катакана → хирагана"}</button></fieldset>}
    {lottery && <p className="mt-3 text-sm text-slate-600">Правила указаны для Японии. Случайные числа не предсказывают розыгрыш и не гарантируют выигрыш.</p>}
    {slug === "wareki-converter" && reverse ? <div className="mt-4 grid gap-3 sm:grid-cols-4"><label className="text-sm">Эра<select value={era} onChange={(event) => setEra(event.target.value as (typeof eras)[number])} className="mt-1 min-h-11 w-full rounded-xl border p-3">{eras.map((name) => <option key={name} value={name}>{eraNames[name]} ({name})</option>)}</select></label><label className="text-sm">Год эры<input value={eraYear} onChange={(event) => setEraYear(event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border p-3" /></label><label className="text-sm">Месяц<input type="number" min="1" max="12" value={month} onChange={(event) => setMonth(event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border p-3" /></label><label className="text-sm">День<input type="number" min="1" max="31" value={day} onChange={(event) => setDay(event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border p-3" /></label></div> : lottery && slug !== "bingo5-number-generator" ? <label className="mt-4 block text-sm font-medium">Количество генераций<input type="number" min="1" max="10" value={count} onChange={(event) => setCount(event.target.value)} className="mt-2 block min-h-11 w-full rounded-xl border p-3 sm:max-w-xs" /></label> : lottery ? null : <label className="mt-4 block text-sm font-medium">{slug === "wareki-converter" ? "Дата" : slug === "yakudoshi-calculator" || slug === "japanese-zodiac-calculator" ? "Год рождения" : slug === "japanese-number-kanji-converter" ? "Число или японская запись" : "Текст на японской кане"}{slug === "wareki-converter" && !reverse ? <input type="date" value={input} onChange={(event) => setInput(event.target.value)} className="mt-2 block min-h-11 w-full rounded-xl border p-3" /> : <textarea rows={5} value={input} onChange={(event) => setInput(event.target.value)} placeholder={slug === "japanese-number-kanji-converter" ? (reverse ? "一万二千三百四十五" : "12345") : "Введите значение"} className="mt-2 block min-h-36 w-full rounded-xl border p-3 font-mono text-sm" />}</label>}
    {slug === "yakudoshi-calculator" && <div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm">Пол<select value={gender} onChange={(event) => setGender(event.target.value as "male" | "female")} className="mt-1 min-h-11 w-full rounded-xl border p-3"><option value="male">Мужской</option><option value="female">Женский</option></select></label><label className="text-sm">Текущий год<input type="number" min="1" max="9999" value={currentYear} onChange={(event) => setCurrentYear(event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border p-3" /></label></div>}
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={run} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white">{lottery ? output ? "Создать ещё" : "Создать номера" : slug === "yakudoshi-calculator" || slug === "japanese-zodiac-calculator" ? "Рассчитать" : "Преобразовать"}</button><button type="button" onClick={() => { setInput(""); setOutput(""); setError(""); if (lottery) setHistory([]); }} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Очистить</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {output && <div className="mt-5 rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold">Результат</h3>{slug === "bingo5-number-generator" ? <div className="mt-3 grid max-w-sm grid-cols-3 gap-2">{BINGO5_RANGES.map((range, index) => <div key={index} aria-label={range ? `Ячейка ${index + 1}: ${range[0]}–${range[1]}, ${output.split(" · ")[index]}` : "Бесплатная ячейка"} className={`grid aspect-square place-items-center rounded-xl border text-lg font-bold ${range ? "bg-white" : "bg-indigo-100"}`}>{range ? output.split(" · ")[index] : "БЕСПЛАТНО"}</div>)}</div> : <pre role="status" aria-live="polite" className="mt-2 whitespace-pre-wrap break-words font-mono text-sm">{output}</pre>}<button type="button" onClick={() => void copyText(output)} className="mt-3 min-h-10 rounded-lg border px-4">Копировать результат</button></div>}
    {slug === "yakudoshi-calculator" && <p className="mt-4 text-sm text-amber-800">Традиции якудоси различаются в зависимости от региона и святилища. Результат служит только культурной справкой.</p>}
    {slug === "japanese-romaji-converter" && <p className="mt-4 text-sm text-slate-600">Преобразуются только хирагана и катакана. Чтение кандзи и неизвестных имён не угадывается.</p>}
    {slug === "japanese-number-kanji-converter" && <p className="mt-4 text-sm text-slate-600">Поддерживаются целые числа; десятичные дроби не обрабатываются.</p>}
    {lottery && history.length > 0 && <section className="mt-5"><h3 className="text-sm font-semibold">Недавние результаты</h3><ul className="mt-2 space-y-1 text-sm">{history.map((item, index) => <li key={`${item}-${index}`} className="rounded-lg bg-slate-50 p-2 font-mono">{item}</li>)}</ul></section>}
    <p className="mt-4 text-sm text-slate-600">Данные обрабатываются в браузере и не отправляются на сервер.</p>
  </section>;
}
