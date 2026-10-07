import type { MetadataRoute } from "next";
import { SERVICE_BASE_URL, SITE_BASE_PATH, SITE_ORIGIN } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: `${SITE_BASE_PATH}/` },
    sitemap: `${SERVICE_BASE_URL}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
