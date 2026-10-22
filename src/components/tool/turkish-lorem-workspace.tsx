"use client";

import { useState } from "react";
import { copyText } from "@/lib/copy-to-clipboard";

const paragraphs = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
  "Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.",
  "Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra.",
  "Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam.",
];

export function TurkishLoremWorkspace({ title }: { title: string }) {
  const [count, setCount] = useState(3);
  const [result, setResult] = useState("");
  function generate() {
    const safeCount = Math.max(1, Math.min(20, Math.trunc(count) || 1));
    setResult(Array.from({ length: safeCount }, (_, index) => paragraphs[index % paragraphs.length]).join("\n\n"));
  }

  return (
    <section aria-label={title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <label htmlFor="turkish-lorem-count" className="block text-sm font-medium text-slate-800">Paragraf sayısı<input id="turkish-lorem-count" type="number" min={1} max={20} value={count} onChange={(event) => setCount(Math.max(1, Math.min(20, Number(event.target.value) || 1)))} className="mt-2 block min-h-11 w-full rounded-xl border p-3 sm:max-w-sm" /></label>
      <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={generate} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white">Metin oluştur</button><button type="button" onClick={() => setResult("")} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Temizle</button></div>
      {result && <div className="mt-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">Oluşturulan metin</h2><button type="button" onClick={() => void copyText(result)} className="min-h-10 rounded-xl border border-slate-300 px-4 text-sm font-medium">Metni kopyala</button></div><pre role="status" aria-live="polite" className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-800">{result}</pre></div>}
      <p className="mt-4 text-sm text-slate-600">Örnek metin tarayıcınızda oluşturulur ve sunucuya gönderilmez.</p>
    </section>
  );
}
