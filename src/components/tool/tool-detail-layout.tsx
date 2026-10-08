import { ToolNavigationShell, type NavigationSection } from "@/components/tool/tool-navigation-shell";
import { getMessages } from "@/i18n/messages";
import type { Locale } from "@/i18n/routing";
import { getLocalizedCategories } from "@/registry/category-translations";
import { localizeTools } from "@/registry/tool-translations";
import { tools } from "@/registry/tools";

export function ToolDetailLayout({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  const messages = getMessages(locale);
  const localizedTools = localizeTools(tools, locale);
  const sections: NavigationSection[] = getLocalizedCategories(locale)
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
