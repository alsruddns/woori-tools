import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function importTs(path, replacements = []) {
  let source = await readFile(new URL(path, import.meta.url), "utf8");
  for (const [from, to] of replacements) source = source.replace(from, to);
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}

const { locales } = await importTs("../src/i18n/routing.ts");
const { COUNTRY_TOOL_SLUGS } = await importTs("../src/lib/country-tool-slugs.ts");
globalThis.__catalogCountrySlugs = COUNTRY_TOOL_SLUGS;
const countryTranslations = await importTs("../src/registry/country-tool-translations.ts", [[
  'import { COUNTRY_TOOL_SLUGS } from "../lib/country-tool-slugs";',
  "const COUNTRY_TOOL_SLUGS = globalThis.__catalogCountrySlugs;",
]]);
globalThis.__catalogCountryTranslations = countryTranslations.countryToolTranslations;
const { registeredTools } = await importTs("../src/registry/tools.ts", [
  ['import { locales, type PublishedTargetLocale } from "../i18n/routing";', `const locales = ${JSON.stringify(locales)};`],
  ['import { COUNTRY_TOOL_SLUGS } from "../lib/country-tool-slugs";', "const COUNTRY_TOOL_SLUGS = globalThis.__catalogCountrySlugs;"],
  ['import { countryToolTranslations } from "./country-tool-translations";', "const countryToolTranslations = globalThis.__catalogCountryTranslations;"],
  ['import { targetLocalePublication } from "./target-locale-publication";', 'const targetLocalePublication = { ru: { publishedToolSlugs: ["barcode-generator"] } };'],
]);

test("service catalog contains every registry tool once with matching publication and locale data", async () => {
  const catalog = await readFile(new URL("../docs/service-catalog.md", import.meta.url), "utf8");
  const rows = catalog.split(/\r?\n/).filter((line) => /^\| \d+ \|/.test(line)).map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));
  assert.equal(rows.length, registeredTools.length, "one catalog row per registered Tool");
  const slugs = rows.map((row) => row[5]);
  assert.equal(new Set(slugs).size, slugs.length, "catalog slugs are unique");
  assert.deepEqual(slugs, registeredTools.map(({ slug }) => slug), "catalog order follows registry order");
  const missing = [];
  for (const [index, tool] of registeredTools.entries()) {
    const [order, serviceName, currentStatus, policyReview, localeList, slug] = rows[index];
    if (Number(order) !== index + 1) missing.push(`${slug}: wrong sequence`);
    if (!serviceName) missing.push(`${slug}: service name is empty`);
    if (slug !== tool.slug) missing.push(`${slug}: slug mismatch`);
    if (tool.isPublic && currentStatus !== "open") missing.push(`${slug}: public Tool is not open`);
    if (!tool.isPublic && !currentStatus.startsWith("close - ")) missing.push(`${slug}: private Tool has no close reason`);
    if (!/^(true|false)$/.test(policyReview)) missing.push(`${slug}: policy field must be true or false`);
    if (localeList !== tool.supportedLocales.join(",")) missing.push(`${slug}: locale list differs from supportedLocales`);
  }
  assert.deepEqual(missing, [], missing.join("\n"));
  assert.match(catalog, /서비스현황 및 사유/);
  assert.match(catalog, /다국어 적용 현황/);
  assert.match(catalog, /실제 URL: https:\/\/www\.woori\.today\/\{locale\}\/tools\/\{slug\}/);
});
