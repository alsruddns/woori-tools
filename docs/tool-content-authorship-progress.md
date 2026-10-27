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


## Batch 8 checkpoint ? 2026-10-27

- Recorded Korean drafts for `random-name-picker`, `random-wheel`, `draw-lots`, `random-team-maker`, and `random-order` in `docs/tool-content-authorship-batch-8-ko-draft.md`. Drafts distinguish participant entries from visible names, no-repeat rules, wheel weighting and 50-item cap, even team distribution, and staged order reveal.
- Ledger state is `KO_DRAFT`; verified completion remains **33/176**. Next work is all 26 locale versions and processor, SSR/SEO, browser, and quality validation.
- Batch 7 is committed and pushed as `ccb2fc8`; the remote `develop` is synchronized.


## Batch 8 ? COMPLETE ? 2026-10-27

| Tool | Result and evidence |
|---|---|
| `random-name-picker` | 26 locale pages explain per-line entries, blank-line handling, repeat rules, duplicate-name semantics, winner removal, and list shuffling. Actual unique draw helper returned the requested distinct entries; browser selected two unique names from four participants. |
| `draw-lots` | 26 locale pages distinguish separate lot entries on separate lines, repeat and remove options, and blank-line behavior. The selection helper passed count/uniqueness checks; browser drew three of four entries without repeats. |
| `random-wheel` | 26 locale pages cover line normalization, duplicate weighting, 2?50 UI limit, 3/5/8-second spin, and winner removal. `normalizeWheelItems` checks passed with duplicates on/off; browser verified wheel choices and selected a result. |
| `random-team-maker` | 26 locale pages describe random round-robin distribution by team count or team size, optional team names, and remainder behavior. `divideEvenly` assigned all sample participants with team sizes differing by at most one; browser placed all six people into two teams. |
| `random-order` | 26 locale pages explain distinct line entries, shuffled order, staged reveal, optional numbering, and copy behavior. Shuffle preserved every entry; browser revealed a full three-person order with no loss or duplication. |

Batch evidence: all 216 unit tests passed; content audit confirms all 176 tools, 26 locales, 4,576 localized detail/sitemap URLs, no English editorial fallback, no noindex candidates, and no new exact duplicate sets. The audit checks all five batch-8 editorials across all 26 locales and five random behavior examples. TypeScript, ESLint, `git diff --check`, and production build passed; build generated 4,866 static pages. Playwright passed 8/8 tests, including SSR and canonical/hreflang/x-default checks for 260 batch-8 locale pages, visible cards without hidden content, eight viewport widths for authored Korean pages, and live operations for all five tools. The global repeated FAQ/how-to and near-duplicate candidate counts remain unchanged from the previous audit. Native-speaker review was not performed.

The ledger now records 38/176 COMPLETE (138 remaining). Next selected PENDING batch: `random-seat`, `duty-picker`, `dice-roller`, `coin-flip`, `stopwatch`. Continue without reauthoring verified content.


## Batch 9 checkpoint — 2026-10-27

- 한국어 원고 초안을 docs/tool-content-authorship-batch-9-ko-draft.md에 기록했습니다. 좌석 용량/중복 이름, 당번 순환 배정, 주사위 화면별 개수 제한, 동전 앞면 비율, 스톱워치 랩 동작을 소스 기준으로 구분했습니다.
- 원장은 다섯 도구를 KO_DRAFT로 표시하며 검증 완료 수는 **38/176** 그대로입니다. 다음 단계는 26개 locale 원고, processor 예제, SSR/SEO 및 브라우저 검증입니다.

### Translation checkpoint

- `src/registry/tool-detail-editorials-batch-9.ts` contains direct editorial drafts for `ko`, `en`, `ja`, `zh`, `es`, `pt-br`, `de`, `fr`, `vi`, and `id` (10/26 locales). The module is not connected to page rendering, so incomplete locale coverage is not published.
- The ledger records these five tools as `TRANSLATING`; verified completion remains 38/176. Native-speaker review has not been performed.

## Batch 9 — COMPLETE — 2026-10-27

