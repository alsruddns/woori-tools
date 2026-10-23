import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolWorkspace } from "@/components/tool/tool-workspace";
import { BarcodeWorkspace } from "@/components/tool/barcode-workspace";
import { RussianBarcodeCheckerWorkspace } from "@/components/tool/russian-barcode-checker-workspace";
import { RussianInstagramGridWorkspace } from "@/components/tool/russian-instagram-grid-workspace";
import { RussianImageCollageWorkspace } from "@/components/tool/russian-image-collage-workspace";
import { RussianFileInfoWorkspace } from "@/components/tool/russian-file-info-workspace";
import { TurkishFileInfoWorkspace } from "@/components/tool/turkish-file-info-workspace";
import { TurkishRenameWorkspace } from "@/components/tool/turkish-rename-workspace";
import { TurkishZipWorkspace } from "@/components/tool/turkish-zip-workspace";
import { TurkishLineToolsWorkspace } from "@/components/tool/turkish-line-tools-workspace";
import { TurkishTextUtilityWorkspace } from "@/components/tool/turkish-text-utility-workspace";
import { TurkishImageToolsWorkspace } from "@/components/tool/turkish-image-tools-workspace";
import { TurkishRegexWorkspace } from "@/components/tool/turkish-regex-workspace";
import { TurkishLoremWorkspace } from "@/components/tool/turkish-lorem-workspace";
import { RussianZipWorkspace } from "@/components/tool/russian-zip-workspace";
import { RussianRenameWorkspace } from "@/components/tool/russian-rename-workspace";
import { RussianLineToolsWorkspace } from "@/components/tool/russian-line-tools-workspace";
import { RussianTextToolsWorkspace } from "@/components/tool/russian-text-tools-workspace";
import { RussianLoremWorkspace } from "@/components/tool/russian-lorem-workspace";
import { RussianRegexWorkspace } from "@/components/tool/russian-regex-workspace";
import { RussianColorConverterWorkspace } from "@/components/tool/russian-color-converter-workspace";
import { RussianCronWorkspace } from "@/components/tool/russian-cron-workspace";
import { RussianCodeFormatterWorkspace } from "@/components/tool/russian-code-formatter-workspace";
import { RussianImageConversionWorkspace } from "@/components/tool/russian-image-conversion-workspace";
import { RussianImageEffectsWorkspace } from "@/components/tool/russian-image-effects-workspace";
import { RussianImageUtilityWorkspace } from "@/components/tool/russian-image-utility-workspace";
import { RussianImageColorPickerWorkspace } from "@/components/tool/russian-image-color-picker-workspace";
import { RussianPdfWorkspace, type RussianPdfSlug } from "@/components/tool/russian-pdf-workspace";
import { RussianTextCompareWorkspace } from "@/components/tool/russian-text-compare-workspace";
import { RussianStructuredDataWorkspace, type RussianDataSlug } from "@/components/tool/russian-structured-data-workspace";
import { RussianEncodingWorkspace, type RussianEncodingSlug } from "@/components/tool/russian-encoding-workspace";
import { RussianJapanToolsWorkspace, type RussianJapanSlug } from "@/components/tool/russian-japan-tools-workspace";
import { RussianAddressWorkspace, type RussianAddressSlug } from "@/components/tool/russian-address-workspace";
import { RussianDeveloperToolsWorkspace, type RussianDeveloperSlug } from "@/components/tool/russian-developer-tools-workspace";
import { RussianChinaToolsWorkspace, type RussianChinaSlug } from "@/components/tool/russian-china-tools-workspace";
import { RussianIndiaToolsWorkspace, type RussianIndiaSlug } from "@/components/tool/russian-india-tools-workspace";
import { RussianInternationalToolsWorkspace, type RussianInternationalSlug } from "@/components/tool/russian-international-tools-workspace";
import { RussianMarkdownWorkspace } from "@/components/tool/russian-markdown-workspace";
import { CountdownWorkspace } from "@/components/tool/countdown-workspace";
import { RandomStringWorkspace } from "@/components/tool/random-string-workspace";
import { QrWorkspace } from "@/components/tool/qr-workspace";
import { WorldClockWorkspace } from "@/components/tool/world-clock-workspace";
import { CoinFlipWorkspace, DiceWorkspace, LottoWorkspace, RandomNameWorkspace, RandomNumberWorkspace, RandomOrderWorkspace, RandomSeatWorkspace, RandomTeamWorkspace, RandomWheelWorkspace, RussianDutyPickerWorkspace } from "@/components/tool/special-random-workspaces";
import { RussianStopwatchWorkspace, TurkishStopwatchWorkspace } from "@/components/tool/tool-workspace";
import { DailyFortuneWorkspace, TarotWorkspace } from "@/components/tool/fortune-workspace";
import { SajuWorkspace } from "@/components/tool/saju-workspace";
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
import { getTargetLotteryTranslation } from "@/registry/target-lottery-translations";
import { getTargetTurkishToolTranslation } from "@/registry/target-tr-translations";
import { targetLocalePublication } from "@/registry/target-locale-publication";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  if (params.locale === "ru") return targetLocalePublication.ru.publishedToolSlugs.map((slug) => ({ slug }));
  if (params.locale === "tr") return targetLocalePublication.tr.publishedToolSlugs.map((slug) => ({ slug }));
  return tools.filter(({ supportedLocales }) => supportedLocales.includes(params.locale as Locale)).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (rawLocale === "ru") {
    const tool = getTool(slug);
    const translation = getTargetRussianToolTranslation(slug) ?? getTargetLotteryTranslation("ru", slug);
    if (!tool || !tool.supportedLocales.includes("ru") || !translation) return {};
    return pageMetadata({ locale: "ru", path: `/tools/${slug}`, title: translation.seoTitle, description: translation.seoDescription, keywords: translation.keywords, supportedLocales: tool.supportedLocales });
  }
  if (rawLocale === "tr") {
    const tool = getTool(slug);
    const translation = getTargetTurkishToolTranslation(slug) ?? getTargetLotteryTranslation("tr", slug);
    if (!tool || !tool.supportedLocales.includes("tr") || !translation || !(targetLocalePublication.tr.publishedToolSlugs as readonly string[]).includes(slug)) return {};
    return pageMetadata({ locale: "tr", path: `/tools/${slug}`, title: translation.seoTitle, description: translation.seoDescription, keywords: translation.keywords, supportedLocales: tool.supportedLocales });
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
  if (rawLocale === "tr") return <TurkishPublishedToolPage slug={slug} />;
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

const russianPdfSlugs: readonly string[] = ["images-to-pdf", "pdf-merge", "pdf-split", "pdf-delete-pages", "pdf-reorder-pages", "pdf-rotate-pages", "pdf-add-page-numbers", "pdf-watermark", "pdf-metadata-viewer", "pdf-remove-metadata", "pdf-page-size-checker"];

function isRussianPdfSlug(slug: string): slug is RussianPdfSlug {
  return russianPdfSlugs.includes(slug);
}

const russianDataSlugs: readonly string[] = ["json-formatter", "json-validator", "json-to-yaml", "yaml-to-json", "csv-to-json", "json-to-csv"];

function isRussianDataSlug(slug: string): slug is RussianDataSlug {
  return russianDataSlugs.includes(slug);
}

const russianEncodingSlugs: readonly string[] = ["base64", "url-encode-decode", "timestamp-converter", "uuid-generator", "uuid-v7-generator", "ulid-generator", "base32-encoder-decoder"];

function isRussianEncodingSlug(slug: string): slug is RussianEncodingSlug {
  return russianEncodingSlugs.includes(slug);
}

const russianJapanSlugs: readonly string[] = ["wareki-converter", "hiragana-katakana-converter", "fullwidth-halfwidth-converter", "japanese-romaji-converter", "japanese-number-kanji-converter", "yakudoshi-calculator", "japanese-zodiac-calculator", "numbers3-number-generator", "numbers4-number-generator", "bingo5-number-generator"];

function isRussianJapanSlug(slug: string): slug is RussianJapanSlug {
  return russianJapanSlugs.includes(slug);
}

const russianAddressSlugs: readonly string[] = ["us-phone-number-formatter", "us-zip-code-formatter", "canada-postal-code-formatter", "uk-postcode-formatter"];

function isRussianAddressSlug(slug: string): slug is RussianAddressSlug {
  return russianAddressSlugs.includes(slug);
}

const russianDeveloperSlugs: readonly string[] = ["jwt-decoder", "url-query-parameter-parser", "user-agent-parser", "ip-cidr-calculator", "hash-compare", "regex-replace", "html-entity-encoder-decoder", "chmod-calculator", "json-path-tester", "csv-tsv-converter", "url-slug-generator", "unicode-code-point-checker"];

function isRussianDeveloperSlug(slug: string): slug is RussianDeveloperSlug {
  return russianDeveloperSlugs.includes(slug);
}

const russianChinaSlugs: readonly string[] = ["simplified-traditional-chinese-converter", "chinese-number-kanji-converter", "rmb-uppercase-converter", "chinese-zodiac-calculator", "chinese-sexagenary-cycle-calculator", "chinese-phone-number-formatter", "taiwan-phone-number-formatter"];

function isRussianChinaSlug(slug: string): slug is RussianChinaSlug {
  return russianChinaSlugs.includes(slug);
}

const russianIndiaSlugs: readonly string[] = ["indian-number-format-converter", "lakh-crore-converter", "pan-format-validator", "gstin-format-validator", "india-phone-number-formatter"];

function isRussianIndiaSlug(slug: string): slug is RussianIndiaSlug {
  return russianIndiaSlugs.includes(slug);
}

const russianInternationalSlugs: readonly string[] = ["germany-iban-validator", "german-number-format-converter", "german-date-format-converter", "spain-dni-validator", "spain-nie-validator", "spanish-number-format-converter", "spanish-date-format-converter", "france-phone-number-formatter", "french-number-format-converter", "french-date-format-converter", "brazil-cpf-validator", "brazil-cnpj-validator", "brazil-phone-number-formatter", "brazil-cep-formatter", "netherlands-iban-validator", "dutch-number-format-converter", "dutch-date-format-converter", "vietnam-phone-number-formatter", "vietnam-number-format-converter", "italy-fiscal-code-format-validator", "italy-vat-number-validator", "italy-number-format-converter", "italian-date-format-converter", "australia-postcode-formatter", "english-date-format-converter"];

function isRussianInternationalSlug(slug: string): slug is RussianInternationalSlug {
  return russianInternationalSlugs.includes(slug);
}

function TurkishPublishedToolPage({ slug }: { slug: string }) {
  const baseTool = getTool(slug);
  const translation = getTargetTurkishToolTranslation(slug) ?? getTargetLotteryTranslation("tr", slug);
  const uiVerified = (targetLocalePublication.tr.uiVerifiedToolSlugs as readonly string[]).includes(slug);
  const seoVerified = (targetLocalePublication.tr.seoVerifiedToolSlugs as readonly string[]).includes(slug);
  const published = (targetLocalePublication.tr.publishedToolSlugs as readonly string[]).includes(slug);
  if (!baseTool || !baseTool.supportedLocales.includes("tr") || !translation || !uiVerified || !seoVerified || !published) notFound();

  const tool = localizePublishedTool(baseTool, "tr");
  const messages = getMessages("tr");
  const lotterySlugs = ["lotto-number-generator", "powerball-number-generator", "mega-millions-number-generator", "japan-loto6-number-generator", "japan-loto7-number-generator", "japan-mini-loto-number-generator"];
  const workspace = lotterySlugs.includes(slug)
    ? <LottoWorkspace locale="tr" max={slug === "powerball-number-generator" ? 69 : slug === "mega-millions-number-generator" ? 70 : slug === "japan-loto6-number-generator" ? 43 : slug === "japan-loto7-number-generator" ? 37 : slug === "japan-mini-loto-number-generator" ? 31 : 45} numberCount={slug === "powerball-number-generator" || slug === "mega-millions-number-generator" ? 5 : slug === "japan-loto7-number-generator" ? 7 : slug === "japan-mini-loto-number-generator" ? 5 : 6} historyKey={`lottery-history:${slug}`} specialBall={slug === "powerball-number-generator" ? { label: { tr: "Powerball" }, min: 1, max: 26 } : slug === "mega-millions-number-generator" ? { label: { tr: "Mega Ball" }, min: 1, max: 24 } : undefined} />
    : slug === "random-number" ? <RandomNumberWorkspace locale="tr" />
    : slug === "random-name-picker" || slug === "draw-lots" ? <RandomNameWorkspace locale="tr" slug={slug} />
    : slug === "random-wheel" ? <RandomWheelWorkspace locale="tr" />
    : slug === "random-team-maker" ? <RandomTeamWorkspace locale="tr" />
    : slug === "random-order" ? <RandomOrderWorkspace locale="tr" />
    : slug === "random-seat" ? <RandomSeatWorkspace locale="tr" />
    : slug === "timer" || slug === "pomodoro-timer" ? <CountdownWorkspace slug={slug} locale="tr" />
    : slug === "password-generator" || slug === "random-string-generator" ? <RandomStringWorkspace slug={slug} locale="tr" />
    : ["wifi-qr", "contact-qr", "phone-qr", "email-qr"].includes(slug) ? <QrWorkspace slug={slug} locale="tr" />
    : slug === "dice-roller" ? <DiceWorkspace locale="tr" />
    : slug === "coin-flip" ? <CoinFlipWorkspace locale="tr" />
    : slug === "stopwatch" ? <TurkishStopwatchWorkspace />
    : slug === "world-clock" ? <WorldClockWorkspace locale="tr" />
    : slug === "tarot-card" ? <TarotWorkspace locale="tr" />
    : slug === "daily-fortune" ? <DailyFortuneWorkspace locale="tr" />
    : slug === "saju" ? <SajuWorkspace locale="tr" />
    : slug === "duty-picker" ? <RussianDutyPickerWorkspace locale="tr" />
    : slug === "barcode-checker" ? <RussianBarcodeCheckerWorkspace locale="tr" />
    : slug === "barcode-generator" ? <BarcodeWorkspace locale="tr" />
    : slug === "instagram-grid-split" ? <RussianInstagramGridWorkspace locale="tr" />
    : slug === "image-collage" ? <RussianImageCollageWorkspace locale="tr" />
    : slug === "markdown-preview" ? <RussianMarkdownWorkspace locale="tr" />
    : ["file-hash", "mime-type-checker", "file-extension-checker", "file-size-checker", "duplicate-file-checker"].includes(slug) ? <TurkishFileInfoWorkspace slug={slug as "file-hash" | "mime-type-checker" | "file-extension-checker" | "file-size-checker" | "duplicate-file-checker"} title={tool.title} />
    : slug === "bulk-file-renamer" || slug === "filename-cleaner" ? <TurkishRenameWorkspace slug={slug} title={tool.title} />
    : slug === "zip-files" ? <TurkishZipWorkspace title={tool.title} />
    : ["shuffle-lines", "add-line-numbers", "remove-line-numbers", "remove-empty-lines", "remove-characters", "sort-lines", "remove-duplicate-lines", "remove-spaces", "remove-line-breaks", "reverse-text", "text-repeater"].includes(slug) ? <TurkishLineToolsWorkspace slug={slug as "shuffle-lines" | "add-line-numbers" | "remove-line-numbers" | "remove-empty-lines" | "remove-characters" | "sort-lines" | "remove-duplicate-lines" | "remove-spaces" | "remove-line-breaks" | "reverse-text" | "text-repeater"} />
    : ["text-to-file", "character-count", "text-case-converter", "remove-duplicate-words"].includes(slug) ? <TurkishTextUtilityWorkspace slug={slug as "text-to-file" | "character-count" | "text-case-converter" | "remove-duplicate-words"} />
    : slug === "regex-tester" ? <TurkishRegexWorkspace />
    : slug === "social-image-resize" || slug === "add-text-to-image" ? <TurkishImageToolsWorkspace slug={slug} />
    : slug === "lorem-ipsum" ? <TurkishLoremWorkspace title={tool.title} />
    : null;
  if (!workspace) notFound();

  const related = (baseTool.relatedTools ?? [])
    .filter((relatedSlug) => (targetLocalePublication.tr.publishedToolSlugs as readonly string[]).includes(relatedSlug))
    .map((relatedSlug) => getTool(relatedSlug))
    .filter((relatedTool): relatedTool is NonNullable<typeof relatedTool> => relatedTool !== undefined)
    .map((relatedTool) => localizePublishedTool(relatedTool, "tr"));
  const url = `https://www.woori.today/tr/tools/${slug}`;

  return <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
    <nav aria-label={messages.breadcrumb} className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <Link href="/tr/tools" className="hover:text-indigo-700">{messages.tools}</Link><span aria-hidden="true">/</span>
      <span aria-current="page" className="text-slate-700">{tool.shortTitle}</span>
    </nav>
    <header className="mb-7">
      <p className="text-sm font-semibold text-indigo-700">{messages.categories}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{translation.title}</h1>
      <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">{translation.description}</p>
    </header>
    {workspace}
    <section className="mt-10 space-y-8">
      <article><h2 className="text-2xl font-bold">{messages.howTo}</h2><ol className="mt-4 list-inside list-decimal space-y-2 text-slate-700">{translation.steps.map((step) => <li key={step}>{step}</li>)}</ol></article>
      <article><h2 className="text-xl font-bold">Örnek kullanım</h2><p className="mt-2 leading-7 text-slate-700">{translation.example}</p></article>
      <article><h2 className="text-xl font-bold">Seçenekler ve sonuç</h2><p className="mt-2 leading-7 text-slate-700">{translation.options}</p></article>
      <article><h2 className="text-xl font-bold">Gizlilik</h2><p className="mt-2 rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">{messages.filePrivacy} <Link href="/tr/tools" className="font-semibold underline underline-offset-2">{messages.allTools}</Link></p></article>
      <article><h2 className="text-xl font-bold">Dikkat</h2><p className="mt-2 leading-7 text-slate-700">{translation.caution}</p></article>
    </section>
    <section className="mt-10" aria-labelledby="tr-faq">
      <h2 id="tr-faq" className="text-2xl font-bold">{messages.faq}</h2>
      <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200">
        {[[translation.faq.example, translation.example], [translation.faq.caution, translation.caution]].map(([question, answer], index) => <details key={question} className="group p-4" open={index === 0}><summary className="cursor-pointer font-medium">{question}</summary><p className="mt-3 text-sm leading-6 text-slate-600">{answer}</p></details>)}
      </div>
    </section>
    {related.length > 0 && <section className="mt-10"><h2 className="text-2xl font-bold">{messages.relatedTools}</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{related.map((item) => <Link key={item.slug} href={`/tr/tools/${item.slug}`} className="rounded-xl border border-slate-200 p-4 hover:border-indigo-300"><span className="font-semibold">{item.title}</span><span className="mt-1 block text-sm text-slate-600">{item.description}</span></Link>)}</div></section>}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: translation.title, description: translation.description, url, inLanguage: "tr-TR", applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" } }).replace(/</g, "\\u003c") }} />
  </main>;
}

function RussianPublishedToolPage({ slug }: { slug: string }) {
  const baseTool = getTool(slug);
  const translation = getTargetRussianToolTranslation(slug) ?? getTargetLotteryTranslation("ru", slug);
  const uiVerified = targetLocalePublication.ru.uiVerifiedToolSlugs.includes(slug);
  const seoVerified = targetLocalePublication.ru.seoVerifiedToolSlugs.includes(slug);
  const published = targetLocalePublication.ru.publishedToolSlugs.includes(slug);
  if (!baseTool || !baseTool.supportedLocales.includes("ru") || !translation || !uiVerified || !seoVerified || !published) notFound();
  const lotteryWorkspace = slug === "lotto-number-generator" || slug === "powerball-number-generator" || slug === "mega-millions-number-generator" || slug === "japan-loto6-number-generator" || slug === "japan-loto7-number-generator" || slug === "japan-mini-loto-number-generator"
    ? <LottoWorkspace locale="ru" min={slug === "powerball-number-generator" ? 1 : 1} max={slug === "powerball-number-generator" ? 69 : slug === "mega-millions-number-generator" ? 70 : slug === "japan-loto6-number-generator" ? 43 : slug === "japan-loto7-number-generator" ? 37 : slug === "japan-mini-loto-number-generator" ? 31 : 45} numberCount={slug === "powerball-number-generator" || slug === "mega-millions-number-generator" ? 5 : slug === "japan-loto7-number-generator" ? 7 : slug === "japan-mini-loto-number-generator" ? 5 : 6} historyKey={`lottery-history:${slug}`} specialBall={slug === "powerball-number-generator" ? { label: { ru: "Powerball" }, min: 1, max: 26 } : slug === "mega-millions-number-generator" ? { label: { ru: "Mega Ball" }, min: 1, max: 24 } : undefined} />
    : null;
  const workspace = lotteryWorkspace ?? (slug === "zip-files"
    ? <RussianZipWorkspace />
    : slug === "color-converter"
      ? <RussianColorConverterWorkspace />
    : slug === "cron-parser"
      ? <RussianCronWorkspace />
    : slug === "sql-formatter"
      ? <RussianCodeFormatterWorkspace slug="sql-formatter" />
      : slug === "html-formatter"
        ? <RussianCodeFormatterWorkspace slug="html-formatter" />
        : slug === "css-formatter"
          ? <RussianCodeFormatterWorkspace slug="css-formatter" />
          : slug === "javascript-formatter"
            ? <RussianCodeFormatterWorkspace slug="javascript-formatter" />
    : slug === "jpg-to-png"
      ? <RussianImageConversionWorkspace slug="jpg-to-png" />
      : slug === "png-to-jpg"
        ? <RussianImageConversionWorkspace slug="png-to-jpg" />
        : slug === "webp-to-jpg"
          ? <RussianImageConversionWorkspace slug="webp-to-jpg" />
          : slug === "webp-to-png"
            ? <RussianImageConversionWorkspace slug="webp-to-png" />
            : slug === "jpg-to-webp"
              ? <RussianImageConversionWorkspace slug="jpg-to-webp" />
              : slug === "png-to-webp"
                ? <RussianImageConversionWorkspace slug="png-to-webp" />
                : slug === "heic-to-jpg"
                  ? <RussianImageConversionWorkspace slug="heic-to-jpg" />
                  : slug === "image-compress"
                    ? <RussianImageEffectsWorkspace slug="image-compress" />
                    : slug === "image-resize"
                      ? <RussianImageEffectsWorkspace slug="image-resize" />
                      : slug === "image-crop"
                        ? <RussianImageEffectsWorkspace slug="image-crop" />
                        : slug === "image-rotate"
                          ? <RussianImageEffectsWorkspace slug="image-rotate" />
                          : slug === "image-flip"
                            ? <RussianImageEffectsWorkspace slug="image-flip" />
                            : slug === "image-grayscale"
                              ? <RussianImageEffectsWorkspace slug="image-grayscale" />
                              : slug === "image-brightness"
                                ? <RussianImageEffectsWorkspace slug="image-brightness" />
                                : slug === "image-contrast"
                                  ? <RussianImageEffectsWorkspace slug="image-contrast" />
                                  : slug === "image-blur"
                                    ? <RussianImageEffectsWorkspace slug="image-blur" />
                                    : slug === "image-pixelate"
                                      ? <RussianImageEffectsWorkspace slug="image-pixelate" />
                                      : slug === "social-image-resize"
                                        ? <RussianImageEffectsWorkspace slug="social-image-resize" />
                                        : slug === "add-text-to-image"
                                          ? <RussianImageEffectsWorkspace slug="add-text-to-image" />
                                      : slug === "remove-image-metadata"
                                        ? <RussianImageUtilityWorkspace slug="remove-image-metadata" />
                                        : slug === "image-info"
                                          ? <RussianImageUtilityWorkspace slug="image-info" />
                                          : slug === "favicon-generator"
                                            ? <RussianImageUtilityWorkspace slug="favicon-generator" />
                                            : slug === "image-color-picker"
                                              ? <RussianImageColorPickerWorkspace />
                                              : isRussianPdfSlug(slug)
                                                ? <RussianPdfWorkspace slug={slug} />
                                              : isRussianDataSlug(slug)
                                                ? <RussianStructuredDataWorkspace slug={slug} />
                                              : isRussianEncodingSlug(slug)
                                                ? <RussianEncodingWorkspace slug={slug} />
                                              : isRussianJapanSlug(slug)
                                                ? <RussianJapanToolsWorkspace slug={slug} />
                                              : isRussianAddressSlug(slug)
                                                ? <RussianAddressWorkspace slug={slug} />
                                              : isRussianDeveloperSlug(slug)
                                                ? <RussianDeveloperToolsWorkspace slug={slug} />
                                              : isRussianChinaSlug(slug)
                                                ? <RussianChinaToolsWorkspace slug={slug} />
                                              : isRussianIndiaSlug(slug)
                                                ? <RussianIndiaToolsWorkspace slug={slug} />
                                              : isRussianInternationalSlug(slug)
                                                ? <RussianInternationalToolsWorkspace slug={slug} />
                                              : slug === "text-compare"
                                                ? <RussianTextCompareWorkspace />
    : slug === "regex-tester"
      ? <RussianRegexWorkspace />
    : slug === "lorem-ipsum"
      ? <RussianLoremWorkspace />
    : slug === "text-to-file"
      ? <RussianTextToolsWorkspace slug="text-to-file" />
    : slug === "remove-characters"
      ? <RussianTextToolsWorkspace slug="remove-characters" />
      : slug === "text-repeater"
        ? <RussianTextToolsWorkspace slug="text-repeater" />
        : slug === "remove-spaces"
          ? <RussianTextToolsWorkspace slug="remove-spaces" />
          : slug === "remove-line-breaks"
            ? <RussianTextToolsWorkspace slug="remove-line-breaks" />
            : slug === "text-case-converter"
              ? <RussianTextToolsWorkspace slug="text-case-converter" />
              : slug === "reverse-text"
                ? <RussianTextToolsWorkspace slug="reverse-text" />
                : slug === "remove-duplicate-words"
                  ? <RussianTextToolsWorkspace slug="remove-duplicate-words" />
                  : slug === "character-count"
                    ? <RussianTextToolsWorkspace slug="character-count" />
    : slug === "shuffle-lines"
      ? <RussianLineToolsWorkspace slug="shuffle-lines" />
      : slug === "add-line-numbers"
        ? <RussianLineToolsWorkspace slug="add-line-numbers" />
        : slug === "remove-line-numbers"
          ? <RussianLineToolsWorkspace slug="remove-line-numbers" />
          : slug === "remove-empty-lines"
            ? <RussianLineToolsWorkspace slug="remove-empty-lines" />
            : slug === "remove-duplicate-lines"
              ? <RussianLineToolsWorkspace slug="remove-duplicate-lines" />
              : slug === "sort-lines"
                ? <RussianLineToolsWorkspace slug="sort-lines" />
    : slug === "bulk-file-renamer"
      ? <RussianRenameWorkspace slug="bulk-file-renamer" title={translation.title} />
      : slug === "filename-cleaner"
        ? <RussianRenameWorkspace slug="filename-cleaner" title={translation.title} />
    : slug === "file-hash"
    ? <RussianFileInfoWorkspace slug="file-hash" title={translation.title} />
    : slug === "mime-type-checker"
      ? <RussianFileInfoWorkspace slug="mime-type-checker" title={translation.title} />
      : slug === "file-extension-checker"
        ? <RussianFileInfoWorkspace slug="file-extension-checker" title={translation.title} />
        : slug === "file-size-checker"
          ? <RussianFileInfoWorkspace slug="file-size-checker" title={translation.title} />
          : slug === "duplicate-file-checker"
            ? <RussianFileInfoWorkspace slug="duplicate-file-checker" title={translation.title} />
    : slug === "barcode-generator"
    ? <BarcodeWorkspace locale="ru" />
    : slug === "instagram-grid-split"
      ? <RussianInstagramGridWorkspace />
    : slug === "image-collage"
      ? <RussianImageCollageWorkspace />
    : slug === "barcode-checker"
      ? <RussianBarcodeCheckerWorkspace />
      : slug === "markdown-preview"
      ? <RussianMarkdownWorkspace />
      : slug === "timer" || slug === "pomodoro-timer"
        ? <CountdownWorkspace slug={slug} locale="ru" />
        : slug === "password-generator" || slug === "random-string-generator"
          ? <RandomStringWorkspace slug={slug} locale="ru" />
          : ["wifi-qr", "contact-qr", "phone-qr", "email-qr"].includes(slug)
            ? <QrWorkspace slug={slug} locale="ru" />
            : slug === "world-clock"
              ? <WorldClockWorkspace locale="ru" />
              : slug === "dice-roller"
                ? <DiceWorkspace locale="ru" />
              : slug === "random-number"
                ? <RandomNumberWorkspace locale="ru" />
                : slug === "stopwatch"
                  ? <RussianStopwatchWorkspace />
                  : slug === "coin-flip"
                    ? <CoinFlipWorkspace />
                    : slug === "random-name-picker" || slug === "draw-lots"
                      ? <RandomNameWorkspace slug={slug} locale="ru" />
                      : slug === "random-team-maker"
                        ? <RandomTeamWorkspace locale="ru" />
                        : slug === "random-order"
                          ? <RandomOrderWorkspace locale="ru" />
                          : slug === "random-seat"
                            ? <RandomSeatWorkspace locale="ru" />
                            : slug === "duty-picker"
                              ? <RussianDutyPickerWorkspace />
                              : slug === "random-wheel"
                                ? <RandomWheelWorkspace locale="ru" />
                                : slug === "tarot-card"
                                  ? <TarotWorkspace locale="ru" />
                                  : slug === "daily-fortune"
                                    ? <DailyFortuneWorkspace locale="ru" />
                                    : slug === "saju"
                                      ? <SajuWorkspace locale="ru" />
        : null);
  if (!workspace) notFound();
  const localizedTool = localizePublishedTool(baseTool, "ru");
  const tool = { ...localizedTool, title: translation.title, description: translation.description };
  const messages = getMessages("ru");
  const category = "category" in translation && typeof translation.category === "string" ? translation.category : "Лотереи";
  const url = `https://www.woori.today/ru/tools/${slug}`;
  return <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
    <nav aria-label={messages.breadcrumb} className="mb-6 text-sm text-slate-500"><Link href="/ru/tools" className="hover:text-indigo-700">{messages.tools}</Link><span aria-hidden="true"> / </span><span aria-current="page" className="text-slate-700">{tool.title}</span></nav>
    <header className="mb-7"><p className="mb-2 text-sm font-semibold text-indigo-700">{category}</p><h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{tool.title}</h1><p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">{tool.description}</p></header>
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
