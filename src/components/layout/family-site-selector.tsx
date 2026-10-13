"use client";

import type { Locale } from "@/i18n/routing";
import { localizePath } from "@/i18n/routing";
import { siteChromeMessages } from "@/i18n/site-chrome-messages";

export function FamilySiteSelector({ locale }: { locale: Locale }) {
  const messages = siteChromeMessages[locale];
  return (
    <div className="shrink-0">
      <label className="sr-only" htmlFor="family-site-selector">{messages.familySite}</label>
      <select
        id="family-site-selector"
        aria-label={messages.familySite}
        value={localizePath(locale, "/tools")}
        onChange={(event) => window.location.assign(event.target.value)}
        className="h-10 w-24 cursor-pointer rounded-lg border border-slate-200 bg-white px-2 text-ellipsis text-sm text-slate-700 sm:w-32"
      >
        <option value={`/${locale}`}>{messages.portal}</option>
        <option value={localizePath(locale, "/money")}>{messages.moneyBook}</option>
        <option value={localizePath(locale, "/calculators")}>{messages.calculator}</option>
        <option value={localizePath(locale, "/tools")}>{messages.tools}</option>
      </select>
    </div>
  );
}
