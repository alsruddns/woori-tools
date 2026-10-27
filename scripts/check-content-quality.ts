import assert from "node:assert/strict";
import { access, readdir, readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { locales, publishedTargetLocales, type PlannedLocale, type PublishedTargetLocale } from "../src/i18n/routing";
import { getMessages } from "../src/i18n/messages";
import { getLocalizedCategories } from "../src/registry/category-translations";
import { getFileGuidance } from "../src/registry/file-guidance";
import { homeContent } from "../src/registry/home-content";
import { getToolContent, getToolStorageNote } from "../src/registry/tool-content";
import { toolExampleInputs } from "../src/registry/tool-example-inputs";
import { verifiedTextExamples } from "../src/registry/verified-text-examples";
import { getToolFaqQuestions } from "../src/registry/tool-faq";
import { getToolRiskNote } from "../src/registry/tool-risk-notes";
import { authoredEditorialSlugs, getToolDetailEditorial } from "../src/registry/tool-detail-editorials";
import { localizeTool } from "../src/registry/tool-translations";
import { getTargetToolTranslation } from "../src/registry/target-tool-translation";
import { renameCopy, selectionCopy } from "../src/registry/tool-option-copy";
import { tools } from "../src/registry/tools";
import { languageAlternates, SITE_ORIGIN } from "../src/lib/seo";
import { createSitemapEntries } from "../src/lib/sitemap-entries.mjs";
import { processText } from "../src/lib/text/process-text";
import { formatPhone, runCountryTool } from "../src/lib/country-tools";
import { convertKana, convertWidth, kanaToRomaji, numberToKanji } from "../src/lib/japanese-tools";
import { generateLottoGames, generateSpecialBalls } from "../src/lib/lotto.mjs";
import { fortuneIndices } from "../src/lib/fortune/daily-fortune.mjs";
import { tarotDeck } from "../src/lib/fortune/tarot-deck";
import { calculateFourPillars } from "manseryeok";
import { pickUniqueRange } from "../src/lib/random";
import { batch7EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-7";
import { batch8EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-8";
import { batch9EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-9";
import { batch10EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-10";
import { batch11EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-11";
import { batch12EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-12";
import { batch13EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-13";
import { batch14EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-14";
import { batch15EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-15";
import { batch16EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-16";
import { batch17EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-17";
import { batch18EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-18";
import { batch19EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-19";
import { batch20EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-20";
import { batch21EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-21";
import { batch22EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-22";
import { batch23EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-23";
import { batch24EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-24";
import { batch25EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-25";
import { batch26EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-26";
import { batch27EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-27";
import { batch28EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-28";
import { batch29EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-29";
import { batch30EditorialDrafts } from "../src/registry/tool-detail-editorials-batch-30";
import { batch10PomodoroCorrections } from "../src/registry/tool-detail-editorials-batch-10-corrections";
import { pickUnique, secureShuffle } from "../src/lib/random";
import { divideEvenly, normalizeWheelItems, rollDice } from "../src/lib/random-tools.mjs";

const slugs = new Set(tools.map((tool) => tool.slug));
assert.equal(slugs.size, tools.length, "duplicate public slug");
const authorshipStatus = JSON.parse(readFileSync("docs/tool-content-authorship-status.json", "utf8")) as { publicToolCount: number; completeCount: number; nextBatch: string[]; tools: Array<{ slug: string; status: string }> };
assert.equal(authorshipStatus.publicToolCount, tools.length, "authorship status must cover every public tool");
assert.deepEqual(new Set(authorshipStatus.tools.map((tool) => tool.slug)), slugs, "authorship status slugs must match the public registry");
assert.equal(authorshipStatus.tools.length, tools.length, "authorship status must not contain duplicate tools");
assert.equal(authorshipStatus.completeCount, authorshipStatus.tools.filter((tool) => tool.status === "COMPLETE").length, "authorship status complete count must match its entries");
for (const slug of authoredEditorialSlugs) assert.ok(["VALIDATING", "COMPLETE"].includes(authorshipStatus.tools.find((tool) => tool.slug === slug)?.status ?? ""), `${slug}: authored editorial must be VALIDATING or COMPLETE in the status record`);
for (const { slug, status } of authorshipStatus.tools) if (status === "COMPLETE") assert.ok(authoredEditorialSlugs.includes(slug), `${slug}: status cannot be COMPLETE without authored editorial coverage`);
for (const slug of authorshipStatus.nextBatch) assert.ok(["PENDING", "KO_DRAFT", "TRANSLATING", "VALIDATING"].includes(authorshipStatus.tools.find((tool) => tool.slug === slug)?.status ?? ""), `${slug}: active or next batch must be in an editable state`);
assert.deepEqual(new Set(Object.keys(toolExampleInputs)), slugs, "sample inputs must match public tools exactly");
assert.ok(Object.keys(verifiedTextExamples).every((slug) => slugs.has(slug)), "verified runtime examples must belong to public tools");
for (const locale of publishedTargetLocales) {
  for (const slug of authoredEditorialSlugs) {
    const editorial = getToolDetailEditorial(locale, slug);
    const english = getToolDetailEditorial("en", slug);
    assert.ok(editorial && [editorial.principle, editorial.useCase, editorial.troubleshooting, editorial.faqQuestion, editorial.faqAnswer].every((value) => value.trim()), `${locale}/${slug}: editorial content is complete`);
    if (locale !== "en" && editorial && english) {
      for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) {
        assert.notEqual(editorial[field], english[field], `${locale}/${slug}: ${field} must not fall back to English`);
      }
    }
  }
}
const duplicateCounts = (values: string[]) => {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].filter(([, count]) => count > 1).sort((a, b) => b[1] - a[1]);
};
const exactDuplicateSummary: Record<string, { descriptions: number; faqSets: number; howToSets: number; repeatedStep2Phrases: number; repeatedStep2Occurrences: number; repeatedStep3Phrases: number; repeatedStep3Occurrences: number }> = {};
const nearDuplicateCandidates: Array<{ locale: string; left: string; right: string; similarity: number }> = [];
const thinPageCandidates: Array<{ locale: string; slug: string; chars: number }> = [];
const expandedLocaleQuality: Record<string, { tools: number; exactDescriptionDuplicates: number; exactExampleDuplicates: number; exactFaqContentDuplicates: number; repeatedFaqQuestionSets: number; exactHowToDuplicates: number; englishDescriptionFallbacks: number; repeatedHowToSlugs: string[][] }> = {};

for (const locale of locales) {
  assert.ok(Object.values(homeContent[locale]).every((value) => value.trim()), `missing ${locale} home editorial copy`);
  assert.ok(Object.values(renameCopy[locale]).every((value) => value.trim()), `missing ${locale} rename labels`);
  assert.ok(Object.values(selectionCopy[locale]).every((value) => value.trim()), `missing ${locale} selection labels`);
  const categories = new Set(getLocalizedCategories(locale).map((category) => category.id));
  const overviews: string[] = [];
  const examples: string[] = [];
  const descriptions: Array<{ slug: string; text: string }> = [];
  const faqSets: string[] = [];
  const howToSets: string[] = [];
  const steps2: string[] = [];
  const steps3: string[] = [];

  for (const tool of tools) {
    assert.ok(tool.isPublic, `${tool.slug}: non-public tool in public registry`);
    assert.ok(tool.supportedLocales.includes(locale), `${tool.slug}: missing ${locale} route`);
    assert.ok(categories.has(tool.category), `${tool.slug}: broken category link in ${locale}`);
    for (const related of tool.relatedTools ?? []) assert.ok(slugs.has(related), `${tool.slug}: broken related link ${related}`);

    const localized = localizeTool(tool, locale);
    const en = localizeTool(tool, "en");
    const copy = getToolContent(tool.slug, locale, localized.description, localized.title, tool.category);
    assert.ok(copy, `${tool.slug}: missing ${locale} editorial content`);
    const enCopy = locale === "en" ? copy : getToolContent(tool.slug, "en", en.description, en.title, tool.category);
    const faq = getToolFaqQuestions(locale, localized.title);
    assert.ok(localized.title.trim() && localized.description.trim(), `${tool.slug}: empty ${locale} metadata`);
    if (locale !== "en") {
      assert.notEqual(localized.description, en.description, `${tool.slug}: ${locale} description fell back to English`);
      for (const field of ["options", "caution"] as const) assert.notEqual(copy[field], enCopy?.[field], `${tool.slug}: ${locale} ${field} fell back to English`);
      assert.notEqual(copy.headings.privacyAnswer, enCopy?.headings.privacyAnswer, `${tool.slug}: ${locale} privacy copy fell back to English`);
    }
    for (const [field, value] of Object.entries({ overview: copy.overview, example: copy.example, options: copy.options, caution: copy.caution })) {
      assert.ok(typeof value === "string" && value.trim(), `${tool.slug}: empty ${locale} ${field}`);
      assert.ok(!/^[a-z]+(?:\.[a-z]+)+$/.test(value), `${tool.slug}: raw ${locale} key ${field}`);
    }
    for (const [field, value] of Object.entries(copy.headings)) {
      assert.ok(value.trim(), `${tool.slug}: empty ${locale} ${field}`);
      assert.ok(!/^[a-z]+(?:\.[a-z]+)+$/.test(value), `${tool.slug}: raw ${locale} key ${field}`);
    }
    assert.ok(copy.overview.length >= 12, `${tool.slug}: thin ${locale} overview`);
    assert.equal(copy.steps.length, 3, `${tool.slug}: incomplete ${locale} usage steps`);
    assert.ok(copy.steps.every((step) => step.trim() && !/^[a-z]+(?:\.[a-z]+)+$/.test(step)), `${tool.slug}: empty/raw ${locale} step`);
    assert.ok(faq.example.trim() && faq.caution.trim() && faq.example !== faq.caution, `${tool.slug}: incomplete ${locale} FAQ`);
    assert.ok(copy.headings.privacyAnswer.trim(), `${tool.slug}: missing ${locale} privacy answer`);
    assert.ok(!/^[a-z]+(?:\.[a-z]+)+$/.test(copy.headings.privacyAnswer), `${tool.slug}: raw ${locale} privacy key`);
    if (tool.slug === "jwt-decoder") assert.equal(copy.caution, getToolRiskNote(tool.slug, locale));
    const editorialChars = [localized.description, copy.overview, ...copy.steps, copy.example, copy.options, copy.caution, faq.example, faq.caution, copy.headings.privacyAnswer].join(" ").trim().length;
    if (editorialChars < 450) thinPageCandidates.push({ locale, slug: tool.slug, chars: editorialChars });

    overviews.push(copy.overview);
    examples.push(copy.example);
    descriptions.push({ slug: tool.slug, text: localized.description });
    faqSets.push([faq.example, copy.example, faq.caution, copy.caution].join("\n"));
    howToSets.push(copy.steps.join("\n"));
    steps2.push(copy.steps[1]);
    steps3.push(copy.steps[2]);

    if (tool.usesFileInput) {
      const guide = getFileGuidance(tool, locale);
      assert.ok(guide?.types && guide.limit && guide.result, `${tool.slug}: missing ${locale} file guidance`);
      if (/\.pdf/.test(tool.slug) || tool.category === "pdf") assert.match(guide.types, /PDF/i, `${tool.slug}: PDF guidance mismatch`);
      if (tool.category === "image") assert.match(guide.types, /image/i, `${tool.slug}: image guidance mismatch`);
    }
    if (getToolStorageNote(tool.slug, locale)) assert.ok(getToolStorageNote(tool.slug, locale)!.trim(), `${tool.slug}: empty storage notice`);
  }

  assert.equal(new Set(overviews).size, tools.length, `${locale}: duplicate overview`);
  assert.equal(new Set(examples).size, tools.length, `${locale}: duplicate example`);
  const duplicateDescriptions = duplicateCounts(descriptions.map((item) => item.text));
  const duplicateFaqSets = duplicateCounts(faqSets);
  const duplicateHowToSets = duplicateCounts(howToSets);
  const repeatedStep2 = duplicateCounts(steps2);
  const repeatedStep3 = duplicateCounts(steps3);
  exactDuplicateSummary[locale] = {
    descriptions: duplicateDescriptions.length,
    faqSets: duplicateFaqSets.length,
    howToSets: duplicateHowToSets.length,
    repeatedStep2Phrases: repeatedStep2.length,
    repeatedStep2Occurrences: repeatedStep2.reduce((sum, [, count]) => sum + count - 1, 0),
    repeatedStep3Phrases: repeatedStep3.length,
    repeatedStep3Occurrences: repeatedStep3.reduce((sum, [, count]) => sum + count - 1, 0),
  };
  if (duplicateHowToSets.length) console.error(`${locale} duplicate how-to sets:`, duplicateHowToSets.map(([value, count]) => ({ count, value })));
  if (repeatedStep3.length) console.error(`${locale} repeated step 3:`, repeatedStep3.map(([value, count]) => ({ count, value })));
  assert.equal(duplicateDescriptions.length, 0, `${locale}: duplicate tool descriptions: ${duplicateDescriptions.slice(0, 3).map(([text]) => text).join(" | ")}`);
  assert.equal(duplicateFaqSets.length, 0, `${locale}: duplicate FAQ sets`);
  assert.equal(duplicateHowToSets.length, 0, `${locale}: duplicate how-to sets`);
  assert.equal(repeatedStep3.length, 0, `${locale}: repeated generic third usage step`);
  assert.ok(repeatedStep2.length <= 8, `${locale}: too many shared action-step variants (${repeatedStep2.length})`);

  const normalized = descriptions.map(({ slug, text }) => ({ slug, value: text.toLocaleLowerCase().replace(/[\p{P}\p{S}\s]/gu, "") }));
  const grams = (value: string) => new Set(Array.from({ length: value.length - 2 }, (_, n) => value.slice(n, n + 3)));
  const gramSets = normalized.map(({ value }) => grams(value));
  for (let i = 0; i < normalized.length; i++) for (let j = i + 1; j < normalized.length; j++) {
    const a = normalized[i].value, b = normalized[j].value;
    if (Math.min(a.length, b.length) < 24) continue;
    const ga = gramSets[i], gb = gramSets[j];
    let intersection = 0;
    for (const gram of ga) if (gb.has(gram)) intersection++;
    const score = (2 * intersection) / (ga.size + gb.size);
    if (score >= 0.9) nearDuplicateCandidates.push({ locale, left: normalized[i].slug, right: normalized[j].slug, similarity: Number(score.toFixed(2)) });
  }
}

// The original editorial loop covered the first 15 locales only. Target locales
// use a separate registry, so audit their rendered tool copy through that source
// of truth as well instead of counting their routes without inspecting content.
for (const locale of publishedTargetLocales.filter((item) => !locales.includes(item as (typeof locales)[number]))) {
  assert.equal(tools.filter((tool) => tool.supportedLocales.includes(locale)).length, 176, `${locale}: expected 176 localized tool routes`);
  const translations = tools.map((tool) => {
    const translation = getTargetToolTranslation(locale as PlannedLocale, tool.slug);
    assert.ok(translation, `${tool.slug}: missing published ${locale} translation`);
    for (const [field, value] of Object.entries({
      title: translation.title,
      description: translation.description,
      seoTitle: translation.seoTitle,
      seoDescription: translation.seoDescription,
      example: translation.example,
      options: translation.options,
      caution: translation.caution,
      faqExample: translation.faq.example,
      faqCaution: translation.faq.caution,
      ...Object.fromEntries(translation.steps.map((step, index) => [`step${index + 1}`, step])),
    })) {
      assert.ok(value.trim(), `${tool.slug}: empty ${locale} ${field}`);
      assert.ok(!/^[a-z]+(?:\.[a-z]+)+$/.test(value), `${tool.slug}: raw ${locale} key ${field}`);
    }
    return translation;
  });
  const duplicateCount = (values: string[]) => duplicateCounts(values).length;
  const repeatedSlugs = (values: string[]) => {
    const byCopy = new Map<string, string[]>();
    values.forEach((value, index) => byCopy.set(value, [...(byCopy.get(value) ?? []), tools[index].slug]));
    return [...byCopy.values()].filter((slugs) => slugs.length > 1).slice(0, 5);
  };
  const english = tools.map((tool) => localizeTool(tool, "en").description);
  const englishDescriptionFallbacks = translations.filter((translation, index) => translation.description === english[index]).length;
  const lotterySlugs = ["lotto-number-generator", "powerball-number-generator", "mega-millions-number-generator", "japan-loto6-number-generator", "japan-loto7-number-generator", "japan-mini-loto-number-generator"];
  const lotterySteps = lotterySlugs.map((slug) => translations[tools.findIndex((tool) => tool.slug === slug)].steps.join("\n"));
  assert.equal(new Set(lotterySteps).size, lotterySlugs.length, `${locale}: lottery how-to must reflect each game's number rules`);
  const powerballSteps = translations[tools.findIndex((tool) => tool.slug === "powerball-number-generator")].steps.join(" ");
  const megaSteps = translations[tools.findIndex((tool) => tool.slug === "mega-millions-number-generator")].steps.join(" ");
  assert.ok(powerballSteps.includes("Powerball") && powerballSteps.includes("69") && /(?:26|২৬)/u.test(powerballSteps), `${locale}: Powerball how-to must state the white-ball and Powerball ranges`);
  assert.ok(megaSteps.includes("Mega Ball") && megaSteps.includes("70") && /(?:24|২৪)/u.test(megaSteps), `${locale}: Mega Millions how-to must state the main-ball and Mega Ball ranges`);
  expandedLocaleQuality[locale] = {
    tools: translations.length,
    exactDescriptionDuplicates: duplicateCount(translations.map(({ description }) => description)),
    exactExampleDuplicates: duplicateCount(translations.map(({ example }) => example)),
    exactFaqContentDuplicates: duplicateCount(translations.map(({ faq, example, caution }) => `${faq.example}\n${example}\n${faq.caution}\n${caution}`)),
    repeatedFaqQuestionSets: duplicateCount(translations.map(({ faq }) => `${faq.example}\n${faq.caution}`)),
    exactHowToDuplicates: duplicateCount(translations.map(({ steps }) => steps.join("\n"))),
    englishDescriptionFallbacks,
    repeatedHowToSlugs: repeatedSlugs(translations.map(({ steps }) => steps.join("\n"))),
  };
  if (locale === "pl") assert.equal(expandedLocaleQuality.pl.exactHowToDuplicates, 0, "Polish phone-format guides must explain the distinct France and US input rules");
  assert.equal(englishDescriptionFallbacks, 0, `${locale}: published descriptions fell back to English`);
  const normalized = translations.map(({ description }, index) => ({ slug: tools[index].slug, value: description.toLocaleLowerCase().replace(/[\p{P}\p{S}\s]/gu, "") }));
  const grams = (value: string) => new Set(Array.from({ length: value.length - 2 }, (_, n) => value.slice(n, n + 3)));
  const gramSets = normalized.map(({ value }) => grams(value));
  for (let i = 0; i < normalized.length; i++) for (let j = i + 1; j < normalized.length; j++) {
    const a = normalized[i].value, b = normalized[j].value;
    if (Math.min(a.length, b.length) < 24) continue;
    const ga = gramSets[i], gb = gramSets[j];
    let intersection = 0;
    for (const gram of ga) if (gb.has(gram)) intersection++;
    const score = (2 * intersection) / (ga.size + gb.size);
    if (score >= 0.9) nearDuplicateCandidates.push({ locale, left: normalized[i].slug, right: normalized[j].slug, similarity: Number(score.toFixed(2)) });
  }
}

const sitemapEntries = createSitemapEntries({ tools, locales: publishedTargetLocales, siteOrigin: SITE_ORIGIN, languageAlternates: (path: string, supported?: readonly string[]) => languageAlternates(path, supported as PublishedTargetLocale[] | undefined) });
const expectedToolUrls = tools.reduce((sum, tool) => sum + tool.supportedLocales.length, 0);
const toolSitemapEntries = sitemapEntries.filter((entry) => /\/tools\/[^/]+$/.test(entry.url));
assert.equal(toolSitemapEntries.length, expectedToolUrls, "sitemap must contain every public tool and supported locale exactly once");
assert.equal(new Set(toolSitemapEntries.map((entry) => entry.url)).size, expectedToolUrls, "duplicate tool sitemap URL");
assert.ok(toolSitemapEntries.every((entry) => entry.url.startsWith(`${SITE_ORIGIN}/`)), "sitemap URL has wrong origin");
assert.ok(toolSitemapEntries.every((entry) => entry.alternates.languages["x-default"]), "tool sitemap URL missing x-default alternate");
assert.ok(toolSitemapEntries.every((entry) => Object.keys(entry.alternates.languages).length === tools.find((tool) => entry.url.endsWith(`/tools/${tool.slug}`))!.supportedLocales.length + 1), "tool sitemap alternates must match the registry locales and x-default");

async function sourceFiles(directory: string): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await sourceFiles(full));
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) result.push(full);
  }
  return result;
}
async function runExtendedChecks() {
const exampleInput = (slug: string) => {
  const sample = toolExampleInputs[slug];
  const separator = sample.indexOf(" → ");
  assert.ok(separator > 0 && separator + 3 < sample.length, `${slug}: example must contain a concrete input and expected result`);
  return sample.slice(0, separator);
};
const jsonSample = exampleInput("json-formatter");
assert.equal((await processText("json-formatter", jsonSample, "", "format", 1, "en")).result, JSON.stringify(JSON.parse(jsonSample), null, 2), "JSON formatter example must match the real processor");
await assert.rejects(() => processText("json-validator", exampleInput("json-validator"), "", "", 1, "en"), "invalid JSON example must be rejected by the real processor");
assert.equal((await processText("base64", exampleInput("base64"), "", "encode", 1, "en")).result, "SGVsbG8=", "Base64 example must match the real processor");
assert.equal((await processText("url-encode-decode", exampleInput("url-encode-decode"), "", "encode", 1, "en")).result, "hello%20world", "URL encoding example must match the real processor");
assert.match((await processText("character-count", exampleInput("character-count"), "", "", 1, "en")).result, /11/);
assert.deepEqual(JSON.parse((await processText("csv-to-json", exampleInput("csv-to-json"), "", "", 1, "en")).result), [{ name: "A", city: "Seoul" }], "CSV example must parse as two records with the real processor");
assert.match((await processText("json-to-yaml", exampleInput("json-to-yaml"), "", "", 1, "en")).result, /name: A/);
assert.deepEqual(JSON.parse((await processText("yaml-to-json", exampleInput("yaml-to-json"), "", "", 1, "en")).result), { name: "A" });
assert.equal((await processText("remove-duplicate-lines", exampleInput("remove-duplicate-lines"), "", "", 1, "en")).result, "A\nB");
assert.equal((await processText("reverse-text", exampleInput("reverse-text"), "", "", 1, "en")).result, "cba");
assert.equal((await processText("text-case-converter", "istanbul", "", "upper", 1, "tr")).result, "İSTANBUL", "case conversion must follow the selected locale");
assert.equal((await processText("remove-duplicate-words", "I ı İ i", "", "", 1, "tr")).result, "I İ", "duplicate-word matching must follow locale-specific casing");
assert.equal(formatPhone("france-phone-number-formatter", "0612345678"), "+33 6 12 34 56 78");
assert.equal(formatPhone("us-phone-number-formatter", "2025550123"), "+1 (202) 555-0123");
assert.equal(convertKana("ひらがな", "to-katakana"), "ヒラガナ", "kana example must match the real converter");
assert.equal(convertWidth("ＡＢＣ１２３", "to-half"), "ABC123", "width example must match the real converter");
assert.equal(kanaToRomaji("こんにちは"), "konnichiha", "romaji example must match the real converter");
assert.equal(numberToKanji("123"), "百二十三", "Japanese number example must match the real converter");
assert.equal(runCountryTool("simplified-traditional-chinese-converter", "简体中文"), "簡體中文", "Chinese conversion example must match OpenCC");
const lotteryEditorialSamples = [
  { slug: "lotto-number-generator", min: 1, max: 45, count: 6, sample: [4, 12, 19, 27, 33, 41] },
  { slug: "powerball-number-generator", min: 1, max: 69, count: 5, sample: [7, 18, 29, 44, 63], special: { max: 26, sample: 12 } },
  { slug: "mega-millions-number-generator", min: 1, max: 70, count: 5, sample: [5, 16, 28, 47, 69], special: { max: 24, sample: 8 } },
  { slug: "japan-loto6-number-generator", min: 1, max: 43, count: 6, sample: [3, 11, 20, 26, 34, 42] },
  { slug: "japan-loto7-number-generator", min: 1, max: 37, count: 7, sample: [2, 8, 14, 21, 27, 33, 37] },
  { slug: "japan-mini-loto-number-generator", min: 1, max: 31, count: 5, sample: [2, 7, 14, 23, 31] },
];
for (const example of lotteryEditorialSamples) {
  assert.equal(example.sample.length, example.count, `${example.slug}: sample must have the documented count`);
  assert.equal(new Set(example.sample).size, example.count, `${example.slug}: sample values must be distinct`);
  assert.ok(example.sample.every((number) => number >= example.min && number <= example.max), `${example.slug}: sample must fit its number range`);
  const actual = generateLottoGames({ min: example.min, max: example.max, numberCount: example.count, included: [example.min], excluded: [example.max] });
  assert.equal(actual.length, 1, `${example.slug}: processor must generate one game`);
  assert.equal(actual[0].length, example.count, `${example.slug}: processor output count must match`);
  assert.ok(actual[0].includes(example.min) && !actual[0].includes(example.max), `${example.slug}: processor must honor included and excluded values`);
  assert.equal(new Set(actual[0]).size, example.count, `${example.slug}: processor output must be unique`);
  assert.ok(actual[0].every((number) => number >= example.min && number <= example.max), `${example.slug}: processor output must fit its range`);
  if (example.special) {
    assert.deepEqual(generateSpecialBalls({ count: 1, min: 1, max: example.special.max, mode: "include", number: example.special.sample }), [example.special.sample], `${example.slug}: special-ball example must match the processor`);
    assert.ok(generateSpecialBalls({ count: 1, min: 1, max: example.special.max, mode: "exclude", number: example.special.sample })[0] !== example.special.sample, `${example.slug}: excluded special ball must not appear`);
  }
}
assert.deepEqual(new Set(Object.keys(batch7EditorialDrafts)), new Set(publishedTargetLocales), "batch 7 editorial drafts must cover every published locale before integration");
for (const [locale, drafts] of Object.entries(batch7EditorialDrafts)) {
  assert.equal(Object.keys(drafts).length, 5, `${locale}: batch 7 draft must cover all five selected tools`);
  for (const [slug, editorial] of Object.entries(drafts)) {
    assert.ok(["japan-mini-loto-number-generator", "tarot-card", "daily-fortune", "saju", "random-number"].includes(slug), `${locale}/${slug}: unexpected batch 7 draft`);
    assert.ok([editorial.principle, editorial.useCase, editorial.troubleshooting, editorial.faqQuestion, editorial.faqAnswer].every((value) => value.trim()), `${locale}/${slug}: draft fields must be populated`);
  }
}
assert.deepEqual(fortuneIndices("1990-05-17", "2026-10-27", [6, 6, 6, 6, 6, 6, 6, 6]), [1, 5, 5, 0, 2, 1, 5, 4], "daily-fortune example must match the deterministic engine");
assert.equal(tarotDeck.length, 22, "tarot example must use the 22-card Major Arcana deck");
assert.equal(new Set(tarotDeck.map(({ id }) => id)).size, 22, "tarot deck IDs must be unique");
assert.ok(tarotDeck.some(({ id }) => id === "magician"), "tarot example card must exist in the real deck");
const sajuExample = calculateFourPillars({ year: 1990, month: 5, day: 17, hour: 12, minute: 0, isLunar: false, isLeapMonth: false, dayBoundary: "midnight" });
assert.deepEqual([sajuExample.yearHanja, sajuExample.monthHanja, sajuExample.dayHanja, sajuExample.hourHanja], ["庚午", "辛巳", "壬午", "丙午"], "saju sample pillars must match the calculation library");
assert.deepEqual([sajuExample.yearElement.stem, sajuExample.yearElement.branch, sajuExample.monthElement.stem, sajuExample.monthElement.branch, sajuExample.dayElement.stem, sajuExample.dayElement.branch, sajuExample.hourElement.stem, sajuExample.hourElement.branch].reduce((counts, element) => { counts[element] += 1; return counts; }, { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 }), { 목: 0, 화: 5, 토: 0, 금: 2, 수: 1 }, "saju element example must match visible-character counting");
const randomNumberOutput = pickUniqueRange(10, 20, 3).sort((left, right) => left - right);
assert.equal(randomNumberOutput.length, 3, "random-number example must return the requested count");
assert.equal(new Set(randomNumberOutput).size, 3, "random-number unique example must not repeat");
assert.ok(randomNumberOutput.every((number) => number >= 10 && number <= 20), "random-number example must stay within the inclusive range");
assert.deepEqual(randomNumberOutput, [...randomNumberOutput].sort((left, right) => left - right), "random-number sorted example must be ascending");
assert.deepEqual(new Set(Object.keys(batch8EditorialDrafts)), new Set(publishedTargetLocales), "batch 8 drafts must cover all published locales before integration");
const batch8Slugs = ["random-name-picker", "random-wheel", "draw-lots", "random-team-maker", "random-order"];
for (const [locale, drafts] of Object.entries(batch8EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts)), new Set(batch8Slugs), `${locale}: batch 8 drafts must cover all five selected tools`);
  for (const [slug, editorial] of Object.entries(drafts)) {
    assert.ok([editorial.principle, editorial.useCase, editorial.troubleshooting, editorial.faqQuestion, editorial.faqAnswer].every((value) => value.trim()), `${locale}/${slug}: draft fields must be populated`);
    if (locale !== "en") for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch8EditorialDrafts.en?.[slug][field], `${locale}/${slug}: ${field} must not fall back to English`);
  }
}
assert.deepEqual(new Set(Object.keys(batch9EditorialDrafts)), new Set(publishedTargetLocales), "batch 9 editorial drafts must cover every published locale before integration");
const batch9Slugs = ["random-seat", "duty-picker", "dice-roller", "coin-flip", "stopwatch"];
for (const [locale, drafts] of Object.entries(batch9EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts ?? {})), new Set(batch9Slugs), `${locale}: batch 9 drafts must cover all five selected tools`);
  for (const [slug, editorial] of Object.entries(drafts ?? {})) {
    assert.ok([editorial.principle, editorial.useCase, editorial.troubleshooting, editorial.faqQuestion, editorial.faqAnswer].every((value) => value.trim()), `${locale}/${slug}: draft fields must be populated`);
    if (locale !== "en") for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch9EditorialDrafts.en?.[slug][field], `${locale}/${slug}: ${field} must not fall back to English`);
  }
}
assert.deepEqual(new Set(Object.keys(batch10EditorialDrafts)), new Set(publishedTargetLocales), "batch 10 editorial drafts must cover every published locale before integration");
const batch10Slugs = ["timer", "pomodoro-timer", "world-clock", "password-generator", "random-string-generator"];
for (const [locale, drafts] of Object.entries(batch10EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts ?? {})), new Set(batch10Slugs), `${locale}: batch 10 drafts must cover all five selected tools`);
  for (const [slug, editorial] of Object.entries(drafts ?? {})) {
    assert.ok([editorial.principle, editorial.useCase, editorial.troubleshooting, editorial.faqQuestion, editorial.faqAnswer].every((value) => value.trim()), `${locale}/${slug}: draft fields must be populated`);
    if (locale !== "en") for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch10EditorialDrafts.en?.[slug][field], `${locale}/${slug}: ${field} must not fall back to English`);
  }
}
assert.deepEqual(new Set(Object.keys(batch10PomodoroCorrections)), new Set(publishedTargetLocales), "Pomodoro behavior corrections must cover every published locale");
for (const [locale, editorial] of Object.entries(batch10PomodoroCorrections)) {
  assert.ok([editorial.principle, editorial.useCase, editorial.troubleshooting, editorial.faqQuestion, editorial.faqAnswer].every((value) => value.trim()), `${locale}/pomodoro-timer: corrected fields must be populated`);
  if (locale !== "en") for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch10PomodoroCorrections.en?.[field], `${locale}/pomodoro-timer: ${field} must be authored in locale`);
}
const batch11Slugs = ["wifi-qr", "contact-qr", "phone-qr", "email-qr", "barcode-checker"];
assert.deepEqual(new Set(Object.keys(batch11EditorialDrafts)), new Set(publishedTargetLocales), "batch 11 editorial drafts must cover every published locale");
for (const [locale, drafts] of Object.entries(batch11EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts ?? {})), new Set(batch11Slugs), `${locale}: batch 11 drafts must cover all five selected tools`);
  for (const [slug, editorial] of Object.entries(drafts ?? {})) {
    assert.ok([editorial.principle, editorial.useCase, editorial.troubleshooting, editorial.faqQuestion, editorial.faqAnswer].every((value) => value.trim()), `${locale}/${slug}: draft fields must be populated`);
    if (locale !== "en") for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch11EditorialDrafts.en?.[slug][field], `${locale}/${slug}: ${field} must not fall back to English`);
  }
}
const batch12Slugs = ["barcode-generator", "social-image-resize", "add-text-to-image", "instagram-grid-split", "image-collage"];
assert.deepEqual(new Set(Object.keys(batch12EditorialDrafts)), new Set(publishedTargetLocales), "batch 12 editorial drafts must cover every published locale");
for (const [locale, drafts] of Object.entries(batch12EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts ?? {})), new Set(batch12Slugs), `${locale}: batch 12 drafts must cover all five selected tools`);
  assert.equal(new Set(batch12Slugs.map((slug) => drafts?.[slug]?.faqQuestion)).size, batch12Slugs.length, `${locale}: batch 12 FAQ questions must be distinct by tool`);
  assert.equal(new Set(batch12Slugs.map((slug) => drafts?.[slug]?.useCase)).size, batch12Slugs.length, `${locale}: batch 12 use cases must be distinct by tool`);
  for (const [slug, editorial] of Object.entries(drafts ?? {})) {
    assert.ok([editorial.principle, editorial.useCase, editorial.troubleshooting, editorial.faqQuestion, editorial.faqAnswer].every((value) => value.trim()), `${locale}/${slug}: draft fields must be populated`);
    if (locale !== "en") for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch12EditorialDrafts.en?.[slug][field], `${locale}/${slug}: ${field} must not fall back to English`);
  }
}
const batch13Slugs = ["file-hash", "mime-type-checker", "file-extension-checker", "file-size-checker", "duplicate-file-checker"];
assert.deepEqual(new Set(Object.keys(batch13EditorialDrafts)), new Set(publishedTargetLocales), "batch 13 editorial drafts must cover every published locale");
for (const [locale, drafts] of Object.entries(batch13EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts ?? {})), new Set(batch13Slugs), `${locale}: batch 13 drafts must cover all five selected tools`);
  assert.equal(new Set(batch13Slugs.map((slug) => drafts?.[slug]?.faqQuestion)).size, batch13Slugs.length, `${locale}: batch 13 FAQ questions must be distinct by tool`);
  assert.equal(new Set(batch13Slugs.map((slug) => drafts?.[slug]?.useCase)).size, batch13Slugs.length, `${locale}: batch 13 use cases must be distinct by tool`);
  for (const [slug, editorial] of Object.entries(drafts ?? {})) {
    assert.ok([editorial.principle, editorial.useCase, editorial.troubleshooting, editorial.faqQuestion, editorial.faqAnswer].every((value) => value.trim()), `${locale}/${slug}: draft fields must be populated`);
    if (locale !== "en") for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch13EditorialDrafts.en?.[slug][field], `${locale}/${slug}: ${field} must not fall back to English`);
  }
}
const batch14Slugs = ["zip-files", "bulk-file-renamer", "filename-cleaner", "lorem-ipsum", "regex-tester"];
assert.deepEqual(new Set(Object.keys(batch14EditorialDrafts)), new Set(publishedTargetLocales), "batch 14 editorial drafts must cover every published locale");
for (const [locale, drafts] of Object.entries(batch14EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts ?? {})), new Set(batch14Slugs), `${locale}: batch 14 drafts must cover all five selected tools`);
  assert.equal(new Set(batch14Slugs.map((slug) => drafts?.[slug]?.faqQuestion)).size, batch14Slugs.length, `${locale}: batch 14 FAQ questions must be distinct by tool`);
  assert.equal(new Set(batch14Slugs.map((slug) => drafts?.[slug]?.useCase)).size, batch14Slugs.length, `${locale}: batch 14 use cases must be distinct by tool`);
  for (const slug of batch14Slugs) {
    const editorial = drafts?.[slug];
    assert.ok(editorial && Object.values(editorial).every((field) => field.trim().length > 0), `${locale}/${slug}: editorial fields must be populated`);
    if (locale !== "en") for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch14EditorialDrafts.en?.[slug]?.[field], `${locale}/${slug}: ${field} must not fall back to English`);
  }
}
const batch15Slugs = ["color-converter", "cron-parser", "sql-formatter", "html-formatter", "css-formatter"];
assert.deepEqual(new Set(Object.keys(batch15EditorialDrafts)), new Set(publishedTargetLocales), "batch 15 editorial drafts must cover every published locale");
for (const [locale, drafts] of Object.entries(batch15EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts ?? {})), new Set(batch15Slugs), `${locale}: batch 15 drafts must cover all five selected tools`);
  assert.equal(new Set(batch15Slugs.map((slug) => drafts?.[slug]?.faqQuestion)).size, batch15Slugs.length, `${locale}: batch 15 FAQ questions must be distinct by tool`);
  assert.equal(new Set(batch15Slugs.map((slug) => drafts?.[slug]?.useCase)).size, batch15Slugs.length, `${locale}: batch 15 use cases must be distinct by tool`);
  for (const slug of batch15Slugs) {
    const editorial = drafts?.[slug];
    assert.ok(editorial && Object.values(editorial).every((field) => field.trim().length > 0), `${locale}/${slug}: editorial fields must be populated`);
    if (locale !== "en") for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch15EditorialDrafts.en?.[slug]?.[field], `${locale}/${slug}: ${field} must not fall back to English`);
  }
}
const batch16Slugs = ["javascript-formatter", "markdown-preview", "jpg-to-png", "png-to-jpg", "webp-to-jpg"];
assert.deepEqual(new Set(Object.keys(batch16EditorialDrafts)), new Set(publishedTargetLocales), "batch 16 editorial drafts must cover every published locale");
for (const [locale, drafts] of Object.entries(batch16EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts ?? {})), new Set(batch16Slugs), `${locale}: batch 16 drafts must cover all five selected tools`);
  assert.equal(new Set(batch16Slugs.map((slug) => drafts?.[slug]?.faqQuestion)).size, batch16Slugs.length, `${locale}: batch 16 FAQ questions must be distinct by tool`);
  assert.equal(new Set(batch16Slugs.map((slug) => drafts?.[slug]?.useCase)).size, batch16Slugs.length, `${locale}: batch 16 use cases must be distinct by tool`);
  for (const slug of batch16Slugs) {
    const editorial = drafts?.[slug];
    assert.ok(editorial && Object.values(editorial).every((field) => field.trim().length > 0), `${locale}/${slug}: editorial fields must be populated`);
    if (locale !== "en") for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch16EditorialDrafts.en?.[slug]?.[field], `${locale}/${slug}: ${field} must not fall back to English`);
  }
}
const batch17Slugs = ["webp-to-png", "jpg-to-webp", "png-to-webp", "heic-to-jpg", "image-compress"];
assert.deepEqual(new Set(Object.keys(batch17EditorialDrafts)), new Set(publishedTargetLocales), "batch 17 editorial drafts must cover every published locale");
for (const [locale, drafts] of Object.entries(batch17EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts ?? {})), new Set(batch17Slugs), `${locale}: batch 17 drafts must cover all five selected tools`);
  assert.equal(new Set(batch17Slugs.map((slug) => drafts?.[slug]?.faqQuestion)).size, batch17Slugs.length, `${locale}: batch 17 FAQ questions must be distinct by tool`);
  assert.equal(new Set(batch17Slugs.map((slug) => drafts?.[slug]?.useCase)).size, batch17Slugs.length, `${locale}: batch 17 use cases must be distinct by tool`);
  for (const slug of batch17Slugs) {
    const editorial = drafts?.[slug];
    assert.ok(editorial && Object.values(editorial).every((field) => field.trim().length > 0), `${locale}/${slug}: editorial fields must be populated`);
    if (locale !== "en") for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch17EditorialDrafts.en?.[slug]?.[field], `${locale}/${slug}: ${field} must not fall back to English`);
  }
}
const batch18Slugs = ["image-resize", "image-crop", "image-rotate", "image-flip", "image-grayscale"];
assert.deepEqual(new Set(Object.keys(batch18EditorialDrafts)), new Set(publishedTargetLocales), "batch 18 editorial drafts must cover every published locale");
for (const [locale, drafts] of Object.entries(batch18EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts ?? {})), new Set(batch18Slugs), `${locale}: batch 18 drafts must cover all five selected tools`);
  assert.equal(new Set(batch18Slugs.map((slug) => drafts?.[slug]?.faqQuestion)).size, batch18Slugs.length, `${locale}: batch 18 FAQ questions must be distinct by tool`);
  assert.equal(new Set(batch18Slugs.map((slug) => drafts?.[slug]?.useCase)).size, batch18Slugs.length, `${locale}: batch 18 use cases must be distinct by tool`);
  for (const slug of batch18Slugs) {
    const editorial = drafts?.[slug];
    assert.ok(editorial && Object.values(editorial).every((field) => field.trim().length > 0), `${locale}/${slug}: editorial fields must be populated`);
    if (locale !== "en") for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch18EditorialDrafts.en?.[slug]?.[field], `${locale}/${slug}: ${field} must not fall back to English`);
  }
}
const batch19Slugs = ["image-brightness", "image-contrast", "image-blur", "image-pixelate", "remove-image-metadata"];
assert.deepEqual(new Set(Object.keys(batch19EditorialDrafts)), new Set(publishedTargetLocales), "batch 19 editorial drafts must cover every published locale");
for (const [locale, drafts] of Object.entries(batch19EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts ?? {})), new Set(batch19Slugs), `${locale}: batch 19 drafts must cover all five selected tools`);
  assert.equal(new Set(batch19Slugs.map((slug) => drafts?.[slug]?.faqQuestion)).size, batch19Slugs.length, `${locale}: batch 19 FAQ questions must be distinct by tool`);
  assert.equal(new Set(batch19Slugs.map((slug) => drafts?.[slug]?.useCase)).size, batch19Slugs.length, `${locale}: batch 19 use cases must be distinct by tool`);
  for (const slug of batch19Slugs) {
    const editorial = drafts?.[slug];
    assert.ok(editorial && Object.values(editorial).every((field) => field.trim().length > 0), `${locale}/${slug}: editorial fields must be populated`);
    if (locale !== "en") for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch19EditorialDrafts.en?.[slug]?.[field], `${locale}/${slug}: ${field} must not fall back to English`);
  }
}
const batch20Slugs = ["image-info", "favicon-generator", "image-color-picker", "images-to-pdf", "pdf-merge"];
assert.deepEqual(new Set(Object.keys(batch20EditorialDrafts)), new Set(publishedTargetLocales), "batch 20 editorial drafts must cover every published locale");
for (const [locale, drafts] of Object.entries(batch20EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts ?? {})), new Set(batch20Slugs), `${locale}: batch 20 drafts must cover all five selected tools`);
  assert.equal(new Set(batch20Slugs.map((slug) => drafts?.[slug]?.faqQuestion)).size, batch20Slugs.length, `${locale}: batch 20 FAQ questions must be distinct by tool`);
  assert.equal(new Set(batch20Slugs.map((slug) => drafts?.[slug]?.useCase)).size, batch20Slugs.length, `${locale}: batch 20 use cases must be distinct by tool`);
  for (const slug of batch20Slugs) {
    const editorial = drafts?.[slug];
    assert.ok(editorial && Object.values(editorial).every((field) => field.trim().length > 0), `${locale}/${slug}: editorial fields must be populated`);
    if (locale !== "en") for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch20EditorialDrafts.en?.[slug]?.[field], `${locale}/${slug}: ${field} must not fall back to English`);
  }
}
const batch21Slugs = ["pdf-split", "pdf-delete-pages", "pdf-reorder-pages", "pdf-rotate-pages", "pdf-add-page-numbers"];
assert.deepEqual(new Set(Object.keys(batch21EditorialDrafts)), new Set(publishedTargetLocales), "batch 21 editorial drafts must cover every published locale");
for (const [locale, drafts] of Object.entries(batch21EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts ?? {})), new Set(batch21Slugs), `${locale}: batch 21 drafts must cover all five selected tools`);
  assert.equal(new Set(batch21Slugs.map((slug) => drafts?.[slug]?.faqQuestion)).size, batch21Slugs.length, `${locale}: batch 21 FAQ questions must be distinct by tool`);
  assert.equal(new Set(batch21Slugs.map((slug) => drafts?.[slug]?.useCase)).size, batch21Slugs.length, `${locale}: batch 21 use cases must be distinct by tool`);
  for (const slug of batch21Slugs) {
    const editorial = drafts?.[slug];
    assert.ok(editorial && Object.values(editorial).every((field) => field.trim().length > 0), `${locale}/${slug}: editorial fields must be populated`);
    if (locale !== "en") for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch21EditorialDrafts.en?.[slug]?.[field], `${locale}/${slug}: ${field} must not fall back to English`);
  }
}
const batch22Slugs = ["pdf-watermark", "pdf-metadata-viewer", "pdf-remove-metadata", "json-to-yaml", "yaml-to-json"];
assert.deepEqual(new Set(Object.keys(batch22EditorialDrafts)), new Set(publishedTargetLocales), "batch 22 editorial drafts must cover every published locale");
for (const [locale, drafts] of Object.entries(batch22EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts ?? {})), new Set(batch22Slugs), `${locale}: batch 22 drafts must cover all five selected tools`);
  assert.equal(new Set(batch22Slugs.map((slug) => drafts?.[slug]?.faqQuestion)).size, batch22Slugs.length, `${locale}: batch 22 FAQ questions must be distinct by tool`);
  assert.equal(new Set(batch22Slugs.map((slug) => drafts?.[slug]?.useCase)).size, batch22Slugs.length, `${locale}: batch 22 use cases must be distinct by tool`);
  for (const slug of batch22Slugs) {
    const editorial = drafts?.[slug];
    assert.ok(editorial && Object.values(editorial).every((field) => field.trim().length > 0), `${locale}/${slug}: editorial fields must be populated`);
    if (locale !== "en") for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch22EditorialDrafts.en?.[slug]?.[field], `${locale}/${slug}: ${field} must not fall back to English`);
  }
}
const batch23Slugs = ["csv-to-json", "json-to-csv", "base64", "url-encode-decode", "uuid-generator"];
assert.deepEqual(new Set(Object.keys(batch23EditorialDrafts)), new Set(publishedTargetLocales), "batch 23 editorial drafts must cover every published locale");
for (const [locale, drafts] of Object.entries(batch23EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts ?? {})), new Set(batch23Slugs), `${locale}: batch 23 drafts must cover all five selected tools`);
  assert.equal(new Set(batch23Slugs.map((slug) => drafts?.[slug]?.faqQuestion)).size, batch23Slugs.length, `${locale}: batch 23 FAQ questions must be distinct by tool`);
  assert.equal(new Set(batch23Slugs.map((slug) => drafts?.[slug]?.useCase)).size, batch23Slugs.length, `${locale}: batch 23 use cases must be distinct by tool`);
  for (const slug of batch23Slugs) {
    const editorial = drafts?.[slug];
    assert.ok(editorial && Object.values(editorial).every((field) => field.trim().length > 0), `${locale}/${slug}: editorial fields must be populated`);
    if (locale !== "en") for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch23EditorialDrafts.en?.[slug]?.[field], `${locale}/${slug}: ${field} must not fall back to English`);
  }
}
const batch24Slugs = ["timestamp-converter", "wareki-converter", "yakudoshi-calculator", "japanese-zodiac-calculator", "numbers3-number-generator"];
assert.deepEqual(new Set(Object.keys(batch24EditorialDrafts)), new Set(publishedTargetLocales), "batch 24 editorial drafts must cover every published locale");
for (const [locale, drafts] of Object.entries(batch24EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts ?? {})), new Set(batch24Slugs), `${locale}: batch 24 drafts must cover all five selected tools`);
  assert.equal(new Set(batch24Slugs.map((slug) => drafts?.[slug]?.faqQuestion)).size, batch24Slugs.length, `${locale}: batch 24 FAQ questions must be distinct by tool`);
  assert.equal(new Set(batch24Slugs.map((slug) => drafts?.[slug]?.useCase)).size, batch24Slugs.length, `${locale}: batch 24 use cases must be distinct by tool`);
  for (const slug of batch24Slugs) {
    const editorial = drafts?.[slug];
    assert.ok(editorial && Object.values(editorial).every((field) => field.trim().length > 0), `${locale}/${slug}: editorial fields must be populated`);
    if (locale !== "en") for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch24EditorialDrafts.en?.[slug]?.[field], `${locale}/${slug}: ${field} must not fall back to English`);
  }
}
const batch25Slugs = ["numbers4-number-generator", "bingo5-number-generator", "jwt-decoder", "url-query-parameter-parser", "user-agent-parser"];
assert.deepEqual(new Set(Object.keys(batch25EditorialDrafts)), new Set(publishedTargetLocales), "batch 25 editorial drafts must cover every published locale");
for (const [locale, drafts] of Object.entries(batch25EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts ?? {})), new Set(batch25Slugs), locale + ": batch 25 drafts must cover all five selected tools");
  assert.equal(new Set(batch25Slugs.map((slug) => drafts?.[slug]?.faqQuestion)).size, batch25Slugs.length, locale + ": batch 25 FAQ questions must be distinct by tool");
  assert.equal(new Set(batch25Slugs.map((slug) => drafts?.[slug]?.useCase)).size, batch25Slugs.length, locale + ": batch 25 use cases must be distinct by tool");
  for (const slug of batch25Slugs) {
    const editorial = drafts?.[slug];
    assert.ok(editorial && Object.values(editorial).every((field) => field.trim().length > 0), locale + "/" + slug + ": editorial fields must be populated");
    if (locale !== "en") for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch25EditorialDrafts.en?.[slug]?.[field], locale + "/" + slug + ": " + field + " must not fall back to English");
  }
}
const batch26Slugs = ["ip-cidr-calculator", "base32-encoder-decoder", "ulid-generator", "uuid-v7-generator", "hash-compare"];
assert.deepEqual(new Set(Object.keys(batch26EditorialDrafts)), new Set(publishedTargetLocales), "batch 26 editorial drafts must cover every published locale");
for (const [locale, drafts] of Object.entries(batch26EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts ?? {})), new Set(batch26Slugs), locale + ": batch 26 drafts must cover all five selected tools");
  assert.equal(new Set(batch26Slugs.map((slug) => drafts?.[slug]?.faqQuestion)).size, batch26Slugs.length, locale + ": batch 26 FAQ questions must be distinct by tool");
  assert.equal(new Set(batch26Slugs.map((slug) => drafts?.[slug]?.useCase)).size, batch26Slugs.length, locale + ": batch 26 use cases must be distinct by tool");
  for (const slug of batch26Slugs) {
    const editorial = drafts?.[slug];
    assert.ok(editorial && Object.values(editorial).every((field) => field.trim().length > 0), locale + "/" + slug + ": editorial fields must be populated");
    if (locale !== "en") for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch26EditorialDrafts.en?.[slug]?.[field], locale + "/" + slug + ": " + field + " must not fall back to English");
  }
}
const batch30Slugs = ["lakh-crore-converter", "pan-format-validator", "gstin-format-validator", "india-phone-number-formatter", "germany-iban-validator"];
assert.deepEqual(new Set(Object.keys(batch30EditorialDrafts)), new Set(publishedTargetLocales), "batch 30 editorial drafts must cover every published locale");
for (const [locale, drafts] of Object.entries(batch30EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts ?? {})), new Set(batch30Slugs), locale + ": batch 30 drafts must cover all five selected tools");
  assert.equal(new Set(batch30Slugs.map((slug) => drafts?.[slug]?.faqQuestion)).size, batch30Slugs.length, locale + ": batch 30 FAQ questions must be distinct by tool");
  assert.equal(new Set(batch30Slugs.map((slug) => drafts?.[slug]?.useCase)).size, batch30Slugs.length, locale + ": batch 30 use cases must be distinct by tool");
  for (const slug of batch30Slugs) {
    const editorial = drafts?.[slug];
    assert.ok(editorial && [editorial.principle, editorial.useCase, editorial.troubleshooting, editorial.faqQuestion, editorial.faqAnswer].every((value) => value.trim()), locale + "/" + slug + ": batch 30 fields must be populated");
    if (locale !== "en" && editorial) for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch30EditorialDrafts.en?.[slug]?.[field], locale + "/" + slug + ": " + field + " must not fall back to English");
  }
}

