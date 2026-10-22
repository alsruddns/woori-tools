import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolWorkspace } from "@/components/tool/tool-workspace";
import { BarcodeWorkspace } from "@/components/tool/barcode-workspace";
import { RussianMarkdownWorkspace } from "@/components/tool/russian-markdown-workspace";
import { CountdownWorkspace } from "@/components/tool/countdown-workspace";
import { ToolDetailLayout } from "@/components/tool/tool-detail-layout";
import { getMessages } from "@/i18n/messages";
import { isLocale, localizePath, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { findLocalizedCategory } from "@/registry/category-translations";
import { localizeTool, localizeTools } from "@/registry/tool-translations";
import { getTool, tools } from "@/registry/tools";
import { getToolContent, getToolStorageNote } from "@/registry/tool-content";
import { getFileGuidance } from "@/registry/file-guidance";
import { getToolFaqQuestions } from "@/registry/tool-faq";
import { localizePublishedTool } from "@/registry/published-tool-translations";
import { getTargetRussianToolTranslation } from "@/registry/target-ru-translations";
import { targetLocalePublication } from "@/registry/target-locale-publication";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  if (params.locale === "ru") return targetLocalePublication.ru.publishedToolSlugs.map((slug) => ({ slug }));
  return tools.filter(({ supportedLocales }) => supportedLocales.includes(params.locale as Locale)).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (rawLocale === "ru") {
    const tool = getTool(slug);
    const translation = getTargetRussianToolTranslation(slug);
    if (!tool || !tool.supportedLocales.includes("ru") || !translation) return {};
    return pageMetadata({ locale: "ru", path: `/tools/${slug}`, title: translation.seoTitle, description: translation.seoDescription, keywords: translation.keywords, supportedLocales: tool.supportedLocales });
  }
  if (!isLocale(rawLocale)) return {};
  const tool = getTool(slug);
  if (!tool || !tool.supportedLocales.includes(rawLocale)) return {};
  const localized = localizeTool(tool, rawLocale);
  const seoTitle = rawLocale === "ko" && slug === "lotto-number-generator" ? "로또 번호 추첨기 | 로또 번호 생성기"
    : rawLocale === "ko" && slug === "powerball-number-generator" ? "파워볼 번호 추첨기 | Powerball 번호 생성기"
    : rawLocale === "ko" && slug === "mega-millions-number-generator" ? "메가밀리언 번호 추첨기 | Mega Millions 번호 생성기"
    : rawLocale === "ko" && slug === "japan-loto6-number-generator" ? "일본 로또6 번호 추첨기 | LOTO 6 번호 생성기"
    : rawLocale === "ko" && slug === "japan-loto7-number-generator" ? "일본 로또7 번호 추첨기 | LOTO 7 번호 생성기"
    : rawLocale === "ko" && slug === "japan-mini-loto-number-generator" ? "일본 미니로또 번호 추첨기 | MINI LOTO 번호 생성기"
    : localized.title;
  return pageMetadata({ locale: rawLocale, path: `/tools/${slug}`, title: seoTitle, description: localized.description, keywords: localized.keywords, supportedLocales: tool.supportedLocales });
}

