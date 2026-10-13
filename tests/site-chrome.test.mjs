import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { tsImport } from "tsx/esm/api";

const [{ locales, localizePath }, { siteChromeMessages }, { familySiteCopy }] = await Promise.all([
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

test("family site names and destinations are localized, ordered, and open securely in a new tab", async () => {
  const selector = await readFile(new URL("../src/components/layout/family-site-selector.tsx", import.meta.url), "utf8");
  for (const locale of locales) {
    for (const field of ["label", "portal", "calculator", "tools", "moneyBook", "newTab"]) {
      assert.ok(familySiteCopy[locale][field], `${locale}/${field} should be translated`);
    }
    if (locale !== "en") assert.notEqual(familySiteCopy[locale].label, familySiteCopy.en.label);
    assert.equal(localizePath(locale, "/money"), `/${locale}/money`);
    assert.equal(localizePath(locale, "/calculators"), `/${locale}/calculators`);
    assert.equal(localizePath(locale, "/tools"), `/${locale}/tools`);
  }
  assert.deepEqual(
    [familySiteCopy.ko.label, familySiteCopy.ko.portal, familySiteCopy.ko.calculator, familySiteCopy.ko.tools, familySiteCopy.ko.moneyBook],
    ["패밀리사이트", "포탈", "계산기", "온라인 도구", "무료 공유 가계부"],
  );
  assert.match(selector, /value=\{`\/\$\{locale\}`\}/);
  assert.match(selector, /value=\{localizePath\(locale, "\/tools"\)\}/);
  assert.match(selector, /window\.open\(event\.currentTarget\.value, "_blank", "noopener,noreferrer"\)/);
  assert.match(selector, /family\.label/);
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
