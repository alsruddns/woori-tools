"use client";

import { useEffect, useState } from "react";
import { processText } from "@/lib/text/process-text";
import { copyText } from "@/lib/copy-to-clipboard";

export type TurkishDataSlug = "text-compare" | "csv-to-json" | "json-to-csv" | "base64" | "url-encode-decode" | "uuid-generator" | "timestamp-converter";

const words: Record<TurkishDataSlug, { title: string; input: string; second: string; placeholder: string; secondPlaceholder: string; action: string; invalid: string; reset: string; copy: string; download: string; privacy: string; extension: string }> = {
  "text-compare": { title: "Metin karşılaştırma aracı", input: "İlk metin", second: "İkinci metin", placeholder: "İlk metni buraya yazın", secondPlaceholder: "Karşılaştırılacak metni buraya yazın", action: "Metinleri karşılaştır", invalid: "Karşılaştırılacak iki metni girin.", reset: "Sıfırla", copy: "Sonucu kopyala", download: "İndir", privacy: "Karşılaştırma tarayıcınızda yapılır; metinler sunucuya gönderilmez.", extension: "txt" },
  "csv-to-json": { title: "CSV'den JSON'a dönüştürücü", input: "CSV girdisi", second: "", placeholder: "ad,şehir\nAyşe,İzmir", secondPlaceholder: "", action: "JSON'a dönüştür", invalid: "CSV başlıklarını ve satırlarını kontrol edip yeniden deneyin.", reset: "Sıfırla", copy: "Kopyala", download: "İndir", privacy: "CSV veriniz tarayıcınızda dönüştürülür ve sunucuya gönderilmez.", extension: "json" },
  "json-to-csv": { title: "JSON'dan CSV'ye dönüştürücü", input: "JSON nesneleri dizisi", second: "", placeholder: '[{"ad":"Ayşe","şehir":"İzmir"}]', secondPlaceholder: "", action: "CSV'ye dönüştür", invalid: "JSON nesnelerinden oluşan geçerli bir dizi girin.", reset: "Sıfırla", copy: "Kopyala", download: "İndir", privacy: "JSON veriniz tarayıcınızda dönüştürülür ve sunucuya gönderilmez.", extension: "csv" },
  base64: { title: "Base64 kodlayıcı ve çözücü", input: "Metin veya Base64 verisi", second: "", placeholder: "Kodlanacak ya da çözülecek metni girin", secondPlaceholder: "", action: "Dönüştür", invalid: "Metni ve seçtiğiniz işlemi kontrol edin.", reset: "Sıfırla", copy: "Kopyala", download: "İndir", privacy: "Metniniz tarayıcınızda işlenir ve sunucuya gönderilmez.", extension: "txt" },
  "url-encode-decode": { title: "URL kodlayıcı ve çözücü", input: "URL veya metin", second: "", placeholder: "Kodlanacak ya da çözülecek metni girin", secondPlaceholder: "", action: "Dönüştür", invalid: "Metni ve seçtiğiniz işlemi kontrol edin.", reset: "Sıfırla", copy: "Kopyala", download: "İndir", privacy: "Metniniz tarayıcınızda işlenir ve sunucuya gönderilmez.", extension: "txt" },
  "uuid-generator": { title: "UUID oluşturucu", input: "", second: "", placeholder: "", secondPlaceholder: "", action: "UUID oluştur", invalid: "1 ile 100 arasında bir sayı seçin.", reset: "Sıfırla", copy: "Kopyala", download: "İndir", privacy: "UUID değerleri tarayıcınızda oluşturulur.", extension: "txt" },
  "timestamp-converter": { title: "Zaman damgası dönüştürücü", input: "Zaman damgası veya tarih", second: "", placeholder: "Unix zaman damgası ya da ISO 8601 tarihi", secondPlaceholder: "", action: "Dönüştür", invalid: "Geçerli bir zaman damgası veya tarih girin.", reset: "Sıfırla", copy: "Kopyala", download: "İndir", privacy: "Dönüştürme tarayıcınızda yapılır.", extension: "txt" },
};

