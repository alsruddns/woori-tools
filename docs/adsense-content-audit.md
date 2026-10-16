# Tool content and experience audit

This audit describes the public registry and the implementation reviewed on `develop`. It is an internal quality checklist, not a prediction of Google AdSense approval.

## Baseline

- Public tool pages: 176, across 15 route locales (2,640 detail URLs).
- Before this change, 99 tools had no tool-specific editorial content in `ko`, `en`, `ja`, or `zh`; their page used the generic fallback block. The other 11 locales used one common three-step guide across all 176 tools.
- The old FAQ reused the same privacy question and repeated the example/options text as questions. The tool home already had service introduction, category summaries, recommendations, and a searchable directory, but no recent-tool section.

## Implemented rules

- Every public tool now has a concrete input/output example. The 4 original locales keep existing hand-written guides where available. Other pages use their localized registry description and a tool-specific example as the first usage step.
- Detail pages require editorial content at build time. They display input/output guidance, file type and size limits where applicable, a browser-processing summary linked to the locale privacy page, a limitation, related tools, and two tool-named FAQ questions.
- The home page adds recently added tools and explains local processing and browser memory limits in all 15 locales.
- The automated content check requires all public slugs and locales, nonempty fields, distinct overviews and examples per locale, valid category and related-tool links, and file guidance for file-input tools. Run `pnpm check:content-quality`; the check also runs in `pnpm test`.
- Disabled ad rails remain outside the DOM when `NEXT_PUBLIC_ADS_ENABLED` is not `true`. Their placeholder setting cannot override this condition.

## Processing facts checked against source

- Tool processing code in `src/components/tool` and `src/lib/{image,pdf,text}` has no `fetch`, `XMLHttpRequest`, or `sendBeacon` call for raw tool input. Some settings and generated lottery history are stored locally with `localStorage`; the site does not promise that no browser storage is used.
- The shared file picker accepts image files (including HEIC/HEIF where browser support permits), PDF files, or arbitrary files according to the tool. Images are limited to 30 MB each. PDF workflows are limited to 50 MB total. Other file tools allow 100 MB per file, up to 100 files and 200 MB total. Collages add a 6-image/100 MB total limit. Images-to-PDF has a 50 MB total limit. PDF page-size checking has no explicit byte cap in its own picker; browser memory still limits it.
- Some file tools show information only; the page says to use Download **when** a result file is produced. JWT decoding does not verify a signature. Country format/checksum tools do not establish that a real person or official identifier exists.

## Follow-up editorial review

The automated check detects missing and repeated copy, but it cannot judge translation fluency, factual accuracy after an external rule changes, or whether a page is sufficiently useful to every visitor. The 11 added locales still share some second and third usage-step phrasing, although each page has a distinct first step, description, and example. Review high-traffic pages with native speakers and check country/lottery rules against current official sources when those rules change.
