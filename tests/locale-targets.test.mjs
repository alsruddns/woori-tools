import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/i18n/routing.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const routing = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

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
