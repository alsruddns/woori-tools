"use client";

import type { Locale } from "@/i18n/routing";
import { localizePath } from "@/i18n/routing";
import { familySiteCopy } from "@/i18n/family-site-copy";

export function FamilySiteSelector({ locale }: { locale: Locale }) {
  const family = familySiteCopy[locale];
  return (
    <div className="flex min-w-0 flex-col items-start gap-1 text-xs leading-4 text-slate-600 sm:flex-row sm:items-center sm:gap-2 sm:text-sm">
      <label htmlFor="family-site-selector">{family.label}</label>
      <select
        id="family-site-selector"
        aria-label={`${family.label}: ${family.newTab}`}
        value={localizePath(locale, "/tools")}
        onChange={(event) => window.open(event.currentTarget.value, "_blank", "noopener,noreferrer")}
        className="h-10 w-auto min-w-40 max-w-[calc(100vw_-_1.5rem)] cursor-pointer rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-700 sm:min-w-0 sm:max-w-72"
      >
        <option value={`/${locale}`}>{family.portal}</option>
        <option value={localizePath(locale, "/calculators")}>{family.calculator}</option>
        <option value={localizePath(locale, "/tools")}>{family.tools}</option>
        <option value={localizePath(locale, "/money")}>{family.moneyBook}</option>
      </select>
    </div>
  );
}
