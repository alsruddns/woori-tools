# woori-tools UI Guidelines

## Header

- woori.today 로고는 현재 locale의 포탈 `/{locale}`로 이동한다.
- Family Sites selector와 locale selector를 제공한다.
- 두 selector의 높이와 수직 정렬을 통일한다.

## Family Sites

항목 순서는 다음과 같이 유지한다.

1. 포탈
2. 계산기
3. 온라인 도구
4. 무료 공유 가계부
5. 문서·양식
6. 퀴즈·테스트

서비스 간 이동 시 현재 locale을 유지한다.

| 서비스           | 경로                    |
| ---------------- | ----------------------- |
| 포탈             | `/{locale}`             |
| 계산기           | `/{locale}/calculators` |
| 온라인 도구      | `/{locale}/tools`       |
| 무료 공유 가계부 | `/{locale}/money`       |
| 문서·양식        | `/{locale}/docs`        |
| 퀴즈·테스트      | `/{locale}/quiz`        |

패밀리 사이트 링크는 새 탭을 열고 `target="_blank"`, `rel="noopener noreferrer"`를 지정한다. selector trigger에는 현재 선택 서비스명이 아니라 locale별 고정 문구(예: “패밀리 사이트”, “Family Sites”)를 표시한다.

## Sidebar

- desktop에서는 좌측 sidebar, mobile에서는 drawer/sheet를 사용한다.
- 카테고리와 모든 공개 Tool에 접근할 수 있어야 한다.
- route 이동 후 sidebar scroll 위치를 유지한다.
- 가능하면 layout 내 sidebar를 유지해 remount를 피한다. 저장·복원이 필요한 경우 sessionStorage를 fallback으로 사용한다.
- Tools fallback key: `woori-tools:sidebar-scroll`
- main content scroll과 sidebar scroll은 독립적으로 관리한다.

## Buttons

- 텍스트 버튼의 빈 라벨을 허용하지 않는다.
- locale별 번역 누락을 허용하지 않는다.
- icon-only 버튼에는 `aria-label`을 제공한다.
- 클릭, 복사 등 사용자 액션에 시각적 피드백을 제공한다.
- 복사가 성공하면 toast를 표시한다.

## Form

- 입력 label을 명확히 표시한다.
- validation message와 disabled/loading 상태를 알 수 있게 표현한다.
- 키보드로 모든 조작을 수행할 수 있어야 한다.
- mobile touch target 크기를 확보한다.

## Result

- 값과 단위를 구분한다.
- Copy 버튼에 완료 피드백을 제공한다.
- 긴 결과 문자열과 표는 overflow를 처리한다.

## Toast

- 성공, 오류, 복사 완료 등 사용자에게 즉시 알려야 하는 결과에 사용한다.
- 같은 상태를 반복해서 알리는 등 과도한 toast를 피한다.

## 광고

`NEXT_PUBLIC_ADS_ENABLED=false`이면 광고 컴포넌트를 렌더링하지 않는다. 높이, 여백, 빈 placeholder도 남기지 않는다.

## Footer

공통 링크와 안내:

- 개인정보 안내
- 이용안내
- 문의 사항

문의 modal email: `krdd125@gmail.com`

문의 유형:

- 일반/기능
- 협업
- 광고/제안
- 버그 신고

## Responsive

mobile, tablet, desktop에서 레이아웃과 주요 동작을 확인한다.

## Accessibility

- semantic HTML을 사용한다.
- 입력과 label을 연결하고 icon-only 컨트롤에 `aria-label`을 제공한다.
- 키보드 조작, 명확한 focus 표시, 충분한 contrast를 지원한다.

## 현재 구현 점검 메모

다음은 문서화 시 저장소 코드에서 확인한 차이다. 문서 작성 작업 범위에서는 코드를 변경하지 않았다.

- Family Sites 구현에는 포탈, 계산기, 온라인 도구, 가계부 네 항목만 있다. 문서·양식과 퀴즈·테스트 항목은 아직 selector에 없다.
- sidebar scroll 저장 key는 요청 기준의 단일 key가 아니라 `woori-tools:sidebar-scroll:desktop` 및 `woori-tools:sidebar-scroll:mobile`로 구분되어 있다.
- `NEXT_PUBLIC_ADS_ENABLED`가 켜지고 `NEXT_PUBLIC_SHOW_AD_PLACEHOLDER=true`이면 광고 placeholder가 표시될 수 있다. 광고가 비활성화되면 광고 rail 자체를 렌더링하지 않는다.
