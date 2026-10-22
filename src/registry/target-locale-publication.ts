import type { PlannedLocale } from "@/i18n/routing";

type LocalePublication = {
  uiVerifiedToolSlugs: readonly string[];
  seoVerifiedToolSlugs: readonly string[];
  publishedToolSlugs: readonly string[];
};

export const targetLocalePublication = {
  ru: {
    uiVerifiedToolSlugs: ["barcode-generator"],
    seoVerifiedToolSlugs: ["barcode-generator"],
    publishedToolSlugs: ["barcode-generator"],
  },
  tr: { uiVerifiedToolSlugs: [], seoVerifiedToolSlugs: [], publishedToolSlugs: [] },
  pl: { uiVerifiedToolSlugs: [], seoVerifiedToolSlugs: [], publishedToolSlugs: [] },
  fil: { uiVerifiedToolSlugs: [], seoVerifiedToolSlugs: [], publishedToolSlugs: [] },
  bn: { uiVerifiedToolSlugs: [], seoVerifiedToolSlugs: [], publishedToolSlugs: [] },
  uk: { uiVerifiedToolSlugs: [], seoVerifiedToolSlugs: [], publishedToolSlugs: [] },
  ms: { uiVerifiedToolSlugs: [], seoVerifiedToolSlugs: [], publishedToolSlugs: [] },
  sv: { uiVerifiedToolSlugs: [], seoVerifiedToolSlugs: [], publishedToolSlugs: [] },
  cs: { uiVerifiedToolSlugs: [], seoVerifiedToolSlugs: [], publishedToolSlugs: [] },
  ro: { uiVerifiedToolSlugs: [], seoVerifiedToolSlugs: [], publishedToolSlugs: [] },
  el: { uiVerifiedToolSlugs: [], seoVerifiedToolSlugs: [], publishedToolSlugs: [] },
} satisfies Record<PlannedLocale, LocalePublication>;
