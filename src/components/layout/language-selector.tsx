"use client";

import { usePathname } from "next/navigation";
import { getMessages } from "@/i18n/messages";
import { publishedTargetLocaleLabels, publishedTargetLocales, resolveLocaleSelection, switchLocalePath, type PublishedTargetLocale } from "@/i18n/routing";
import { getTool } from "@/registry/tools";

export function LanguageSelector({ locale }: { locale: PublishedTargetLocale }) {
  const pathname = usePathname() ?? `/${locale}/tools`;
  const messages = getMessages(locale);
  const segments = pathname.split("/").filter(Boolean);
  const pageTool = segments[1] === "tools" && segments[2] && !["category"].includes(segments[2]) ? getTool(segments[2]) : undefined;
  const available = pageTool?.supportedLocales ?? publishedTargetLocales;

  return (
    <div>
      <label className="sr-only" htmlFor="language-selector">{messages.language}</label>
      <select
        id="language-selector"
        aria-label={messages.language}
        value={locale}
        onChange={(event) => {
          const requested = event.target.value as PublishedTargetLocale;
          const target = resolveLocaleSelection(requested, available);
          window.location.assign(switchLocalePath(pathname, target));
        }}
        className="h-10 w-[8.5rem] max-w-[42vw] cursor-pointer rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 focus-visible:outline-2 focus-visible:outline-indigo-600 sm:w-auto sm:min-w-[11rem] sm:text-sm"
      >
        {publishedTargetLocales.map((item) => <option key={item} value={item}>{publishedTargetLocaleLabels[item]}{available.includes(item) ? "" : " —"}</option>)}
      </select>
    </div>
  );
}
