import type { MetadataRoute } from "next";
import { tools } from "@/registry/tools";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return tools.map((tool) => ({
    url: absoluteUrl(`/${tool.slug}`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
}
