"use client";

import { useEffect, useMemo, useState } from "react";
import { renameFileNames } from "@/lib/file-renamer.mjs";

type RenameSlug = "bulk-file-renamer" | "filename-cleaner";

const labels = {
  choose: "Выберите файлы или перетащите их сюда",
  limits: "До 100 файлов · до 100 МБ на файл · до 200 МБ всего",
  prefix: "Префикс",
  suffix: "Суффикс",
  find: "Найти в имени",
  replace: "Заменить на",
  start: "Начальный номер",
  padding: "Минимум цифр в номере",
  before: "Исходное имя",
  after: "Новое имя",
  empty: "Сначала выберите файлы.",
  count: "Можно выбрать не более 100 файлов.",
  large: "Размер отдельного файла не должен превышать 100 МБ.",
  total: "Общий размер файлов не должен превышать 200 МБ.",
  reset: "Очистить выбор",
  process: "Переименовать и создать ZIP",
  processing: "Создание архива…",
  download: "Скачать ZIP-архив",
  done: (count: number) => `В архив добавлено файлов: ${count}.`,
} as const;

export function RussianRenameWorkspace({ slug, title }: { slug: RenameSlug; title: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [startNumber, setStartNumber] = useState("");
  const [padding, setPadding] = useState("0");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const renamed = useMemo(() => {
    if (slug === "bulk-file-renamer") return renameFileNames(files.map((file) => file.name), { prefix, suffix, find, replace, startNumber, padding });
    return renameFileNames(files.map((file, index) => file.name.split(/[\\/]/).pop()?.normalize("NFKC").replace(/[<>:"/\\|?*\u0000-\u001f]/g, "").trim().replace(/\s+/g, "_").replace(/_+/g, "_") || `file-${index + 1}`));
  }, [files, slug, prefix, suffix, find, replace, startNumber, padding]);

  useEffect(() => () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); }, [downloadUrl]);

  function choose(list?: FileList | File[]) {
    if (!list) return;
    const selected = Array.from(list);
    setError(""); setResult(""); setDownloadUrl("");
    if (selected.length > 100) { setFiles([]); setError(labels.count); return; }
    if (selected.some((file) => file.size > 100 * 1024 * 1024)) { setFiles([]); setError(labels.large); return; }
    if (selected.reduce((sum, file) => sum + file.size, 0) > 200 * 1024 * 1024) { setFiles([]); setError(labels.total); return; }
    setFiles(selected);
  }

  async function process() {
    if (!files.length) { setError(labels.empty); return; }
    setBusy(true); setError(""); setResult(""); setDownloadUrl("");
    try {
      const { zip } = await import("fflate");
      const entries: Record<string, Uint8Array> = {};
      for (const [index, file] of files.entries()) {
        const name = renamed[index] || `file-${index + 1}`;
        const unique = uniqueName(name, entries);
        entries[unique] = new Uint8Array(await file.arrayBuffer());
      }
      const data = await new Promise<Uint8Array>((resolve, reject) => zip(entries, { level: 3 }, (cause, zipped) => cause ? reject(cause) : resolve(zipped)));
      const buffer = new ArrayBuffer(data.byteLength); new Uint8Array(buffer).set(data);
      setDownloadUrl(URL.createObjectURL(new Blob([buffer], { type: "application/zip" })));
      setResult(labels.done(files.length));
    } catch { setError("Не удалось подготовить архив в браузере."); }
    finally { setBusy(false); }
  }

  const fields: Array<{ label: string; value: string; update: (value: string) => void; numeric: boolean; max?: number }> = [
    { label: labels.prefix, value: prefix, update: setPrefix, numeric: false },
    { label: labels.suffix, value: suffix, update: setSuffix, numeric: false },
    { label: labels.find, value: find, update: setFind, numeric: false },
    { label: labels.replace, value: replace, update: setReplace, numeric: false },
    { label: labels.start, value: startNumber, update: setStartNumber, numeric: true },
    { label: labels.padding, value: padding, update: setPadding, numeric: true, max: 12 },
  ];

  return <section aria-label={title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <label htmlFor="rename-files" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); choose(event.dataTransfer.files); }} className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:border-indigo-400"><span className="font-semibold text-slate-800">{labels.choose}</span><span className="mt-2 text-sm text-slate-500">{labels.limits}</span></label>
    <input id="rename-files" type="file" multiple onChange={(event) => choose(event.target.files ?? undefined)} className="sr-only" />
    {files.length > 0 && <>
      {slug === "bulk-file-renamer" && <div className="mt-5 grid gap-3 sm:grid-cols-2">{fields.map(({ label, value, update, numeric, max }) => <label key={label} className="text-sm font-medium">{label}<input type={numeric ? "number" : "text"} min={numeric ? 0 : undefined} max={max} value={value} onChange={(event) => update(event.target.value)} className="mt-1 block min-h-10 w-full rounded-lg border p-2" /></label>)}</div>}
      <div className="mt-4 overflow-auto rounded-xl border"><table className="w-full min-w-[480px] text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-2">{labels.before}</th><th className="p-2">{labels.after}</th></tr></thead><tbody>{files.map((file, index) => <tr key={`${file.name}-${index}`} className="border-t"><td className="max-w-56 truncate p-2">{file.name}</td><td className="max-w-56 truncate p-2 font-medium">{renamed[index]}</td></tr>)}</tbody></table></div>
      <button type="button" onClick={() => { setFiles([]); setError(""); setResult(""); setDownloadUrl(""); }} className="mt-3 text-sm font-medium text-rose-700 underline">{labels.reset}</button>
    </>}
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void process()} disabled={busy} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60">{busy ? labels.processing : labels.process}</button>{downloadUrl && <a href={downloadUrl} download={`${slug}.zip`} className="inline-flex min-h-12 items-center rounded-xl bg-emerald-700 px-5 font-semibold text-white">{labels.download}</a>}</div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}{result && <p role="status" aria-live="polite" className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">{result}</p>}
    <p className="mt-4 text-sm text-slate-600">Переименование и упаковка выполняются в браузере. Исходные файлы не отправляются на сервер.</p>
  </section>;
}

function uniqueName(name: string, entries: Record<string, Uint8Array>) {
  if (!entries[name]) return name;
  const dot = name.lastIndexOf("."), stem = dot > 0 ? name.slice(0, dot) : name, extension = dot > 0 ? name.slice(dot) : "";
  let suffix = 2;
  while (entries[`${stem} (${suffix})${extension}`]) suffix++;
  return `${stem} (${suffix})${extension}`;
}
