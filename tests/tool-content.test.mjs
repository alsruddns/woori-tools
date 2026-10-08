import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/registry/tool-content.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { getToolContent } = await import("data:text/javascript;base64," + Buffer.from(outputText).toString("base64"));
const slugs = [...source.matchAll(/^  (?:"([^"]+)"|([\w-]+)):\s*\{/gm)]
  .map((match) => match[1] ?? match[2])
  .filter((slug) => !["ko", "en", "ja", "zh"].includes(slug));

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
    const copy = slugs.map((slug) => getToolContent(slug, locale).overview);
    assert.equal(new Set(copy).size, copy.length);
  }
});
