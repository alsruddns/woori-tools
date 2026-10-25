"use client";

import { useState } from "react";
import { isPlannedLocale, type RouteLocale, type TargetLocale } from "@/i18n/routing";
import { getMessages } from "@/i18n/messages";
import { getTargetBrowserDeveloperCopy } from "@/i18n/target-browser-developer-copy";
import { copyText } from "@/lib/copy-to-clipboard";
import { calculateChmod, calculateIpv4Cidr, compareHashes, convertCsvTsv, createUlid, createUrlSlug, createUuidV7, decodeBase32, decodeHtmlEntities, decodeJwt, encodeBase32, encodeHtmlEntities, evaluateJsonPath, inspectCodePoints, inspectUserAgent, parseUrlQuery, replaceWithRegex } from "@/lib/browser-developer-tools";

const supportedSlugs = new Set([
  "jwt-decoder", "url-query-parameter-parser", "user-agent-parser", "ip-cidr-calculator", "base32-encoder-decoder",
  "ulid-generator", "uuid-v7-generator", "hash-compare", "regex-replace", "html-entity-encoder-decoder",
  "chmod-calculator", "json-path-tester", "csv-tsv-converter", "url-slug-generator", "unicode-code-point-checker", "pdf-page-size-checker",
]);

const fieldNames: Record<RouteLocale, [string, string, string, string]> = {
  ko:["입력값","비교할 값","정규식·JSONPath","PDF 파일 선택"],
  en:["Input value","Second value","Pattern or JSONPath","Choose a PDF file"],
  ja:["入力値","比較する値","正規表現・JSONPath","PDFファイルを選択"],
  zh:["输入内容","比较内容","正则表达式或 JSONPath","选择 PDF 文件"],
  es:["Valor de entrada","Segundo valor","Patrón o JSONPath","Seleccionar archivo PDF"],
  "pt-br":["Valor de entrada","Segundo valor","Padrão ou JSONPath","Selecionar arquivo PDF"],
  de:["Eingabewert","Zweiter Wert","Muster oder JSONPath","PDF-Datei auswählen"],
  fr:["Valeur saisie","Deuxième valeur","Expression ou JSONPath","Choisir un fichier PDF"],
  vi:["Giá trị đầu vào","Giá trị thứ hai","Mẫu hoặc JSONPath","Chọn tệp PDF"],
  id:["Nilai masukan","Nilai kedua","Pola atau JSONPath","Pilih file PDF"],
  th:["ค่าที่ป้อน","ค่าที่สอง","รูปแบบหรือ JSONPath","เลือกไฟล์ PDF"],
  "zh-tw":["輸入值","第二個值","模式或 JSONPath","選擇 PDF 檔案"],
  it:["Valore inserito","Secondo valore","Modello o JSONPath","Scegli un file PDF"],
  nl:["Invoerwaarde","Tweede waarde","Patroon of JSONPath","Kies een PDF-bestand"],
  hi:["इनपुट मान","दूसरा मान","पैटर्न या JSONPath","PDF फ़ाइल चुनें"],
};

