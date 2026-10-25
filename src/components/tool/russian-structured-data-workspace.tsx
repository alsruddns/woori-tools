"use client";

import { useEffect, useState } from "react";
import { processText } from "@/lib/text/process-text";
import { copyText } from "@/lib/copy-to-clipboard";

export type RussianDataSlug = "json-formatter" | "json-validator" | "json-to-yaml" | "yaml-to-json" | "csv-to-json" | "json-to-csv";

const copy: Record<RussianDataSlug, { title: string; input: string; placeholder: string; action: string; invalid: string; extension: string }> = {
  "json-formatter": { title: "Форматирование JSON", input: "Исходный JSON", placeholder: '{"name":"Анна","active":true}', action: "Форматировать JSON", invalid: "Проверьте синтаксис JSON и попробуйте снова.", extension: "json" },
  "json-validator": { title: "Проверка JSON", input: "JSON для проверки", placeholder: '{"name":"Анна","active":true}', action: "Проверить JSON", invalid: "Это некорректный JSON. Проверьте кавычки, запятые и скобки.", extension: "json" },
  "json-to-yaml": { title: "Преобразование JSON в YAML", input: "Исходный JSON", placeholder: '{"name":"Анна","active":true}', action: "Преобразовать в YAML", invalid: "Проверьте синтаксис JSON и попробуйте снова.", extension: "yaml" },
  "yaml-to-json": { title: "Преобразование YAML в JSON", input: "Исходный YAML", placeholder: "name: Анна\nactive: true", action: "Преобразовать в JSON", invalid: "Проверьте синтаксис YAML и попробуйте снова.", extension: "json" },
  "csv-to-json": { title: "Преобразование CSV в JSON", input: "Исходный CSV", placeholder: "name,age\nАнна,28", action: "Преобразовать в JSON", invalid: "Проверьте заголовки столбцов и строки CSV.", extension: "json" },
  "json-to-csv": { title: "Преобразование JSON в CSV", input: "Массив объектов JSON", placeholder: '[{"name":"Анна","age":28}]', action: "Преобразовать в CSV", invalid: "Введите корректный массив объектов JSON.", extension: "csv" },
};

export function RussianStructuredDataWorkspace({ slug }: { slug: RussianDataSlug }) {
  const words = copy[slug];
  const [input, setInput] = useState("");
  const [option, setOption] = useState("format");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  useEffect(() => () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); }, [downloadUrl]);

  async function run() {
    setError(""); setNotice(""); setResult("");
    if (!input.trim()) { setError("Введите данные для обработки."); return; }
    try {
      const processed = await processText(slug, input, "", option, 1, "ru");
      setResult(processed.result);
      if (slug === "json-validator") setNotice(processed.result);
      else setNotice("Обработка выполнена в браузере.");
    } catch {
      setError(words.invalid);
    }
  }

  function reset() { setInput(""); setResult(""); setError(""); setNotice(""); setDownloadUrl(""); }

  function download() {
    if (!result) return;
    const url = URL.createObjectURL(new Blob([result], { type: "text/plain;charset=utf-8" }));
    setDownloadUrl(url);
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${slug}.${words.extension}`; anchor.click();
  }

  return <section aria-label={words.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <h2 className="text-xl font-semibold text-slate-900">{words.title}</h2>
    <label htmlFor="structured-data-input" className="mt-5 block text-sm font-medium text-slate-800">{words.input}
      <textarea id="structured-data-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder={words.placeholder} rows={12} spellCheck={false} className="mt-2 block min-h-64 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm leading-6" />
    </label>
    {(slug === "json-formatter" || slug === "json-validator") && <label htmlFor="json-mode" className="mt-4 block text-sm font-medium text-slate-800">Формат вывода
      <select id="json-mode" value={option} onChange={(event) => setOption(event.target.value)} className="mt-2 block min-h-11 rounded-xl border border-slate-300 px-3">
        <option value="format">С отступами</option><option value="minify">Без пробелов</option>
      </select>
    </label>}
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void run()} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white">{words.action}</button><button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Очистить</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {notice && <p role="status" aria-live="polite" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
    {result && slug !== "json-validator" && <div className="mt-5"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold">Результат</h3><div className="flex gap-2"><button type="button" onClick={() => void copyText(result)} className="min-h-10 rounded-lg border border-slate-300 px-3 text-sm">Копировать</button><button type="button" onClick={download} className="min-h-10 rounded-lg border border-slate-300 px-3 text-sm">Скачать</button></div></div><pre className="mt-3 max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{result}</pre></div>}
    <p className="mt-4 text-sm text-slate-600">Данные обрабатываются локально в браузере и не отправляются на сервер.</p>
  </section>;
}
