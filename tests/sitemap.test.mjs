import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import { createSitemapEntries } from "../src/lib/sitemap-entries.mjs";

async function importTypeScript(path, replacements = []) {
  let source = await readFile(new URL(path, import.meta.url), "utf8");
  for (const [search, replacement] of replacements) source = source.replace(search, replacement);
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}

const { locales, publishedTargetLocales, localeConfig, publishedTargetHreflangs } = await importTypeScript("../src/i18n/routing.ts");
const { getTargetTurkishToolTranslation, targetTurkishToolSlugs } = await importTypeScript("../src/registry/target-tr-translations.ts");
const { targetLocalePublication } = await importTypeScript("../src/registry/target-locale-publication.ts", [
  ['import { targetPolishToolSlugs } from "./target-pl-translations";', "const targetPolishToolSlugs = [];"],
]);
const countrySlugSource = await readFile(new URL("../src/lib/country-tool-slugs.ts", import.meta.url), "utf8");
const countrySlugs = [...countrySlugSource.matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1]);
const { tools: publicTools, filterPublicTools } = await importTypeScript("../src/registry/tools.ts", [
  ['import { locales, type PublishedTargetLocale } from "../i18n/routing";', `const locales = ${JSON.stringify(locales)};`],
  ['import { COUNTRY_TOOL_SLUGS } from "../lib/country-tool-slugs";', `const COUNTRY_TOOL_SLUGS = ${JSON.stringify(countrySlugs)};`],
  ['import { targetLocalePublication } from "./target-locale-publication";', 'const targetLocalePublication = { ru: { publishedToolSlugs: ["lotto-number-generator", "powerball-number-generator", "mega-millions-number-generator", "japan-loto6-number-generator", "japan-loto7-number-generator", "japan-mini-loto-number-generator", "color-converter", "cron-parser", "sql-formatter", "html-formatter", "css-formatter", "javascript-formatter", "jpg-to-png", "png-to-jpg", "webp-to-jpg", "webp-to-png", "jpg-to-webp", "png-to-webp", "heic-to-jpg", "image-compress", "image-resize", "image-crop", "image-rotate", "image-flip", "image-grayscale", "image-brightness", "image-contrast", "image-blur", "image-pixelate", "remove-image-metadata", "image-info", "favicon-generator", "image-color-picker", "images-to-pdf", "pdf-merge", "pdf-split", "pdf-delete-pages", "pdf-reorder-pages", "pdf-rotate-pages", "pdf-add-page-numbers", "pdf-watermark", "pdf-metadata-viewer", "pdf-remove-metadata", "pdf-page-size-checker", "text-compare", "regex-tester", "json-formatter", "json-validator", "json-to-yaml", "yaml-to-json", "csv-to-json", "json-to-csv", "base64", "url-encode-decode", "timestamp-converter", "uuid-generator", "uuid-v7-generator", "ulid-generator", "base32-encoder-decoder", "wareki-converter", "hiragana-katakana-converter", "fullwidth-halfwidth-converter", "japanese-romaji-converter", "japanese-number-kanji-converter", "yakudoshi-calculator", "japanese-zodiac-calculator", "numbers3-number-generator", "numbers4-number-generator", "bingo5-number-generator", "us-phone-number-formatter", "us-zip-code-formatter", "canada-postal-code-formatter", "uk-postcode-formatter", "jwt-decoder", "url-query-parameter-parser", "user-agent-parser", "ip-cidr-calculator", "hash-compare", "regex-replace", "html-entity-encoder-decoder", "chmod-calculator", "json-path-tester", "csv-tsv-converter", "url-slug-generator", "unicode-code-point-checker", "simplified-traditional-chinese-converter", "chinese-number-kanji-converter", "rmb-uppercase-converter", "chinese-zodiac-calculator", "chinese-sexagenary-cycle-calculator", "chinese-phone-number-formatter", "taiwan-phone-number-formatter", "indian-number-format-converter", "lakh-crore-converter", "pan-format-validator", "gstin-format-validator", "india-phone-number-formatter", "germany-iban-validator", "german-number-format-converter", "german-date-format-converter", "spain-dni-validator", "spain-nie-validator", "spanish-number-format-converter", "spanish-date-format-converter", "france-phone-number-formatter", "french-number-format-converter", "french-date-format-converter", "brazil-cpf-validator", "brazil-cnpj-validator", "brazil-phone-number-formatter", "brazil-cep-formatter", "netherlands-iban-validator", "dutch-number-format-converter", "dutch-date-format-converter", "vietnam-phone-number-formatter", "vietnam-number-format-converter", "italy-fiscal-code-format-validator", "italy-vat-number-validator", "italy-number-format-converter", "italian-date-format-converter", "australia-postcode-formatter", "english-date-format-converter", "social-image-resize", "add-text-to-image", "lorem-ipsum", "text-to-file", "remove-characters", "text-repeater", "remove-spaces", "remove-line-breaks", "text-case-converter", "reverse-text", "remove-duplicate-words", "character-count", "shuffle-lines", "add-line-numbers", "remove-line-numbers", "remove-empty-lines", "remove-duplicate-lines", "sort-lines", "bulk-file-renamer", "filename-cleaner", "zip-files", "file-hash", "mime-type-checker", "file-extension-checker", "file-size-checker", "duplicate-file-checker", "barcode-generator", "barcode-checker", "instagram-grid-split", "image-collage", "markdown-preview", "timer", "pomodoro-timer", "password-generator", "random-string-generator", "wifi-qr", "contact-qr", "phone-qr", "email-qr", "world-clock", "dice-roller", "random-number", "stopwatch", "coin-flip", "random-name-picker", "draw-lots", "random-team-maker", "random-order", "random-seat", "duty-picker", "random-wheel", "tarot-card", "daily-fortune", "saju"] } };'],
]);
const seoSource = await readFile(new URL("../src/lib/seo.ts", import.meta.url), "utf8");
const { languageAlternates } = await importTypeScript("../src/lib/seo.ts", [[
  'import { getPublishedTargetLocaleConfig, publishedTargetHreflangs, locales, type PublishedTargetLocale } from "@/i18n/routing";',
  `const locales = ${JSON.stringify(publishedTargetLocales)}; const publishedTargetHreflangs = ${JSON.stringify(publishedTargetHreflangs)};`,
]]);
const sitemapSource = await readFile(new URL("../src/app/sitemap.ts", import.meta.url), "utf8");
const localeLayoutSource = await readFile(new URL("../src/app/[locale]/layout.tsx", import.meta.url), "utf8");
const toolPageSource = await readFile(new URL("../src/app/[locale]/tools/[slug]/page.tsx", import.meta.url), "utf8");
const targetLocalePublicationSource = await readFile(new URL("../src/registry/target-locale-publication.ts", import.meta.url), "utf8");
const markdownWorkspaceSource = await readFile(new URL("../src/components/tool/russian-markdown-workspace.tsx", import.meta.url), "utf8");
const turkishFileInfoSource = await readFile(new URL("../src/components/tool/turkish-file-info-workspace.tsx", import.meta.url), "utf8");
const turkishRenameSource = await readFile(new URL("../src/components/tool/turkish-rename-workspace.tsx", import.meta.url), "utf8");
const turkishZipSource = await readFile(new URL("../src/components/tool/turkish-zip-workspace.tsx", import.meta.url), "utf8");
const turkishLineToolsSource = await readFile(new URL("../src/components/tool/turkish-line-tools-workspace.tsx", import.meta.url), "utf8");
const turkishTextUtilitySource = await readFile(new URL("../src/components/tool/turkish-text-utility-workspace.tsx", import.meta.url), "utf8");
const turkishCountryFormatSource = await readFile(new URL("../src/components/tool/turkish-country-format-workspace.tsx", import.meta.url), "utf8");
const turkishJapaneseToolsSource = await readFile(new URL("../src/components/tool/turkish-japanese-tools-workspace.tsx", import.meta.url), "utf8");
const turkishDataToolsSource = await readFile(new URL("../src/components/tool/turkish-data-tools-workspace.tsx", import.meta.url), "utf8");
const turkishPdfWorkspaceSource = await readFile(new URL("../src/components/tool/turkish-pdf-workspace.tsx", import.meta.url), "utf8");
const turkishImageToolsSource = await readFile(new URL("../src/components/tool/turkish-image-tools-workspace.tsx", import.meta.url), "utf8");
const turkishRegexSource = await readFile(new URL("../src/components/tool/turkish-regex-workspace.tsx", import.meta.url), "utf8");
const turkishCodeSource = await readFile(new URL("../src/components/tool/turkish-code-tools-workspace.tsx", import.meta.url), "utf8");
const turkishLoremSource = await readFile(new URL("../src/components/tool/turkish-lorem-workspace.tsx", import.meta.url), "utf8");
const russianBarcodeCheckerSource = await readFile(new URL("../src/components/tool/russian-barcode-checker-workspace.tsx", import.meta.url), "utf8");
const russianInstagramGridSource = await readFile(new URL("../src/components/tool/russian-instagram-grid-workspace.tsx", import.meta.url), "utf8");
const russianImageCollageSource = await readFile(new URL("../src/components/tool/russian-image-collage-workspace.tsx", import.meta.url), "utf8");
const russianFileInfoSource = await readFile(new URL("../src/components/tool/russian-file-info-workspace.tsx", import.meta.url), "utf8");
const russianZipSource = await readFile(new URL("../src/components/tool/russian-zip-workspace.tsx", import.meta.url), "utf8");
const russianRenameSource = await readFile(new URL("../src/components/tool/russian-rename-workspace.tsx", import.meta.url), "utf8");
const russianLineToolsSource = await readFile(new URL("../src/components/tool/russian-line-tools-workspace.tsx", import.meta.url), "utf8");
const russianTextToolsSource = await readFile(new URL("../src/components/tool/russian-text-tools-workspace.tsx", import.meta.url), "utf8");
const russianLoremSource = await readFile(new URL("../src/components/tool/russian-lorem-workspace.tsx", import.meta.url), "utf8");
const russianRegexSource = await readFile(new URL("../src/components/tool/russian-regex-workspace.tsx", import.meta.url), "utf8");
const russianColorSource = await readFile(new URL("../src/components/tool/russian-color-converter-workspace.tsx", import.meta.url), "utf8");
const russianCronSource = await readFile(new URL("../src/components/tool/russian-cron-workspace.tsx", import.meta.url), "utf8");
const russianFormatterSource = await readFile(new URL("../src/components/tool/russian-code-formatter-workspace.tsx", import.meta.url), "utf8");
const russianImageConversionSource = await readFile(new URL("../src/components/tool/russian-image-conversion-workspace.tsx", import.meta.url), "utf8");
const russianImageEffectsSource = await readFile(new URL("../src/components/tool/russian-image-effects-workspace.tsx", import.meta.url), "utf8");
const russianImageUtilitySource = await readFile(new URL("../src/components/tool/russian-image-utility-workspace.tsx", import.meta.url), "utf8");
const russianImageColorPickerSource = await readFile(new URL("../src/components/tool/russian-image-color-picker-workspace.tsx", import.meta.url), "utf8");
const russianPdfSource = await readFile(new URL("../src/components/tool/russian-pdf-workspace.tsx", import.meta.url), "utf8");
const russianTextCompareSource = await readFile(new URL("../src/components/tool/russian-text-compare-workspace.tsx", import.meta.url), "utf8");
const russianStructuredDataSource = await readFile(new URL("../src/components/tool/russian-structured-data-workspace.tsx", import.meta.url), "utf8");
const russianEncodingSource = await readFile(new URL("../src/components/tool/russian-encoding-workspace.tsx", import.meta.url), "utf8");
const russianJapanSource = await readFile(new URL("../src/components/tool/russian-japan-tools-workspace.tsx", import.meta.url), "utf8");
const russianAddressSource = await readFile(new URL("../src/components/tool/russian-address-workspace.tsx", import.meta.url), "utf8");
const russianDeveloperSource = await readFile(new URL("../src/components/tool/russian-developer-tools-workspace.tsx", import.meta.url), "utf8");
const russianChinaSource = await readFile(new URL("../src/components/tool/russian-china-tools-workspace.tsx", import.meta.url), "utf8");
const russianIndiaSource = await readFile(new URL("../src/components/tool/russian-india-tools-workspace.tsx", import.meta.url), "utf8");
const russianInternationalSource = await readFile(new URL("../src/components/tool/russian-international-tools-workspace.tsx", import.meta.url), "utf8");
const imageProcessorSource = await readFile(new URL("../src/lib/image/process-image.ts", import.meta.url), "utf8");
const textProcessorSource = await readFile(new URL("../src/lib/text/process-text.ts", import.meta.url), "utf8");
const countdownWorkspaceSource = await readFile(new URL("../src/components/tool/countdown-workspace.tsx", import.meta.url), "utf8");
const randomStringWorkspaceSource = await readFile(new URL("../src/components/tool/random-string-workspace.tsx", import.meta.url), "utf8");
const qrWorkspaceSource = await readFile(new URL("../src/components/tool/qr-workspace.tsx", import.meta.url), "utf8");
const worldClockWorkspaceSource = await readFile(new URL("../src/components/tool/world-clock-workspace.tsx", import.meta.url), "utf8");
const specialRandomWorkspaceSource = await readFile(new URL("../src/components/tool/special-random-workspaces.tsx", import.meta.url), "utf8");
const toolWorkspaceSource = await readFile(new URL("../src/components/tool/tool-workspace.tsx", import.meta.url), "utf8");
const instagramGridWorkspaceSource = await readFile(new URL("../src/components/tool/russian-instagram-grid-workspace.tsx", import.meta.url), "utf8");
const imageCollageWorkspaceSource = await readFile(new URL("../src/components/tool/russian-image-collage-workspace.tsx", import.meta.url), "utf8");
const fortuneWorkspaceSource = await readFile(new URL("../src/components/tool/fortune-workspace.tsx", import.meta.url), "utf8");
const tarotLocalizationSource = await readFile(new URL("../src/lib/fortune/tarot-localization.ts", import.meta.url), "utf8");
const sajuWorkspaceSource = await readFile(new URL("../src/components/tool/saju-workspace.tsx", import.meta.url), "utf8");
const nextConfig = await readFile(new URL("../next.config.ts", import.meta.url), "utf8");
const siteOrigin = "https://www.woori.today";
const turkishPublishedSlugs = ["lotto-number-generator", "powerball-number-generator", "mega-millions-number-generator", "japan-loto6-number-generator", "japan-loto7-number-generator", "japan-mini-loto-number-generator", "random-number", "random-name-picker", "random-wheel", "draw-lots", "random-team-maker", "random-order", "random-seat", "timer", "pomodoro-timer", "password-generator", "random-string-generator", "wifi-qr", "contact-qr", "phone-qr", "email-qr", "dice-roller", "coin-flip", "stopwatch", "world-clock", "tarot-card", "daily-fortune", "saju", "duty-picker", "barcode-checker", "barcode-generator", "instagram-grid-split", "image-collage", "markdown-preview", "file-hash", "mime-type-checker", "file-extension-checker", "file-size-checker", "duplicate-file-checker", "bulk-file-renamer", "filename-cleaner", "zip-files", "shuffle-lines", "add-line-numbers", "remove-line-numbers", "remove-empty-lines", "remove-characters", "sort-lines", "remove-duplicate-lines", "remove-spaces", "remove-line-breaks", "reverse-text", "text-repeater", "lorem-ipsum", "text-to-file", "character-count", "social-image-resize", "add-text-to-image", "text-case-converter", "remove-duplicate-words", "regex-tester", "color-converter", "cron-parser", "sql-formatter", "html-formatter", "css-formatter", "javascript-formatter", "json-formatter", "json-validator", "json-to-yaml", "yaml-to-json", "jpg-to-png", "png-to-jpg", "webp-to-jpg", "webp-to-png", "jpg-to-webp", "png-to-webp", "heic-to-jpg", "image-compress", "image-resize", "image-crop", "image-rotate", "image-flip", "image-grayscale", "image-brightness", "image-contrast", "image-blur", "image-pixelate", "remove-image-metadata", "image-info", "favicon-generator", "image-color-picker", "images-to-pdf", "pdf-merge", "pdf-split", "pdf-delete-pages", "pdf-reorder-pages", "pdf-rotate-pages", "pdf-add-page-numbers", "pdf-watermark", "pdf-metadata-viewer", "pdf-remove-metadata", "pdf-page-size-checker", "text-compare", "csv-to-json", "json-to-csv", "base64", "url-encode-decode", "uuid-generator", "timestamp-converter", "wareki-converter", "hiragana-katakana-converter", "fullwidth-halfwidth-converter", "japanese-romaji-converter", "japanese-number-kanji-converter", "yakudoshi-calculator", "japanese-zodiac-calculator", "numbers3-number-generator", "numbers4-number-generator", "bingo5-number-generator", "us-phone-number-formatter", "us-zip-code-formatter", "canada-postal-code-formatter", "uk-postcode-formatter", "jwt-decoder", "url-query-parameter-parser", "user-agent-parser", "ip-cidr-calculator", "hash-compare", "regex-replace", "html-entity-encoder-decoder", "chmod-calculator", "json-path-tester", "csv-tsv-converter", "url-slug-generator", "unicode-code-point-checker", "base32-encoder-decoder", "ulid-generator", "uuid-v7-generator", "simplified-traditional-chinese-converter", "chinese-number-kanji-converter", "rmb-uppercase-converter", "chinese-zodiac-calculator", "chinese-sexagenary-cycle-calculator", "chinese-phone-number-formatter", "taiwan-phone-number-formatter", "indian-number-format-converter", "lakh-crore-converter", "pan-format-validator", "gstin-format-validator", "india-phone-number-formatter", "germany-iban-validator", "german-number-format-converter", "german-date-format-converter", "spain-dni-validator", "spain-nie-validator", "spanish-number-format-converter", "spanish-date-format-converter", "france-phone-number-formatter", "french-number-format-converter", "french-date-format-converter", "netherlands-iban-validator", "dutch-number-format-converter", "dutch-date-format-converter", "brazil-cpf-validator", "brazil-cnpj-validator", "brazil-phone-number-formatter", "brazil-cep-formatter", "vietnam-phone-number-formatter", "vietnam-number-format-converter", "italy-fiscal-code-format-validator", "italy-vat-number-validator", "italy-number-format-converter", "italian-date-format-converter", "australia-postcode-formatter", "english-date-format-converter"];
const polishPublishedSlugs = new Set(targetLocalePublication.pl.publishedToolSlugs);
const sitemapTools = publicTools.map((tool) => ({
  ...tool,
  supportedLocales: [...tool.supportedLocales, ...(turkishPublishedSlugs.includes(tool.slug) ? ["tr"] : []), ...(polishPublishedSlugs.has(tool.slug) ? ["pl"] : [])],
}));
const entries = createSitemapEntries({
  tools: sitemapTools,
  locales: publishedTargetLocales,
  siteOrigin,
  languageAlternates,
  lastModified: new Date("2026-10-08T00:00:00.000Z"),
});

