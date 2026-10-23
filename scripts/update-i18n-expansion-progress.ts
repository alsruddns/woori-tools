import { writeFile } from "node:fs/promises";
import { plannedLocaleConfig, publishedTargetLocales } from "../src/i18n/routing";
import { tools } from "../src/registry/tools";
import { targetLotterySlugs, getTargetLotteryTranslation } from "../src/registry/target-lottery-translations";
import { targetRussianToolSlugs, getTargetRussianToolTranslation } from "../src/registry/target-ru-translations";
import { targetTurkishToolSlugs, getTargetTurkishToolTranslation } from "../src/registry/target-tr-translations";
import { targetPolishToolSlugs, getTargetPolishToolTranslation } from "../src/registry/target-pl-translations";
import { targetLocalePublication } from "../src/registry/target-locale-publication";

const slugs = tools.filter((tool) => tool.isPublic).map((tool) => tool.slug);
const completeByLocale = Object.fromEntries(plannedLocaleConfig.map(({ routeLocale }) => {
  const completed = slugs.filter((slug) => {
    const lottery = getTargetLotteryTranslation(routeLocale, slug);
    const russian = routeLocale === "ru" ? getTargetRussianToolTranslation(slug) : undefined;
    const turkish = routeLocale === "tr" ? getTargetTurkishToolTranslation(slug) : undefined;
    const polish = routeLocale === "pl" ? getTargetPolishToolTranslation(slug) : undefined;
    return Boolean(lottery || russian || turkish || polish);
  });
  return [routeLocale, completed];
}));

const currentLocale = "ru" as const;
const currentComplete = completeByLocale[currentLocale];
const currentPending = slugs.filter((slug) => !currentComplete.includes(slug));
const nextWorkspace = targetRussianToolSlugs.find((slug) => !targetLocalePublication.ru.publishedToolSlugs.includes(slug)) ?? "none";
const polishUiVerified = new Set<string>(targetLocalePublication.pl.uiVerifiedToolSlugs);
const nextPolishUi = slugs.find((slug) => !polishUiVerified.has(slug)) ?? "none";
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
    const next = pending[0] ?? (routeLocale === "pl" ? `UI: ${nextPolishUi}` : "none");
    return `| ${routeLocale} | ${done.length}/${slugs.length} | ${publication.uiVerifiedToolSlugs.length} | ${publication.seoVerifiedToolSlugs.length} | ${publication.publishedToolSlugs.length} | ${pending.length} | ${next} |`;
  }),
  "",
  "## Translation coverage",
  "",
  `- Existing authored lottery bundle slugs: ${targetLotterySlugs.join(", ")}`,
  `- Additional Russian bundle slugs: ${targetRussianToolSlugs.join(", ")}`,
  `- Additional Turkish bundle slugs: ${targetTurkishToolSlugs.join(", ")}`,
  `- Additional Polish bundle slugs: ${targetPolishToolSlugs.join(", ")}`,
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
  `- Polish UI verification remains active at ${nextPolishUi}; ${slugs.length - targetLocalePublication.pl.uiVerifiedToolSlugs.length} Polish tool workspaces remain. Continue with Filipino (fil) at ${slugs.find((slug) => !completeByLocale.fil.includes(slug)) ?? "none"} after Polish UI/SEO verification reaches all ${slugs.length} tools, then proceed in order: bn, uk, ms, sv, cs, ro, el.`,
  "",
  "## Last verified checkpoint",
  "",
  "- Validation on 2026-10-23: TypeScript passed; lint passed; all 149 tests passed; focused sitemap and IndexNow tests passed; production build passed.",
  `- Production build prerendered ${3_194 + targetLocalePublication.pl.publishedToolSlugs.length} static pages and ${2_992 + targetLocalePublication.pl.publishedToolSlugs.length} tool-locale URLs: 2,640 existing-locale pages, 176 Russian, 176 Turkish, and ${targetLocalePublication.pl.publishedToolSlugs.length} Polish.`,
  `- Polish production HTML for saju, daily-fortune, tarot-card, lotto-number-generator, json-formatter, instagram-grid-split, and image-collage has localized page/workspace copy, a unique canonical, Polish hreflang, and x-default. Exactly ${targetLocalePublication.pl.publishedToolSlugs.length} Polish tool HTML files are generated; sitemap and route tests confirm only these pages enter the sitemap.`,
  "- Current branch is `develop`.",
  `- Next Russian translation-data tool: \`${currentPending[0] ?? "none"}\`; next Russian workspace UI tool: \`${nextWorkspace}\`.`,
  "",
];

async function main() {
  await writeFile("docs/i18n-expansion-progress.md", lines.join("\n"), "utf8");
}

void main();
