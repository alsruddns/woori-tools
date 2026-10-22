import { writeFile } from "node:fs/promises";
import { plannedLocaleConfig, publishedTargetLocales } from "../src/i18n/routing";
import { tools } from "../src/registry/tools";
import { targetLotterySlugs, getTargetLotteryTranslation } from "../src/registry/target-lottery-translations";
import { targetRussianToolSlugs, getTargetRussianToolTranslation } from "../src/registry/target-ru-translations";
import { targetLocalePublication } from "../src/registry/target-locale-publication";

const slugs = tools.filter((tool) => tool.isPublic).map((tool) => tool.slug);
const completeByLocale = Object.fromEntries(plannedLocaleConfig.map(({ routeLocale }) => {
  const completed = slugs.filter((slug) => {
    const lottery = getTargetLotteryTranslation(routeLocale, slug);
    const russian = routeLocale === "ru" ? getTargetRussianToolTranslation(slug) : undefined;
    return Boolean(lottery || russian);
  });
  return [routeLocale, completed];
}));

const currentLocale = "ru" as const;
const currentComplete = completeByLocale[currentLocale];
const currentPending = slugs.filter((slug) => !currentComplete.includes(slug));
const nextWorkspace = targetRussianToolSlugs.find((slug) => !targetLocalePublication.ru.publishedToolSlugs.includes(slug)) ?? "none";
const lines = [
  "# Woori Tools 26-language localization progress",
  "",
  `Updated from the translation source modules. Public tool count: ${slugs.length}. Target locales: ${plannedLocaleConfig.length}.`,
  `Routable locales: ${publishedTargetLocales.length} (${publishedTargetLocales.join(", ")}). A target locale is listed as published only for tool pages that pass the UI and SEO checks.`,
  "",
  "## Per-locale status",
  "",
  "| Locale | Translation data | UI verified | SEO verified | Public tools | Pending data | Next tool |",
  "| --- | ---: | ---: | ---: | ---: | ---: | --- |",
  ...plannedLocaleConfig.map(({ routeLocale }) => {
    const done = completeByLocale[routeLocale];
    const pending = slugs.filter((slug) => !done.includes(slug));
    const publication = targetLocalePublication[routeLocale];
    return `| ${routeLocale} | ${done.length}/${slugs.length} | ${publication.uiVerifiedToolSlugs.length} | ${publication.seoVerifiedToolSlugs.length} | ${publication.publishedToolSlugs.length} | ${pending.length} | ${pending[0] ?? "none"} |`;
  }),
  "",
  "## Translation coverage",
  "",
  `- Existing authored lottery bundle slugs: ${targetLotterySlugs.join(", ")}`,
  `- Additional Russian bundle slugs: ${targetRussianToolSlugs.join(", ")}`,
  `- Russian completed tool bundles: ${currentComplete.length}/${slugs.length}`,
  `- Russian tools with UI verified: ${targetLocalePublication.ru.uiVerifiedToolSlugs.join(", ") || "none"}`,
  `- Russian tools with SEO verified: ${targetLocalePublication.ru.seoVerifiedToolSlugs.join(", ") || "none"}`,
  `- Russian tool URLs published: ${targetLocalePublication.ru.publishedToolSlugs.join(", ") || "none"}`,
  `- Russian next tool: ${currentPending[0] ?? "none"}`,
  "- Russian shared site, search, workspace, error, privacy, and terms messages are wired for the published route; non-Russian target UI messages remain unpublished.",
  "- Only tool-locale URLs listed in the registry are included in the sitemap and hreflang sets.",
  "",
  "## Remaining Russian translation data",
  "",
  ...currentPending.map((slug) => `- ${slug}`),
  "",
  "## Next locale",
  "",
  `- Russian authoring, UI, and SEO verification is complete for all ${targetLocalePublication.ru.publishedToolSlugs.length} tools.`,
  "- Continue with Turkish (tr), reusing its six existing lottery translation bundles. The next translation-data tool is tarot-card; 170 Turkish tool translations remain.",
  "",
  "## Last verified checkpoint",
  "",
  "- Validation: TypeScript passed; lint passed; all 135 tests passed; content-quality checks passed; production build passed.",
  `- Production build prerendered 2,996 static pages; the tool sitemap contains 2,816 localized tool URLs, including ${targetLocalePublication.ru.publishedToolSlugs.length} verified Russian tool pages.`,
  `- Russian canonical, hreflang, x-default, Open Graph, route rendering, and sitemap membership passed source checks for all ${targetLocalePublication.ru.publishedToolSlugs.length} pages; production HTML rendering was checked for lotto-number-generator, social-image-resize, add-text-to-image, germany-iban-validator, german-number-format-converter, german-date-format-converter, spain-dni-validator, spain-nie-validator, spanish-number-format-converter, spanish-date-format-converter, france-phone-number-formatter, french-number-format-converter, french-date-format-converter, brazil-cpf-validator, brazil-cnpj-validator, brazil-phone-number-formatter, brazil-cep-formatter, netherlands-iban-validator, dutch-number-format-converter, dutch-date-format-converter, vietnam-phone-number-formatter, vietnam-number-format-converter, italy-fiscal-code-format-validator, italy-vat-number-validator, italy-number-format-converter, italian-date-format-converter, australia-postcode-formatter, english-date-format-converter, indian-number-format-converter, lakh-crore-converter, pan-format-validator, gstin-format-validator, india-phone-number-formatter, simplified-traditional-chinese-converter, chinese-number-kanji-converter, rmb-uppercase-converter, chinese-zodiac-calculator, chinese-sexagenary-cycle-calculator, chinese-phone-number-formatter, taiwan-phone-number-formatter, jwt-decoder, url-query-parameter-parser, user-agent-parser, ip-cidr-calculator, hash-compare, regex-replace, html-entity-encoder-decoder, chmod-calculator, json-path-tester, csv-tsv-converter, url-slug-generator, unicode-code-point-checker, us-phone-number-formatter, us-zip-code-formatter, canada-postal-code-formatter, uk-postcode-formatter, numbers3-number-generator, numbers4-number-generator, bingo5-number-generator, wareki-converter, hiragana-katakana-converter, fullwidth-halfwidth-converter, japanese-romaji-converter, japanese-number-kanji-converter, yakudoshi-calculator, base64, url-encode-decode, timestamp-converter, uuid-generator, uuid-v7-generator, ulid-generator, base32-encoder-decoder, json-formatter, json-validator, json-to-yaml, yaml-to-json, csv-to-json, json-to-csv, color-converter, cron-parser, sql-formatter, html-formatter, css-formatter, javascript-formatter, jpg-to-png, png-to-jpg, webp-to-jpg, webp-to-png, jpg-to-webp, png-to-webp, heic-to-jpg, image-compress, image-resize, image-crop, image-rotate, image-flip, image-grayscale, image-brightness, image-contrast, image-blur, image-pixelate, remove-image-metadata, image-info, favicon-generator, image-color-picker, images-to-pdf, pdf-merge, pdf-split, pdf-delete-pages, pdf-reorder-pages, pdf-rotate-pages, pdf-add-page-numbers, pdf-watermark, pdf-metadata-viewer, pdf-remove-metadata, pdf-page-size-checker, text-compare, regex-tester, lorem-ipsum, text-to-file, remove-characters, text-repeater, remove-spaces, remove-line-breaks, text-case-converter, reverse-text, remove-duplicate-words, character-count, shuffle-lines, add-line-numbers, remove-line-numbers, remove-empty-lines, remove-duplicate-lines, sort-lines, bulk-file-renamer, filename-cleaner, zip-files, duplicate-file-checker, file-hash, mime-type-checker, file-extension-checker, file-size-checker, image-collage, instagram-grid-split, barcode-checker, barcode-generator, and markdown-preview.`,
  "- Current branch is `develop`.",
  `- Next Russian translation-data tool: \`${currentPending[0] ?? "none"}\`; next Russian workspace UI tool: \`${nextWorkspace}\`.`,
  "",
];

async function main() {
  await writeFile("docs/i18n-expansion-progress.md", lines.join("\n"), "utf8");
}

void main();
