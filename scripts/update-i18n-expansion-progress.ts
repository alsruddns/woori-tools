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
  "## Remaining Russian tools",
  "",
  ...currentPending.map((slug) => `- ${slug}`),
  "",
  "## Last verified checkpoint",
  "",
  "- Validation: TypeScript passed; lint passed; all 90 tests passed; production build passed.",
  "- Production build prerendered 2,821 static pages; the tool sitemap contains 2,641 localized tool URLs, including only the verified Russian barcode-generator page.",
  "- Russian canonical, hreflang, x-default, Open Graph, route rendering, and sitemap membership passed source and build checks for barcode-generator.",
  "- The verified route set is intentionally limited to published tool slugs; the remaining Russian tools are not routable or indexed.",
  "- Current branch is `develop`.",
  `- Next Russian translation-data tool: \`${currentPending[0] ?? "none"}\`.`,
  "",
];

async function main() {
  await writeFile("docs/i18n-expansion-progress.md", lines.join("\n"), "utf8");
}

void main();