const batch29Slugs = ["chinese-zodiac-calculator", "chinese-sexagenary-cycle-calculator", "chinese-phone-number-formatter", "taiwan-phone-number-formatter", "indian-number-format-converter"];
assert.deepEqual(new Set(Object.keys(batch29EditorialDrafts)), new Set(publishedTargetLocales), "batch 29 editorial drafts must cover every published locale");
for (const [locale, drafts] of Object.entries(batch29EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts ?? {})), new Set(batch29Slugs), locale + ": batch 29 drafts must cover all five selected tools");
  assert.equal(new Set(batch29Slugs.map((slug) => drafts?.[slug]?.faqQuestion)).size, batch29Slugs.length, locale + ": batch 29 FAQ questions must be distinct by tool");
  assert.equal(new Set(batch29Slugs.map((slug) => drafts?.[slug]?.useCase)).size, batch29Slugs.length, locale + ": batch 29 use cases must be distinct by tool");
  for (const slug of batch29Slugs) {
    const editorial = drafts?.[slug];
    assert.ok(editorial && [editorial.principle, editorial.useCase, editorial.troubleshooting, editorial.faqQuestion, editorial.faqAnswer].every((value) => value.trim()), locale + "/" + slug + ": batch 29 fields must be populated");
    if (locale !== "en" && editorial) for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch29EditorialDrafts.en?.[slug]?.[field], locale + "/" + slug + ": " + field + " must not fall back to English");
  }
}

