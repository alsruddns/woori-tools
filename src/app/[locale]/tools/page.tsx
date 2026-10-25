import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolDirectory } from "@/components/tool/tool-directory";
import { getMessages } from "@/i18n/messages";
import { isLocale, isPlannedLocale, localizePath, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { getLocalizedCategories } from "@/registry/category-translations";
import { localizeTools } from "@/registry/tool-translations";
import { tools } from "@/registry/tools";
import { newToolSlugs } from "@/registry/new-tool-translations";
import { homeContent } from "@/registry/home-content";
import { localizePublishedTool } from "@/registry/published-tool-translations";
import { publishedTargetLocales } from "@/i18n/routing";
import { targetLocalePublication } from "@/registry/target-locale-publication";
import { isExpandedLocale, getTargetCategoryName } from "@/registry/target-category-translations";
import { localizeTargetTool } from "@/registry/target-tool-translation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (rawLocale === "ru") {
    const messages = getMessages("ru");
    return pageMetadata({ locale: "ru", path: "/tools", title: messages.homeEyebrow, description: messages.homeDescription, keywords: ["бесплатные инструменты", "инструменты в браузере"], supportedLocales: publishedTargetLocales });
  }
  if (rawLocale === "tr") {
    return pageMetadata({ locale: "tr", path: "/tools", title: "Tüm araçlar", description: "Günlük işler için Türkçe çevrim içi araçları keşfedin.", keywords: ["çevrim içi araçlar", "araçlar", "ücretsiz araçlar"], supportedLocales: publishedTargetLocales });
  }
  if (rawLocale === "pl") {
    return pageMetadata({ locale: "pl", path: "/tools", title: "Darmowe narzędzia online", description: "Korzystaj z bezpłatnych narzędzi do pracy z tekstem, obrazami, plikami PDF i danymi. Przetwarzanie odbywa się lokalnie w przeglądarce.", keywords: ["darmowe narzędzia online", "narzędzia PDF", "narzędzia do tekstu", "narzędzia do obrazów"], supportedLocales: publishedTargetLocales });
  }
  if (isPlannedLocale(rawLocale) && isExpandedLocale(rawLocale)) {
    const messages = getMessages(rawLocale);
    return pageMetadata({ locale: rawLocale, path: "/tools", title: messages.homeEyebrow, description: messages.homeDescription, keywords: ["online tools", "browser tools"], supportedLocales: publishedTargetLocales });
  }
  if (!isLocale(rawLocale)) return {};
  const messages = getMessages(rawLocale);
  return pageMetadata({ locale: rawLocale, path: "/tools", title: messages.homeEyebrow, description: messages.homeDescription, keywords: ["online tools", "image", "PDF", "text"] });
}

