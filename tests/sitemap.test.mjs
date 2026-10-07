import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import { createSitemapEntries } from "../src/lib/sitemap-entries.mjs";

const registrySource = await readFile(new URL("../src/registry/tools.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(registrySource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { tools: publicTools, filterPublicTools } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
const registrySlugs = publicTools.map(({ slug }) => slug);
const sitemapSource = await readFile(new URL("../src/app/sitemap.ts", import.meta.url), "utf8");

test("sitemap is built only from the public tool registry", async () => {
  assert.ok(registrySlugs.length > 0);
  assert.match(sitemapSource, /createSitemapEntries\(tools\.map\(\(\{ slug \}\) => slug\), SERVICE_BASE_URL\)/);

  const entries = createSitemapEntries(registrySlugs, "https://www.woori.today/tools");
  const urls = entries.map(({ url }) => url);

  assert.deepEqual(urls, registrySlugs.map((slug) => `https://www.woori.today/tools/${slug}`));
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.every((url) => new URL(url).pathname.startsWith("/tools/")));
  assert.ok(urls.every((url) => !/\/tools\/(?:category\/|privacy(?:\/|$)|terms(?:\/|$))/.test(url)));
});

test("sitemap URLs do not gain duplicate slashes from a trailing base URL slash", () => {
  const entries = createSitemapEntries(["jpg-to-png"], "https://www.woori.today/tools/");

  assert.equal(entries[0].url, "https://www.woori.today/tools/jpg-to-png");
  assert.equal(new URL(entries[0].url).pathname.includes("//"), false);
});

test("unregistered, 404, and internal routes are not included", () => {
  const urls = createSitemapEntries(registrySlugs, "https://www.woori.today/tools")
    .map(({ url }) => url);
  const excludedPaths = [
    "does-not-exist",
    "internal-preview",
    "privacy",
    "terms",
    "category/image",
  ];

  for (const path of excludedPaths) {
    assert.equal(urls.includes(`https://www.woori.today/tools/${path}`), false, `${path} must not be listed`);
  }
});

test("unpublished registry tools are excluded from the public tool list", () => {
  const visible = filterPublicTools([
    { slug: "published-tool", isPublic: true },
    { slug: "draft-tool", isPublic: false },
  ]);

  assert.deepEqual(visible.map(({ slug }) => slug), ["published-tool"]);
  assert.ok(publicTools.every(({ isPublic }) => isPublic));
});
