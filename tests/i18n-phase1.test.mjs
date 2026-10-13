import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function importTs(path, replacements = []) {
  let source = await readFile(new URL(path, import.meta.url), "utf8");
  for (const [from, to] of replacements) source = source.replace(from, to);
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}

const { tools } = await importTs("../src/registry/tools.ts");
const { locales } = await importTs("../src/i18n/routing.ts");
const { localizeTool } = await importTs("../src/registry/tool-translations.ts");
const { getToolContent } = await importTs("../src/registry/tool-content.ts");
const { getMessages } = await importTs("../src/i18n/messages.ts");
const firstFifteen = ["lotto-number-generator", "powerball-number-generator", "mega-millions-number-generator", "japan-loto6-number-generator", "japan-loto7-number-generator", "japan-mini-loto-number-generator", "tarot-card", "daily-fortune", "saju", "random-number", "random-name-picker", "random-wheel", "draw-lots", "random-team-maker", "random-order"];

test("Phase 1 locale support matches the first 15 public registry tools", () => {
  assert.equal(locales.length, 15);
  assert.equal(tools.length, 109);
  assert.deepEqual(tools.filter(({ supportedLocales }) => supportedLocales.length === 15).map(({ slug }) => slug), firstFifteen);
  const omissions = [];
  for (const tool of tools) {
    const expected = firstFifteen.includes(tool.slug) ? locales : ["ko", "en", "ja", "zh"];
    if (JSON.stringify(tool.supportedLocales) !== JSON.stringify(expected)) omissions.push(`${tool.slug}: ${tool.supportedLocales.join(",")}`);
    for (const locale of tool.supportedLocales) {
      const localized = localizeTool(tool, locale);
      if (!localized.title?.trim()) omissions.push(`${tool.slug}/${locale}: missing name`);
      if (!localized.description?.trim()) omissions.push(`${tool.slug}/${locale}: missing description`);
      if (firstFifteen.includes(tool.slug) && locale !== "ko" && locale !== "en" && locale !== "ja" && locale !== "zh") {
        if (localized.title === tool.title || localized.description === tool.description) omissions.push(`${tool.slug}/${locale}: English/Korean fallback`);
        const content = getToolContent(tool.slug, locale, localized.description);
        if (!content || !content.overview || content.steps.length < 3 || !content.example || !content.options || !content.caution || !content.headings.faq || !content.headings.privacyQuestion) omissions.push(`${tool.slug}/${locale}: missing localized guide/FAQ content`);
      }
    }
  }
  assert.deepEqual(omissions, [], `Localization omissions:\n${omissions.join("\n")}`);
});

test("Phase 1 keeps the locale route and hreflang spellings distinct", async () => {
  const { localeConfig } = await importTs("../src/i18n/routing.ts");
  const omissions = [];
  if (localeConfig.find(({ routeLocale }) => routeLocale === "pt-br")?.hreflang !== "pt-BR") omissions.push("pt-br must use pt-BR hreflang");
  if (localeConfig.find(({ routeLocale }) => routeLocale === "zh-tw")?.hreflang !== "zh-TW") omissions.push("zh-tw must use zh-TW hreflang");
  assert.deepEqual(omissions, []);
});

test("language switching stays on supported locales and falls back to English then Korean", async () => {
  const { resolveLocaleSelection } = await importTs("../src/i18n/routing.ts");
  const omissions = [];
  if (resolveLocaleSelection("fr", ["ko", "en", "ja", "zh"]) !== "en") omissions.push("unsupported locale should choose English when available");
  if (resolveLocaleSelection("fr", ["ko", "ja"]) !== "ko") omissions.push("unsupported locale should choose Korean when English is unavailable");
  if (resolveLocaleSelection("fr", locales) !== "fr") omissions.push("supported locale should remain selected");
  assert.deepEqual(omissions, []);
});

