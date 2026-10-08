"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { localizePath, type Locale } from "@/i18n/routing";
import { matchesToolSearch } from "@/lib/tool-navigation";

export type NavigationTool = { slug: string; title: string; keywords: string[]; description: string };
export type NavigationSection = { id: string; name: string; tools: NavigationTool[] };

type Props = {
  locale: Locale;
  sections: NavigationSection[];
  children: React.ReactNode;
  searchLabel: string;
  noResults: string;
  openLabel: string;
  closeLabel: string;
  adLabel: string;
};

export function ToolNavigationShell(props: Props) {
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const opener = openerRef.current;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key === "Tab") {
        const dialog = document.getElementById("mobile-tool-navigation");
        const focusable = dialog?.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus();
    };
  }, [open]);

  return <div className="mx-auto grid w-full max-w-[1900px] grid-cols-1 gap-x-4 px-3 min-[1200px]:grid-cols-[260px_minmax(0,1fr)] min-[1500px]:grid-cols-[170px_260px_minmax(0,1fr)_170px] min-[1500px]:px-4">
    <AdRail label={props.adLabel} position="left-rail" className="min-[1500px]:block" />
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] min-w-0 border-r border-slate-200 bg-white min-[1200px]:block">
      <ToolSidebar {...props} />
    </aside>
    <div className="min-w-0">
      <div className="px-1 pt-3 min-[1200px]:hidden">
        <button ref={openerRef} type="button" aria-expanded={open} aria-controls="mobile-tool-navigation" onClick={() => setOpen(true)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
          {props.openLabel}
        </button>
      </div>
      {props.children}
    </div>
    <AdRail label={props.adLabel} position="right-rail" className="min-[1500px]:block" />
    {open && <div className="fixed inset-0 z-50 min-[1200px]:hidden" role="presentation">
      <button type="button" aria-label={props.closeLabel} tabIndex={-1} onClick={() => setOpen(false)} className="absolute inset-0 cursor-default bg-slate-950/40" />
      <section id="mobile-tool-navigation" role="dialog" aria-modal="true" aria-label={props.openLabel} className="absolute inset-y-0 left-0 flex w-[min(88vw,360px)] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 className="font-semibold text-slate-900">{props.openLabel}</h2>
          <button ref={closeRef} type="button" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">{props.closeLabel}</button>
        </div>
        <ToolSidebar {...props} onNavigate={() => setOpen(false)} />
      </section>
    </div>}
  </div>;
}

function AdRail({ label, position, className }: { label: string; position: "left-rail" | "right-rail"; className: string }) {
  return <aside aria-label={label} className={`sticky top-20 hidden self-start ${className}`}>
    <div className="mx-auto mt-4 flex h-[600px] w-[160px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400" data-ad-slot={position}>
      <span>{label}</span>
    </div>
  </aside>;
}

function ToolSidebar({ locale, sections, searchLabel, noResults, onNavigate }: Props & { onNavigate?: () => void }) {
  const pathname = usePathname();
  const id = useId();
  const [query, setQuery] = useState("");
  const filteredSections = useMemo(() => sections.map((section) => ({
    ...section,
    tools: section.tools.filter((tool) => matchesToolSearch(tool, query, locale)),
  })).filter((section) => section.tools.length), [sections, query, locale]);

  return <nav aria-label={searchLabel} className="flex h-full min-h-0 flex-col">
    <div className="border-b border-slate-200 p-4">
      <label htmlFor={`tool-nav-search-${id}`} className="sr-only">{searchLabel}</label>
      <input id={`tool-nav-search-${id}`} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={searchLabel} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
    </div>
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
      {filteredSections.length ? filteredSections.map((section) => <section key={section.id} className="mb-4">
        <h2 className="px-2 pb-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">{section.name}</h2>
        <ul className="space-y-0.5">
          {section.tools.map((tool) => {
            const href = localizePath(locale, `/tools/${tool.slug}`);
            const active = pathname === href;
            return <li key={tool.slug}><Link href={href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={`block rounded-lg px-2.5 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${active ? "bg-indigo-50 font-semibold text-indigo-800" : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"}`}>{tool.title}</Link></li>;
          })}
        </ul>
      </section>) : <p className="px-2 py-4 text-sm text-slate-500">{noResults}</p>}
    </div>
  </nav>;
}
