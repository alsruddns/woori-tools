export const locales = ["ko", "en", "ja", "zh"] as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function localizePath(locale: Locale, path: string): string {
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

export function switchLocalePath(pathname: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (isLocale(segments[0] ?? "")) segments.shift();

  const path = segments.length ? `/${segments.join("/")}` : "/tools";
  return localizePath(locale, path);
}