| Tool | Verified behavior |
|---|---|
| `random-seat` | 26 locale cards describe line-based distinct participants, row-first seat assignment, 1–20 row/column controls, 200-seat capacity and empty seats. The processor retained duplicate participant entries and skipped blank lines; browser output filled a 2 × 2 grid with three people and one empty seat. |
| `duty-picker` | 26 locale cards describe independently shuffled lists, one assignment per person, cyclic reuse when duties are fewer, and unused duties when they are more numerous. The processor and browser confirmed all three people received one of the two supplied duties. |
| `dice-roller` | 26 locale cards distinguish the standard 1–100 input from the expanded D4/D6/D8/D10/D12/D20 panel with 1–20 dice, including their different result summaries. Processor checks validated 100 standard D6 outcomes and totals plus 20 values in range for each supported die; browser exercised the expanded D6 panel. |
| `coin-flip` | 26 locale cards document 1–1,000 flips, heads/tails counts and observed heads ratio without prediction claims. Processor and browser checks confirmed counts sum to the requested flips and ratio matches the count. |
| `stopwatch` | 26 locale cards describe start, pause/resume, reset, hundredth-second display, lap/split values and the 100-lap in-memory limit. Browser verified two laps, pause and reset. |

Batch evidence: the content-quality audit passed with all 176 public tools, 26 locales, 4,576 localized detail/sitemap URLs, zero editorial English fallbacks and no new exact duplicate sets. It verifies the batch 9 five-locale coverage and five processor examples. All 216 unit tests, TypeScript, ESLint, `git diff --check`, and production build passed; the build generated 4,866 static pages. Playwright passed 9/9 tests, including SSR, visible editorial cards and canonical/hreflang/x-default on all 130 batch 9 locale routes, eight viewport widths on the Korean pages, and browser execution for all five tools. Global duplicate candidate counts remained unchanged. Native-speaker review was not performed.

The ledger now records **43/176 COMPLETE** (133 remaining). Next selected PENDING batch: `timer`, `pomodoro-timer`, `world-clock`, `password-generator`, `random-string-generator`. Continue without rewriting verified editorials.

## Batch 10 checkpoint — 2026-10-27

- Recorded Korean drafts for `timer`, `pomodoro-timer`, `world-clock`, `password-generator`, and `random-string-generator` in `docs/tool-content-authorship-batch-10-ko-draft.md`.
- The drafts distinguish the timer's visual completion from an audio alarm, the Pomodoro tool's manual fixed 25/5-minute modes, browser-local time-zone persistence, password character-group guarantees, and random-string count/length limits.
- The ledger marks all five as `KO_DRAFT`; verified completion remains **43/176**. Next: direct 26-locale authoring, generator-engine examples, SSR/SEO, and browser validation.

### Translation checkpoint

- Direct editorial drafts for the five Batch 10 tools cover all 26 locales in `src/registry/tool-detail-editorials-batch-10.ts`. The corrected set is now registered so SSR, SEO, and viewport checks can validate the actual rendered cards.
- Browser inspection found Pomodoro supports editable focus, short-break and long-break durations, and a configurable focus-cycle length; completion selects the next phase, while starting its timer remains manual. These behaviors are now reflected in all locales. Timer starts with five minutes selected.
- The world-clock 320px overflow is fixed by constraining the search controls; its 8/20-zone persistence behavior passed a mobile browser check. Timer and Pomodoro countdown browser check passed with configurable values.
- Batch 10 is `COMPLETE`; verified completion is **48/176**. Native-speaker review has not been performed.

### Pomodoro correction checkpoint

