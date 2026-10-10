import Link from "next/link";
import type { Dictionary } from "@/i18n/messages";
import { localizePath, type Locale } from "@/i18n/routing";

export function SiteFooter({ locale, messages }: { locale: Locale; messages: Dictionary }) {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="font-semibold text-slate-900">Woori Tools</p>
          <p className="mt-1">{messages.footerTagline}</p>
        </div>
        <nav aria-label={messages.terms} className="flex gap-5">
          <Link href={localizePath(locale, "/privacy")} className="hover:text-indigo-700">{messages.privacy}</Link>
          <Link href="https://www.woori.today/terms" className="hover:text-indigo-700">{messages.terms}</Link>
        </nav>
      </div>
    </footer>
  );
}
