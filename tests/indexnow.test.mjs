import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import { createIndexNowBody, createIndexNowUrls, INDEXNOW_ENDPOINT, INDEXNOW_KEY, INDEXNOW_KEY_LOCATION } from "../scripts/submit-indexnow.mjs";

const routingSource = await readFile(new URL("../src/i18n/routing.ts", import.meta.url), "utf8");
const routingModule = ts.transpileModule(routingSource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { locales } = await import(`data:text/javascript;base64,${Buffer.from(routingModule.outputText).toString("base64")}`);
const countrySlugSource = await readFile(new URL("../src/lib/country-tool-slugs.ts", import.meta.url), "utf8");
const countrySlugs = [...countrySlugSource.matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1]);
let registrySource = await readFile(new URL("../src/registry/tools.ts", import.meta.url), "utf8");
registrySource = registrySource.replace('import { locales, type RouteLocale as Locale } from "../i18n/routing";', `const locales = ${JSON.stringify(locales)};`);
registrySource = registrySource.replace('import { COUNTRY_TOOL_SLUGS } from "../lib/country-tool-slugs";', `const COUNTRY_TOOL_SLUGS = ${JSON.stringify(countrySlugs)};`);
const { outputText } = ts.transpileModule(registrySource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { tools } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
test("IndexNow URLs include only locales supported by each public tool", () => {
  const urls = createIndexNowUrls([...tools, { slug: "private-tool", isPublic: false }]);
  assert.equal(new Set(urls).size, urls.length);
  assert.equal(urls.length, tools.reduce((sum, tool) => sum + tool.supportedLocales.length, 0) + 15);
  assert.ok(!urls.some((url) => url.includes("private-tool")));
  assert.deepEqual(locales, ["ko", "en", "ja", "zh", "es", "pt-br", "de", "fr", "vi", "id", "th", "zh-tw", "it", "nl", "hi"]);
  assert.ok(urls.every((url) => new RegExp(`^https://www\\.woori\\.today/(${locales.join("|")})/tools(?:/[^/]+)?$`).test(url)));
  for (const locale of locales) {
    assert.ok(urls.includes(`https://www.woori.today/${locale}/tools`));
    for (const tool of tools) assert.equal(urls.includes(`https://www.woori.today/${locale}/tools/${tool.slug}`), tool.supportedLocales.includes(locale));
  }
  assert.ok(urls.every((url) => !new URL(url).pathname.startsWith("/tools/")));
});

test("IndexNow body matches the API shape and removes duplicate input URLs", () => {
  const url = "https://www.woori.today/ko/tools/example";
  const body = createIndexNowBody([url, url]);
  assert.deepEqual(body, {
    host: "www.woori.today",
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: [url],
  });
  assert.equal(INDEXNOW_ENDPOINT, "https://api.indexnow.org/IndexNow");
  assert.equal(INDEXNOW_KEY, "bc52d22e38f7489988b717aa090fbdfb");
  assert.equal(INDEXNOW_KEY_LOCATION, "https://www.woori.today/bc52d22e38f7489988b717aa090fbdfb.txt");
});

test("IndexNow key verification file is served from the public root", async () => {
  const keyFile = await readFile(new URL(`../public/${INDEXNOW_KEY}.txt`, import.meta.url), "utf8");
  assert.equal(keyFile.trim(), INDEXNOW_KEY);
});