- Rechecked `CountdownWorkspace`: focus, short break, and long break are editable from 1–180 minutes; the cycle length is 1–12 focus sessions; defaults are 25/5/15 minutes and 4 focus sessions; settings persist in this browser. Completion selects the next phase, but its timer must be started manually.
- Re-authored the Pomodoro principle, usage, troubleshooting, and FAQ directly in all 26 locales and overlaid the correction on the Batch 10 editorial module.
- Added a browser check covering timer completion, Pomodoro defaults and editing, world-clock addition/persistence, and password/random-string length and character-group behavior. It passed; the quality checker, TypeScript, ESLint, and `git diff --check` also passed in this checkpoint.
- Generator checks now exercise the valid four-character minimum with all four character groups enabled. Every required group is included and the result length remains exact; the full unit suite also passed (216/216).
- Batch 10 editorial cards passed SSR and canonical/hreflang/x-default checks for all 130 locale routes, along with the eight-width Korean viewport suite. The complete Playwright suite passed 10/10 tests.
- The content audit confirmed 26 locale drafts with no English fallbacks, 176 public tools, 4,576 detail/sitemap entries, no noindex candidates, and no new exact duplicate sets. All 216 unit tests, TypeScript, lint, diff check, and production build passed; build output included 4,866 static pages.
- Batch 10 is verified **COMPLETE (48/176)**. Next PENDING batch: `wifi-qr`, `contact-qr`, `phone-qr`, `email-qr`, and `barcode-checker`. Native-speaker review was not performed.

## Batch 11 Korean checkpoint - 2026-10-27

- Selected the next five PENDING tools: `wifi-qr`, `contact-qr`, `phone-qr`, `email-qr`, and `barcode-checker`.
- Read the QR payload builder, barcode processor, and Russian/Turkish barcode UI. Drafts document actual formats: escaped Wi-Fi payload fields, vCard 3.0, `tel:` normalization, `mailto:` query encoding, and UPC-A/EAN-13 check-digit limits.
- Browser execution matched the documented Wi-Fi, vCard, phone, and email payload examples, including delimiter escaping and `mailto:` parameter encoding. EAN-13 `4006381333931` returned check digit 1 as valid; changing the final digit to 2 returned invalid with expected digit 1.
- Added Korean content drafts to `docs/tool-content-authorship-batch-11-ko-draft.md`. All five ledger entries are `KO_DRAFT`; verified completion remains **48/176**. Next: validate the sample payloads against the browser workspaces and barcode engine, then author all 26 locales.

## Batch 11 COMPLETE - 2026-10-27

| Tool | Verified content and behavior |
|---|---|
| `wifi-qr` | 26 localized cards explain SSID, WPA/WEP/open modes, hidden-network flag, escaped payload delimiters and browser PNG generation. Browser output matched the sample including escaped comma, colon, and semicolon. |
| `contact-qr` | Cards document vCard 3.0, required name, optional phone/email/company/site, and what scanners can read. Browser payload contained the expected name, telephone, and email fields. |
| `phone-qr` | Cards explain that digits and plus signs become a `tel:` link, with no validation or automatic call. Browser normalized `+82 10 1234 5678` to `tel:+821012345678`. |
| `email-qr` | Cards explain recipient-required `mailto:` links and optional subject/body; the QR opens a draft and never sends it. Browser output matched `mailto:hello@example.com?subject=Hi+there&body=Thanks`. |
| `barcode-checker` | Cards describe UPC-A/EAN-13 check digits and the limit that a matching digit does not identify/authenticate a product. Browser confirmed `4006381333931` as valid with expected digit 1 and rejected the variant ending in 2. |

Batch 11 verification: the content audit passed for 176 tools, 26 locales and 4,576 localized detail/sitemap URLs; all five entries have populated locale-specific fields with no English field fallback. The 216-test unit suite, TypeScript, ESLint, `git diff --check`, and production build passed; build generated 4,866 static pages. Playwright passed 11/11 tests, including SSR and canonical/hreflang/x-default checks for all selected authored pages, eight-width Korean page checks, workspace examples for all five tools, and the QR/barcode behavior test. No native-speaker review was performed. Existing global duplicate audit totals remain 171 repeated FAQ-question groups and 52 exact how-to sets; this batch did not add repeated FAQ questions or identical how-to wording among its own five tools in any locale.

The ledger records **53/176 COMPLETE** (123 remaining). Next PENDING batch: `barcode-generator`, `social-image-resize`, `add-text-to-image`, `instagram-grid-split`, and `image-collage`. Continue without reauthoring verified editorials.

