import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

let source = await readFile(new URL("../src/registry/tool-content.ts", import.meta.url), "utf8");
const slugSource = await readFile(new URL("../src/lib/country-tool-slugs.ts", import.meta.url), "utf8");
const countrySlugs = [...slugSource.matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1]);
source = source.replace('import { COUNTRY_TOOL_SLUGS } from "@/lib/country-tool-slugs";', `const COUNTRY_TOOL_SLUGS = ${JSON.stringify(countrySlugs)};`);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { getToolContent } = await import("data:text/javascript;base64," + Buffer.from(outputText).toString("base64"));
const slugs = [...source.matchAll(/^  (?:"([^"]+)"|([\w-]+)):\s*\{/gm)]
  .map((match) => match[1] ?? match[2])
  .filter((slug) => !["ko", "en", "ja", "zh"].includes(slug))
  .concat(countrySlugs);

test("search-focused tools have complete localized editorial sections", () => {
  assert.ok(slugs.length >= 20);
  for (const slug of slugs) {
    for (const locale of ["ko", "en", "ja", "zh"]) {
      const copy = getToolContent(slug, locale);
      assert.ok(copy, slug + " is missing locale " + locale);
      assert.ok(copy.overview.length > 15, slug + " " + locale + " overview is too short");
      assert.equal(copy.steps.length, 3);
      assert.ok(copy.example);
      assert.ok(copy.options);
      assert.ok(copy.caution);
      assert.ok(copy.headings.faq);
    }
  }
});

test("editorial overview copy is unique per tool and locale", () => {
  for (const locale of ["ko", "en", "ja", "zh"]) {
    const copy = slugs.map((slug) => getToolContent(slug, locale, countrySlugs.includes(slug) ? `localized-${slug}` : undefined).overview);
    assert.equal(new Set(copy).size, copy.length);
  }
});
