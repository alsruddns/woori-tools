"use client";

import { useEffect, useState } from "react";
import { copyText } from "@/lib/copy-to-clipboard";
import { processText } from "@/lib/text/process-text";

type TextUtilitySlug = "text-to-file" | "character-count" | "text-case-converter" | "remove-duplicate-words";

const copy: Record<TextUtilitySlug, {
  title: string;
  input: string;
  placeholder: string;
  action: string;
  clear: string;
  download: string;
  empty: string;
  privacy: string;
  failed: string;
  option: string;
  result: string;
  copyResult: string;
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
    failed: "Dosya oluşturulamadı. Metninizi kontrol edip yeniden deneyin.", option: "", result: "", copyResult: "",
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
    failed: "Metin sayılamadı. Yeniden deneyin.", option: "", result: "", copyResult: "",
  },
  "text-case-converter": {
    title: "Metin harf biçimini dönüştür", input: "Dönüştürülecek metin", placeholder: "Metninizi buraya yazın veya yapıştırın", action: "Metni dönüştür", clear: "Temizle", download: "", empty: "Dönüştürmek için metin girin.", privacy: "Metniniz bu tarayıcıda işlenir ve sunucuya gönderilmez.", failed: "Metin dönüştürülemedi. Yeniden deneyin.", option: "Dönüştürme biçimi", result: "Dönüştürülmüş metin", copyResult: "Sonucu kopyala",
  },
  "remove-duplicate-words": {
    title: "Tekrarlanan sözcükleri kaldır", input: "Düzenlenecek metin", placeholder: "Metninizi buraya yazın veya yapıştırın", action: "Tekrarları kaldır", clear: "Temizle", download: "", empty: "Düzenlemek için metin girin.", privacy: "Metniniz bu tarayıcıda işlenir ve sunucuya gönderilmez.", failed: "Tekrarlanan sözcükler kaldırılamadı. Yeniden deneyin.", option: "", result: "Düzenlenmiş metin", copyResult: "Sonucu kopyala",
  },
};

export function TurkishTextUtilityWorkspace({ slug }: { slug: TextUtilitySlug }) {
  const labels = copy[slug];
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [countResult, setCountResult] = useState<{ characters: number; charactersWithoutSpaces: number; words: number; lines: number } | null>(null);
  const [result, setResult] = useState("");
  const [option, setOption] = useState("lower");

  useEffect(() => () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  }, [downloadUrl]);

  async function run() {
    setError("");
    setDownloadUrl("");
    setCountResult(null);
    setResult("");
    if (!text.trim()) {
      setError(labels.empty);
      return;
    }

    if (slug === "text-to-file") {
      setDownloadUrl(URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" })));
      return;
    }

    if (slug === "text-case-converter" || slug === "remove-duplicate-words") {
      try {
        const processed = await processText(slug, text, "", option, 1, "tr");
        setResult(processed.result);
      } catch {
        setError(labels.failed);
      }
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
    setResult("");
  }

  return <section aria-label={labels.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <label htmlFor={`turkish-${slug}-input`} className="mb-2 block text-sm font-medium text-slate-800">
      {labels.input}
      <textarea id={`turkish-${slug}-input`} value={text} onChange={(event) => { setText(event.target.value); setError(""); }} rows={9} placeholder={labels.placeholder} className="mt-2 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
    </label>
    {slug === "text-case-converter" && <label htmlFor="turkish-case-option" className="mt-4 block text-sm font-medium">{labels.option}<select id="turkish-case-option" value={option} onChange={(event) => setOption(event.target.value)} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 sm:max-w-sm"><option value="lower">Küçük harf</option><option value="upper">Büyük harf</option><option value="title">Her Sözcüğün İlk Harfi Büyük</option></select></label>}
    <div className="mt-5 flex flex-wrap gap-3">
      <button type="button" onClick={() => void run()} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white">{labels.action}</button>
      <button type="button" onClick={clear} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">{labels.clear}</button>
      {downloadUrl && <a href={downloadUrl} download="metin.txt" className="inline-flex min-h-12 items-center rounded-xl bg-emerald-700 px-5 font-semibold text-white">{labels.download}</a>}
    </div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {countResult && <dl aria-live="polite" className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[["Karakter", countResult.characters], ["Boşluksuz karakter", countResult.charactersWithoutSpaces], ["Kelime", countResult.words], ["Satır", countResult.lines]].map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-4"><dt className="text-sm text-slate-600">{label}</dt><dd className="mt-1 text-2xl font-bold text-slate-950">{value}</dd></div>)}
    </dl>}
    {result && <div className="mt-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">{labels.result}</h2><button type="button" onClick={() => void copyText(result)} className="min-h-10 rounded-xl border border-slate-300 px-4 text-sm font-medium">{labels.copyResult}</button></div><pre role="status" aria-live="polite" className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{result}</pre></div>}
    <p className="mt-4 text-sm text-slate-600">{labels.privacy}</p>
  </section>;
}
