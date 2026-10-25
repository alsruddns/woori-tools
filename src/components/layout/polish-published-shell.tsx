import Link from "next/link";
import type { ReactNode } from "react";
import { LanguageSelector } from "@/components/layout/language-selector";
import { getMessages } from "@/i18n/messages";

export function PolishPublishedShell({ children }: { children: ReactNode }) {
  const messages = getMessages("pl");
  return <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/pl/tools" className="text-lg font-bold tracking-tight text-slate-950">Woori Tools</Link>
        <nav aria-label={messages.tools} className="flex items-center gap-4">
          <Link href="/pl/tools" className="text-sm font-medium text-slate-700 hover:text-indigo-700">Wszystkie narzędzia</Link>
          <LanguageSelector locale="pl" />
        </nav>
      </div>
    </header>
    <div className="flex-1">{children}</div>
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 text-sm leading-6 text-slate-600 sm:px-6">
        Pliki i wprowadzane treści są przetwarzane w przeglądarce i nie są wysyłane na serwer.
      </div>
    </footer>
  </div>;
}