test("common navigation, privacy, search, and action labels are translated in every new locale", () => {
  const keys = ["language", "tools", "categories", "privacy", "terms", "footerTagline", "homeEyebrow", "homeTitle", "homeDescription", "popularTools", "popularDescription", "recommendedTools", "recommendedDescription", "allTools", "viewAll", "openToolMenu", "closeToolMenu", "toolCount", "sidebarSearch", "sidebarNoResults", "search", "searchPlaceholder", "searchEmpty", "filePrivacy", "breadcrumb", "howTo", "introduction", "faq", "relatedTools", "freeQuestion", "privacyQuestion", "privacyAnswer", "sizeQuestion", "freeAnswer", "sizeAnswer", "fileStep", "textStep", "optionsStep", "resultStep", "introPrivacy", "privacyNotice", "categoryHeading", "result", "download", "copy", "reset", "clear", "quality", "option"];
  const omissions = [];
  for (const locale of locales.slice(4)) {
    const dictionary = getMessages(locale);
    for (const key of keys) if (typeof dictionary[key] !== "string" || !dictionary[key].trim()) omissions.push(`${locale}: missing ${key}`);
    const english = getMessages("en");
    for (const key of keys) if (dictionary[key] === english[key]) omissions.push(`${locale}: English fallback in ${key}`);
  }
  assert.deepEqual(omissions, [], `Common UI translation omissions:\n${omissions.join("\n")}`);
});

function unwrapObject(node) {
  if (node && ts.isElementAccessExpression(node)) node = node.expression;
  while (node && (ts.isAsExpression(node) || ts.isParenthesizedExpression(node) || ts.isSatisfiesExpression(node))) node = node.expression;
  return node && ts.isObjectLiteralExpression(node) ? node : null;
}

function readLocaleDictionary(sourceFile, declarationName) {
  let found;
  function visit(node) {
    if (!found && ts.isVariableDeclaration(node) && node.name.getText(sourceFile) === declarationName) found = unwrapObject(node.initializer);
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  assert.ok(found, `Could not find locale dictionary ${declarationName} in ${sourceFile.fileName}`);
  const properties = found.properties.filter(ts.isPropertyAssignment);
  const keys = properties.map((property) => property.name.getText(sourceFile).replace(/^['"]|['"]$/g, ""));
  const directLocaleMap = locales.slice(4).every((locale) => keys.includes(locale)) && (keys.includes("en") || !locales.slice(0, 4).some((locale) => keys.includes(locale)));
  const entries = new Map(properties.map((property) => [property.name.getText(sourceFile).replace(/^['"]|['"]$/g, ""), directLocaleMap ? (unwrapObject(property.initializer) ?? property.initializer) : unwrapObject(property.initializer)]));
  return entries;
}

test("interactive workspace dictionaries cover all locales with complete translated keys", async () => {
  const newLocales = locales.slice(4);
  const checks = [
    ["../src/components/copy-toast.tsx", ["copyMessages"]],
    ["../src/components/tool/special-random-workspaces.tsx", ["copy", "lottoLabels", "selectionConflict", "specialPrompt", "specialRequired", "officialNotice", "translations", "wheelCopy", "starterByLocale", "teamPrefix", "labels"]],
    ["../src/components/tool/fortune-workspace.tsx", ["tarotText", "dailyText", "dailyPools", "tarotNames", "tarotReading"]],
    ["../src/components/tool/saju-workspace.tsx", ["labels"]],
  ];
  const omissions = [];
  for (const [path, dictionaries] of checks) {
    const sourceText = await readFile(new URL(path, import.meta.url), "utf8");
    const sourceFile = ts.createSourceFile(path, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    for (const name of dictionaries) {
      const entries = readLocaleDictionary(sourceFile, name);
      for (const locale of newLocales) {
        const dictionary = entries.get(locale);
        if (!dictionary) { omissions.push(`${name}/${locale}: missing locale`); continue; }
        const english = entries.get("en");
        const keys = (object) => object?.properties.filter(ts.isPropertyAssignment).map((item) => item.name.getText(sourceFile).replace(/^['"]|['"]$/g, "")).sort() ?? [];
        if (dictionary && english && ts.isObjectLiteralExpression(dictionary) && ts.isObjectLiteralExpression(english) && JSON.stringify(keys(dictionary)) !== JSON.stringify(keys(english))) omissions.push(`${name}/${locale}: dictionary key set differs from en`);
        if (!ts.isObjectLiteralExpression(dictionary)) continue;
        for (const property of dictionary.properties.filter(ts.isPropertyAssignment)) {
          const value = property.initializer;
          if (ts.isStringLiteral(value) && value.text.trim().split(/\s+/).length >= 4) {
            const englishValue = english?.properties.find((item) => ts.isPropertyAssignment(item) && item.name.getText(sourceFile) === property.name.getText(sourceFile))?.initializer;
            if (englishValue && ts.isStringLiteral(englishValue) && value.text === englishValue.text) omissions.push(`${name}/${locale}/${property.name.getText(sourceFile)}: English sentence fallback`);
          }
        }
      }
    }
  }
  assert.deepEqual(omissions, [], `Workspace localization omissions:\n${omissions.join("\n")}`);
});
