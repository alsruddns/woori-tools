import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import { SITE_ORIGIN } from "@/lib/seo";
import { tools } from "@/registry/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/tools", ...tools.map((tool) => `/tools/${tool.slug}`)];
  const lastModified = new Date();

  return paths.flatMap((path) => {
    const languages = Object.fromEntries(
      locales.map((locale) => [locale, `${SITE_ORIGIN}/${locale}${path}`]),
    );
    languages["x-default"] = `${SITE_ORIGIN}/ko${path}`;

    return locales.map((locale) => ({
      url: `${SITE_ORIGIN}/${locale}${path}`,
      lastModified,
      changeFrequency: path === "/tools" ? "weekly" as const : "monthly" as const,
      priority: path === "/tools" ? 1 : 0.8,
      alternates: { languages },
    }));
  });
}
