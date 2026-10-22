import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/i18n/routing.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const routing = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const copySource = await readFile(new URL("../src/i18n/target-locale-copy.ts", import.meta.url), "utf8");
const { outputText: copyOutput } = ts.transpileModule(copySource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { targetCoreMessages } = await import(`data:text/javascript;base64,${Buffer.from(copyOutput).toString("base64")}`);

test("target locales are distinct from published locales until translations are complete", () => {
  const expected = ["ru", "tr", "pl", "fil", "bn", "uk", "ms", "sv", "cs", "ro", "el"];
  assert.equal(routing.locales.length, 15);
  assert.equal(routing.targetLocales.length, 26);
  assert.deepEqual(routing.plannedLocaleConfig.map(({ routeLocale }) => routeLocale), expected);
  assert.equal(new Set(routing.targetLocales).size, 26);

  for (const locale of expected) {
    assert.equal(routing.isTargetLocale(locale), true);
    assert.equal(routing.isLocale(locale), false);
    assert.equal(routing.targetLocaleLabels[locale].length > 0, true);
  }
});

test("each planned locale has the complete translated core UI message set", () => {
  const expectedKeys = [
    "language", "tools", "categories", "privacy", "terms", "allTools", "search", "searchPlaceholder",
    "howTo", "introduction", "faq", "relatedTools", "result", "download", "process", "run", "processing",
    "reset", "copy", "clear", "chooseOrDrop", "selectFile", "filePrivacy", "error",
  ].sort();
  assert.deepEqual(Object.keys(targetCoreMessages).sort(), routing.plannedLocaleConfig.map(({ routeLocale }) => routeLocale).sort());
  for (const [locale, messages] of Object.entries(targetCoreMessages)) {
    assert.deepEqual(Object.keys(messages).sort(), expectedKeys, `${locale} core UI keys`);
    for (const [key, value] of Object.entries(messages)) {
      assert.equal(typeof value, "string", `${locale}.${key} must be text`);
      assert.ok(value.trim().length > 0, `${locale}.${key} must not be empty`);
    }
  }
});
