import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { tsImport } from "tsx/esm/api";

const [{ locales, localizePath }, { siteChromeMessages }] = await Promise.all([
  tsImport("../src/i18n/routing.ts", import.meta.url),
  tsImport("../src/i18n/site-chrome-messages.ts", import.meta.url),
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

test("family site destinations preserve the current locale and select Tools by default", async () => {
  const selector = await readFile(new URL("../src/components/layout/family-site-selector.tsx", import.meta.url), "utf8");
  for (const locale of locales) {
    assert.equal(localizePath(locale, "/money"), `/${locale}/money`);
    assert.equal(localizePath(locale, "/calculators"), `/${locale}/calculators`);
    assert.equal(localizePath(locale, "/tools"), `/${locale}/tools`);
  }
  assert.match(selector, /value=\{`\/\$\{locale\}`\}/);
  assert.match(selector, /value=\{localizePath\(locale, "\/tools"\)\}/);
  assert.match(selector, /window\.location\.assign\(event\.target\.value\)/);
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
