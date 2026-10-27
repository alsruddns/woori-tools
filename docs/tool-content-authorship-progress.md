# Editorial authorship progress

Status definitions: `PENDING` means no original editorial work has started; `KO_DRAFT` means the Korean original is drafted; `TRANSLATING` means the other 25 authored locales are in progress; `VALIDATING` means implementation and content are being checked; `COMPLETE` requires original content in all 26 locales plus processor-example, SSR/SEO, and browser checks; `BLOCKED` records a concrete technical blocker. A status is not a completion count: count only tools whose code and evidence meet the COMPLETE criteria.

## Batch 1: deterministic text processing (5 tools)

| Tool | Status | Evidence and remaining work |
|---|---|---|
| `character-count` | COMPLETE | Original editorial in all 26 locales; `Woori Tools` result executed by the processor and compared exactly. All 26 SSR pages and the Korean page at all eight viewport widths passed. |
| `remove-spaces` | COMPLETE | Original editorial in all 26 locales; the deterministic input/output example passed the processor checker. All 26 SSR pages and the Korean page at all eight viewport widths passed. |
| `remove-line-breaks` | COMPLETE | Original editorial in all 26 locales; the deterministic input/output example passed the processor checker. All 26 SSR pages and the Korean page at all eight viewport widths passed. |
| `remove-duplicate-lines` | COMPLETE | Original editorial in all 26 locales; the deterministic input/output example passed the processor checker. All 26 SSR pages and the Korean page at all eight viewport widths passed. |
| `reverse-text` | COMPLETE | Original editorial in all 26 locales; the deterministic input/output example passed the processor checker. All 26 SSR pages and the Korean page at all eight viewport widths passed. |

Current evidence: 216 unit tests pass; content check reports 176 tools, 26 locales, 4,576 detail URLs, 28 executable text examples, 4,576 sitemap URLs, and zero noindex candidates. Lint, TypeScript, production build, and Playwright (3 tests) passed. SSR E2E covered all 26 locale pages for twelve authored editorial tools (312 responses), including canonical, hreflang, x-default, and noindex checks. Ten Korean text-tool pages were checked at 320, 360, 375, 390, 430, 768, 1024, and 1440 CSS pixels. Native-speaker review was not performed.

## Batch 2 continued: line-oriented text processing

| Tool | Status | Evidence and remaining work |
|---|---|---|
| `add-line-numbers` | COMPLETE | Original processor-specific guide translated for all 26 locales. The deterministic `A` / `B` example was run through `processText` and the registered example checker. All 26 SSR pages passed canonical, hreflang, x-default, visible-card, and noindex checks; the Korean page passed all eight viewport widths. Native-speaker review was not performed. |
| `remove-line-numbers` | COMPLETE | Original processor-specific guide translated for all 26 locales. The registered numbered-list example passed the processor checker. All 26 SSR pages passed canonical, hreflang, x-default, visible-card, and noindex checks; the Korean page passed all eight viewport widths. Native-speaker review was not performed. |
| `remove-empty-lines` | COMPLETE | Original processor-specific guide translated for all 26 locales. The registered blank-line example passed the processor checker. All 26 SSR pages passed canonical, hreflang, x-default, visible-card, and noindex checks; the Korean page passed all eight viewport widths. Native-speaker review was not performed. |
| `remove-characters` | COMPLETE | Original processor-specific guide translated for all 26 locales. The registered digit-removal example passed the processor checker. All 26 SSR pages passed canonical, hreflang, x-default, visible-card, and noindex checks; the Korean page passed all eight viewport widths. Native-speaker review was not performed. |
| `text-repeater` | COMPLETE | Processor-specific guide translated for all 26 locales, and the registered repeat example passed the processor checker. The Korean explanation was clarified to match the actual guard: it checks input length × count, excluding separator length. All 26 SSR pages passed canonical, hreflang, x-default, visible-card, and noindex checks; the Korean page passed all eight viewport widths. Native-speaker review was not performed. |

