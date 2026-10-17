import assert from "node:assert/strict";
import { locales } from "../src/i18n/routing";
import { getLocalizedCategories } from "../src/registry/category-translations";
import { getFileGuidance } from "../src/registry/file-guidance";
import { homeContent } from "../src/registry/home-content";
import { getToolContent } from "../src/registry/tool-content";
import { toolExampleInputs } from "../src/registry/tool-example-inputs";
import { getToolFaqQuestions } from "../src/registry/tool-faq";
import { getToolRiskNote } from "../src/registry/tool-risk-notes";
import { localizeTool } from "../src/registry/tool-translations";
import { renameCopy, selectionCopy } from "../src/registry/tool-option-copy";
import { tools } from "../src/registry/tools";

const slugs = new Set(tools.map((tool) => tool.slug));
assert.equal(slugs.size, tools.length, "duplicate public slug");
assert.deepEqual(new Set(Object.keys(toolExampleInputs)), slugs, "sample inputs must match public tools exactly");

for (const locale of locales) {
  assert.ok(Object.values(homeContent[locale]).every((value) => value.trim()), `missing ${locale} home editorial copy`);
  assert.ok(Object.values(renameCopy[locale]).every((value) => value.trim()), `missing ${locale} rename labels`);
  assert.ok(Object.values(selectionCopy[locale]).every((value) => value.trim()), `missing ${locale} selection labels`);
  const categories = new Set(getLocalizedCategories(locale).map((category) => category.id));
  const overviews = new Set<string>();
  const examples = new Set<string>();

  for (const tool of tools) {
    assert.ok(tool.supportedLocales.includes(locale), `${tool.slug}: missing ${locale} route`);
    assert.ok(categories.has(tool.category), `${tool.slug}: broken category link in ${locale}`);
    for (const related of tool.relatedTools ?? []) assert.ok(slugs.has(related), `${tool.slug}: broken related link ${related}`);

    const localized = localizeTool(tool, locale);
    const copy = getToolContent(tool.slug, locale, localized.description);
    const faq = getToolFaqQuestions(locale, localized.title);
    assert.ok(localized.title.trim() && localized.description.trim(), `${tool.slug}: empty ${locale} metadata`);
    assert.ok(copy, `${tool.slug}: missing ${locale} editorial content`);
    for (const [field, value] of Object.entries({
      overview: copy.overview,
      example: copy.example,
      options: copy.options,
      caution: copy.caution,
    })) {
      assert.ok(typeof value === "string" && value.trim(), `${tool.slug}: empty ${locale} ${field}`);
      assert.ok(!/^[a-z]+(?:\.[a-z]+)+$/.test(value), `${tool.slug}: raw ${locale} key ${field}`);
    }
    for (const [field, value] of Object.entries(copy.headings)) {
      assert.ok(value.trim(), `${tool.slug}: empty ${locale} ${field}`);
      assert.ok(!/^[a-z]+(?:\.[a-z]+)+$/.test(value), `${tool.slug}: raw ${locale} key ${field}`);
    }
    assert.ok(copy.overview.length >= 12, `${tool.slug}: thin ${locale} overview`);
    assert.equal(copy.steps.length, 3, `${tool.slug}: incomplete ${locale} usage steps`);
    assert.ok(copy.steps.every((step) => step.trim()), `${tool.slug}: empty ${locale} step`);
    assert.ok(faq.example.trim() && faq.caution.trim() && faq.example !== faq.caution, `${tool.slug}: incomplete ${locale} FAQ`);
    if (tool.slug === "jwt-decoder") assert.equal(copy.caution, getToolRiskNote(tool.slug, locale));
    assert.ok(!overviews.has(copy.overview), `${tool.slug}: duplicate ${locale} overview`);
    assert.ok(!examples.has(copy.example), `${tool.slug}: duplicate ${locale} example`);
    overviews.add(copy.overview);
    examples.add(copy.example);

    if (tool.usesFileInput) {
      const guide = getFileGuidance(tool, locale);
      assert.ok(guide?.types && guide.limit && guide.result, `${tool.slug}: missing ${locale} file guidance`);
    }
  }
}

console.log(`Content quality: ${tools.length} public tools × ${locales.length} locales; unique overviews and examples; file and navigation guidance complete.`);
