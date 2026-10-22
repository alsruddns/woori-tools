import Link from "next/link";
import type { ReactNode } from "react";
import { LanguageSelector } from "@/components/layout/language-selector";
import { getMessages } from "@/i18n/messages";

export function TurkishPublishedShell({ children }: { children: ReactNode }) {
  const messages = getMessages("tr");

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/tr/tools" className="font-bold tracking-tight text-slate-950">Woori Tools</Link>
          <nav aria-label={messages.tools} className="flex items-center gap-3">
            <Link href="/tr/tools" className="text-sm font-medium text-slate-700 hover:text-indigo-700">{messages.allTools}</Link>
            <LanguageSelector locale="tr" />
          </nav>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-600 sm:px-6">
          <p>{messages.filePrivacy}</p>
          <p className="mt-2">© {new Date().getFullYear()} Woori Tools</p>
        </div>
      </footer>
    </div>
  );
}