const helperText: Record<RouteLocale, { jwt: string; ua: string; cidr: string; pdf: string; unsupported: string; success: string; failure: string; directionA: string; directionB: string }> = {
  ko:{jwt:"페이로드와 만료 시각만 확인합니다. 서명이나 토큰의 유효성을 검증하지 않습니다.",ua:"User-Agent 문자열을 로컬 규칙으로 추정합니다. 결과는 브라우저 식별을 보장하지 않습니다.",cidr:"IPv4 CIDR 예: 192.168.1.15/24",pdf:"파일은 브라우저에서만 읽습니다. 페이지 크기는 PDF 포인트와 밀리미터로 표시합니다.",unsupported:"이 도구는 브라우저에서 처리되며 입력값을 서버로 보내지 않습니다.",success:"처리 완료",failure:"입력 형식을 확인해 주세요.",directionA:"인코딩",directionB:"디코딩"},
  en:{jwt:"Decodes the payload and checks exp only. It does not verify the signature or establish token validity.",ua:"Uses local heuristics; browser identification is not guaranteed.",cidr:"IPv4 CIDR example: 192.168.1.15/24",pdf:"The file is read in your browser. Page sizes are shown in PDF points and millimeters.",unsupported:"This tool runs in your browser. Inputs are not sent to a server.",success:"Done",failure:"Check the input format.",directionA:"Encode",directionB:"Decode"},
  ja:{jwt:"ペイロードの表示と exp の確認のみを行います。署名やトークンの有効性は検証しません。",ua:"簡易的なローカル判定です。ブラウザーの識別を保証するものではありません。",cidr:"IPv4 CIDR の例：192.168.1.15/24",pdf:"ファイルはブラウザー内で読み込みます。ページサイズをPDFポイントとミリメートルで表示します。",unsupported:"ブラウザー内で処理し、入力内容をサーバーへ送信しません。",success:"完了",failure:"入力形式を確認してください。",directionA:"エンコード",directionB:"デコード"},
  zh:{jwt:"仅解码载荷并检查 exp，不验证签名，也不判断令牌是否有效。",ua:"使用本地启发式规则，不保证浏览器识别结果准确。",cidr:"IPv4 CIDR 示例：192.168.1.15/24",pdf:"文件仅在浏览器中读取。页面尺寸以 PDF 点和毫米显示。",unsupported:"此工具在浏览器中运行，不会将输入发送到服务器。",success:"处理完成",failure:"请检查输入格式。",directionA:"编码",directionB:"解码"},
  es:{jwt:"Solo decodifica el contenido y comprueba exp. No verifica la firma ni la validez del token.",ua:"Usa reglas locales aproximadas; no garantiza la identificación del navegador.",cidr:"Ejemplo IPv4 CIDR: 192.168.1.15/24",pdf:"El archivo se lee en el navegador. Los tamaños se muestran en puntos PDF y milímetros.",unsupported:"La herramienta funciona en el navegador y no envía entradas al servidor.",success:"Listo",failure:"Comprueba el formato de entrada.",directionA:"Codificar",directionB:"Decodificar"},
  "pt-br":{jwt:"Decodifica apenas o payload e verifica exp. Não valida a assinatura nem a validade do token.",ua:"Usa regras locais aproximadas; a identificação do navegador não é garantida.",cidr:"Exemplo IPv4 CIDR: 192.168.1.15/24",pdf:"O arquivo é lido no navegador. Os tamanhos são exibidos em pontos PDF e milímetros.",unsupported:"A ferramenta funciona no navegador e não envia dados ao servidor.",success:"Concluído",failure:"Confira o formato informado.",directionA:"Codificar",directionB:"Decodificar"},
  de:{jwt:"Decodiert nur die Nutzlast und prüft exp. Signatur und Gültigkeit des Tokens werden nicht verifiziert.",ua:"Verwendet lokale Heuristiken; die Browsererkennung ist nicht garantiert.",cidr:"IPv4-CIDR-Beispiel: 192.168.1.15/24",pdf:"Die Datei wird im Browser gelesen. Seitengrößen erscheinen in PDF-Punkten und Millimetern.",unsupported:"Das Tool läuft im Browser. Eingaben werden nicht an einen Server gesendet.",success:"Fertig",failure:"Bitte Eingabeformat prüfen.",directionA:"Kodieren",directionB:"Dekodieren"},
  fr:{jwt:"Décode uniquement la charge utile et vérifie exp. La signature et la validité du jeton ne sont pas vérifiées.",ua:"Utilise des règles locales approximatives ; l’identification du navigateur n’est pas garantie.",cidr:"Exemple IPv4 CIDR : 192.168.1.15/24",pdf:"Le fichier est lu dans le navigateur. Les tailles sont affichées en points PDF et en millimètres.",unsupported:"L’outil fonctionne dans le navigateur et n’envoie pas les entrées au serveur.",success:"Terminé",failure:"Vérifiez le format saisi.",directionA:"Encoder",directionB:"Décoder"},
  vi:{jwt:"Chỉ giải mã payload và kiểm tra exp. Công cụ không xác minh chữ ký hoặc tính hợp lệ của token.",ua:"Dùng quy tắc cục bộ để ước đoán; không đảm bảo nhận diện trình duyệt.",cidr:"Ví dụ IPv4 CIDR: 192.168.1.15/24",pdf:"Tệp được đọc trong trình duyệt. Kích thước trang hiển thị theo điểm PDF và milimét.",unsupported:"Công cụ chạy trong trình duyệt và không gửi dữ liệu lên máy chủ.",success:"Hoàn tất",failure:"Vui lòng kiểm tra định dạng đầu vào.",directionA:"Mã hóa",directionB:"Giải mã"},
  id:{jwt:"Hanya mengurai payload dan memeriksa exp. Tanda tangan dan validitas token tidak diverifikasi.",ua:"Menggunakan perkiraan lokal; identifikasi browser tidak dijamin.",cidr:"Contoh IPv4 CIDR: 192.168.1.15/24",pdf:"File dibaca di browser. Ukuran halaman ditampilkan dalam poin PDF dan milimeter.",unsupported:"Alat berjalan di browser dan tidak mengirim masukan ke server.",success:"Selesai",failure:"Periksa format masukan.",directionA:"Enkode",directionB:"Dekode"},
  th:{jwt:"ถอดรหัสเฉพาะ payload และตรวจ exp โดยไม่ตรวจลายเซ็นหรือยืนยันความถูกต้องของโทเคน",ua:"ใช้กฎในเครื่องเพื่อคาดเดา ไม่รับประกันการระบุเบราว์เซอร์",cidr:"ตัวอย่าง IPv4 CIDR: 192.168.1.15/24",pdf:"อ่านไฟล์ในเบราว์เซอร์ ขนาดหน้าแสดงเป็นจุด PDF และมิลลิเมตร",unsupported:"เครื่องมือนี้ทำงานในเบราว์เซอร์และไม่ส่งข้อมูลไปยังเซิร์ฟเวอร์",success:"เสร็จแล้ว",failure:"โปรดตรวจสอบรูปแบบข้อมูล",directionA:"เข้ารหัส",directionB:"ถอดรหัส"},
  "zh-tw":{jwt:"僅解碼 payload 並檢查 exp，不會驗證簽章或判定 Token 是否有效。",ua:"使用本機啟發式規則，不保證瀏覽器識別結果準確。",cidr:"IPv4 CIDR 範例：192.168.1.15/24",pdf:"檔案僅在瀏覽器中讀取。頁面尺寸以 PDF 點數與毫米顯示。",unsupported:"此工具在瀏覽器中執行，不會將輸入傳送至伺服器。",success:"完成",failure:"請檢查輸入格式。",directionA:"編碼",directionB:"解碼"},
  it:{jwt:"Decodifica solo il payload e controlla exp. Non verifica la firma né la validità del token.",ua:"Usa euristiche locali; il riconoscimento del browser non è garantito.",cidr:"Esempio IPv4 CIDR: 192.168.1.15/24",pdf:"Il file viene letto nel browser. Le dimensioni sono indicate in punti PDF e millimetri.",unsupported:"Lo strumento funziona nel browser e non invia i dati al server.",success:"Completato",failure:"Controlla il formato inserito.",directionA:"Codifica",directionB:"Decodifica"},
  nl:{jwt:"Decodeert alleen de payload en controleert exp. De handtekening en geldigheid worden niet geverifieerd.",ua:"Gebruikt lokale heuristieken; browserherkenning is niet gegarandeerd.",cidr:"IPv4-CIDR-voorbeeld: 192.168.1.15/24",pdf:"Het bestand wordt in je browser gelezen. Paginaformaten worden getoond in PDF-punten en millimeters.",unsupported:"Deze tool werkt in je browser en stuurt invoer niet naar een server.",success:"Klaar",failure:"Controleer de invoerindeling.",directionA:"Coderen",directionB:"Decoderen"},
  hi:{jwt:"केवल payload डिकोड और exp जाँचता है। यह हस्ताक्षर या टोकन की वैधता सत्यापित नहीं करता।",ua:"स्थानीय अनुमानित नियमों का उपयोग करता है; ब्राउज़र पहचान की गारंटी नहीं है।",cidr:"IPv4 CIDR उदाहरण: 192.168.1.15/24",pdf:"फ़ाइल ब्राउज़र में पढ़ी जाती है। पृष्ठ आकार PDF पॉइंट और मिलीमीटर में दिखते हैं।",unsupported:"यह टूल ब्राउज़र में चलता है और इनपुट सर्वर पर नहीं भेजता।",success:"पूरा हुआ",failure:"इनपुट प्रारूप जाँचें।",directionA:"एन्कोड करें",directionB:"डिकोड करें"},
};
const expiryLabels: Record<RouteLocale, { label: string; absent: string; active: string; expired: string }> = {
  ko:{label:"만료 상태",absent:"exp 클레임 없음",active:"만료되지 않음",expired:"만료됨"},en:{label:"Expiry status",absent:"No exp claim",active:"Not expired",expired:"Expired"},ja:{label:"有効期限",absent:"expクレームなし",active:"有効期限内",expired:"期限切れ"},zh:{label:"过期状态",absent:"没有 exp 声明",active:"尚未过期",expired:"已过期"},es:{label:"Estado de expiración",absent:"Sin claim exp",active:"No ha caducado",expired:"Caducado"},"pt-br":{label:"Estado de expiração",absent:"Sem claim exp",active:"Não expirado",expired:"Expirado"},de:{label:"Ablaufstatus",absent:"Kein exp-Claim",active:"Nicht abgelaufen",expired:"Abgelaufen"},fr:{label:"État d’expiration",absent:"Aucune claim exp",active:"Non expiré",expired:"Expiré"},vi:{label:"Trạng thái hết hạn",absent:"Không có claim exp",active:"Chưa hết hạn",expired:"Đã hết hạn"},id:{label:"Status kedaluwarsa",absent:"Tidak ada klaim exp",active:"Belum kedaluwarsa",expired:"Kedaluwarsa"},th:{label:"สถานะหมดอายุ",absent:"ไม่มี exp claim",active:"ยังไม่หมดอายุ",expired:"หมดอายุแล้ว"},"zh-tw":{label:"到期狀態",absent:"沒有 exp 宣告",active:"尚未到期",expired:"已到期"},it:{label:"Stato di scadenza",absent:"Nessun claim exp",active:"Non scaduto",expired:"Scaduto"},nl:{label:"Verloopstatus",absent:"Geen exp-claim",active:"Niet verlopen",expired:"Verlopen"},hi:{label:"समाप्ति स्थिति",absent:"exp क्लेम नहीं है",active:"समाप्त नहीं हुआ",expired:"समाप्त हो गया"},
};

