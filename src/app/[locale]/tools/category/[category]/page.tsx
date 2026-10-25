import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n/messages";
import { isLocale, isPlannedLocale, localizePath, plannedLocaleConfig, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { findLocalizedCategory } from "@/registry/category-translations";
import { localizeTools } from "@/registry/tool-translations";
import { categories } from "@/registry/categories";
import { tools } from "@/registry/tools";
import { isExpandedLocale, getTargetCategoryName, getTargetCategoryDescription } from "@/registry/target-category-translations";
import { targetLocalePublication } from "@/registry/target-locale-publication";
import { getTargetToolTranslation } from "@/registry/target-tool-translation";

type Props = { params: Promise<{ locale: string; category: string }> };

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  if (isPlannedLocale(params.locale) && isExpandedLocale(params.locale)) {
    const visibleCategories = targetLocalePublication[params.locale].publishedToolSlugs.map((slug) => tools.find((tool) => tool.slug === slug)?.category).filter((category): category is NonNullable<typeof category> => category !== undefined);
    return [...new Set(visibleCategories)].map((category) => ({ category }));
  }
  return categories
    .filter((category) => tools.some((tool) => tool.category === category.id))
    .map(({ id }) => ({ category: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, category: id } = await params;
  if (isPlannedLocale(rawLocale) && isExpandedLocale(rawLocale)) {
    if (!categories.some((category) => category.id === id)) return {};
    const categoryTools = targetLocalePublication[rawLocale].publishedToolSlugs.filter((slug) => tools.find((tool) => tool.slug === slug)?.category === id);
    if (!categoryTools.length) return {};
    const categoryName = getTargetCategoryName(rawLocale, id as (typeof categories)[number]["id"]);
    return pageMetadata({ locale: rawLocale, path: `/tools/category/${id}`, title: getMessages(rawLocale).categoryHeading.replace("{category}", categoryName), description: getTargetCategoryDescription(rawLocale, id as (typeof categories)[number]["id"]), keywords: [categoryName, "online tools"], supportedLocales: plannedLocaleConfig.slice(3).map(({ routeLocale }) => routeLocale) });
  }
  if (!isLocale(rawLocale)) return {};
  const category = findLocalizedCategory(id, rawLocale);
  if (!category) return {};
  const messages = getMessages(rawLocale);
  const title = messages.categoryHeading.replace("{category}", category.name);
  return pageMetadata({ locale: rawLocale, path: `/tools/category/${id}`, title, description: category.description, keywords: [category.name, "online tools"] });
}

export default async function CategoryPage({ params }: Props) {
  const { locale: rawLocale, category: id } = await params;
  if (isPlannedLocale(rawLocale) && isExpandedLocale(rawLocale)) {
    const categoryRecord = categories.find((item) => item.id === id);
    const targetSlugs = targetLocalePublication[rawLocale].publishedToolSlugs.filter((slug) => tools.find((tool) => tool.slug === slug)?.category === id);
    if (!categoryRecord || !targetSlugs.length) notFound();
    const messages = getMessages(rawLocale);
    const categoryName = getTargetCategoryName(rawLocale, categoryRecord.id);
    const list = targetSlugs.map((slug) => {
      const definition = tools.find((tool) => tool.slug === slug);
      const translation = getTargetToolTranslation(rawLocale, slug);
      if (!definition || !translation) return undefined;
      return { slug, title: translation.title, description: translation.description };
    }).filter((tool): tool is { slug: string; title: string; description: string } => tool !== undefined);
    return <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"><nav aria-label={messages.breadcrumb} className="mb-6 text-sm text-slate-500"><Link href={localizePath(rawLocale, "/tools")} className="hover:text-indigo-700">{messages.tools}</Link><span aria-hidden="true"> / </span>{categoryName}</nav><h1 className="text-3xl font-bold">{messages.categoryHeading.replace("{category}", categoryName)}</h1><p className="mt-3 text-slate-600">{getTargetCategoryDescription(rawLocale, categoryRecord.id)}</p><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((tool) => <Link key={tool.slug} href={localizePath(rawLocale, `/tools/${tool.slug}`)} className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-300"><h2 className="font-semibold">{tool.title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p></Link>)}</div></main>;
  }
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const category = findLocalizedCategory(id, locale);
  const list = localizeTools(tools.filter((tool) => tool.category === id && tool.supportedLocales.includes(locale)), locale);
  if (!list.length) notFound();
  if (!category || !list.length) notFound();
  const messages = getMessages(locale);
  const title = messages.categoryHeading.replace("{category}", category.name);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <nav aria-label={messages.breadcrumb} className="mb-6 text-sm text-slate-500">
        <Link href={localizePath(locale, "/tools")} className="hover:text-indigo-700">{messages.tools}</Link>
        <span aria-hidden="true"> / </span>{category.name}
      </nav>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-3 text-slate-600">{category.description}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((tool) => (
          <Link key={tool.slug} href={localizePath(locale, `/tools/${tool.slug}`)} className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-300">
            <h2 className="font-semibold">{tool.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
