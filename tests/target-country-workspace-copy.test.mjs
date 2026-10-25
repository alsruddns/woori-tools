import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/i18n/target-country-workspace-copy.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const translations = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const workspaceSource = await readFile(new URL("../src/components/tool/country-tools-workspace.tsx", import.meta.url), "utf8");
const dispatcherSource = await readFile(new URL("../src/components/tool/tool-workspace.tsx", import.meta.url), "utf8");

test("country workspace has complete localized copy for all eight expanded locales", () => {
  const locales = ["fil", "bn", "uk", "ms", "sv", "cs", "ro", "el"].sort();
  const keys = [
    "example", "privacyNotice", "conventions", "checkInput", "validFormat", "validChecksum", "formatDisclaimer",
    "direction", "simplifiedToTraditional", "traditionalToSimplified", "arabicToChinese", "chineseToArabic", "year",
    "checkFormat", "formatOrChecksumInvalid", "isoToLocal", "localToIso", "usDateFormat", "ukDateFormat",
    "ambiguousDate", "phonePostalDisclaimer", "cycleNote",
  ].sort();
  assert.deepEqual(Object.keys(translations.targetCountryWorkspaceCopy).sort(), locales);
  for (const locale of locales) {
    const copy = translations.targetCountryWorkspaceCopy[locale];
    assert.deepEqual(Object.keys(copy).sort(), keys, `${locale} keys`);
    for (const [key, value] of Object.entries(copy)) {
      assert.equal(typeof value, "string", `${locale}.${key} is text`);
      assert.ok(value.trim(), `${locale}.${key} is not empty`);
      assert.notEqual(value, "Example: ", `${locale}.${key} is not an English fallback`);
      assert.notEqual(value, "Check input.", `${locale}.${key} is not an English fallback`);
      assert.notEqual(value, "Year", `${locale}.${key} is not an English fallback`);
      assert.notEqual(value, "Direction", `${locale}.${key} is not an English fallback`);
    }
  }
});

test("expanded country tools receive the route locale through the shared workspace", () => {
  assert.match(workspaceSource, /locale:\s*TargetLocale/);
  assert.match(workspaceSource, /targetCountryWorkspaceCopy\[locale\]/);
  assert.match(dispatcherSource, /locale=\{isTargetPageMessageLocale\(phaseLocale\)\s*\?\s*phaseLocale\s*:\s*specializedLocale\}/);
});
