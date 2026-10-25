import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/i18n/target-saju-copy.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const translations = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const workspaceSource = await readFile(new URL("../src/components/tool/saju-workspace.tsx", import.meta.url), "utf8");
const dispatcherSource = await readFile(new URL("../src/components/tool/tool-workspace.tsx", import.meta.url), "utf8");
const publicationSource = await readFile(new URL("../src/registry/target-locale-publication.ts", import.meta.url), "utf8");

test("Saju controls and Korea-specific calculation notes are translated for all expansion locales", () => {
  const locales = ["fil", "bn", "uk", "ms", "sv", "cs", "ro", "el"];
  const keys = ["birth", "time", "calendar", "solar", "lunar", "leap", "calculate", "again", "pillars", "year", "month", "day", "hour", "elements", "wood", "fire", "earth", "metal", "water", "basis", "method", "privacy", "note", "error"].sort();
  assert.deepEqual(Object.keys(translations.targetSajuCopy).sort(), [...locales].sort());
  for (const locale of locales) {
    const copy = translations.targetSajuCopy[locale];
    assert.deepEqual(Object.keys(copy).sort(), keys, `${locale} dictionary keys`);
    for (const [key, value] of Object.entries(copy)) assert.ok(typeof value === "string" && value.trim(), `${locale}.${key}`);
    assert.match(copy.basis, /KST|Korea|Korean|korej|Kore|한국|Koreya|Кор|韓国|कोरिया/);
  }
});

test("expanded Saju routes pass their locale into the translated workspace", () => {
  assert.match(workspaceSource, /getTargetSajuCopy\(locale\)/);
  assert.match(workspaceSource, /elementNames:Record<string,typeof elementMap>.*"fil".*"el"/s);
  assert.match(dispatcherSource, /tool\.slug === "saju"\) return <SajuWorkspace locale=\{phaseLocale\}/);
  assert.ok(publicationSource.includes('expandedSajuWorkspaceVerifiedSlugs = ["saju"]'));
});
