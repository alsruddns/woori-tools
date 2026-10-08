import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n/messages";
import { isLocale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = getMessages(locale).privacyPage;
  return pageMetadata({ locale, path: "/privacy", title: content.title, description: content.description, keywords: ["privacy", "browser file processing"] });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale: rawLocale } = await params;
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