export default async function ToolsHomePage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (rawLocale === "pl") {
    const polishPublishedSlugs = new Set<string>(targetLocalePublication.pl.publishedToolSlugs);
    const polishTools = tools.filter((tool) => polishPublishedSlugs.has(tool.slug)).map((tool) => localizePublishedTool(tool, "pl"));
    return <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-cyan-50 px-6 py-10 sm:px-12 sm:py-14">
        <p className="font-semibold text-indigo-700">Bezpłatne narzędzia online</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Przydatne narzędzia na co dzień</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Wybierz narzędzie do pracy z tekstem, obrazami, dokumentami PDF i danymi. Pliki pozostają na Twoim urządzeniu.</p>
        <ToolDirectory tools={polishTools} locale="pl" />
      </section>
      <section className="py-9" aria-labelledby="pl-all-tools"><h2 id="pl-all-tools" className="text-2xl font-bold">Wszystkie narzędzia <span className="text-base font-normal text-slate-500">({polishTools.length})</span></h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">{polishTools.map((tool) => <Link key={tool.slug} href={`/pl/tools/${tool.slug}`} className="block min-h-28 rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-300 hover:shadow-sm"><span className="text-xs font-semibold text-indigo-700">Narzędzia online</span><h3 className="mt-1 font-semibold">{tool.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p></Link>)}</div>
      </section>
      <section className="rounded-2xl bg-emerald-50 p-5 text-sm text-emerald-900"><h2 className="text-lg font-bold">Prywatne przetwarzanie w przeglądarce</h2><p className="mt-2 leading-7">Pliki są przetwarzane na Twoim urządzeniu i nie są wysyłane na serwer.</p></section>
    </main>;
  }
  if (isPlannedLocale(rawLocale) && isExpandedLocale(rawLocale)) {
    const locale = rawLocale;
    const messages = getMessages(locale);
    const visibleTools = targetLocalePublication[locale].publishedToolSlugs
      .map((slug) => tools.find((tool) => tool.slug === slug))
      .filter((tool): tool is (typeof tools)[number] => tool !== undefined)
      .map((tool) => localizeTargetTool(tool, locale));
    return <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-cyan-50 px-6 py-10 sm:px-12 sm:py-14">
        <p className="font-semibold text-indigo-700">{messages.homeEyebrow}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{messages.homeTitle}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{messages.homeDescription}</p>
        <ToolDirectory tools={visibleTools} locale={locale} />
      </section>
      <section className="py-9" aria-labelledby="target-tools-heading">
        <h2 id="target-tools-heading" className="text-2xl font-bold">{messages.allTools} <span className="text-base font-normal text-slate-500">({visibleTools.length})</span></h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">{visibleTools.map((tool) => <Link key={tool.slug} href={localizePath(locale, `/tools/${tool.slug}`)} className="block min-h-28 rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-300 hover:shadow-sm"><span className="text-xs font-semibold text-indigo-700">{getTargetCategoryName(locale, tool.category)}</span><h3 className="mt-1 font-semibold">{tool.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p></Link>)}</div>
      </section>
      <section className="rounded-2xl bg-emerald-50 p-5 text-sm text-emerald-900"><h2 className="text-lg font-bold">{messages.introPrivacy}</h2><p className="mt-2 leading-7">{messages.privacyNotice}</p></section>
    </main>;
  }
  if (rawLocale === "ru") {
    const messages = getMessages("ru");
    const russianTools = tools.filter((tool) => tool.supportedLocales.includes("ru")).map((tool) => localizePublishedTool(tool, "ru"));
    return <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-cyan-50 px-6 py-10 sm:px-12 sm:py-14">
        <p className="font-semibold text-indigo-700">{messages.homeEyebrow}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{messages.homeTitle}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{messages.homeDescription}</p>
        <ToolDirectory tools={russianTools} locale="ru" />
      </section>
      <section className="py-9" aria-labelledby="all-tools">
        <h2 id="all-tools" className="text-2xl font-bold">{messages.allTools} <span className="text-base font-normal text-slate-500">({russianTools.length})</span></h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {russianTools.map((tool) => <Link key={tool.slug} href={localizePath("ru", `/tools/${tool.slug}`)} className="block min-h-28 rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-300 hover:shadow-sm"><span className="text-xs font-semibold text-indigo-700">{messages.categories}</span><h3 className="mt-1 font-semibold">{tool.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p></Link>)}
        </div>
      </section>
      <section className="rounded-2xl bg-emerald-50 p-5 text-sm text-emerald-900"><h2 className="text-lg font-bold">{messages.introPrivacy}</h2><p className="mt-2 leading-7">{messages.privacyNotice}</p></section>
    </main>;
  }
  if (rawLocale === "tr") {
    const messages = getMessages("tr");
    const turkishTools = targetLocalePublication.tr.publishedToolSlugs
      .map((slug) => tools.find((tool) => tool.slug === slug))
      .filter((tool): tool is (typeof tools)[number] => tool !== undefined)
      .map((tool) => localizePublishedTool(tool, "tr"));
    return <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-cyan-50 px-6 py-10 sm:px-12 sm:py-14">
        <p className="font-semibold text-indigo-700">Woori Tools</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Tüm araçlar</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Günlük işler için Türkçe çevrim içi araçları keşfedin.</p>
        <ToolDirectory tools={turkishTools} locale="tr" />
      </section>
      <section className="py-9" aria-labelledby="tr-all-tools">
        <h2 id="tr-all-tools" className="text-2xl font-bold">{messages.allTools} <span className="text-base font-normal text-slate-500">({turkishTools.length})</span></h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {turkishTools.map((tool) => <Link key={tool.slug} href={`/tr/tools/${tool.slug}`} className="block min-h-28 rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-300 hover:shadow-sm"><span className="text-xs font-semibold text-indigo-700">{messages.categories}</span><h3 className="mt-1 font-semibold">{tool.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p></Link>)}
        </div>
      </section>
      <section className="rounded-2xl bg-emerald-50 p-5 text-sm text-emerald-900"><h2 className="text-lg font-bold">Gizlilik</h2><p className="mt-2 leading-7">Dosyalar tarayıcınızda işlenir ve sunucuya yüklenmez.</p></section>
    </main>;
  }
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const messages = getMessages(locale);
  const editorial = homeContent[locale];
  const categories = getLocalizedCategories(locale).filter((category) => tools.some((tool) => tool.category === category.id));
  const orderedTools = localizeTools(tools.filter((tool) => tool.supportedLocales.includes(locale)), locale);
  const featured = orderedTools.filter((tool) => tool.featured);
  const recent = orderedTools.filter((tool) => (newToolSlugs as readonly string[]).includes(tool.slug)).slice(0, 6);

  return (
    <main className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-cyan-50 px-6 py-10 sm:px-12 sm:py-14">
        <p className="font-semibold text-indigo-700">{messages.homeEyebrow}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{messages.homeTitle}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{messages.homeDescription}</p>
        <ToolDirectory tools={orderedTools} locale={locale} />
      </section>

      <section className="border-t border-slate-200 py-9 sm:py-11" aria-labelledby="recent-tools">
        <h2 id="recent-tools" className="text-2xl font-bold text-slate-950">{editorial.recent}</h2>
        <p className="mt-2 text-slate-600">{editorial.recentDescription}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {recent.map((tool) => <ToolCard key={tool.slug} locale={locale} tool={tool} categoryName={categories.find((item) => item.id === tool.category)?.name ?? ""} />)}
        </div>
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
      <section className="mt-4 rounded-2xl bg-emerald-50 p-5 text-sm text-emerald-900" aria-labelledby="browser-processing">
        <h2 id="browser-processing" className="text-lg font-bold">{editorial.browser}</h2>
        <p className="mt-2 leading-7">{editorial.browserDescription} <Link href={localizePath(locale, "/privacy")} className="font-semibold underline underline-offset-2">{messages.privacy}</Link></p>
      </section>
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
