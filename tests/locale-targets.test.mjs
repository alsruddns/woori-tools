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
const polishSource = await readFile(new URL("../src/registry/target-pl-translations.ts", import.meta.url), "utf8");
const { outputText: polishOutput } = ts.transpileModule(polishSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const polishTranslations = await import(`data:text/javascript;base64,${Buffer.from(polishOutput).toString("base64")}`);

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
  const expected = ["tarot-card", "daily-fortune", "saju", "random-number", "random-name-picker", "random-wheel", "draw-lots", "random-team-maker", "random-order", "random-seat", "duty-picker", "dice-roller", "coin-flip", "stopwatch", "timer", "pomodoro-timer", "world-clock", "password-generator", "random-string-generator", "wifi-qr", "contact-qr", "phone-qr", "email-qr", "barcode-checker", "barcode-generator", "instagram-grid-split", "image-collage", "file-hash", "mime-type-checker", "file-extension-checker", "file-size-checker", "duplicate-file-checker", "zip-files", "bulk-file-renamer", "filename-cleaner", "shuffle-lines", "add-line-numbers", "remove-line-numbers", "remove-empty-lines", "remove-characters", "text-repeater", "text-to-file", "lorem-ipsum", "regex-tester", "color-converter", "cron-parser", "sql-formatter", "html-formatter", "css-formatter", "javascript-formatter", "markdown-preview", "jpg-to-png", "png-to-jpg", "webp-to-jpg", "webp-to-png", "jpg-to-webp", "png-to-webp", "heic-to-jpg", "image-compress", "image-resize", "image-crop", "image-rotate", "image-flip", "image-grayscale", "image-brightness", "image-contrast", "image-blur", "image-pixelate", "remove-image-metadata", "image-info", "favicon-generator", "image-color-picker", "images-to-pdf", "pdf-merge", "pdf-split", "pdf-delete-pages", "pdf-reorder-pages", "pdf-rotate-pages", "pdf-add-page-numbers", "pdf-watermark", "pdf-metadata-viewer", "pdf-remove-metadata", "character-count", "remove-spaces", "remove-line-breaks", "remove-duplicate-lines", "sort-lines", "text-case-converter", "text-compare", "reverse-text", "remove-duplicate-words", "json-formatter", "json-validator", "json-to-yaml", "yaml-to-json", "csv-to-json", "json-to-csv", "base64", "url-encode-decode", "uuid-generator", "timestamp-converter", "wareki-converter", "hiragana-katakana-converter", "fullwidth-halfwidth-converter", "japanese-romaji-converter", "japanese-number-kanji-converter", "yakudoshi-calculator", "japanese-zodiac-calculator", "numbers3-number-generator", "numbers4-number-generator", "bingo5-number-generator", "us-phone-number-formatter", "us-zip-code-formatter", "canada-postal-code-formatter", "uk-postcode-formatter", "jwt-decoder", "url-query-parameter-parser", "user-agent-parser", "ip-cidr-calculator", "base32-encoder-decoder", "ulid-generator", "uuid-v7-generator", "hash-compare", "regex-replace", "html-entity-encoder-decoder", "chmod-calculator", "json-path-tester", "csv-tsv-converter", "url-slug-generator", "unicode-code-point-checker", "pdf-page-size-checker", "simplified-traditional-chinese-converter", "chinese-number-kanji-converter", "rmb-uppercase-converter", "chinese-zodiac-calculator", "chinese-sexagenary-cycle-calculator", "chinese-phone-number-formatter", "taiwan-phone-number-formatter", "indian-number-format-converter", "lakh-crore-converter", "pan-format-validator", "gstin-format-validator", "india-phone-number-formatter", "germany-iban-validator", "german-number-format-converter", "german-date-format-converter", "spain-dni-validator", "spain-nie-validator", "spanish-number-format-converter", "spanish-date-format-converter", "france-phone-number-formatter", "french-number-format-converter", "french-date-format-converter", "brazil-cpf-validator", "brazil-cnpj-validator", "brazil-phone-number-formatter", "brazil-cep-formatter", "netherlands-iban-validator", "dutch-number-format-converter", "dutch-date-format-converter", "vietnam-phone-number-formatter", "vietnam-number-format-converter", "italy-fiscal-code-format-validator", "italy-vat-number-validator", "italy-number-format-converter", "italian-date-format-converter", "australia-postcode-formatter", "english-date-format-converter", "social-image-resize", "add-text-to-image"];
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

test("Polish editorial batch contains complete translated metadata and help copy", () => {
  const expected = ["tarot-card", "daily-fortune", "saju", "random-number", "random-name-picker", "random-wheel", "draw-lots", "random-team-maker", "random-order", "random-seat", "duty-picker", "dice-roller", "coin-flip", "stopwatch", "timer", "pomodoro-timer", "world-clock", "password-generator", "random-string-generator", "wifi-qr", "contact-qr", "phone-qr", "email-qr", "barcode-checker", "barcode-generator", "instagram-grid-split", "image-collage", "file-hash", "mime-type-checker", "file-extension-checker", "file-size-checker", "duplicate-file-checker", "zip-files", "bulk-file-renamer", "filename-cleaner", "shuffle-lines", "add-line-numbers", "remove-line-numbers", "remove-empty-lines", "remove-characters", "sort-lines", "remove-duplicate-lines", "remove-spaces", "remove-line-breaks", "text-case-converter", "reverse-text", "remove-duplicate-words", "character-count", "text-compare", "json-formatter", "json-validator", "json-to-yaml", "yaml-to-json", "csv-to-json", "json-to-csv", "base64", "url-encode-decode", "uuid-generator", "timestamp-converter", "wareki-converter", "hiragana-katakana-converter", "fullwidth-halfwidth-converter", "japanese-romaji-converter", "japanese-number-kanji-converter", "yakudoshi-calculator", "japanese-zodiac-calculator", "numbers3-number-generator", "numbers4-number-generator", "bingo5-number-generator", "us-phone-number-formatter", "us-zip-code-formatter", "canada-postal-code-formatter", "uk-postcode-formatter", "jwt-decoder", "url-query-parameter-parser", "user-agent-parser", "ip-cidr-calculator", "base32-encoder-decoder", "ulid-generator", "uuid-v7-generator", "hash-compare", "regex-replace", "html-entity-encoder-decoder", "chmod-calculator", "json-path-tester", "csv-tsv-converter", "url-slug-generator", "unicode-code-point-checker"];
  expected.push("pdf-page-size-checker", "simplified-traditional-chinese-converter", "chinese-number-kanji-converter", "rmb-uppercase-converter", "chinese-zodiac-calculator", "chinese-sexagenary-cycle-calculator", "chinese-phone-number-formatter", "taiwan-phone-number-formatter", "indian-number-format-converter", "lakh-crore-converter");
  expected.push("pan-format-validator", "gstin-format-validator", "india-phone-number-formatter", "germany-iban-validator", "german-number-format-converter", "german-date-format-converter", "spain-dni-validator", "spain-nie-validator", "spanish-number-format-converter", "spanish-date-format-converter", "france-phone-number-formatter", "french-number-format-converter", "french-date-format-converter", "brazil-cpf-validator", "brazil-cnpj-validator", "brazil-phone-number-formatter", "brazil-cep-formatter", "netherlands-iban-validator", "dutch-number-format-converter", "dutch-date-format-converter", "vietnam-phone-number-formatter", "vietnam-number-format-converter", "italy-fiscal-code-format-validator", "italy-vat-number-validator", "italy-number-format-converter", "italian-date-format-converter", "australia-postcode-formatter", "english-date-format-converter", "social-image-resize", "add-text-to-image", "text-repeater", "text-to-file", "lorem-ipsum", "regex-tester", "color-converter", "cron-parser", "sql-formatter", "html-formatter", "css-formatter", "javascript-formatter", "markdown-preview");
  const fields = ["title", "description", "seoTitle", "seoDescription", "category", "keywords", "steps", "example", "options", "caution", "faq"];
  assert.deepEqual(polishTranslations.targetPolishToolSlugs, expected);
  for (const slug of expected) {
    const content = polishTranslations.getTargetPolishToolTranslation(slug);
    assert.ok(content, `pl/${slug} translation exists`);
    for (const field of fields) assert.ok(content[field], `pl/${slug}.${field} is present`);
    assert.equal(content.steps.length, 3);
    assert.ok(content.faq.example && content.faq.caution);
  }
  assert.equal(polishTranslations.getTargetPolishToolTranslation("unknown-tool"), undefined);
});
