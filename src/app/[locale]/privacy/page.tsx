import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n/messages";
import { isLocale, locales } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === "tr") return pageMetadata({ locale: "tr", path: "/privacy", title: "Gizlilik Politikası", description: "Woori Tools dosyaları ve verileri tarayıcınızda işler; yüklenen dosyaları sunucuya göndermez.", keywords: ["gizlilik", "tarayıcıda dosya işleme"], supportedLocales: [...locales, "tr"] });
  if (!isLocale(locale)) return {};
  const content = getMessages(locale).privacyPage;
  return pageMetadata({ locale, path: "/privacy", title: content.title, description: content.description, keywords: ["privacy", "browser file processing"] });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (rawLocale === "tr") return <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6"><h1 className="text-3xl font-bold">Gizlilik Politikası</h1><p className="mt-4 leading-7 text-slate-600">Woori Tools, araçlarını kullanırken gizliliğinizi korumayı amaçlar. İşlemler mümkün olduğunda doğrudan tarayıcınızda yapılır.</p><h2 className="mt-8 text-xl font-semibold">Dosyalar ve içerik</h2><p className="mt-3 leading-7 text-slate-700">Seçtiğiniz dosyalar ve girdiğiniz metinler dönüştürme için sunucuya yüklenmez. İşleme cihazınızda gerçekleşir; sonuç dosyalarını kendiniz indirirsiniz.</p><h2 className="mt-8 text-xl font-semibold">Kullanım verileri</h2><p className="mt-3 leading-7 text-slate-700">Site ölçüm araçları sayfa kullanımı hakkında genel istatistikler toplayabilir. Dosya içeriği, dosya adı, EXIF konumu veya araç sonuçları analiz verilerine eklenmez.</p><h2 className="mt-8 text-xl font-semibold">Tarayıcı depolaması</h2><p className="mt-3 leading-7 text-slate-700">Bazı araçlar tercihleri veya geçmişi cihazınızda saklayabilir. Tarayıcı ayarlarından bu verileri silebilirsiniz.</p><p className="mt-8 text-sm text-slate-500">Bu sayfa en son 23 Ekim 2026 tarihinde gözden geçirildi.</p></main>;
  if (!isLocale(rawLocale)) notFound();
  const content = getMessages(rawLocale).privacyPage;
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">{content.title}</h1>
      <p className="mt-4 leading-7 text-slate-600">{content.intro}</p>
      <h2 className="mt-8 text-xl font-semibold">{content.fileHeading}</h2>
      <p className="mt-3 leading-7 text-slate-700">{content.fileBody}</p>
      <h2 className="mt-8 text-xl font-semibold">{content.dataHeading}</h2>
      <p className="mt-3 leading-7 text-slate-700">{content.dataBody}</p>
      <h2 className="mt-8 text-xl font-semibold">{content.browserHeading}</h2>
      <p className="mt-3 leading-7 text-slate-700">{content.browserBody}</p>
      <p className="mt-8 text-sm text-slate-500">{content.ending}</p>
    </main>
  );
}
