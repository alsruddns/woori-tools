"use client";

import { useState } from "react";
import { getMessages } from "@/i18n/messages";

export function RussianMarkdownWorkspace() {
  const messages = getMessages("ru");
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
      setError(messages.errors.processing);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-3xl border bg-white p-5 sm:p-7">
      <label htmlFor="markdown-source" className="block text-sm font-medium">Markdown · {messages.input}</label>
      <textarea
        id="markdown-source"
        value={source}
        onChange={(event) => setSource(event.target.value)}
        rows={14}
        className="mt-2 w-full rounded-xl border p-3 font-mono text-sm"
        placeholder={"# Заголовок\n\nВведите пример **Markdown**."}
      />
      <button
        type="button"
        onClick={() => void render()}
        disabled={busy}
        className="mt-4 min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:opacity-60"
      >
        {busy ? messages.processing : messages.run}
      </button>
      {error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}
      <h2 className="mt-7 text-lg font-semibold">{messages.result}</h2>
      <article
        className="prose prose-slate mt-3 min-h-36 max-w-none overflow-auto rounded-xl border p-4"
        dangerouslySetInnerHTML={{ __html: html || `<p>${messages.textPlaceholder}</p>` }}
      />
    </section>
  );
}
