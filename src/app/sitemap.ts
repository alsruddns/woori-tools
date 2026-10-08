import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import { languageAlternates, SITE_ORIGIN } from "@/lib/seo";
import { createSitemapEntries } from "@/lib/sitemap-entries.mjs";
import { tools } from "@/registry/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  return createSitemapEntries({
    tools,
    locales,
    siteOrigin: SITE_ORIGIN,
    languageAlternates,
  });
}
