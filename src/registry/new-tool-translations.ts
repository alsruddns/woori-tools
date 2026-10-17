import type { RouteLocale } from "@/i18n/routing";

export const newToolSlugs = [
  "jwt-decoder", "url-query-parameter-parser", "user-agent-parser", "ip-cidr-calculator", "base32-encoder-decoder",
  "ulid-generator", "uuid-v7-generator", "hash-compare", "regex-replace", "html-entity-encoder-decoder",
  "chmod-calculator", "json-path-tester", "csv-tsv-converter", "url-slug-generator", "unicode-code-point-checker", "pdf-page-size-checker",
] as const;

const locales: RouteLocale[] = ["ko","en","ja","zh","es","pt-br","de","fr","vi","id","th","zh-tw","it","nl","hi"];
const names: Record<(typeof newToolSlugs)[number], string[]> = {
  "jwt-decoder":["JWT 디코더","JWT Decoder","JWTデコーダー","JWT 解码器","Decodificador JWT","Decodificador JWT","JWT-Decoder","Décodeur JWT","Trình giải mã JWT","Dekoder JWT","ตัวถอดรหัส JWT","JWT 解碼器","Decoder JWT","JWT-decoder","JWT डिकोडर"],
  "url-query-parameter-parser":["URL 쿼리 파라미터 분석기","URL Query Parameter Parser","URLクエリパラメーター解析","URL 查询参数解析器","Analizador de parámetros URL","Analisador de parâmetros de URL","URL-Abfrageparameter-Parser","Analyseur de paramètres URL","Trình phân tích tham số URL","Parser Parameter URL","ตัวแยกพารามิเตอร์ URL","ตัวแยกพารามิเตอร์ URL","Analizzatore parametri URL","URL-queryparameterparser","URL क्वेरी पैरामीटर पार्सर"],
  "user-agent-parser":["User-Agent 분석기","User Agent Parser","User-Agent解析","User-Agent 解析器","Analizador de User-Agent","Analisador de User-Agent","User-Agent-Parser","Analyseur User-Agent","Trình phân tích User-Agent","Parser User-Agent","ตัวแยกวิเคราะห์ User-Agent","User-Agent 解析器","Analizzatore User-Agent","User-Agent-parser","User-Agent पार्सर"],
  "ip-cidr-calculator":["IPv4 CIDR 계산기","IPv4 CIDR Calculator","IPv4 CIDR計算","IPv4 CIDR 计算器","Calculadora IPv4 CIDR","Calculadora IPv4 CIDR","IPv4-CIDR-Rechner","Calculateur IPv4 CIDR","Máy tính IPv4 CIDR","Kalkulator IPv4 CIDR","เครื่องคำนวณ IPv4 CIDR","IPv4 CIDR 計算機","Calcolatore IPv4 CIDR","IPv4-CIDR-calculator","IPv4 CIDR कैलकुलेटर"],
  "base32-encoder-decoder":["Base32 인코더·디코더","Base32 Encoder and Decoder","Base32エンコーダー・デコーダー","Base32 编码解码器","Codificador y decodificador Base32","Codificador e decodificador Base32","Base32-Encoder und -Decoder","Encodeur et décodeur Base32","Mã hóa và giải mã Base32","Enkoder dan dekoder Base32","ตัวเข้ารหัสและถอดรหัส Base32","Base32 編碼與解碼","Codificatore e decodificatore Base32","Base32-encoder en decoder","Base32 एन्कोडर और डिकोडर"],
  "ulid-generator":["ULID 생성기","ULID Generator","ULID生成器","ULID 生成器","Generador de ULID","Gerador de ULID","ULID-Generator","Générateur d’ULID","Trình tạo ULID","Generator ULID","ตัวสร้าง ULID","ULID 產生器","Generatore ULID","ULID-generator","ULID जनरेटर"],
  "uuid-v7-generator":["UUID v7 생성기","UUID v7 Generator","UUID v7生成器","UUID v7 生成器","Generador UUID v7","Gerador de UUID v7","UUID-v7-Generator","Générateur UUID v7","Trình tạo UUID v7","Generator UUID v7","ตัวสร้าง UUID v7","UUID v7 產生器","Generatore UUID v7","UUID v7-generator","UUID v7 जनरेटर"],
  "hash-compare":["해시 비교기","Hash Comparison Tool","ハッシュ比較ツール","哈希比较工具","Comparador de hashes","Comparador de hashes","Hash-Vergleich","Comparateur de hachages","Công cụ so sánh mã băm","Pembanding hash","เครื่องมือเปรียบเทียบแฮช","雜湊比較工具","Confronto hash","Hashvergelijker","हैश तुलना टूल"],
  "regex-replace":["정규식 치환 도구","Regex Replace Tool","正規表現置換ツール","正则表达式替换工具","Reemplazo con expresiones regulares","Substituição por expressão regular","Regex-Ersetzung","Remplacement par expression régulière","Thay thế bằng biểu thức chính quy","Penggantian regex","เครื่องมือแทนที่ด้วย Regex","正規表示式取代工具","Sostituzione con espressioni regolari","Regex-vervanging","Regex बदलने का टूल"],
  "html-entity-encoder-decoder":["HTML 엔티티 인코더·디코더","HTML Entity Encoder and Decoder","HTMLエンティティ変換","HTML 实体编码解码器","Codificador y decodificador de entidades HTML","Codificador e decodificador de entidades HTML","HTML-Entity-Encoder und -Decoder","Encodeur et décodeur d’entités HTML","Mã hóa và giải mã thực thể HTML","Enkoder dan dekoder entitas HTML","ตัวเข้ารหัสและถอดรหัส HTML Entity","HTML 實體編碼與解碼","Codificatore e decodificatore entità HTML","HTML-entiteitsencoder en -decoder","HTML एंटिटी एन्कोडर और डिकोडर"],
  "chmod-calculator":["Linux 권한 계산기","Linux Chmod Calculator","Linux権限計算","Linux Chmod 计算器","Calculadora de permisos Linux","Calculadora de permissões Linux","Linux-Chmod-Rechner","Calculateur de permissions Linux","Máy tính quyền Linux","Kalkulator izin Linux","เครื่องคำนวณสิทธิ์ Linux","Linux Chmod 計算機","Calcolatore permessi Linux","Linux-machtigingscalculator","Linux अनुमति कैलकुलेटर"],
  "json-path-tester":["JSONPath 테스트 도구","JSONPath Tester","JSONPathテスター","JSONPath 测试器","Probador de JSONPath","Testador de JSONPath","JSONPath-Tester","Testeur JSONPath","Trình kiểm tra JSONPath","Penguji JSONPath","เครื่องมือทดสอบ JSONPath","JSONPath 測試器","Tester JSONPath","JSONPath-tester","JSONPath परीक्षक"],
  "csv-tsv-converter":["CSV·TSV 변환기","CSV and TSV Converter","CSV・TSV変換","CSV 与 TSV 转换器","Convertidor CSV y TSV","Conversor de CSV e TSV","CSV- und TSV-Konverter","Convertisseur CSV et TSV","Trình chuyển đổi CSV và TSV","Konverter CSV dan TSV","ตัวแปลง CSV และ TSV","CSV 與 TSV 轉換器","Convertitore CSV e TSV","CSV- en TSV-converter","CSV और TSV कन्वर्टर"],
  "url-slug-generator":["URL 슬러그 생성기","URL Slug Generator","URLスラッグ生成","URL Slug 生成器","Generador de slug URL","Gerador de slug para URL","URL-Slug-Generator","Générateur de slug URL","Trình tạo slug URL","Generator slug URL","ตัวสร้าง URL Slug","URL Slug 產生器","Generatore di slug URL","URL-sluggenerator","URL स्लग जनरेटर"],
  "unicode-code-point-checker":["유니코드 코드 포인트 확인기","Unicode Code Point Checker","Unicodeコードポイント確認","Unicode 码位检查器","Comprobador de puntos de código Unicode","Verificador de pontos de código Unicode","Unicode-Codepoint-Prüfer","Vérificateur de points de code Unicode","Trình kiểm tra mã Unicode","Pemeriksa titik kode Unicode","เครื่องมือตรวจสอบ Unicode Code Point","Unicode 碼位檢查器","Verificatore di code point Unicode","Unicode-codepointchecker","Unicode कोड पॉइंट जाँचकर्ता"],
  "pdf-page-size-checker":["PDF 페이지 크기 확인기","PDF Page Size Checker","PDFページサイズ確認","PDF 页面尺寸检查器","Comprobador del tamaño de página PDF","Verificador do tamanho das páginas PDF","PDF-Seitengrößenprüfung","Vérificateur du format des pages PDF","Trình kiểm tra kích thước trang PDF","Pemeriksa ukuran halaman PDF","เครื่องมือตรวจสอบขนาดหน้า PDF","PDF 頁面尺寸檢查器","Verificatore formato pagine PDF","PDF-paginagroottecontrole","PDF पृष्ठ आकार जाँचकर्ता"],
};

export function getNewToolTranslation(slug: string, locale: RouteLocale, localizedAction?: string) {
  if (!newToolSlugs.includes(slug as (typeof newToolSlugs)[number])) return undefined;
  const index = locales.indexOf(locale);
  const title = names[slug as (typeof newToolSlugs)[number]][index];
  if (!title?.trim()) return undefined;
  return { title, description: localizedAction ? `${title} — ${localizedAction}` : title, keywords: [slug, title] };
}
