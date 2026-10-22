"use client";

import { useState } from "react";

type SupportedSlug = "file-hash" | "mime-type-checker" | "file-extension-checker" | "file-size-checker" | "duplicate-file-checker";

const copy = {
  choose: "Выберите файлы или перетащите их сюда",
  limits: "До 100 файлов · до 100 МБ на файл · до 200 МБ всего",
  hash: "Рассчитать SHA-256",
  inspect: "Проверить файлы",
  reset: "Очистить выбор",
  empty: "Сначала выберите хотя бы один файл.",
  tooMany: "Можно выбрать не более 100 файлов.",
  tooLarge: "Размер отдельного файла не должен превышать 100 МБ.",
  total: "Общий размер файлов не должен превышать 200 МБ.",
  noExtension: "без расширения",
  unknownMime: "тип не определён браузером",
  unknownSignature: "Сигнатура не распознана",
  signature: { png: "PNG-сигнатура", jpeg: "JPEG-сигнатура", pdf: "PDF-сигнатура", gif: "GIF-сигнатура", zip: "ZIP-сигнатура" },
  noDuplicates: "Файлы с одинаковым содержимым не найдены.",
  duplicateGroup: (number: number) => `Группа ${number}:`,
} as const;

export function RussianFileInfoWorkspace({ slug, title }: { slug: SupportedSlug; title: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  function choose(list?: FileList | File[]) {
    if (!list) return;
    const selected = Array.from(list);
    setError(""); setResult("");
    if (selected.length > 100) { setFiles([]); setError(copy.tooMany); return; }
    if (selected.some((file) => file.size > 100 * 1024 * 1024)) { setFiles([]); setError(copy.tooLarge); return; }
    if (selected.reduce((sum, file) => sum + file.size, 0) > 200 * 1024 * 1024) { setFiles([]); setError(copy.total); return; }
    setFiles(selected);
  }

  async function inspect() {
    if (!files.length) { setError(copy.empty); return; }
    setBusy(true); setError(""); setResult("");
    try {
      const lines = await Promise.all(files.map(async (file) => {
        if (slug === "duplicate-file-checker") {
          const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
          return { name: file.name, hash: Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("") };
        }
        if (slug === "file-hash") {
          const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
          return `${file.name}\tSHA-256\t${Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
        }
        if (slug === "file-size-checker") return `${file.name}\t${formatFileSize(file.size)}`;
        const parts = file.name.split(".");
        const extension = parts.length > 1 ? `.${parts.at(-1)!.toLowerCase()}` : copy.noExtension;
        if (slug === "file-extension-checker") return `${file.name}\t.${extension}\t${file.type || copy.unknownMime}`;
        const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
        const prefix4 = String.fromCharCode(...bytes.slice(0, 4));
        const prefix3 = String.fromCharCode(...bytes.slice(0, 3));
        const prefix2 = String.fromCharCode(...bytes.slice(0, 2));
        const signature = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 ? copy.signature.png
          : bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff ? copy.signature.jpeg
            : prefix4 === "%PDF" ? copy.signature.pdf
              : prefix3 === "GIF" ? copy.signature.gif
                : prefix2 === "PK" ? copy.signature.zip : copy.unknownSignature;
        return `${file.name}\t${file.type || copy.unknownMime}\t${signature}`;
      }));
      if (slug === "duplicate-file-checker") {
        const groups = new Map<string, string[]>();
        for (const item of lines) if (typeof item !== "string") groups.set(item.hash, [...(groups.get(item.hash) ?? []), item.name]);
        const duplicates = [...groups.values()].filter((group) => group.length > 1);
        setResult(duplicates.length ? duplicates.map((group, index) => `${copy.duplicateGroup(index + 1)}\n${group.join("\n")}`).join("\n\n") : copy.noDuplicates);
      } else setResult(lines.join("\n"));
    } catch { setError("Не удалось обработать выбранные файлы в браузере."); }
    finally { setBusy(false); }
  }

  return <section aria-label={title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <label htmlFor="file-info-input" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); choose(event.dataTransfer.files); }} className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:border-indigo-400">
      <span className="font-semibold text-slate-800">{copy.choose}</span><span className="mt-2 text-sm text-slate-500">{copy.limits}</span>
    </label>
    <input id="file-info-input" type="file" multiple onChange={(event) => choose(event.target.files ?? undefined)} className="sr-only" />
    {files.length > 0 && <div className="mt-4 rounded-xl bg-slate-50 p-4"><ul className="max-h-48 space-y-2 overflow-auto text-sm">{files.map((file, index) => <li key={`${file.name}-${index}`} className="flex justify-between gap-3"><span className="truncate">{file.name}</span><span className="shrink-0 text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} МБ</span></li>)}</ul><button type="button" onClick={() => { setFiles([]); setResult(""); setError(""); }} className="mt-3 text-sm font-medium text-rose-700 underline">{copy.reset}</button></div>}
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void inspect()} disabled={busy} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60">{busy ? "Обработка…" : slug === "file-hash" ? copy.hash : copy.inspect}</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {result && <div className="mt-5"><h2 className="font-semibold">Результат</h2><pre role="status" aria-live="polite" className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{result}</pre></div>}
    <p className="mt-4 text-sm text-slate-600">Файлы анализируются только в вашем браузере и не отправляются на сервер.</p>
  </section>;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} Б`;
  const units = ["КБ", "МБ", "ГБ"];
  let size = bytes / 1024, unit = 0;
  while (size >= 1024 && unit < units.length - 1) { size /= 1024; unit++; }
  return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(size)} ${units[unit]}`;
}
