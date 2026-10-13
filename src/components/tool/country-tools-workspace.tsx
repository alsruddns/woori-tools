"use client";

import { useState } from "react";
import type { RouteLocale } from "@/i18n/routing";
import { getMessages } from "@/i18n/messages";
import { copyText } from "@/lib/copy-to-clipboard";
import { runCountryTool } from "@/lib/country-tools";
import { COUNTRY_TOOL_SLUGS, type CountryToolSlug } from "@/lib/country-tool-slugs";

const locales: RouteLocale[] = ["ko","en","ja","zh","es","pt-br","de","fr","vi","id","th","zh-tw","it","nl","hi"];
const words = [
  ["입력","결과","실행","초기화","복사","복사 완료","예: ","브라우저에서만 처리합니다. 개인정보나 식별번호는 서버로 전송되거나 저장되지 않습니다.","해당 국가의 표기 규칙에 따라 변환하거나 형식을 확인합니다.","입력값을 확인하세요.","입력 형식이 올바릅니다.","체크섬이 유효합니다.","형식은 확인했지만 실제 발급 여부는 확인하지 않았습니다.","변환 방향","간체에서 번체로","번체에서 간체로","아라비아 숫자에서 한자 숫자로","한자 숫자에서 아라비아 숫자로","연도","결과 복사","형식 확인","형식이 올바르지 않거나 체크섬이 일치하지 않습니다."],
  ["Input","Result","Run","Reset","Copy","Copied","Example: ","Processed in your browser only. Personal data and identifiers are not sent to a server or stored.","Convert or check the format using the selected country's conventions.","Check the input.","The input format is valid.","The checksum is valid.","Format checked; issuance or real-world validity was not verified.","Direction","Simplified to traditional","Traditional to simplified","Arabic numbers to Chinese numerals","Chinese numerals to Arabic numbers","Year","Copy result","Check format","The format is invalid or the checksum does not match."],
  ["入力","結果","実行","リセット","コピー","コピーしました","例：","ブラウザー内だけで処理します。個人情報や識別番号はサーバーへ送信・保存されません。","対象国の表記規則に沿って変換または形式を確認します。","入力内容を確認してください。","入力形式は有効です。","チェックサムは有効です。","形式を確認しました。実際の発行状況や有効性は確認していません。","変換方向","簡体字から繁体字","繁体字から簡体字","アラビア数字から漢数字","漢数字からアラビア数字","年","結果をコピー","形式を確認","形式が無効か、チェックサムが一致しません。"],
  ["输入","结果","处理","重置","复制","已复制","示例：","仅在浏览器中处理。个人信息和证件号码不会上传或保存。","按照所选国家或地区的书写规则转换或检查格式。","请检查输入内容。","输入格式有效。","校验位有效。","已检查格式；未核实实际签发状态或真实性。","转换方向","简体转繁体","繁体转简体","阿拉伯数字转中文数字","中文数字转阿拉伯数字","年份","复制结果","检查格式","格式无效或校验位不匹配。"],
  ["Entrada","Resultado","Procesar","Restablecer","Copiar","Copiado","Ejemplo: ","Se procesa solo en el navegador. Los datos personales e identificadores no se envían ni se guardan.","Convierte o comprueba el formato según las convenciones del país seleccionado.","Revisa la entrada.","El formato de entrada es válido.","El dígito de control es válido.","Se comprobó el formato; no se verificó la expedición ni la validez real.","Dirección","Simplificado a tradicional","Tradicional a simplificado","Números arábigos a numerales chinos","Numerales chinos a números arábigos","Año","Copiar resultado","Comprobar formato","El formato no es válido o el dígito de control no coincide."],
  ["Entrada","Resultado","Procesar","Redefinir","Copiar","Copiado","Exemplo: ","Processado somente no navegador. Dados pessoais e identificadores não são enviados nem armazenados.","Converta ou confira o formato conforme as convenções do país selecionado.","Confira os dados informados.","O formato informado é válido.","O dígito verificador é válido.","O formato foi conferido; a emissão ou validade real não foi verificada.","Direção","Simplificado para tradicional","Tradicional para simplificado","Números arábicos para numerais chineses","Numerais chineses para números arábicos","Ano","Copiar resultado","Conferir formato","O formato é inválido ou o dígito verificador não corresponde."],
  ["Eingabe","Ergebnis","Ausführen","Zurücksetzen","Kopieren","Kopiert","Beispiel: ","Wird nur im Browser verarbeitet. Personenbezogene Daten und Kennungen werden nicht gesendet oder gespeichert.","Format nach den Konventionen des ausgewählten Landes umwandeln oder prüfen.","Eingabe prüfen.","Das Eingabeformat ist gültig.","Die Prüfziffer ist gültig.","Format geprüft; Ausgabe oder tatsächliche Gültigkeit wurde nicht bestätigt.","Richtung","Vereinfacht zu traditionell","Traditionell zu vereinfacht","Arabische Zahlen zu chinesischen Zahlzeichen","Chinesische Zahlzeichen zu arabischen Zahlen","Jahr","Ergebnis kopieren","Format prüfen","Format ungültig oder Prüfziffer stimmt nicht."],
  ["Saisie","Résultat","Traiter","Réinitialiser","Copier","Copié","Exemple : ","Traitement uniquement dans le navigateur. Les données personnelles et identifiants ne sont ni envoyés ni enregistrés.","Convertit ou vérifie le format selon les conventions du pays choisi.","Vérifiez la saisie.","Le format saisi est valide.","La clé de contrôle est valide.","Format vérifié ; émission et validité réelle non vérifiées.","Sens","Simplifié vers traditionnel","Traditionnel vers simplifié","Chiffres arabes vers chiffres chinois","Chiffres chinois vers chiffres arabes","Année","Copier le résultat","Vérifier le format","Format invalide ou clé de contrôle incorrecte."],
  ["Đầu vào","Kết quả","Thực hiện","Đặt lại","Sao chép","Đã sao chép","Ví dụ: ","Chỉ xử lý trong trình duyệt. Dữ liệu cá nhân và mã định danh không được gửi hoặc lưu trữ.","Chuyển đổi hoặc kiểm tra định dạng theo quy ước của quốc gia đã chọn.","Hãy kiểm tra dữ liệu.","Định dạng đầu vào hợp lệ.","Checksum hợp lệ.","Đã kiểm tra định dạng; chưa xác minh việc cấp mã hay tính hợp lệ thực tế.","Chiều chuyển đổi","Giản thể sang phồn thể","Phồn thể sang giản thể","Số Ả Rập sang chữ số Trung Quốc","Chữ số Trung Quốc sang số Ả Rập","Năm","Sao chép kết quả","Kiểm tra định dạng","Định dạng không hợp lệ hoặc checksum không khớp."],
  ["Masukan","Hasil","Proses","Atur ulang","Salin","Tersalin","Contoh: ","Diproses hanya di browser. Data pribadi dan identitas tidak dikirim atau disimpan.","Konversi atau periksa format sesuai aturan negara yang dipilih.","Periksa masukan.","Format masukan valid.","Checksum valid.","Format diperiksa; penerbitan atau keabsahan sebenarnya tidak diverifikasi.","Arah","Sederhana ke tradisional","Tradisional ke sederhana","Angka Arab ke angka Mandarin","Angka Mandarin ke angka Arab","Tahun","Salin hasil","Periksa format","Format tidak valid atau checksum tidak cocok."],
  ["ข้อมูล","ผลลัพธ์","ประมวลผล","รีเซ็ต","คัดลอก","คัดลอกแล้ว","ตัวอย่าง: ","ประมวลผลในเบราว์เซอร์เท่านั้น ไม่ส่งหรือบันทึกข้อมูลส่วนบุคคลและรหัสระบุตัวตน","แปลงหรือตรวจรูปแบบตามหลักเกณฑ์ของประเทศที่เลือก","โปรดตรวจสอบข้อมูล","รูปแบบข้อมูลถูกต้อง","checksum ถูกต้อง","ตรวจรูปแบบแล้ว แต่ไม่ได้ตรวจสอบการออกเลขหรือความถูกต้องจริง","ทิศทางการแปลง","ตัวย่อเป็นตัวเต็ม","ตัวเต็มเป็นตัวย่อ","เลขอารบิกเป็นเลขจีน","เลขจีนเป็นเลขอารบิก","ปี","คัดลอกผลลัพธ์","ตรวจรูปแบบ","รูปแบบไม่ถูกต้องหรือ checksum ไม่ตรง"],
  ["輸入","結果","處理","重設","複製","已複製","範例：","僅在瀏覽器中處理。個人資料與識別碼不會上傳或儲存。","依照所選國家或地區的書寫規則轉換或檢查格式。","請檢查輸入內容。","輸入格式有效。","檢查碼有效。","已檢查格式；未確認實際核發狀態或真實性。","轉換方向","簡體轉繁體","繁體轉簡體","阿拉伯數字轉中文數字","中文數字轉阿拉伯數字","年份","複製結果","檢查格式","格式無效或檢查碼不符。"],
  ["Input","Risultato","Esegui","Reimposta","Copia","Copiato","Esempio: ","Elaborato solo nel browser. Dati personali e identificativi non vengono inviati né salvati.","Converti o controlla il formato secondo le convenzioni del paese selezionato.","Controlla i dati inseriti.","Il formato inserito è valido.","Il checksum è valido.","Formato verificato; emissione e validità reale non sono state confermate.","Direzione","Semplificato in tradizionale","Tradizionale in semplificato","Numeri arabi in numeri cinesi","Numeri cinesi in numeri arabi","Anno","Copia risultato","Verifica formato","Formato non valido o checksum non corrispondente."],
  ["Invoer","Resultaat","Uitvoeren","Resetten","Kopiëren","Gekopieerd","Voorbeeld: ","Wordt alleen in de browser verwerkt. Persoonsgegevens en identificaties worden niet verzonden of opgeslagen.","Zet om of controleer het formaat volgens de regels van het gekozen land.","Controleer de invoer.","Het invoerformaat is geldig.","De controlesom is geldig.","Formaat gecontroleerd; uitgifte of werkelijke geldigheid is niet bevestigd.","Richting","Vereenvoudigd naar traditioneel","Traditioneel naar vereenvoudigd","Arabische cijfers naar Chinese cijfers","Chinese cijfers naar Arabische cijfers","Jaar","Resultaat kopiëren","Formaat controleren","Ongeldig formaat of onjuiste controlesom."],
  ["इनपुट","परिणाम","चलाएँ","रीसेट","कॉपी","कॉपी हो गया","उदाहरण: ","प्रक्रिया केवल ब्राउज़र में होती है। निजी डेटा और पहचान संख्या भेजी या सहेजी नहीं जाती।","चुने गए देश के नियमों के अनुसार प्रारूप बदलें या जाँचें।","इनपुट जाँचें।","इनपुट प्रारूप मान्य है।","चेकसम मान्य है।","प्रारूप जाँचा गया; जारी होने या वास्तविक वैधता की पुष्टि नहीं हुई।","दिशा","सरलीकृत से पारंपरिक","पारंपरिक से सरलीकृत","अरबी अंकों से चीनी अंकों में","चीनी अंकों से अरबी अंकों में","वर्ष","परिणाम कॉपी करें","प्रारूप जाँचें","प्रारूप अमान्य है या चेकसम मेल नहीं खाता।"],
];
const ui = Object.fromEntries(locales.map((locale, index) => [locale, words[index]])) as Record<RouteLocale, string[]>;
const extraUi: Record<RouteLocale, string[]> = {
  ko:["ISO에서 현지 형식으로","현지 형식에서 ISO로","미국 날짜 형식","영국 날짜 형식","날짜 입력이 모호할 수 있습니다. 의도한 순서를 선택하세요.","형식 도구입니다. 실제 전화번호·주소·계좌 또는 등록 상태는 조회하지 않습니다."],
  en:["ISO to local format","Local format to ISO","US date format","UK date format","Dates can be ambiguous. Select the intended order.","Formatting only. This does not look up a real phone number, address, account, or registration."],
  ja:["ISOから現地形式へ","現地形式からISOへ","米国の日付形式","英国の日付形式","日付は曖昧な場合があります。順序を選択してください。","形式を整える機能です。電話番号・住所・口座や登録状況の実在確認は行いません。"],
  zh:["ISO 转当地格式","当地格式转 ISO","美国日期格式","英国日期格式","日期可能有歧义，请选择预期顺序。","仅处理格式，不查询真实电话号码、地址、账户或登记状态。"],
  es:["De ISO al formato local","Del formato local a ISO","Formato de fecha de EE. UU.","Formato de fecha del Reino Unido","Las fechas pueden ser ambiguas. Elige el orden deseado.","Solo da formato; no consulta teléfonos, direcciones, cuentas ni registros reales."],
  "pt-br":["De ISO para o formato local","Do formato local para ISO","Formato de data dos EUA","Formato de data do Reino Unido","A data pode ser ambígua. Escolha a ordem desejada.","Apenas formata; não consulta números, endereços, contas ou registros reais."],
  de:["ISO in lokales Format","Lokales Format in ISO","US-Datumsformat","Britisches Datumsformat","Datumsangaben können mehrdeutig sein. Wähle die gewünschte Reihenfolge.","Nur Formatierung; echte Telefonnummern, Adressen, Konten oder Registrierungen werden nicht abgefragt."],
  fr:["ISO vers le format local","Format local vers ISO","Format de date américain","Format de date britannique","Une date peut être ambiguë. Choisissez l’ordre souhaité.","Mise en forme uniquement ; aucun numéro, adresse, compte ou enregistrement réel n’est consulté."],
  vi:["Từ ISO sang định dạng địa phương","Từ định dạng địa phương sang ISO","Định dạng ngày của Mỹ","Định dạng ngày của Anh","Ngày có thể gây nhầm lẫn. Hãy chọn thứ tự mong muốn.","Chỉ định dạng; không tra cứu số điện thoại, địa chỉ, tài khoản hay đăng ký thực tế."],
  id:["ISO ke format lokal","Format lokal ke ISO","Format tanggal AS","Format tanggal Britania Raya","Tanggal dapat ambigu. Pilih urutan yang dimaksud.","Hanya pemformatan; nomor telepon, alamat, rekening, atau pendaftaran nyata tidak diperiksa."],
  th:["จาก ISO เป็นรูปแบบท้องถิ่น","จากรูปแบบท้องถิ่นเป็น ISO","รูปแบบวันที่สหรัฐฯ","รูปแบบวันที่สหราชอาณาจักร","วันที่อาจกำกวม โปรดเลือกลำดับที่ต้องการ","จัดรูปแบบเท่านั้น ไม่มีการค้นหาเบอร์โทร ที่อยู่ บัญชี หรือสถานะการจดทะเบียนจริง"],
  "zh-tw":["ISO 轉當地格式","當地格式轉 ISO","美國日期格式","英國日期格式","日期可能有歧義，請選擇預期順序。","僅處理格式，不查詢真實電話、地址、帳戶或登記狀態。"],
  it:["Da ISO al formato locale","Dal formato locale a ISO","Formato data statunitense","Formato data britannico","Le date possono essere ambigue. Scegli l’ordine desiderato.","Solo formattazione; non vengono consultati numeri, indirizzi, conti o registrazioni reali."],
  nl:["Van ISO naar lokale notatie","Van lokale notatie naar ISO","Amerikaanse datumnotatie","Britse datumnotatie","Datums kunnen dubbelzinnig zijn. Kies de bedoelde volgorde.","Alleen opmaak; echte telefoonnummers, adressen, rekeningen of registraties worden niet opgezocht."],
  hi:["ISO से स्थानीय प्रारूप","स्थानीय प्रारूप से ISO","अमेरिकी तारीख प्रारूप","ब्रिटिश तारीख प्रारूप","तारीख अस्पष्ट हो सकती है। इच्छित क्रम चुनें।","केवल प्रारूप बदलता है; वास्तविक फ़ोन, पता, खाता या पंजीकरण नहीं खोजा जाता।"],
};
const formatErrors: Record<RouteLocale,string> = {
  ko:"입력 형식이 올바르지 않습니다.",en:"The input format is invalid.",ja:"入力形式が正しくありません。",zh:"输入格式无效。",es:"El formato de entrada no es válido.","pt-br":"O formato informado é inválido.",de:"Das Eingabeformat ist ungültig.",fr:"Le format saisi est invalide.",vi:"Định dạng đầu vào không hợp lệ.",id:"Format masukan tidak valid.",th:"รูปแบบข้อมูลไม่ถูกต้อง","zh-tw":"輸入格式無效。",it:"Il formato inserito non è valido.",nl:"Het invoerformaat is ongeldig.",hi:"इनपुट प्रारूप अमान्य है।",
};
const cycleNotes: Record<RouteLocale,string> = {
  ko:"서기 연도 기준의 간단한 연도 계산입니다. 음력 설 경계에 가까운 생일의 띠는 실제 중국 음력 연도와 다를 수 있습니다.",
  en:"This uses the Gregorian calendar year. A birth date near Lunar New Year may belong to the previous Chinese zodiac year.",
  ja:"西暦年による簡易計算です。旧正月に近い誕生日は、実際の旧暦年の生肖と異なる場合があります。",
  zh:"此处按公历年份简化计算。春节前后出生者的生肖可能与实际农历年份不同。",
  es:"El cálculo usa el año gregoriano. Un nacimiento cerca del Año Nuevo lunar puede corresponder al signo del año anterior.",
  "pt-br":"O cálculo usa o ano gregoriano. Nascimentos próximos ao Ano-Novo Lunar podem pertencer ao signo do ano anterior.",
  de:"Die Berechnung verwendet das gregorianische Kalenderjahr. Geburtstage nahe dem Mondneujahr können zum Zeichen des Vorjahres gehören.",
  fr:"Le calcul utilise l’année grégorienne. Une naissance proche du Nouvel An lunaire peut relever du signe de l’année précédente.",
  vi:"Phép tính dùng năm dương lịch. Người sinh gần Tết âm lịch có thể thuộc con giáp của năm trước.",
  id:"Perhitungan menggunakan tahun Gregorian. Tanggal lahir dekat Tahun Baru Imlek dapat termasuk shio tahun sebelumnya.",
  th:"คำนวณตามปีคริสต์ศักราช วันเกิดใกล้ตรุษจีนอาจอยู่ในนักษัตรของปีก่อนหน้า",
  "zh-tw":"此處按西元年份簡化計算。農曆新年前後出生者的生肖可能與實際農曆年份不同。",
  it:"Il calcolo usa l’anno gregoriano. Una nascita vicina al Capodanno lunare può appartenere al segno dell’anno precedente.",
  nl:"De berekening gebruikt het Gregoriaanse jaar. Een geboortedatum rond Chinees Nieuwjaar kan bij het teken van het vorige jaar horen.",
  hi:"यह गणना ग्रेगोरियन वर्ष के आधार पर है। चंद्र नववर्ष के पास जन्म लेने वालों की राशि पिछले वर्ष की हो सकती है।",
};
const isPhoneTool = (slug: string) => slug.includes("phone-number-formatter");
const isPostalTool = (slug: string) => slug.includes("postcode-formatter") || slug.includes("postal-code-formatter") || slug.includes("zip-code-formatter") || slug.includes("cep-formatter");

