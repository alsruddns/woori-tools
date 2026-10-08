import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/routing";

const siteOrigin = (process.env.SITE_URL ?? "https://www.woori.today").replace(/\/+$/, "");
export const SITE_ORIGIN = siteOrigin;
export const SITE_NAME = "Woori Tools";

const ogLocales: Record<Locale, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
  zh: "zh_CN",
};

export function absoluteUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalizedPath}`;
}

export function localizedUrl(locale: Locale, path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return absoluteUrl(`/${locale}${normalizedPath}`);
}

export function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((locale) => [locale, localizedUrl(locale, path)])),
    "x-default": localizedUrl("ko", path),
  };
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  keywords,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
}): Metadata {
  const url = localizedUrl(locale, path);
  const fullTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: { siteName: SITE_NAME, locale: ogLocales[locale], type: "website", title: fullTitle, description, url },
    twitter: { card: "summary", title: fullTitle, description },
  };
}
