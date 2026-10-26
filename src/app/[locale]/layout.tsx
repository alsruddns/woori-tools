import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { RussianPublishedShell } from "@/components/layout/russian-published-shell";
import { TurkishPublishedShell } from "@/components/layout/turkish-published-shell";
import { PolishPublishedShell } from "@/components/layout/polish-published-shell";
import { TargetLocaleShell } from "@/components/layout/target-locale-shell";
import { CopyToast } from "@/components/copy-toast";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { getMessages } from "@/i18n/messages";
import { getLocaleConfig, getPublishedTargetLocaleConfig, isLocale, isPlannedLocale, isPublishedTargetLocale, type Locale, publishedTargetLocales } from "@/i18n/routing";
import { SITE_NAME, SITE_ORIGIN } from "@/lib/seo";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedTargetLocales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: { default: "Woori Tools", template: "%s" },
  applicationName: SITE_NAME,
  verification: {
    other: {
      "google-adsense-account": "ca-pub-8033378933696766",
    },
  },
  icons: {
    icon: "/_assets/tools/icons/icon.png",
    apple: "/_assets/tools/icons/apple-icon.png",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isPublishedTargetLocale(rawLocale)) notFound();
  if (rawLocale === "ru") {
    const config = getPublishedTargetLocaleConfig(rawLocale);
    if (!config) notFound();
    return <html lang={config.intlLocale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}><body className="min-h-full bg-slate-50 text-slate-900"><RussianPublishedShell>{children}</RussianPublishedShell><GoogleAnalytics /></body></html>;
  }
  if (rawLocale === "tr") {
    const config = getPublishedTargetLocaleConfig("tr");
    if (!config) notFound();
    return <html lang={config.intlLocale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}><body className="min-h-full bg-slate-50 text-slate-900"><TurkishPublishedShell>{children}</TurkishPublishedShell><GoogleAnalytics /></body></html>;
  }
  if (rawLocale === "pl") {
    const config = getPublishedTargetLocaleConfig(rawLocale);
    if (!config) notFound();
    return <html lang={config.intlLocale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}><body className="min-h-full bg-slate-50 text-slate-900"><PolishPublishedShell>{children}</PolishPublishedShell><GoogleAnalytics /></body></html>;
  }
  if (isPlannedLocale(rawLocale)) {
    return <html lang={getPublishedTargetLocaleConfig(rawLocale)?.intlLocale ?? "en"} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}><body className="flex min-h-full flex-col bg-slate-50 text-slate-900"><TargetLocaleShell locale={rawLocale}>{children}</TargetLocaleShell></body></html>;
  }
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const messages = getMessages(locale);

  const intlLocale = getLocaleConfig(locale)?.intlLocale ?? "en-US";
  return (
    <html lang={intlLocale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <SiteHeader locale={locale} />
        <div className="flex-1">{children}</div>
        <SiteFooter locale={locale} messages={messages} />
        <CopyToast locale={locale} />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
