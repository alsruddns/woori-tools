import type { MetadataRoute } from "next";
import { SITE_ORIGIN, SITE_BASE_PATH } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: `${SITE_BASE_PATH}/` },
    sitemap: `${SITE_ORIGIN}${SITE_BASE_PATH}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
