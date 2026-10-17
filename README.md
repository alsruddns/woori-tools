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
- Supported locales: `ko`, `en`, `ja`, `zh`, `es`, `pt-br`, `de`, `fr`, `vi`, `id`, `th`, `zh-tw`, `it`, `nl`, and `hi`; default locale: `ko`
- hreflang uses `pt-BR` for the `pt-br` route and `zh-TW` for the `zh-tw` route.
- Example URLs: `/ko/tools`, `/en/tools`, `/pt-br/tools`, and `/zh-tw/tools`.
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
2. Add translations for all supported locales: `ko`, `en`, `ja`, `zh`, `es`, `pt-br`, `de`, `fr`, `vi`, `id`, `th`, `zh-tw`, `it`, `nl`, and `hi`.
3. Review localized SEO metadata and visible page content.
4. Add a concrete input/output example in `src/registry/tool-example-inputs.ts` and review the visible usage, privacy, limit, and FAQ copy in every locale. Run `pnpm check:content-quality`.
5. Confirm automatic sitemap inclusion, canonical, hreflang, and x-default.
6. Confirm the language selector preserves the current page meaning.
7. Run `pnpm lint` and `pnpm build`.

The content audit and current limitations are recorded in [`docs/adsense-content-audit.md`](docs/adsense-content-audit.md).

## Service Catalog

현재 공개·비공개 Tool, locale 지원, 정책 확인 필요 여부는 [`docs/service-catalog.md`](docs/service-catalog.md)를 참고합니다. Tool을 추가·삭제하거나 공개 상태 또는 locale 지원을 바꾸면 카탈로그도 반드시 함께 갱신하고 `pnpm check:service-catalog`를 실행합니다. 카탈로그 생성 명령은 `pnpm catalog:generate`입니다.

Do not duplicate locale strings in components. Tool slugs are never translated.

## Privacy

Files are processed in browser memory and are not sent to the server, analytics, or external APIs. File names, contents, EXIF/GPS information, and generated results are not collected. Object URLs and large temporary resources should be released after use.

## Deployment

The public domain is `https://www.woori.today`. Next.js generates the sitemap and robots file. A push to `main` triggers the production deployment workflow; pushes to `develop` do not. Production Compose configuration is maintained at `/opt/services/compose`.

YouTube download and YouTube URL-to-MP3 features are prohibited.
