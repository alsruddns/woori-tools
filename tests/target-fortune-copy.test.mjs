import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/i18n/target-fortune-copy.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const copy = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const workspace = await readFile(new URL("../src/components/tool/fortune-workspace.tsx", import.meta.url), "utf8");
const dispatcher = await readFile(new URL("../src/components/tool/tool-workspace.tsx", import.meta.url), "utf8");
const publication = await readFile(new URL("../src/registry/target-locale-publication.ts", import.meta.url), "utf8");

const locales = ["fil", "bn", "uk", "ms", "sv", "cs", "ro", "el"];

test("daily fortune copy is complete for every expansion locale", () => {
  for (const locale of locales) {
    assert.ok(copy.getTargetDailyFortuneCopy(locale));
  }
  for (const locale of locales) {
    const messages = copy.getTargetDailyFortuneCopy(locale);
    for (const [key, value] of Object.entries(messages)) {
      assert.ok(Array.isArray(value) ? value.length >= 3 && value.every((entry) => entry.trim()) : typeof value === "string" && value.trim(), `${locale}.${key}`);
    }
    assert.equal(messages.colors.length, 6, `${locale}.colors`);
  }
});

test("tarot workspace copy includes localized labels, names, and upright and reversed readings", () => {
  for (const locale of locales) assert.ok(copy.getTargetTarotCopy(locale));
  for (const locale of locales) {
    const messages = copy.getTargetTarotCopy(locale);
    for (const [key, value] of Object.entries(messages)) {
      const expectedLength = key === "positions" ? 3 : 22;
      assert.ok(Array.isArray(value) ? value.length === expectedLength && value.every((entry) => entry.trim()) : typeof value === "string" && value.trim(), `${locale}.${key}`);
    }
    assert.equal(messages.positions.length, 3, `${locale}.positions`);
  }
});

test("fortune workspaces receive the requested locale and both routes are published after verification", () => {
  assert.match(workspace, /getTargetTarotCopy\(locale\)/);
  assert.match(workspace, /getTargetDailyFortuneCopy\(locale\)/);
  assert.match(workspace, /targetCopy\.cardNames\[cardIndex\]/);
  assert.match(workspace, /targetCopy\.uprightThemes/);
  assert.match(dispatcher, /TarotWorkspace locale=\{phaseLocale === "pl" \|\| isPlannedLocale\(phaseLocale\) \? phaseLocale : specializedLocale\}/);
  assert.match(dispatcher, /DailyFortuneWorkspace locale=\{phaseLocale === "pl" \|\| isPlannedLocale\(phaseLocale\) \? phaseLocale : specializedLocale\}/);
  assert.ok(publication.includes('expandedFortuneWorkspaceVerifiedSlugs = ["tarot-card", "daily-fortune"]'));
});