const polishFieldNames = ["Wartość wejściowa", "Druga wartość", "Wzorzec lub JSONPath", "Wybierz plik PDF"] as const;
const polishHelper = { jwt:"Narzędzie dekoduje treść tokenu i sprawdza wyłącznie pole exp. Nie weryfikuje podpisu ani ważności tokenu.", ua:"Wynik opiera się na lokalnych heurystykach i nie gwarantuje prawidłowego rozpoznania przeglądarki.", cidr:"Przykład IPv4 CIDR: 192.168.1.15/24", pdf:"Plik jest odczytywany w przeglądarce. Rozmiary stron podajemy w punktach PDF i milimetrach.", unsupported:"Narzędzie działa w przeglądarce. Wprowadzone dane nie są wysyłane na serwer.", success:"Gotowe", failure:"Sprawdź format danych wejściowych.", directionA:"Koduj", directionB:"Dekoduj" } as const;
const polishExpiry = { label:"Stan wygaśnięcia", absent:"Brak pola exp", active:"Token nie wygasł", expired:"Token wygasł" } as const;

export function BrowserDeveloperToolsWorkspace({ slug, locale, title }: { slug: string; locale: TargetLocale; title: string }) {
  if (!supportedSlugs.has(slug)) return null;
  return <Workspace slug={slug} locale={locale} title={title} />;
}

