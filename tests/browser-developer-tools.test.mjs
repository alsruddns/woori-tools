import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function importTs(path) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}

const tools = await importTs("../src/lib/browser-developer-tools.ts");
const { locales } = await importTs("../src/i18n/routing.ts");
const translations = await importTs("../src/registry/new-tool-translations.ts");

test("JWT decoder reads payload and expiry without making a signature claim", () => {
  const payload = Buffer.from(JSON.stringify({ sub: "local-user", exp: 2_000 })).toString("base64url");
  assert.deepEqual(tools.decodeJwt(`header.${payload}.signature`, 1_000_000), { payload: { sub: "local-user", exp: 2_000 }, expiry: 2_000_000, status: "active" });
  assert.equal(tools.decodeJwt(`header.${payload}.signature`, 3_000_000).status, "expired");
  assert.equal(tools.decodeJwt(`header.${Buffer.from("{}").toString("base64url")}.signature`).status, "no-exp");
  assert.throws(() => tools.decodeJwt("not-a-token"));
});

test("URL query parser retains repeated keys and user agent parser remains heuristic", () => {
  assert.deepEqual(tools.parseUrlQuery("https://example.test/p?a=1&a=2&empty="), [["a", "1"], ["a", "2"], ["empty", ""]]);
  assert.deepEqual(tools.inspectUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36"), { browser: "Chrome", version: "122.0.0.0", os: "Windows", mobile: false });
});

test("IPv4 CIDR calculator handles network boundaries and rejects invalid input", () => {
  const result = tools.calculateIpv4Cidr("192.168.1.15/24");
  assert.equal(result.network, "192.168.1.0");
  assert.equal(result.broadcast, "192.168.1.255");
  assert.equal(result.netmask, "255.255.255.0");
  assert.equal(result.usableCount, "254");
  assert.equal(result.binary, "11000000.10101000.00000001.00001111");
  assert.equal(tools.calculateIpv4Cidr("10.0.0.2/31").usableCount, "2");
  assert.throws(() => tools.calculateIpv4Cidr("999.1.1.1/24"));
});

test("Base32 round trips UTF-8 and rejects invalid alphabet", () => {
  const encoded = tools.encodeBase32("Woori 도구");
  assert.equal(tools.decodeBase32(encoded), "Woori 도구");
  assert.throws(() => tools.decodeBase32("ABC0"));
});

test("UUID v7 and ULID use the supplied timestamp and valid encodings", () => {
  const fixedCrypto = { getRandomValues(bytes) { bytes.fill(0); return bytes; } };
  const uuid = tools.createUuidV7(1_700_000_000_000, fixedCrypto);
  assert.match(uuid, /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(uuid.replaceAll("-", "").slice(0, 12), "018bcfe56800");
  const ulid = tools.createUlid(1_700_000_000_000, fixedCrypto);
  assert.match(ulid, /^[0-9A-HJKMNP-TV-Z]{26}$/);
  assert.equal(ulid.slice(0, 10), "01HF7YAT00");
});

test("hash comparison, regex replacement, entities, and chmod produce local results", () => {
  assert.equal(tools.compareHashes("SHA-256: ABCD", "abcd").equal, true);
  assert.equal(tools.compareHashes("", "").equal, false);
  assert.equal(tools.replaceWithRegex("/cat/i", "Cat cat", "dog"), "dog dog");
  assert.throws(() => tools.replaceWithRegex("/(a+)+/", "aaaa", "x"));
  assert.equal(tools.encodeHtmlEntities("<a title='x'>&"), "&lt;a title=&#39;x&#39;&gt;&amp;");
  assert.deepEqual(tools.calculateChmod("755"), { octal: "755", symbolic: "rwxr-xr-x", owner: "rwx", group: "r-x", others: "r-x" });
  assert.throws(() => tools.calculateChmod("888"));
});

test("JSONPath subset, CSV and TSV conversion, URL slugs, and Unicode points", () => {
  assert.deepEqual(tools.evaluateJsonPath('{"items":[{"name":"A"},{"name":"B"}]}', "$.items[*].name"), ["A", "B"]);
  assert.deepEqual(tools.evaluateJsonPath('{"a":{"b":3}}', '$["a"].b'), [3]);
  assert.throws(() => tools.evaluateJsonPath("{}", "$.a[?(@.x)]"));
  assert.equal(tools.convertCsvTsv('name,note\nA,"x,y"', "csv-to-tsv"), 'name\tnote\nA\tx,y');
  assert.equal(tools.convertCsvTsv('name\tnote\nA\t"x,y"', "tsv-to-csv"), 'name,note\nA,"x,y"');
  assert.equal(tools.createUrlSlug("Crème brûlée: A Guide"), "creme-brulee-a-guide");
  assert.deepEqual(tools.inspectCodePoints("A😀").map(({ codePoint, utf8Bytes }) => [codePoint, utf8Bytes]), [["U+0041", 1], ["U+1F600", 4]]);
});

test("new tool metadata has real non-empty translations in every supported locale", () => {
  assert.equal(locales.length, 15);
  for (const slug of translations.newToolSlugs) for (const locale of locales) {
    const entry = translations.getNewToolTranslation(slug, locale);
    assert.ok(entry?.title.trim(), `${slug}/${locale} title`);
    assert.ok(entry?.description.trim(), `${slug}/${locale} description`);
    assert.notEqual(entry.title, slug);
    assert.ok(entry.keywords.length >= 2);
  }
});
