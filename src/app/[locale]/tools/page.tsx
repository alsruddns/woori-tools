import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolDirectory } from "@/components/tool/tool-directory";
import { getMessages } from "@/i18n/messages";
import { isLocale, localizePath, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { getLocalizedCategories } from "@/registry/category-translations";
import { localizeTools } from "@/registry/tool-translations";
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
  const categories = getLocalizedCategories(locale).filter((category) => tools.some((tool) => tool.category === category.id));
  const orderedTools = localizeTools(tools, locale);
  const featured = orderedTools.filter((tool) => tool.featured);

  return (
    <main className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-cyan-50 px-6 py-10 sm:px-12 sm:py-14">
        <p className="font-semibold text-indigo-700">{messages.homeEyebrow}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{messages.homeTitle}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{messages.homeDescription}</p>
        <ToolDirectory tools={orderedTools} locale={locale} />
      </section>

      <section className="py-10 sm:py-12" aria-labelledby="recommended-tools">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="recommended-tools" className="text-2xl font-bold text-slate-950">{messages.recommendedTools}</h2>
            <p className="mt-2 text-slate-600">{messages.recommendedDescription}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {featured.map((tool) => <ToolCard key={tool.slug} locale={locale} tool={tool} categoryName={categories.find((item) => item.id === tool.category)?.name ?? ""} />)}
        </div>
      </section>

      {categories.map((category) => {
        const categoryTools = orderedTools.filter((tool) => tool.category === category.id);
        return <section key={category.id} id={`category-${category.id}`} className="scroll-mt-24 border-t border-slate-200 py-9 sm:py-11" aria-labelledby={`heading-${category.id}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id={`heading-${category.id}`} className="text-2xl font-bold text-slate-950">{category.name}</h2>
              <p className="mt-1 text-sm text-slate-600">{category.description}</p>
            </div>
            <Link href={localizePath(locale, `/tools/category/${category.id}`)} className="rounded-lg px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">{messages.viewAll}</Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {categoryTools.slice(0, 6).map((tool) => <ToolCard key={tool.slug} locale={locale} tool={tool} categoryName={category.name} />)}
          </div>
        </section>;
      })}

      <details className="border-t border-slate-200 py-8">
        <summary className="cursor-pointer rounded-xl py-3 text-xl font-bold text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">{messages.allTools} <span className="text-base font-normal text-slate-500">({tools.length})</span></summary>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {orderedTools.map((tool) => <ToolCard key={tool.slug} locale={locale} tool={tool} categoryName={categories.find((item) => item.id === tool.category)?.name ?? ""} />)}
        </div>
      </details>
      <p className="mt-4 rounded-2xl bg-emerald-50 p-5 text-sm text-emerald-900">{messages.filePrivacy}</p>
    </main>
  );
}

function ToolCard({ locale, tool, categoryName }: { locale: Locale; tool: (typeof tools)[number]; categoryName: string }) {
  return (
    <Link href={localizePath(locale, `/tools/${tool.slug}`)} className="group block min-h-28 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
      <span className="text-xs font-semibold text-indigo-700">{categoryName}</span>
      <h3 className="mt-1 font-semibold text-slate-900 group-hover:text-indigo-800">{tool.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p>
    </Link>
  );
}
