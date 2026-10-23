"use client";

import { useState } from "react";
import { copyText } from "@/lib/copy-to-clipboard";
import { processText } from "@/lib/text/process-text";

type CodeToolSlug = "color-converter" | "cron-parser" | "sql-formatter" | "html-formatter" | "css-formatter" | "javascript-formatter";

const labels: Record<CodeToolSlug, { title: string; input: string; placeholder: string; action: string; result: string; privacy: string }> = {
  "color-converter": { title: "Renk kodu dönüştürücü", input: "Renk değeri", placeholder: "#3366FF, rgb(51, 102, 255) veya hsl(225, 100%, 60%)", action: "Rengi dönüştür", result: "Renk biçimleri", privacy: "Dönüştürme tarayıcınızda yapılır." },
  "cron-parser": { title: "Cron ifadesi ayrıştırıcı", input: "Cron ifadesi", placeholder: "Örnek: 0 9 * * 1-5", action: "Sonraki çalıştırma zamanlarını göster", result: "Sonraki çalıştırmalar", privacy: "İfade tarayıcınızda ayrıştırılır ve sunucuya gönderilmez." },
  "sql-formatter": { title: "SQL biçimlendirici", input: "SQL kodu", placeholder: "SQL sorgunuzu buraya yapıştırın", action: "SQL kodunu biçimlendir", result: "Biçimlendirilmiş SQL", privacy: "Kodunuz tarayıcınızda biçimlendirilir ve sunucuya gönderilmez." },
  "html-formatter": { title: "HTML biçimlendirici", input: "HTML kodu", placeholder: "HTML kodunuzu buraya yapıştırın", action: "HTML kodunu biçimlendir", result: "Biçimlendirilmiş HTML", privacy: "Kodunuz tarayıcınızda biçimlendirilir ve sunucuya gönderilmez." },
  "css-formatter": { title: "CSS biçimlendirici", input: "CSS kodu", placeholder: "CSS kodunuzu buraya yapıştırın", action: "CSS kodunu biçimlendir", result: "Biçimlendirilmiş CSS", privacy: "Kodunuz tarayıcınızda biçimlendirilir ve sunucuya gönderilmez." },
  "javascript-formatter": { title: "JavaScript biçimlendirici", input: "JavaScript kodu", placeholder: "JavaScript kodunuzu buraya yapıştırın", action: "JavaScript kodunu biçimlendir", result: "Biçimlendirilmiş JavaScript", privacy: "Kodunuz tarayıcınızda biçimlendirilir ve sunucuya gönderilmez." },
};

export function TurkishCodeToolsWorkspace({ slug }: { slug: CodeToolSlug }) {
  const copy = labels[slug];
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function run() {
    if (!value.trim()) { setError("İşlem yapmak için bir değer girin."); setResult(""); return; }
    setBusy(true); setError(""); setResult("");
    try {
      const processed = await processText(slug, value, "", "", 1, "tr");
      setResult(processed.result);
    } catch {
      setError(slug === "color-converter" ? "HEX, RGB veya HSL biçiminde geçerli bir renk girin." : slug === "cron-parser" ? "Beş veya altı alanlı geçerli bir Cron ifadesi girin." : "Kod biçimlendirilemedi. Sözdizimini kontrol edip yeniden deneyin.");
    } finally { setBusy(false); }
  }

  function reset() { setValue(""); setResult(""); setError(""); }

  return <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <label htmlFor={`turkish-${slug}-input`} className="block text-sm font-medium text-slate-800">{copy.input}{slug === "color-converter" ? <input id={`turkish-${slug}-input`} value={value} onChange={(event) => { setValue(event.target.value); setError(""); }} onKeyDown={(event) => { if (event.key === "Enter") void run(); }} placeholder={copy.placeholder} maxLength={120} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm" /> : <textarea id={`turkish-${slug}-input`} value={value} onChange={(event) => { setValue(event.target.value); setError(""); }} rows={slug === "cron-parser" ? 2 : 12} maxLength={slug === "cron-parser" ? 200 : 100000} placeholder={copy.placeholder} className="mt-2 block w-full rounded-xl border border-slate-300 p-3 font-mono text-sm" />}</label>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void run()} disabled={busy} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60">{busy ? "İşleniyor…" : copy.action}</button><button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Temizle</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {result && <div className="mt-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">{copy.result}</h2><button type="button" onClick={() => void copyText(result)} className="min-h-10 rounded-xl border border-slate-300 px-4 text-sm font-medium">Sonucu kopyala</button></div><pre role="status" aria-live="polite" className="mt-3 max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{result}</pre></div>}
    <p className="mt-4 text-sm text-slate-600">{copy.privacy}</p>
  </section>;
}
