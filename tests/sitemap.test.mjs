import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import { createSitemapEntries } from "../src/lib/sitemap-entries.mjs";

async function importTypeScript(path, replacements = []) {
  let source = await readFile(new URL(path, import.meta.url), "utf8");
  for (const [search, replacement] of replacements) source = source.replace(search, replacement);
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}

const { locales, localeConfig, hreflangs } = await importTypeScript("../src/i18n/routing.ts");
const countrySlugSource = await readFile(new URL("../src/lib/country-tool-slugs.ts", import.meta.url), "utf8");
const countrySlugs = [...countrySlugSource.matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1]);
const { tools: publicTools, filterPublicTools } = await importTypeScript("../src/registry/tools.ts", [
  ['import { locales, type RouteLocale as Locale } from "../i18n/routing";', `const locales = ${JSON.stringify(locales)};`],
  ['import { COUNTRY_TOOL_SLUGS } from "../lib/country-tool-slugs";', `const COUNTRY_TOOL_SLUGS = ${JSON.stringify(countrySlugs)};`],
]);
const seoSource = await readFile(new URL("../src/lib/seo.ts", import.meta.url), "utf8");
const { languageAlternates } = await importTypeScript("../src/lib/seo.ts", [[
  'import { getLocaleConfig, hreflangs, locales, type Locale } from "@/i18n/routing";',
  `const locales = ${JSON.stringify(locales)}; const hreflangs = ${JSON.stringify(hreflangs)};`,
]]);
const sitemapSource = await readFile(new URL("../src/app/sitemap.ts", import.meta.url), "utf8");
const localeLayoutSource = await readFile(new URL("../src/app/[locale]/layout.tsx", import.meta.url), "utf8");
const toolPageSource = await readFile(new URL("../src/app/[locale]/tools/[slug]/page.tsx", import.meta.url), "utf8");
const nextConfig = await readFile(new URL("../next.config.ts", import.meta.url), "utf8");
const siteOrigin = "https://www.woori.today";
const entries = createSitemapEntries({
  tools: publicTools,
  locales,
  siteOrigin,
  languageAlternates,
  lastModified: new Date("2026-10-08T00:00:00.000Z"),
});

test("sitemap is generated from the public registry and includes every locale", () => {
  assert.match(sitemapSource, /import \{ tools \} from "@\/registry\/tools"/);
  assert.match(sitemapSource, /createSitemapEntries\(\{[\s\S]*?tools,[\s\S]*?locales,[\s\S]*?languageAlternates/);
  assert.ok(publicTools.length > 0);
  assert.ok(publicTools.every(({ isPublic }) => isPublic));
  assert.equal(publicTools.some(({ slug }) => slug === "ladder-game"), false);
  assert.match(localeLayoutSource, /return locales\.map\(\(locale\) => \(\{ locale \}\)\)/);
  assert.match(toolPageSource, /supportedLocales\.includes\(params\.locale as Locale\)/);

  const listingEntries = entries.filter(({ url }) => /\/tools$/.test(url));
  const detailEntries = entries.filter(({ url }) => /\/tools\/[^/]+$/.test(url));
  assert.equal(locales.length, 15);
  assert.equal(listingEntries.length, 15);
  const expectedDetailCount = publicTools.reduce((sum, tool) => sum + tool.supportedLocales.length, 0);
  assert.equal(detailEntries.length, expectedDetailCount);
  assert.equal(entries.length, expectedDetailCount + 15);
  assert.equal(new Set(entries.map(({ url }) => url)).size, entries.length);

  const publishedRouteMatrix = publicTools.flatMap(({ slug, supportedLocales }) => supportedLocales.map((locale) => `${siteOrigin}/${locale}/tools/${slug}`));
  const missingRoutes = publishedRouteMatrix.filter((url) => !entries.some((entry) => entry.url === url));
  assert.deepEqual(missingRoutes, [], `Missing public tool locale routes:\n${missingRoutes.join("\n")}`);

  for (const locale of locales) {
    assert.ok(listingEntries.some(({ url }) => url === `${siteOrigin}/${locale}/tools`));
    for (const tool of publicTools) assert.equal(entries.some(({ url }) => url === `${siteOrigin}/${locale}/tools/${tool.slug}`), tool.supportedLocales.includes(locale));
    for (const slug of ["japan-loto6-number-generator", "japan-loto7-number-generator", "japan-mini-loto-number-generator"]) {
      assert.ok(entries.some(({ url }) => url === `${siteOrigin}/${locale}/tools/${slug}`));
    }
  }

  for (const entry of entries) {
    assert.ok(entry.url.startsWith(`${siteOrigin}/`));
    assert.match(entry.url, /^https:\/\/www\.woori\.today\/(ko|en|ja|zh|es|pt-br|de|fr|vi|id|th|zh-tw|it|nl|hi)\/tools(?:\/[^/]+)?$/);
    assert.equal(entry.alternates.languages["x-default"], entry.alternates.languages.ko);
    const segments = new URL(entry.url).pathname.split("/").filter(Boolean);
    const slug = segments[2];
    const alternates = slug ? publicTools.find((tool) => tool.slug === slug).supportedLocales : locales;
    const localizedPath = new URL(entry.url).pathname.replace(/^\/[^/]+/, "");
    for (const locale of locales) assert.equal(entry.alternates.languages[hreflangs[locale]], alternates.includes(locale) ? `${siteOrigin}/${locale}${localizedPath}` : undefined);
    assert.deepEqual(Object.keys(entry.alternates.languages).sort(), [...new Set(["x-default", ...alternates.map((locale) => hreflangs[locale])])].sort());
    const pathname = new URL(entry.url).pathname;
    assert.doesNotMatch(pathname, /^\/tools(?:\/|$)/);
    assert.doesNotMatch(pathname, /^\/_assets(?:\/|$)/);
  }

  assert.match(nextConfig, /source: "\/tools-sitemap\.xml", destination: "\/sitemap\.xml"/);
});

test("private registry tools are excluded from sitemap entries", () => {
  const privateTool = { slug: "draft-tool", isPublic: false };
  const filteredTools = filterPublicTools([...publicTools, privateTool]);
  const filteredEntries = createSitemapEntries({
    tools: filteredTools,
    locales,
    siteOrigin,
    languageAlternates,
  });

  assert.equal(filteredTools.some(({ slug }) => slug === privateTool.slug), false);
  assert.equal(filteredEntries.length, entries.length);
  assert.equal(filteredEntries.some(({ url }) => url.includes(privateTool.slug)), false);
});

test("sitemap and SEO use the same language alternate helper", () => {
  assert.match(sitemapSource, /import \{[^}]*languageAlternates[^}]*\} from "@\/lib\/seo"/);
  assert.match(seoSource, /"x-default": localizedUrl\("ko", path\)/);
  assert.equal(entries.find(({ url }) => url.endsWith("/tools/lotto-number-generator")).alternates.languages && Object.keys(entries.find(({ url }) => url.endsWith("/tools/lotto-number-generator")).alternates.languages).length, 16);
  assert.equal(Object.keys(entries.find(({ url }) => url.endsWith("/tools/image-compress")).alternates.languages).length, 16);
  assert.equal(localeConfig.find(({ routeLocale }) => routeLocale === "pt-br").hreflang, "pt-BR");
  assert.equal(localeConfig.find(({ routeLocale }) => routeLocale === "zh-tw").hreflang, "zh-TW");
});
