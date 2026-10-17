# AdSense pre-review content quality audit

This audit records checks against the public registry and source on `develop`. It is a content and UX review, not a prediction or guarantee of AdSense approval. Google's guidance asks publishers to provide original, useful content and a clear reason to visit; the site must also be complete and navigable ([AdSense site approval guidance](https://support.google.com/adsense/answer/81904?hl=en), [publisher compliance guidance](https://support.google.com/adsense/answer/1261929?hl=en)).

## Scope and result

- **176 public tools**, each registered for **15 locales**, produce **2,640 localized detail URLs**.
- All 176 slugs have a localized title, description, overview or H1 summary, three usage steps, a concrete example, options, a caution, two FAQ entries, and related-tool/category data where available.
- The 15-locale audit covers `ko`, `en`, `ja`, `zh`, `es`, `pt-br`, `de`, `fr`, `vi`, `id`, `th`, `zh-tw`, `it`, `nl`, and `hi`.
- Empty/raw-key content, unsupported-locale descriptions, duplicate descriptions, duplicate FAQ sets, duplicate complete how-to sets, broken related IDs, missing file guidance, and placeholder links are build-check failures.
- The previously repeated third-step text in the US lottery tools was replaced with separate white-ball/Powerball and main-number/Mega Ball instructions. Japan LOTO 6, LOTO 7, and Mini Loto steps now state the correct number count and range in `ko`, `en`, `ja`, and `zh`.
- For the 11 additional locales, descriptions and step 2 now refer to the tool's translated name and its task category. Step 1 uses that tool's sample input; step 3 names the tool and compares against its own sample output. There are **zero exact duplicate three-step sets** and **zero repeated third-step strings**. Step 2 intentionally shares 7–8 localized task-family instructions (text, image, PDF, developer, utility, date/time, fortune, random) across related tools: 143–168 repeated occurrences beyond each phrase's first use per locale.
- The H1 introduction and the lower overview section no longer render the same sentence twice. A separate overview appears only when it adds text beyond the localized H1 summary.

## Locale review

- All 15 locales pass non-empty, raw-key, English-description-fallback, example, FAQ, and how-to checks.
- `ja`, `zh`, `zh-tw`, `th`, `vi`, `id`, and `hi` have localized operation instructions, storage notices, and file labels checked in source. Their new task-family phrases describe the actual input/options for the corresponding tool category.
- This is a source-level language review, not certification by professional native-language editors. A final native review remains useful for high-traffic pages, especially country-specific names and rules.

## Similar-copy signals

- Exact localized description duplicates: **0**.
- Exact FAQ-set duplicates: **0**.
- Exact three-step how-to set duplicates: **0**.
- The checker reports **1,060 unique slug pairs** with character-trigram similarity of at least 0.90 in one or more locales. The strongest signals include country-specific phone/date/number formatters and validators, SQL/HTML/CSS formatters, image resizing variants, image format converters, and adjacent lottery rules. These tools share an operation family but apply different input formats, outputs, or rules; similarity alone is not proof of duplicate functionality or a reason to noindex.
- Compact-page signal: **536 locale-page records** have selected editorial fields totaling fewer than 450 code points. This is a review signal only; it is not a noindex rule because CJK languages convey comparable meaning with fewer characters. No page is automatically recommended for `noindex` based on this arbitrary length threshold.

## Privacy and browser processing

- A static scan of tool processing components and libraries found no `fetch`, `XMLHttpRequest`, or `sendBeacon` calls. This supports the current browser-only processing statements; it does not claim that the website never makes network requests for page delivery, ads, or other site functions.
- Code does use `localStorage` for lottery history, Japanese tool history, Pomodoro settings, and World Clock city choices. Those 18 tool pages now show a translated notice that browser-local settings or recent results may remain on the device until browser data is cleared.
- JWT guidance remains explicit that decoding claims or expiry does not verify signatures, issuer, or token validity. QR and barcode copy does not claim safety, authenticity, or proof of official issuance.

## File tools

- File guidance is checked for all **44 public file-input tools** against the registry category and processing code. Supported guidance distinguishes image, PDF, and arbitrary-file inputs and describes download behavior only when an output file is created.
- Image processing checks a **30 MB per-file** cap and a **40,000,000 decoded-pixel** cap. PDF processing checks a **50 MB total** cap. Generic file tools allow **100 MB per file**, **100 files**, and **200 MB total**. Image collage allows **6 images / 100 MB total**; images-to-PDF allows **30 MB per image / 50 MB total**. The PDF page-size checker has no explicit picker byte cap and is described as browser-memory limited.
- The audit found an HEIF mismatch: the picker advertised `.heif` but filename validation only accepted `.heic`. File selection and preview handling now accept both extensions, consistent with the image decoder's HEIF MIME support.

## Home page, navigation, ads, and index coverage

- `/\{locale\}/tools` includes the service introduction, searchable directory, recent tools, featured recommendations, category descriptions and cards, full tool list, and browser-processing/privacy summary.
- Category IDs and related-tool IDs are checked against the registry for all 15 locales. Sidebar and search results are generated from the same public registry; tool cards and related links use those registered slugs. No `href="#"`, `javascript:` or empty placeholder links were found. Privacy, terms, and category routes exist.
- With `NEXT_PUBLIC_ADS_ENABLED` disabled, ad rails are conditionally omitted from the tree; placeholder rendering also requires ads to be enabled. Existing tests cover this behavior.
- The sitemap is generated from public registry entries: **2,640 tool detail entries**, one per public tool and supported locale. All entries have 15 locale alternates plus `x-default`; sitemap generation excludes private registry entries. Canonical and hreflang behavior remains on the shared SEO helpers.
- Automated structural noindex candidates: **0**. The high-similarity country-format pairs should be reviewed as local regulatory rules evolve, but their distinct formats are useful and should not be hidden solely because their descriptions share a translated task pattern.

## Automated check

Run `pnpm check:content-quality`. It checks locale completeness and fallback, blank/raw-key copy, examples, FAQ and how-to duplicates, repeated generic step patterns, file guidance and limits, privacy notices for local storage, related/category links, placeholder links, browser-processing network APIs, ads-disabled rail/placeholder conditions, tools-home sections, privacy/terms routes, and public sitemap URLs and alternates. `pnpm test` also runs the content-quality check.
