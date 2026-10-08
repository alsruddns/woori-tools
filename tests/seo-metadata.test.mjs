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

test("all four locale alternates are declared", () => {
  assert.match(source, /Object\.fromEntries\(locales\.map\(\(locale\) => \[locale, localizedUrl\(locale, path\)\]\)\)/);
  for (const locale of ["ko", "en", "ja", "zh"]) assert.ok(source.includes(`  ${locale}:`));
});
