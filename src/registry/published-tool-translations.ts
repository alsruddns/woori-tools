import type { PublishedTargetLocale } from "@/i18n/routing";
import { getTargetRussianToolTranslation } from "./target-ru-translations";
import { localizeTool } from "./tool-translations";
import type { ToolDefinition } from "./tools";

export function localizePublishedTool(tool: ToolDefinition, locale: PublishedTargetLocale): ToolDefinition {
  if (locale !== "ru") return localizeTool(tool, locale);
  const translation = getTargetRussianToolTranslation(tool.slug);
  if (!translation) throw new Error(`Missing Russian translation for ${tool.slug}`);
  return {
    ...tool,
    title: translation.title,
    shortTitle: translation.title,
    description: translation.description,
    keywords: translation.keywords,
  };
}
