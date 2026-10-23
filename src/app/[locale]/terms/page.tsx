import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n/messages";
import { isLocale, locales } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === "tr") return pageMetadata({ locale: "tr", path: "/terms", title: "Kullanım Koşulları", description: "Woori Tools araçlarını kullanırken geçerli olan koşullar ve sorumluluklar.", keywords: ["kullanım koşulları", "çevrim içi araçlar"], supportedLocales: [...locales, "tr"] });
  if (!isLocale(locale)) return {};
  const content = getMessages(locale).termsPage;
  return pageMetadata({ locale, path: "/terms", title: content.title, description: content.description, keywords: ["terms", "online tools"] });
}

export default async function TermsPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (rawLocale === "tr") return <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6"><h1 className="text-3xl font-bold">Kullanım Koşulları</h1><p className="mt-4 leading-7 text-slate-600">Woori Tools&apos;u kullanarak bu koşulları kabul etmiş olursunuz. Araçları yasalara uygun ve başkalarının haklarına saygı gösterecek şekilde kullanın.</p><h2 className="mt-8 text-xl font-semibold">Sonuçların kullanımı</h2><p className="mt-3 leading-7 text-slate-700">Araç çıktıları kolaylık sağlamak amacıyla sunulur. Önemli kararlar veya resmi işlemler için sonuçları bağımsız olarak kontrol edin.</p><h2 className="mt-8 text-xl font-semibold">Dosya işleme</h2><p className="mt-3 leading-7 text-slate-700">Dosya araçları desteklenen biçim ve boyutlarla sınırlıdır. İşlem sırasında kendi dosyanızı ve yedeklerinizi korumaktan siz sorumlusunuz.</p><h2 className="mt-8 text-xl font-semibold">Koşullardaki değişiklikler</h2><p className="mt-3 leading-7 text-slate-700">Hizmet veya koşullar güncellenebilir. Siteyi kullanmaya devam etmeden önce bu sayfayı yeniden inceleyin.</p></main>;
  if (!isLocale(rawLocale)) notFound();
  const content = getMessages(rawLocale).termsPage;
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">{content.title}</h1>
      <p className="mt-4 leading-7 text-slate-600">{content.intro}</p>
      <h2 className="mt-8 text-xl font-semibold">{content.resultsHeading}</h2>
      <p className="mt-3 leading-7 text-slate-700">{content.resultsBody}</p>
      <h2 className="mt-8 text-xl font-semibold">{content.useHeading}</h2>
      <p className="mt-3 leading-7 text-slate-700">{content.useBody}</p>
      <h2 className="mt-8 text-xl font-semibold">{content.changesHeading}</h2>
      <p className="mt-3 leading-7 text-slate-700">{content.changesBody}</p>
    </main>
  );
}
