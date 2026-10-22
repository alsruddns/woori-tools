import type { PlannedLocale } from "@/i18n/routing";

type LocalePublication = {
  uiVerifiedToolSlugs: readonly string[];
  seoVerifiedToolSlugs: readonly string[];
  publishedToolSlugs: readonly string[];
};

export const targetLocalePublication = {
  ru: {
    uiVerifiedToolSlugs: ["zip-files", "file-hash", "mime-type-checker", "file-extension-checker", "file-size-checker", "duplicate-file-checker", "barcode-generator", "barcode-checker", "instagram-grid-split", "image-collage", "markdown-preview", "timer", "pomodoro-timer", "password-generator", "random-string-generator", "wifi-qr", "contact-qr", "phone-qr", "email-qr", "world-clock", "dice-roller", "random-number", "stopwatch", "coin-flip", "random-name-picker", "draw-lots", "random-team-maker", "random-order", "random-seat", "duty-picker", "random-wheel", "tarot-card", "daily-fortune", "saju"],
    seoVerifiedToolSlugs: ["zip-files", "file-hash", "mime-type-checker", "file-extension-checker", "file-size-checker", "duplicate-file-checker", "barcode-generator", "barcode-checker", "instagram-grid-split", "image-collage", "markdown-preview", "timer", "pomodoro-timer", "password-generator", "random-string-generator", "wifi-qr", "contact-qr", "phone-qr", "email-qr", "world-clock", "dice-roller", "random-number", "stopwatch", "coin-flip", "random-name-picker", "draw-lots", "random-team-maker", "random-order", "random-seat", "duty-picker", "random-wheel", "tarot-card", "daily-fortune", "saju"],
    publishedToolSlugs: ["zip-files", "file-hash", "mime-type-checker", "file-extension-checker", "file-size-checker", "duplicate-file-checker", "barcode-generator", "barcode-checker", "instagram-grid-split", "image-collage", "markdown-preview", "timer", "pomodoro-timer", "password-generator", "random-string-generator", "wifi-qr", "contact-qr", "phone-qr", "email-qr", "world-clock", "dice-roller", "random-number", "stopwatch", "coin-flip", "random-name-picker", "draw-lots", "random-team-maker", "random-order", "random-seat", "duty-picker", "random-wheel", "tarot-card", "daily-fortune", "saju"],
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
