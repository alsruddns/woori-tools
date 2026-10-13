import type { Metadata } from "next";
import { getLocaleConfig, hreflangs, locales, type Locale } from "@/i18n/routing";

const siteOrigin = "https://www.woori.today";
export const SITE_ORIGIN = siteOrigin;
export const SITE_NAME = "Woori Tools";

export function absoluteUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalizedPath}`;
}

export function localizedUrl(locale: Locale, path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return absoluteUrl(`/${locale}${normalizedPath}`);
}

export function languageAlternates(path: string, supportedLocales: readonly Locale[] = locales): Record<string, string> {
  return {
    ...Object.fromEntries(supportedLocales.map((locale) => [hreflangs[locale], localizedUrl(locale, path)])),
    "x-default": localizedUrl("ko", path),
  };
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  keywords,
  supportedLocales,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  supportedLocales?: readonly Locale[];
}): Metadata {
  const url = localizedUrl(locale, path);
  const fullTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url, languages: languageAlternates(path, supportedLocales) },
    openGraph: { siteName: SITE_NAME, locale: getLocaleConfig(locale)?.intlLocale.replace("-", "_") ?? "en_US", type: "website", title: fullTitle, description, url },
    twitter: { card: "summary", title: fullTitle, description },
  };
}
