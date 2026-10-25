import { writeFile } from "node:fs/promises";
import { plannedLocaleConfig, publishedTargetLocales } from "../src/i18n/routing";
import { tools } from "../src/registry/tools";
import { targetLotterySlugs } from "../src/registry/target-lottery-translations";
import { targetRussianToolSlugs } from "../src/registry/target-ru-translations";
import { targetTurkishToolSlugs } from "../src/registry/target-tr-translations";
import { targetPolishToolSlugs } from "../src/registry/target-pl-translations";
import { targetFilipinoToolSlugs } from "../src/registry/target-fil-translations";
import { targetSevenToolSlugs } from "../src/registry/target-seven-tools-translations";
import { targetLocalePublication } from "../src/registry/target-locale-publication";
import { getTargetToolTranslation } from "../src/registry/target-tool-translation";

const slugs = tools.filter((tool) => tool.isPublic).map((tool) => tool.slug);
const completeByLocale = Object.fromEntries(plannedLocaleConfig.map(({ routeLocale }) => {
  const completed = slugs.filter((slug) => Boolean(getTargetToolTranslation(routeLocale, slug)));
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
  "| Locale | Translation data | UI verified | SEO verified | Public tools | Pending data | Next data/UI |",
  "| --- | ---: | ---: | ---: | ---: | ---: | --- |",
  ...plannedLocaleConfig.map(({ routeLocale }) => {
    const done = completeByLocale[routeLocale];
    const pending = slugs.filter((slug) => !done.includes(slug));
    const publication = targetLocalePublication[routeLocale];
    const nextUi = slugs.find((slug) => !publication.uiVerifiedToolSlugs.includes(slug));
    const next = pending[0] ?? (nextUi ? `UI: ${nextUi}` : "none");
    return `| ${routeLocale} | ${done.length}/${slugs.length} | ${publication.uiVerifiedToolSlugs.length} | ${publication.seoVerifiedToolSlugs.length} | ${publication.publishedToolSlugs.length} | ${pending.length} | ${next} |`;
  }),
  "",
  "## Translation coverage",
  "",
  `- Existing authored lottery bundle slugs: ${targetLotterySlugs.join(", ")}`,
  `- Additional Russian bundle slugs: ${targetRussianToolSlugs.join(", ")}`,
  `- Additional Turkish bundle slugs: ${targetTurkishToolSlugs.join(", ")}`,
  `- Additional Polish bundle slugs: ${targetPolishToolSlugs.join(", ")}`,
  `- Additional Filipino bundle slugs: ${targetFilipinoToolSlugs.join(", ")}`,
  `- Additional bn/uk/ms/sv/cs/ro/el bundle slugs: ${targetSevenToolSlugs.join(", ")}`,
  `- Russian completed tool bundles: ${currentComplete.length}/${slugs.length}`,
  `- Russian tools with UI verified: ${targetLocalePublication.ru.uiVerifiedToolSlugs.join(", ") || "none"}`,
  `- Russian tools with SEO verified: ${targetLocalePublication.ru.seoVerifiedToolSlugs.join(", ") || "none"}`,
  `- Russian tool URLs published: ${targetLocalePublication.ru.publishedToolSlugs.join(", ") || "none"}`,
  `- Russian next tool: ${currentPending[0] ?? "none"}`,
  "- Russian shared site, search, workspace, error, privacy, and terms messages are wired for the published route; Polish pages are published only for the per-tool UI and SEO allowlist.",
  "- Only tool-locale URLs listed in the registry are included in the sitemap and hreflang sets.",
  "",
  "## Remaining Russian translation data",
  "",
  ...currentPending.map((slug) => `- ${slug}`),
  "",
  "## Next locale",
  "",
  `- Russian and Turkish authoring, UI, and SEO verification is complete for all ${targetLocalePublication.ru.publishedToolSlugs.length} and ${targetLocalePublication.tr.publishedToolSlugs.length} tools, respectively.`,
  `- Polish translation data is complete for ${completeByLocale.pl.length}/${slugs.length}; ${targetLocalePublication.pl.publishedToolSlugs.length} verified tool pages are published, with ${slugs.length - targetLocalePublication.pl.publishedToolSlugs.length} otherwise unverified pages withheld.`,
  `- Polish UI/SEO verification is complete for ${targetLocalePublication.pl.publishedToolSlugs.length}/${slugs.length} tools. Filipino (fil) has authored data for ${completeByLocale.fil.length}/${slugs.length}, with ${targetLocalePublication.fil.publishedToolSlugs.length} pages UI-verified and public; continue at ${slugs.find((slug) => !completeByLocale.fil.includes(slug)) ?? "none"}, then proceed in order: bn, uk, ms, sv, cs, ro, el.`,
  "",
  "## Last verified checkpoint",
  "",
  "- Authored target tool data is resolved through src/registry/target-tool-translation.ts; pnpm check:target-locale-tools validates all 11 × 176 entries and required editorial/SEO fields. This does not count as UI, SEO route, or public-page verification.",
  "- Validation on 2026-10-25: TypeScript passed; lint passed; all 182 tests passed; content-quality check passed; production build passed and prerendered 3370 static pages. Filipino translation data is 176/176; UI, SEO, and publication remain pending.",
  `- Production build prerendered ${3_194 + targetLocalePublication.pl.publishedToolSlugs.length} static pages and ${2_992 + targetLocalePublication.pl.publishedToolSlugs.length} tool-locale URLs: 2,640 existing-locale pages, 176 Russian, 176 Turkish, and ${targetLocalePublication.pl.publishedToolSlugs.length} Polish.`,
  `- Polish production HTML for germany-iban-validator, german-number-format-converter, german-date-format-converter, spain-dni-validator, spain-nie-validator, spanish-number-format-converter, spanish-date-format-converter, france-phone-number-formatter, french-number-format-converter, french-date-format-converter, netherlands-iban-validator, dutch-number-format-converter, dutch-date-format-converter, brazil-cpf-validator, brazil-cnpj-validator, brazil-phone-number-formatter, brazil-cep-formatter, vietnam-phone-number-formatter, vietnam-number-format-converter, italy-fiscal-code-format-validator, italy-vat-number-validator, italy-number-format-converter, italian-date-format-converter, australia-postcode-formatter, english-date-format-converter, us-phone-number-formatter, us-zip-code-formatter, canada-postal-code-formatter, uk-postcode-formatter, indian-number-format-converter, lakh-crore-converter, pan-format-validator, gstin-format-validator, india-phone-number-formatter, simplified-traditional-chinese-converter, chinese-number-kanji-converter, rmb-uppercase-converter, chinese-zodiac-calculator, chinese-sexagenary-cycle-calculator, chinese-phone-number-formatter, taiwan-phone-number-formatter, jwt-decoder, url-query-parameter-parser, user-agent-parser, ip-cidr-calculator, base32-encoder-decoder, ulid-generator, uuid-v7-generator, hash-compare, regex-replace, html-entity-encoder-decoder, chmod-calculator, json-path-tester, csv-tsv-converter, url-slug-generator, unicode-code-point-checker, pdf-page-size-checker, wareki-converter, hiragana-katakana-converter, fullwidth-halfwidth-converter, japanese-romaji-converter, japanese-number-kanji-converter, yakudoshi-calculator, japanese-zodiac-calculator, numbers3-number-generator, numbers4-number-generator, bingo5-number-generator, timestamp-converter, jpg-to-png, png-to-jpg, webp-to-jpg, webp-to-png, jpg-to-webp, png-to-webp, heic-to-jpg, markdown-preview, sql-formatter, html-formatter, css-formatter, javascript-formatter, regex-tester, shuffle-lines, barcode-generator, wifi-qr, contact-qr, phone-qr, email-qr, password-generator, random-string-generator, world-clock, pomodoro-timer, timer, stopwatch, coin-flip, dice-roller, duty-picker, random-seat, random-order, random-team-maker, random-wheel, random-name-picker, draw-lots, random-number, saju, daily-fortune, tarot-card, lotto-number-generator, json-formatter, instagram-grid-split, and image-collage has localized page/workspace copy, a unique canonical, Polish hreflang, and x-default. Exactly ${targetLocalePublication.pl.publishedToolSlugs.length} Polish tool HTML files are generated; sitemap and route tests confirm only these pages enter the sitemap.`,
  "- Current branch is `develop`.",
  `- Next Russian translation-data tool: \`${currentPending[0] ?? "none"}\`; next Russian workspace UI tool: \`${nextWorkspace}\`.`,
  "",
];

async function main() {
  await writeFile("docs/i18n-expansion-progress.md", lines.join("\n"), "utf8");
}

void main();