test("sitemap is generated from the public registry and includes every locale", () => {
  assert.match(sitemapSource, /import \{ tools \} from "@\/registry\/tools"/);
  assert.match(sitemapSource, /createSitemapEntries\(\{[\s\S]*?tools,[\s\S]*?locales: publishedTargetLocales,[\s\S]*?languageAlternates/);
  assert.ok(publicTools.length > 0);
  assert.ok(publicTools.every(({ isPublic }) => isPublic));
  assert.equal(publicTools.some(({ slug }) => slug === "ladder-game"), false);
  assert.match(localeLayoutSource, /return publishedTargetLocales\.map\(\(locale\) => \(\{ locale \}\)\)/);
  assert.match(toolPageSource, /supportedLocales\.includes\(params\.locale as Locale\)/);

  const listingEntries = entries.filter(({ url }) => /\/tools$/.test(url));
  const detailEntries = entries.filter(({ url }) => /\/tools\/[^/]+$/.test(url));
  assert.equal(locales.length, 15);
  assert.equal(publishedTargetLocales.length, 18);
  assert.equal(publishedTargetLocales.includes("pl"), true);
  assert.equal(listingEntries.length, 18);
  const expectedDetailCount = sitemapTools.reduce((sum, tool) => sum + tool.supportedLocales.length, 0);
  assert.equal(detailEntries.length, expectedDetailCount);
  assert.equal(entries.length, expectedDetailCount + 18);
  assert.equal(new Set(entries.map(({ url }) => url)).size, entries.length);
  assert.equal(entries.filter(({ url }) => new URL(url).pathname.startsWith("/pl/tools/")).length, targetLocalePublication.pl.publishedToolSlugs.length);

  const publishedRouteMatrix = sitemapTools.flatMap(({ slug, supportedLocales }) => supportedLocales.map((locale) => `${siteOrigin}/${locale}/tools/${slug}`));
  const missingRoutes = publishedRouteMatrix.filter((url) => !entries.some((entry) => entry.url === url));
  assert.deepEqual(missingRoutes, [], `Missing public tool locale routes:\n${missingRoutes.join("\n")}`);

  for (const locale of locales) {
    assert.ok(listingEntries.some(({ url }) => url === `${siteOrigin}/${locale}/tools`));
    for (const tool of publicTools) assert.equal(entries.some(({ url }) => url === `${siteOrigin}/${locale}/tools/${tool.slug}`), tool.supportedLocales.includes(locale));
    for (const slug of ["japan-loto6-number-generator", "japan-loto7-number-generator", "japan-mini-loto-number-generator"]) {
      assert.ok(entries.some(({ url }) => url === `${siteOrigin}/${locale}/tools/${slug}`));
    }
  }

  for (const entry of entries) {
    assert.ok(entry.url.startsWith(`${siteOrigin}/`));
    assert.match(entry.url, /^https:\/\/www\.woori\.today\/(ko|en|ja|zh|es|pt-br|de|fr|vi|id|th|zh-tw|it|nl|hi|ru|tr|pl)\/tools(?:\/[^/]+)?$/);
    assert.equal(entry.alternates.languages["x-default"], entry.alternates.languages.ko);
    const segments = new URL(entry.url).pathname.split("/").filter(Boolean);
    const slug = segments[2];
    const alternates = slug ? sitemapTools.find((tool) => tool.slug === slug).supportedLocales : publishedTargetLocales;
    const localizedPath = new URL(entry.url).pathname.replace(/^\/[^/]+/, "");
    for (const locale of publishedTargetLocales) assert.equal(entry.alternates.languages[publishedTargetHreflangs[locale]], alternates.includes(locale) ? `${siteOrigin}/${locale}${localizedPath}` : undefined);
    assert.deepEqual(Object.keys(entry.alternates.languages).sort(), [...new Set(["x-default", ...alternates.map((locale) => publishedTargetHreflangs[locale])])].sort());
    const pathname = new URL(entry.url).pathname;
    assert.doesNotMatch(pathname, /^\/tools(?:\/|$)/);
    assert.doesNotMatch(pathname, /^\/_assets(?:\/|$)/);
  }

  assert.match(nextConfig, /source: "\/tools-sitemap\.xml", destination: "\/sitemap\.xml"/);
});

test("private registry tools are excluded from sitemap entries", () => {
  const privateTool = { slug: "draft-tool", isPublic: false };
  const filteredTools = filterPublicTools([...sitemapTools, privateTool]);
  const filteredEntries = createSitemapEntries({
    tools: filteredTools,
    locales: publishedTargetLocales,
    siteOrigin,
    languageAlternates,
  });

  assert.equal(filteredTools.some(({ slug }) => slug === privateTool.slug), false);
  assert.equal(filteredEntries.length, entries.length);
  assert.equal(filteredEntries.some(({ url }) => url.includes(privateTool.slug)), false);
});

test("sitemap and SEO use the same language alternate helper", () => {
  assert.match(sitemapSource, /import \{[^}]*languageAlternates[^}]*\} from "@\/lib\/seo"/);
  assert.match(seoSource, /"x-default": localizedUrl\("ko", path\)/);
  for (const entry of entries) {
    const segments = new URL(entry.url).pathname.split('/').filter(Boolean);
    const slug = segments[2];
    const supportedLocales = slug ? sitemapTools.find((tool) => tool.slug === slug).supportedLocales : publishedTargetLocales;
    assert.equal(Object.keys(entry.alternates.languages).length, supportedLocales.filter((locale) => publishedTargetLocales.includes(locale)).length + 1);
  }
  assert.equal(entries.some(({ url }) => url.endsWith("/ru/tools/barcode-generator")), true);
  assert.equal(entries.some(({ url }) => url.endsWith("/ru/tools/barcode-checker")), true);
  assert.equal(entries.some(({ url }) => url.endsWith("/ru/tools/instagram-grid-split")), true);
  assert.equal(entries.some(({ url }) => url.endsWith("/ru/tools/image-collage")), true);
  for (const slug of ["color-converter", "cron-parser", "sql-formatter", "html-formatter", "css-formatter", "javascript-formatter", "jpg-to-png", "png-to-jpg", "webp-to-jpg", "webp-to-png", "jpg-to-webp", "png-to-webp", "heic-to-jpg", "image-compress", "image-resize", "image-crop", "image-rotate", "image-flip", "image-grayscale", "image-brightness", "image-contrast", "image-blur", "image-pixelate", "remove-image-metadata", "image-info", "favicon-generator", "image-color-picker", "images-to-pdf", "pdf-merge", "pdf-split", "pdf-delete-pages", "pdf-reorder-pages", "pdf-rotate-pages", "pdf-add-page-numbers", "pdf-watermark", "pdf-metadata-viewer", "pdf-remove-metadata", "pdf-page-size-checker", "text-compare", "regex-tester", "json-formatter", "json-validator", "json-to-yaml", "yaml-to-json", "csv-to-json", "json-to-csv", "base64", "url-encode-decode", "timestamp-converter", "uuid-generator", "uuid-v7-generator", "ulid-generator", "base32-encoder-decoder", "wareki-converter", "hiragana-katakana-converter", "fullwidth-halfwidth-converter", "japanese-romaji-converter", "japanese-number-kanji-converter", "yakudoshi-calculator", "japanese-zodiac-calculator", "numbers3-number-generator", "numbers4-number-generator", "bingo5-number-generator", "us-phone-number-formatter", "us-zip-code-formatter", "canada-postal-code-formatter", "uk-postcode-formatter", "jwt-decoder", "url-query-parameter-parser", "user-agent-parser", "ip-cidr-calculator", "hash-compare", "regex-replace", "html-entity-encoder-decoder", "chmod-calculator", "json-path-tester", "csv-tsv-converter", "url-slug-generator", "unicode-code-point-checker", "simplified-traditional-chinese-converter", "chinese-number-kanji-converter", "rmb-uppercase-converter", "chinese-zodiac-calculator", "chinese-sexagenary-cycle-calculator", "chinese-phone-number-formatter", "taiwan-phone-number-formatter", "indian-number-format-converter", "lakh-crore-converter", "pan-format-validator", "gstin-format-validator", "india-phone-number-formatter", "germany-iban-validator", "german-number-format-converter", "german-date-format-converter", "spain-dni-validator", "spain-nie-validator", "spanish-number-format-converter", "spanish-date-format-converter", "france-phone-number-formatter", "french-number-format-converter", "french-date-format-converter", "brazil-cpf-validator", "brazil-cnpj-validator", "brazil-phone-number-formatter", "brazil-cep-formatter", "netherlands-iban-validator", "dutch-number-format-converter", "dutch-date-format-converter", "vietnam-phone-number-formatter", "vietnam-number-format-converter", "italy-fiscal-code-format-validator", "italy-vat-number-validator", "italy-number-format-converter", "italian-date-format-converter", "australia-postcode-formatter", "english-date-format-converter", "social-image-resize", "add-text-to-image", "lorem-ipsum", "text-to-file", "remove-characters", "text-repeater", "remove-spaces", "remove-line-breaks", "text-case-converter", "reverse-text", "remove-duplicate-words", "character-count", "shuffle-lines", "add-line-numbers", "remove-line-numbers", "remove-empty-lines", "remove-duplicate-lines", "sort-lines", "bulk-file-renamer", "filename-cleaner", "zip-files", "file-hash", "mime-type-checker", "file-extension-checker", "file-size-checker", "duplicate-file-checker"]) assert.equal(entries.some(({ url }) => url.endsWith(`/ru/tools/${slug}`)), true);
  assert.equal(entries.some(({ url }) => url.endsWith("/ru/tools/markdown-preview")), true);
  assert.equal(entries.some(({ url }) => url.endsWith("/ru/tools/timer")), true);
  assert.equal(entries.some(({ url }) => url.endsWith("/ru/tools/pomodoro-timer")), true);
  assert.equal(entries.some(({ url }) => url.endsWith("/ru/tools/password-generator")), true);
  assert.equal(entries.some(({ url }) => url.endsWith("/ru/tools/random-string-generator")), true);
  for (const slug of ["wifi-qr", "contact-qr", "phone-qr", "email-qr"]) assert.equal(entries.some(({ url }) => url.endsWith(`/ru/tools/${slug}`)), true);
  assert.equal(entries.some(({ url }) => url.endsWith("/ru/tools/world-clock")), true);
  for (const slug of ["dice-roller", "random-number"]) assert.equal(entries.some(({ url }) => url.endsWith(`/ru/tools/${slug}`)), true);
  assert.equal(entries.some(({ url }) => url.endsWith("/ru/tools/stopwatch")), true);
  for (const slug of ["random-name-picker", "draw-lots", "random-team-maker"]) assert.equal(entries.some(({ url }) => url.endsWith(`/ru/tools/${slug}`)), true);
  assert.equal(entries.some(({ url }) => url.endsWith("/ru/tools/random-order")), true);
  assert.equal(entries.some(({ url }) => url.endsWith("/ru/tools/random-seat")), true);
  assert.equal(entries.some(({ url }) => url.endsWith("/ru/tools/duty-picker")), true);
  assert.equal(entries.some(({ url }) => url.endsWith("/ru/tools/random-wheel")), true);
  assert.equal(entries.some(({ url }) => url.endsWith("/ru/tools/tarot-card")), true);
  assert.equal(entries.some(({ url }) => url.endsWith("/ru/tools/daily-fortune")), true);
  assert.equal(entries.some(({ url }) => url.endsWith("/ru/tools/saju")), true);
  assert.equal(entries.some(({ url }) => url.endsWith("/ru/tools/image-compress")), true);
  assert.equal(localeConfig.find(({ routeLocale }) => routeLocale === "pt-br").hreflang, "pt-BR");
  assert.equal(localeConfig.find(({ routeLocale }) => routeLocale === "zh-tw").hreflang, "zh-TW");
});

