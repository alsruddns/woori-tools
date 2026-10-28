import { expect, test } from "@playwright/test";
import { tools } from "../../src/registry/tools";

const locales = ["ko", "en", "ja", "zh", "es", "pt-br", "de", "fr", "vi", "id", "th", "zh-tw", "it", "nl", "hi", "ru", "tr", "pl", "fil", "bn", "uk", "ms", "sv", "cs", "ro", "el"];
const widths = [320, 360, 390, 414, 768, 1024, 1280, 1440];

test("all 4,576 localized tool pages return SSR editorial and SEO metadata", async ({ request }) => {
  test.setTimeout(900_000);
  expect(tools).toHaveLength(176);
  for (const locale of locales) {
    for (let start = 0; start < tools.length; start += 32) {
      const chunk = tools.slice(start, start + 32);
      const results = await Promise.all(chunk.map(async (tool) => {
        const response = await request.get(`/${locale}/tools/${tool.slug}`);
        const html = await response.text();
        return { locale, slug: tool.slug, status: response.status(), html };
      }));
      for (const { locale: routeLocale, slug, status, html } of results) {
        expect(status, `${routeLocale}/${slug}`).toBe(200);
        expect(html, `${routeLocale}/${slug} SSR editorial`).toContain('data-testid="tool-detail-editorial"');
        expect(html, `${routeLocale}/${slug} canonical`).toMatch(/rel="canonical"/i);
        expect(html, `${routeLocale}/${slug} hreflang set`).toMatch(/hrefLang="x-default"/i);
        expect(html, `${routeLocale}/${slug} alternates`).toMatch(/hrefLang="en"/i);
      }
    }
  }
});

test("all public tool pages fit eight mobile, tablet, and desktop widths", async ({ page, baseURL }) => {
  test.setTimeout(900_000);
  expect(tools).toHaveLength(176);
  for (const tool of tools) {
    await page.setViewportSize({ width: widths[0], height: 900 });
    await page.goto(`${baseURL}/en/tools/${tool.slug}`, { waitUntil: "domcontentloaded" });
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, `${tool.slug} at ${width}px`).toBe(false);
    }
  }
});
