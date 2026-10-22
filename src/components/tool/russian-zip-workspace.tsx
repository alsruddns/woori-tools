"use client";

import { useEffect, useState } from "react";

const copy = {
  choose: "Выберите файлы или перетащите их сюда",
  limits: "До 100 файлов · до 100 МБ на файл · до 200 МБ всего",
  create: "Создать ZIP-архив",
  processing: "Создание архива…",
  download: "Скачать ZIP-архив",
  clear: "Очистить выбор",
  empty: "Сначала выберите файлы для архива.",
  tooMany: "Можно выбрать не более 100 файлов.",
  tooLarge: "Размер отдельного файла не должен превышать 100 МБ.",
  total: "Общий размер файлов не должен превышать 200 МБ.",
  failure: "Не удалось создать ZIP-архив в браузере.",
  complete: (count: number) => `В архив добавлено файлов: ${count}.`,
  privacy: "Файлы обрабатываются только в браузере и не отправляются на сервер.",
} as const;

export function RussianZipWorkspace() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  useEffect(() => () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); }, [downloadUrl]);

  function choose(list?: FileList | File[]) {
    if (!list) return;
    const selected = Array.from(list);
    setError(""); setResult(""); setDownloadUrl("");
    if (selected.length > 100) { setFiles([]); setError(copy.tooMany); return; }
    if (selected.some((file) => file.size > 100 * 1024 * 1024)) { setFiles([]); setError(copy.tooLarge); return; }
    if (selected.reduce((sum, file) => sum + file.size, 0) > 200 * 1024 * 1024) { setFiles([]); setError(copy.total); return; }
    setFiles(selected);
  }

  async function createArchive() {
    if (!files.length) { setError(copy.empty); return; }
    setBusy(true); setError(""); setResult(""); setDownloadUrl("");
    try {
      const { zip } = await import("fflate");
      const entries: Record<string, Uint8Array> = {};
      for (const [index, file] of files.entries()) {
        const original = file.name.split(/[\\/]/).pop() || `file-${index + 1}`;
        const safeName = safeArchiveName(original);
        const unique = uniqueName(safeName, entries);
        entries[unique] = new Uint8Array(await file.arrayBuffer());
      }
      const data = await new Promise<Uint8Array>((resolve, reject) => zip(entries, { level: 3 }, (cause, zipped) => cause ? reject(cause) : resolve(zipped)));
      const buffer = new ArrayBuffer(data.byteLength);
      new Uint8Array(buffer).set(data);
      setDownloadUrl(URL.createObjectURL(new Blob([buffer], { type: "application/zip" })));
      setResult(copy.complete(files.length));
    } catch { setError(copy.failure); }
    finally { setBusy(false); }
  }

  function clear() { setFiles([]); setError(""); setResult(""); setDownloadUrl(""); }

  return <section aria-label="Создание ZIP-архива" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <label htmlFor="zip-files-input" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); choose(event.dataTransfer.files); }} className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:border-indigo-400">
      <span className="font-semibold text-slate-800">{copy.choose}</span><span className="mt-2 text-sm text-slate-500">{copy.limits}</span>
    </label>
    <input id="zip-files-input" type="file" multiple onChange={(event) => choose(event.target.files ?? undefined)} className="sr-only" />
    {files.length > 0 && <div className="mt-4 rounded-xl bg-slate-50 p-4"><ul className="max-h-48 space-y-2 overflow-auto text-sm">{files.map((file, index) => <li key={`${file.name}-${index}`} className="flex justify-between gap-3"><span className="truncate">{file.name}</span><span className="shrink-0 text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} МБ</span></li>)}</ul><button type="button" onClick={clear} className="mt-3 text-sm font-medium text-rose-700 underline">{copy.clear}</button></div>}
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void createArchive()} disabled={busy} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60">{busy ? copy.processing : copy.create}</button>{downloadUrl && <a href={downloadUrl} download="archive.zip" className="inline-flex min-h-12 items-center rounded-xl bg-emerald-700 px-5 font-semibold text-white">{copy.download}</a>}</div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}{result && <p role="status" aria-live="polite" className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">{result}</p>}
    <p className="mt-4 text-sm text-slate-600">{copy.privacy}</p>
  </section>;
}

function safeArchiveName(value: string) {
  return value.replace(/^[. ]+|[. ]+$/g, "").replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_") || "file";
}

function uniqueName(name: string, entries: Record<string, Uint8Array>) {
  if (!entries[name]) return name;
  const dot = name.lastIndexOf("."), stem = dot > 0 ? name.slice(0, dot) : name, extension = dot > 0 ? name.slice(dot) : "";
  let suffix = 2;
  while (entries[`${stem} (${suffix})${extension}`]) suffix++;
  return `${stem} (${suffix})${extension}`;
}