## Batch 12 checkpoint - 2026-10-27

- Selected the five PENDING tools `barcode-generator`, `social-image-resize`, `add-text-to-image`, `instagram-grid-split`, and `image-collage`.
- Read `BarcodeWorkspace`, `processImage`, the shared image workspace and collage path. Drafts document CODE128/EAN-13 SVG generation, six fixed social-image JPEG presets with center crop, single-line bottom caption rendering, 3/6/9-tile ZIP output, and 2×2/3×2 JPEG collage layouts with file/pixel limits.
- Korean drafts are in `docs/tool-content-authorship-batch-12-ko-draft.md`. The five tools remain `KO_DRAFT`; verified completion remains **53/176**. Next: verify sample dimensions/payloads against the real processors, write all 26 locale editorials, then run SSR, SEO, browser, unit, type, lint, and build checks.

## Batch 12 COMPLETE - 2026-10-27

| Tool | Verified content and behavior |
|---|---|
| `barcode-generator` | 26 locale cards describe CODE128 and EAN-13 SVG output and the lack of product lookup/authenticity checks. Browser generation succeeded with CODE128 `ABC123` and EAN-13 `4006381333931`. |
| `social-image-resize` | Cards enumerate all six fixed JPEG presets and center-crop behavior. Browser output for a 160×120 fixture using Facebook preset was 1200×630. |
| `add-text-to-image` | Cards describe one fixed bottom-center bold white caption with black outline, the 160-character limit, and separate JPEG output. Browser processed a fixture with `Weekend market` and exposed a separate download. |
| `instagram-grid-split` | Cards explain one source image, central crop, three-column 3/6/9 tile grids, ZIP output, and manual posting order. Browser generated the nine-tile PNG ZIP from a 3×3 preset. |
| `image-collage` | Cards describe 2×2 and 3×2 grids, square center crops, 12px gaps, JPEG quality, and limits. Browser confirmed four fixture images produce a 996×996 JPEG. The result separator was corrected to display dimensions clearly. |

Batch 12 verification: content audit passed for 176 tools, 26 locales, and 4,576 localized detail/sitemap URLs; every batch locale has all five populated entries, distinct use cases and FAQ questions, and no English field fallback. All 216 unit tests, TypeScript, ESLint, `git diff --check`, and production build passed; 4,866 static pages were generated. Playwright passed 12/12 tests, including SSR and canonical/hreflang/x-default checks across authored locale pages, eight-width Korean mobile checks, and browser execution for all five Batch 12 examples. Existing overall duplicate audit totals remain 171 repeated FAQ-question groups and 52 exact how-to sets. No native-speaker review was performed.

The ledger records **58/176 COMPLETE** (118 remaining). Next PENDING batch: `file-hash`, `mime-type-checker`, `file-extension-checker`, `file-size-checker`, and `duplicate-file-checker`. Continue without reauthoring verified editorials.

## Batch 13 checkpoint - 2026-10-27

- Selected the next five PENDING file-inspection tools: `file-hash`, `mime-type-checker`, `file-extension-checker`, `file-size-checker`, and `duplicate-file-checker`.
- Inspected `processFileTool`, file selection limits, MIME signature detection, and browser hashing. Drafts distinguish browser-provided MIME from the small set of recognized byte signatures, report filename extension without validating content, display per-file sizes only, and group exact content matches by SHA-256 without deleting files.
- Korean originals are recorded in `docs/tool-content-authorship-batch-13-ko-draft.md`. All five remain `KO_DRAFT`; verified completion remains **58/176**. Next: author all 26 locale versions, exercise the documented examples with synthetic local files, and run the usual content, SSR, browser, unit, TypeScript, lint and build checks.

## Batch 13 COMPLETE - 2026-10-27