test("Polish Instagram grid page uses localized controls and is included in the sitemap", () => {
  assert.equal(targetLocalePublication.pl.publishedToolSlugs.includes("instagram-grid-split"), true);
  assert.match(toolPageSource, /slug === "instagram-grid-split" \? <RussianInstagramGridWorkspace locale="pl" \/>/);
  assert.match(instagramGridWorkspaceSource, /locale\?: "ru" \| "tr" \| "pl"/);
  assert.match(instagramGridWorkspaceSource, /Podziel obraz na kafelki na Instagram/);
  assert.match(instagramGridWorkspaceSource, /Nie udało się przetworzyć obrazu/);
  assert.equal(entries.some(({ url }) => url === `${siteOrigin}/pl/tools/instagram-grid-split`), true);
});

test("Polish image collage page localizes selection, layout, processing, and results", () => {
  assert.equal(targetLocalePublication.pl.publishedToolSlugs.includes("image-collage"), true);
  assert.match(toolPageSource, /slug === "image-collage" \? <RussianImageCollageWorkspace locale="pl" \/>/);
  assert.match(toolPageSource, /import \{ RussianImageCollageWorkspace \}/);
  assert.match(imageCollageWorkspaceSource, /Wybierz zdjęcia lub przeciągnij je tutaj[\s\S]*?Utworzono kolaż z/);
  assert.equal(entries.some(({ url }) => url === `${siteOrigin}/pl/tools/image-collage`), true);
});

test("Polish file utilities localize duplicate results and MIME fallbacks while retaining browser processing", () => {
  for (const slug of ["file-hash", "mime-type-checker", "file-extension-checker", "file-size-checker", "duplicate-file-checker", "zip-files", "bulk-file-renamer", "filename-cleaner"]) {
    assert.equal(targetLocalePublication.pl.publishedToolSlugs.includes(slug), true);
  }
  assert.match(toolWorkspaceSource, /phaseLocale==="pl"\?"Grupa"/);
  assert.match(toolWorkspaceSource, /Nie znaleziono identycznej zawartości plików/);
  assert.match(toolWorkspaceSource, /nieznany typ MIME/);
  assert.match(toolWorkspaceSource, /await file\.arrayBuffer\(\)/);
});

