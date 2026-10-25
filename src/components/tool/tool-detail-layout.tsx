import { ToolNavigationShell, type NavigationSection } from "@/components/tool/tool-navigation-shell";
import { getMessages } from "@/i18n/messages";
import { isPlannedLocale, type PublishedTargetLocale } from "@/i18n/routing";
import { getLocalizedCategories } from "@/registry/category-translations";
import { localizeTools } from "@/registry/tool-translations";
import { getTool, tools } from "@/registry/tools";
import { targetLocalePublication } from "@/registry/target-locale-publication";
import { isExpandedLocale, getTargetCategories } from "@/registry/target-category-translations";
import { localizeTargetTool } from "@/registry/target-tool-translation";
import { localizePublishedTool } from "@/registry/published-tool-translations";
import { isLocale } from "@/i18n/routing";

export function ToolDetailLayout({ children, locale }: { children: React.ReactNode; locale: PublishedTargetLocale }) {
  const messages = getMessages(locale);
  const targetLocale = isPlannedLocale(locale) ? locale : undefined;
  const visibleTools = targetLocale
    ? targetLocalePublication[targetLocale].publishedToolSlugs.map((slug) => getTool(slug)).filter((tool): tool is (typeof tools)[number] => tool !== undefined)
    : tools.filter((tool) => tool.supportedLocales.includes(locale));
  const localizedTools = targetLocale
    ? isExpandedLocale(targetLocale)
      ? visibleTools.map((tool) => localizeTargetTool(tool, targetLocale))
      : visibleTools.map((tool) => localizePublishedTool(tool, targetLocale))
    : isLocale(locale) ? localizeTools(visibleTools, locale) : [];
  const categories = targetLocale && isExpandedLocale(targetLocale)
    ? getTargetCategories(targetLocale, [...new Set(localizedTools.map((tool) => tool.category))])
    : getLocalizedCategories(locale);
  const sections: NavigationSection[] = categories
    .map((category) => ({
      id: category.id,
      name: category.name,
      tools: localizedTools
        .filter((tool) => tool.category === category.id)
        .map(({ slug, title, description, keywords }) => ({ slug, title, description, keywords })),
    }))
    .filter((section) => section.tools.length > 0);

  return <ToolNavigationShell
    locale={locale}
    sections={sections}
    searchLabel={messages.sidebarSearch}
    noResults={messages.sidebarNoResults}
    openLabel={messages.openToolMenu}
    closeLabel={messages.closeToolMenu}
    adLabel={process.env.NEXT_PUBLIC_ADS_ENABLED === "true" ? messages.adPlaceholder : ""}
  >{children}</ToolNavigationShell>;
}