const batch28Slugs = ["url-slug-generator", "unicode-code-point-checker", "pdf-page-size-checker", "chinese-number-kanji-converter", "rmb-uppercase-converter"];
assert.deepEqual(new Set(Object.keys(batch28EditorialDrafts)), new Set(publishedTargetLocales), "batch 28 editorial drafts must cover every published locale");
for (const [locale, drafts] of Object.entries(batch28EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts ?? {})), new Set(batch28Slugs), locale + ": batch 28 drafts must cover all five selected tools");
  assert.equal(new Set(batch28Slugs.map((slug) => drafts?.[slug]?.faqQuestion)).size, batch28Slugs.length, locale + ": batch 28 FAQ questions must be distinct by tool");
  assert.equal(new Set(batch28Slugs.map((slug) => drafts?.[slug]?.useCase)).size, batch28Slugs.length, locale + ": batch 28 use cases must be distinct by tool");
  for (const slug of batch28Slugs) {
    const editorial = drafts?.[slug];
    assert.ok(editorial && [editorial.principle, editorial.useCase, editorial.troubleshooting, editorial.faqQuestion, editorial.faqAnswer].every((value) => value.trim()), locale + "/" + slug + ": batch 28 fields must be populated");
    if (locale !== "en" && editorial) for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch28EditorialDrafts.en?.[slug]?.[field], locale + "/" + slug + ": " + field + " must not fall back to English");
  }
}

