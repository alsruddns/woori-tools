import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const keyFileName = (await readdir(new URL("../public/", import.meta.url))).find((name) => /^[a-f0-9]+\.txt$/i.test(name));
assert.ok(keyFileName, "IndexNow verification key file is missing from public/");
const publicKey = (await readFile(new URL(`../public/${keyFileName}`, import.meta.url), "utf8")).trim();
process.env.INDEXNOW_KEY = publicKey;

const {
  buildIndexNowBody,
  createIndexNowBody,
  createIndexNowUrls,
  getIndexNowKey,
  getIndexNowKeyLocation,
  INDEXNOW_ENDPOINT,
  INDEXNOW_HOST,
  LOCALES,
  registryTools,
} = await import("../scripts/submit-indexnow.mjs");

test("IndexNow imports the actual registry and submits all public tools in every supported locale", () => {
  assert.ok(registryTools.length >= 160);
  assert.equal(LOCALES.length, 16);
  const urls = createIndexNowUrls([...registryTools, { slug: "private-tool", isPublic: false }]);
  const expectedDetailCount = registryTools.reduce((sum, tool) => sum + (tool.isPublic ? tool.supportedLocales.length : 0), 0);
  assert.equal(urls.length, expectedDetailCount + LOCALES.length);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(!urls.some((url) => url.includes("private-tool")));
  for (const url of urls) {
    const parsed = new URL(url);
    assert.equal(parsed.origin, "https://www.woori.today");
    assert.match(parsed.pathname, new RegExp(`^/(${LOCALES.join("|")})/tools(?:/[^/]+)?$`));
  }
  const detailUrls = urls.filter((url) => /\/tools\/[^/]+$/.test(new URL(url).pathname));
  assert.equal(detailUrls.length, expectedDetailCount);
});

test("IndexNow key is read from the environment and has a clear missing-key error", () => {
  assert.equal(getIndexNowKey(), publicKey);
  assert.equal(getIndexNowKeyLocation(), `https://www.woori.today/${publicKey}.txt`);
  const savedKey = process.env.INDEXNOW_KEY;
  delete process.env.INDEXNOW_KEY;
  try {
    assert.throws(() => createIndexNowBody([]), { message: "INDEXNOW_KEY is required" });
  } finally {
    process.env.INDEXNOW_KEY = savedKey;
  }
});

test("IndexNow request body preserves the host, endpoint, key location, and unique URLs", () => {
  const url = "https://www.woori.today/ko/tools/example";
  const body = createIndexNowBody([url, url]);
  assert.deepEqual(body, {
    host: "www.woori.today",
    key: publicKey,
    keyLocation: `https://www.woori.today/${publicKey}.txt`,
    urlList: [url],
  });
  assert.equal(INDEXNOW_HOST, "www.woori.today");
  assert.equal(INDEXNOW_ENDPOINT, "https://api.indexnow.org/IndexNow");
});

test("base SHA URL generation resolves the filesystem registry without data URLs", async () => {
  const body = await buildIndexNowBody({ baseSha: "HEAD" });
  assert.equal(body.urlList.length, LOCALES.length);
  assert.ok(body.urlList.every((url) => /\/tools$/.test(new URL(url).pathname)));
  const source = await readFile(new URL("../scripts/submit-indexnow.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(source, /data:text\/javascript|base64/);
});

test("IndexNow key verification file matches the configured environment key", () => {
  assert.equal(keyFileName, `${publicKey}.txt`);
  assert.equal(publicKey, getIndexNowKey());
});
