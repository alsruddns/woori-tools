import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import { createIndexNowBody, createIndexNowUrls, INDEXNOW_ENDPOINT, INDEXNOW_KEY, INDEXNOW_KEY_LOCATION } from "../scripts/submit-indexnow.mjs";

const registrySource = await readFile(new URL("../src/registry/tools.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(registrySource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { tools } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

test("IndexNow URLs include public tools and all locales without duplicates or legacy paths", () => {
  const urls = createIndexNowUrls([...tools, { slug: "private-tool", isPublic: false }]);
  assert.equal(new Set(urls).size, urls.length);
  assert.equal(urls.length, tools.length * 4 + 4);
  assert.ok(!urls.some((url) => url.includes("private-tool")));
  assert.ok(urls.every((url) => /^https:\/\/www\.woori\.today\/(ko|en|ja|zh)\/tools(?:\/[^/]+)?$/.test(url)));
  for (const locale of ["ko", "en", "ja", "zh"]) {
    assert.ok(urls.includes(`https://www.woori.today/${locale}/tools`));
    for (const tool of tools) assert.ok(urls.includes(`https://www.woori.today/${locale}/tools/${tool.slug}`));
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
});

test("IndexNow key verification file is served from the public root", async () => {
  const keyFile = await readFile(new URL(`../public/${INDEXNOW_KEY}.txt`, import.meta.url), "utf8");
  assert.equal(keyFile.trim(), INDEXNOW_KEY);
});