const batch27Slugs = ["regex-replace", "html-entity-encoder-decoder", "chmod-calculator", "json-path-tester", "csv-tsv-converter"];
assert.deepEqual(new Set(Object.keys(batch27EditorialDrafts)), new Set(publishedTargetLocales), "batch 27 editorial drafts must cover every published locale");
for (const [locale, drafts] of Object.entries(batch27EditorialDrafts)) {
  assert.deepEqual(new Set(Object.keys(drafts ?? {})), new Set(batch27Slugs), locale + ": batch 27 drafts must cover all five selected tools");
  assert.equal(new Set(batch27Slugs.map((slug) => drafts?.[slug]?.faqQuestion)).size, batch27Slugs.length, locale + ": batch 27 FAQ questions must be distinct by tool");
  assert.equal(new Set(batch27Slugs.map((slug) => drafts?.[slug]?.useCase)).size, batch27Slugs.length, locale + ": batch 27 use cases must be distinct by tool");
  for (const slug of batch27Slugs) {
    const editorial = drafts?.[slug];
    assert.ok(editorial && Object.values(editorial).every((field) => field.trim().length > 0), locale + "/" + slug + ": editorial fields must be populated");
    if (locale !== "en") for (const field of ["principle", "useCase", "troubleshooting", "faqQuestion", "faqAnswer"] as const) assert.notEqual(editorial[field], batch27EditorialDrafts.en?.[slug]?.[field], locale + "/" + slug + ": " + field + " must not fall back to English");
  }
}
const exampleNames = ["Mina", "Joon", "Kai", "Lina", "Bo", "Ari"];
const pickedNames = pickUnique(exampleNames, 2);
assert.equal(pickedNames.length, 2, "random-name-picker must return the requested number of entries");
assert.equal(new Set(pickedNames).size, 2, "random-name-picker must draw distinct entries when repeats are off");
const drawnLots = pickUnique(exampleNames, 3);
assert.equal(drawnLots.length, 3, "draw-lots must select the requested number of distinct entries");
assert.equal(new Set(drawnLots).size, 3, "draw-lots must not repeat entries when repeats are off");
assert.deepEqual(normalizeWheelItems("A\nA\n\nB", { allowDuplicates: false, limit: 50 }), ["A", "B"], "random-wheel must trim blanks and deduplicate when repeat choices are disabled");
assert.deepEqual(normalizeWheelItems("A\nA\nB", { allowDuplicates: true, limit: 50 }), ["A", "A", "B"], "random-wheel must retain weighted duplicate choices when enabled");
const balancedTeams = divideEvenly(exampleNames, 2);
assert.equal(balancedTeams.flat().length, exampleNames.length, "random-team-maker must assign every participant");
assert.ok(Math.max(...balancedTeams.map((team) => team.length)) - Math.min(...balancedTeams.map((team) => team.length)) <= 1, "random-team-maker team sizes must differ by at most one");
const shuffledOrder = secureShuffle(exampleNames);
assert.deepEqual([...shuffledOrder].sort(), [...exampleNames].sort(), "random-order must preserve every participant entry");
const seatOutput = (await processText("random-seat", "Mina\n\nJoon\nMina", "", "", 1, "en")).result.split("\n").map((line) => line.replace(/^\d+\. /, ""));
assert.deepEqual([...seatOutput].sort(), ["Joon", "Mina", "Mina"], "random-seat must ignore blank lines and preserve duplicate participants");
const dutyOutput = (await processText("duty-picker", "Mina\nJoon\nKai", "Clean\nGuide", "", 1, "en")).result.split("\n");
assert.equal(dutyOutput.length, 3, "duty-picker must assign once per participant");
for (const person of ["Mina", "Joon", "Kai"]) assert.equal(dutyOutput.filter((line) => line.startsWith(person)).length, 1, `duty-picker must assign ${person} exactly once`);
assert.ok(dutyOutput.every((line) => ["Clean", "Guide"].some((duty) => line.includes(duty))), "duty-picker must use only entered duties and cycle when needed");
const standardDice = (await processText("dice-roller", "", "", "6", 100, "en")).result.split("\n");
const standardRolls = standardDice[0].split(", ").map(Number);
assert.equal(standardRolls.length, 100, "standard dice processor must accept 100 dice");
assert.ok(standardRolls.every((value) => value >= 1 && value <= 6), "standard dice results must fit D6");
assert.equal(Number(standardDice[1].replace(/^Total: /, "")), standardRolls.reduce((sum, value) => sum + value, 0), "standard dice total must match its results");
for (const sides of [4, 6, 8, 10, 12, 20]) {
  const expandedRolls = rollDice(sides, 20);
  assert.equal(expandedRolls.length, 20, `expanded D${sides} panel must return the requested dice count`);
  assert.ok(expandedRolls.every((value) => value >= 1 && value <= sides), `expanded D${sides} results must fit the selected die`);
}
const coinOutput = (await processText("coin-flip", "", "", "", 1000, "en")).result.split("\n");
const heads = Number(coinOutput[0].replace(/^Heads: /, ""));
const tails = Number(coinOutput[1].replace(/^Tails: /, ""));
assert.equal(heads + tails, 1000, "coin-flip counts must add up to the requested number of flips");
assert.equal(coinOutput[2], `Heads ratio: ${(heads / 1000 * 100).toFixed(1)}%`, "coin-flip ratio must match the observed heads count");
for (const [slug, example] of Object.entries(verifiedTextExamples)) {
  const runExample = () => processText(slug, example.input, example.secondText ?? "", example.option ?? "", example.amount ?? 1, "en");
  if (example.resultIsError) {
    let failure: unknown;
    try {
      await runExample();
    } catch (error) {
      failure = error;
    }
    assert.equal(failure instanceof Error ? failure.message : "", getMessages("en").errors.invalidJson, `${slug}: displayed error text must match the real processor`);
  } else {
    const actual = await runExample();
    if (example.outputPermutationOfInput) {
      assert.deepEqual(actual.result.split("\n").sort(), example.input.split(/\r?\n/).filter((line) => line.length > 0).sort(), `${slug}: output must contain each non-empty input line exactly once`);
    } else {
      assert.equal(actual.result, example.output, `${slug}: displayed input/output example must match the real processor`);
    }
    if (example.downloadContent !== undefined) {
      assert.equal(await actual.download?.text(), example.downloadContent, `${slug}: downloaded file contents must match the input`);
      assert.equal(actual.download?.type, "text/plain;charset=utf-8", `${slug}: downloaded text file must be UTF-8 plain text`);
    }
  }
}