function Workspace({ slug, locale, title }: { slug: string; locale: TargetLocale; title: string }) {
  const messages = getMessages(locale);
  const targetCopy = isPlannedLocale(locale) ? getTargetBrowserDeveloperCopy(locale) : undefined;
  const labels = targetCopy?.fields ?? (locale === "pl" ? polishFieldNames : fieldNames[locale as RouteLocale]);
  const helper = targetCopy?.helper ?? (locale === "pl" ? polishHelper : helperText[locale as RouteLocale]);
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");
  const initialChoice = slug === "csv-tsv-converter" ? "csv-to-tsv" : "encode";
  const [choice, setChoice] = useState(initialChoice);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const needsSecond = ["hash-compare", "json-path-tester", "regex-replace"].includes(slug);
  const needsThird = slug === "regex-replace";
  const directionTool = ["base32-encoder-decoder", "html-entity-encoder-decoder", "csv-tsv-converter"].includes(slug);
  const run = async () => {
    setError(""); setResult(""); setBusy(true);
    try {
      let value: unknown;
      switch (slug) {
        case "jwt-decoder": {
          const decoded = decodeJwt(first);
          const expiry = targetCopy?.expiry ?? (locale === "pl" ? polishExpiry : expiryLabels[locale as RouteLocale]);
          const expText = decoded.expiry === null ? expiry.absent : `${decoded.status === "active" ? expiry.active : expiry.expired}: ${new Date(decoded.expiry).toISOString()}`;
          value = `${JSON.stringify(decoded.payload, null, 2)}\n\n${expiry.label}: ${expText}`;
          break;
        }
        case "url-query-parameter-parser": value = parseUrlQuery(first).map(([key, item]) => `${key}\t${item}`).join("\n"); break;
        case "user-agent-parser": value = JSON.stringify(inspectUserAgent(first), null, 2); break;
        case "ip-cidr-calculator": value = JSON.stringify(calculateIpv4Cidr(first), null, 2); break;
        case "base32-encoder-decoder": value = choice === "encode" ? encodeBase32(first) : decodeBase32(first); break;
        case "ulid-generator": value = Array.from({ length: boundedCount(first) }, () => createUlid()).join("\n"); break;
        case "uuid-v7-generator": value = Array.from({ length: boundedCount(first) }, () => createUuidV7()).join("\n"); break;
        case "hash-compare": value = JSON.stringify(compareHashes(first, second), null, 2); break;
        case "regex-replace": value = replaceWithRegex(first, second, third); break;
        case "html-entity-encoder-decoder": value = choice === "encode" ? encodeHtmlEntities(first) : decodeHtmlEntities(first); break;
        case "chmod-calculator": value = JSON.stringify(calculateChmod(first), null, 2); break;
        case "json-path-tester": value = JSON.stringify(evaluateJsonPath(first, second), null, 2); break;
        case "csv-tsv-converter": value = convertCsvTsv(first, choice as "csv-to-tsv" | "tsv-to-csv"); break;
        case "url-slug-generator": value = createUrlSlug(first); break;
        case "unicode-code-point-checker": value = JSON.stringify(inspectCodePoints(first), null, 2); break;
        case "pdf-page-size-checker": {
          const fileInput = document.querySelector<HTMLInputElement>("#pdf-page-size-file");
          const file = fileInput?.files?.[0];
          if (!file) throw new Error("missing-pdf");
          const { PDFDocument } = await import("pdf-lib");
          const pdf = await PDFDocument.load(await file.arrayBuffer());
          value = pdf.getPages().map((page, index) => {
            const { width, height } = page.getSize();
            return `${index + 1}\t${width.toFixed(2)} × ${height.toFixed(2)} pt\t${(width * 25.4 / 72).toFixed(2)} × ${(height * 25.4 / 72).toFixed(2)} mm`;
          }).join("\n");
          break;
        }
      }
      setResult(typeof value === "string" ? value : JSON.stringify(value, null, 2));
    } catch {
      setError(helper.failure);
    } finally { setBusy(false); }
  };

  const firstLabel = slug === "json-path-tester" ? labels[0] : slug === "regex-replace" ? labels[2] : slug === "pdf-page-size-checker" ? labels[3] : slug === "hash-compare" ? messages.firstText : messages.input;
  const secondLabel = slug === "json-path-tester" ? labels[2] : slug === "regex-replace" ? messages.secondText : messages.secondText;
  return <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-label={messages.workspaceLabel.replace("{tool}", title)}>
    {slug === "pdf-page-size-checker" ? <label className="block rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center"><span className="font-semibold">{labels[3]}</span><input id="pdf-page-size-file" type="file" accept="application/pdf,.pdf" className="mt-3 block w-full text-sm" /></label> : <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-medium">{firstLabel}<textarea value={first} onChange={(event) => setFirst(event.target.value)} rows={slug === "json-path-tester" ? 9 : 5} className="mt-2 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm" /></label>
      {needsSecond && <label className="block text-sm font-medium">{secondLabel}<textarea value={second} onChange={(event) => setSecond(event.target.value)} rows={slug === "json-path-tester" ? 9 : 5} className="mt-2 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm" /></label>}
      {needsThird && <label className="block text-sm font-medium">{messages.option}<textarea value={third} onChange={(event) => setThird(event.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm" /></label>}
      {slug === "ulid-generator" || slug === "uuid-v7-generator" ? <label className="block text-sm font-medium">{messages.generateCount}<input type="number" min="1" max="100" value={first || "1"} onChange={(event) => setFirst(event.target.value)} className="mt-2 block w-32 rounded-xl border p-3" /></label> : null}
    </div>}
    {directionTool && <label className="mt-4 block text-sm font-medium">{messages.option}<select value={choice} onChange={(event) => setChoice(event.target.value)} className="mt-1 block min-h-11 rounded-xl border border-slate-300 bg-white px-3">{slug === "csv-tsv-converter" ? <><option value="csv-to-tsv">CSV → TSV</option><option value="tsv-to-csv">TSV → CSV</option></> : <><option value="encode">{messages.encode}</option><option value="decode">{messages.decode}</option></>}</select></label>}
    {slug === "jwt-decoder" && <p className="mt-3 text-sm text-amber-800">{helper.jwt}</p>}
    {slug === "user-agent-parser" && <p className="mt-3 text-sm text-slate-600">{helper.ua}</p>}
    {slug === "ip-cidr-calculator" && <p className="mt-3 text-sm text-slate-600">{helper.cidr}</p>}
    {slug === "pdf-page-size-checker" && <p className="mt-3 text-sm text-slate-600">{helper.pdf}</p>}
    <p className="mt-3 text-xs text-slate-500">{helper.unsupported}</p>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void run()} disabled={busy} className="min-h-11 rounded-xl bg-indigo-600 px-5 font-semibold text-white disabled:opacity-60">{busy ? messages.processing : messages.run}</button><button type="button" onClick={() => { setFirst(""); setSecond(""); setThird(""); setChoice(initialChoice); setResult(""); setError(""); const fileInput = document.querySelector<HTMLInputElement>("#pdf-page-size-file"); if (fileInput) fileInput.value = ""; }} className="min-h-11 rounded-xl border px-5">{messages.reset}</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {result && <section aria-live="polite" className="mt-5 rounded-2xl bg-slate-50 p-4"><h2 className="font-semibold">{messages.result}</h2><pre className="mt-2 max-h-[32rem] overflow-auto whitespace-pre-wrap break-words font-mono text-sm">{result}</pre><button type="button" onClick={() => void copyText(result)} className="mt-3 min-h-10 rounded-lg border px-4">{messages.copy}</button></section>}
  </section>;
}

function boundedCount(value: string) {
  return Math.max(1, Math.min(100, Math.trunc(Number(value) || 1)));
}
