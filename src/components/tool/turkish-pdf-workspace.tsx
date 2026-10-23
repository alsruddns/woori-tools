"use client";

import { useEffect, useState } from "react";
import { processPdf } from "@/lib/pdf/process-pdf";

export type TurkishPdfSlug = "images-to-pdf" | "pdf-merge" | "pdf-split" | "pdf-delete-pages" | "pdf-reorder-pages" | "pdf-rotate-pages" | "pdf-add-page-numbers" | "pdf-watermark" | "pdf-metadata-viewer" | "pdf-remove-metadata" | "pdf-page-size-checker";

const titles: Record<TurkishPdfSlug, string> = {
  "images-to-pdf": "Görselleri PDF'e dönüştür", "pdf-merge": "PDF dosyalarını birleştir", "pdf-split": "PDF sayfalarını ayır",
  "pdf-delete-pages": "PDF sayfalarını sil", "pdf-reorder-pages": "PDF sayfalarını yeniden sırala", "pdf-rotate-pages": "PDF sayfalarını döndür",
  "pdf-add-page-numbers": "PDF'e sayfa numarası ekle", "pdf-watermark": "PDF'e filigran ekle", "pdf-metadata-viewer": "PDF metadata görüntüleyici",
  "pdf-remove-metadata": "PDF metadata temizleyici", "pdf-page-size-checker": "PDF sayfa boyutu denetleyici",
};
const multiFileSlugs: TurkishPdfSlug[] = ["images-to-pdf", "pdf-merge"];

export function TurkishPdfWorkspace({ slug }: { slug: TurkishPdfSlug }) {
  const [files, setFiles] = useState<File[]>([]);
  const [option, setOption] = useState(slug === "pdf-rotate-pages" ? "90" : "");
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [outputUrl, setOutputUrl] = useState("");
  const [outputName, setOutputName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => () => { if (outputUrl) URL.revokeObjectURL(outputUrl); }, [outputUrl]);

  function select(selected: FileList | null) {
    setFiles([]); setResult(""); setError(""); setOutputUrl(""); setOutputName("");
    if (!selected?.length) return;
    const chosen = Array.from(selected).slice(0, multiFileSlugs.includes(slug) ? 20 : 1);
    if (chosen.some((file) => file.size > 50 * 1024 * 1024) || chosen.reduce((sum, file) => sum + file.size, 0) > 50 * 1024 * 1024) {
      setError("Toplam dosya boyutu 50 MB sınırını aşamaz."); return;
    }
    const images = slug === "images-to-pdf";
    if (chosen.some((file) => images ? !file.type.startsWith("image/") : file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf"))) {
      setError(images ? "Lütfen geçerli görsel dosyaları seçin." : "Lütfen geçerli bir PDF dosyası seçin."); return;
    }
    setFiles(chosen);
  }

  async function run() {
    if (!files.length) { setError(slug === "images-to-pdf" ? "En az bir görsel seçin." : "Bir PDF dosyası seçin."); return; }
    setBusy(true); setResult(""); setError(""); setOutputUrl("");
    try {
      if (slug === "pdf-page-size-checker") {
        const { PDFDocument } = await import("pdf-lib");
        const pdf = await PDFDocument.load(await files[0].arrayBuffer());
        setResult(pdf.getPages().map((page, index) => { const size = page.getSize(); return `Sayfa ${index + 1}: ${size.width.toFixed(1)} × ${size.height.toFixed(1)} pt (${(size.width / 72).toFixed(2)} × ${(size.height / 72).toFixed(2)} in)`; }).join("\n"));
        return;
      }
      const processed = await processPdf(slug, files, option, text, "tr");
      setResult(slug === "pdf-metadata-viewer" ? processed.result : `İşlem tamamlandı. ${((processed.blob?.size ?? 0) / 1024).toFixed(1)} KB`);
      if (processed.blob) {
        setOutputUrl(URL.createObjectURL(processed.blob));
        setOutputName(`${files[0].name.replace(/\.pdf$/i, "") || "belge"}-${slug}.pdf`);
      }
    } catch {
      setError("Dosya işlenemedi. Dosyayı ve seçtiğiniz ayarları kontrol edip yeniden deneyin.");
    } finally { setBusy(false); }
  }

  function reset() { setFiles([]); setResult(""); setError(""); setOutputUrl(""); setOutputName(""); setOption(slug === "pdf-rotate-pages" ? "90" : ""); setText(""); }
  const images = slug === "images-to-pdf";

  return <section aria-label={titles[slug]} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <label htmlFor={`tr-${slug}-pdf-input`} className="block text-sm font-medium text-slate-800">{images ? "Görsel dosyaları seçin" : "PDF dosyası seçin"}<input id={`tr-${slug}-pdf-input`} type="file" accept={images ? "image/*" : "application/pdf,.pdf"} multiple={multiFileSlugs.includes(slug)} onChange={(event) => select(event.currentTarget.files)} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 text-sm" /></label>
    <p className="mt-3 text-sm text-slate-600">Dosyalar tarayıcınızda işlenir. En fazla 20 dosya ve toplam 50 MB seçebilirsiniz.</p>
    {files.length > 0 && <ul aria-label="Seçilen dosyalar" className="mt-3 list-inside list-disc break-all text-sm text-slate-600">{files.map((file) => <li key={`${file.name}-${file.size}`}>{file.name}</li>)}</ul>}
    {["pdf-split", "pdf-delete-pages"].includes(slug) && <label className="mt-5 block text-sm">Sayfa numaraları veya aralıkları<input value={option} onChange={(event) => setOption(event.target.value)} placeholder="1, 3-5" className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 p-3" /></label>}
    {slug === "pdf-reorder-pages" && <label className="mt-5 block text-sm">Yeni sayfa sırası<input value={option} onChange={(event) => setOption(event.target.value)} placeholder="3, 1, 2" className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 p-3" /></label>}
    {slug === "pdf-rotate-pages" && <label className="mt-5 block text-sm">Döndürme açısı<select value={option} onChange={(event) => setOption(event.target.value)} className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 p-3"><option value="90">90°</option><option value="180">180°</option><option value="270">270°</option></select></label>}
    {slug === "pdf-watermark" && <label className="mt-5 block text-sm">Filigran metni<input value={text} maxLength={80} onChange={(event) => setText(event.target.value)} placeholder="Woori Tools" className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 p-3" /></label>}
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void run()} disabled={busy} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60">{busy ? "İşleniyor…" : "İşlemi başlat"}</button><button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Sıfırla</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {result && <div className="mt-5 space-y-3"><h2 className="font-semibold">Sonuç</h2><pre role="status" aria-live="polite" className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{result}</pre>{outputUrl && <a href={outputUrl} download={outputName} className="inline-flex min-h-12 items-center rounded-xl bg-emerald-700 px-5 font-semibold text-white">İndir: {outputName}</a>}</div>}
    <p className="mt-4 text-sm text-slate-600">Dosyalarınız tarayıcınızda işlenir ve sunucuya gönderilmez.</p>
  </section>;
}
