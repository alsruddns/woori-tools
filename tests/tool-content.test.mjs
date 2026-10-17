import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

let source = await readFile(new URL("../src/registry/tool-content.ts", import.meta.url), "utf8");
const slugSource = await readFile(new URL("../src/lib/country-tool-slugs.ts", import.meta.url), "utf8");
const exampleSource = await readFile(new URL("../src/registry/tool-example-inputs.ts", import.meta.url), "utf8");
const { outputText: examplesModule } = ts.transpileModule(exampleSource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { toolExampleInputs } = await import("data:text/javascript;base64," + Buffer.from(examplesModule).toString("base64"));
const riskSource = await readFile(new URL("../src/registry/tool-risk-notes.ts", import.meta.url), "utf8");
const { outputText: riskModule } = ts.transpileModule(riskSource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
globalThis.__getToolRiskNote = (await import("data:text/javascript;base64," + Buffer.from(riskModule).toString("base64"))).getToolRiskNote;
const countrySlugs = [...slugSource.matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1]);
source = source.replace('import { COUNTRY_TOOL_SLUGS } from "@/lib/country-tool-slugs";', `const COUNTRY_TOOL_SLUGS = ${JSON.stringify(countrySlugs)};`);
source = source.replace('import { toolExampleInputs } from "@/registry/tool-example-inputs";', `const toolExampleInputs = ${JSON.stringify(toolExampleInputs)};`);
source = source.replace('import { getToolRiskNote } from "@/registry/tool-risk-notes";', 'const getToolRiskNote = globalThis.__getToolRiskNote;');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { getToolContent } = await import("data:text/javascript;base64," + Buffer.from(outputText).toString("base64"));
const contentStart = source.indexOf("const content:");
const headingsStart = source.indexOf("const headings:");
const contentSource = source.slice(contentStart, headingsStart);
const slugs = [...contentSource.matchAll(/^  (?:"([^"]+)"|([\w-]+)):\s*\{/gm)]
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
