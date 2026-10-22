"use client";

import { useEffect, useState } from "react";

const maxFileCount = 100;
const maxFileSize = 100 * 1024 * 1024;
const maxTotalSize = 200 * 1024 * 1024;

export function TurkishZipWorkspace({ title }: { title: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  useEffect(() => () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); }, [downloadUrl]);

  function chooseFiles(fileList: FileList | null) {
    if (!fileList) return;
    const selected = Array.from(fileList);
    setDownloadUrl(""); setError("");
    if (selected.length > maxFileCount) { setFiles([]); setError("En fazla 100 dosya seçebilirsiniz."); return; }
    if (selected.some((file) => file.size > maxFileSize)) { setFiles([]); setError("Tek bir dosyanın boyutu 100 MB'ı aşamaz."); return; }
    if (selected.reduce((total, file) => total + file.size, 0) > maxTotalSize) { setFiles([]); setError("Dosyaların toplam boyutu 200 MB'ı aşamaz."); return; }
    setFiles(selected);
  }

  async function createArchive() {
    if (!files.length) { setError("Önce arşive eklemek istediğiniz dosyaları seçin."); return; }
    setBusy(true); setError(""); setDownloadUrl("");
    try {
      const { zip } = await import("fflate");
      const entries: Record<string, Uint8Array> = {};
      for (const [index, file] of files.entries()) {
        const path = file.webkitRelativePath || file.name;
        entries[uniqueName(path, entries, index)] = new Uint8Array(await file.arrayBuffer());
      }
      const bytes = await new Promise<Uint8Array>((resolve, reject) => zip(entries, { level: 3 }, (cause, zipped) => cause ? reject(cause) : resolve(zipped)));
      const buffer = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(buffer).set(bytes);
      setDownloadUrl(URL.createObjectURL(new Blob([buffer], { type: "application/zip" })));
    } catch {
      setError("ZIP arşivi tarayıcınızda oluşturulamadı. Yeniden deneyin.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-label={title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <label htmlFor="turkish-zip-input" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFiles(event.dataTransfer.files); }} className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:border-indigo-400">
        <span className="font-semibold text-slate-800">Arşive eklenecek dosyaları seçin veya sürükleyin</span>
        <span className="mt-2 text-sm text-slate-500">En fazla 100 dosya, dosya başına 100 MB ve toplam 200 MB</span>
      </label>
      <input id="turkish-zip-input" type="file" multiple onChange={(event) => chooseFiles(event.target.files)} className="sr-only" />
      {files.length > 0 && <div className="mt-4 rounded-xl bg-slate-50 p-4"><ul className="max-h-56 space-y-2 overflow-auto text-sm">{files.map((file, index) => <li key={`${file.name}-${index}`} className="flex justify-between gap-3"><span className="truncate">{file.webkitRelativePath || file.name}</span><span className="shrink-0 text-slate-500">{formatSize(file.size)}</span></li>)}</ul><button type="button" onClick={() => { setFiles([]); setDownloadUrl(""); setError(""); }} className="mt-3 text-sm font-medium text-rose-700 underline">Seçimi temizle</button></div>}
      <button type="button" onClick={() => void createArchive()} disabled={busy} className="mt-5 min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60">{busy ? "ZIP arşivi hazırlanıyor…" : "ZIP arşivi oluştur"}</button>
      {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
      {downloadUrl && <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">Arşiv hazır. <a href={downloadUrl} download="woori-archive.zip" className="font-semibold underline">ZIP dosyasını indir</a></p>}
      <p className="mt-4 text-sm text-slate-600">Dosyalar tarayıcınızda işlenir ve sunucuya gönderilmez.</p>
    </section>
  );
}

function uniqueName(path: string, entries: Record<string, Uint8Array>, index: number) {
  const cleanPath = path.replace(/\\/g, "/").replace(/^\/+/, "").split("/").filter((part) => part && part !== "." && part !== "..").join("/") || `dosya-${index + 1}`;
  if (!entries[cleanPath]) return cleanPath;
  const slash = cleanPath.lastIndexOf("/");
  const directory = slash >= 0 ? cleanPath.slice(0, slash + 1) : "";
  const filename = slash >= 0 ? cleanPath.slice(slash + 1) : cleanPath;
  const dot = filename.lastIndexOf(".");
  const stem = dot > 0 ? filename.slice(0, dot) : filename;
  const extension = dot > 0 ? filename.slice(dot) : "";
  let suffix = 2;
  while (entries[`${directory}${stem} (${suffix})${extension}`]) suffix++;
  return `${directory}${stem} (${suffix})${extension}`;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let size = bytes / 1024;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) { size /= 1024; unit++; }
  return `${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 1 }).format(size)} ${units[unit]}`;
}
