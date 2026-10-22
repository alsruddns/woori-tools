"use client";

import { useEffect, useMemo, useState } from "react";
import { renameFileNames } from "@/lib/file-renamer.mjs";

type RenameSlug = "bulk-file-renamer" | "filename-cleaner";

const maxFiles = 100;
const maxPerFile = 100 * 1024 * 1024;
const maxTotal = 200 * 1024 * 1024;

export function TurkishRenameWorkspace({ slug, title }: { slug: RenameSlug; title: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [startNumber, setStartNumber] = useState("");
  const [padding, setPadding] = useState("0");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const renamed = useMemo(() => {
    const names = files.map((file) => file.name);
    if (slug === "filename-cleaner") {
      return renameFileNames(names.map((name, index) => name.normalize("NFKC").replace(/[<>:"/\\|?*\u0000-\u001f]/g, "").trim().replace(/\s+/g, "_").replace(/_+/g, "_") || `dosya-${index + 1}`));
    }
    return renameFileNames(names, { prefix, suffix, find, replace, startNumber, padding });
  }, [files, slug, prefix, suffix, find, replace, startNumber, padding]);

  useEffect(() => () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); }, [downloadUrl]);

  function chooseFiles(fileList: FileList | null) {
    if (!fileList) return;
    const selected = Array.from(fileList);
    setError(""); setStatus(""); setDownloadUrl("");
    if (selected.length > maxFiles) { setFiles([]); setError("En fazla 100 dosya seçebilirsiniz."); return; }
    if (selected.some((file) => file.size > maxPerFile)) { setFiles([]); setError("Tek bir dosyanın boyutu 100 MB'ı aşamaz."); return; }
    if (selected.reduce((total, file) => total + file.size, 0) > maxTotal) { setFiles([]); setError("Dosyaların toplam boyutu 200 MB'ı aşamaz."); return; }
    setFiles(selected);
  }

  async function createArchive() {
    if (files.length === 0) { setError("Önce en az bir dosya seçin."); return; }
    setBusy(true); setError(""); setStatus(""); setDownloadUrl("");
    try {
      const { zip } = await import("fflate");
      const entries: Record<string, Uint8Array> = {};
      for (const [index, file] of files.entries()) {
        const desired = renamed[index] || `dosya-${index + 1}`;
        entries[uniqueName(desired, entries)] = new Uint8Array(await file.arrayBuffer());
      }
      const bytes = await new Promise<Uint8Array>((resolve, reject) => zip(entries, { level: 3 }, (cause, data) => cause ? reject(cause) : resolve(data)));
      const buffer = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(buffer).set(bytes);
      setDownloadUrl(URL.createObjectURL(new Blob([buffer], { type: "application/zip" })));
      setStatus(`${files.length} dosya yeniden adlandırıldı ve ZIP arşivine eklendi.`);
    } catch {
      setError("ZIP arşivi tarayıcınızda oluşturulamadı. Yeniden deneyin.");
    } finally {
      setBusy(false);
    }
  }

  const fields = [
    { label: "Önek", value: prefix, update: setPrefix, numeric: false },
    { label: "Sonek", value: suffix, update: setSuffix, numeric: false },
    { label: "Dosya adında bul", value: find, update: setFind, numeric: false },
    { label: "Şununla değiştir", value: replace, update: setReplace, numeric: false },
    { label: "Başlangıç numarası", value: startNumber, update: setStartNumber, numeric: true },
    { label: "Numara basamak sayısı", value: padding, update: setPadding, numeric: true },
  ];

  return (
    <section aria-label={title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <label htmlFor="turkish-rename-input" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFiles(event.dataTransfer.files); }} className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:border-indigo-400">
        <span className="font-semibold text-slate-800">Dosyaları seçin veya buraya sürükleyin</span>
        <span className="mt-2 text-sm text-slate-500">En fazla 100 dosya, dosya başına 100 MB ve toplam 200 MB</span>
      </label>
      <input id="turkish-rename-input" type="file" multiple onChange={(event) => chooseFiles(event.target.files)} className="sr-only" />
      {files.length > 0 && <>
        {slug === "bulk-file-renamer" && <div className="mt-5 grid gap-3 sm:grid-cols-2">{fields.map(({ label, value, update, numeric }) => <label key={label} className="text-sm font-medium">{label}<input type={numeric ? "number" : "text"} min={numeric ? 0 : undefined} max={label === "Numara basamak sayısı" ? 12 : undefined} value={value} onChange={(event) => update(event.target.value)} className="mt-1 block min-h-10 w-full rounded-lg border p-2" /></label>)}</div>}
        <div className="mt-4 overflow-auto rounded-xl border"><table className="w-full min-w-[480px] text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-2">Önceki ad</th><th className="p-2">Yeni ad</th></tr></thead><tbody>{files.map((file, index) => <tr key={`${file.name}-${index}`} className="border-t"><td className="max-w-56 truncate p-2">{file.name}</td><td className="max-w-56 truncate p-2 font-medium">{renamed[index]}</td></tr>)}</tbody></table></div>
        <button type="button" onClick={() => { setFiles([]); setError(""); setStatus(""); setDownloadUrl(""); }} className="mt-3 text-sm font-medium text-rose-700 underline">Seçimi temizle</button>
      </>}
      <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void createArchive()} disabled={busy} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60">{busy ? "Arşiv oluşturuluyor…" : "Yeniden adlandır ve ZIP oluştur"}</button>{downloadUrl && <a href={downloadUrl} download={`${slug}.zip`} className="inline-flex min-h-12 items-center rounded-xl bg-emerald-700 px-5 font-semibold text-white">ZIP arşivini indir</a>}</div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}{status && <p role="status" aria-live="polite" className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">{status}</p>}
      <p className="mt-4 text-sm text-slate-600">Dosyalar tarayıcınızda işlenir ve sunucuya gönderilmez. Özgün dosyalar değiştirilmez.</p>
    </section>
  );
}

function uniqueName(name: string, entries: Record<string, Uint8Array>) {
  if (!entries[name]) return name;
  const dot = name.lastIndexOf(".");
  const stem = dot > 0 ? name.slice(0, dot) : name;
  const extension = dot > 0 ? name.slice(dot) : "";
  let suffix = 2;
  while (entries[`${stem} (${suffix})${extension}`]) suffix++;
  return `${stem} (${suffix})${extension}`;
}
