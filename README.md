# Woori Tools

A collection of free online tools from woori.today. Public pages use locale-prefixed URLs. File processing runs in the browser whenever possible; user files are not uploaded to the service server.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4
- pnpm
- pdf-lib, heic2any, yaml, papaparse (loaded only where needed)

## Development and build

```sh
pnpm install
pnpm dev       # http://localhost:3002/ko/tools
pnpm lint
pnpm build
pnpm start     # port 3002
```

## Ads

Ad slots are disabled by default. Set `NEXT_PUBLIC_ADS_ENABLED=true` to enable the desktop ad rails on tool detail pages. The current code does not load an AdSense script or publish ads. For layout checks only, set `NEXT_PUBLIC_SHOW_AD_PLACEHOLDER=true` as well to show placeholder boxes.

To connect AdSense later: obtain AdSense approval, add its script and publisher ID, configure the left and right slot IDs, enable `NEXT_PUBLIC_ADS_ENABLED`, then verify production build, layout shift, mobile behavior, and `ads.txt`.

## Analytics

Set `NEXT_PUBLIC_GA_ID=G-ZJSJW06SCX` in the build/deployment environment to enable Google Analytics 4 on all locale pages. The shared locale layout loads the tag once and tracks App Router path changes. If the variable is unset, no GA scripts are rendered.

## Docker

```sh
docker build -t woori-tools .
docker run --rm -p 3002:3002 woori-tools
```

The standalone container runs as the non-root `nextjs` user on port 3002. Nginx must forward public site routes and Next.js static asset requests to the container. The Docker health check uses `/robots.txt`.

## URL structure

- Tool home: `/{locale}/tools` (for example, `/ko/tools`)
- Tool page: `/{locale}/tools/{slug}`
- Category: `/{locale}/tools/category/{category}`
- Policies: `/{locale}/privacy` and `/{locale}/terms`
- Supported locales: `ko`, `en`, `ja`, and `zh`; default locale: `ko`
- Legacy `/tools/*` URLs permanently redirect to the matching `/ko/tools/*` URL.
- Tool slugs stay the same in every locale. Browser language detection is not used.

The project does not use calculator or money-book URL namespaces.

## Main source structure

```text
src/app/[locale]/        Locale-prefixed App Router pages
src/i18n/                Locale definitions and shared dictionaries
src/components/          Shared layout, search, and tool UI
src/features/            Tool UI boundaries
src/lib/                 Reusable processing and SEO logic
src/registry/            Tool, category, and translation source of truth
src/workers/             CPU-heavy processing boundaries
```

## Tool registry and translations

`src/registry/tools.ts` is the source of truth for tool slugs, categories, and processing configuration. Localized titles and descriptions live in the translation registry; shared interface and policy text lives in `src/i18n`. Keep processing logic shared across locales.

When adding a public tool:

1. Register the tool in the central tool registry.
2. Add translations for `ko`, `en`, `ja`, and `zh`.
3. Review localized SEO metadata and visible page content.
4. Confirm automatic sitemap inclusion, canonical, hreflang, and x-default.
5. Confirm the language selector preserves the current page meaning.
6. Run `pnpm lint` and `pnpm build`.

Do not duplicate locale strings in components. Tool slugs are never translated.

## Privacy

Files are processed in browser memory and are not sent to the server, analytics, or external APIs. File names, contents, EXIF/GPS information, and generated results are not collected. Object URLs and large temporary resources should be released after use.

## Deployment

The public domain is `https://www.woori.today`. Next.js generates the sitemap and robots file. A push to `main` triggers the production deployment workflow; pushes to `develop` do not. Production Compose configuration is maintained at `/opt/services/compose`.

YouTube download and YouTube URL-to-MP3 features are prohibited.
