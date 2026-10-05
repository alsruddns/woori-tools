import type { ToolCategory } from "./categories";

export type ToolDefinition = {
  id: string; slug: string; category: ToolCategory; title: string; shortTitle: string;
  description: string; keywords: string[]; clientOnly: true; acceptedTypes?: string[]; relatedTools?: string[];
};

const entries: Array<[string, ToolCategory, string, string, string[]]> = [
  ["jpg-to-png","image","JPG → PNG 변환","JPG 이미지를 PNG 형식으로 변환합니다.",["jpg","jpeg","png","convert"]],
  ["png-to-jpg","image","PNG → JPG 변환","PNG 이미지를 JPG로 변환합니다. 투명한 부분은 흰색으로 채웁니다.",["png","jpg","jpeg","convert"]],
  ["webp-to-jpg","image","WEBP → JPG 변환","WEBP 이미지를 JPG 파일로 변환합니다.",["webp","jpg","convert"]],
  ["webp-to-png","image","WEBP → PNG 변환","WEBP 이미지를 PNG 파일로 변환합니다.",["webp","png","convert"]],
  ["jpg-to-webp","image","JPG → WEBP 변환","JPG 이미지를 WEBP 형식으로 변환합니다.",["jpg","jpeg","webp","convert"]],
  ["png-to-webp","image","PNG → WEBP 변환","PNG 이미지를 WEBP 형식으로 변환합니다.",["png","webp","convert"]],
  ["heic-to-jpg","image","HEIC → JPG 변환","HEIC 사진을 JPG 이미지로 변환합니다.",["heic","heif","jpg","iphone"]],
  ["image-compress","image","이미지 압축","품질을 조절해 이미지 파일 크기를 줄입니다.",["compress","quality","용량"]],
  ["image-resize","image","이미지 크기 조절","가로·세로 크기와 비율을 설정해 이미지를 조절합니다.",["resize","width","height"]],
  ["image-crop","image","이미지 자르기","가로세로 비율과 위치를 정해 이미지 중앙을 자릅니다.",["crop","자르기"]],
  ["image-rotate","image","이미지 회전","이미지를 90도, 180도 또는 270도 회전합니다.",["rotate","회전"]],
  ["image-flip","image","이미지 뒤집기","이미지를 가로 또는 세로 방향으로 뒤집습니다.",["flip","mirror"]],
  ["image-grayscale","image","이미지 흑백 변환","컬러 이미지를 흑백으로 변환합니다.",["grayscale","흑백"]],
  ["image-brightness","image","이미지 밝기 조절","이미지 밝기를 조절합니다.",["brightness","밝기"]],
  ["image-contrast","image","이미지 대비 조절","이미지의 명암 대비를 조절합니다.",["contrast","대비"]],
  ["image-blur","image","이미지 흐리게","이미지에 부드러운 흐림 효과를 적용합니다.",["blur","흐림"]],
  ["image-pixelate","image","이미지 모자이크","이미지에 모자이크 효과를 적용합니다.",["pixelate","mosaic","모자이크"]],
  ["remove-image-metadata","image","이미지 메타데이터 제거","이미지를 다시 인코딩해 EXIF 및 GPS 메타데이터를 제거합니다.",["metadata","exif","gps"]],
  ["image-info","image","이미지 정보 확인","이미지 크기와 형식, 비율, 파일 용량을 확인합니다.",["image","info","size"]],
  ["favicon-generator","image","Favicon 생성기","이미지로 브라우저용 favicon PNG를 만듭니다.",["favicon","icon"]],
  ["image-color-picker","image","이미지 색상 추출","이미지를 눌러 색상의 HEX와 RGB 값을 확인합니다.",["color picker","hex","rgb"]],
  ["images-to-pdf","image","이미지 PDF 변환","여러 이미지를 하나의 PDF 문서로 만듭니다.",["images","pdf","merge"]],
  ["pdf-merge","pdf","PDF 합치기","여러 PDF 파일을 선택한 순서대로 합칩니다.",["pdf","merge","병합"]],
  ["pdf-split","pdf","PDF 페이지 추출","페이지 범위를 입력해 새 PDF로 저장합니다.",["pdf","split","extract"]],
  ["pdf-delete-pages","pdf","PDF 페이지 삭제","지정한 페이지를 제외한 PDF를 만듭니다.",["pdf","delete","pages"]],
  ["pdf-reorder-pages","pdf","PDF 페이지 순서 변경","페이지 번호 순서를 입력해 PDF 페이지를 재배치합니다.",["pdf","reorder","pages"]],
  ["pdf-rotate-pages","pdf","PDF 페이지 회전","모든 PDF 페이지를 90도 단위로 회전합니다.",["pdf","rotate"]],
  ["pdf-add-page-numbers","pdf","PDF 페이지 번호 추가","PDF 각 페이지 아래쪽에 페이지 번호를 추가합니다.",["pdf","page numbers"]],
  ["pdf-watermark","pdf","PDF 워터마크","텍스트 워터마크를 PDF 모든 페이지에 추가합니다.",["pdf","watermark"]],
  ["pdf-metadata-viewer","pdf","PDF 메타데이터 확인","PDF 문서의 제목, 작성자 등 메타데이터를 확인합니다.",["pdf","metadata"]],
  ["pdf-remove-metadata","pdf","PDF 메타데이터 제거","PDF의 문서 메타데이터를 제거한 사본을 만듭니다.",["pdf","metadata","privacy"]],
  ["character-count","text","글자 수 세기","글자 수와 줄 수, 단어 수를 계산합니다.",["character","count","글자수"]],
  ["remove-spaces","text","공백 제거","텍스트의 공백을 모두 제거하거나 연속 공백을 정리합니다.",["spaces","공백"]],
  ["remove-line-breaks","text","줄바꿈 제거","텍스트의 줄바꿈을 공백으로 바꿉니다.",["line break","줄바꿈"]],
  ["remove-duplicate-lines","text","중복 줄 제거","반복되는 줄을 하나만 남깁니다.",["duplicate","lines"]],
  ["sort-lines","text","줄 정렬","텍스트 줄을 오름차순 또는 내림차순으로 정렬합니다.",["sort","lines"]],
  ["text-case-converter","text","대소문자 변환","영문 텍스트를 소문자, 대문자, 제목 형식으로 바꿉니다.",["case","uppercase","lowercase"]],
  ["text-compare","text","텍스트 비교","두 텍스트를 비교하고 달라진 줄을 표시합니다.",["diff","compare"]],
  ["reverse-text","text","텍스트 뒤집기","문자 순서를 반대로 바꿉니다.",["reverse","text"]],
  ["remove-duplicate-words","text","중복 단어 제거","문장 안에서 반복되는 단어를 제거합니다.",["duplicate","words"]],
  ["json-formatter","developer","JSON Formatter","JSON을 보기 좋게 정렬하거나 압축하고 복사합니다.",["json","format","minify"]],
  ["json-validator","developer","JSON Validator","JSON 문법을 검사하고 오류 위치를 안내합니다.",["json","validate"]],
  ["json-to-yaml","developer","JSON → YAML","JSON 데이터를 YAML 형식으로 변환합니다.",["json","yaml","convert"]],
  ["yaml-to-json","developer","YAML → JSON","YAML 데이터를 JSON 형식으로 변환합니다.",["yaml","json","convert"]],
  ["csv-to-json","developer","CSV → JSON","CSV 표 데이터를 JSON 배열로 변환합니다.",["csv","json","convert"]],
  ["json-to-csv","developer","JSON → CSV","객체 배열 JSON을 CSV 표로 변환합니다.",["json","csv","convert"]],
  ["base64","developer","Base64 인코더·디코더","UTF-8 텍스트를 Base64로 인코딩하거나 디코딩합니다.",["base64","encode","decode"]],
  ["url-encode-decode","developer","URL 인코더·디코더","URL 텍스트를 인코딩하거나 디코딩합니다.",["url","encode","decode"]],
  ["uuid-generator","developer","UUID 생성기","Web Crypto API로 UUID를 여러 개 생성합니다.",["uuid","guid","random"]],
  ["timestamp-converter","developer","Timestamp 변환기","Unix 초·밀리초와 날짜, ISO 8601 시간을 변환합니다.",["timestamp","unix","iso 8601"]],
];

export const tools: ToolDefinition[] = entries.map(([slug, category, title, description, keywords]) => ({ id: slug, slug, category, title, shortTitle: title, description, keywords, clientOnly: true, acceptedTypes: category === "image" ? ["image/*"] : category === "pdf" ? ["application/pdf"] : undefined }));
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const duplicateSlugs = tools.map((tool) => tool.slug).filter((slug, i, all) => all.indexOf(slug) !== i);
if (duplicateSlugs.length || tools.some((tool) => !slugPattern.test(tool.slug))) throw new Error(`Invalid or duplicate tool slug: ${duplicateSlugs.join(", ")}`);
for (const tool of tools) tool.relatedTools = tools.filter((other) => other.category === tool.category && other.slug !== tool.slug).slice(0, 4).map((other) => other.slug);
export const getTool = (slug: string) => tools.find((tool) => tool.slug === slug);
