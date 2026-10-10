import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolWorkspace } from "@/components/tool/tool-workspace";
import { ToolDetailLayout } from "@/components/tool/tool-detail-layout";
import { getMessages } from "@/i18n/messages";
import { isLocale, localizePath, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { findLocalizedCategory } from "@/registry/category-translations";
import { localizeTool, localizeTools } from "@/registry/tool-translations";
import { getTool, tools } from "@/registry/tools";
import { getToolContent } from "@/registry/tool-content";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const tool = getTool(slug);
  if (!tool) return {};
  const localized = localizeTool(tool, rawLocale);
  const seoTitle = rawLocale === "ko" && slug === "lotto-number-generator" ? "로또 번호 추첨기 | 로또 번호 생성기"
    : rawLocale === "ko" && slug === "powerball-number-generator" ? "파워볼 번호 추첨기 | Powerball 번호 생성기"
    : rawLocale === "ko" && slug === "mega-millions-number-generator" ? "메가밀리언 번호 추첨기 | Mega Millions 번호 생성기"
    : rawLocale === "ko" && slug === "japan-loto6-number-generator" ? "일본 로또6 번호 추첨기 | LOTO 6 번호 생성기"
    : rawLocale === "ko" && slug === "japan-loto7-number-generator" ? "일본 로또7 번호 추첨기 | LOTO 7 번호 생성기"
    : rawLocale === "ko" && slug === "japan-mini-loto-number-generator" ? "일본 미니로또 번호 추첨기 | MINI LOTO 번호 생성기"
    : localized.title;
  return pageMetadata({ locale: rawLocale, path: `/tools/${slug}`, title: seoTitle, description: localized.description, keywords: localized.keywords });
}

export default async function ToolPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const baseTool = getTool(slug);
  if (!baseTool) notFound();

  const tool = localizeTool(baseTool, locale);
  const category = findLocalizedCategory(tool.category, locale);
  if (!category) notFound();
  const messages = getMessages(locale);
  const seoContent = getToolContent(slug, locale);
  const related = (baseTool.relatedTools ?? []).map((id) => getTool(id)).filter((item) => item !== undefined);
  const localizedTools = localizeTools(related, locale);
  const usesFiles = tool.category === "image" || tool.category === "pdf";
  const url = `https://www.woori.today/${locale}/tools/${slug}`;

  return <ToolDetailLayout locale={locale}>
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label={messages.breadcrumb} className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link href={localizePath(locale, "/tools")} className="hover:text-indigo-700">{messages.tools}</Link>
        <span aria-hidden="true">/</span>
        <Link href={localizePath(locale, `/tools/category/${category.id}`)} className="hover:text-indigo-700">{category.name}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="text-slate-700">{tool.shortTitle}</span>
      </nav>

      <header className="mb-7">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{tool.title}</h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">{tool.description}</p>
        {tool.usesFileInput && <p className="mt-3 text-sm text-emerald-800">🔒 {messages.filePrivacy}</p>}
      </header>

      <ToolWorkspace key={`${locale}-${tool.slug}`} tool={tool} locale={locale} messages={messages} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: tool.title,
        description: tool.description,
        url,
        inLanguage: locale,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
      }).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: messages.tools, item: `https://www.woori.today/${locale}/tools` },
          { "@type": "ListItem", position: 2, name: category.name, item: `https://www.woori.today/${locale}/tools/category/${category.id}` },
          { "@type": "ListItem", position: 3, name: tool.shortTitle, item: url },
        ],
      }).replace(/</g, "\\u003c") }} />

      {seoContent ? <section className="mt-12 space-y-8">
        <article>
          <h2 className="text-2xl font-bold">{seoContent.headings.overview}</h2>
          <p className="mt-3 leading-7 text-slate-700">{seoContent.overview}</p>
        </article>
        <article>
          <h2 className="text-2xl font-bold">{seoContent.headings.how}</h2>
          <ol className="mt-4 list-inside list-decimal space-y-2 text-slate-700">{seoContent.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        </article>
        <article><h2 className="text-xl font-bold">{seoContent.headings.example}</h2><p className="mt-2 leading-7 text-slate-700">{seoContent.example}</p></article>
        <article><h2 className="text-xl font-bold">{seoContent.headings.options}</h2><p className="mt-2 leading-7 text-slate-700">{seoContent.options}</p></article>
        <article><h2 className="text-xl font-bold">{seoContent.headings.privacy}</h2><p className="mt-2 rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">{seoContent.headings.privacyAnswer}</p></article>
        <article><h2 className="text-xl font-bold">{seoContent.headings.warning}</h2><p className="mt-2 leading-7 text-slate-700">{seoContent.caution}</p></article>
      </section> : <section className="mt-12">
        <h2 className="text-2xl font-bold">{messages.howTo}</h2>
        <ol className="mt-4 list-inside list-decimal space-y-2 text-slate-700">
          <li>{tool.description}</li>
          <li>{usesFiles ? messages.fileStep : messages.textStep}</li>
          <li>{messages.optionsStep}</li>
          <li>{messages.resultStep}</li>
        </ol>
        <h2 className="mt-9 text-2xl font-bold">{messages.introduction}</h2>
        <p className="mt-3 leading-7 text-slate-700">{tool.description} {messages.introPrivacy}</p>
        <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">{messages.privacyNotice}</p>
      </section>}

      <section className="mt-10">
        <h2 className="text-2xl font-bold">{seoContent?.headings.faq ?? messages.faq}</h2>
        <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200">
          {(seoContent ? [
            [seoContent.headings.privacyQuestion, seoContent.headings.privacyAnswer],
            [seoContent.headings.example, seoContent.example],
            [seoContent.headings.options, `${seoContent.options} ${seoContent.caution}`],
          ] : [messages.freeQuestion, messages.privacyQuestion, messages.sizeQuestion].map((question, index) => [question, index === 0 ? tool.description : index === 1 ? messages.privacyAnswer : messages.sizeAnswer])).map(([question, answer], index) => (
            <details key={question} className="group p-4" open={index === 0}>
              <summary className="cursor-pointer font-medium">{question}</summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      {localizedTools.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold">{messages.relatedTools}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {localizedTools.map((item) => (
              <Link key={item.slug} href={localizePath(locale, `/tools/${item.slug}`)} className="rounded-xl border border-slate-200 p-4 hover:border-indigo-300">
                <span className="font-semibold">{item.title}</span>
                <span className="mt-1 block text-sm text-slate-600">{item.description}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  </ToolDetailLayout>;
}
