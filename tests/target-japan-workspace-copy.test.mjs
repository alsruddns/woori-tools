import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/i18n/target-japan-workspace-copy.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const translations = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const workspaceSource = await readFile(new URL("../src/components/tool/japan-tools-workspace.tsx", import.meta.url), "utf8");
const dispatcherSource = await readFile(new URL("../src/components/tool/tool-workspace.tsx", import.meta.url), "utf8");

test("Japan-specific workspaces have complete translated controls and Japan-scoped guidance", () => {
  const locales = ["fil", "bn", "uk", "ms", "sv", "cs", "ro", "el"].sort();
  const keys = [
    "source", "target", "input", "date", "era", "year", "month", "day", "gender", "male", "female", "convert",
    "toHira", "toKata", "toFull", "toHalf", "generate", "again", "count", "note", "result", "history", "copy", "reset",
    "direction", "currentYear", "before", "main", "after", "branch", "eto", "free", "error", "placeholder",
    "warekiForward", "warekiReverse", "kanjiForward", "kanjiReverse", "romajiWarning", "yakudoshiWarning", "numbers3Rules",
    "numbers4Rules", "bingo5Rules", "numbersBoxNote", "integerNote",
  ].sort();
  assert.deepEqual(Object.keys(translations.targetJapanWorkspaceCopy).sort(), locales);
  for (const locale of locales) {
    const copy = translations.targetJapanWorkspaceCopy[locale];
    assert.deepEqual(Object.keys(copy.labels).sort(), keys, `${locale} labels`);
    assert.deepEqual(Object.keys(copy.generatorButtons).sort(), ["bingo5-number-generator", "numbers3-number-generator", "numbers4-number-generator"]);
    for (const [key, value] of Object.entries(copy.labels)) {
      assert.equal(typeof value, "string", `${locale}.${key} is text`);
      assert.ok(value.trim(), `${locale}.${key} is not empty`);
      assert.notEqual(value, "Generate numbers", `${locale}.${key} is not an English fallback`);
      assert.notEqual(value, "Check the entered values.", `${locale}.${key} is not an English fallback`);
    }
    for (const value of Object.values(copy.generatorButtons)) assert.ok(value.trim());
  }
});

test("expanded Japanese tools pass their page locale into the specialized workspace", () => {
  assert.match(workspaceSource, /locale:\s*TargetLocale/);
  assert.match(workspaceSource, /targetJapanWorkspaceCopy\[locale\]/);
  assert.match(dispatcherSource, /locale=\{isTargetPageMessageLocale\(phaseLocale\)\s*\?\s*phaseLocale\s*:\s*phaseLocale === "pl" \? "pl" : specializedLocale\}/);
});
