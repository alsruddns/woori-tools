# woori-tools 공통 규칙

## 프로젝트 기본 정보

- 프로젝트명: `woori-tools`
- 서비스명: 온라인 도구
- 운영 도메인: <https://www.woori.today>
- 서비스 기본 경로: `/{locale}/tools`
- Docker 서비스명: `tools`
- 내부 포트: `3002`
- GHCR 이미지: `ghcr.io/alsruddns/woori-tools:latest`

## 기술 스택

- Next.js App Router
- TypeScript
- Tailwind CSS
- pnpm
- Node.js 내장 테스트 러너 (`node --test`)
- 프런트엔드 전용 처리와 브라우저 처리를 우선한다.

`package.json`의 `pnpm test`는 `node --test`를 실행한다. 테스트 러너는 Node.js 내장 테스트 러너다.

## 브랜치

- `main`: 운영
- `develop`: 개발 통합 및 integration
- 일반 작업은 `develop`을 기준으로 한다.
- 저장소에 `release` 브랜치는 현재 없다. 존재한다고 전제하지 않는다.
- 장기 `feature/dev` 및 백업 브랜치는 현재 남아 있으며, 정리는 별도 작업으로 한다.

실제 저장소에서 확인한 브랜치 구조와 위 운영 모델이 다르면 현재 저장소를 임의로 변경하지 말고 차이를 작업 결과에 보고한다.

## 커밋 규칙

형식:

```text
Type : [Scope] Description
```

예:

```text
Add : [docs] Add shared project guidelines
Update : [nginx] Add production reference configuration
```

## Locale

지원 locale:

`ko`, `en`, `ja`, `zh`, `es`, `pt-br`, `de`, `fr`, `vi`, `id`, `th`, `zh-tw`, `it`, `nl`, `hi`

hreflang 표기는 `pt-br` URL에 `pt-BR`, `zh-tw` URL에 `zh-TW`를 사용한다. 브라우저 언어를 자동 감지해 방문 locale을 강제로 변경하지 않는다.

## 서비스 URL

- Tool 목록: `/{locale}/tools`
- Tool 상세: `/{locale}/tools/{slug}`
- 기본 한국어 경로: `/tools` → `/ko/tools`
- 기본 한국어 legacy 경로: `/tools/{slug}` → `/ko/tools/{slug}`

Tool slug는 locale에 따라 번역하지 않는다.

## Sidebar scroll

route 이동 후 sidebar의 scroll 위치를 보존한다. desktop과 mobile drawer는 scroll container가 다르므로 sessionStorage key도 각각 `woori-tools:sidebar-scroll:desktop`, `woori-tools:sidebar-scroll:mobile`로 분리한다. `main` 콘텐츠 scroll은 별도로 관리한다.

## SEO

- 페이지별 canonical URL을 제공한다.
- 지원 locale 15개의 hreflang과 `x-default`를 제공한다.
- sitemap과 robots 정책을 관리한다.
- 실제 페이지 내용에 맞는 JSON-LD를 필요한 페이지에 적용한다.
- 공개 서비스만 sitemap에 포함한다.
- 공개 상태는 registry와 `docs/service-catalog.md`가 일치해야 한다.
- Tools sitemap 외부 URL: <https://www.woori.today/tools-sitemap.xml>
- 애플리케이션 내부 sitemap: <http://tools:3002/sitemap.xml>

## Service catalog

`docs/service-catalog.md`를 서비스 목록의 기준 문서로 사용한다. Tool을 추가·삭제하거나 공개 상태를 바꾸면 반드시 함께 갱신한다. 현재 catalog의 컬럼 및 상태 표기 형식을 유지하고 임의로 형식을 바꾸지 않는다. `pnpm check:service-catalog`로 registry와 catalog 정합성을 확인한다.

## Frontend-only 정책

- 가능한 파일 처리는 브라우저에서 수행한다.
- 개인정보 수집과 업로드를 최소화하고 입력값·파일을 API, analytics, logs 또는 query string으로 보내지 않는다.
- 꼭 필요한 경우가 아니면 백엔드를 추가하지 않는다.
- `localStorage`와 IndexedDB는 실제 필요성이 있는 경우에만 사용한다.

## 광고

- 광고 승인 및 활성화 전에는 광고 영역을 렌더링하지 않는다.
- 광고가 비활성화된 상태에서 빈 placeholder, 높이 또는 여백을 남기지 않는다.
- `NEXT_PUBLIC_ADS_ENABLED` 정책을 유지한다.

## 배포

`main` push 시 GitHub Actions가 다음 순서로 배포한다.

1. Docker image build
2. GHCR push
3. 서버 SSH 접속
4. `docker compose pull tools`
5. `docker compose up -d tools`

운영 서버에서 git clone 또는 애플리케이션 build를 수행하는 구조가 아니다. 실제 Docker Compose 서비스는 다음과 같다.

```yaml
tools:
  image: ghcr.io/alsruddns/woori-tools:latest
  container_name: tools
  restart: unless-stopped
```

## Nginx

운영 Nginx 설정의 단일 source of truth는 서버의 `/opt/services/nginx/conf.d/default.conf`다. 저장소의 `nginx/woori-tools.conf`는 운영 참고용이며 자동 배포되거나 자동 적용되지 않는다. 운영 설정을 바꿀 때는 서버의 실제 설정을 기준으로 별도 검토한다.
