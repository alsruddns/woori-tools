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

const { tools: publicTools, filterPublicTools } = await importTypeScript("../src/registry/tools.ts");
const { locales } = await importTypeScript("../src/i18n/routing.ts");
const seoSource = await readFile(new URL("../src/lib/seo.ts", import.meta.url), "utf8");
const { languageAlternates } = await importTypeScript("../src/lib/seo.ts", [[
  'import { locales, type Locale } from "@/i18n/routing";',
  `const locales = ${JSON.stringify(locales)};`,
]]);
const sitemapSource = await readFile(new URL("../src/app/sitemap.ts", import.meta.url), "utf8");
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

  const listingEntries = entries.filter(({ url }) => /\/tools$/.test(url));
  const detailEntries = entries.filter(({ url }) => /\/tools\/[^/]+$/.test(url));
  assert.equal(listingEntries.length, 4);
  assert.equal(detailEntries.length, publicTools.length * 4);
  assert.equal(entries.length, publicTools.length * 4 + 4);
  assert.equal(new Set(entries.map(({ url }) => url)).size, entries.length);

  for (const locale of ["ko", "en", "ja", "zh"]) {
    assert.ok(listingEntries.some(({ url }) => url === `${siteOrigin}/${locale}/tools`));
    for (const tool of publicTools) {
      assert.ok(entries.some(({ url }) => url === `${siteOrigin}/${locale}/tools/${tool.slug}`));
    }
  }

  for (const entry of entries) {
    assert.ok(entry.url.startsWith(`${siteOrigin}/`));
    assert.match(entry.url, /^https:\/\/www\.woori\.today\/(ko|en|ja|zh)\/tools(?:\/[^/]+)?$/);
    assert.equal(entry.alternates.languages["x-default"], entry.alternates.languages.ko);
    for (const locale of locales) {
      assert.equal(entry.alternates.languages[locale], `${siteOrigin}/${locale}${entry.url.slice(siteOrigin.length + 3)}`);
    }
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
  assert.equal(filteredEntries.length, publicTools.length * 4 + 4);
  assert.equal(filteredEntries.some(({ url }) => url.includes(privateTool.slug)), false);
});

test("sitemap and SEO use the same language alternate helper", () => {
  assert.match(sitemapSource, /import \{[^}]*languageAlternates[^}]*\} from "@\/lib\/seo"/);
  assert.match(seoSource, /"x-default": localizedUrl\("ko", path\)/);
  assert.ok(entries.every(({ alternates }) => Object.keys(alternates.languages).length === 5));
});
