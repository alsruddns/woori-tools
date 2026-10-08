import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n/messages";
import { isLocale, localizePath, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { findLocalizedCategory } from "@/registry/category-translations";
import { localizeTools } from "@/registry/tool-translations";
import { categories } from "@/registry/categories";
import { tools } from "@/registry/tools";

type Props = { params: Promise<{ locale: string; category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return categories
    .filter((category) => tools.some((tool) => tool.category === category.id))
    .map(({ id }) => ({ category: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, category: id } = await params;
  if (!isLocale(rawLocale)) return {};
  const category = findLocalizedCategory(id, rawLocale);
  if (!category) return {};
  const messages = getMessages(rawLocale);
  const title = messages.categoryHeading.replace("{category}", category.name);
  return pageMetadata({ locale: rawLocale, path: `/tools/category/${id}`, title, description: category.description, keywords: [category.name, "online tools"] });
}

export default async function CategoryPage({ params }: Props) {
  const { locale: rawLocale, category: id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const category = findLocalizedCategory(id, locale);
  const list = localizeTools(tools.filter((tool) => tool.category === id), locale);
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
