"use client";

import { useState } from "react";
import { getMessages } from "@/i18n/messages";

export function RussianMarkdownWorkspace({ locale = "ru" }: { locale?: "ru" | "tr" }) {
  const messages = getMessages(locale);
  const isTurkish = locale === "tr";
  const inputLabel = isTurkish ? "Markdown metni" : messages.input;
  const processingLabel = isTurkish ? "Önizleme hazırlanıyor…" : messages.processing;
  const runLabel = isTurkish ? "Önizlemeyi oluştur" : messages.run;
  const resultLabel = isTurkish ? "Önizleme" : messages.result;
  const resultPlaceholder = isTurkish ? "Biçimlendirilmiş önizleme burada görünür." : messages.textPlaceholder;
  const processingError = isTurkish ? "Markdown önizlemesi oluşturulamadı." : messages.errors.processing;
  const [source, setSource] = useState("");
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function render() {
    setError("");
    setBusy(true);
    try {
      const [{ marked }, purifierModule] = await Promise.all([import("marked"), import("dompurify")]);
      const rendered = await marked.parse(source, { async: false });
      setHtml(purifierModule.default.sanitize(rendered, { USE_PROFILES: { html: true } }));
    } catch {
      setError(processingError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-3xl border bg-white p-5 sm:p-7">
      <label htmlFor="markdown-source" className="block text-sm font-medium">{inputLabel}</label>
      <textarea
        id="markdown-source"
        value={source}
        onChange={(event) => setSource(event.target.value)}
        rows={14}
        className="mt-2 w-full rounded-xl border p-3 font-mono text-sm"
        placeholder={locale === "tr" ? "# Ba\u015Fl\u0131k\n\nBir **Markdown** \u00F6rne\u011Fi girin." : "# \u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a\n\n\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u0440\u0438\u043c\u0435\u0440 **Markdown**."}
      />
      <button
        type="button"
        onClick={() => void render()}
        disabled={busy}
        className="mt-4 min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60"
      >
        {busy ? processingLabel : runLabel}
      </button>
      {error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}
      <h2 className="mt-7 text-lg font-semibold">{resultLabel}</h2>
      <article
        className="prose prose-slate mt-3 min-h-36 max-w-none overflow-auto rounded-xl border p-4"
        dangerouslySetInnerHTML={{ __html: html || `<p>${resultPlaceholder}</p>` }}
      />
    </section>
  );
}
