"use client";

import { useState } from "react";
import { copyText } from "@/lib/copy-to-clipboard";
import { chineseCycle, chineseToNumber, convertSimplifiedTraditional, formatPhone, numberToChinese, rmbUppercase } from "@/lib/country-tools";
import type { RussianChinaSlug } from "@/components/tool/russian-china-tools-workspace";

const titles: Record<RussianChinaSlug, { title: string; label: string; placeholder: string }> = {
  "simplified-traditional-chinese-converter": { title: "Konwerter uproszczonych i tradycyjnych znaków chińskich", label: "Tekst chiński", placeholder: "Wpisz lub wklej tekst po chińsku" },
  "chinese-number-kanji-converter": { title: "Konwerter chińskich liczb i znaków", label: "Liczba lub zapis chiński", placeholder: "12345 lub 一万二千三百四十五" },
  "rmb-uppercase-converter": { title: "Kwota RMB zapisana chińskimi znakami finansowymi", label: "Kwota w juanach", placeholder: "1234.56" },
  "chinese-zodiac-calculator": { title: "Chiński znak zodiaku według roku urodzenia", label: "Rok urodzenia", placeholder: "1990" },
  "chinese-sexagenary-cycle-calculator": { title: "Chiński cykl sześćdziesięcioletni", label: "Rok", placeholder: "2024" },
  "chinese-phone-number-formatter": { title: "Formatowanie chińskiego numeru telefonu", label: "Chiński numer telefonu", placeholder: "13800138000" },
  "taiwan-phone-number-formatter": { title: "Formatowanie tajwańskiego numeru telefonu", label: "Tajwański numer telefonu", placeholder: "0912345678" },
};

const zodiacNames = ["szczur", "wół", "tygrys", "królik", "smok", "wąż", "koń", "koza", "małpa", "kogut", "pies", "świnia"];

export function PolishChinaToolsWorkspace({ slug }: { slug: RussianChinaSlug }) {
  const copy = titles[slug];
  const [input, setInput] = useState("");
  const [reverse, setReverse] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const directional = slug === "simplified-traditional-chinese-converter" || slug === "chinese-number-kanji-converter";

  function run() {
    setResult(""); setError("");
    if (!input.trim()) { setError("Wpisz wartość do przetworzenia."); return; }
    try {
      let value: string;
      switch (slug) {
        case "simplified-traditional-chinese-converter": value = convertSimplifiedTraditional(input, reverse ? "to-simplified" : "to-traditional"); break;
        case "chinese-number-kanji-converter": value = reverse ? String(chineseToNumber(input)) : numberToChinese(input); break;
        case "rmb-uppercase-converter": value = rmbUppercase(input); break;
        case "chinese-zodiac-calculator": {
          const year = Number(input);
          const cycle = chineseCycle(year);
          const index = ((year - 4) % 12 + 12) % 12;
          value = `Zwierzę zodiaku: ${zodiacNames[index]} (${cycle.zodiac})`;
          break;
        }
        case "chinese-sexagenary-cycle-calculator": {
          const cycle = chineseCycle(Number(input));
          value = `Cykl sześćdziesięcioletni: ${cycle.cycle}\nPień niebiański: ${cycle.stem}\nGałąź ziemska: ${cycle.branch}`;
          break;
        }
        case "chinese-phone-number-formatter": case "taiwan-phone-number-formatter": value = formatPhone(slug, input); break;
      }
      setResult(value);
    } catch {
      setError("Nie udało się przetworzyć wartości. Sprawdź jej format i spróbuj ponownie.");
    }
  }

  return <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <h2 className="text-xl font-semibold text-slate-900">{copy.title}</h2>
    {directional && <fieldset className="mt-4 flex flex-wrap gap-2"><legend className="mb-2 text-sm font-medium">Kierunek konwersji</legend><button type="button" aria-pressed={!reverse} onClick={() => setReverse(false)} className={`min-h-10 rounded-lg border px-3 ${!reverse ? "border-indigo-600 bg-indigo-50" : ""}`}>{slug === "simplified-traditional-chinese-converter" ? "Uproszczone → tradycyjne" : "Liczba → chińskie znaki"}</button><button type="button" aria-pressed={reverse} onClick={() => setReverse(true)} className={`min-h-10 rounded-lg border px-3 ${reverse ? "border-indigo-600 bg-indigo-50" : ""}`}>{slug === "simplified-traditional-chinese-converter" ? "Tradycyjne → uproszczone" : "Chińskie znaki → liczba"}</button></fieldset>}
    <label htmlFor="polish-china-tool-input" className="mt-5 block text-sm font-medium text-slate-800">{copy.label}<textarea id="polish-china-tool-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder={copy.placeholder} rows={5} className="mt-2 block min-h-36 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm" /></label>
    {slug === "rmb-uppercase-converter" && <p className="mt-2 text-sm text-slate-600">Konwersja zapisuje część całkowitą i fen w formalnej chińskiej notacji finansowej.</p>}
    {(slug === "chinese-zodiac-calculator" || slug === "chinese-sexagenary-cycle-calculator") && <p className="mt-2 text-sm text-slate-600">Wynik korzysta z tradycyjnego chińskiego cyklu, liczonego od 4 roku n.e.</p>}
    <p className="mt-3 text-xs text-slate-500">Wartości są przetwarzane lokalnie w przeglądarce i nie są wysyłane na serwer.</p>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={run} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white">{slug.includes("phone-number") ? "Formatuj numer" : slug.includes("calculator") ? "Oblicz" : "Konwertuj"}</button><button type="button" onClick={() => { setInput(""); setResult(""); setError(""); }} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Wyczyść</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {result && <div className="mt-5 rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold">Wynik</h3><pre role="status" aria-live="polite" className="mt-2 whitespace-pre-wrap break-words font-mono text-sm">{result}</pre><button type="button" onClick={() => void copyText(result)} className="mt-3 min-h-10 rounded-lg border px-4">Kopiuj wynik</button></div>}
    {(slug === "chinese-phone-number-formatter" || slug === "taiwan-phone-number-formatter") && <p className="mt-4 text-sm text-slate-600">Sprawdzany jest format i długość numeru. Narzędzie nie potwierdza, czy numer istnieje ani do kogo należy.</p>}
  </section>;
}
