import { writeFile } from "node:fs/promises";
import { plannedLocaleConfig } from "../src/i18n/routing";
import { tools } from "../src/registry/tools";
import { targetLotterySlugs, getTargetLotteryTranslation } from "../src/registry/target-lottery-translations";
import { targetRussianToolSlugs, getTargetRussianToolTranslation } from "../src/registry/target-ru-translations";

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
const publishedLocales = ["ko", "en", "ja", "zh", "es", "pt-br", "de", "fr", "vi", "id", "th", "zh-tw", "it", "nl", "hi"];
const lines = [
  "# Woori Tools 26-language localization progress",
  "",
  `Updated from the translation source modules. Public tool count: ${slugs.length}. Target locales: ${plannedLocaleConfig.length}.`,
  `Published locales: ${publishedLocales.join(", ")}. Target locales remain unpublished until their full page and UI coverage is verified.`,
  "",
  "## Per-locale status",
  "",
  "| Locale | Authored tool bundles | Pending tools | Next tool | Published |",
  "| --- | ---: | ---: | --- | --- |",
  ...plannedLocaleConfig.map(({ routeLocale }) => {
    const done = completeByLocale[routeLocale];
    const pending = slugs.filter((slug) => !done.includes(slug));
    return `| ${routeLocale} | ${done.length}/${slugs.length} | ${pending.length} | ${pending[0] ?? "—"} | No |`;
  }),
  "",
  "## Translation coverage",
  "",
  `- Existing authored lottery bundle slugs: ${targetLotterySlugs.join(", ")}`,
  `- Additional Russian bundle slugs: ${targetRussianToolSlugs.join(", ")}`,
  `- Russian completed tool bundles: ${currentComplete.length}/${slugs.length}`,
  `- Russian next tool: ${currentPending[0] ?? "none"}`,
  "- New-locale UI messages: 24 shared core keys per locale; remaining site and workspace strings are not complete.",
  "- New locales published or indexed: none.",
  "",
  "## Remaining Russian tools",
  "",
  ...currentPending.map((slug) => `- ${slug}`),
  "",
  "## Last verified checkpoint",
  "",
  "- TypeScript, lint, and all 90 tests passed after the latest authored translation data update.",
  "- Production build passed and generated 2,809 static pages; this count is unchanged because target locales remain unpublished.",
  "- Current work is on `develop`; publish only after full Russian tool, workspace, shared UI, and SEO coverage passes.",
  "- Next starting tool: `random-wheel`.",
  "",
];

async function main() {
  await writeFile("docs/i18n-expansion-progress.md", lines.join("\n"), "utf8");
}

void main();
