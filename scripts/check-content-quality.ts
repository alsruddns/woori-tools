import assert from "node:assert/strict";
import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { locales, publishedTargetLocales, type PublishedTargetLocale } from "../src/i18n/routing";
import { getLocalizedCategories } from "../src/registry/category-translations";
import { getFileGuidance } from "../src/registry/file-guidance";
import { homeContent } from "../src/registry/home-content";
import { getToolContent, getToolStorageNote } from "../src/registry/tool-content";
import { toolExampleInputs } from "../src/registry/tool-example-inputs";
import { getToolFaqQuestions } from "../src/registry/tool-faq";
import { getToolRiskNote } from "../src/registry/tool-risk-notes";
import { localizeTool } from "../src/registry/tool-translations";
import { renameCopy, selectionCopy } from "../src/registry/tool-option-copy";
import { tools } from "../src/registry/tools";
import { languageAlternates, SITE_ORIGIN } from "../src/lib/seo";
import { createSitemapEntries } from "../src/lib/sitemap-entries.mjs";

const slugs = new Set(tools.map((tool) => tool.slug));
assert.equal(slugs.size, tools.length, "duplicate public slug");
assert.deepEqual(new Set(Object.keys(toolExampleInputs)), slugs, "sample inputs must match public tools exactly");
const duplicateCounts = (values: string[]) => {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].filter(([, count]) => count > 1).sort((a, b) => b[1] - a[1]);
};
const exactDuplicateSummary: Record<string, { descriptions: number; faqSets: number; howToSets: number; repeatedStep2Phrases: number; repeatedStep2Occurrences: number; repeatedStep3Phrases: number; repeatedStep3Occurrences: number }> = {};
const nearDuplicateCandidates: Array<{ locale: string; left: string; right: string; similarity: number }> = [];
const thinPageCandidates: Array<{ locale: string; slug: string; chars: number }> = [];

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
  for (let i = 0; i < normalized.length; i++) for (let j = i + 1; j < normalized.length; j++) {
    const a = normalized[i].value, b = normalized[j].value;
    if (Math.min(a.length, b.length) < 24) continue;
    const grams = (s: string) => new Set(Array.from({ length: s.length - 2 }, (_, n) => s.slice(n, n + 3)));
    const ga = grams(a), gb = grams(b);
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
assert.ok(toolSitemapEntries.every((entry) => Object.keys(entry.alternates.languages).length === (["/color-converter", "/regex-tester", "/lorem-ipsum", "/text-to-file", "/remove-characters", "/text-repeater", "/remove-spaces", "/remove-line-breaks", "/text-case-converter", "/reverse-text", "/remove-duplicate-words", "/character-count", "/shuffle-lines", "/add-line-numbers", "/remove-line-numbers", "/remove-empty-lines", "/remove-duplicate-lines", "/sort-lines", "/bulk-file-renamer", "/filename-cleaner", "/zip-files", "/file-hash", "/mime-type-checker", "/file-extension-checker", "/file-size-checker", "/duplicate-file-checker", "/barcode-generator", "/barcode-checker", "/instagram-grid-split", "/image-collage", "/markdown-preview", "/timer", "/pomodoro-timer", "/password-generator", "/random-string-generator", "/wifi-qr", "/contact-qr", "/phone-qr", "/email-qr", "/world-clock", "/dice-roller", "/random-number", "/stopwatch", "/coin-flip", "/random-name-picker", "/draw-lots", "/random-team-maker", "/random-order", "/random-seat", "/duty-picker", "/random-wheel", "/tarot-card", "/daily-fortune", "/saju"].some((suffix) => entry.url.endsWith(suffix)) ? 17 : 16)), "tool sitemap alternate must match each tool's published locales and x-default");

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
console.log(JSON.stringify({
  publicTools: tools.length,
  locales,
  localizedDetailPages: tools.reduce((sum, tool) => sum + tool.supportedLocales.length, 0),
  fileInputTools: tools.filter((tool) => tool.usesFileInput).length,
  exactDuplicateSummary: { descriptions: 0, faqSets: 0, howToSets: 0 },
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
