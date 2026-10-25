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
const processorCopySource = await readFile(new URL("../src/i18n/target-processor-copy.ts", import.meta.url), "utf8");
const { outputText: processorCopyOutput } = ts.transpileModule(processorCopySource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const processorCopyModule = await import(`data:text/javascript;base64,${Buffer.from(processorCopyOutput).toString("base64")}`);
const workspaceCopySource = await readFile(new URL("../src/registry/target-workspace-copy.ts", import.meta.url), "utf8");
const { outputText: workspaceCopyOutput } = ts.transpileModule(workspaceCopySource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const workspaceCopyModule = await import(`data:text/javascript;base64,${Buffer.from(workspaceCopyOutput).toString("base64")}`);
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

test("planned locale routing expands independently from legacy content locale types", () => {
  const expected = ["ru", "tr", "pl", "fil", "bn", "uk", "ms", "sv", "cs", "ro", "el"];
  assert.equal(routing.locales.length, 15);
  assert.equal(routing.targetLocales.length, 26);
  assert.deepEqual(routing.plannedLocaleConfig.map(({ routeLocale }) => routeLocale), expected);
  assert.equal(new Set(routing.targetLocales).size, 26);

  for (const locale of expected) {
    assert.equal(routing.isTargetLocale(locale), true);
    assert.equal(routing.isLocale(locale), false);
    assert.equal(routing.isPublishedTargetLocale(locale), true);
    assert.equal(routing.targetLocaleLabels[locale].length > 0, true);
  }
});

test("expanded barcode workspace controls are translated for every newly exposed locale", async () => {
  const locales = ["fil", "bn", "uk", "ms", "sv", "cs", "ro", "el"];
  const expectedKeys = ["value", "format", "run", "error", "result", "download"].sort();
  const component = await readFile(new URL("../src/components/tool/barcode-workspace.tsx", import.meta.url), "utf8");
  assert.deepEqual(Object.keys(workspaceCopyModule.targetBarcodeWorkspaceCopy).sort(), locales.sort());
  for (const locale of locales) {
    const copy = workspaceCopyModule.getTargetBarcodeWorkspaceCopy(locale);
    assert.deepEqual(Object.keys(copy).sort(), expectedKeys, `${locale} barcode workspace keys`);
    for (const [key, value] of Object.entries(copy)) {
      assert.ok(value.trim(), `${locale}.${key} must be translated`);
      assert.notEqual(value, key, `${locale}.${key} cannot be an untranslated key`);
    }
  }
  assert.match(component, /getTargetBarcodeWorkspaceCopy\(locale\)/);
  assert.match(component, /expandedCopy\?\.error/);
  assert.match(component, /expandedCopy\?\.download/);
});

test("each planned locale has the complete translated core UI message set", () => {
  const expectedKeys = [
    "language", "tools", "categories", "privacy", "terms", "allTools", "search", "searchPlaceholder",
    "howTo", "introduction", "faq", "relatedTools", "result", "download", "process", "run", "processing",
    "reset", "copy", "clear", "chooseOrDrop", "selectFile", "filePrivacy", "error", "copySuccess", "copyFailure", "workspaceUnavailable",
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

test("new eight locales have complete localized processor status and validation copy", () => {
  const expectedLocales = ["fil", "bn", "cs", "el", "ms", "ro", "sv", "uk"].sort();
  const expectedKeys = [
    "invalidRange", "insufficientRange", "team", "repeaterLimit", "fileReady", "regexPattern", "regexTooLong", "regexUnsafe",
    "regexNoMatches", "regexInvalid", "regexTimeout", "regexFailure", "colorInvalid", "barcodeInvalid", "valid", "invalid",
    "expectedCheckDigit", "cronHeading", "cronInvalid", "imageGridInvalid", "imageGridCanvas", "imageGridExport", "imageGridLimit", "imageGridResult",
  ].sort();
  const englishFallbacks = {
    invalidRange: "Enter a valid minimum and maximum separated by a comma.",
    insufficientRange: "The range is too small for that many unique numbers.", team: "Team",
    repeaterLimit: "The generated text is limited to 1,000,000 characters.", fileReady: "3 characters ready to download.",
    regexPattern: "Enter a pattern as /pattern/flags in the first line.", regexTooLong: "Pattern or sample is too long.",
    regexUnsafe: "Nested repetition and backreferences are disabled for safety.", regexNoMatches: "No matches",
    regexInvalid: "Invalid regular expression.", regexTimeout: "Regular expression exceeded the 250 ms time limit.",
    regexFailure: "Regular expression could not be processed.", colorInvalid: "Enter HEX, rgb(r, g, b), or hsl(h, s%, l%).",
    barcodeInvalid: "Enter a 12-digit UPC-A or 13-digit EAN-13 code.", valid: "Valid", invalid: "Invalid",
    expectedCheckDigit: "Expected check digit", cronHeading: "Upcoming run times",
    cronInvalid: "Enter a valid five or six field cron expression.", imageGridInvalid: "Choose 3, 6, or 9 tiles.",
    imageGridCanvas: "Could not start image processing.", imageGridExport: "Could not export a tile.",
    imageGridLimit: "The generated tiles exceed the 80 MB browser limit.", imageGridResult: "3 square PNG tiles · 128 × 128px",
  };
  const validExactMatches = new Set(["ro.valid"]);
  assert.deepEqual([...processorCopyModule.targetProcessorLocales].sort(), expectedLocales);
  for (const locale of expectedLocales) {
    const copy = processorCopyModule.getTargetProcessorCopy(locale);
    assert.ok(copy, `${locale} processor copy exists`);
    assert.deepEqual(Object.keys(copy).sort(), expectedKeys, `${locale} processor message keys`);
    for (const [key, value] of Object.entries(copy)) {
      const resolved = typeof value === "function" ? value(3, 128) : value;
      assert.equal(typeof resolved, "string", `${locale}.${key} resolves to text`);
      assert.ok(resolved.trim(), `${locale}.${key} must not be empty`);
      if (!validExactMatches.has(`${locale}.${key}`)) assert.notEqual(resolved, englishFallbacks[key], `${locale}.${key} must not use English fallback`);
    }
  }
});

test("text, image, and PDF processors accept all target locales while workspace publication remains gated", async () => {
  const [textProcessor, imageProcessor, pdfProcessor, workspace] = await Promise.all([
    readFile(new URL("../src/lib/text/process-text.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/lib/image/process-image.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/lib/pdf/process-pdf.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/components/tool/tool-workspace.tsx", import.meta.url), "utf8"),
  ]);
  for (const [name, source] of [["text", textProcessor], ["image", imageProcessor], ["PDF", pdfProcessor]]) {
    assert.match(source, /\bTargetLocale\b[^;]*from ["']@\/i18n\/routing["']/s, `${name} processor uses the target locale type`);
    assert.doesNotMatch(source, /PublishedTargetLocale/, `${name} processor must not narrow to published routes`);
  }
  assert.match(workspace, /if \(!isPublishedTargetLocale\(phaseLocale\) \|\| \(isPlannedLocale\(phaseLocale\) && !targetLocalePublication\[phaseLocale\]\.uiVerifiedToolSlugs\.includes\(tool\.slug\)\)\) return/, "unverified workspaces remain blocked by the per-tool publication gate");
});

test("copy toast has authored success and failure messages for every planned locale", async () => {
  const omissions = [];
  for (const { routeLocale } of routing.plannedLocaleConfig) {
    const messages = targetCoreMessages[routeLocale];
    for (const key of ["copySuccess", "copyFailure"]) {
      if (!messages[key]?.trim()) omissions.push(`${routeLocale}.${key}: missing copy toast message`);
      if (messages[key] === targetCoreMessages.en?.[key]) omissions.push(`${routeLocale}.${key}: English fallback`);
    }
  }
  const source = await readFile(new URL("../src/components/copy-toast.tsx", import.meta.url), "utf8");
  assert.match(source, /isPlannedLocale\(locale\)/, "copy toast must resolve planned locales from translated core UI copy");
  assert.match(source, /targetCoreMessages\[locale\]\.copySuccess/);
  assert.match(source, /targetCoreMessages\[locale\]\.copyFailure/);
  assert.deepEqual(omissions, []);
});

test("workspace-unavailable status comes from the shared locale dictionary", async () => {
  const source = await readFile(new URL("../src/components/tool/tool-workspace.tsx", import.meta.url), "utf8");
  assert.match(source, /targetCoreMessages\[locale\]\.workspaceUnavailable/);
  assert.doesNotMatch(source, /const workspaceUnavailable\s*:/);
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
  expected.push("pan-format-validator", "gstin-format-validator", "india-phone-number-formatter", "germany-iban-validator", "german-number-format-converter", "german-date-format-converter", "spain-dni-validator", "spain-nie-validator", "spanish-number-format-converter", "spanish-date-format-converter", "france-phone-number-formatter", "french-number-format-converter", "french-date-format-converter", "brazil-cpf-validator", "brazil-cnpj-validator", "brazil-phone-number-formatter", "brazil-cep-formatter", "netherlands-iban-validator", "dutch-number-format-converter", "dutch-date-format-converter", "vietnam-phone-number-formatter", "vietnam-number-format-converter", "italy-fiscal-code-format-validator", "italy-vat-number-validator", "italy-number-format-converter", "italian-date-format-converter", "australia-postcode-formatter", "english-date-format-converter", "social-image-resize", "add-text-to-image", "text-repeater", "text-to-file", "lorem-ipsum", "regex-tester", "color-converter", "cron-parser", "sql-formatter", "html-formatter", "css-formatter", "javascript-formatter", "markdown-preview", "jpg-to-png", "png-to-jpg", "webp-to-jpg", "webp-to-png", "jpg-to-webp", "png-to-webp", "heic-to-jpg", "image-compress", "image-resize", "image-crop", "image-rotate", "image-flip", "image-grayscale", "image-brightness", "image-contrast", "image-blur", "image-pixelate", "remove-image-metadata", "image-info", "favicon-generator", "image-color-picker", "images-to-pdf", "pdf-merge", "pdf-split", "pdf-delete-pages", "pdf-reorder-pages", "pdf-rotate-pages", "pdf-add-page-numbers", "pdf-watermark", "pdf-metadata-viewer", "pdf-remove-metadata");
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
