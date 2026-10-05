# Woori Tools Development Rules

## Project

- Project name: woori-tools
- Public URL namespace: /tools
- Production domain: https://www.woori.today
- All tool pages must live under /tools.
- Do not use /calculators.
- Do not use /calculator or /calc.
- Do not use money-book related URL namespaces.

## Architecture

- Next.js App Router
- TypeScript
- pnpm
- Tailwind CSS
- Client-side processing first
- Do not create a backend unless explicitly requested.
- Do not create a database unless explicitly requested.
- Do not upload user files to a server unless explicitly requested.
- Never add a Spring Boot service, Node API server, file conversion API route, database, Redis, accounts, authentication, server file storage, or S3 upload without an explicit request.
- Never implement YouTube download or YouTube URL to MP3 features.

## File Processing

Prefer browser-side technologies:

- File API
- Blob / Object URL
- Canvas API
- Web Workers
- WebAssembly
- Web Crypto API

User files should remain on the user's device whenever technically possible.

Release Object URLs and large in-memory resources after processing.

Do not send uploaded file contents, filenames, EXIF/GPS metadata, or generated files to a server or analytics unless explicitly required.

## Routes

Every tool must have one unique URL.

Examples:

- /tools/jpg-to-png
- /tools/image-compress
- /tools/pdf-merge
- /tools/json-formatter

URL slugs:

- lowercase
- English
- kebab-case
- unique

All tools must be registered in the central tool registry.

Do not duplicate tool metadata across pages and components.

## Tool Architecture

Keep processing logic separate from React UI.

Recommended separation:

- features: tool-specific UI and orchestration
- lib: reusable processing logic
- workers: CPU-heavy browser processing
- registry: tool/category definitions
- components: reusable UI components
- seo: shared SEO logic

Do not place large conversion algorithms directly inside page.tsx.

Use these boundaries:

- `features`: tool-specific UI and orchestration
- `lib`: reusable file, image, and PDF processing logic
- `workers`: CPU-heavy browser processing
- `registry`: tool and category definitions
- `components`: shared UI components
- `seo`: shared SEO logic

## SEO

One tool = one indexable SEO page.

Each tool should eventually provide:

- unique title
- unique description
- canonical URL
- H1
- tool description
- usage instructions
- FAQ where appropriate
- related tools
- search keywords

Keep each tool's metadata in the central registry rather than duplicating it across pages and components.

The central registry is the source of truth for slugs, categories, titles, descriptions, keywords, routes, related tools, and sitemap entries.

## Privacy

Do not collect or transmit:

- uploaded file contents
- uploaded filenames
- EXIF information
- generated files

unless explicitly required by a future feature.

Do not include file names, contents, EXIF/GPS information, or result data in analytics events.

## UI

- Mobile responsive design is mandatory.
- Tool UI must work well on desktop and mobile.
- Ads must not be placed between a primary input and its action button.
- Processing status and errors must be clearly displayed.
- File tools should support a file picker and drag and drop, with touch-friendly controls.
- Keep file sizes and decoded image dimensions within safe browser limits and explain limits clearly.
- Preserve the original file and create a separate result for download.
- Revoke Object URLs and release large resources when finished or on component unmount.

## SEO and Routes

- One tool has one indexable URL: `/tools/{slug}`.
- Use registry metadata for unique titles, descriptions, canonical URLs, sitemap entries, and related tools.
- Do not create empty indexable category pages.
- Structured data must describe visible, real page content.

## Dependencies and Browser APIs

- Prefer maintained, focused libraries and dynamically load heavy tool-specific dependencies where practical.
- Keep browser-only APIs inside client components or browser event handlers.
- Do not make the `/tools` home page load processing libraries for every tool.

## Prohibited Features

- Do not add YouTube downloaders or YouTube URL-to-MP3 conversion.
- Do not send user files to external services.

## Git

Commit after completing a meaningful work unit.

Commit prefixes:

- Add:
- Update:
- Refactor:
- Fix:

Do not modify unrelated features during a focused task.
