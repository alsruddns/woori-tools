export const localeConfig = [
  { locale: "ko", routeLocale: "ko", hreflang: "ko", nativeName: "한국어", intlLocale: "ko-KR" },
  { locale: "en", routeLocale: "en", hreflang: "en", nativeName: "English", intlLocale: "en-US" },
  { locale: "ja", routeLocale: "ja", hreflang: "ja", nativeName: "日本語", intlLocale: "ja-JP" },
  { locale: "zh", routeLocale: "zh", hreflang: "zh-CN", nativeName: "简体中文", intlLocale: "zh-CN" },
  { locale: "es", routeLocale: "es", hreflang: "es", nativeName: "Español", intlLocale: "es-ES" },
  { locale: "pt-BR", routeLocale: "pt-br", hreflang: "pt-BR", nativeName: "Português (Brasil)", intlLocale: "pt-BR" },
  { locale: "de", routeLocale: "de", hreflang: "de", nativeName: "Deutsch", intlLocale: "de-DE" },
  { locale: "fr", routeLocale: "fr", hreflang: "fr", nativeName: "Français", intlLocale: "fr-FR" },
  { locale: "vi", routeLocale: "vi", hreflang: "vi", nativeName: "Tiếng Việt", intlLocale: "vi-VN" },
  { locale: "id", routeLocale: "id", hreflang: "id", nativeName: "Bahasa Indonesia", intlLocale: "id-ID" },
  { locale: "th", routeLocale: "th", hreflang: "th", nativeName: "ไทย", intlLocale: "th-TH" },
  { locale: "zh-TW", routeLocale: "zh-tw", hreflang: "zh-TW", nativeName: "繁體中文", intlLocale: "zh-TW" },
  { locale: "it", routeLocale: "it", hreflang: "it", nativeName: "Italiano", intlLocale: "it-IT" },
  { locale: "nl", routeLocale: "nl", hreflang: "nl", nativeName: "Nederlands", intlLocale: "nl-NL" },
  { locale: "hi", routeLocale: "hi", hreflang: "hi", nativeName: "हिन्दी", intlLocale: "hi-IN" },
] as const;

export type RouteLocale = (typeof localeConfig)[number]["routeLocale"];
export type Locale = RouteLocale;
export type UiLocale = "ko" | "en" | "ja" | "zh";
export type LocaleConfig = (typeof localeConfig)[number];
export const locales = localeConfig.map(({ routeLocale }) => routeLocale) as [RouteLocale, ...RouteLocale[]];
export const localeLabels = Object.fromEntries(localeConfig.map(({ routeLocale, nativeName }) => [routeLocale, nativeName])) as Record<RouteLocale, string>;
export const intlLocales = Object.fromEntries(localeConfig.map(({ routeLocale, intlLocale }) => [routeLocale, intlLocale])) as Record<RouteLocale, string>;
export const hreflangs = Object.fromEntries(localeConfig.map(({ routeLocale, hreflang }) => [routeLocale, hreflang])) as Record<RouteLocale, string>;

export function getLocaleConfig(routeLocale: string): LocaleConfig | undefined {
  return localeConfig.find((item) => item.routeLocale === routeLocale);
}

export function isLocale(value: string): value is RouteLocale {
  return getLocaleConfig(value) !== undefined;
}

export function getUiLocale(locale: RouteLocale): UiLocale {
  return locale === "ko" || locale === "en" || locale === "ja" || locale === "zh" ? locale : "en";
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

export function resolveLocaleSelection(requested: RouteLocale, available: readonly RouteLocale[]): RouteLocale {
  return available.includes(requested) ? requested : available.includes("en") ? "en" : "ko";
}
