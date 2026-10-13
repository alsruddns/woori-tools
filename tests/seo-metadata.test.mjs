import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../src/lib/seo.ts", import.meta.url), "utf8");
const layout = await readFile(new URL("../src/app/[locale]/layout.tsx", import.meta.url), "utf8");
const toolPage = await readFile(new URL("../src/app/[locale]/tools/[slug]/page.tsx", import.meta.url), "utf8");

test("SEO URLs use the production www origin and locale first", () => {
  assert.match(source, /const siteOrigin = "https:\/\/www\.woori\.today"/);
  assert.match(source, /localizedUrl\(locale, path\)/);
  assert.match(source, /"x-default": localizedUrl\("ko", path\)/);
  assert.match(layout, /metadataBase: new URL\(SITE_ORIGIN\)/);
  assert.match(toolPage, /https:\/\/www\.woori\.today\/\$\{locale\}\/tools\/\$\{slug\}/);
  assert.match(toolPage, /"@type": "BreadcrumbList"/);
  assert.doesNotMatch(source + layout + toolPage, /localhost|https:\/\/www\.woori\.today\/tools\//);
});

test("all 15 route locales have canonical hreflang alternates", async () => {
  const routing = await readFile(new URL("../src/i18n/routing.ts", import.meta.url), "utf8");
  for (const locale of ["ko", "en", "ja", "zh", "es", "pt-br", "de", "fr", "vi", "id", "th", "zh-tw", "it", "nl", "hi"]) {
    assert.ok(routing.includes(`routeLocale: "${locale}"`));
  }
  assert.match(routing, /routeLocale: "pt-br", hreflang: "pt-BR"/);
  assert.match(routing, /routeLocale: "zh-tw", hreflang: "zh-TW"/);
  assert.match(source, /hreflangs\[locale\], localizedUrl\(locale, path\)/);
});

test("Google AdSense account verification is configured in the shared locale metadata", () => {
  assert.match(layout, /verification:\s*\{\s*other:\s*\{\s*"google-adsense-account":\s*"ca-pub-8033378933696766"/);
});
