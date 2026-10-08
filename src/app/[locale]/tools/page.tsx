import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolDirectory } from "@/components/tool/tool-directory";
import { getMessages } from "@/i18n/messages";
import { isLocale, localizePath, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { getLocalizedCategories } from "@/registry/category-translations";
import { localizeTool, localizeTools } from "@/registry/tool-translations";
import { tools } from "@/registry/tools";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const messages = getMessages(rawLocale);
  return pageMetadata({ locale: rawLocale, path: "/tools", title: messages.homeEyebrow, description: messages.homeDescription, keywords: ["online tools", "image", "PDF", "text"] });
}

export default async function ToolsHomePage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const messages = getMessages(locale);
  const localizedTools = localizeTools(tools, locale);
  const popularSlugs = ["jpg-to-png", "image-compress", "pdf-merge", "character-count", "json-formatter", "uuid-generator"];
  const popular = popularSlugs.map((slug) => localizeTool(tools.find((tool) => tool.slug === slug)!, locale));
  const categories = getLocalizedCategories(locale).filter((category) => tools.some((tool) => tool.category === category.id));
  const categoryOrder = new Map(categories.map((category, index) => [category.id, index]));
  const orderedTools = [...localizedTools].sort((a, b) => (categoryOrder.get(a.category) ?? Number.MAX_SAFE_INTEGER) - (categoryOrder.get(b.category) ?? Number.MAX_SAFE_INTEGER));

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-cyan-50 px-6 py-12 sm:px-12 sm:py-16">
        <p className="font-semibold text-indigo-700">{messages.homeEyebrow}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{messages.homeTitle}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{messages.homeDescription}</p>
        <ToolDirectory tools={orderedTools} locale={locale} />
      </section>

      <section className="py-12">
        <h2 className="text-2xl font-bold">{messages.popularTools}</h2>
        <p className="mt-2 text-slate-600">{messages.popularDescription}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((tool) => <ToolCard key={tool.slug} locale={locale} tool={tool} />)}
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-2xl font-bold">{messages.categories}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} href={localizePath(locale, `/tools/category/${category.id}`)} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm">
              <span className="font-semibold">{category.name}</span>
              <span className="mt-2 block text-sm text-slate-500">{messages.toolCount.replace("{count}", String(tools.filter((tool) => tool.category === category.id).length))}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-2xl font-bold">{messages.allTools}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orderedTools.map((tool) => <ToolCard key={tool.slug} locale={locale} tool={tool} />)}
        </div>
      </section>
      <p className="mt-8 rounded-2xl bg-emerald-50 p-5 text-sm text-emerald-900">{messages.filePrivacy}</p>
    </main>
  );
}

function ToolCard({ locale, tool }: { locale: Locale; tool: (typeof tools)[number] }) {
  return (
    <Link href={localizePath(locale, `/tools/${tool.slug}`)} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm">
      <h3 className="font-semibold text-slate-900">{tool.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p>
    </Link>
  );
}