| Tool | Verified content and behavior |
|---|---|
| `file-hash` | 26 locale cards explain full-file SHA-256 and limits of a digest. Browser SHA-256 of UTF-8 `hello` matched `2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824`. |
| `mime-type-checker` | Cards distinguish browser MIME from the limited opening-byte signatures. A synthetic PNG reported `image/png` and `PNG signature`. |
| `file-extension-checker` | Cards clarify that the last filename suffix is listed beside browser MIME, with no validation or mismatch warning. `report.PDF` showed `.pdf` and `application/pdf`. |
| `file-size-checker` | Cards accurately describe per-file sizes only, using 1024-based units. A 1,536-byte fixture displayed as `1.5 KB`; no aggregate is reported. |
| `duplicate-file-checker` | Cards describe full-content SHA-256 grouping and no automatic deletion. Two byte-identical files with different names appeared in the same browser result group. |

Batch 13 verification: content audit passed for 176 tools, 26 locales and 4,576 localized detail/sitemap URLs; all five tools have populated locale-specific content, distinct FAQ questions and use cases, and no English field fallback. All 216 unit tests, TypeScript, ESLint, `git diff --check`, and production build passed; 4,866 static pages were generated. Playwright passed 13/13 tests, including SSR plus canonical/hreflang/x-default checks for selected authored locale pages, eight-width Korean viewport checks, and browser examples for the five local file tools. No file was uploaded. Existing global duplicate audit totals remain 171 repeated FAQ-question groups and 52 exact how-to sets. No native-speaker review was performed.

The ledger records **63/176 COMPLETE** (113 remaining). Next PENDING batch: `zip-files`, `bulk-file-renamer`, `filename-cleaner`, `lorem-ipsum`, and `regex-tester`. Continue without reauthoring verified editorials.

## Batch 14 checkpoint - 2026-10-27

- Selected `zip-files`, `bulk-file-renamer`, `filename-cleaner`, `lorem-ipsum`, and `regex-tester` from the next PENDING entries.
- Inspected archive naming/collision handling, the six rename options and preview, NFKC filename cleanup, the fixed Lorem ipsum paragraph generator, and the regex worker's input caps, safety rejects, match indexing, and timeout.
- Korean originals are recorded in `docs/tool-content-authorship-batch-14-ko-draft.md`. All five remain `KO_DRAFT`; verified completion remains **63/176**. The Lorem ipsum control advertises 100 while its processor clamps output to 20, so the UI limit will be aligned to the processor before the example is validated. Next: author 26 locales and verify archive, renaming, generator and regex examples.

## Batch 14 COMPLETE - 2026-10-27

| Tool | Verified content and behavior |
|---|---|
| `zip-files` | 26 locale cards describe local ZIP creation, unique conflicting entry names, size/count limits and preserved originals. Browser test selected `notes.txt` and `photo.jpg`, processed them, and confirmed `zip-files.zip`. |
| `bulk-file-renamer` | Cards cover prefix/suffix, stem search/replace, optional sequence, preview and ZIP copies. Browser preview and output report confirmed `photo-1.jpg` with `trip-` becomes `trip-photo-1.jpg`. |
| `filename-cleaner` | Cards describe NFKC normalization, forbidden-character removal, whitespace underscores, unique entries and unchanged bytes. Browser report confirmed `my photo?.jpg` becomes `my_photo.jpg`. |
| `lorem-ipsum` | Cards document the fixed repeated paragraph and 1-20 range. The control now starts at 3 and caps at 20, aligned with the processor. Browser output confirmed repeated paragraphs. |
| `regex-tester` | Cards cover `/pattern/flags`, global matching, worker limits and unsafe pattern rejection. Browser output for `/\\d+/g` and `A12` showed `12 (index 1)`. |

Batch 14 quality audit passed: all five tools have populated authored cards in 26 locales, distinct use cases and FAQ questions, with no English field fallback. The content audit still recognizes 176 public tools, 4,576 localized detail/sitemap URLs and no noindex candidates. Unit tests: 216/216 passed; TypeScript, ESLint and `git diff --check` passed; production build generated all 4,866 static pages. Batch-specific Playwright: archive/rename/cleaner/Lorem/regex examples passed and SSR/canonical/hreflang checks passed for five tools across eight representative locales (40 routes). The full browser spec was also attempted but its existing broad mobile viewport test exceeded 60 seconds in `page.evaluate`; targeted Batch 14 browser checks passed. Existing global duplicate audit remains 171 repeated FAQ-question groups and 52 exact how-to sets. No native-speaker review was performed.

