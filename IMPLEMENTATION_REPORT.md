# Implementation Report

## Architecture

Next.js App Router on port 3002, standalone output, dynamic `/tools/[slug]` pages generated from a central registry, shared category pages, responsive shared layout, and browser-first file processing. React orchestration is in `components/tool`; image, PDF, and text processors live separately in `lib`. No backend, database, login, or upload endpoint is included.

## Implemented Tools

| Status | Tools |
|---|---|
| DONE | jpg-to-png, png-to-jpg, webp-to-jpg, webp-to-png, jpg-to-webp, png-to-webp, heic-to-jpg, image-compress, image-resize, image-crop, image-rotate, image-flip, image-grayscale, image-brightness, image-contrast, image-blur, image-pixelate, remove-image-metadata, image-info, favicon-generator, image-color-picker, images-to-pdf |
| DONE | pdf-merge, pdf-split, pdf-delete-pages, pdf-reorder-pages, pdf-rotate-pages, pdf-add-page-numbers, pdf-watermark, pdf-metadata-viewer, pdf-remove-metadata |
| DONE | character-count, remove-spaces, remove-line-breaks, remove-duplicate-lines, sort-lines, text-case-converter, text-compare, reverse-text, remove-duplicate-words |
| DONE | json-formatter, json-validator, json-to-yaml, yaml-to-json, csv-to-json, json-to-csv, base64, url-encode-decode, uuid-generator, timestamp-converter |
| DEFERRED | QR · 생활 tools (category exists; no empty category URL is generated) |

The 50 listed tools are registered and wired to browser-side operations. Image crop uses a centered crop with selectable aspect ratio. Favicon Generator creates a 32×32 PNG, not an ICO bundle. PDF processing is limited by browser resources and the 50 MB total input cap. PDF page ordering accepts a complete comma- or space-separated page sequence.

## Tool Routes

Registry builds `/tools/{slug}` pages and sitemap entries. Category routes are generated only for categories with tools. Unknown slugs/categories return 404. Home `/` redirects to `/tools`. Privacy and Terms routes are `/privacy` and `/terms`.

## Dependencies Added

- `pdf-lib` for browser-side PDF edits and assembly
- `heic2any` for browser-side HEIC conversion
- `yaml` for JSON/YAML conversion
- `papaparse` and `@types/papaparse` for CSV conversion

HEIC, PDF, YAML, and CSV libraries are loaded only when their tools are run. The main tool directory does not load them.

## Privacy Design

No API route or backend was added. Files are handled in the browser; image inputs are capped at 30 MB and 40 megapixels, PDF inputs at 50 MB total. Object URLs are revoked on replacement/unmount. Results are separate downloadable blobs; source files are not changed.

## SEO

Tool and category pages have generated metadata and canonical URLs. Sitemap and robots metadata routes are included. Tool pages have visible FAQ content and WebApplication structured data. Metadata is sourced from the central registry.

## Responsive Design

Tailwind responsive layouts, keyboard-operable links/buttons/inputs, focus styles, drag-and-drop plus file picker, and touch-friendly controls are included. A dedicated multi-device browser review was not performed in this automated environment.

## Docker

Multi-stage standalone Dockerfile with Node 20 Alpine, pnpm frozen install, non-root runtime, and port 3002. `.dockerignore` included. Docker image build was not run because Docker CLI is unavailable in this environment.

## Build Result

`pnpm build` succeeded after fixes. Next.js generated the 50 tool pages, four non-empty category pages, privacy/terms, robots, and sitemap routes as static output.

## Lint Result

`pnpm lint` succeeded with no warnings.

## Known Limitations

- HEIC support depends on browser and codec support available to the client conversion library.
- PDF operations may fail for encrypted, malformed, or unusually large documents; errors appear in the page.
- Progress is represented by an active state rather than a byte-level progress bar.
- Production standalone runtime was smoke-checked on port 3002. `next start` prints a warning in standalone mode; use the generated standalone `server.js` in production.

## Deferred Features

hash-generator, jwt-decode, random-string-generator, password-generator, qr-code, wifi-qr, contact-qr, mime-type-checker, file-name-bulk-rename, pdf-to-jpg, pdf-to-png, background-remove, mp4-to-mp3, wav-to-mp3, m4a-to-mp3, video-to-gif, video-mute, video-trim. YouTube download and YouTube URL to MP3 are intentionally excluded.

## Git Commits

Work is on `develop`; no main merge or production deployment is planned.

## Next Recommended Work

Run browser-based smoke checks for representative image/PDF/text/developer flows, validate 320 px and desktop widths, build the Docker image once Docker is available, and check Nginx path forwarding in the deployment environment.
