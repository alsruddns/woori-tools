import type { PlannedLocale } from "@/i18n/routing";

type LocalePublication = {
  uiVerifiedToolSlugs: readonly string[];
  seoVerifiedToolSlugs: readonly string[];
  publishedToolSlugs: readonly string[];
};

export const targetLocalePublication = {
  ru: {
    uiVerifiedToolSlugs: ["regex-tester", "lorem-ipsum", "text-to-file", "remove-characters", "text-repeater", "remove-spaces", "remove-line-breaks", "text-case-converter", "reverse-text", "remove-duplicate-words", "character-count", "shuffle-lines", "add-line-numbers", "remove-line-numbers", "remove-empty-lines", "remove-duplicate-lines", "sort-lines", "bulk-file-renamer", "filename-cleaner", "zip-files", "file-hash", "mime-type-checker", "file-extension-checker", "file-size-checker", "duplicate-file-checker", "barcode-generator", "barcode-checker", "instagram-grid-split", "image-collage", "markdown-preview", "timer", "pomodoro-timer", "password-generator", "random-string-generator", "wifi-qr", "contact-qr", "phone-qr", "email-qr", "world-clock", "dice-roller", "random-number", "stopwatch", "coin-flip", "random-name-picker", "draw-lots", "random-team-maker", "random-order", "random-seat", "duty-picker", "random-wheel", "tarot-card", "daily-fortune", "saju"],
    seoVerifiedToolSlugs: ["regex-tester", "lorem-ipsum", "text-to-file", "remove-characters", "text-repeater", "remove-spaces", "remove-line-breaks", "text-case-converter", "reverse-text", "remove-duplicate-words", "character-count", "shuffle-lines", "add-line-numbers", "remove-line-numbers", "remove-empty-lines", "remove-duplicate-lines", "sort-lines", "bulk-file-renamer", "filename-cleaner", "zip-files", "file-hash", "mime-type-checker", "file-extension-checker", "file-size-checker", "duplicate-file-checker", "barcode-generator", "barcode-checker", "instagram-grid-split", "image-collage", "markdown-preview", "timer", "pomodoro-timer", "password-generator", "random-string-generator", "wifi-qr", "contact-qr", "phone-qr", "email-qr", "world-clock", "dice-roller", "random-number", "stopwatch", "coin-flip", "random-name-picker", "draw-lots", "random-team-maker", "random-order", "random-seat", "duty-picker", "random-wheel", "tarot-card", "daily-fortune", "saju"],
    publishedToolSlugs: ["regex-tester", "lorem-ipsum", "text-to-file", "remove-characters", "text-repeater", "remove-spaces", "remove-line-breaks", "text-case-converter", "reverse-text", "remove-duplicate-words", "character-count", "shuffle-lines", "add-line-numbers", "remove-line-numbers", "remove-empty-lines", "remove-duplicate-lines", "sort-lines", "bulk-file-renamer", "filename-cleaner", "zip-files", "file-hash", "mime-type-checker", "file-extension-checker", "file-size-checker", "duplicate-file-checker", "barcode-generator", "barcode-checker", "instagram-grid-split", "image-collage", "markdown-preview", "timer", "pomodoro-timer", "password-generator", "random-string-generator", "wifi-qr", "contact-qr", "phone-qr", "email-qr", "world-clock", "dice-roller", "random-number", "stopwatch", "coin-flip", "random-name-picker", "draw-lots", "random-team-maker", "random-order", "random-seat", "duty-picker", "random-wheel", "tarot-card", "daily-fortune", "saju"],
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
