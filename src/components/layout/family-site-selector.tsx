"use client";

import { usePathname } from "next/navigation";
import { additionalFamilySiteCopy, familySiteCopy } from "@/i18n/family-site-copy";
import { localizePath, type Locale } from "@/i18n/routing";

export function FamilySiteSelector({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? `/${locale}`;
  const family = familySiteCopy[locale];
  const additional = additionalFamilySiteCopy[locale];
  const sites = [
    { href: `/${locale}`, label: family.portal, portal: true },
    { href: localizePath(locale, "/calculators"), label: family.calculator },
    { href: localizePath(locale, "/tools"), label: family.tools },
    { href: localizePath(locale, "/money"), label: family.moneyBook },
    { href: localizePath(locale, "/docs"), label: additional.documents },
    { href: localizePath(locale, "/quiz"), label: additional.quiz },
  ];

  const renderLinks = (mobile = false) => sites.map((site) => {
    const active = isFamilySiteActive(pathname, site.href, site.portal ?? false);
    return (
      <a
        key={site.href}
        href={site.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-current={active ? "page" : undefined}
        className={mobile
          ? `block rounded-lg px-3 py-2.5 text-sm ${active ? "bg-indigo-50 font-semibold text-indigo-800" : "text-slate-700 hover:bg-slate-100"}`
          : `whitespace-nowrap rounded-lg px-2 py-2 text-xs transition-colors 2xl:px-2.5 2xl:text-sm ${active ? "bg-indigo-50 font-semibold text-indigo-800" : "text-slate-700 hover:bg-slate-100 hover:text-indigo-700"}`}
      >
        {site.label}
      </a>
    );
  });

  return (
    <>
      <nav aria-label={family.label} className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex">
        {renderLinks()}
      </nav>
      <details className="relative shrink-0 lg:hidden">
        <summary
          aria-label={family.label}
          title={family.label}
          className="flex size-10 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-indigo-600 [&::-webkit-details-marker]:hidden"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="sr-only">{family.label}</span>
        </summary>
        <nav aria-label={family.label} className="absolute right-0 z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          {renderLinks(true)}
        </nav>
      </details>
    </>
  );
}

export function isFamilySiteActive(pathname: string, href: string, exact = false) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}
