# Woori Tools 서비스 카탈로그

실제 URL: https://www.woori.today/{locale}/tools/{slug}

registry와 번역 source를 기준으로 생성한 전체 Tool 목록입니다. open은 공개 registry에 등록된 Tool, close는 registry에 등록됐지만 공개 비활성화된 Tool입니다. 다국어 열에는 각 Tool의 supportedLocales 값을 그대로 기록합니다.

- 전체 등록 Tool: 177
- 공개 Tool: 176
- 비공개 Tool: 1
- 정책 확인 필요: 45
- 생성 기준: src/registry/tools.ts, src/registry/tool-translations.ts, locale routing registry

## 전체 Tool

| 순서 | 서비스명 | 서비스현황 및 사유 | 정책확인필요 | 다국어 적용 현황 | 경로 |
|---:|---|---|:---:|---|---|
| 1 | 로또 번호 추첨기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | lotto-number-generator |
| 2 | 파워볼 번호 추첨기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | powerball-number-generator |
| 3 | 메가밀리언 번호 추첨기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | mega-millions-number-generator |
| 4 | 일본 로또6 번호 추첨기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | japan-loto6-number-generator |
| 5 | 일본 로또7 번호 추첨기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | japan-loto7-number-generator |
| 6 | 일본 미니로또 번호 추첨기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | japan-mini-loto-number-generator |
| 7 | 타로카드 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | tarot-card |
| 8 | 오늘의 운세 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | daily-fortune |
| 9 | 사주팔자 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | saju |
| 10 | 랜덤 숫자 뽑기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | random-number |
| 11 | 랜덤 이름 뽑기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | random-name-picker |
| 12 | 룰렛 돌리기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | random-wheel |
| 13 | 사다리타기 | close - 공개 비활성화 (registry에서 isPublic=false; 별도 사유는 source에 기록되지 않음) | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi | ladder-game |
| 14 | 제비뽑기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | draw-lots |
| 15 | 랜덤 팀 나누기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | random-team-maker |
| 16 | 랜덤 순서 정하기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | random-order |
| 17 | 랜덤 자리 배치 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | random-seat |
| 18 | 당번 정하기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | duty-picker |
| 19 | 주사위 굴리기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | dice-roller |
| 20 | 동전 던지기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | coin-flip |
| 21 | 스톱워치 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | stopwatch |
| 22 | 온라인 타이머 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | timer |
| 23 | 뽀모도로 타이머 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | pomodoro-timer |
| 24 | 세계 시간 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | world-clock |
| 25 | 비밀번호 생성기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | password-generator |
| 26 | 랜덤 문자열 생성기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | random-string-generator |
| 27 | Wi-Fi QR 코드 생성기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | wifi-qr |
| 28 | 연락처 QR 코드 생성기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | contact-qr |
| 29 | 전화번호 QR 코드 생성기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | phone-qr |
| 30 | 이메일 QR 코드 생성기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | email-qr |
| 31 | 바코드 번호 검사 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | barcode-checker |
| 32 | 바코드 생성기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | barcode-generator |
| 33 | SNS 이미지 크기 변경 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | social-image-resize |
| 34 | 이미지에 텍스트 추가 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | add-text-to-image |
| 35 | Instagram 사진 격자 분할 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | instagram-grid-split |
| 36 | 사진 콜라주 만들기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | image-collage |
| 37 | 파일 해시 계산 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | file-hash |
| 38 | MIME 타입 확인 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | mime-type-checker |
| 39 | 파일 확장자 확인 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | file-extension-checker |
| 40 | 파일 크기 확인 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | file-size-checker |
| 41 | 중복 파일 찾기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | duplicate-file-checker |
| 42 | ZIP 파일 만들기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | zip-files |
| 43 | 파일명 일괄 변경 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | bulk-file-renamer |
| 44 | 파일명 정리 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | filename-cleaner |
| 45 | 텍스트 줄 섞기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | shuffle-lines |
| 46 | 줄 번호 붙이기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | add-line-numbers |
| 47 | 줄 번호 제거 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | remove-line-numbers |
| 48 | 빈 줄 제거 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | remove-empty-lines |
| 49 | 특정 문자 제거 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | remove-characters |
| 50 | 텍스트 반복 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | text-repeater |
| 51 | 텍스트 파일 만들기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | text-to-file |
| 52 | Lorem Ipsum 생성기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | lorem-ipsum |
| 53 | 정규식 테스트 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | regex-tester |
| 54 | HEX RGB 색상 변환 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | color-converter |
| 55 | Cron 표현식 해석기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | cron-parser |
| 56 | SQL 포맷터 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | sql-formatter |
| 57 | HTML 포맷터 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | html-formatter |
| 58 | CSS 포맷터 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | css-formatter |
| 59 | JavaScript 포맷터 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | javascript-formatter |
| 60 | Markdown 미리보기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | markdown-preview |
| 61 | JPG → PNG 변환 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | jpg-to-png |
| 62 | PNG → JPG 변환 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | png-to-jpg |
| 63 | WEBP → JPG 변환 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | webp-to-jpg |
| 64 | WEBP → PNG 변환 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | webp-to-png |
| 65 | JPG → WEBP 변환 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | jpg-to-webp |
| 66 | PNG → WEBP 변환 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | png-to-webp |
| 67 | HEIC → JPG 변환 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | heic-to-jpg |
| 68 | 이미지 압축 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | image-compress |
| 69 | 이미지 크기 조절 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | image-resize |
| 70 | 이미지 자르기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | image-crop |
| 71 | 이미지 회전 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | image-rotate |
| 72 | 이미지 뒤집기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | image-flip |
| 73 | 이미지 흑백 변환 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | image-grayscale |
| 74 | 이미지 밝기 조절 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | image-brightness |
| 75 | 이미지 대비 조절 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | image-contrast |
| 76 | 이미지 흐리게 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | image-blur |
| 77 | 이미지 모자이크 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | image-pixelate |
| 78 | 이미지 메타데이터 제거 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | remove-image-metadata |
| 79 | 이미지 정보 확인 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | image-info |
| 80 | Favicon 생성기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | favicon-generator |
| 81 | 이미지 색상 추출 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | image-color-picker |
| 82 | 이미지 PDF 변환 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | images-to-pdf |
| 83 | PDF 합치기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | pdf-merge |
| 84 | PDF 페이지 추출 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | pdf-split |
| 85 | PDF 페이지 삭제 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | pdf-delete-pages |
| 86 | PDF 페이지 순서 변경 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | pdf-reorder-pages |
| 87 | PDF 페이지 회전 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | pdf-rotate-pages |
| 88 | PDF 페이지 번호 추가 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | pdf-add-page-numbers |
| 89 | PDF 워터마크 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | pdf-watermark |
| 90 | PDF 메타데이터 확인 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | pdf-metadata-viewer |
| 91 | PDF 메타데이터 제거 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | pdf-remove-metadata |
| 92 | 글자 수 세기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | character-count |
| 93 | 공백 제거 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | remove-spaces |
| 94 | 줄바꿈 제거 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | remove-line-breaks |
| 95 | 중복 줄 제거 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | remove-duplicate-lines |
| 96 | 줄 정렬 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | sort-lines |
| 97 | 대소문자 변환 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | text-case-converter |
| 98 | 텍스트 비교 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | text-compare |
| 99 | 텍스트 뒤집기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | reverse-text |
| 100 | 중복 단어 제거 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | remove-duplicate-words |
| 101 | JSON Formatter | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | json-formatter |
| 102 | JSON Validator | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | json-validator |
| 103 | JSON → YAML | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | json-to-yaml |
| 104 | YAML → JSON | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | yaml-to-json |
| 105 | CSV → JSON | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | csv-to-json |
| 106 | JSON → CSV | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | json-to-csv |
| 107 | Base64 인코더·디코더 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | base64 |
| 108 | URL 인코더·디코더 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | url-encode-decode |
| 109 | UUID 생성기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | uuid-generator |
| 110 | Timestamp 변환기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | timestamp-converter |
| 111 | 일본 연호·서기 변환기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | wareki-converter |
| 112 | 히라가나·가타카나 변환기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | hiragana-katakana-converter |
| 113 | 전각·반각 변환기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | fullwidth-halfwidth-converter |
| 114 | 일본어 로마자 변환기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | japanese-romaji-converter |
| 115 | 일본 숫자·한자 숫자 변환기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | japanese-number-kanji-converter |
| 116 | 일본 액년 계산기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | yakudoshi-calculator |
| 117 | 일본 간지 계산기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | japanese-zodiac-calculator |
| 118 | 일본 넘버즈3 번호 생성기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | numbers3-number-generator |
| 119 | 일본 넘버즈4 번호 생성기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | numbers4-number-generator |
| 120 | 일본 빙고5 번호 생성기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | bingo5-number-generator |
| 121 | JWT 디코더 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | jwt-decoder |
| 122 | URL 쿼리 파라미터 분석기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | url-query-parameter-parser |
| 123 | User-Agent 분석기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | user-agent-parser |
| 124 | IPv4 CIDR 계산기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | ip-cidr-calculator |
| 125 | Base32 인코더·디코더 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | base32-encoder-decoder |
| 126 | ULID 생성기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | ulid-generator |
| 127 | UUID v7 생성기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | uuid-v7-generator |
| 128 | 해시 비교기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | hash-compare |
| 129 | 정규식 치환 도구 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | regex-replace |
| 130 | HTML 엔티티 인코더·디코더 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | html-entity-encoder-decoder |
| 131 | Linux 권한 계산기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | chmod-calculator |
| 132 | JSONPath 테스트 도구 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | json-path-tester |
| 133 | CSV·TSV 변환기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | csv-tsv-converter |
| 134 | URL 슬러그 생성기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | url-slug-generator |
| 135 | 유니코드 코드 포인트 확인기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | unicode-code-point-checker |
| 136 | PDF 페이지 크기 확인기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl,fil,bn,uk,ms,sv,cs,ro,el | pdf-page-size-checker |
| 137 | 중국·대만 간체·번체 중국어 변환기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | simplified-traditional-chinese-converter |
| 138 | 중국·대만 중국어 숫자 변환기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | chinese-number-kanji-converter |
| 139 | 중국·대만 인민폐 대문자 금액 위안화 대문자 변환기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | rmb-uppercase-converter |
| 140 | 중국·대만 띠 계산기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | chinese-zodiac-calculator |
| 141 | 중국·대만 천간지지 간지 계산기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | chinese-sexagenary-cycle-calculator |
| 142 | 중국·대만 전화번호 형식 변환기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | chinese-phone-number-formatter |
| 143 | 대만 대만 전화번호 전화번호 형식 변환기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | taiwan-phone-number-formatter |
| 144 | 인도 인도 숫자 자릿수 인도식 숫자 변환기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | indian-number-format-converter |
| 145 | 인도 라크·크로르 인도식 숫자 변환기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | lakh-crore-converter |
| 146 | 인도 PAN 형식 검증기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | pan-format-validator |
| 147 | 인도 GSTIN 형식 검증기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | gstin-format-validator |
| 148 | 인도 인도 전화번호 전화번호 형식 변환기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | india-phone-number-formatter |
| 149 | 독일 독일 IBAN 형식 검증기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | germany-iban-validator |
| 150 | 독일 숫자 형식 변환기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | german-number-format-converter |
| 151 | 독일 날짜 형식 변환기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | german-date-format-converter |
| 152 | 스페인 DNI 형식 검증기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | spain-dni-validator |
| 153 | 스페인 NIE 형식 검증기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | spain-nie-validator |
| 154 | 스페인 숫자 형식 변환기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | spanish-number-format-converter |
| 155 | 스페인 스페인 날짜 날짜 형식 변환기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | spanish-date-format-converter |
| 156 | 프랑스 전화번호 형식 변환기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | france-phone-number-formatter |
| 157 | 프랑스 숫자 형식 변환기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | french-number-format-converter |
| 158 | 프랑스 날짜 형식 변환기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | french-date-format-converter |
| 159 | 브라질 CPF 형식 검증기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | brazil-cpf-validator |
| 160 | 브라질 CNPJ 형식 검증기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | brazil-cnpj-validator |
| 161 | 브라질 전화번호 형식 변환기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | brazil-phone-number-formatter |
| 162 | 브라질 브라질 CEP 우편번호 우편번호 형식 도구 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | brazil-cep-formatter |
| 163 | 네덜란드 네덜란드 IBAN 형식 검증기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | netherlands-iban-validator |
| 164 | 네덜란드 숫자 형식 변환기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | dutch-number-format-converter |
| 165 | 네덜란드 네덜란드 날짜 날짜 형식 변환기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | dutch-date-format-converter |
| 166 | 베트남 전화번호 형식 변환기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | vietnam-phone-number-formatter |
| 167 | 베트남 숫자 형식 변환기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | vietnam-number-format-converter |
| 168 | 이탈리아 Codice Fiscale 형식 검증기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | italy-fiscal-code-format-validator |
| 169 | 이탈리아 이탈리아 Partita IVA 형식 검증기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | italy-vat-number-validator |
| 170 | 이탈리아 숫자 형식 변환기 | open | false | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | italy-number-format-converter |
| 171 | 이탈리아 이탈리아 날짜 날짜 형식 변환기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | italian-date-format-converter |
| 172 | 미국 미국 전화번호 전화번호 형식 변환기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | us-phone-number-formatter |
| 173 | 미국 ZIP 코드 우편번호 형식 도구 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | us-zip-code-formatter |
| 174 | 캐나다 캐나다 우편번호 우편번호 형식 도구 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | canada-postal-code-formatter |
| 175 | 영국 영국 우편번호 우편번호 형식 도구 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | uk-postcode-formatter |
| 176 | 호주 호주 우편번호 우편번호 형식 도구 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | australia-postcode-formatter |
| 177 | 미국·영국 미국·영국 날짜 형식 날짜 형식 변환기 | open | true | ko,en,ja,zh,es,pt-br,de,fr,vi,id,th,zh-tw,it,nl,hi,ru,tr,pl | english-date-format-converter |

