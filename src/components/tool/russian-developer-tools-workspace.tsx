"use client";

import { useState } from "react";
import { copyText } from "@/lib/copy-to-clipboard";
import { calculateChmod, calculateIpv4Cidr, compareHashes, convertCsvTsv, decodeHtmlEntities, decodeJwt, encodeHtmlEntities, evaluateJsonPath, inspectCodePoints, inspectUserAgent, parseUrlQuery, replaceWithRegex } from "@/lib/browser-developer-tools";

export type RussianDeveloperSlug = "jwt-decoder" | "url-query-parameter-parser" | "user-agent-parser" | "ip-cidr-calculator" | "hash-compare" | "regex-replace" | "html-entity-encoder-decoder" | "chmod-calculator" | "json-path-tester" | "csv-tsv-converter" | "url-slug-generator" | "unicode-code-point-checker";

type ToolCopy = { title: string; first: string; second?: string; third?: string; placeholder: string; initial?: "encode" | "csv-to-tsv"; hint?: string };
const tools: Record<RussianDeveloperSlug, ToolCopy> = {
  "jwt-decoder": { title: "Декодер JWT", first: "Токен JWT", placeholder: "Вставьте токен в формате header.payload.signature", hint: "Показывает payload и проверяет время exp. Подпись не проверяется, действительность токена не подтверждается." },
  "url-query-parameter-parser": { title: "Парсер параметров URL", first: "URL или строка параметров", placeholder: "https://example.com/?name=Anna&tag=a&tag=b", hint: "Повторяющиеся параметры выводятся отдельно и сохраняют порядок." },
  "user-agent-parser": { title: "Анализатор User-Agent", first: "Строка User-Agent", placeholder: "Вставьте строку User-Agent браузера", hint: "Результат основан на локальных эвристиках и может быть неточным." },
  "ip-cidr-calculator": { title: "Калькулятор IPv4 CIDR", first: "Адрес IPv4 в нотации CIDR", placeholder: "192.168.1.15/24" },
  "hash-compare": { title: "Сравнение хешей", first: "Первый хеш", second: "Второй хеш", placeholder: "Вставьте хеш" },
  "regex-replace": { title: "Замена по регулярному выражению", first: "Шаблон с флагами", second: "Исходный текст", third: "Текст замены", placeholder: "/слово/gi" },
  "html-entity-encoder-decoder": { title: "Кодирование HTML-сущностей", first: "Текст или HTML-сущности", placeholder: "Например: <p>Привет</p>", initial: "encode" },
  "chmod-calculator": { title: "Калькулятор прав доступа chmod", first: "Права в восьмеричном формате", placeholder: "755", hint: "Введите три или четыре восьмеричные цифры, например 644 или 0755." },
  "json-path-tester": { title: "Проверка выражения JSONPath", first: "JSON-документ", second: "Выражение JSONPath", placeholder: '{"store":{"items":[{"name":"Книга"}]}}' },
  "csv-tsv-converter": { title: "Преобразование CSV и TSV", first: "Табличные данные", placeholder: "name,age\nАнна,28", initial: "csv-to-tsv" },
  "url-slug-generator": { title: "Генератор URL-slug", first: "Название или заголовок", placeholder: "Мой пример заголовка", hint: "Русские буквы транслитерируются в латиницу для создания URL-slug." },
  "unicode-code-point-checker": { title: "Проверка кодовых точек Unicode", first: "Текст для анализа", placeholder: "Введите символы любого языка" },
};

