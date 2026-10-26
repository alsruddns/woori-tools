import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { tsImport } from "tsx/esm/api";

const [{ locales, localeLabels, localizePath }, { siteChromeMessages }, { familySiteCopy, additionalFamilySiteCopy }] = await Promise.all([
  tsImport("../src/i18n/routing.ts", import.meta.url),
  tsImport("../src/i18n/site-chrome-messages.ts", import.meta.url),
  tsImport("../src/i18n/family-site-copy.ts", import.meta.url),
]);

const requiredCopy = [
  "familySite", "portal", "moneyBook", "calculator", "tools", "logoHome", "contact", "contactTitle",
  "contactIntro", "general", "collaboration", "advertising", "bugReport", "emailPrompt", "responseNote", "close",
];
const localeSpecificCopy = requiredCopy.filter((key) => key !== "portal" && key !== "contact");

test("site navigation and contact copy is complete and localized for all 15 locales", () => {
  assert.equal(Object.keys(siteChromeMessages).length, 15);
  for (const locale of locales) {
    for (const key of requiredCopy) {
      assert.equal(typeof siteChromeMessages[locale][key], "string", `${locale}/${key} should be a string`);
      assert.ok(siteChromeMessages[locale][key].trim(), `${locale}/${key} should not be empty`);
    }
    if (locale !== "en") {
      for (const key of localeSpecificCopy) assert.notEqual(siteChromeMessages[locale][key], siteChromeMessages.en[key], `${locale}/${key} should not fall back to English`);
    }
  }
});

test("language selector exposes native language names while retaining locale route values", () => {
  assert.deepEqual(localeLabels, {
    ko: "한국어", en: "English", ja: "日本語", zh: "简体中文", es: "Español", "pt-br": "Português (Brasil)",
    de: "Deutsch", fr: "Français", vi: "Tiếng Việt", id: "Bahasa Indonesia", th: "ไทย", "zh-tw": "繁體中文",
    it: "Italiano", nl: "Nederlands", hi: "हिन्दी",
  });
});

test("desktop and mobile Family Sites navigation has five enabled locale-first links and a fixed trigger", async () => {
  const [selector, { isFamilySiteActive }] = await Promise.all([
    readFile(new URL("../src/components/layout/family-site-selector.tsx", import.meta.url), "utf8"),
    tsImport("../src/components/layout/family-site-selector.tsx", import.meta.url),
  ]);
  for (const locale of locales) {
    for (const field of ["label", "portal", "calculator", "tools", "moneyBook", "newTab"]) assert.ok(familySiteCopy[locale][field]);
    for (const field of ["documents", "quiz"]) assert.ok(additionalFamilySiteCopy[locale][field]?.trim());
    if (locale !== "en") assert.notEqual(familySiteCopy[locale].label, familySiteCopy.en.label);
    for (const path of ["/calculators", "/tools", "/money", "/docs", "/quiz"]) assert.equal(localizePath(locale, path), `/${locale}${path}`);
    assert.equal(isFamilySiteActive(`/${locale}/tools/example-tool`, `/${locale}/tools`), true);
    assert.equal(isFamilySiteActive(`/${locale}/tools`, `/${locale}/tools`), true);
    assert.equal(isFamilySiteActive(`/${locale}/toolsmith`, `/${locale}/tools`), false);
  }
  assert.match(selector, /<nav aria-label=\{family\.label\} className="hidden min-w-0 flex-1 items-center justify-center gap-0\.5 lg:flex">/);
  assert.match(selector, /<details className="relative shrink-0 lg:hidden">/);
  assert.match(selector, /target="_blank"/);
  assert.match(selector, /rel="noopener noreferrer"/);
  assert.match(selector, /aria-current=\{active \? "page" : undefined\}/);
  assert.match(selector, /family\.label/);
  assert.match(selector, /enabledFamilyServices\.map/);
  for (const path of ["/calculators", "/tools", "/docs", "/quiz"]) assert.ok(selector.includes(path));
  assert.doesNotMatch(selector, /href: localizePath\(locale, "\/money"\)/);
  assert.doesNotMatch(selector, /\/(?:docs|quiz)\/\$\{locale\}/);
  assert.doesNotMatch(selector, /<select/);
});

test("footer keeps locale-first privacy and terms links and localized contact options", async () => {
  const [footer, dialog] = await Promise.all([
    readFile(new URL("../src/components/layout/site-footer.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/layout/contact-dialog.tsx", import.meta.url), "utf8"),
  ]);
  for (const locale of locales) {
    assert.equal(localizePath(locale, "/privacy"), `/${locale}/privacy`);
    assert.equal(localizePath(locale, "/terms"), `/${locale}/terms`);
    for (const key of ["general", "collaboration", "advertising", "bugReport"]) assert.ok(siteChromeMessages[locale][key].trim());
  }
  assert.match(footer, /localizePath\(locale, "\/privacy"\)/);
  assert.match(footer, /localizePath\(locale, "\/terms"\)/);
  assert.match(dialog, /krdd125@gmail\.com/);
});

test("disabled ads suppress the rail and placeholder regardless of placeholder configuration", async () => {
  const source = await readFile(new URL("../src/components/tool/tool-navigation-shell.tsx", import.meta.url), "utf8");
  assert.match(source, /const adsEnabled = process\.env\.NEXT_PUBLIC_ADS_ENABLED === "true"/);
  assert.match(source, /const showAdPlaceholder = adsEnabled && process\.env\.NEXT_PUBLIC_SHOW_AD_PLACEHOLDER === "true"/);
  assert.match(source, /\{adsEnabled && <AdRail/);
  assert.match(source, /\{showPlaceholder && <div/);
});

test("logo points to the localized portal and contact dialog is keyboard accessible", async () => {
  const [header, dialog, workflow] = await Promise.all([
    readFile(new URL("../src/components/layout/site-header.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/layout/contact-dialog.tsx", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/deploy.yml", import.meta.url), "utf8"),
  ]);
  assert.match(header, /href=\{`\/\$\{locale\}`\}/);
  assert.match(header, /aria-label=\{chrome\.logoHome\}/);
  assert.match(dialog, /showModal\(\)/);
  assert.match(dialog, /aria-labelledby="contact-dialog-title"/);
  assert.match(dialog, /aria-describedby="contact-dialog-description"/);
  assert.match(dialog, /event\.target === event\.currentTarget/);
  assert.match(dialog, /dialogRef\.current\?\.close\(\)/);
  assert.match(dialog, /mailto:.*CONTACT_EMAIL/);
  assert.match(dialog, /krdd125@gmail\.com/);
  assert.match(workflow, /INDEXNOW_KEY:\s*\$\{\{ secrets\.INDEXNOW_KEY \}\}/);
  assert.doesNotMatch(workflow, /INDEXNOW_KEY:\s*[a-f0-9]{20,}/i);
});
