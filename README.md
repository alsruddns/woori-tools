# Woori Tools

`woori.today`의 무료 온라인 도구 모음입니다. 모든 도구는 `/tools` 아래에 있으며 가능한 파일 처리는 브라우저에서 수행합니다. 사용자 파일을 서버로 전송하는 기능은 없습니다.

## 기술 스택

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4
- pnpm
- pdf-lib, heic2any, yaml, papaparse (기능 진입 시 필요한 라이브러리만 동적 로드)

## 개발 및 빌드

```bash
pnpm install
pnpm dev       # http://localhost:3002/tools
pnpm lint
pnpm build
pnpm start     # port 3002
```

## Docker

```bash
docker build -t woori-tools .
docker run --rm -p 3002:3002 woori-tools
```

이미지는 standalone output을 사용하고 컨테이너는 non-root `nextjs` 사용자로 3002 포트에서 실행됩니다. Next.js `basePath`는 `/tools`이며, Nginx는 `/tools` 요청과 Next.js static asset 요청을 컨테이너에 전달해야 합니다. Docker health check는 `/tools/robots.txt`를 확인합니다.

## URL 및 구조

- 도구 홈: `/tools`
- 도구: `/tools/{slug}`
- 카테고리: `/tools/category/{category}`
- 정책: `/privacy`, `/terms`
- 기존 계산기 `/calculators`, `/calculator`, `/calc`와 가계부 URL prefix를 사용하지 않습니다.

주요 구조:

```text
src/app/                 App Router pages, sitemap, robots
src/components/          공통 레이아웃, 검색, 작업 UI
src/features/            도구별 UI 경계
src/lib/                 재사용 처리 로직 경계
src/registry/             도구 및 카테고리 source of truth
src/workers/              향후 CPU heavy 작업
src/seo/                  SEO 공통 로직 경계
```

## Tool Registry

`src/registry/tools.ts`가 slug, category, title, description, keywords, 허용 파일 형식과 관련 도구의 source of truth입니다. 중복 slug 및 lowercase kebab-case를 모듈 로딩 시 검사합니다. `src/registry/categories.ts`에서 카테고리를 관리합니다. 등록된 도구의 동적 페이지는 정적 생성 파라미터를 사용하며 metadata, canonical, sitemap도 registry를 기반으로 만듭니다.

## 새 도구 추가

1. `src/registry/tools.ts`에 고유한 영문 lowercase kebab-case slug와 고유 설명, 검색어, 카테고리, 파일 형식을 등록합니다.
2. 도구 UI와 진행 상태는 해당 `src/features/{category}` 아래에 구성하고 공통 파일 입력 UI를 재사용합니다.
3. 재사용 처리 코드는 `src/lib/{type}`에 두고, 무거운 작업은 브라우저에서 동적 로드하거나 worker로 분리합니다.
4. `src/components/tool/tool-workspace.tsx`의 tool mapping/orchestration에 기능을 연결합니다. UI와 처리 코드를 한 페이지에 몰아넣지 않습니다.
5. 고유 title/description/keywords, 실제 화면 콘텐츠, 관련 도구, 파일 제한과 오류 메시지를 확인합니다. Registry 등록 시 canonical과 sitemap 항목은 자동 반영됩니다.
6. `pnpm lint`와 `pnpm build`를 실행하고 실제 브라우저에서 입력, 결과, 다운로드, 작은 화면 동작을 확인합니다.

## 개인정보 원칙

파일은 브라우저 메모리에서 처리하고 서버, analytics, 외부 API로 보내지 않습니다. 파일명·내용·EXIF/GPS와 결과를 수집하지 않습니다. Object URL은 사용이 끝나면 해제하며 대용량 처리는 파일 크기와 이미지 픽셀 제한으로 보호합니다.

## 운영 참고

서비스 공개 도메인은 `https://www.woori.today`입니다. 모든 앱 경로는 `/tools` basePath 아래 공개됩니다. sitemap과 robots는 Next.js metadata routes에서 생성됩니다. `main` 브랜치 push 시 GitHub Actions가 GHCR 이미지를 빌드하고 iwinv 서버의 Compose 서비스를 갱신합니다. 운영 Compose 설정은 `/opt/services/compose`에서 관리합니다.

## 향후 도구 후보

`hash-generator`, `jwt-decode`, `random-string-generator`, `password-generator`, `qr-code`, `wifi-qr`, `contact-qr`, `mime-type-checker`, `file-name-bulk-rename`, `pdf-to-jpg`, `pdf-to-png`, `background-remove`, `mp4-to-mp3`, `wav-to-mp3`, `m4a-to-mp3`, `video-to-gif`, `video-mute`, `video-trim`.

YouTube URL을 MP3로 바꾸거나 YouTube 동영상을 내려받는 기능은 제공하지 않습니다.
