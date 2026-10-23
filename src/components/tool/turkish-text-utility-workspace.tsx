"use client";

import { useEffect, useState } from "react";

type TextUtilitySlug = "text-to-file" | "character-count";

const copy: Record<TextUtilitySlug, {
  title: string;
  input: string;
  placeholder: string;
  action: string;
  clear: string;
  download: string;
  empty: string;
  privacy: string;
}> = {
  "text-to-file": {
    title: "Metni dosyaya kaydet",
    input: "Dosyaya kaydedilecek metin",
    placeholder: "Metninizi buraya yazın veya yapıştırın",
    action: "TXT dosyası oluştur",
    clear: "Temizle",
    download: "TXT dosyasını indir",
    empty: "Dosya oluşturmak için önce metin girin.",
    privacy: "Metniniz bu tarayıcıda işlenir ve sunucuya gönderilmez.",
  },
  "character-count": {
    title: "Karakter ve kelime sayacı",
    input: "Sayılacak metin",
    placeholder: "Metninizi buraya yazın veya yapıştırın",
    action: "Metni say",
    clear: "Temizle",
    download: "",
    empty: "Sayım yapmak için metin girin.",
    privacy: "Metniniz bu tarayıcıda sayılır ve sunucuya gönderilmez.",
  },
};

export function TurkishTextUtilityWorkspace({ slug }: { slug: TextUtilitySlug }) {
  const labels = copy[slug];
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [countResult, setCountResult] = useState<{ characters: number; charactersWithoutSpaces: number; words: number; lines: number } | null>(null);

  useEffect(() => () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  }, [downloadUrl]);

  function run() {
    setError("");
    setDownloadUrl("");
    setCountResult(null);
    if (!text.trim()) {
      setError(labels.empty);
      return;
    }

    if (slug === "text-to-file") {
      setDownloadUrl(URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" })));
      return;
    }

    const segmenter = new Intl.Segmenter("tr", { granularity: "grapheme" });
    const words = text.trim().split(/\s+/u).filter(Boolean);
    setCountResult({
      characters: Array.from(segmenter.segment(text)).length,
      charactersWithoutSpaces: Array.from(segmenter.segment(text.replace(/\s/gu, ""))).length,
      words: words.length,
      lines: text.length ? text.split(/\r\n|\r|\n/u).length : 0,
    });
  }

  function clear() {
    setText("");
    setError("");
    setDownloadUrl("");
    setCountResult(null);
  }

  return <section aria-label={labels.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <label htmlFor={`turkish-${slug}-input`} className="mb-2 block text-sm font-medium text-slate-800">
      {labels.input}
      <textarea id={`turkish-${slug}-input`} value={text} onChange={(event) => { setText(event.target.value); setError(""); }} rows={9} placeholder={labels.placeholder} className="mt-2 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
    </label>
    <div className="mt-5 flex flex-wrap gap-3">
      <button type="button" onClick={run} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white">{labels.action}</button>
      <button type="button" onClick={clear} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">{labels.clear}</button>
      {downloadUrl && <a href={downloadUrl} download="metin.txt" className="inline-flex min-h-12 items-center rounded-xl bg-emerald-700 px-5 font-semibold text-white">{labels.download}</a>}
    </div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {countResult && <dl aria-live="polite" className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[["Karakter", countResult.characters], ["Boşluksuz karakter", countResult.charactersWithoutSpaces], ["Kelime", countResult.words], ["Satır", countResult.lines]].map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-4"><dt className="text-sm text-slate-600">{label}</dt><dd className="mt-1 text-2xl font-bold text-slate-950">{value}</dd></div>)}
    </dl>}
    <p className="mt-4 text-sm text-slate-600">{labels.privacy}</p>
  </section>;
}