const srcFiles = await sourceFiles(path.resolve("src"));
const brokenLinkFiles: string[] = [];
for (const file of srcFiles) {
  const source = await readFile(file, "utf8");
  if (/href\s*=\s*[{"']\s*(?:#|javascript:|)\s*["'}]/i.test(source)) brokenLinkFiles.push(path.relative(process.cwd(), file));
}
assert.deepEqual(brokenLinkFiles, [], `placeholder/dead href found: ${brokenLinkFiles.join(", ")}`);

const toolSourceFiles = srcFiles.filter((file) => file.includes(`${path.sep}components${path.sep}tool${path.sep}`) || file.includes(`${path.sep}features${path.sep}`) || file.includes(`${path.sep}lib${path.sep}`));
const networkInputFiles: string[] = [];
for (const file of toolSourceFiles) {
  const source = await readFile(file, "utf8");
  if (/\bfetch\s*\(|\bXMLHttpRequest\b|\bsendBeacon\s*\(/.test(source)) networkInputFiles.push(path.relative(process.cwd(), file));
}
assert.deepEqual(networkInputFiles, [], `network API found in tool processing source: ${networkInputFiles.join(", ")}`);

const navigationSource = await readFile(path.resolve("src/components/tool/tool-navigation-shell.tsx"), "utf8");
assert.match(navigationSource, /adsEnabled && <AdRail/g, "disabled ads must omit ad rails from DOM");
assert.match(navigationSource, /showPlaceholder && <div/g, "ad placeholder must be conditional");
assert.match(navigationSource, /adsEnabled && process\.env\.NEXT_PUBLIC_SHOW_AD_PLACEHOLDER/, "placeholder must require ads enabled");

const workspaceSource = await readFile(path.resolve("src/components/tool/tool-workspace.tsx"), "utf8");
assert.match(workspaceSource, /MAX_IMAGE\s*=\s*30\s*\*\s*1024\s*\*\s*1024/, "image picker size limit changed; update file guidance");
assert.match(workspaceSource, /MAX_PDF\s*=\s*50\s*\*\s*1024\s*\*\s*1024/, "PDF picker size limit changed; update file guidance");
assert.match(workspaceSource, /\.heic\$\/i\.test\(file\.name\).*\.heif\$\/i\.test\(file\.name\)/, "HEIC and HEIF guidance must match file acceptance logic");
assert.match(workspaceSource, /incoming\.length\s*>\s*100[\s\S]*?200\s*\*\s*1024\s*\*\s*1024/, "generic file count/total-size limit missing");
assert.match(workspaceSource, /incoming\.length\s*>\s*6[\s\S]*?100\s*\*\s*1024\s*\*\s*1024/, "collage count/total-size limit missing");
const imageSource = await readFile(path.resolve("src/lib/image/process-image.ts"), "utf8");
assert.match(imageSource, /MAX_PIXELS\s*=\s*40_000_000/, "image decoded-pixel limit missing");
assert.match(imageSource, /\\\.\(heic\|heif\)\$\/i\.test\(file\.name\)/, "HEIC/HEIF filename handling must match accepted extensions");
const pdfSource = await readFile(path.resolve("src/lib/pdf/process-pdf.ts"), "utf8");
assert.match(pdfSource, /MAX_PDF\s*=\s*50\s*\*\s*1024\s*\*\s*1024/, "PDF aggregate processing limit missing");

const homePageSource = await readFile(path.resolve("src/app/[locale]/tools/page.tsx"), "utf8");
for (const signal of ["ToolDirectory", "recent-tools", "recommended-tools", "category.description", "browserDescription", "allTools"]) assert.ok(homePageSource.includes(signal), `tools home missing ${signal}`);
for (const route of ["src/app/[locale]/privacy/page.tsx", "src/app/[locale]/terms/page.tsx", "src/app/[locale]/tools/category/[category]/page.tsx"]) await access(path.resolve(route));
assert.equal(tools.filter((tool) => Boolean(getToolStorageNote(tool.slug, "en"))).length, 18, "localStorage usage and localized disclosure list differ");

const repeatedUsagePatterns = [...new Set(Object.values(exactDuplicateSummary).map((counts) => `${counts.repeatedStep2Phrases} repeated step-2 variants; ${counts.repeatedStep3Phrases} repeated step-3 variants`))];
const nearPairs = [...new Map(nearDuplicateCandidates.map((item) => [[item.left, item.right].sort().join("::"), item])).values()].sort((a, b) => b.similarity - a.similarity);
const duplicateTotals = {
  exactDescriptionSets: Object.values(exactDuplicateSummary).reduce((sum, item) => sum + item.descriptions, 0) + Object.values(expandedLocaleQuality).reduce((sum, item) => sum + item.exactDescriptionDuplicates, 0),
  exactExampleSets: Object.values(expandedLocaleQuality).reduce((sum, item) => sum + item.exactExampleDuplicates, 0),
  exactFaqContentSets: Object.values(exactDuplicateSummary).reduce((sum, item) => sum + item.faqSets, 0) + Object.values(expandedLocaleQuality).reduce((sum, item) => sum + item.exactFaqContentDuplicates, 0),
  repeatedFaqQuestionSets: Object.values(expandedLocaleQuality).reduce((sum, item) => sum + item.repeatedFaqQuestionSets, 0),
  exactHowToSets: Object.values(exactDuplicateSummary).reduce((sum, item) => sum + item.howToSets, 0) + Object.values(expandedLocaleQuality).reduce((sum, item) => sum + item.exactHowToDuplicates, 0),
};
console.log(JSON.stringify({
  publicTools: tools.length,
  locales: publishedTargetLocales,
  localizedDetailPages: tools.reduce((sum, tool) => sum + tool.supportedLocales.length, 0),
  fileInputTools: tools.filter((tool) => tool.usesFileInput).length,
  verifiedInputOutputExamples: Object.keys(verifiedTextExamples).length,
  verifiedPhoneFormatterExamples: 2,
  verifiedSpecializedExamples: 5,
  verifiedLotteryExamples: lotteryEditorialSamples.length,
   batch7DraftLocales: Object.keys(batch7EditorialDrafts).length,
   verifiedBatch7SpecializedExamples: 4,
   batch8DraftLocales: Object.keys(batch8EditorialDrafts).length,
   verifiedBatch8RandomExamples: 5,
   batch9DraftLocales: Object.keys(batch9EditorialDrafts).length,
   verifiedBatch9RandomExamples: 5,
   batch10DraftLocales: Object.keys(batch10EditorialDrafts).length,
   batch10PomodoroCorrectionLocales: Object.keys(batch10PomodoroCorrections).length,
   batch11DraftLocales: Object.keys(batch11EditorialDrafts).length,
   batch12DraftLocales: Object.keys(batch12EditorialDrafts).length,
   batch13DraftLocales: Object.keys(batch13EditorialDrafts).length,
   batch14DraftLocales: Object.keys(batch14EditorialDrafts).length,
   batch15DraftLocales: Object.keys(batch15EditorialDrafts).length,
   batch16DraftLocales: Object.keys(batch16EditorialDrafts).length,
   batch17DraftLocales: Object.keys(batch17EditorialDrafts).length,
   batch18DraftLocales: Object.keys(batch18EditorialDrafts).length,
   batch19DraftLocales: Object.keys(batch19EditorialDrafts).length,
   batch20DraftLocales: Object.keys(batch20EditorialDrafts).length,
   batch21DraftLocales: Object.keys(batch21EditorialDrafts).length,
   batch22DraftLocales: Object.keys(batch22EditorialDrafts).length,
   batch23DraftLocales: Object.keys(batch23EditorialDrafts).length,
   batch24DraftLocales: Object.keys(batch24EditorialDrafts).length,
   batch25DraftLocales: Object.keys(batch25EditorialDrafts).length,
   batch26DraftLocales: Object.keys(batch26EditorialDrafts).length,
   batch27DraftLocales: Object.keys(batch27EditorialDrafts).length,
   batch28DraftLocales: Object.keys(batch28EditorialDrafts).length,
   batch29DraftLocales: Object.keys(batch29EditorialDrafts).length,
   batch30DraftLocales: Object.keys(batch30EditorialDrafts).length,
  duplicateTotals,
  expandedLocaleQuality,
  repeatedUsagePatterns,
  nearDuplicatePairCount: nearPairs.length,
  nearDuplicateCandidates: nearPairs.slice(0, 12),
  compactPageSignalCount: thinPageCandidates.length,
  noindexCandidates: [],
  localStorageDisclosedTools: tools.filter((tool) => Boolean(getToolStorageNote(tool.slug, "en"))).map((tool) => tool.slug),
  toolProcessingNetworkApiFiles: networkInputFiles,
  brokenPlaceholderLinks: brokenLinkFiles,
  toolSitemapEntries: toolSitemapEntries.length,
}, null, 2));
}

void runExtendedChecks();
