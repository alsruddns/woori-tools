import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { localizeTool } from "../src/registry/tool-translations";
import { registeredTools } from "../src/registry/tools";

async function main() {
const policyPatterns = [
  /validator/, /iban/, /postcode|postal-code|zip-code|cep-/, /phone-number-formatter/, /date-format-converter/,
  /japan-(loto|mini)/, /numbers[34]-number-generator/, /bingo5-number-generator/, /yakudoshi/, /japanese-zodiac/, /wareki-converter/,
  /^saju$/, /chinese-(zodiac|sexagenary|number|phone)/, /rmb-uppercase/, /indian-number/, /lakh-crore/,
];
const needsPolicyReview = (slug: string) => policyPatterns.some((pattern) => pattern.test(slug));
const status = (isPublic: boolean) => isPublic ? "open" : "close - 공개 비활성화 (registry에서 isPublic=false; 별도 사유는 source에 기록되지 않음)";
const rows = registeredTools.map((tool, index) => {
  const localized = localizeTool(tool, "ko");
  const supported = tool.supportedLocales.join(",");
  return `| ${index + 1} | ${localized.title.replaceAll("|", "／")} | ${status(tool.isPublic)} | ${needsPolicyReview(tool.slug)} | ${supported} | ${tool.slug} |`;
});
const openCount = registeredTools.filter(({ isPublic }) => isPublic).length;
const closeCount = registeredTools.length - openCount;
const policyCount = registeredTools.filter(({ slug }) => needsPolicyReview(slug)).length;
const document = `# Woori Tools 서비스 카탈로그

실제 URL: https://www.woori.today/{locale}/tools/{slug}

registry와 번역 source를 기준으로 생성한 전체 Tool 목록입니다. open은 공개 registry에 등록된 Tool, close는 registry에 등록됐지만 공개 비활성화된 Tool입니다. 다국어 열에는 각 Tool의 supportedLocales 값을 그대로 기록합니다.

- 전체 등록 Tool: ${registeredTools.length}
- 공개 Tool: ${openCount}
- 비공개 Tool: ${closeCount}
- 정책 확인 필요: ${policyCount}
- 생성 기준: src/registry/tools.ts, src/registry/tool-translations.ts, locale routing registry

## 전체 Tool

| 순서 | 서비스명 | 서비스현황 및 사유 | 정책확인필요 | 다국어 적용 현황 | 경로 |
|---:|---|---|:---:|---|---|
${rows.join("\n")}

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
`;

await mkdir(resolve(process.cwd(), "docs"), { recursive: true });
await writeFile(resolve(process.cwd(), "docs/service-catalog.md"), document, "utf8");
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