export default async function ToolPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  if (rawLocale === "ru") return <RussianPublishedToolPage slug={slug} />;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const baseTool = getTool(slug);
  if (!baseTool || !baseTool.supportedLocales.includes(locale)) notFound();

  const tool = localizeTool(baseTool, locale);
  const category = findLocalizedCategory(tool.category, locale);
  if (!category) notFound();
  const messages = getMessages(locale);
  const seoContent = getToolContent(slug, locale, tool.description, tool.title, tool.category);
  if (!seoContent) throw new Error(`Missing editorial content for ${locale}/${slug}`);
  const fileGuidance = getFileGuidance(tool, locale);
  const storageNote = getToolStorageNote(slug, locale);
  const faqQuestions = getToolFaqQuestions(locale, tool.title);
  const related = (baseTool.relatedTools ?? []).map((id) => getTool(id)).filter((item): item is NonNullable<typeof item> => item !== undefined && item.supportedLocales.includes(locale));
  const localizedTools = localizeTools(related, locale);
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
      </header>

      <ToolWorkspace key={`${locale}-${tool.slug}`} tool={tool} phaseLocale={locale} messages={messages} />

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

      <section className="mt-12 space-y-8">
        {seoContent.overview !== tool.description && <article>
          <h2 className="text-2xl font-bold">{seoContent.headings.overview}</h2>
          <p className="mt-3 leading-7 text-slate-700">{seoContent.overview}</p>
        </article>}
        <article>
          <h2 className="text-2xl font-bold">{seoContent.headings.how}</h2>
          <ol className="mt-4 list-inside list-decimal space-y-2 text-slate-700">{seoContent.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        </article>
        <article><h2 className="text-xl font-bold">{seoContent.headings.example}</h2><p className="mt-2 leading-7 text-slate-700">{seoContent.example}</p></article>
        <article><h2 className="text-xl font-bold">{seoContent.headings.options}</h2><p className="mt-2 leading-7 text-slate-700">{seoContent.options}</p>
          {fileGuidance && <ul className="mt-3 list-inside list-disc space-y-1 text-sm leading-6 text-slate-600">
            <li>{fileGuidance.types}</li><li>{fileGuidance.limit}</li><li>{fileGuidance.result}</li>
          </ul>}
        </article>
        <article><h2 className="text-xl font-bold">{seoContent.headings.privacy}</h2><p className="mt-2 rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">{seoContent.headings.privacyAnswer} {storageNote && <span className="mt-2 block">{storageNote}</span>} <Link href={localizePath(locale, "/privacy")} className="font-semibold underline underline-offset-2">{messages.privacy}</Link></p></article>
        <article><h2 className="text-xl font-bold">{seoContent.headings.warning}</h2><p className="mt-2 leading-7 text-slate-700">{seoContent.caution}</p></article>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">{seoContent.headings.faq}</h2>
        <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200">
          {([
            [faqQuestions.example, seoContent.example],
            [faqQuestions.caution, seoContent.caution],
          ] as const).map(([question, answer], index) => (
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

function RussianPublishedToolPage({ slug }: { slug: string }) {
  const baseTool = getTool(slug);
  const translation = getTargetRussianToolTranslation(slug);
  const uiVerified = targetLocalePublication.ru.uiVerifiedToolSlugs.includes(slug);
  const seoVerified = targetLocalePublication.ru.seoVerifiedToolSlugs.includes(slug);
  const published = targetLocalePublication.ru.publishedToolSlugs.includes(slug);
  if (!baseTool || !baseTool.supportedLocales.includes("ru") || !translation || !uiVerified || !seoVerified || !published) notFound();
  const workspace = slug === "barcode-generator"
    ? <BarcodeWorkspace locale="ru" />
    : slug === "markdown-preview"
      ? <RussianMarkdownWorkspace />
      : slug === "timer" || slug === "pomodoro-timer"
        ? <CountdownWorkspace slug={slug} locale="ru" />
        : null;
  if (!workspace) notFound();
  const tool = localizePublishedTool(baseTool, "ru");
  const messages = getMessages("ru");
  const url = `https://www.woori.today/ru/tools/${slug}`;
  return <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
    <nav aria-label={messages.breadcrumb} className="mb-6 text-sm text-slate-500"><Link href="/ru/tools" className="hover:text-indigo-700">{messages.tools}</Link><span aria-hidden="true"> / </span><span aria-current="page" className="text-slate-700">{tool.title}</span></nav>
    <header className="mb-7"><p className="mb-2 text-sm font-semibold text-indigo-700">{translation.category}</p><h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{tool.title}</h1><p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">{tool.description}</p></header>
    {workspace}
    <section className="mt-12 space-y-8">
      <article><h2 className="text-2xl font-bold">Об этом инструменте</h2><p className="mt-3 leading-7 text-slate-700">{translation.description}</p></article>
      <article><h2 className="text-xl font-bold">Как пользоваться</h2><ol className="mt-4 list-inside list-decimal space-y-2 text-slate-700">{translation.steps.map((step) => <li key={step}>{step}</li>)}</ol></article>
      <article><h2 className="text-xl font-bold">Пример</h2><p className="mt-2 leading-7 text-slate-700">{translation.example}</p></article>
      <article><h2 className="text-xl font-bold">Параметры</h2><p className="mt-2 leading-7 text-slate-700">{translation.options}</p></article>
      <article><h2 className="text-xl font-bold">Конфиденциальность</h2><p className="mt-2 rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">Данные обрабатываются в браузере и не отправляются на сервер.</p></article>
      <article><h2 className="text-xl font-bold">Важно</h2><p className="mt-2 leading-7 text-slate-700">{translation.caution}</p></article>
    </section>
    <section className="mt-10"><h2 className="text-2xl font-bold">Частые вопросы</h2><div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200">{[[translation.faq.example, translation.example], [translation.faq.caution, translation.caution]].map(([question, answer], index) => <details key={question} className="group p-4" open={index === 0}><summary className="cursor-pointer font-medium">{question}</summary><p className="mt-3 text-sm leading-6 text-slate-600">{answer}</p></details>)}</div></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: tool.title, description: tool.description, url, inLanguage: "ru", applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" } }).replace(/</g, "\\u003c") }} />
  </main>;
}
