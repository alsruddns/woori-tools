import type { MetadataRoute } from "next";
import { tools } from "@/registry/tools";
import { SERVICE_BASE_URL } from "@/lib/seo";
import { createSitemapEntries } from "@/lib/sitemap-entries.mjs";

export default function sitemap(): MetadataRoute.Sitemap {
  return createSitemapEntries(tools.map(({ slug }) => slug), SERVICE_BASE_URL);
}