## Batch 3: locale-aware text sorting

| Tool | Status | Evidence and remaining work |
|---|---|---|
| `sort-lines` | COMPLETE | Original processor-specific editorial in all 26 locales. The registered `pear / apple / banana` example is executed by `check:content-quality`; processor uses locale-aware comparison with numeric ordering and base sensitivity. All 26 locale SSR cards passed the expanded Playwright check, and the Korean page passed the eight-width mobile check. Canonical, hreflang, x-default, visible content, and noindex checks passed. Native-speaker review was not performed. |

Batch evidence: 216 unit tests, content quality audit (176 tools, 26 locales, 4,576 detail pages and sitemap URLs, 28 executable examples, zero noindex candidates), TypeScript, lint, production build (4,866 static pages), and Playwright (3 tests) passed. The content audit still reports repeated FAQ-question and near-duplicate candidates elsewhere; those require review of the actual text and are not treated as this tool's completion blockers.

## Batch 4: line randomization, text transformation, comparison, deduplication, and download

| Tool | Status | Evidence and remaining work |
|---|---|---|
| `shuffle-lines` | COMPLETE | Original copy in all 26 locales explains randomized order, duplicate entries, omission of exactly empty lines, and non-deterministic reruns. The checker ran the actual processor and verified its output is a permutation of all non-empty input lines, including duplicates. |
| `text-case-converter` | COMPLETE | Original copy in all 26 locales describes lower, upper, and title modes and their locale rules. Registered output and Turkish-specific casing were checked against `processText`. |
| `text-compare` | COMPLETE | Original copy in all 26 locales describes exact whole-line comparison, `−`/`+` output, and whitespace sensitivity. The registered two-input example matched `processText`. |
| `remove-duplicate-words` | COMPLETE | Original copy in all 26 locales describes first-occurrence retention, locale-aware case-insensitive matching, punctuation, and whitespace normalization. Registered output and Turkish casing behavior matched `processText`. |
| `text-to-file` | COMPLETE | Original copy in all 26 locales describes the actual browser-created UTF-8 `.txt` Blob. The checker verified status text, MIME, and downloaded contents. Existing metadata that claimed CSV or user-selectable filenames/formats was corrected for affected locales. |

Batch evidence: all 216 unit tests, content audit (176 public tools, 26 locales, 4,576 detail/sitemap URLs, 30 executable examples, zero noindex candidates), TypeScript, lint, production build (4,866 static pages), and four Playwright tests passed. SSR checks covered all 26 locales for 18 authored tools (468 pages) with canonical, hreflang, x-default, visible content, and noindex assertions. Sixteen Korean text tools passed the eight-width viewport check; browser interactions executed all five tools. The audit still reports 171 repeated FAQ-question sets and 1,060 near-duplicate candidates elsewhere for later review. Native-speaker review was not performed.

## Batch 5: Japanese script and number conversion, Chinese script conversion

| Tool | Status | Evidence and remaining work |
|---|---|---|
| `hiragana-katakana-converter` | COMPLETE | Original guide in all 26 locales explains supported kana ranges, unchanged punctuation/kanji/Latin, and the `ひらがな` → `ヒラガナ` example. The example was run through `convertKana`. |
| `fullwidth-halfwidth-converter` | COMPLETE | Original guide in all 26 locales documents the asymmetric directions, including fullwidth ASCII expansion and unchanged ASCII in the reverse direction. `ＡＢＣ１２３` → `ABC123` matched `convertWidth`. |
| `japanese-romaji-converter` | COMPLETE | Original guide in all 26 locales covers combined kana, sokuon, apostrophe handling, long vowels, and the limits of kanji reading inference. `こんにちは` → `konnichiha` matched `kanaToRomaji`. |
| `japanese-number-kanji-converter` | COMPLETE | Original guide in all 26 locales covers supported integer units, reverse parsing, safe-integer limits, decimals, and leading zeros. `123` → `百二十三` matched `numberToKanji`. |
| `simplified-traditional-chinese-converter` | COMPLETE | Original guide in all 26 locales explains OpenCC Taiwan traditional direction, reverse conversion, and that conversion is not translation. `简体中文` → `簡體中文` matched the country processor. |

