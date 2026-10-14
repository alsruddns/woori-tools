import Image from "next/image";
import Link from "next/link";
import { FamilySiteSelector } from "@/components/layout/family-site-selector";
import { LanguageSelector } from "@/components/layout/language-selector";
import { siteChromeMessages } from "@/i18n/site-chrome-messages";
import type { Dictionary } from "@/i18n/messages";
import { localizePath, type Locale } from "@/i18n/routing";
import { getLocalizedCategories } from "@/registry/category-translations";
import { tools } from "@/registry/tools";

export function SiteHeader({ locale, messages }: { locale: Locale; messages: Dictionary }) {
  const chrome = siteChromeMessages[locale];
  const visibleCategories = getLocalizedCategories(locale).filter((category) =>
    category.id !== "qr" && tools.some((tool) => tool.category === category.id && tool.supportedLocales.includes(locale)),
  ).slice(0, 4);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-2 px-4 lg:flex-nowrap lg:gap-3 sm:px-6 lg:px-8">
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
            Tools
          </span>
        </Link>
        <div className="flex min-w-0 shrink-0 flex-wrap items-center justify-end gap-1.5 lg:flex-nowrap lg:gap-5">
          <nav aria-label={messages.tools} className="hidden items-center gap-3 text-sm sm:flex sm:gap-5">
            <Link href={localizePath(locale, "/tools")} className="font-medium text-slate-700 hover:text-indigo-700">
              {messages.tools}
            </Link>
            <div className="hidden items-center gap-4 md:flex">
              {visibleCategories.map((category) => (
                <Link key={category.id} href={localizePath(locale, `/tools/category/${category.id}`)} className="text-slate-600 hover:text-indigo-700">
                  {category.name}
                </Link>
              ))}
            </div>
          </nav>
          <FamilySiteSelector locale={locale} />
          <LanguageSelector locale={locale} />
        </div>
      </div>
    </header>
  );
}