The ledger records **68/176 COMPLETE** (108 remaining). Next PENDING batch: `color-converter`, `cron-parser`, `sql-formatter`, `html-formatter`, and `css-formatter`. Continue without reauthoring verified editorials.
## Batch 15 checkpoint - 2026-10-27

- Selected the next five PENDING developer tools: `color-converter`, `cron-parser`, `sql-formatter`, `html-formatter`, and `css-formatter`.
- Inspected `processText`: color parsing accepts 3/6-digit HEX, integer RGB channels, and HSL percent channels, returning HEX/RGB/HSL; cron parsing lists five next run times in the browser locale and local timezone without scheduling; SQL uses the default `sql` formatter dialect; HTML and CSS use Prettier plugins with a 100-column print width and do not execute the input.
- Korean originals are in `docs/tool-content-authorship-batch-15-ko-draft.md`. The ledger marks all five `KO_DRAFT`; verified completion remains **68/176**. Next: author every locale and verify examples against the actual processors.
## Batch 15 COMPLETE - 2026-10-27

| Tool | Verified content and behavior |
|---|---|
| `color-converter` | 26 locale cards document accepted HEX/RGB/HSL forms, range limits, and unsupported names/alpha. Browser conversion of `#ff0000` returned `#FF0000`, RGB 255/0/0, and HSL 0/100/50. |
| `cron-parser` | Cards explain five/six-field parsing, five upcoming times, device-local time zone, and no scheduling. Browser checked `0 9 * * 1` and all five listed results. |
| `sql-formatter` | Cards describe default SQL dialect formatting and no execution/database connection. Browser formatted `select id from users` into structured SQL. |
| `html-formatter` | Cards describe Prettier HTML formatting, 100-column width, and no rendering/validation. Browser verified nested paragraphs are placed on separate indented lines. |
| `css-formatter` | Cards explain PostCSS formatting, 100-column width, and no preview/validation. Browser formatted `h1{color:red}` into a readable rule. |

Batch 15 quality audit passed for all five tools and 26 locales: populated fields, distinct FAQs/use cases, and no English field fallback. Audit totals remain 176 public tools, 4,576 detail/sitemap URLs, and zero noindex candidates. All 216 unit tests, TypeScript, ESLint, `git diff --check`, and production build passed; build generated 4,866 static pages. Batch Playwright passed 3/3 tests: five processor examples, SSR/canonical/hreflang/x-default on five tools across nine representative locales (45 routes), and viewport overflow checks at 320px and 390px. Existing global duplicate audit remains 171 repeated FAQ-question groups and 52 exact how-to sets. No native-speaker review was performed.

The ledger records **73/176 COMPLETE** (103 remaining). Next PENDING batch: `javascript-formatter`, `markdown-preview`, `jpg-to-png`, `png-to-jpg`, and `webp-to-jpg`. Continue without reauthoring verified editorials.
## Batch 16 checkpoint - 2026-10-27

- Selected `javascript-formatter`, `markdown-preview`, `jpg-to-png`, `png-to-jpg`, and `webp-to-jpg` from the PENDING ledger.
- Inspected the Prettier Babel/ESTree formatter, Marked plus DOMPurify local preview, and Canvas conversion path. Image conversions keep decoded dimensions; inputs are limited to 30 MB and 40 million pixels. JPEG outputs use the configured quality and PNG-to-JPEG/WebP-to-JPEG paths fill white before encoding.
- Korean drafts are recorded in `docs/tool-content-authorship-batch-16-ko-draft.md`. The ledger marks all five `KO_DRAFT`; verified completion remains **73/176**. Next: author all locale cards, exercise the code examples with actual browser processing, and run the batch checks.
## Batch 16 COMPLETE - 2026-10-27

