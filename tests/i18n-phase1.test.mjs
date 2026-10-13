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

const { locales } = await importTs("../src/i18n/routing.ts");
const { COUNTRY_TOOL_SLUGS } = await importTs("../src/lib/country-tool-slugs.ts");
globalThis.__countryToolSlugs = COUNTRY_TOOL_SLUGS;
const countryTranslationModule = await importTs("../src/registry/country-tool-translations.ts", [[
  'import { COUNTRY_TOOL_SLUGS } from "../lib/country-tool-slugs";',
  `const COUNTRY_TOOL_SLUGS = globalThis.__countryToolSlugs;`,
]]);
globalThis.__countryToolTranslations = countryTranslationModule.countryToolTranslations;
globalThis.__countryToolKeywords = countryTranslationModule.countryToolKeywords;
const { tools } = await importTs("../src/registry/tools.ts", [
  ['import { locales, type RouteLocale as Locale } from "../i18n/routing";', `const locales = ${JSON.stringify(locales)};`],
  ['import { COUNTRY_TOOL_SLUGS } from "../lib/country-tool-slugs";', `const COUNTRY_TOOL_SLUGS = globalThis.__countryToolSlugs;`],
  ['import { countryToolTranslations } from "./country-tool-translations";', `const countryToolTranslations = globalThis.__countryToolTranslations;`],
]);
const japanTranslationModule = await importTs("../src/registry/japan-tool-translations.ts");
globalThis.__japanToolTranslations = japanTranslationModule.japanToolTranslations;
globalThis.__japanToolKeywords = japanTranslationModule.japanToolKeywords;
const { localizeTool } = await importTs("../src/registry/tool-translations.ts", [[
  'import { japanToolKeywords, japanToolTranslations } from "./japan-tool-translations";',
  'const japanToolTranslations = globalThis.__japanToolTranslations; const japanToolKeywords = globalThis.__japanToolKeywords;',
], [
  'import { countryToolKeywords, countryToolTranslations } from "./country-tool-translations";',
  'const countryToolTranslations = globalThis.__countryToolTranslations; const countryToolKeywords = globalThis.__countryToolKeywords;',
]]);
const { getToolContent } = await importTs("../src/registry/tool-content.ts", [[
  'import { COUNTRY_TOOL_SLUGS } from "@/lib/country-tool-slugs";',
  `const COUNTRY_TOOL_SLUGS = globalThis.__countryToolSlugs;`,
]]);
const expandedModule = await importTs("../src/i18n/expanded-messages.ts");
globalThis.__getExpandedMessages = expandedModule.getExpandedMessages;
const { getMessages } = await importTs("../src/i18n/messages.ts", [[
  'import { getExpandedMessages } from "./expanded-messages";',
  'const getExpandedMessages = globalThis.__getExpandedMessages;',
]]);
const { getTarotInterpretation } = await importTs("../src/lib/fortune/tarot-localization.ts");

test("all published registry tools support all 15 route locales", () => {
  assert.equal(locales.length, 15);
  assert.equal(tools.length, 160);
  assert.equal(tools.some(({ slug }) => slug === "ladder-game"), false);
  const omissions = [];
  for (const tool of tools) {
    if (JSON.stringify(tool.supportedLocales) !== JSON.stringify(locales)) omissions.push(`${tool.slug}: ${tool.supportedLocales.join(",")}`);
    for (const locale of tool.supportedLocales) {
      const localized = localizeTool(tool, locale);
      if (!localized.title?.trim()) omissions.push(`${tool.slug}/${locale}: missing name`);
      if (!localized.description?.trim()) omissions.push(`${tool.slug}/${locale}: missing description`);
      if (locale !== "ko" && locale !== "en" && locale !== "ja" && locale !== "zh") {
        if (localized.title === tool.title || localized.description === tool.description) omissions.push(`${tool.slug}/${locale}: English/Korean fallback`);
        const content = getToolContent(tool.slug, locale, localized.description);
        if (!content || !content.overview || content.steps.length < 3 || !content.example || !content.options || !content.caution || !content.headings.faq || !content.headings.privacyQuestion) omissions.push(`${tool.slug}/${locale}: missing localized guide/FAQ content`);
      }
    }
  }
  assert.deepEqual(omissions, [], `Localization omissions:\n${omissions.join("\n")}`);
});