test("Polish lottery workspaces localize controls, constraints, and eligibility notice", () => {
  const lotterySlugs = ["lotto-number-generator", "powerball-number-generator", "mega-millions-number-generator", "japan-loto6-number-generator", "japan-loto7-number-generator", "japan-mini-loto-number-generator"];
  for (const slug of lotterySlugs) {
    assert.equal(targetLocalePublication.pl.publishedToolSlugs.includes(slug), true);
    assert.equal(entries.some(({ url }) => url === `${siteOrigin}/pl/tools/${slug}`), true);
  }
  assert.match(specialRandomWorkspaceSource, /Object\.assign\(copy, \{ pl:/);
  assert.match(specialRandomWorkspaceSource, /Narz\\u0119dzie losuje liczby wy\\u0142\\u0105cznie dla rozrywki/);
  assert.ok(specialRandomWorkspaceSource.includes(String.raw`Mo\u017Cesz uwzgl\u0119dni\u0107 maksymalnie`));
  assert.match(specialRandomWorkspaceSource, /Tej samej liczby nie mo\\u017Cna jednocze\\u015Bnie uwzgl\\u0119dni\\u0107 i wykluczy\\u0107/);
  assert.match(specialRandomWorkspaceSource, /Sprawd\\u017A oficjalne informacje loterii/);
  assert.match(toolWorkspaceSource, /locale=\{phaseLocale === "pl" \? "pl" : specializedLocale\}/);
});

test("Russian and Turkish markdown previews use localized controls", () => {
  assert.match(toolPageSource, /slug === "markdown-preview"\s*\? <RussianMarkdownWorkspace locale="tr" \/>/);
  assert.match(markdownWorkspaceSource, /locale === "tr" \? "# Ba\\u015Fl\\u0131k\\n\\nBir \*\*Markdown\*\* \\u00F6rne\\u011Fi girin\."/);
  assert.match(markdownWorkspaceSource, /: "# \\u0417\\u0430\\u0433\\u043e\\u043b\\u043e\\u0432\\u043e\\u043a\\n\\n\\u0412\\u0432\\u0435\\u0434\\u0438\\u0442\\u0435/);
  assert.match(markdownWorkspaceSource, /const inputLabel = isTurkish \? "[^\"]+"/);
  assert.match(markdownWorkspaceSource, /const runLabel = isTurkish \? "[^\"]+"/);
  assert.match(markdownWorkspaceSource, /const resultPlaceholder = isTurkish \? "[^\"]+"/);
  assert.equal(publicTools.find(({ slug }) => slug === "markdown-preview").supportedLocales.includes("ru"), true);
  assert.equal(entries.some(({ url }) => url === `${siteOrigin}/ru/tools/markdown-preview`), true);
  assert.equal(entries.some(({ url }) => url === `${siteOrigin}/tr/tools/markdown-preview`), true);
});

test("Russian barcode checker publishes a localized checksum workspace", () => {
  assert.match(toolPageSource, /slug === "barcode-checker"\s*\? <RussianBarcodeCheckerWorkspace \/>/);
  assert.match(toolPageSource, /import \{ RussianBarcodeCheckerWorkspace \} from "@\/components\/tool\/russian-barcode-checker-workspace"/);
  assert.match(russianBarcodeCheckerSource, /Проверка контрольной цифры штрихкода/);
  assert.match(russianBarcodeCheckerSource, /Введите номер штрихкода/);
  assert.match(russianBarcodeCheckerSource, /Ожидаемая контрольная цифра/);
  assert.match(russianBarcodeCheckerSource, /\(body\.length - index\) % 2 === 1 \? 3 : 1/);
  assert.ok(entries.some(({ url }) => url.endsWith("/ru/tools/barcode-checker")));
});

test("Russian Instagram grid workspace localizes image controls and processing results", () => {
  assert.match(toolPageSource, /slug === "instagram-grid-split"\s*\? <RussianInstagramGridWorkspace \/>/);
  assert.match(russianInstagramGridSource, /Выберите изображение или перетащите его сюда/);
  assert.match(russianInstagramGridSource, /Количество квадратных фрагментов/);
  assert.match(russianInstagramGridSource, /Скачать ZIP-архив/);
  assert.match(russianInstagramGridSource, /URL\.revokeObjectURL/);
  assert.match(imageProcessorSource, /splitImageGrid\(bitmap,Number\(options\.option\)\|\|9,locale\)/);
  assert.match(imageProcessorSource, /Размер созданных фрагментов превышает лимит браузера 80 МБ/);
  assert.ok(entries.some(({ url }) => url.endsWith("/ru/tools/instagram-grid-split")));
});

test("Russian image collage localizes multi-file limits, layouts, and output controls", () => {
  assert.match(toolPageSource, /slug === "image-collage"\s*\? <RussianImageCollageWorkspace \/>/);
  assert.match(russianImageCollageSource, /Выберите изображения или перетащите их сюда/);
  assert.match(russianImageCollageSource, /Общий размер выбранных файлов не должен превышать 100 МБ/);
  assert.match(russianImageCollageSource, /Макет коллажа/);
  assert.match(russianImageCollageSource, /Скачать коллаж/);
  assert.match(russianImageCollageSource, /bitmap\.close\(\)/);
  assert.match(russianImageCollageSource, /URL\.revokeObjectURL/);
  assert.ok(entries.some(({ url }) => url.endsWith("/ru/tools/image-collage")));
});

test("Russian file inspection tools localize limits and keep processing in the browser", () => {
  assert.match(toolPageSource, /slug === "file-hash"[\s\S]*?RussianFileInfoWorkspace/);
  assert.match(russianFileInfoSource, /До 100 файлов · до 100 МБ на файл · до 200 МБ всего/);
  assert.match(russianFileInfoSource, /crypto\.subtle\.digest\("SHA-256"/);
  assert.match(russianFileInfoSource, /Сигнатура не распознана/);
  assert.match(russianFileInfoSource, /Файлы анализируются только в вашем браузере и не отправляются на сервер/);
  assert.ok(["file-hash", "mime-type-checker", "file-extension-checker", "file-size-checker", "duplicate-file-checker"].every((slug) => entries.some(({ url }) => url.endsWith(`/ru/tools/${slug}`))));
  assert.match(russianFileInfoSource, /crypto\.subtle\.digest\("SHA-256"/);
  assert.match(russianFileInfoSource, /Файлы с одинаковым содержимым не найдены/);
});

test("Russian ZIP tool enforces local file limits and creates a browser download", () => {
  assert.match(toolPageSource, /slug === "zip-files"\s*\? <RussianZipWorkspace \/>/);
  assert.match(russianZipSource, /До 100 файлов · до 100 МБ на файл · до 200 МБ всего/);
  assert.match(russianZipSource, /await import\("fflate"\)/);
  assert.match(russianZipSource, /URL\.createObjectURL\(new Blob/);
  assert.match(russianZipSource, /URL\.revokeObjectURL/);
  assert.match(russianZipSource, /Файлы обрабатываются только в браузере и не отправляются на сервер/);
  assert.ok(entries.some(({ url }) => url.endsWith("/ru/tools/zip-files")));
});

test("Russian bulk rename and filename cleaning preview localized safe names", () => {
  assert.match(toolPageSource, /slug === "bulk-file-renamer"[\s\S]*?RussianRenameWorkspace/);
  assert.match(russianRenameSource, /Новое имя/);
  assert.match(russianRenameSource, /Префикс/);
  assert.match(russianRenameSource, /Исходное имя/);
  assert.match(russianRenameSource, /renameFileNames\(/);
  assert.match(russianRenameSource, /URL\.revokeObjectURL/);
  assert.ok(["bulk-file-renamer", "filename-cleaner"].every((slug) => entries.some(({ url }) => url.endsWith(`/ru/tools/${slug}`))));
});

test("Russian line tools localize text controls and retain locale-aware sorting", () => {
  assert.match(toolPageSource, /slug === "shuffle-lines"[\s\S]*?RussianLineToolsWorkspace/);
  assert.match(russianLineToolsSource, /Введите или вставьте текст/);
  assert.match(russianLineToolsSource, /По убыванию/);
  assert.match(russianLineToolsSource, /processText\(slug, text, "", option, 1, "ru"\)/);
  assert.match(russianLineToolsSource, /Текст обрабатывается в браузере и не отправляется на сервер/);
  assert.ok(["shuffle-lines", "add-line-numbers", "remove-line-numbers", "remove-empty-lines", "remove-duplicate-lines", "sort-lines"].every((slug) => entries.some(({ url }) => url.endsWith(`/ru/tools/${slug}`))));
});

test("Russian text transformation tools localize options and preserve the shared processor", () => {
  assert.match(toolPageSource, /slug === "remove-characters"[\s\S]*?RussianTextToolsWorkspace/);
  assert.match(russianTextToolsSource, /Удалить цифры/);
  assert.match(russianTextToolsSource, /Количество повторов/);
  assert.match(russianTextToolsSource, /Заглавные буквы/);
  assert.match(russianTextToolsSource, /processText\(slug, text, secondText, option, amount, "ru"\)/);
  assert.match(russianTextToolsSource, /Текст обрабатывается в браузере и не отправляется на сервер/);
  assert.ok(["text-to-file", "remove-characters", "text-repeater", "remove-spaces", "remove-line-breaks", "text-case-converter", "reverse-text", "remove-duplicate-words", "character-count"].every((slug) => entries.some(({ url }) => url.endsWith(`/ru/tools/${slug}`))));
  assert.match(russianTextToolsSource, /Подготовить текстовый файл/);
  assert.match(russianTextToolsSource, /Скачать TXT-файл/);
});

test("Russian placeholder text tool generates localized sample paragraphs", () => {
  assert.match(toolPageSource, /slug === "lorem-ipsum"\s*\? <RussianLoremWorkspace \/>/);
  assert.match(russianLoremSource, /Количество абзацев/);
  assert.match(russianLoremSource, /В повседневной жизни мы используем разные инструменты/);
  assert.match(russianLoremSource, /copyText\(result\)/);
  assert.ok(entries.some(({ url }) => url.endsWith("/ru/tools/lorem-ipsum")));
});

test("Russian regex tool localizes input, output, errors, and keeps the bounded worker", () => {
  assert.match(toolPageSource, /slug === "regex-tester"\s*\? <RussianRegexWorkspace \/>/);
  assert.match(russianRegexSource, /Текст для проверки/);
  assert.match(russianRegexSource, /Введите регулярное выражение и текст для проверки/);
  assert.match(russianRegexSource, /processText\("regex-tester", pattern, sample, "", 1, "ru"\)/);
  assert.match(textProcessorSource, /worker\.terminate\(\);URL\.revokeObjectURL\(url\);reject\(new Error/);
  assert.ok(entries.some(({ url }) => url.endsWith("/ru/tools/regex-tester")));
});

test("Russian color converter localizes errors and keeps the shared conversion logic", () => {
  assert.match(toolPageSource, /slug === "color-converter"\s*\? <RussianColorConverterWorkspace \/>/);
  assert.match(russianColorSource, /Введите цвет/);
  assert.match(russianColorSource, /Преобразовать цвет/);
  assert.match(russianColorSource, /processText\("color-converter", value, "", "", 1, "ru"\)/);
  assert.match(textProcessorSource, /Введите HEX, rgb\(r, g, b\) или hsl\(h, s%, l%\)\./);
  assert.ok(entries.some(({ url }) => url.endsWith("/ru/tools/color-converter")));
});

test("Russian Cron parser localizes controls, run times, errors, and publication metadata", () => {
  assert.match(toolPageSource, /slug === "cron-parser"\s*\? <RussianCronWorkspace \/>/);
  assert.match(russianCronSource, /Выражение Cron/);
  assert.match(russianCronSource, /Проверить расписание/);
  assert.match(russianCronSource, /processText\("cron-parser", value, "", "", 1, "ru"\)/);
  assert.match(textProcessorSource, /Ближайшие запуски/);
  assert.match(textProcessorSource, /Введите корректное выражение Cron из пяти или шести полей\./);
  assert.ok(entries.some(({ url }) => url.endsWith("/ru/tools/cron-parser")));
});

test("Russian code formatter workspaces cover SQL, HTML, CSS, and JavaScript pages", () => {
  for (const slug of ["sql-formatter", "html-formatter", "css-formatter", "javascript-formatter"]) {
    assert.match(toolPageSource, new RegExp(`slug === "${slug}"\\s*\\? <RussianCodeFormatterWorkspace slug="${slug}" \\/>`));
    assert.ok(entries.some(({ url }) => url.endsWith(`/ru/tools/${slug}`)));
  }
  for (const phrase of ["Вставьте SQL-запрос", "Вставьте HTML-код", "Вставьте CSS-код", "Вставьте JavaScript-код", "Не удалось отформатировать текст"]) {
    assert.ok(russianFormatterSource.includes(phrase));
  }
  assert.match(russianFormatterSource, /processText\(slug, value, "", "", 1, "ru"\)/);
});

test("Russian image conversion pages preserve local processing and file cleanup", () => {
  for (const slug of ["jpg-to-png", "png-to-jpg", "webp-to-jpg", "webp-to-png", "jpg-to-webp", "png-to-webp", "heic-to-jpg"]) {
    assert.match(toolPageSource, new RegExp(`slug === "${slug}"\\s*\\? <RussianImageConversionWorkspace slug="${slug}" \\/>`));
    assert.ok(entries.some(({ url }) => url.endsWith(`/ru/tools/${slug}`)));
  }
  assert.match(russianImageConversionSource, /processImage\(slug, file,[\s\S]*"ru"\)/);
  assert.match(russianImageConversionSource, /URL\.createObjectURL\(processed\.blob\)/);
  assert.match(russianImageConversionSource, /URL\.revokeObjectURL\(outputUrl\)/);
  assert.match(russianImageConversionSource, /30 \* 1024 \* 1024/);
  assert.match(russianImageConversionSource, /Перетащите сюда изображение/);
});

test("Russian image effect pages localize options and release browser resources", () => {
  for (const slug of ["image-compress", "image-resize", "image-crop", "image-rotate", "image-flip", "image-grayscale", "image-brightness", "image-contrast", "image-blur", "image-pixelate"]) {
    assert.match(toolPageSource, new RegExp(`slug === "${slug}"\\s*\\? <RussianImageEffectsWorkspace slug="${slug}" \\/>`));
    assert.ok(entries.some(({ url }) => url.endsWith(`/ru/tools/${slug}`)));
  }
  assert.match(russianImageEffectsSource, /processImage\(slug, file,[\s\S]*"ru"\)/);
  assert.match(russianImageEffectsSource, /quality: quality \/ 100, width, height, keepRatio, amount, option/);
  assert.match(russianImageEffectsSource, /URL\.createObjectURL\(processed\.blob\)/);
  assert.match(russianImageEffectsSource, /URL\.revokeObjectURL\(outputUrl\)/);
  assert.match(russianImageEffectsSource, /Сохранить пропорции/);
});

test("Russian image utilities expose localized information, metadata removal, favicon, and color picking", () => {
  for (const slug of ["remove-image-metadata", "image-info", "favicon-generator", "image-color-picker"]) {
    assert.ok(entries.some(({ url }) => url.endsWith(`/ru/tools/${slug}`)));
  }
  for (const slug of ["remove-image-metadata", "image-info", "favicon-generator"]) {
    assert.match(toolPageSource, new RegExp(`slug === "${slug}"\\s*\\? <RussianImageUtilityWorkspace slug="${slug}" \\/>`));
  }
  assert.match(toolPageSource, /slug === "image-color-picker"\s*\? <RussianImageColorPickerWorkspace \/>/);
  assert.match(russianImageUtilitySource, /createImageBitmap\(file\)/);
  assert.match(russianImageUtilitySource, /URL\.revokeObjectURL\(outputUrl\)/);
  assert.match(russianImageColorPickerSource, /getImageData\(x, y, 1, 1\)/);
  assert.match(russianImageColorPickerSource, /setColor\(`\$\{hex\} · RGB/);
});

test("Russian PDF tools expose localized operations and use local PDF processing", () => {
  for (const slug of ["images-to-pdf", "pdf-merge", "pdf-split", "pdf-delete-pages", "pdf-reorder-pages", "pdf-rotate-pages", "pdf-add-page-numbers", "pdf-watermark", "pdf-metadata-viewer", "pdf-remove-metadata", "pdf-page-size-checker"]) {
    assert.ok(entries.some(({ url }) => url.endsWith(`/ru/tools/${slug}`)));
  }
  assert.match(toolPageSource, /isRussianPdfSlug\(slug\)\s*\? <RussianPdfWorkspace slug=\{slug\} \/>/);
  assert.match(russianPdfSource, /processPdf\(slug, files, option, text, "ru"\)/);
  assert.match(russianPdfSource, /PDFDocument\.load/);
  assert.match(russianPdfSource, /application\/pdf/);
  assert.match(russianPdfSource, /URL\.revokeObjectURL\(outputUrl\)/);
});

test("Russian text comparison localizes both inputs and the line difference result", () => {
  assert.ok(entries.some(({ url }) => url.endsWith("/ru/tools/text-compare")));
  assert.match(toolPageSource, /slug === "text-compare"\s*\? <RussianTextCompareWorkspace \/>/);
  assert.match(russianTextCompareSource, /processText\("text-compare", first, second, "", 1, "ru"\)/);
  assert.match(russianTextCompareSource, /Первый текст/);
  assert.match(russianTextCompareSource, /Второй текст/);
  assert.match(russianTextCompareSource, /Сравнить тексты/);
});

test("Russian structured-data tools use localized controls and browser-side processors", () => {
  const slugs = ["json-formatter", "json-validator", "json-to-yaml", "yaml-to-json", "csv-to-json", "json-to-csv"];
  for (const slug of slugs) assert.ok(entries.some(({ url }) => url.endsWith(`/ru/tools/${slug}`)));
  assert.match(toolPageSource, /isRussianDataSlug\(slug\)\s*\? <RussianStructuredDataWorkspace slug=\{slug\} \/>/);
  assert.match(russianStructuredDataSource, /processText\(slug, input, "", option, 1, "ru"\)/);
  assert.match(russianStructuredDataSource, /Преобразовать в JSON/);
  assert.match(russianStructuredDataSource, /Преобразовать в CSV/);
  assert.match(russianStructuredDataSource, /URL\.revokeObjectURL/);
});
test("Russian encoding, identifier, and timestamp tools expose localized browser-side controls", () => {
  const slugs = ["base64", "url-encode-decode", "timestamp-converter", "uuid-generator", "uuid-v7-generator", "ulid-generator", "base32-encoder-decoder"];
  for (const slug of slugs) assert.ok(entries.some(({ url }) => url.endsWith(`/ru/tools/${slug}`)));
  assert.match(toolPageSource, /isRussianEncodingSlug\(slug\)\s*\? <RussianEncodingWorkspace slug=\{slug\} \/>/);
  assert.match(russianEncodingSource, /processText\(slug, input, "", option, Number\(amount\) \|\| 1, "ru"\)/);
  assert.match(russianEncodingSource, /createUuidV7\(\)/);
  assert.match(russianEncodingSource, /createUlid\(\)/);
  assert.match(russianEncodingSource, /Декодировать/);
});
test("Russian Japanese date and text tools use localized controls and shared conversion logic", () => {
  const slugs = ["wareki-converter", "hiragana-katakana-converter", "fullwidth-halfwidth-converter", "japanese-romaji-converter", "japanese-number-kanji-converter", "yakudoshi-calculator", "japanese-zodiac-calculator", "numbers3-number-generator", "numbers4-number-generator", "bingo5-number-generator"];
  for (const slug of slugs) assert.ok(entries.some(({ url }) => url.endsWith(`/ru/tools/${slug}`)));
  assert.match(toolPageSource, /isRussianJapanSlug\(slug\)\s*\? <RussianJapanToolsWorkspace slug=\{slug\} \/>/);
  assert.match(russianJapanSource, /gregorianToWareki\(input\)/);
  assert.match(russianJapanSource, /convertKana\(input/);
  assert.match(russianJapanSource, /yakudoshi\(Number\(input\)/);
  assert.match(russianJapanSource, /Копировать результат/);
  assert.match(russianJapanSource, /generateNumbersGame\(3, Number\(count\)\)/);
  assert.match(russianJapanSource, /generateBingo5\(\)/);
  assert.match(russianJapanSource, /japan-tool-history:/);
});
test("Russian North American and UK address tools format inputs locally", () => {
  const slugs = ["us-phone-number-formatter", "us-zip-code-formatter", "canada-postal-code-formatter", "uk-postcode-formatter"];
  for (const slug of slugs) assert.ok(entries.some(({ url }) => url.endsWith(`/ru/tools/${slug}`)));
  assert.match(toolPageSource, /isRussianAddressSlug\(slug\)\s*\? <RussianAddressWorkspace slug=\{slug\} \/>/);
  assert.match(russianAddressSource, /formatPhone\(slug, input\)/);
  assert.match(russianAddressSource, /formatCanadaPostalCode\(input\)/);
  assert.match(russianAddressSource, /Проверяется только формат/);
});
test("Russian browser developer tools use localized copy and existing local utilities", () => {
  const slugs = ["jwt-decoder", "url-query-parameter-parser", "user-agent-parser", "ip-cidr-calculator", "hash-compare", "regex-replace", "html-entity-encoder-decoder", "chmod-calculator", "json-path-tester", "csv-tsv-converter", "url-slug-generator", "unicode-code-point-checker"];
  for (const slug of slugs) assert.ok(entries.some(({ url }) => url.endsWith(`/ru/tools/${slug}`)));
  assert.match(toolPageSource, /isRussianDeveloperSlug\(slug\)\s*\? <RussianDeveloperToolsWorkspace slug=\{slug\} \/>/);
  assert.match(russianDeveloperSource, /decodeJwt\(first\)/);
  assert.match(russianDeveloperSource, /calculateIpv4Cidr\(first\)/);
  assert.match(russianDeveloperSource, /replaceWithRegex\(first, second, third\)/);
  assert.match(russianDeveloperSource, /transliterateRussian\(first\)/);
  assert.match(russianDeveloperSource, /Подпись не проверяется/);
});
test("Russian Chinese language and culture tools use localized controls and shared algorithms", () => {
  const slugs = ["simplified-traditional-chinese-converter", "chinese-number-kanji-converter", "rmb-uppercase-converter", "chinese-zodiac-calculator", "chinese-sexagenary-cycle-calculator", "chinese-phone-number-formatter", "taiwan-phone-number-formatter"];
  for (const slug of slugs) assert.ok(entries.some(({ url }) => url.endsWith(`/ru/tools/${slug}`)));
  assert.match(toolPageSource, /isRussianChinaSlug\(slug\)\s*\? <RussianChinaToolsWorkspace slug=\{slug\} \/>/);
  assert.match(russianChinaSource, /convertSimplifiedTraditional\(input/);
  assert.match(russianChinaSource, /numberToChinese\(input\)/);
  assert.match(russianChinaSource, /rmbUppercase\(input\)/);
  assert.match(russianChinaSource, /formatPhone\(slug, input\)/);
});
test("Russian India number, tax-ID, and phone tools keep validation local", () => {
  const slugs = ["indian-number-format-converter", "lakh-crore-converter", "pan-format-validator", "gstin-format-validator", "india-phone-number-formatter"];
  for (const slug of slugs) assert.ok(entries.some(({ url }) => url.endsWith(`/ru/tools/${slug}`)));
  assert.match(toolPageSource, /isRussianIndiaSlug\(slug\)\s*\? <RussianIndiaToolsWorkspace slug=\{slug\} \/>/);
  assert.match(russianIndiaSource, /indianNumber\(input\)/);
  assert.match(russianIndiaSource, /validateGstin\(input\)/);
  assert.match(russianIndiaSource, /не проверяется по государственным базам/);
});
test("Russian European and international format tools call shared locale algorithms", () => {
  const slugs = ["germany-iban-validator", "german-number-format-converter", "german-date-format-converter", "spain-dni-validator", "spain-nie-validator", "spanish-number-format-converter", "spanish-date-format-converter", "france-phone-number-formatter", "french-number-format-converter", "french-date-format-converter", "brazil-cpf-validator", "brazil-cnpj-validator", "brazil-phone-number-formatter", "brazil-cep-formatter", "netherlands-iban-validator", "dutch-number-format-converter", "dutch-date-format-converter", "vietnam-phone-number-formatter", "vietnam-number-format-converter", "italy-fiscal-code-format-validator", "italy-vat-number-validator", "italy-number-format-converter", "italian-date-format-converter", "australia-postcode-formatter", "english-date-format-converter"];
  for (const slug of slugs) assert.ok(entries.some(({ url }) => url.endsWith(`/ru/tools/${slug}`)));
  assert.match(toolPageSource, /isRussianInternationalSlug\(slug\)\s*\? <RussianInternationalToolsWorkspace slug=\{slug\} \/>/);
  assert.match(russianInternationalSource, /runCountryTool\(slug satisfies CountryToolSlug, input, mode\)/);
  assert.match(russianInternationalSource, /MOD 97/);
  assert.match(russianInternationalSource, /Проверка не пройдена/);
});
test("Russian social image sizes and captions keep image processing in the browser", () => {
  for (const slug of ["social-image-resize", "add-text-to-image"]) assert.ok(entries.some(({ url }) => url.endsWith(`/ru/tools/${slug}`)));
  assert.match(toolPageSource, /slug === "social-image-resize"[\s\S]*?RussianImageEffectsWorkspace slug="social-image-resize"/);
  assert.match(russianImageEffectsSource, /processImage\(slug, file, \{[\s\S]*?text: caption \}, "ru"\)/);
  assert.match(russianImageEffectsSource, /Instagram · квадрат 1080 × 1080/);
  assert.match(russianImageEffectsSource, /Введите надпись \(до 160 символов\)/);
  assert.match(russianImageEffectsSource, /URL\.revokeObjectURL\(outputUrl\)/);
});
test("Russian lottery tools use localized controls and publish all six verified routes", () => {
  const slugs = ["lotto-number-generator", "powerball-number-generator", "mega-millions-number-generator", "japan-loto6-number-generator", "japan-loto7-number-generator", "japan-mini-loto-number-generator"];
  for (const slug of slugs) {
    assert.equal(publicTools.find((tool) => tool.slug === slug).supportedLocales.includes("ru"), true);
    const entry = entries.find(({ url }) => url === `${siteOrigin}/ru/tools/${slug}`);
    assert.ok(entry);
    assert.equal(entry.alternates.languages.ru, `${siteOrigin}/ru/tools/${slug}`);
    assert.equal(entry.alternates.languages["x-default"], `${siteOrigin}/ko/tools/${slug}`);
  }
  assert.match(toolPageSource, /getTargetLotteryTranslation\("ru", slug\)/);
  assert.match(toolPageSource, /<LottoWorkspace locale="ru"/);
  assert.match(specialRandomWorkspaceSource, /ru: \{ generate: "Сформировать числа"/);
  assert.match(specialRandomWorkspaceSource, /ru: \{ included: "Это число уже добавлено в список\./);
  assert.match(specialRandomWorkspaceSource, /Выберите дополнительный шар/);
});
test("Turkish verified tool workspaces publish only their approved routes", () => {
  const slugs = ["lotto-number-generator", "powerball-number-generator", "mega-millions-number-generator", "japan-loto6-number-generator", "japan-loto7-number-generator", "japan-mini-loto-number-generator"];
  assert.match(specialRandomWorkspaceSource, /Object\.assign\(copy, \{ tr: \{[\s\S]*?generate: "Sayı üret"[\s\S]*?copyFailed: "Kopyalanamadı\."[\s\S]*?makeTeamsAgain: "Takımları yeniden oluştur"/);
  assert.match(specialRandomWorkspaceSource, /tr: \{ generate: "Sayıları oluştur"/);
  assert.match(specialRandomWorkspaceSource, /tr: \{ "Choose at most six included numbers\."[\s\S]*?"Could not find enough distinct valid games\./);
  const uiSlugs = [...slugs, "random-number", "random-name-picker", "random-wheel", "draw-lots", "random-team-maker", "random-order", "random-seat", "timer", "pomodoro-timer", "password-generator", "random-string-generator", "wifi-qr", "contact-qr", "phone-qr", "email-qr", "dice-roller", "coin-flip"];
  assert.match(specialRandomWorkspaceSource, /tr: \{ label: "Katılımcılar \(her satıra bir kişi\)"[\s\S]*?reveal: "Sonrakini göster"/);
  assert.match(specialRandomWorkspaceSource, /tr:\{people:"Katılımcılar \(her satıra bir kişi\)"[\s\S]*?arrange:"Koltukları dağıt"/);
  assert.match(specialRandomWorkspaceSource, /Object\.assign\(wheelCopy, \{ tr: \{ label: "Her satıra bir seçenek yazın"/);
  for (const slug of uiSlugs) {
    assert.equal(entries.some(({ url }) => url === `${siteOrigin}/tr/tools/${slug}`), true);
    const entry = entries.find(({ url }) => url === `${siteOrigin}/tr/tools/${slug}`);
    assert.equal(entry.alternates.languages.tr, `${siteOrigin}/tr/tools/${slug}`);
    assert.equal(entry.alternates.languages["x-default"], `${siteOrigin}/ko/tools/${slug}`);
  }
  assert.equal(turkishPublishedSlugs.length, 176);
  for (const slug of ["base32-encoder-decoder", "ulid-generator", "uuid-v7-generator"]) assert.ok(turkishPublishedSlugs.includes(slug));
  for (const slug of ["simplified-traditional-chinese-converter","chinese-number-kanji-converter","rmb-uppercase-converter","chinese-zodiac-calculator","chinese-sexagenary-cycle-calculator","chinese-phone-number-formatter","taiwan-phone-number-formatter"]) assert.ok(turkishPublishedSlugs.includes(slug));
  assert.match(localeLayoutSource, /rawLocale === "tr"/);
  assert.match(toolPageSource, /rawLocale === "tr"\) return <TurkishPublishedToolPage/);
  assert.match(toolPageSource, /pageMetadata\(\{ locale: "tr"/);
  assert.match(toolPageSource, /inLanguage: "tr-TR"/);
  assert.match(toolPageSource, /CountdownWorkspace slug=\{slug\} locale="tr"/);
  assert.match(toolPageSource, /RandomStringWorkspace slug=\{slug\} locale="tr"/);
  assert.match(toolPageSource, /QrWorkspace slug=\{slug\} locale="tr"/);
  assert.match(toolPageSource, /DiceWorkspace locale="tr"/);
  assert.match(toolPageSource, /CoinFlipWorkspace locale="tr"/);
  assert.match(toolPageSource, /TurkishStopwatchWorkspace/);
  assert.match(toolPageSource, /WorldClockWorkspace locale="tr"/);
  assert.match(toolPageSource, /TarotWorkspace locale="tr"/);
  assert.match(toolPageSource, /DailyFortuneWorkspace locale="tr"/);
  assert.match(toolPageSource, /SajuWorkspace locale="tr"/);
  assert.match(toolPageSource, /RussianDutyPickerWorkspace locale="tr"/);
  assert.match(toolPageSource, /RussianBarcodeCheckerWorkspace locale="tr"/);
  assert.match(toolPageSource, /BarcodeWorkspace locale="tr"/);
  assert.match(toolPageSource, /RussianInstagramGridWorkspace locale="tr"/);
  assert.match(toolPageSource, /RussianImageCollageWorkspace locale="tr"/);
  assert.match(toolPageSource, /RussianMarkdownWorkspace locale="tr"/);
  assert.match(toolPageSource, /TurkishFileInfoWorkspace slug=\{slug as/);
  assert.match(turkishFileInfoSource, /sha256/);
  assert.match(toolPageSource, /TurkishRenameWorkspace slug=\{slug\}/);
  assert.match(turkishRenameSource, /Dosyalar taray\u0131c\u0131n\u0131zda i\u015Flenir/);
  assert.match(toolPageSource, /TurkishZipWorkspace title=\{tool.title\}/);
  assert.match(turkishZipSource, /Dosyalar taray\u0131c\u0131n\u0131zda i\u015Flenir/);
  assert.match(toolPageSource, /TurkishLineToolsWorkspace slug=\{slug as/);
  assert.match(turkishLineToolsSource, /processText\(slug, text, customCharacters, option, Number\(amount\), "tr"\)/);
  assert.match(toolPageSource, /TurkishLoremWorkspace title=\{tool.title\}/);
  assert.match(turkishLoremSource, /Paragraf say\u0131s\u0131/);
  assert.ok(turkishPublishedSlugs.includes("lorem-ipsum"));
  assert.ok(turkishPublishedSlugs.includes("text-to-file"));
  assert.ok(turkishPublishedSlugs.includes("character-count"));
  assert.ok(turkishPublishedSlugs.includes("social-image-resize"));
  assert.ok(turkishPublishedSlugs.includes("add-text-to-image"));
  for (const slug of ["jpg-to-png", "png-to-jpg", "webp-to-jpg", "webp-to-png", "jpg-to-webp", "png-to-webp", "heic-to-jpg", "image-compress"]) assert.ok(turkishPublishedSlugs.includes(slug));
  assert.ok(turkishPublishedSlugs.includes("text-case-converter"));
  assert.ok(turkishPublishedSlugs.includes("remove-duplicate-words"));
  assert.ok(turkishPublishedSlugs.includes("regex-tester"));
  for (const slug of ["color-converter", "cron-parser", "sql-formatter", "html-formatter", "css-formatter", "javascript-formatter"]) assert.ok(turkishPublishedSlugs.includes(slug));
  assert.match(toolPageSource, /TurkishCodeToolsWorkspace/);
  assert.match(turkishCodeSource, /processText\(slug, value, "", option, 1, "tr"\)/);
  assert.match(toolPageSource, /TurkishRegexWorkspace/);
  assert.match(turkishRegexSource, /processText\("regex-tester", pattern, sample, "", 1, "tr"\)/);
  assert.match(turkishTextUtilitySource, /processText\(slug, text, "", option, 1, "tr"\)/);
  assert.match(toolPageSource, /TurkishImageToolsWorkspace slug=\{slug as/);
  assert.match(turkishImageToolsSource, /eklenecek metin/);
  assert.match(turkishImageToolsSource, /getImageData\(x, y, 1, 1\)/);
  assert.match(turkishImageToolsSource, /Rengi kopyala/);
  assert.match(turkishImageToolsSource, /getImageData\(x, y, 1, 1\)/);
  assert.match(toolPageSource, /\["text-to-file", "character-count", "text-case-converter", "remove-duplicate-words"\]\.includes\(slug\).*TurkishTextUtilityWorkspace/);
  assert.match(turkishTextUtilitySource, /new Intl\.Segmenter\("tr"/);
  assert.match(turkishTextUtilitySource, /new Blob\(\[text\]/);
  assert.match(turkishLineToolsSource, /Satırları karıştır/);
  for (const slug of ["shuffle-lines", "add-line-numbers", "remove-line-numbers", "remove-empty-lines", "remove-characters", "sort-lines", "remove-duplicate-lines", "remove-spaces", "remove-line-breaks", "reverse-text", "text-repeater"]) assert.ok(turkishPublishedSlugs.includes(slug));
  assert.ok(turkishPublishedSlugs.includes("zip-files"));
  for (const slug of ["bulk-file-renamer", "filename-cleaner"]) assert.ok(turkishPublishedSlugs.includes(slug));
  assert.match(turkishFileInfoSource, /Dosyalar yaln\u0131zca taray\u0131c\u0131n\u0131zda incelenir/);
  for (const slug of ["file-hash", "mime-type-checker", "file-extension-checker", "file-size-checker", "duplicate-file-checker"]) assert.ok(turkishPublishedSlugs.includes(slug));
  assert.match(toolWorkspaceSource, /translated\.tr=\[/);
  assert.match(worldClockWorkspaceSource, /tr: \{ title: "Dünya saati", add: "Şehir ekle"/);
  assert.match(fortuneWorkspaceSource, /tarotNames\.tr = \["Deli","Büyücü"/);
  assert.match(tarotLocalizationSource, /tr:\{upright:"Kartın vurgusu: \{theme\}\."/);
  assert.match(fortuneWorkspaceSource, /tr: \{ birth:"Doğum tarihi",run:"Bugünün yorumunu gör"/);
  assert.match(sajuWorkspaceSource, /tr: \{ birth:"Doğum tarihi",time:"Doğum saati"/);
  assert.match(specialRandomWorkspaceSource, /people:"Katılımcılar",duties:"Görevler"/);
  assert.match(russianBarcodeCheckerSource, /turkishCopy = \{ title:"EAN-13 ve UPC-A barkod denetleyicisi"/);
  assert.match(specialRandomWorkspaceSource, /locale === "tr"/);
  assert.match(targetLocalePublicationSource, /"timer", "pomodoro-timer", "password-generator", "random-string-generator", "wifi-qr"/);
});
test("Turkish postal and phone formatters reuse country-specific local validation", () => {
  const slugs = ["us-phone-number-formatter", "us-zip-code-formatter", "canada-postal-code-formatter", "uk-postcode-formatter"];
  for (const slug of slugs) assert.ok(turkishPublishedSlugs.includes(slug));
  assert.match(toolPageSource, /TurkishCountryFormatWorkspace slug=\{slug as TurkishCountryFormatSlug\}/);
  assert.match(turkishCountryFormatSource, /runCountryTool\(slug, input\.trim\(\)\)/);
});

test("Turkish Japanese calendar and text converters use existing conversion logic", () => {
  const slugs = ["wareki-converter", "hiragana-katakana-converter", "fullwidth-halfwidth-converter", "japanese-romaji-converter", "japanese-number-kanji-converter"];
  for (const slug of slugs) assert.ok(turkishPublishedSlugs.includes(slug));
  assert.match(toolPageSource, /TurkishJapaneseToolsWorkspace slug=\{slug as TurkishJapaneseSlug\}/);
  assert.match(turkishJapaneseToolsSource, /gregorianToWareki/);
  assert.match(turkishJapaneseToolsSource, /convertKana/);
  assert.match(turkishJapaneseToolsSource, /convertWidth/);
  assert.match(turkishJapaneseToolsSource, /kanaToRomaji/);
  assert.match(turkishJapaneseToolsSource, /japaneseZodiac/);
  assert.match(turkishJapaneseToolsSource, /yakudoshi/);
  assert.match(turkishJapaneseToolsSource, /generateNumbersGame/);
  assert.match(turkishJapaneseToolsSource, /generateBingo5/);
});

test("Turkish text and structured data tools use localized client-side processing", () => {
  const slugs = ["text-compare", "csv-to-json", "json-to-csv", "base64", "url-encode-decode"];
  for (const slug of slugs) assert.ok(turkishPublishedSlugs.includes(slug));
  assert.match(toolPageSource, /TurkishDataToolsWorkspace slug=\{slug as TurkishDataSlug\}/);
  assert.match(turkishDataToolsSource, /processText\(slug, input, second, option, amount, "tr"\)/);
  assert.match(turkishDataToolsSource, /Metinleri/);
  assert.match(turkishDataToolsSource, /URL\.revokeObjectURL\(downloadUrl\)/);
});

test("Turkish PDF tools connect every translated PDF route to local processing", () => {
  const pdfSlugs = ["images-to-pdf", "pdf-merge", "pdf-split", "pdf-delete-pages", "pdf-reorder-pages", "pdf-rotate-pages", "pdf-add-page-numbers", "pdf-watermark", "pdf-metadata-viewer", "pdf-remove-metadata", "pdf-page-size-checker"];
  for (const slug of pdfSlugs) assert.ok(turkishPublishedSlugs.includes(slug));
  assert.match(toolPageSource, /TurkishPdfWorkspace slug=\{slug as TurkishPdfSlug\}/);
  assert.match(turkishPdfWorkspaceSource, /processPdf\(slug, files, option, text, "tr"\)/);
  assert.match(turkishPdfWorkspaceSource, /Toplam dosya boyutu 50 MB/);
  assert.match(turkishPdfWorkspaceSource, /URL\.revokeObjectURL\(outputUrl\)/);
});

test("Turkish editorial batches contain complete localized SEO and help content for 170 tools", () => {
  const expected = targetTurkishToolSlugs;
  assert.equal(expected.length, 170);
  for (const slug of ["brazil-cpf-validator", "brazil-cnpj-validator", "brazil-phone-number-formatter", "brazil-cep-formatter", "dutch-date-format-converter", "vietnam-phone-number-formatter", "vietnam-number-format-converter", "italy-fiscal-code-format-validator", "italy-vat-number-validator", "italy-number-format-converter", "italian-date-format-converter", "us-phone-number-formatter", "us-zip-code-formatter", "canada-postal-code-formatter", "uk-postcode-formatter", "australia-postcode-formatter", "english-date-format-converter"]) assert.ok(expected.includes(slug));
  assert.equal(new Set(expected).size, expected.length);
  for (const slug of ["indian-number-format-converter", "lakh-crore-converter", "pan-format-validator", "gstin-format-validator", "india-phone-number-formatter", "germany-iban-validator", "german-number-format-converter", "german-date-format-converter", "spain-dni-validator", "spain-nie-validator", "spanish-number-format-converter", "spanish-date-format-converter", "france-phone-number-formatter", "french-number-format-converter", "french-date-format-converter", "netherlands-iban-validator", "dutch-number-format-converter"]) assert.ok(expected.includes(slug));
  assert.deepEqual(targetTurkishToolSlugs, expected);
  for (const slug of expected) {
    const translation = getTargetTurkishToolTranslation(slug);
    assert.ok(translation);
    assert.ok(translation.title.length > 0 && translation.seoTitle.length > 0 && translation.seoDescription.length > 0);
    assert.equal(translation.steps.length, 3);
    assert.ok(translation.keywords.length >= 3);
    assert.ok(translation.example && translation.options && translation.caution);
    assert.ok(translation.faq.example && translation.faq.caution);
    assert.equal(entries.some(({ url }) => url === `${siteOrigin}/tr/tools/${slug}`), turkishPublishedSlugs.includes(slug));
  }
});
test("Russian timer and Pomodoro use localized controls before publication", () => {
  assert.match(toolPageSource, /slug === "timer" \|\| slug === "pomodoro-timer"/);
  assert.match(countdownWorkspaceSource, /ru:\s*\{[\s\S]*?hours:\s*"Часы"[\s\S]*?complete:\s*"Время вышло\."/);
  for (const slug of ["timer", "pomodoro-timer"]) {
    assert.equal(publicTools.find((tool) => tool.slug === slug).supportedLocales.includes("ru"), true);
    assert.equal(entries.some(({ url }) => url === `${siteOrigin}/ru/tools/${slug}`), true);
  }
});

test("Russian password and random-string generators expose localized controls", () => {
  assert.match(toolPageSource, /slug === "password-generator" \|\| slug === "random-string-generator"/);
  assert.match(randomStringWorkspaceSource, /ru:\s*\{[\s\S]*?length:\s*"Длина"[\s\S]*?generate:\s*"Создать"/);
  for (const slug of ["password-generator", "random-string-generator"]) {
    assert.equal(publicTools.find((tool) => tool.slug === slug).supportedLocales.includes("ru"), true);
    assert.equal(entries.some(({ url }) => url === `${siteOrigin}/ru/tools/${slug}`), true);
  }
});

test("Russian QR tools localize fields, errors, and the local-processing notice", () => {
  assert.match(toolPageSource, /\["wifi-qr", "contact-qr", "phone-qr", "email-qr"\]\.includes\(slug\)/);
  assert.match(qrWorkspaceSource, /ru:\{ssid:"Имя сети Wi-Fi \(SSID\)"[\s\S]*?privacy:"Введённые данные преобразуются в QR-код/);
  for (const slug of ["wifi-qr", "contact-qr", "phone-qr", "email-qr"]) {
    assert.equal(publicTools.find((tool) => tool.slug === slug).supportedLocales.includes("ru"), true);
    assert.equal(entries.some(({ url }) => url === `${siteOrigin}/ru/tools/${slug}`), true);
  }
});

test("Russian world clock localizes city controls and common time-zone names", () => {
  assert.match(toolPageSource, /slug === "world-clock"\s*\? <WorldClockWorkspace locale="ru" \/>/);
  assert.match(worldClockWorkspaceSource, /ru:\s*\{ title: "Мировые часы", add: "Добавить город"/);
  assert.match(worldClockWorkspaceSource, /"Asia\/Seoul": "Сеул"[\s\S]*?"Europe\/London": "Лондон"/);
  assert.equal(publicTools.find((tool) => tool.slug === "world-clock").supportedLocales.includes("ru"), true);
  assert.equal(entries.some(({ url }) => url === `${siteOrigin}/ru/tools/world-clock`), true);
});

test("Russian dice and random-number tools use translated controls and validation", () => {
  assert.match(toolPageSource, /slug === "dice-roller"/);
  assert.match(toolPageSource, /slug === "random-number"/);
  assert.match(specialRandomWorkspaceSource, /ru:\s*\{[\s\S]*?generate: "Создать числа"[\s\S]*?invalidCount: "Проверьте количество и диапазон чисел\."/);
  for (const slug of ["dice-roller", "random-number"]) {
    assert.equal(publicTools.find((tool) => tool.slug === slug).supportedLocales.includes("ru"), true);
    assert.equal(entries.some(({ url }) => url === `${siteOrigin}/ru/tools/${slug}`), true);
  }
});

test("Russian stopwatch uses localized action and lap labels", () => {
  assert.match(toolPageSource, /RussianStopwatchWorkspace/);
  assert.match(toolWorkspaceSource, /ru:\["Запустить","Пауза","Продолжить","Сбросить","Круг","Круги"/);
  assert.equal(publicTools.find((tool) => tool.slug === "stopwatch").supportedLocales.includes("ru"), true);
  assert.equal(entries.some(({ url }) => url === `${siteOrigin}/ru/tools/stopwatch`), true);
});

test("Russian coin flip validates the count and publishes one localized workspace", () => {
  assert.match(toolPageSource, /slug === "coin-flip"\s*\? <CoinFlipWorkspace \/>/);
  assert.match(specialRandomWorkspaceSource, /function CoinFlipWorkspace/);
  assert.equal(publicTools.find((tool) => tool.slug === "coin-flip").supportedLocales.includes("ru"), true);
  assert.equal(entries.some(({ url }) => url === `${siteOrigin}/ru/tools/coin-flip`), true);
});

test("Russian name drawing and team workspaces localize controls and validation", () => {
  assert.match(toolPageSource, /slug === "random-name-picker" \|\| slug === "draw-lots"/);
  assert.match(toolPageSource, /slug === "random-team-maker"/);
  assert.match(specialRandomWorkspaceSource, /participants: "Имена участников \(по одному в строке\)"[\s\S]*?teams: "Настройки команд"[\s\S]*?teamNames: "Названия команд/);
  for (const slug of ["random-name-picker", "draw-lots", "random-team-maker"]) {
    assert.equal(publicTools.find((tool) => tool.slug === slug).supportedLocales.includes("ru"), true);
    assert.equal(entries.some(({ url }) => url === `${siteOrigin}/ru/tools/${slug}`), true);
  }
});

test("Russian random order workspace localizes the reveal and copy controls", () => {
  assert.match(toolPageSource, /slug === "random-order"/);
  assert.match(specialRandomWorkspaceSource, /Показать следующего[\s\S]*?Показать всех[\s\S]*?Копировать список/);
  assert.equal(publicTools.find((tool) => tool.slug === "random-order").supportedLocales.includes("ru"), true);
  assert.equal(entries.some(({ url }) => url === `${siteOrigin}/ru/tools/random-order`), true);
});

test("Russian random seat workspace localizes seat assignment and empty seats", () => {
  assert.match(toolPageSource, /slug === "random-seat"/);
  assert.match(specialRandomWorkspaceSource, /people:\s*"Участники \(по одному в строке\)"[\s\S]*?rows:\s*"Строки"[\s\S]*?columns:\s*"Столбцы"[\s\S]*?arrange:\s*"Рассадить участников"[\s\S]*?empty:\s*"Свободно"/);
  assert.equal(publicTools.find((tool) => tool.slug === "random-seat").supportedLocales.includes("ru"), true);
  assert.equal(entries.some(({ url }) => url === `${siteOrigin}/ru/tools/random-seat`), true);
});

test("Russian duty picker localizes both inputs, validation, and assignments", () => {
  assert.match(toolPageSource, /slug === "duty-picker"/);
  assert.match(specialRandomWorkspaceSource, /function RussianDutyPickerWorkspace[\s\S]*?people:"\\u0423\\u0447[\s\S]*?duties:"\\u041e\\u0431[\s\S]*?error:"\\u0412[\s\S]*?result:"\\u0420/);
  assert.equal(publicTools.find((tool) => tool.slug === "duty-picker").supportedLocales.includes("ru"), true);
  assert.equal(entries.some(({ url }) => url === `${siteOrigin}/ru/tools/duty-picker`), true);
});

test("Russian random wheel localizes entry editing and spin states", () => {
  assert.match(toolPageSource, /slug === "random-wheel"/);
  assert.match(specialRandomWorkspaceSource, /ru: \{ label: "Введите один вариант в строке"[\s\S]*?spinning: "Колесо вращается/);
  assert.equal(publicTools.find((tool) => tool.slug === "random-wheel").supportedLocales.includes("ru"), true);
  assert.equal(entries.some(({ url }) => url === `${siteOrigin}/ru/tools/random-wheel`), true);
});

test("Polish tarot workspace translates controls, all cards, and interpretations before publication", () => {
  assert.equal(targetLocalePublication.pl.publishedToolSlugs.includes("tarot-card"), true);
  assert.equal(entries.some(({ url }) => url === "https://www.woori.today/pl/tools/tarot-card"), true);
  assert.match(fortuneWorkspaceSource, /Object\.assign\(tarotText, \{ pl:/);
  assert.match(fortuneWorkspaceSource, /tarotNames\.pl = \["G\\u0142upiec","Mag"[\s\S]*?"\\u015Awiat"\]/);
  assert.match(fortuneWorkspaceSource, /locale:RouteLocale \| "ru" \| "tr" \| "pl"/);
  assert.match(tarotLocalizationSource, /const polishThemes: readonly Theme\[\] = \[[\s\S]*?const polishSentence/);
  assert.match(tarotLocalizationSource, /locale === "pl"\) return polishSentence/);
  assert.match(toolWorkspaceSource, /tool\.slug === "tarot-card"\) return <TarotWorkspace locale=\{phaseLocale === "pl" \? "pl" : specializedLocale\}/);
});

test("Polish daily fortune localizes date validation, result groups, and privacy copy before publication", () => {
  assert.equal(targetLocalePublication.pl.publishedToolSlugs.includes("daily-fortune"), true);
  assert.equal(entries.some(({ url }) => url === "https://www.woori.today/pl/tools/daily-fortune"), true);
  assert.match(fortuneWorkspaceSource, /Object\.assign\(dailyText, \{ pl:/);
  assert.match(fortuneWorkspaceSource, /Object\.assign\(dailyPools, \{ pl:/);
  assert.match(fortuneWorkspaceSource, /locale:RouteLocale \| "ru" \| "tr" \| "pl"/);
  assert.match(toolWorkspaceSource, /tool\.slug === "daily-fortune"\) return <DailyFortuneWorkspace locale=\{phaseLocale === "pl" \? "pl" : specializedLocale\}/);
});

test("Polish saju localizes calendar inputs, five elements, methodology, and privacy before publication", () => {
  assert.equal(targetLocalePublication.pl.publishedToolSlugs.includes("saju"), true);
  assert.equal(entries.some(({ url }) => url === "https://www.woori.today/pl/tools/saju"), true);
  assert.match(sajuWorkspaceSource, /Object\.assign\(labels, \{ pl:/);
  assert.match(sajuWorkspaceSource, /elementNames\.pl=elementMap/);
  assert.match(toolWorkspaceSource, /tool\.slug === "saju"\) return <SajuWorkspace locale=\{phaseLocale === "pl" \? "pl" : specializedLocale\}/);
});

test("Polish random number generator uses localized range, count, options, and validation", () => {
  assert.equal(targetLocalePublication.pl.publishedToolSlugs.includes("random-number"), true);
  assert.equal(entries.some(({ url }) => url === "https://www.woori.today/pl/tools/random-number"), true);
  assert.match(specialRandomWorkspaceSource, /export function RandomNumberWorkspace\(\{ locale \}: \{ locale:RouteLocale \| "ru" \| "tr" \| "pl" \}\)/);
  assert.match(specialRandomWorkspaceSource, /locale === "pl" \? \{ \.\.\.copy\[locale\], drawCount: "Liczba losowanych liczb" \}/);
  assert.match(toolWorkspaceSource, /tool\.slug === "random-number"\) return <RandomNumberWorkspace locale=\{phaseLocale === "pl" \? "pl" : specializedLocale\}/);
});

test("Polish name picker and draw lots share localized participant controls and winner actions", () => {
  for (const slug of ["random-name-picker", "draw-lots"]) {
    assert.equal(targetLocalePublication.pl.publishedToolSlugs.includes(slug), true);
    assert.equal(entries.some(({ url }) => url === `https://www.woori.today/pl/tools/${slug}`), true);
  }
  assert.match(specialRandomWorkspaceSource, /RandomNameWorkspace\(\{ locale, slug: _slug \}: \{ locale:RouteLocale \| "ru" \| "tr" \| "pl"/);
  assert.match(specialRandomWorkspaceSource, /locale === "ru" \|\| locale === "pl" \? t\.drawWinners : t\.draw/);
  assert.match(toolWorkspaceSource, /slug=\{tool\.slug\} locale=\{phaseLocale === "pl" \? "pl" : specializedLocale\}/);
});

test("Polish random wheel localizes editing, limits, speed, and spinning state", () => {
  assert.equal(targetLocalePublication.pl.publishedToolSlugs.includes("random-wheel"), true);
  assert.equal(entries.some(({ url }) => url === "https://www.woori.today/pl/tools/random-wheel"), true);
  assert.match(specialRandomWorkspaceSource, /Object\.assign\(wheelCopy, \{ pl:/);
  assert.match(specialRandomWorkspaceSource, /Wylosowana opcja/);
  assert.match(specialRandomWorkspaceSource, /locale:RouteLocale \| "ru" \| "tr" \| "pl"/);
  assert.match(specialRandomWorkspaceSource, /pl:\["Pizza","Kurczak","Burger","Sushi"\]/);
  assert.match(toolWorkspaceSource, /tool\.slug === "random-wheel"\) return <RandomWheelWorkspace locale=\{phaseLocale === "pl" \? "pl" : specializedLocale\}/);
});

test("Polish random team maker localizes team controls, validation, and generated labels", () => {
  assert.equal(targetLocalePublication.pl.publishedToolSlugs.includes("random-team-maker"), true);
  assert.equal(entries.some(({ url }) => url === "https://www.woori.today/pl/tools/random-team-maker"), true);
  assert.match(specialRandomWorkspaceSource, /RandomTeamWorkspace\(\{ locale \}: \{ locale:RouteLocale \| "ru" \| "tr" \| "pl" \}\)/);
  assert.match(specialRandomWorkspaceSource, /teamPrefix:Record<string,string>=\{pl:"Zespół"/);
  assert.match(specialRandomWorkspaceSource, /drawWinners:"Losuj zwycięzców"/);
  assert.match(specialRandomWorkspaceSource, /locale === "ru" \|\| locale === "pl" \? \(teams.length \? t.makeTeamsAgain : t.makeTeams\)/);
  assert.match(toolWorkspaceSource, /tool\.slug === "random-team-maker"\) return <RandomTeamWorkspace locale=\{phaseLocale === "pl" \? "pl" : specializedLocale\}/);
});

test("Polish random order localizes participant labels, reveal actions, and copy", () => {
  assert.equal(targetLocalePublication.pl.publishedToolSlugs.includes("random-order"), true);
  assert.equal(entries.some(({ url }) => url === "https://www.woori.today/pl/tools/random-order"), true);
  assert.match(specialRandomWorkspaceSource, /const labels = \(\{ pl:\{label:"Uczestnicy/);
  assert.match(specialRandomWorkspaceSource, /RandomOrderWorkspace\(\{ locale \}: \{ locale:RouteLocale \| "ru" \| "tr" \| "pl" \}\)/);
  assert.match(toolWorkspaceSource, /tool\.slug === "random-order"\) return <RandomOrderWorkspace locale=\{phaseLocale === "pl" \? "pl" : specializedLocale\}/);
});

test("Polish random seat localizes the seating grid and capacity error", () => {
  assert.equal(targetLocalePublication.pl.publishedToolSlugs.includes("random-seat"), true);
  assert.equal(entries.some(({ url }) => url === "https://www.woori.today/pl/tools/random-seat"), true);
  assert.match(specialRandomWorkspaceSource, /RandomSeatWorkspace\(\{ locale \}: \{ locale:RouteLocale \| "ru" \| "tr" \| "pl" \}\)/);
  assert.match(specialRandomWorkspaceSource, /pl:\{people:"Uczestnicy \(jedna osoba w ka\\u017Cdym wierszu\)",rows:"Wiersze",columns:"Kolumny",arrange:"Przydziel miejsca",empty:"Wolne"\}/);
  assert.match(specialRandomWorkspaceSource, /pl:"Dodaj miejsca lub zmniejsz liczb\\u0119 uczestnik\\u00F3w\./);
  assert.match(toolWorkspaceSource, /tool\.slug === "random-seat"\) return <RandomSeatWorkspace locale=\{phaseLocale === "pl" \? "pl" : specializedLocale\}/);
});

test("Polish duty picker localizes participant and duty assignment controls", () => {
  assert.equal(targetLocalePublication.pl.publishedToolSlugs.includes("duty-picker"), true);
  assert.equal(entries.some(({ url }) => url === "https://www.woori.today/pl/tools/duty-picker"), true);
  assert.match(specialRandomWorkspaceSource, /RussianDutyPickerWorkspace\(\{ locale = "ru" \}: \{ locale\?: "ru" \| "tr" \| "pl" \}\)/);
  assert.match(specialRandomWorkspaceSource, /locale==="pl"\?\{people:"Uczestnicy",duties:"Obowi\\u0105zki"/);
  assert.match(toolWorkspaceSource, /tool\.slug === "duty-picker" && phaseLocale === "pl"\) return <RussianDutyPickerWorkspace locale="pl" \/>/);
});

test("Polish dice roller localizes die settings, explanation, statistics, and validation", () => {
  assert.equal(targetLocalePublication.pl.publishedToolSlugs.includes("dice-roller"), true);
  assert.equal(entries.some(({ url }) => url === "https://www.woori.today/pl/tools/dice-roller"), true);
  assert.match(specialRandomWorkspaceSource, /Object\.assign\(copy\.pl,\{selection:"Rodzaj ko\\u015Bci",diceCount:"Liczba ko\\u015Bci"/);
  assert.match(specialRandomWorkspaceSource, /invalidCount:"Wybierz od 1 do 20 ko\\u015Bci/);
  assert.match(toolWorkspaceSource, /tool\.slug === "dice-roller"\) return <DiceWorkspace locale=\{phaseLocale === "pl" \? "pl" : specializedLocale\}/);
});

test("Polish coin flip localizes count, sides, results, and range validation", () => {
  assert.equal(targetLocalePublication.pl.publishedToolSlugs.includes("coin-flip"), true);
  assert.equal(entries.some(({ url }) => url === "https://www.woori.today/pl/tools/coin-flip"), true);
  assert.match(specialRandomWorkspaceSource, /locale === "pl"\s*\? \{ count: "Liczba rzut\\u00F3w", again: "Rzu\\u0107 ponownie", flip: "Rzu\\u0107 monet\\u0105"/);
  assert.match(specialRandomWorkspaceSource, /tails: "Reszka", invalid: "Wpisz liczb\\u0119 od 1 do 1000\."/);
  assert.match(toolWorkspaceSource, /tool\.slug === "coin-flip" && phaseLocale === "pl"\) return <CoinFlipWorkspace locale="pl" \/>/);
});

test("Russian tarot page localizes controls, names, and card interpretations", () => {
  assert.match(toolPageSource, /slug === "tarot-card"/);
  assert.match(fortuneWorkspaceSource, /ru: \{ question: "Вопрос \(необязательно\)"[\s\S]*?note: "Таро предназначено/);
  assert.match(fortuneWorkspaceSource, /tarotNames\.ru = \["Шут"[\s\S]*?"Мир"\]/);
  assert.match(tarotLocalizationSource, /const russianThemes: readonly Theme\[\] = \[[\s\S]*?const russianSentence/);
  assert.equal(publicTools.find((tool) => tool.slug === "tarot-card").supportedLocales.includes("ru"), true);
  assert.equal(entries.some(({ url }) => url === `${siteOrigin}/ru/tools/tarot-card`), true);
});

test("Russian daily fortune localizes date input, result groups, pools, and privacy copy", () => {
  assert.match(toolPageSource, /slug === "daily-fortune"/);
  assert.match(fortuneWorkspaceSource, /ru: \{ birth: "Дата рождения"[\s\S]*?privacy: "Дата рождения используется/);
  assert.match(fortuneWorkspaceSource, /Object\.assign\(dailyPools, \{ ru: \{[\s\S]*?total: \[[\s\S]*?colors: \[/);
  assert.equal(publicTools.find((tool) => tool.slug === "daily-fortune").supportedLocales.includes("ru"), true);
  assert.equal(entries.some(({ url }) => url === `${siteOrigin}/ru/tools/daily-fortune`), true);
});

test("Russian saju localizes calendar inputs, five elements, methodology, and privacy", () => {
  assert.match(toolPageSource, /slug === "saju"/);
  assert.match(sajuWorkspaceSource, /ru: \{ birth: "Дата рождения"[\s\S]*?wood: "Дерево"[\s\S]*?basis: "Расчёт использует/);
  assert.match(sajuWorkspaceSource, /"hi","ru"/);
  assert.equal(publicTools.find((tool) => tool.slug === "saju").supportedLocales.includes("ru"), true);
  assert.equal(entries.some(({ url }) => url === `${siteOrigin}/ru/tools/saju`), true);
});
