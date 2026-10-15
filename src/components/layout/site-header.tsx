import Image from "next/image";
import Link from "next/link";
import { FamilySiteSelector } from "@/components/layout/family-site-selector";
import { LanguageSelector } from "@/components/layout/language-selector";
import { siteChromeMessages } from "@/i18n/site-chrome-messages";
import type { Locale } from "@/i18n/routing";

export function SiteHeader({ locale }: { locale: Locale }) {
  const chrome = siteChromeMessages[locale];

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-2 px-4 py-2 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}`}
          aria-label={chrome.logoHome}
          className="flex shrink-0 items-center gap-2"
        >
          <Image
            src="/_assets/tools/images/brand/woori-logo.png"
            alt="woori.today"
            width={419}
            height={99}
            sizes="(max-width: 639px) 84px, 160px"
            priority
            className="h-auto w-[84px] sm:w-[160px]"
          />
          <span className="hidden text-sm font-semibold tracking-tight text-slate-700 sm:inline sm:text-base">
            {siteChromeMessages[locale].tools}
          </span>
        </Link>
        <FamilySiteSelector locale={locale} />
        <div className="ml-auto flex shrink-0 items-center gap-2 xl:ml-0">
          <LanguageSelector locale={locale} />
        </div>
      </div>
    </header>
  );
}
