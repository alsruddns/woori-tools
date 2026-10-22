import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/i18n/routing.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const routing = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const copySource = await readFile(new URL("../src/i18n/target-locale-copy.ts", import.meta.url), "utf8");
const { outputText: copyOutput } = ts.transpileModule(copySource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { targetCoreMessages } = await import(`data:text/javascript;base64,${Buffer.from(copyOutput).toString("base64")}`);
const lotterySource = await readFile(new URL("../src/registry/target-lottery-translations.ts", import.meta.url), "utf8");
const { outputText: lotteryOutput } = ts.transpileModule(lotterySource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const lotteryTranslations = await import(`data:text/javascript;base64,${Buffer.from(lotteryOutput).toString("base64")}`);
const russianSource = await readFile(new URL("../src/registry/target-ru-translations.ts", import.meta.url), "utf8");
const { outputText: russianOutput } = ts.transpileModule(russianSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const russianTranslations = await import(`data:text/javascript;base64,${Buffer.from(russianOutput).toString("base64")}`);

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

test("each planned locale has the complete translated core UI message set", () => {
  const expectedKeys = [
    "language", "tools", "categories", "privacy", "terms", "allTools", "search", "searchPlaceholder",
    "howTo", "introduction", "faq", "relatedTools", "result", "download", "process", "run", "processing",
    "reset", "copy", "clear", "chooseOrDrop", "selectFile", "filePrivacy", "error",
  ].sort();
  assert.deepEqual(Object.keys(targetCoreMessages).sort(), routing.plannedLocaleConfig.map(({ routeLocale }) => routeLocale).sort());
  for (const [locale, messages] of Object.entries(targetCoreMessages)) {
    assert.deepEqual(Object.keys(messages).sort(), expectedKeys, `${locale} core UI keys`);
    for (const [key, value] of Object.entries(messages)) {
      assert.equal(typeof value, "string", `${locale}.${key} must be text`);
      assert.ok(value.trim().length > 0, `${locale}.${key} must not be empty`);
    }
  }
});

test("the six lottery tools have complete authored copy in every planned locale", () => {
  const fields = ["title", "description", "seoTitle", "seoDescription", "keywords", "steps", "example", "options", "caution", "faq"];
  const slugs = [
    "lotto-number-generator", "powerball-number-generator", "mega-millions-number-generator",
    "japan-loto6-number-generator", "japan-loto7-number-generator", "japan-mini-loto-number-generator",
  ];
  assert.deepEqual(lotteryTranslations.targetLotterySlugs, slugs);
  for (const locale of routing.plannedLocaleConfig.map(({ routeLocale }) => routeLocale)) {
    for (const slug of slugs) {
      const content = lotteryTranslations.getTargetLotteryTranslation(locale, slug);
      assert.ok(content, `${locale}/${slug} translation exists`);
      for (const field of fields) assert.ok(content[field], `${locale}/${slug}.${field} is present`);
      assert.equal(content.steps.length, 3, `${locale}/${slug} has three usage steps`);
      assert.equal(content.faq.example.length > 0, true);
      assert.equal(content.faq.caution.length > 0, true);
    }
  }
  assert.equal(lotteryTranslations.getTargetLotteryTranslation("ru", "unknown-tool"), undefined);
});

test("Russian has complete page metadata and editorial copy for its translated tool batch", () => {
  const expected = ["tarot-card", "daily-fortune", "saju", "random-number", "random-name-picker", "random-wheel", "draw-lots", "random-team-maker", "random-order", "random-seat", "duty-picker", "dice-roller", "coin-flip", "stopwatch", "timer", "pomodoro-timer", "world-clock", "password-generator", "random-string-generator", "wifi-qr", "contact-qr", "phone-qr", "email-qr"];
  const fields = ["title", "description", "seoTitle", "seoDescription", "category", "keywords", "steps", "example", "options", "caution", "faq"];
  assert.deepEqual(russianTranslations.targetRussianToolSlugs, expected);
  for (const slug of expected) {
    const content = russianTranslations.getTargetRussianToolTranslation(slug);
    assert.ok(content, `${slug} translation exists`);
    for (const field of fields) assert.ok(content[field], `ru/${slug}.${field} is present`);
    assert.equal(content.steps.length, 3, `ru/${slug} has three usage steps`);
    assert.equal(content.faq.example.length > 0, true);
    assert.equal(content.faq.caution.length > 0, true);
  }
});