test("Japan-specific tools have translated metadata, complete page content, and related links", () => {
  const slugs = ["wareki-converter","hiragana-katakana-converter","fullwidth-halfwidth-converter","japanese-romaji-converter","japanese-number-kanji-converter","yakudoshi-calculator","japanese-zodiac-calculator","numbers3-number-generator","numbers4-number-generator","bingo5-number-generator"];
  const omissions = [];
  for (const slug of slugs) {
    const tool = tools.find((item) => item.slug === slug);
    if (!tool) { omissions.push(`${slug}: missing registry entry`); continue; }
    if (!tool.relatedTools?.length) omissions.push(`${slug}: missing related tools`);
    for (const related of tool.relatedTools ?? []) if (!tools.some((item) => item.slug === related)) omissions.push(`${slug}: unresolved related tool ${related}`);
    for (const locale of locales) {
      const localized = localizeTool(tool, locale);
      const content = getToolContent(slug, locale, localized.description);
      if (!localized.title?.trim() || !localized.description?.trim()) omissions.push(`${slug}/${locale}: missing metadata`);
      if (locale !== "ko" && (localized.title === tool.title || localized.description === tool.description)) omissions.push(`${slug}/${locale}: metadata fallback`);
      if (!content?.overview || content.steps.length !== 3 || !content.example || !content.options || !content.caution || !content.headings.faq) omissions.push(`${slug}/${locale}: incomplete page copy`);
      if (locale !== "ja" && /[\u3040-\u30ff]/u.test(localized.title)) omissions.push(`${slug}/${locale}: Japanese title fallback`);
      if (locale === "ja" && (!localized.keywords.length || !localized.keywords.some((keyword) => keyword.includes("変換") || keyword.includes("計算") || keyword.includes("番号") || keyword.includes("予想") || keyword.includes("早見")))) omissions.push(`${slug}/ja: missing Japanese search intent terms`);
    }
  }
  assert.deepEqual(omissions, [], omissions.join("\n"));
});

test("country-specific tools have localized metadata, privacy copy, and related links", () => {
  const countrySlugs = COUNTRY_TOOL_SLUGS;
  const privacyMarkers = {ko:"브라우저",en:"browser",ja:"ブラウザー",zh:"浏览器",es:"navegador","pt-br":"navegador",de:"Browser",fr:"navigateur",vi:"trình duyệt",id:"browser",th:"เบราว์เซอร์","zh-tw":"瀏覽器",it:"browser",nl:"browser",hi:"ब्राउज़र"};
  const issues = [];
  assert.equal(countrySlugs.length, 41);
  for (const slug of countrySlugs) {
    const tool = tools.find((entry) => entry.slug === slug);
    if (!tool) { issues.push(`${slug}: missing registry entry`); continue; }
    if (!tool.relatedTools?.length || tool.relatedTools.some((related) => !tools.some((entry) => entry.slug === related))) issues.push(`${slug}: missing or unresolved related links`);
    for (const locale of locales) {
      const localized = localizeTool(tool, locale);
      const page = getToolContent(slug, locale, localized.description);
      if (!localized.title || !localized.description || (locale !== "ko" && (localized.title === tool.title || localized.description === tool.description))) issues.push(`${slug}/${locale}: metadata fallback`);
      if (!localized.description.includes(privacyMarkers[locale])) issues.push(`${slug}/${locale}: missing localized browser-only notice`);
      if (locale !== "ja" && /[\u3040-\u30ff]/u.test(localized.title)) issues.push(`${slug}/${locale}: Japanese title fallback`);
      if (!page?.overview || page.steps.length !== 3 || !page.example || !page.caution || !page.headings.faq || !page.headings.privacyQuestion) issues.push(`${slug}/${locale}: missing localized SEO guide`);
    }
  }
  assert.deepEqual(issues, [], issues.join("\n"));
});

test("country-tool workspace copy provides localized controls, privacy, and validation outcomes for every locale", async () => {
  const source = await readFile(new URL("../src/components/tool/country-tools-workspace.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /localStorage|sessionStorage|fetch\s*\(|analytics/i, "identifier values must remain local and unsaved");
  const ast = ts.createSourceFile("country-tools-workspace.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let rows;
  let supplemental;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(ast) === "words" && ts.isArrayLiteralExpression(node.initializer)) rows = node.initializer.elements;
    if (ts.isVariableDeclaration(node) && node.name.getText(ast) === "extraUi" && ts.isObjectLiteralExpression(node.initializer)) supplemental = node.initializer.properties;
    ts.forEachChild(node, visit);
  }
  visit(ast);
  assert.equal(rows?.length, locales.length);
  assert.equal(supplemental?.length, locales.length);
  for (const property of supplemental ?? []) {
    assert.ok(ts.isPropertyAssignment(property) && ts.isArrayLiteralExpression(property.initializer));
    assert.equal(property.initializer.elements.length, 6);
    for (const element of property.initializer.elements) assert.ok(ts.isStringLiteral(element) && element.text.trim().length > 0);
  }
  const english = rows[1];
  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    assert.equal(row.elements.length, 22, `${locales[index]} workspace dictionary key count`);
    if (locales[index] !== "en") {
      assert.notEqual(row.elements[7].getText(ast), english.elements[7].getText(ast), `${locales[index]} browser-only notice fallback`);
      assert.notEqual(row.elements[12].getText(ast), english.elements[12].getText(ast), `${locales[index]} validation caveat fallback`);
    }
  }
});

