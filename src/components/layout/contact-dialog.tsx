"use client";

import { useRef } from "react";
import { siteChromeMessages } from "@/i18n/site-chrome-messages";
import type { Locale } from "@/i18n/routing";

const CONTACT_EMAIL = "krdd125@gmail.com";

export function ContactDialog({ locale }: { locale: Locale }) {
  const messages = siteChromeMessages[locale];
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="hover:text-indigo-700 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
      >
        {messages.contact}
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby="contact-dialog-title"
        aria-describedby="contact-dialog-description"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl p-0 text-slate-800 shadow-2xl backdrop:bg-slate-950/50"
      >
        <section className="p-5 sm:p-7">
          <header className="flex items-start justify-between gap-4">
            <div>
              <h2 id="contact-dialog-title" className="text-xl font-semibold">{messages.contactTitle}</h2>
              <p id="contact-dialog-description" className="mt-3 break-words text-sm leading-6 text-slate-600">{messages.contactIntro}</p>
            </div>
            <button
              type="button"
              aria-label={messages.close}
              onClick={() => dialogRef.current?.close()}
              className="grid size-10 shrink-0 place-items-center rounded-lg text-xl text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>
          <ul className="mt-4 list-inside list-disc space-y-1 text-sm leading-6 text-slate-700">
            <li>{messages.general}</li>
            <li>{messages.collaboration}</li>
            <li>{messages.advertising}</li>
            <li>{messages.bugReport}</li>
          </ul>
          <p className="mt-5 text-sm text-slate-600">{messages.emailPrompt}</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-1 inline-block break-all font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-900 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
          >
            {CONTACT_EMAIL}
          </a>
          <p className="mt-4 break-words text-sm leading-6 text-slate-600">{messages.responseNote}</p>
        </section>
      </dialog>
    </>
  );
}
