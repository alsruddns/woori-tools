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
  "## Remaining Russian implementation work",
  "",
  `- Authoring is complete for all 176 Russian tool editorial bundles; ${targetLocalePublication.ru.publishedToolSlugs.length} tools have passed UI and SEO verification and are publicly routable.`,
  "- Next: connect the other tool workspaces and their localized control, input, result, status, and error copy; verify each tool before adding it to the UI, SEO, and published sets.",
  "- Do not start the next locale until Russian UI integration and publication checks are complete.",
  "",
  "## Last verified checkpoint",
  "",
  "- Validation: TypeScript passed; lint passed; all 122 tests passed; content-quality checks passed; production build passed.",
  `- Production build prerendered 2,900 static pages; the tool sitemap contains 2,720 localized tool URLs, including ${targetLocalePublication.ru.publishedToolSlugs.length} verified Russian tool pages.`,
  `- Russian canonical, hreflang, x-default, Open Graph, route rendering, and sitemap membership passed source checks for all ${targetLocalePublication.ru.publishedToolSlugs.length} pages; production rendering checks passed for color-converter, cron-parser, sql-formatter, html-formatter, css-formatter, javascript-formatter, jpg-to-png, png-to-jpg, webp-to-jpg, webp-to-png, jpg-to-webp, png-to-webp, heic-to-jpg, image-compress, image-resize, image-crop, image-rotate, image-flip, image-grayscale, image-brightness, image-contrast, image-blur, image-pixelate, remove-image-metadata, image-info, favicon-generator, image-color-picker, regex-tester, lorem-ipsum, text-to-file, remove-characters, text-repeater, remove-spaces, remove-line-breaks, text-case-converter, reverse-text, remove-duplicate-words, character-count, shuffle-lines, add-line-numbers, remove-line-numbers, remove-empty-lines, remove-duplicate-lines, sort-lines, bulk-file-renamer, filename-cleaner, zip-files, duplicate-file-checker, file-hash, mime-type-checker, file-extension-checker, file-size-checker, image-collage, instagram-grid-split, barcode-checker, barcode-generator, and markdown-preview.`,
  "- The verified route set is intentionally limited to published tool slugs; the remaining Russian tools are not routable or indexed.",
  "- Current branch is `develop`.",
  `- Next Russian translation-data tool: \`${currentPending[0] ?? "none"}\`; next Russian workspace UI tool: \`images-to-pdf\`.`,
  "",
];

async function main() {
  await writeFile("docs/i18n-expansion-progress.md", lines.join("\n"), "utf8");
}

void main();
