import type { PlannedLocale } from "@/i18n/routing";
import { getTargetFilipinoToolTranslation } from "./target-fil-translations";
import { getTargetLotteryTranslation } from "./target-lottery-translations";
import { getTargetPolishToolTranslation } from "./target-pl-translations";
import { getTargetRussianToolTranslation } from "./target-ru-translations";
import { getTargetSevenToolTranslation, isSevenTargetLocale } from "./target-seven-tools-translations";
import { getTargetTurkishToolTranslation } from "./target-tr-translations";
import type { ToolDefinition } from "./tools";

export type TargetToolTranslation = {
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  category?: string;
  keywords: string[];
  steps: readonly [string, string, string];
  example: string;
  options: string;
  caution: string;
  faq: { example: string; caution: string };
};

/** Resolve authored target-locale tool content through one shared lookup. */
export function getTargetToolTranslation(locale: PlannedLocale, slug: string): TargetToolTranslation | undefined {
  const translation = locale === "ru"
    ? getTargetRussianToolTranslation(slug) ?? getTargetLotteryTranslation(locale, slug)
    : locale === "tr"
      ? getTargetTurkishToolTranslation(slug) ?? getTargetLotteryTranslation(locale, slug)
      : locale === "pl"
        ? getTargetPolishToolTranslation(slug) ?? getTargetLotteryTranslation(locale, slug)
        : locale === "fil"
          ? getTargetFilipinoToolTranslation(slug) ?? getTargetLotteryTranslation(locale, slug)
          : isSevenTargetLocale(locale)
            ? getTargetSevenToolTranslation(locale, slug) ?? getTargetLotteryTranslation(locale, slug)
            : undefined;

  return translation;
}

export function localizeTargetTool(tool: ToolDefinition, locale: PlannedLocale): ToolDefinition {
  const translation = getTargetToolTranslation(locale, tool.slug);
  if (!translation) throw new Error(`Missing ${locale} tool translation for ${tool.slug}`);
  return {
    ...tool,
    title: translation.title,
    shortTitle: translation.title,
    description: translation.description,
    keywords: [...translation.keywords],
    supportedLocales: [...tool.supportedLocales, locale],
  };
}
