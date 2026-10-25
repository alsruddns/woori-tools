import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/i18n/target-special-random-copy.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const translations = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const workspaceSource = await readFile(new URL("../src/components/tool/special-random-workspaces.tsx", import.meta.url), "utf8");
const dispatcherSource = await readFile(new URL("../src/components/tool/tool-workspace.tsx", import.meta.url), "utf8");
const publicationSource = await readFile(new URL("../src/registry/target-locale-publication.ts", import.meta.url), "utf8");

test("random wheel and duty picker copy is complete in all expansion locales", () => {
  const locales = ["fil", "bn", "uk", "ms", "sv", "cs", "ro", "el"];
  assert.deepEqual(Object.keys(translations.wheel).sort(), [...locales].sort());
  assert.deepEqual(Object.keys(translations.duty).sort(), [...locales].sort());
  for (const locale of locales) {
    for (const [key, value] of Object.entries(translations.wheel[locale])) {
      if (key === "starterOptions") assert.equal(value.length, 4, `${locale}.${key}`);
      else assert.ok(typeof value === "string" && value.trim(), `${locale}.${key}`);
    }
    for (const [key, value] of Object.entries(translations.duty[locale])) assert.ok(typeof value === "string" && value.trim(), `${locale}.${key}`);
  }
});

test("wheel and duty controls receive the page locale and enter the publication allowlist", () => {
  assert.match(workspaceSource, /getTargetWheelCopy\(locale\)/);
  assert.match(workspaceSource, /getTargetDutyPickerCopy\(locale\)/);
  assert.match(dispatcherSource, /tool\.slug === "random-wheel"\) return <RandomWheelWorkspace locale=\{phaseLocale\}/);
  assert.match(dispatcherSource, /tool\.slug === "duty-picker" && isPlannedLocale\(phaseLocale\).*RussianDutyPickerWorkspace locale=\{phaseLocale\}/);
  assert.ok(publicationSource.includes('expandedWheelDutyWorkspaceVerifiedSlugs = ["random-wheel", "duty-picker"]'));
});
