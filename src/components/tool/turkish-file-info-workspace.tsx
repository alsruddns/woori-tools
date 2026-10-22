"use client";

import { useState } from "react";

type FileInfoSlug = "file-hash" | "mime-type-checker" | "file-extension-checker" | "file-size-checker" | "duplicate-file-checker";

const maxFileCount = 100;
const maxFileSize = 100 * 1024 * 1024;
const maxTotalSize = 200 * 1024 * 1024;

export function TurkishFileInfoWorkspace({ slug, title }: { slug: FileInfoSlug; title: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function chooseFiles(fileList: FileList | null) {
    if (!fileList) return;
    const selected = Array.from(fileList);
    setResult([]);
    if (selected.length > maxFileCount) {
      setFiles([]);
      setError("En fazla 100 dosya seçebilirsiniz.");
      return;
    }
    if (selected.some((file) => file.size > maxFileSize)) {
      setFiles([]);
      setError("Tek bir dosyanın boyutu 100 MB'ı aşamaz.");
      return;
    }
    if (selected.reduce((total, file) => total + file.size, 0) > maxTotalSize) {
      setFiles([]);
      setError("Seçilen dosyaların toplam boyutu 200 MB'ı aşamaz.");
      return;
    }
    setError("");
    setFiles(selected);
  }

  async function inspectFiles() {
    if (files.length === 0) {
      setError("Önce en az bir dosya seçin.");
      return;
    }

    setBusy(true);
    setError("");
    setResult([]);
    try {
      if (slug === "file-hash" || slug === "duplicate-file-checker") {
        const rows = await Promise.all(files.map(async (file) => ({
          name: file.name,
          hash: await sha256(file),
        })));
        if (slug === "duplicate-file-checker") {
          const groups = new Map<string, string[]>();
          for (const row of rows) groups.set(row.hash, [...(groups.get(row.hash) ?? []), row.name]);
          const duplicates = [...groups.values()].filter((names) => names.length > 1);
          setResult(duplicates.length ? duplicates.flatMap((names, index) => [`Grup ${index + 1}`, ...names, ""]) : ["İçerikleri aynı olan dosya bulunamadı."]);
        } else {
          setResult(rows.map((row) => `${row.name}\tSHA-256\t${row.hash}`));
        }
      } else if (slug === "file-size-checker") {
        setResult(files.map((file) => `${file.name}\t${formatSize(file.size)}`));
      } else if (slug === "file-extension-checker") {
        setResult(files.map((file) => {
          const dot = file.name.lastIndexOf(".");
          const extension = dot > 0 ? file.name.slice(dot).toLowerCase() : "Uzantı yok";
          return `${file.name}\t${extension}\t${file.type || "MIME türü belirlenemedi"}`;
        }));
      } else {
        setResult(await Promise.all(files.map(async (file) => `${file.name}\t${file.type || "MIME türü belirlenemedi"}\t${await identifySignature(file)}`)));
      }
    } catch {
      setError("Dosyalar tarayıcınızda işlenemedi. Yeniden deneyin.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-label={title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <label
        htmlFor="turkish-file-info-input"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => { event.preventDefault(); chooseFiles(event.dataTransfer.files); }}
        className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:border-indigo-400"
      >
        <span className="font-semibold text-slate-800">Dosya seçin veya buraya sürükleyin</span>
        <span className="mt-2 text-sm text-slate-500">En fazla 100 dosya, dosya başına 100 MB ve toplam 200 MB</span>
      </label>
      <input id="turkish-file-info-input" type="file" multiple onChange={(event) => chooseFiles(event.target.files)} className="sr-only" />
      {files.length > 0 && (
        <div className="mt-4 rounded-xl bg-slate-50 p-4">
          <ul className="max-h-48 space-y-2 overflow-auto text-sm">
            {files.map((file, index) => <li key={`${file.name}-${index}`} className="flex justify-between gap-3"><span className="truncate">{file.name}</span><span className="shrink-0 text-slate-500">{formatSize(file.size)}</span></li>)}
          </ul>
          <button type="button" onClick={() => { setFiles([]); setResult([]); setError(""); }} className="mt-3 text-sm font-medium text-rose-700 underline">Seçimi temizle</button>
        </div>
      )}
      <button type="button" onClick={() => void inspectFiles()} disabled={busy} className="mt-5 min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60">
        {busy ? "İnceleniyor…" : slug === "file-hash" ? "SHA-256 özeti oluştur" : "Dosyaları incele"}
      </button>
      {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
      {result.length > 0 && <div className="mt-5"><h2 className="font-semibold">Sonuçlar</h2><pre role="status" aria-live="polite" className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{result.join("\n")}</pre></div>}
      <p className="mt-4 text-sm text-slate-600">Dosyalar yalnızca tarayıcınızda incelenir ve sunucuya gönderilmez.</p>
    </section>
  );
}

async function sha256(file: File) {
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function identifySignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "PNG imzası";
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "JPEG imzası";
  if (String.fromCharCode(...bytes.slice(0, 4)) === "%PDF") return "PDF imzası";
  if (String.fromCharCode(...bytes.slice(0, 3)) === "GIF") return "GIF imzası";
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) return "ZIP imzası";
  return "Dosya imzası tanınmadı";
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let size = bytes / 1024;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) { size /= 1024; unit++; }
  return `${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 1 }).format(size)} ${units[unit]}`;
}
