import Image from "next/image";
import Link from "next/link";
import { CopyToast } from "@/components/copy-toast";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { LanguageSelector } from "@/components/layout/language-selector";
import { getMessages } from "@/i18n/messages";
import type { PlannedLocale } from "@/i18n/routing";

export function TargetLocaleShell({ locale, children }: { locale: Extract<PlannedLocale, "fil" | "bn" | "uk" | "ms" | "sv" | "cs" | "ro" | "el">; children: React.ReactNode }) {
  const messages = getMessages(locale);
  return <div className="flex min-h-full flex-1 flex-col">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <Link href={`/${locale}/tools`} aria-label={messages.tools} className="flex items-center gap-2">
          <Image src="/_assets/tools/images/brand/woori-logo.png" alt="woori.today" width={419} height={99} sizes="(max-width: 639px) 84px, 160px" priority className="h-auto w-[84px] sm:w-[160px]" />
          <span className="hidden text-sm font-semibold text-slate-700 sm:inline">{messages.tools}</span>
        </Link>
        <nav aria-label={messages.tools} className="flex items-center gap-3 text-sm">
          <Link href={`/${locale}/tools`} className="hover:text-indigo-700">{messages.allTools}</Link>
          <Link href={`/${locale}/privacy`} className="hidden hover:text-indigo-700 sm:inline">{messages.privacy}</Link>
          <LanguageSelector locale={locale} />
        </nav>
      </div>
    </header>
    <div className="flex-1">{children}</div>
    <footer className="border-t border-slate-200 bg-white px-4 py-6 text-sm text-slate-600">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <span>© {new Date().getFullYear()} Woori Tools</span>
        <nav aria-label={messages.terms} className="flex gap-4"><Link href={`/${locale}/privacy`}>{messages.privacy}</Link><Link href={`/${locale}/terms`}>{messages.terms}</Link></nav>
      </div>
    </footer>
    <CopyToast locale={locale} />
    <GoogleAnalytics />
  </div>;
}
