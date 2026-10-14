"use client";

import { usePathname } from "next/navigation";
import { getMessages } from "@/i18n/messages";
import { localeLabels, locales, resolveLocaleSelection, switchLocalePath, type Locale } from "@/i18n/routing";
import { getTool } from "@/registry/tools";

export function LanguageSelector({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? `/${locale}/tools`;
  const messages = getMessages(locale);
  const segments = pathname.split("/").filter(Boolean);
  const pageTool = segments[1] === "tools" && segments[2] && !["category"].includes(segments[2]) ? getTool(segments[2]) : undefined;
  const available = pageTool?.supportedLocales ?? locales;

  return (
    <div>
      <label className="sr-only" htmlFor="language-selector">{messages.language}</label>
      <select
        id="language-selector"
        aria-label={messages.language}
        value={locale}
        onChange={(event) => {
          const requested = event.target.value as Locale;
          const target = resolveLocaleSelection(requested, available);
          window.location.assign(switchLocalePath(pathname, target));
        }}
        className="h-10 w-16 max-w-[20vw] cursor-pointer rounded-lg border border-slate-200 bg-white px-1 text-xs text-slate-700 sm:w-28 sm:px-2 sm:text-sm"
      >
        {locales.map((item) => <option key={item} value={item}>{localeLabels[item]}{available.includes(item) ? "" : " —"}</option>)}
      </select>
    </div>
  );
}