test("Phase 1 keeps the locale route and hreflang spellings distinct", async () => {
  const { localeConfig } = await importTs("../src/i18n/routing.ts");
  const omissions = [];
  if (localeConfig.find(({ routeLocale }) => routeLocale === "pt-br")?.hreflang !== "pt-BR") omissions.push("pt-br must use pt-BR hreflang");
  if (localeConfig.find(({ routeLocale }) => routeLocale === "zh-tw")?.hreflang !== "zh-TW") omissions.push("zh-tw must use zh-TW hreflang");
  assert.deepEqual(omissions, []);
});

test("all Major Arcana have locale-specific upright and reversed interpretations", () => {
  const ids = ["fool","magician","priestess","empress","emperor","hierophant","lovers","chariot","strength","hermit","wheel","justice","hanged-man","death","temperance","devil","tower","star","moon","sun","judgement","world"];
  const omissions = [];
  for (const locale of locales.slice(4)) for (const id of ids) {
    const upright = getTarotInterpretation(locale, id, false);
    const reversed = getTarotInterpretation(locale, id, true);
    if (!upright || !reversed) omissions.push(`${locale}/${id}: missing interpretation`);
    else if (upright === reversed) omissions.push(`${locale}/${id}: upright and reversed readings are identical`);
  }
  assert.deepEqual(omissions, [], `Tarot localization omissions:\n${omissions.join("\n")}`);
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

test("expanded shared dictionaries are complete and do not silently reuse English copy", () => {
  const omissions = [];
  const validSharedTerms = new Set(["es/horizontal","es/vertical","pt-br/horizontal","pt-br/vertical","de/horizontal","fr/rotation","fr/horizontal","fr/vertical","fr/portrait","fr/pageCount","id/horizontal","it/input","nl/contrast"]);
  for (const locale of locales.slice(4)) {
    let entries;
    try { entries = expandedModule.getExpandedMessages(locale); }
    catch (error) { omissions.push(`${locale}: ${error.message}`); continue; }
    if (Object.keys(entries).length !== 117) omissions.push(`${locale}: expected 117 shared keys, got ${Object.keys(entries).length}`);
    for (const [key, value] of Object.entries(entries)) {
      if (!value?.trim()) omissions.push(`${locale}/${key}: empty translation`);
      if (value === getMessages("en")[key] && !validSharedTerms.has(`${locale}/${key}`)) omissions.push(`${locale}/${key}: English fallback`);
    }
  }
  assert.deepEqual(omissions, [], `Expanded shared dictionary omissions:\n${omissions.join("\n")}`);
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
  const properties = [...found.properties.filter(ts.isPropertyAssignment)];
  function collectAssignments(node) {
    if (ts.isCallExpression(node) && node.expression.getText(sourceFile) === "Object.assign" && node.arguments[0]?.getText(sourceFile) === declarationName) {
      const merged = unwrapObject(node.arguments[1]);
      if (merged) properties.push(...merged.properties.filter(ts.isPropertyAssignment));
    }
    ts.forEachChild(node, collectAssignments);
  }
  collectAssignments(sourceFile);
  const keys = properties.map((property) => property.name.getText(sourceFile).replace(/^['"]|['"]$/g, ""));
  const directLocaleMap = locales.slice(4).every((locale) => keys.includes(locale)) && (keys.includes("en") || !locales.slice(0, 4).some((locale) => keys.includes(locale)));
  const entries = new Map(properties.map((property) => [property.name.getText(sourceFile).replace(/^['"]|['"]$/g, ""), directLocaleMap ? (unwrapObject(property.initializer) ?? property.initializer) : unwrapObject(property.initializer)]));
  return entries;
}

test("interactive workspace dictionaries cover all locales with complete translated keys", async () => {
  const newLocales = locales.slice(4);
  const checks = [
    ["../src/components/copy-toast.tsx", ["copyMessages"]],
    ["../src/components/tool/random-string-workspace.tsx", ["labels", "optionLegend"]],
    ["../src/components/tool/ladder-workspace.tsx", ["labels"]],
    ["../src/components/tool/world-clock-workspace.tsx", ["labels", "zoneNames"]],
    ["../src/components/tool/countdown-workspace.tsx", ["labels"]],
    ["../src/components/tool/japan-tools-workspace.tsx", ["copy"]],
    ["../src/components/tool/special-random-workspaces.tsx", ["copy", "lottoLabels", "selectionConflict", "specialPrompt", "specialRequired", "officialNotice", "translations", "wheelCopy", "starterByLocale", "teamPrefix", "labels"]],
    ["../src/components/tool/fortune-workspace.tsx", ["tarotText", "dailyText", "dailyPools", "tarotNames"]],
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
