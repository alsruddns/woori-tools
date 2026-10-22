"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { publishedTargetLocaleLabels, publishedTargetLocales, switchLocalePath, type PublishedTargetLocale } from "@/i18n/routing";

export function RussianPublishedShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/ru/tools";
  const localeSegment = pathname.split("/").filter(Boolean)[0] ?? "ru";
  const locale = publishedTargetLocales.find((item) => item === localeSegment) ?? "ru";
  return <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href={`/${locale}/tools`} className="text-lg font-bold tracking-tight text-slate-950">Woori Tools</Link>
        <nav className="flex items-center gap-4">
          <Link href={`/${locale}/tools`} className="text-sm font-medium text-slate-700 hover:text-indigo-700">Инструменты</Link>
          <label className="sr-only" htmlFor="language-selector">Язык</label>
          <select id="language-selector" aria-label="Язык" value={locale} onChange={(event) => window.location.assign(switchLocalePath(pathname, event.target.value as PublishedTargetLocale))} className="min-h-10 max-w-[45vw] rounded-lg border border-slate-200 bg-white px-2 text-sm focus-visible:outline-2 focus-visible:outline-indigo-600">
            {publishedTargetLocales.map((item) => <option key={item} value={item}>{publishedTargetLocaleLabels[item]}</option>)}
          </select>
        </nav>
      </div>
    </header>
    <div className="flex-1">{children}</div>
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 text-sm leading-6 text-slate-600 sm:px-6">
        Файлы и введённые данные обрабатываются в вашем браузере и не отправляются на сервер.
      </div>
    </footer>
  </div>;
}
