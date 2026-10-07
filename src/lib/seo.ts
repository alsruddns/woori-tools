import type { Metadata } from "next";

const siteOrigin = (process.env.SITE_URL ?? "https://www.woori.today").replace(/\/+$/, "");
export const SITE_ORIGIN = siteOrigin;
export const SITE_BASE_PATH = "/tools";
export const SERVICE_BASE_URL = `${siteOrigin}${SITE_BASE_PATH}`;
export const SITE_NAME = "Woori Tools";

export function absoluteUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SERVICE_BASE_URL}${normalizedPath === "/" ? "" : normalizedPath}`;
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export function createPageMetadata({ title, description, path, keywords }: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical: url,
      languages: { "ko-KR": url, "x-default": url },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "ko_KR",
      url,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
    },
  };
}
