import { notFound } from "next/navigation";
import { ToolNavigationShell, type NavigationSection } from "@/components/tool/tool-navigation-shell";
import { getMessages } from "@/i18n/messages";
import { isLocale, type Locale } from "@/i18n/routing";
import { getLocalizedCategories } from "@/registry/category-translations";
import { localizeTools } from "@/registry/tool-translations";
import { tools } from "@/registry/tools";

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export default async function ToolsLayout({ children, params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const messages = getMessages(locale);
  const localizedTools = localizeTools(tools, locale);
  const sections: NavigationSection[] = getLocalizedCategories(locale)
    .map((category) => ({
      id: category.id,
      name: category.name,
      tools: localizedTools.filter((tool) => tool.category === category.id).map(({ slug, title, description, keywords }) => ({ slug, title, description, keywords })),
    }))
    .filter((section) => section.tools.length > 0);

  return <ToolNavigationShell
    locale={locale}
    sections={sections}
    searchLabel={messages.sidebarSearch}
    noResults={messages.sidebarNoResults}
    openLabel={messages.openToolMenu}
    closeLabel={messages.closeToolMenu}
    adLabel={messages.adPlaceholder}
  >{children}</ToolNavigationShell>;
}
