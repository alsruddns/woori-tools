"use client";

import { usePathname } from "next/navigation";
import { getMessages } from "@/i18n/messages";
import { localeLabels, locales, switchLocalePath, type Locale } from "@/i18n/routing";

export function LanguageSelector({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? `/${locale}/tools`;
  const messages = getMessages(locale);

  return (
    <div>
      <label className="sr-only" htmlFor="language-selector">{messages.language}</label>
      <select
        id="language-selector"
        aria-label={messages.language}
        value={locale}
        onChange={(event) => window.location.assign(switchLocalePath(pathname, event.target.value as Locale))}
        className="h-10 max-w-28 cursor-pointer rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-700"
      >
        {locales.map((item) => <option key={item} value={item}>{localeLabels[item]}</option>)}
      </select>
    </div>
  );
}
