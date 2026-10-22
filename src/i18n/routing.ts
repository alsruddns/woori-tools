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

// These locales are part of the expansion target, but are intentionally not
// routable or indexable until their complete translation set is published.
export const plannedLocaleConfig = [
  { locale: "ru", routeLocale: "ru", hreflang: "ru", nativeName: "Русский", intlLocale: "ru-RU" },
  { locale: "tr", routeLocale: "tr", hreflang: "tr", nativeName: "Türkçe", intlLocale: "tr-TR" },
  { locale: "pl", routeLocale: "pl", hreflang: "pl", nativeName: "Polski", intlLocale: "pl-PL" },
  { locale: "fil", routeLocale: "fil", hreflang: "fil", nativeName: "Filipino", intlLocale: "fil-PH" },
  { locale: "bn", routeLocale: "bn", hreflang: "bn", nativeName: "বাংলা", intlLocale: "bn-BD" },
  { locale: "uk", routeLocale: "uk", hreflang: "uk", nativeName: "Українська", intlLocale: "uk-UA" },
  { locale: "ms", routeLocale: "ms", hreflang: "ms", nativeName: "Bahasa Melayu", intlLocale: "ms-MY" },
  { locale: "sv", routeLocale: "sv", hreflang: "sv", nativeName: "Svenska", intlLocale: "sv-SE" },
  { locale: "cs", routeLocale: "cs", hreflang: "cs", nativeName: "Čeština", intlLocale: "cs-CZ" },
  { locale: "ro", routeLocale: "ro", hreflang: "ro", nativeName: "Română", intlLocale: "ro-RO" },
  { locale: "el", routeLocale: "el", hreflang: "el", nativeName: "Ελληνικά", intlLocale: "el-GR" },
] as const;

export const targetLocaleConfig = [...localeConfig, ...plannedLocaleConfig] as const;
export type RouteLocale = (typeof localeConfig)[number]["routeLocale"];
export type Locale = RouteLocale;
export type TargetLocale = (typeof targetLocaleConfig)[number]["routeLocale"];
export type UiLocale = "ko" | "en" | "ja" | "zh";
export type LocaleConfig = (typeof localeConfig)[number];
export const locales = localeConfig.map(({ routeLocale }) => routeLocale) as [RouteLocale, ...RouteLocale[]];
export const targetLocales = targetLocaleConfig.map(({ routeLocale }) => routeLocale) as [TargetLocale, ...TargetLocale[]];
export const localeLabels = Object.fromEntries(localeConfig.map(({ routeLocale, nativeName }) => [routeLocale, nativeName])) as Record<RouteLocale, string>;
export const targetLocaleLabels = Object.fromEntries(targetLocaleConfig.map(({ routeLocale, nativeName }) => [routeLocale, nativeName])) as Record<TargetLocale, string>;
export const intlLocales = Object.fromEntries(localeConfig.map(({ routeLocale, intlLocale }) => [routeLocale, intlLocale])) as Record<RouteLocale, string>;
export const hreflangs = Object.fromEntries(localeConfig.map(({ routeLocale, hreflang }) => [routeLocale, hreflang])) as Record<RouteLocale, string>;

export function getLocaleConfig(routeLocale: string): LocaleConfig | undefined {
  return localeConfig.find((item) => item.routeLocale === routeLocale);
}

export function isLocale(value: string): value is RouteLocale {
  return getLocaleConfig(value) !== undefined;
}

export function isTargetLocale(value: string): value is TargetLocale {
  return targetLocaleConfig.some((item) => item.routeLocale === value);
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
