import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/i18n/target-lottery-copy.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const translations = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const workspaceSource = await readFile(new URL("../src/components/tool/special-random-workspaces.tsx", import.meta.url), "utf8");
const dispatcherSource = await readFile(new URL("../src/components/tool/tool-workspace.tsx", import.meta.url), "utf8");
const publicationSource = await readFile(new URL("../src/registry/target-locale-publication.ts", import.meta.url), "utf8");

test("lottery workspace copy is complete and translated for all eight expansion locales", () => {
  const locales = ["fil", "bn", "uk", "ms", "sv", "cs", "ro", "el"];
  const expectedKeys = [
    "generate", "again", "five", "notice", "result", "gameUnit", "copy", "copyAll", "reset", "games", "one",
    "include", "exclude", "selection", "included", "excluded", "clear", "oddEven", "auto", "odd", "even", "sorted",
    "unique", "history", "clearHistory", "reuse", "count", "includeMax", "selectMode", "copyFailed", "includeLimit",
    "includedConflict", "excludedConflict", "specialPrompt", "specialRequired", "officialNotice", "errors",
  ].sort();
  assert.deepEqual(Object.keys(translations.targetLotteryCopy).sort(), locales.sort());
  for (const locale of locales) {
    const copy = translations.targetLotteryCopy[locale];
    assert.deepEqual(Object.keys(copy).sort(), expectedKeys, `${locale} keys`);
    for (const [key, value] of Object.entries(copy)) {
      if (key === "errors") {
        assert.equal(value.length, 4, `${locale}.${key} error cases`);
        assert.ok(value.every((message) => message.trim()), `${locale}.${key} messages`);
      } else {
        assert.equal(typeof value, "string", `${locale}.${key} is text`);
        assert.ok(value.trim(), `${locale}.${key} is not empty`);
      }
    }
    assert.ok(copy.includeLimit.includes("{count}"), `${locale} preserves the count variable`);
  }
});

test("lottery workspace uses the expanded locale resolver and all six tools pass the publication gate", () => {
  const expectedTools = [
    "lotto-number-generator", "powerball-number-generator", "mega-millions-number-generator",
    "japan-loto6-number-generator", "japan-loto7-number-generator", "japan-mini-loto-number-generator",
  ];
  assert.match(workspaceSource, /getTargetLotteryCopy\(locale\)/);
  assert.match(workspaceSource, /targetCopy\?\.officialNotice/);
  assert.match(dispatcherSource, /LottoWorkspace locale=\{phaseLocale\}/);
  for (const slug of expectedTools) assert.ok(publicationSource.includes(`"${slug}"`), `${slug} is published`);
});
