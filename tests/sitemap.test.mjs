import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const registrySource = await readFile(new URL("../src/registry/tools.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(registrySource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { tools: publicTools, filterPublicTools } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
const sitemapSource = await readFile(new URL("../src/app/sitemap.ts", import.meta.url), "utf8");
const nextConfig = await readFile(new URL("../next.config.ts", import.meta.url), "utf8");

test("sitemap contains only locale landing pages and public registry tools", () => {
  const slugs = publicTools.map(({ slug }) => slug);
  assert.match(sitemapSource, /const paths = \["\/tools", \.\.\.tools\.map\(\(tool\) => `\/tools\/\$\{tool\.slug\}`\)\]/);
  assert.match(sitemapSource, /locales\.map\(\(locale\) => \(\{/);
  assert.ok(publicTools.every(({ isPublic }) => isPublic));
  const paths = ["/tools", ...slugs.map((slug) => `/tools/${slug}`)];
  const urls = paths.flatMap((path) => ["ko", "en", "ja", "zh"].map((locale) => `https://www.woori.today/${locale}${path}`));
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.every((url) => /^https:\/\/www\.woori\.today\/(ko|en|ja|zh)\/tools(?:\/[^/]+)?$/.test(url)));
  assert.equal(urls.some((url) => url.includes("does-not-exist")), false);
  assert.match(sitemapSource, /"x-default"\] = `\$\{SITE_ORIGIN\}\/ko\$\{path\}`/);
  assert.match(nextConfig, /source: "\/tools-sitemap\.xml", destination: "\/sitemap\.xml"/);
});

test("unpublished registry tools are excluded from the public tool list", () => {
  const visible = filterPublicTools([
    { slug: "published-tool", isPublic: true },
    { slug: "draft-tool", isPublic: false },
  ]);
  assert.deepEqual(visible.map(({ slug }) => slug), ["published-tool"]);
});
