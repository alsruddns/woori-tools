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
const countrySlugSource = await readFile(new URL("../src/lib/country-tool-slugs.ts", import.meta.url), "utf8");
const countrySlugs = [...countrySlugSource.matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1]);
const { tools: publicTools, filterPublicTools } = await importTypeScript("../src/registry/tools.ts", [
  ['import { locales, type PublishedTargetLocale } from "../i18n/routing";', `const locales = ${JSON.stringify(locales)};`],
  ['import { COUNTRY_TOOL_SLUGS } from "../lib/country-tool-slugs";', `const COUNTRY_TOOL_SLUGS = ${JSON.stringify(countrySlugs)};`],
  ['import { targetLocalePublication } from "./target-locale-publication";', 'const targetLocalePublication = { ru: { publishedToolSlugs: ["barcode-generator", "markdown-preview", "timer", "pomodoro-timer", "password-generator", "random-string-generator", "wifi-qr", "contact-qr", "phone-qr", "email-qr", "world-clock", "dice-roller", "random-number", "stopwatch", "coin-flip", "random-name-picker", "draw-lots", "random-team-maker"] } };'],
]);
const seoSource = await readFile(new URL("../src/lib/seo.ts", import.meta.url), "utf8");
const { languageAlternates } = await importTypeScript("../src/lib/seo.ts", [[
  'import { getPublishedTargetLocaleConfig, publishedTargetHreflangs, locales, type PublishedTargetLocale } from "@/i18n/routing";',
  `const locales = ${JSON.stringify(publishedTargetLocales)}; const publishedTargetHreflangs = ${JSON.stringify(publishedTargetHreflangs)};`,
]]);
const sitemapSource = await readFile(new URL("../src/app/sitemap.ts", import.meta.url), "utf8");
const localeLayoutSource = await readFile(new URL("../src/app/[locale]/layout.tsx", import.meta.url), "utf8");
const toolPageSource = await readFile(new URL("../src/app/[locale]/tools/[slug]/page.tsx", import.meta.url), "utf8");
const markdownWorkspaceSource = await readFile(new URL("../src/components/tool/russian-markdown-workspace.tsx", import.meta.url), "utf8");
const countdownWorkspaceSource = await readFile(new URL("../src/components/tool/countdown-workspace.tsx", import.meta.url), "utf8");
const randomStringWorkspaceSource = await readFile(new URL("../src/components/tool/random-string-workspace.tsx", import.meta.url), "utf8");
const qrWorkspaceSource = await readFile(new URL("../src/components/tool/qr-workspace.tsx", import.meta.url), "utf8");
const worldClockWorkspaceSource = await readFile(new URL("../src/components/tool/world-clock-workspace.tsx", import.meta.url), "utf8");
const specialRandomWorkspaceSource = await readFile(new URL("../src/components/tool/special-random-workspaces.tsx", import.meta.url), "utf8");
const toolWorkspaceSource = await readFile(new URL("../src/components/tool/tool-workspace.tsx", import.meta.url), "utf8");
const nextConfig = await readFile(new URL("../next.config.ts", import.meta.url), "utf8");
const siteOrigin = "https://www.woori.today";
const entries = createSitemapEntries({
  tools: publicTools,
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
  assert.equal(publishedTargetLocales.length, 16);
  assert.equal(listingEntries.length, 16);
  const expectedDetailCount = publicTools.reduce((sum, tool) => sum + tool.supportedLocales.length, 0);
  assert.equal(detailEntries.length, expectedDetailCount);
  assert.equal(entries.length, expectedDetailCount + 16);
  assert.equal(new Set(entries.map(({ url }) => url)).size, entries.length);

  const publishedRouteMatrix = publicTools.flatMap(({ slug, supportedLocales }) => supportedLocales.map((locale) => `${siteOrigin}/${locale}/tools/${slug}`));
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
    assert.match(entry.url, /^https:\/\/www\.woori\.today\/(ko|en|ja|zh|es|pt-br|de|fr|vi|id|th|zh-tw|it|nl|hi|ru)\/tools(?:\/[^/]+)?$/);
    assert.equal(entry.alternates.languages["x-default"], entry.alternates.languages.ko);
    const segments = new URL(entry.url).pathname.split("/").filter(Boolean);
    const slug = segments[2];
    const alternates = slug ? publicTools.find((tool) => tool.slug === slug).supportedLocales : publishedTargetLocales;
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
  const filteredTools = filterPublicTools([...publicTools, privateTool]);
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
  assert.equal(Object.keys(entries.find(({ url }) => url.endsWith("/tools/lotto-number-generator")).alternates.languages).length, 16);
  assert.equal(Object.keys(entries.find(({ url }) => url.endsWith("/tools/barcode-generator")).alternates.languages).length, 17);
  assert.equal(Object.keys(entries.find(({ url }) => url.endsWith("/tools/markdown-preview")).alternates.languages).length, 17);
  assert.equal(Object.keys(entries.find(({ url }) => url.endsWith("/tools/timer")).alternates.languages).length, 17);
  assert.equal(Object.keys(entries.find(({ url }) => url.endsWith("/tools/pomodoro-timer")).alternates.languages).length, 17);
  assert.equal(Object.keys(entries.find(({ url }) => url.endsWith("/tools/password-generator")).alternates.languages).length, 17);
  assert.equal(Object.keys(entries.find(({ url }) => url.endsWith("/tools/random-string-generator")).alternates.languages).length, 17);
  for (const slug of ["wifi-qr", "contact-qr", "phone-qr", "email-qr"]) assert.equal(Object.keys(entries.find(({ url }) => url.endsWith(`/tools/${slug}`)).alternates.languages).length, 17);
  assert.equal(Object.keys(entries.find(({ url }) => url.endsWith("/tools/world-clock")).alternates.languages).length, 17);
  for (const slug of ["dice-roller", "random-number"]) assert.equal(Object.keys(entries.find(({ url }) => url.endsWith(`/tools/${slug}`)).alternates.languages).length, 17);
  assert.equal(Object.keys(entries.find(({ url }) => url.endsWith("/tools/stopwatch")).alternates.languages).length, 17);
  for (const slug of ["random-name-picker", "draw-lots", "random-team-maker"]) assert.equal(Object.keys(entries.find(({ url }) => url.endsWith(`/tools/${slug}`)).alternates.languages).length, 17);
  assert.equal(entries.some(({ url }) => url.endsWith("/ru/tools/barcode-generator")), true);
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
  assert.equal(entries.some(({ url }) => url.endsWith("/ru/tools/image-compress")), false);
  assert.equal(localeConfig.find(({ routeLocale }) => routeLocale === "pt-br").hreflang, "pt-BR");
  assert.equal(localeConfig.find(({ routeLocale }) => routeLocale === "zh-tw").hreflang, "zh-TW");
});

test("Russian markdown preview is only published with its localized workspace", () => {
  assert.match(toolPageSource, /slug === "markdown-preview"\s*\? <RussianMarkdownWorkspace \/>/);
  assert.match(markdownWorkspaceSource, /placeholder=\{\s*"# Заголовок\\n\\nВведите пример \*\*Markdown\*\*\."/);
  assert.equal(publicTools.find(({ slug }) => slug === "markdown-preview").supportedLocales.includes("ru"), true);
  assert.equal(entries.some(({ url }) => url === `${siteOrigin}/ru/tools/markdown-preview`), true);
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
  assert.match(specialRandomWorkspaceSource, /function CoinFlipWorkspace\(\)[\s\S]*?Укажите от 1 до 1000 бросков\.[\s\S]*?Орёл[\s\S]*?Решка/);
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