export function CountryToolsWorkspace({ slug, locale }: { slug: CountryToolSlug; locale: RouteLocale }) {
  const labels = [...ui[locale], ...extraUi[locale]];
  const messages = getMessages(locale);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState(slug === "english-date-format-converter" ? "us" : "forward");
  function run() {
    setError(""); setOutput("");
    try {
      const result = runCountryTool(slug, input, mode);
      if (typeof result === "string") { setOutput(result); return; }
      if (result.valid) {
        const status = result.level === "checksum" ? labels[11] : labels[10];
        setOutput(`${status}\n${labels[12]}`);
      } else setError(result.level === "format" ? formatErrors[locale] : labels[20]);
    } catch { setError(labels[9]); }
  }
  function reset() { setInput(""); setOutput(""); setError(""); setMode(slug === "english-date-format-converter" ? "us" : "forward"); }
  const isDirectional = slug === "simplified-traditional-chinese-converter" || slug === "chinese-number-kanji-converter";
  const isDateTool = slug.endsWith("date-format-converter");
  const isEnglishDate = slug === "english-date-format-converter";
  const yearTool = slug === "chinese-zodiac-calculator" || slug === "chinese-sexagenary-cycle-calculator";
  const validator = slug.endsWith("validator");
  const examples: Partial<Record<CountryToolSlug,string>> = {
    "simplified-traditional-chinese-converter":"汉字与繁體中文", "chinese-number-kanji-converter":"12345", "rmb-uppercase-converter":"1234.56", "chinese-zodiac-calculator":"1984", "chinese-sexagenary-cycle-calculator":"1984", "chinese-phone-number-formatter":"13800138000",
    "indian-number-format-converter":"100000", "lakh-crore-converter":"2 crore", "pan-format-validator":"ABCPA1234F", "gstin-format-validator":"27ABCPE1234F1Z5",
    "germany-iban-validator":"DE89370400440532013000", "german-number-format-converter":"1234567.89", "german-date-format-converter":"2026-10-13",
    "spain-dni-validator":"12345678Z", "spain-nie-validator":"X1234567L", "spanish-number-format-converter":"1234567.89",
    "france-phone-number-formatter":"0612345678", "french-number-format-converter":"1234567.89", "french-date-format-converter":"2026-10-13",
    "brazil-cpf-validator":"529.982.247-25", "brazil-cnpj-validator":"12.ABC.345/01DE-35", "brazil-phone-number-formatter":"11987654321",
    "netherlands-iban-validator":"NL91ABNA0417164300", "dutch-number-format-converter":"1234567.89", "vietnam-phone-number-formatter":"0912345678", "vietnam-number-format-converter":"1234567.89",
    "italy-fiscal-code-format-validator":"RSSMRA85T10A562S", "italy-number-format-converter":"1234567.89",
    "taiwan-phone-number-formatter":"0912345678", "india-phone-number-formatter":"9876543210", "spanish-date-format-converter":"2026-10-13", "brazil-cep-formatter":"01001000", "dutch-date-format-converter":"2026-10-13", "italy-vat-number-validator":"01114601006", "italian-date-format-converter":"2026-10-13", "us-phone-number-formatter":"2125550123", "us-zip-code-formatter":"123456789", "canada-postal-code-formatter":"k1a0b1", "uk-postcode-formatter":"sw1a1aa", "australia-postcode-formatter":"2000", "english-date-format-converter":"2026-03-04",
  };
  const example = examples[slug] ?? "";
  return <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <p className="rounded-xl bg-sky-50 p-3 text-sm text-sky-900">{labels[7]}</p>
    <p className="mt-3 text-sm text-slate-600">{labels[8]}</p>
    {yearTool && <p className="mt-2 text-sm text-amber-800">{cycleNotes[locale]}</p>}
    {isDirectional && <fieldset className="mt-4 flex flex-wrap gap-2"><legend className="mb-2 text-sm font-medium">{labels[13]}</legend><button type="button" aria-pressed={mode === "forward"} onClick={() => setMode("forward")} className="min-h-10 rounded-lg border px-3">{slug.includes("simplified-traditional") ? labels[14] : labels[16]}</button><button type="button" aria-pressed={mode === "reverse"} onClick={() => setMode("reverse")} className="min-h-10 rounded-lg border px-3">{slug.includes("simplified-traditional") ? labels[15] : labels[17]}</button></fieldset>}
    {isDateTool && <fieldset className="mt-4 flex flex-wrap gap-2"><legend className="mb-2 text-sm font-medium">{labels[13]}</legend>{(isEnglishDate ? [["us", labels[24]],["uk", labels[25]],["us-reverse", `${labels[24]} → ISO`],["uk-reverse", `${labels[25]} → ISO`]] : [["forward", labels[22]],["reverse", labels[23]]]).map(([value, label]) => <button key={value} type="button" aria-pressed={mode === value} onClick={() => setMode(value)} className="min-h-10 rounded-lg border px-3">{label}</button>)}</fieldset>}
    {isEnglishDate && <p className="mt-2 text-sm text-amber-800">{labels[26]}</p>}
    <label className="mt-4 block text-sm font-medium">{yearTool ? labels[18] : labels[0]}<textarea aria-label={yearTool ? labels[18] : labels[0]} rows={yearTool ? 1 : 5} inputMode={yearTool ? "numeric" : "text"} value={input} onChange={(event) => setInput(event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-slate-300 bg-white p-3 font-mono" /></label>
    <button type="button" onClick={() => setInput(example)} className="mt-2 min-h-9 rounded-lg border px-3 text-sm">{labels[6]}{example}</button>
    <div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={run} className="min-h-11 rounded-xl bg-indigo-600 px-5 font-semibold text-white">{validator ? labels[19] : labels[2]}</button><button type="button" onClick={reset} className="min-h-11 rounded-xl border px-5">{messages.reset}</button></div>
    {error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}
    {(isPhoneTool(slug) || isPostalTool(slug)) && <p className="mt-3 text-sm text-slate-600">{labels[27]}</p>}
    {output && <section aria-live="polite" className="mt-5 rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold">{labels[1]}</h3><pre className="mt-2 whitespace-pre-wrap break-all font-mono">{output}</pre><button type="button" onClick={() => void copyText(output)} className="mt-3 min-h-10 rounded-lg border px-4">{labels[4]}</button></section>}
  </section>;
}

export const countryToolsWorkspaceSlugGuard: readonly string[] = COUNTRY_TOOL_SLUGS;