function transliterateRussian(value: string) {
  const map: Record<string, string> = { а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya" };
  return Array.from(value, (character) => { const lower = character.toLocaleLowerCase("ru"); const replacement = map[lower]; return replacement === undefined ? character : character === lower ? replacement : replacement.charAt(0).toUpperCase() + replacement.slice(1); }).join("");
}

export function RussianDeveloperToolsWorkspace({ slug }: { slug: RussianDeveloperSlug }) {
  const copy = tools[slug];
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");
  const [choice, setChoice] = useState<"encode" | "decode" | "csv-to-tsv" | "tsv-to-csv">(copy.initial ?? "encode");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const needsSecond = ["hash-compare", "regex-replace", "json-path-tester"].includes(slug);
  const needsThird = slug === "regex-replace";
  const directional = ["html-entity-encoder-decoder", "csv-tsv-converter"].includes(slug);

  function run() {
    setError(""); setResult("");
    try {
      let value: unknown;
      switch (slug) {
        case "jwt-decoder": { const decoded = decodeJwt(first); const status = decoded.expiry === null ? "срок действия не указан" : decoded.status === "active" ? `действителен до ${new Date(decoded.expiry).toISOString()}` : `срок действия истёк ${new Date(decoded.expiry).toISOString()}`; value = `Payload:\n${JSON.stringify(decoded.payload, null, 2)}\n\nСтатус exp: ${status}`; break; }
        case "url-query-parameter-parser": value = parseUrlQuery(first).map(([key, item]) => `${key}\t${item}`).join("\n") || "Параметры не найдены."; break;
        case "user-agent-parser": { const parsed = inspectUserAgent(first); value = `Браузер: ${parsed.browser}\nВерсия: ${parsed.version}\nОперационная система: ${parsed.os}\nМобильное устройство: ${parsed.mobile ? "Да" : "Нет"}`; break; }
        case "ip-cidr-calculator": { const network = calculateIpv4Cidr(first); value = `Адрес: ${network.address}\nПрефикс: /${network.prefix}\nСеть: ${network.network}\nМаска: ${network.netmask}\nШироковещательный адрес: ${network.broadcast}\nПервый доступный адрес: ${network.firstUsable}\nПоследний доступный адрес: ${network.lastUsable}\nВсего адресов: ${network.addressCount}\nДоступных адресов: ${network.usableCount}\nДвоичная запись: ${network.binary}`; break; }
        case "hash-compare": { const compared = compareHashes(first, second); value = `${compared.equal ? "Хеши совпадают." : "Хеши различаются."}\nПервый: ${compared.first}\nВторой: ${compared.second}`; break; }
        case "regex-replace": value = replaceWithRegex(first, second, third); break;
        case "html-entity-encoder-decoder": value = choice === "encode" ? encodeHtmlEntities(first) : decodeHtmlEntities(first); break;
        case "chmod-calculator": { const mode = calculateChmod(first); value = `Восьмеричный формат: ${mode.octal}\nСимвольный формат: ${mode.symbolic}\nВладелец: ${mode.owner}\nГруппа: ${mode.group}\nОстальные: ${mode.others}`; break; }
        case "json-path-tester": value = JSON.stringify(evaluateJsonPath(first, second), null, 2); break;
        case "csv-tsv-converter": value = convertCsvTsv(first, choice === "tsv-to-csv" ? "tsv-to-csv" : "csv-to-tsv"); break;
        case "url-slug-generator": { const transliterated = transliterateRussian(first); value = transliterated.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-"); break; }
        case "unicode-code-point-checker": value = Array.from(first).map((character, index) => { const item = inspectCodePoints(character)[0]; return `${index + 1}. ${item.character === "(space)" ? "(пробел)" : item.character === "(newline)" ? "(новая строка)" : item.character}\t${item.codePoint}\tдесятичное: ${item.decimal}\tUTF-8: ${item.utf8Bytes} байт`; }).join("\n"); break;
      }
      setResult(typeof value === "string" ? value : JSON.stringify(value, null, 2));
    } catch { setError("Не удалось обработать данные. Проверьте формат ввода и выбранные параметры."); }
  }

  return <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <h2 className="text-xl font-semibold text-slate-900">{copy.title}</h2>
    <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">{copy.first}<textarea value={first} onChange={(event) => setFirst(event.target.value)} placeholder={copy.placeholder} rows={slug === "json-path-tester" ? 9 : 5} className="mt-2 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm" /></label>{needsSecond && <label className="block text-sm font-medium">{copy.second ?? "Второе значение"}<textarea value={second} onChange={(event) => setSecond(event.target.value)} placeholder={slug === "json-path-tester" ? "$.store.items[*].name" : "Введите текст"} rows={5} className="mt-2 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm" /></label>}{needsThird && <label className="block text-sm font-medium">{copy.third ?? "Текст замены"}<textarea value={third} onChange={(event) => setThird(event.target.value)} placeholder="замена" rows={3} className="mt-2 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm" /></label>}</div>
    {directional && <label className="mt-4 block text-sm font-medium">Действие<select value={choice} onChange={(event) => { const selected = event.target.value; if (selected === "encode" || selected === "decode" || selected === "csv-to-tsv" || selected === "tsv-to-csv") setChoice(selected); }} className="mt-2 block min-h-11 rounded-xl border border-slate-300 bg-white px-3">{slug === "csv-tsv-converter" ? <><option value="csv-to-tsv">CSV → TSV</option><option value="tsv-to-csv">TSV → CSV</option></> : <><option value="encode">Кодировать</option><option value="decode">Декодировать</option></>}</select></label>}
    {copy.hint && <p className="mt-3 text-sm text-slate-600">{copy.hint}</p>}
    <p className="mt-3 text-xs text-slate-500">Обработка происходит в этом браузере; введённые данные не отправляются на сервер.</p>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={run} className="min-h-11 rounded-xl bg-indigo-600 px-5 font-semibold text-white">Выполнить</button><button type="button" onClick={() => { setFirst(""); setSecond(""); setThird(""); setChoice(copy.initial ?? "encode"); setResult(""); setError(""); }} className="min-h-11 rounded-xl border px-5">Очистить</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {result && <section aria-live="polite" className="mt-5 rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold">Результат</h3><pre className="mt-2 max-h-[32rem] overflow-auto whitespace-pre-wrap break-words font-mono text-sm">{result}</pre><button type="button" onClick={() => void copyText(result)} className="mt-3 min-h-10 rounded-lg border px-4">Копировать</button></section>}
  </section>;
}
