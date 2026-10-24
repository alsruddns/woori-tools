import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/registry/target-tool-option-copy.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const copy = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

test("all target locales have complete translated option and rename control copy", () => {
  const locales = ["ru", "tr", "pl", "fil", "bn", "uk", "ms", "sv", "cs", "ro", "el"];
  const optionKeys = ["noRepeat", "repeat", "digits", "latin", "hangul", "special", "custom", "square", "portraitPreset", "story", "youtube", "xpost", "facebook", "grid3", "grid6", "grid9", "collage4", "collage6", "renameRules", "renameHint"];
  const renameKeys = ["prefix", "suffix", "find", "replace", "start", "padding", "before", "after", "empty"];

  assert.deepEqual(Object.keys(copy.targetToolOptionLabels).sort(), [...locales].sort());
  assert.deepEqual(Object.keys(copy.targetRenameCopy).sort(), [...locales].sort());
  assert.deepEqual(Object.keys(copy.targetSelectionLimitMessages).sort(), [...locales].sort());
  for (const locale of locales) {
    assert.deepEqual(Object.keys(copy.targetToolOptionLabels[locale]).sort(), [...optionKeys].sort(), `${locale} options`);
    assert.deepEqual(Object.keys(copy.targetRenameCopy[locale]).sort(), [...renameKeys].sort(), `${locale} rename controls`);
    for (const [key, value] of Object.entries(copy.targetToolOptionLabels[locale])) {
      assert.equal(typeof value, "string", `${locale}.${key} should be text`);
      assert.ok(value.trim(), `${locale}.${key} is empty`);
      assert.notEqual(value, key, `${locale}.${key} is a raw key`);
    }
    for (const [key, value] of Object.entries(copy.targetRenameCopy[locale])) {
      assert.equal(typeof value, "string", `${locale}.rename.${key} should be text`);
      assert.ok(value.trim(), `${locale}.rename.${key} is empty`);
      assert.notEqual(value, key, `${locale}.rename.${key} is a raw key`);
    }
    for (const [key, value] of Object.entries(copy.targetSelectionLimitMessages[locale])) {
      assert.equal(typeof value, "string", `${locale}.limits.${key} should be text`);
      assert.ok(value.trim(), `${locale}.limits.${key} is empty`);
    }
  }
});
