"use client";

import { useState } from "react";
import { copyText } from "@/lib/copy-to-clipboard";
import { processText } from "@/lib/text/process-text";

type LineToolSlug = "shuffle-lines" | "add-line-numbers" | "remove-line-numbers" | "remove-empty-lines" | "remove-characters" | "sort-lines";

const titles: Record<LineToolSlug, string> = {
  "shuffle-lines": "Satırları karıştır",
  "add-line-numbers": "Satır numarası ekle",
  "remove-line-numbers": "Satır numaralarını kaldır",
  "remove-empty-lines": "Boş satırları kaldır",
  "remove-characters": "Metinden karakter kaldır",
  "sort-lines": "Satırları sırala",
};

export function TurkishLineToolsWorkspace({ slug }: { slug: LineToolSlug }) {
  const [text, setText] = useState("");
  const [option, setOption] = useState(slug === "remove-characters" ? "digits" : "asc");
  const [customCharacters, setCustomCharacters] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function run() {
    if (!text) { setError("İşlemek için metin girin."); setResult(""); return; }
    setBusy(true); setError(""); setResult("");
    try {
      const processed = await processText(slug, text, customCharacters, option, 1, "tr");
      setResult(processed.result);
    } catch {
      setError("Metin işlenemedi. Girdinizi kontrol edip yeniden deneyin.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-label={titles[slug]} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <label htmlFor="turkish-line-input" className="mb-2 block text-sm font-medium text-slate-800">
        İşlenecek metin
        <textarea id="turkish-line-input" value={text} onChange={(event) => { setText(event.target.value); setError(""); }} rows={9} placeholder="Metni buraya yazın veya yapıştırın" className="mt-2 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
      </label>
      {slug === "sort-lines" && <label htmlFor="turkish-sort-order" className="mt-4 block text-sm font-medium">Sıralama yönü<select id="turkish-sort-order" value={option} onChange={(event) => setOption(event.target.value === "desc" ? "desc" : "asc")} className="mt-2 block min-h-11 w-full rounded-xl border p-3 sm:max-w-sm"><option value="asc">A&apos;dan Z&apos;ye</option><option value="desc">Z&apos;den A&apos;ya</option></select></label>}
      {slug === "remove-characters" && <>
        <label htmlFor="turkish-character-option" className="mt-4 block text-sm font-medium">Kaldırılacak karakter türü<select id="turkish-character-option" value={option} onChange={(event) => setOption(event.target.value)} className="mt-2 block min-h-11 w-full rounded-xl border p-3 sm:max-w-sm"><option value="digits">Rakamlar</option><option value="latin">Latin harfleri</option><option value="special">Özel karakterler</option><option value="custom">Belirli karakterler</option></select></label>
        {option === "custom" && <label htmlFor="turkish-custom-chars" className="mt-4 block text-sm font-medium">Kaldırılacak karakterler<input id="turkish-custom-chars" value={customCharacters} onChange={(event) => setCustomCharacters(event.target.value)} className="mt-2 block min-h-11 w-full rounded-xl border p-3" /></label>}
      </>}
      <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void run()} disabled={busy} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60">{busy ? "İşleniyor…" : titles[slug]}</button><button type="button" onClick={() => { setText(""); setResult(""); setError(""); }} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Temizle</button></div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
      {result && <div className="mt-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">Sonuç</h2><button type="button" onClick={() => void copyText(result)} className="min-h-10 rounded-xl border border-slate-300 px-4 text-sm font-medium">Sonucu kopyala</button></div><pre role="status" aria-live="polite" className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{result}</pre></div>}
      <p className="mt-4 text-sm text-slate-600">Metniniz tarayıcınızda işlenir ve sunucuya gönderilmez.</p>
    </section>
  );
}