Batch 5 verification: content audit covers 176 tools, all 26 locales, 4,576 localized detail/sitemap URLs, no English editorial fallbacks, and five processor-checked examples. Unit tests (216), TypeScript, lint, and production build (4,866 static pages) passed. Playwright SSR covered all 26 locales for 23 authored tools (598 pages), and the Korean pages passed all eight viewport widths; the browser also exercised the five conversion examples. Canonical, hreflang, x-default, visible content, and noindex checks passed. Fixing the locale-copy merge also restored the existing Japanese workspace labels that had been overwritten by shallow merges. Native-speaker review was not performed.

## Batch 6: lottery number generators

| Tool | Status | Evidence and remaining work |
|---|---|---|
| `lotto-number-generator` | COMPLETE | Original copy in all 26 locales explains six distinct numbers from 1–45, include/exclude and parity settings, one or five games, sorting, and the lack of prediction. Sample `4, 12, 19, 27, 33, 41` was checked for range and uniqueness; actual generated games honored include/exclude constraints. |
| `powerball-number-generator` | COMPLETE | Original copy in all 26 locales distinguishes five white balls from 1–69 and a separate Powerball from 1–26. Sample `7, 18, 29, 44, 63 + Powerball 12` passed range/uniqueness checks; special-ball include/exclude behavior was exercised. |
| `mega-millions-number-generator` | COMPLETE | Original copy in all 26 locales distinguishes five main numbers from 1–70 and a separate Mega Ball from 1–24. Sample `5, 16, 28, 47, 69 + Mega Ball 8` passed range/uniqueness checks; special-ball include/exclude behavior was exercised. |
| `japan-loto6-number-generator` | COMPLETE | Original copy in all 26 locales describes six distinct numbers from 1–43 and clarifies that this workspace generates only the six main numbers. Sample `3, 11, 20, 26, 34, 42` passed range and uniqueness checks. |
| `japan-loto7-number-generator` | COMPLETE | Original copy in all 26 locales distinguishes seven numbers from 1–37 from LOTO 6. Sample `2, 8, 14, 21, 27, 33, 37` passed range and uniqueness checks. |

Batch 6 verification: the content audit reports five lottery examples checked against `generateLottoGames` and `generateSpecialBalls`, 176 public tools, 26 locales, 4,576 localized detail/sitemap URLs, no English editorial fallbacks, and zero noindex candidates. All 216 unit tests, TypeScript, lint, `git diff --check`, and production build (4,866 static pages) passed. Playwright passed six tests; SSR covered all 26 locales for 28 authored tools (728 pages), all 26 authored Korean pages passed the eight-width viewport check, and the browser generated valid game shapes for all five tools. Canonical, hreflang, x-default, visible content, and noindex checks passed. Native-speaker review was not performed.

The machine-readable [tool status ledger](tool-content-authorship-status.json) covers all 176 public tools and is checked by the content audit. Cumulative editorial completion is 28/176, with 148 remaining. Next selected batch (all `PENDING`): `japan-mini-loto-number-generator`, `tarot-card`, `daily-fortune`, `saju`, and `random-number`. Continue from the first PENDING tool and preserve all COMPLETE content. Native-speaker review has not been performed for authored batches.

## Batch 7 checkpoint — 2026-10-27

- Durable Korean drafts are recorded for `japan-mini-loto-number-generator`, `tarot-card`, `daily-fortune`, `saju`, and `random-number` in `docs/tool-content-authorship-batch-7-ko-draft.md`.
- Ledger statuses for these five are `KO_DRAFT`; overall verified completion remains **28/176**. They are not included in the localized editorial registry and are not counted as complete.
- Pending work: write and integrate all 26 locale versions; verify each described example against its processor or calculation library; run content audit, affected unit tests, TypeScript, lint, build and browser checks; then update statuses only after passing evidence.
- No native-speaker review has been performed. No external translation service was used.