export function TurkishDataToolsWorkspace({ slug }: { slug: TurkishDataSlug }) {
  const copy = words[slug];
  const [input, setInput] = useState("");
  const [second, setSecond] = useState("");
  const [option, setOption] = useState(slug === "base64" || slug === "url-encode-decode" ? "encode" : slug === "timestamp-converter" ? "seconds" : "format");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  useEffect(() => () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); }, [downloadUrl]);

  async function run() {
    setError(""); setNotice(""); setResult(""); setDownloadUrl("");
    if ((!input.trim() && slug !== "uuid-generator" && slug !== "timestamp-converter") || (slug === "text-compare" && !second.trim())) { setError(copy.invalid); return; }
    try {
      const processed = await processText(slug, input, second, option, amount, "tr");
      setResult(processed.result);
      setNotice("\u0130\u015Flem taray\u0131c\u0131n\u0131zda tamamland\u0131.");
    } catch { setError(copy.invalid); }
  }

  function reset() { setInput(""); setSecond(""); setOption(slug === "base64" || slug === "url-encode-decode" ? "encode" : slug === "timestamp-converter" ? "seconds" : "format"); setAmount(1); setResult(""); setError(""); setNotice(""); setDownloadUrl(""); }

  function download() {
    if (!result) return;
    const url = URL.createObjectURL(new Blob([result], { type: "text/plain;charset=utf-8" }));
    setDownloadUrl(url);
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${slug}.${copy.extension}`; anchor.click();
  }

  return <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <h2 className="text-xl font-semibold text-slate-900">{copy.title}</h2>
    <div className={`mt-5 grid gap-4 ${slug === "text-compare" ? "md:grid-cols-2" : ""}`}>
      <label htmlFor={`tr-${slug}-input`} className="block text-sm font-medium text-slate-800">{copy.input}<textarea id={`tr-${slug}-input`} value={input} onChange={(event) => setInput(event.target.value)} placeholder={copy.placeholder} rows={slug === "text-compare" ? 10 : 12} spellCheck={false} className="mt-2 block min-h-56 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm leading-6" /></label>
      {slug === "text-compare" && <label htmlFor="tr-text-compare-second" className="block text-sm font-medium text-slate-800">{copy.second}<textarea id="tr-text-compare-second" value={second} onChange={(event) => setSecond(event.target.value)} placeholder={copy.secondPlaceholder} rows={10} spellCheck={false} className="mt-2 block min-h-56 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm leading-6" /></label>}
    </div>
    {(slug === "base64" || slug === "url-encode-decode") && <label htmlFor={`tr-${slug}-mode`} className="mt-4 block text-sm font-medium text-slate-800">İşlem<select id={`tr-${slug}-mode`} value={option} onChange={(event) => setOption(event.target.value)} className="mt-2 block min-h-11 rounded-xl border border-slate-300 px-3"><option value="encode">Kodla</option><option value="decode">Çöz</option></select></label>}
    {slug === "timestamp-converter" && <label htmlFor="tr-timestamp-mode" className="mt-4 block text-sm font-medium text-slate-800">Girdi biçimi<select id="tr-timestamp-mode" value={option} onChange={(event) => setOption(event.target.value)} className="mt-2 block min-h-11 rounded-xl border border-slate-300 px-3"><option value="seconds">Unix saniye</option><option value="milliseconds">Unix milisaniye</option><option value="date">Tarih metni</option></select></label>}
    {slug === "uuid-generator" && <label htmlFor="tr-uuid-count" className="mt-4 block text-sm font-medium text-slate-800">UUID sayısı<input id="tr-uuid-count" type="number" min="1" max="100" value={amount} onChange={(event) => setAmount(Math.max(1, Math.min(100, Number(event.target.value) || 1)))} className="mt-2 block min-h-11 w-full rounded-xl border border-slate-300 p-3 sm:max-w-xs" /></label>}
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void run()} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white">{copy.action}</button><button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">{copy.reset}</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {notice && <p role="status" aria-live="polite" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
    {result && <div className="mt-5"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold">Sonuç</h3><div className="flex gap-2"><button type="button" onClick={() => void copyText(result)} className="min-h-10 rounded-lg border border-slate-300 px-3 text-sm">{copy.copy}</button><button type="button" onClick={download} className="min-h-10 rounded-lg border border-slate-300 px-3 text-sm">{copy.download}</button></div></div><pre className="mt-3 max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{result}</pre></div>}
    <p className="mt-4 text-sm text-slate-600">{copy.privacy}</p>
  </section>;
}