| Tool | Verified content and behavior |
|---|---|
| `javascript-formatter` | 26 locale cards describe Prettier Babel/ESTree formatting at 100 columns and no execution. Browser formatted `const x=1;` as `const x = 1;`. |
| `markdown-preview` | Cards describe Marked conversion and DOMPurify HTML-profile cleaning. Browser rendered a heading and bold text and confirmed an `onerror` attribute is removed from supplied HTML. |
| `jpg-to-png` | Cards document local Canvas PNG re-encoding, retained dimensions, and 30 MB/40 million-pixel limits. Browser output MIME was `image/png`, dimensions 12×8, and the download ended in `.png`. |
| `png-to-jpg` | Cards document white background flattening, retained dimensions, and the same safe limits. Browser verified JPEG MIME and correct `.jpg` download. A prior output-type/name mismatch was fixed in the shared conversion mappings. |
| `webp-to-jpg` | Cards describe Canvas JPEG re-encoding and white fill for transparent areas. Browser verified JPEG output, 12×8 dimensions, and `.jpg` download. |

Batch 16 audit passed: all five tools have distinct authored cards in 26 locales, distinct use cases and FAQs, and no English field fallback. Totals remain 176 public tools, 4,576 detail/sitemap URLs, and no noindex candidates. All 216 unit tests, TypeScript, ESLint, `git diff --check`, and production build passed; 4,866 static pages generated. Batch Playwright passed 3/3 tests, covering five processor examples and Markdown sanitization, SSR/canonical/hreflang/x-default on 50 routes (five tools × ten representative locales), and 320px/390px overflow checks. Existing global duplicate audit remains 171 repeated FAQ-question groups and 52 exact how-to sets. No native-speaker review was performed.

The ledger records **78/176 COMPLETE** (98 remaining). Next PENDING batch is recorded in the ledger; continue without reauthoring verified editorials.

## Batch 17 checkpoint - 2026-10-27

- Selected the next five PENDING image tools: `webp-to-png`, `jpg-to-webp`, `png-to-webp`, `heic-to-jpg`, and `image-compress`.
- Inspected the Canvas image processor and workspace quality control. All selected inputs share a 30 MB file limit and 40-million decoded-pixel limit. WebP and JPEG output use the quality slider (default 82%); HEIC/HEIF uses the browser-loaded `heic2any` decoder before Canvas JPEG encoding. `image-compress` always encodes JPEG; JPEG outputs flatten transparency onto white. Batch-specific browser examples and tests are pending.
- Korean originals are in `docs/tool-content-authorship-batch-17-ko-draft.md`. Ledger status is `KO_DRAFT` for all five; verified completion remains **78/176**. Next: author all 26 locales and verify dimensions, MIME, transparency, quality controls, and example output against the running processors.

## Batch 17 COMPLETE - 2026-10-27

| Tool | Verified content and behavior |
|---|---|
| `webp-to-png` | Browser test converted a transparent 12×8 WebP to transparent 12×8 PNG; MIME and `.png` filename matched. Cards explain lossless PNG can be larger. |
| `jpg-to-webp` | Browser test verified WebP MIME, 12×8 dimensions, opaque JPEG output, and `.webp` filename. Cards describe lossy quality control and no guaranteed size reduction. |
| `png-to-webp` | Browser test verified WebP MIME, 12×8 dimensions, transparency, and `.webp` filename. Cards qualify transparency on browser encoder support. |
| `heic-to-jpg` | CC0 synthetic 1600×1200 HEIC fixture converted to JPEG at 1600×1200 with `.jpg` filename. Cards describe browser-loaded heic2any, white JPEG background, limits, and metadata caveat. |
| `image-compress` | Browser test verified PNG input is always JPEG output, 12×8, opaque white-flattened result, and `.jpg` filename. Cards specify 82% default quality and that size reduction is not guaranteed. |