### Batch 7 translation and engine checkpoint

- Status is now `TRANSLATING`. Original Korean drafts and direct English, Japanese, and Simplified Chinese versions cover all five tools in `src/registry/tool-detail-editorials-batch-7-draft.ts`; this unpublished working file is intentionally separate from the live editorial registry until all 26 locales are ready.
- The quality audit now runs concrete examples: Mini LOTO generation constraints, tarot deck size/unique IDs, the daily-fortune fixed selection vector, the Saju library result for 1990-05-17 12:00, and random-number count/range/uniqueness/sort properties. The five selected tools are not counted complete.
- Locales authored so far: 4/26 (ko, en, ja, zh); native-speaker review has not been performed.


### Batch 7 content checkpoint ? 2026-10-27

- Original tool-specific editorial content is now authored for all five selected tools in all 26 published locales in `src/registry/tool-detail-editorials-batch-7-draft.ts`. The entries describe each tool?s distinct processor behavior, example, use steps, limits, and FAQ; native-speaker review has not been performed.
- The editorial registry serves these entries while the ledger records `VALIDATING`. Verified completion remains 28/176 until all processor, SSR/SEO, browser, locale, lint/type, and build checks pass.
- The checker exercises Mini LOTO?s 5-of-31 output, tarot deck size and unique IDs, the deterministic daily-fortune example, the Saju library vector and visible-element totals, and random-number count/range/uniqueness/order. Current aggregate route and sitemap count remains 4,576.


## Batch 7 ? COMPLETE ? 2026-10-27

| Tool | Result and evidence |
|---|---|
| `japan-mini-loto-number-generator` | 26 locale editorial cards describe five distinct numbers from 1?31, inclusion/exclusion and parity choices, one/five games, sorted output, no bonus number, and no prediction. Sample combination passed range/uniqueness checks; the actual processor generated a valid constrained game. |
| `tarot-card` | 26 locale cards describe the 22-card Major Arcana, one/three distinct cards, orientation, topics, optional 240-character question, browser-only handling, and entertainment limits. Deck IDs were checked; the browser confirmed a unique three-card draw and valid orientations. |
| `daily-fortune` | 26 locale cards describe deterministic selections from birth date plus device-local date, the five reading categories, lucky number/color, browser-only handling, and limits. The documented fixed vector matched `fortuneIndices`; browser output returned a lucky number in 1?6. |
| `saju` | 26 locale cards document calendar choice, leap month, supported year ranges, KST/midnight boundary, equal visible-character element counts, and absent true-solar-time/hidden-stem weighting. The 1990-05-17 12:00 sample matched the `manseryeok` pillars ??/??/??/?? and element totals; browser rendered the result. |
| `random-number` | 26 locale cards cover inclusive integer bounds, 1?100 count, uniqueness, sorting, safe-range limits, and changing random results. The live processor output passed count/range/uniqueness/order assertions; the browser did too. |

Batch evidence: all 216 unit tests passed; content quality audit passed with 176 tools, 26 locales, 4,576 detail/sitemap entries, no English editorial fallbacks, and no noindex candidates. The audit now validates six lottery examples and four batch-7 processor examples. TypeScript, ESLint, `git diff --check`, and production build passed; build generated 4,866 static pages. Playwright passed 7/7 tests, including SSR and canonical/hreflang/x-default checks for the 130 batch-7 locale pages, no hidden editorial cards, eight viewport widths for authored Korean pages, and tool execution checks. Duplicate audit counts remained at the prior 171 repeated FAQ sets, 52 exact how-to sets, and 1,060 near-duplicate candidates; batch 7 introduced no new exact description/example/FAQ duplicate set. Native-speaker review was not performed.

The ledger now records 33/176 COMPLETE (143 remaining). Next selected PENDING batch: `random-name-picker`, `random-wheel`, `draw-lots`, `random-team-maker`, `random-order`. Continue without reauthoring verified content.