## 중복 후보 검토

아래 후보는 기존 기능에 포함하거나 의미가 실질적으로 겹쳐 별도 Tool로 만들지 않았습니다.

| 후보 | 판단 |
|---|---|
| jwt-expiry-checker | 만료 claim 확인을 JWT Decoder의 기능으로 포함 |
| ipv4-subnet-calculator, ipv4-to-binary-converter | CIDR 계산기에 주소 범위와 이진 주소 표시를 포함 |
| unix-permission-converter | Chmod Calculator와 같은 권한 변환 기능 |
| cron-next-run-calculator | 기존 Cron Parser가 다음 실행 시간을 이미 표시 |
| markdown-to-html | 기존 Markdown Preview가 안전하게 HTML 렌더링 |
| image-canvas-resize | 기존 Image Resizer가 브라우저 Canvas로 크기 변경 |
| json-pointer-tester | JSONPath Tester와 JSON 문서 경로 질의 기능이 겹쳐 별도 도구에서 제외 |
| csv-to-tsv, tsv-to-csv | 양방향 CSV·TSV Converter 하나로 통합 |

QR/barcode reader, XLSX conversion, image background removal, DPI editing, PDF rendering은 현재 dependency/browser 지원 검토 없이 공개하지 않았습니다. 기존 JSON formatter, regex tester, Base64, UUID, Cron, QR/barcode 생성, image resize/compress, PDF merge/split, hash, MIME, text, random, country validators는 기존 registry에 있어 중복 추가하지 않았습니다.