All five have authored cards in 26 locales, distinct use cases and FAQ questions, and no English field fallback. Content audit totals: 176 public tools, 4,576 localized detail/sitemap URLs, and zero noindex candidates. All 216 unit tests, TypeScript, ESLint, `git diff --check`, and production build passed; build generated 4,866 static pages. Batch Playwright passed 3/3 tests: editorials/SEO on 50 routes (five tools × ten representative locales), real image processing for all five tools, and mobile overflow at 320px/390px. The HEIC test fixture is synthetic and CC0; details and SHA-256 are in `tests/fixtures/heic/README.md`. Existing global duplicate audit remains 171 repeated FAQ-question groups and 52 exact how-to sets. No native-speaker review was performed.

The ledger records **83/176 COMPLETE** (93 remaining). Next PENDING batch: `image-resize`, `image-crop`, `image-rotate`, `image-flip`, and `image-grayscale`. Continue without reauthoring verified editorials.

## Batch 18 checkpoint - 2026-10-27

- Selected `image-resize`, `image-crop`, `image-rotate`, `image-flip`, and `image-grayscale` from the PENDING ledger.
- Inspected Canvas implementation and controls: resize dimensions clamp to 1–12,000 px and optional ratio lock derives height from width; crop uses a centered 1:1, 16:9, or 3:4 rectangle; rotate selects 90/180/270 degrees; flip selects horizontal/vertical; grayscale applies Canvas `grayscale(1)`. These tools export a separate JPEG. Input limits remain 30 MB and 40 million decoded pixels.
- Korean drafts are in `docs/tool-content-authorship-batch-18-ko-draft.md`. Ledger status is `KO_DRAFT` for all five; verified completion remains **83/176**. Next: author all locales and verify dimensions, selected crop, rotation/flip orientation, grayscale pixels, and download output.

## Batch 18 COMPLETE - 2026-10-27

| Tool | Verified content and behavior |
|---|---|
| `image-resize` | Browser test resized a 12×8 PNG to 6×4 with ratio lock; JPEG MIME and `.jpg` download matched. Cards describe 1–12,000 px bounds and ratio behavior. |
| `image-crop` | Browser test selected centered 1:1 crop from 12×8, produced 8×8 JPEG, and checked left/right colors confirm the central crop. |
| `image-rotate` | Browser test rotated a 12×8 asymmetric image 90° to 8×12 and checked output orientation. |
| `image-flip` | Browser test flipped an asymmetric image horizontally, retained 12×8 dimensions, and checked swapped color positions. |
| `image-grayscale` | Browser test confirmed a color sample became grayscale, retained 12×8 dimensions, and exported JPEG. |

All five have authored cards in 26 locales, distinct use cases and FAQs, and no English field fallback. Content audit totals: 176 public tools, 4,576 localized detail/sitemap URLs, and zero noindex candidates. All 216 unit tests, TypeScript, ESLint, `git diff --check`, and production build passed; build generated 4,866 static pages. Batch Playwright passed 3/3 tests: SSR/editorials/SEO across 50 routes, all five actual image edits, and 320px/390px overflow checks. Existing global duplicate audit remains 171 repeated FAQ-question groups and 52 exact how-to sets. No native-speaker review was performed.

The ledger records **88/176 COMPLETE** (88 remaining). Next PENDING batch: `image-brightness`, `image-contrast`, `image-blur`, `image-pixelate`, and `remove-image-metadata`. Continue without reauthoring verified editorials.

## Batch 19 checkpoint - 2026-10-27

- Selected `image-brightness`, `image-contrast`, `image-blur`, `image-pixelate`, and `remove-image-metadata` from the PENDING ledger.
- Inspected actual Canvas filters and controls: brightness/contrast range 0–200 with current default 25 (100 is neutral); blur range 0–100 maps to `value / 10` CSS pixels; pixelation range 4–80 scales down then enlarges without smoothing. Metadata removal re-encodes as JPEG. Shared limits are 30 MB and 40 million decoded pixels.
- Korean drafts are in `docs/tool-content-authorship-batch-19-ko-draft.md`. Ledger status is `KO_DRAFT` for all five; verified completion remains **88/176**. Next: author all locale cards and verify filter outputs, pixel blocks, and EXIF removal in browser.
