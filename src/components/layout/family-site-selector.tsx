"use client";

import type { Locale } from "@/i18n/routing";
import { localizePath } from "@/i18n/routing";
import { additionalFamilySiteCopy, familySiteCopy } from "@/i18n/family-site-copy";

export function FamilySiteSelector({ locale }: { locale: Locale }) {
  const family = familySiteCopy[locale];
  const additional = additionalFamilySiteCopy[locale];
  const sites = [
    { href: "/" + locale, label: family.portal },
    { href: localizePath(locale, "/calculators"), label: family.calculator },
    { href: localizePath(locale, "/tools"), label: family.tools },
    { href: localizePath(locale, "/money"), label: family.moneyBook },
    { href: localizePath(locale, "/docs"), label: additional.documents },
    { href: localizePath(locale, "/quiz"), label: additional.quiz },
  ];

  return (
    <div className="flex min-w-0 items-center">
      <span id="family-site-new-tab" className="sr-only">{family.newTab}</span>
      <select
        aria-label={family.label}
        aria-describedby="family-site-new-tab"
        title={family.label}
        defaultValue=""
        onChange={(event) => {
          const destination = sites.find(({ href }) => href === event.currentTarget.value);
          if (destination) window.open(destination.href, "_blank", "noopener,noreferrer");
          event.currentTarget.value = "";
        }}
        className="h-10 w-[6.5rem] max-w-[28vw] min-w-0 cursor-pointer rounded-lg border border-slate-200 bg-white px-1.5 text-[10px] text-slate-700 focus-visible:outline-2 focus-visible:outline-indigo-600 sm:w-auto sm:max-w-72 sm:px-2 sm:text-sm"
      >
        <option value="" disabled>{family.label}</option>
        {sites.map((site) => <option key={site.href} value={site.href}>{site.label}</option>)}
      </select>
    </div>
  );
}
