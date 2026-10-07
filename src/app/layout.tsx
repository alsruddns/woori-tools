import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SITE_ORIGIN, SITE_NAME } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: { default: "Woori Tools | 무료 온라인 도구 모음", template: "%s | Woori Tools" },
  description: "이미지, PDF, 텍스트, 개발자 도구를 브라우저에서 간편하게 사용하세요.",
  applicationName: SITE_NAME,
  openGraph: {
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
    title: "Woori Tools | 무료 온라인 도구 모음",
    description: "이미지, PDF, 텍스트, 개발자 도구를 브라우저에서 간편하게 사용하세요.",
  },
  twitter: {
    card: "summary",
    title: "Woori Tools | 무료 온라인 도구 모음",
    description: "이미지, PDF, 텍스트, 개발자 도구를 브라우저에서 간편하게 사용하세요.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
