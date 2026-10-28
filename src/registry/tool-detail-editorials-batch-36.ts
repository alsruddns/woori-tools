import type { PublishedTargetLocale } from "@/i18n/routing";
import type { ToolDetailEditorial } from "@/registry/tool-detail-editorials";
const e = (principle: string, useCase: string, troubleshooting: string, faqQuestion: string, faqAnswer: string): ToolDetailEditorial => ({ principle, useCase, troubleshooting, faqQuestion, faqAnswer });
export const batch36EditorialDrafts: Partial<Record<PublishedTargetLocale, Record<string, ToolDetailEditorial>>> = {
  ko: {
    "uk-postcode-formatter": e("영국 우편번호 패턴을 대문자로 정규화하고 바깥 구역과 안쪽 구역 사이에 공백을 넣습니다.", "sw1a1aa는 SW1A 1AA로 바뀝니다.", "영국 우편번호의 문자·숫자 순서를 확인하세요. 우편번호로 주소를 검색하지 않습니다.", "해당 주소로 배송 가능한지도 확인하나요?", "아니요. 우편번호 형식만 검사합니다."),
    "australia-postcode-formatter": e("호주 우편번호가 숫자 네 자리 형식인지 확인합니다.", "2000은 네 자리 우편번호 형식으로 통과합니다.", "숫자 네 자리인지 확인하세요. 우편번호와 도시의 실제 대응 관계는 조회하지 않습니다.", "도시나 교외 지역을 찾아주나요?", "아니요. 네 자리 형식만 확인합니다."),
    "english-date-format-converter": e("ISO 날짜를 선택한 미국식 월/일/연도 또는 영국식 일/월/연도 표기로 바꾸며 유효하지 않은 날짜는 거부합니다.", "2026-03-04는 미국식 03/04/2026, 영국식 04/03/2026이 됩니다.", "날짜 순서가 서로 다르므로 변환 방향에서 미국식 또는 영국식을 명시하세요. 시간대 변환은 없습니다.", "03/04/2026의 의미를 자동 판단하나요?", "아니요. 월/일인지 일/월인지 선택해야 합니다."),
  },
  en: {
    "uk-postcode-formatter": e("Normalizes a supported UK postcode to uppercase and inserts a space between outward and inward codes.", "sw1a1aa becomes SW1A 1AA.", "Check the UK letter-and-digit pattern. The postcode is not used to look up an address.", "Does it confirm that an address is deliverable?", "No. It checks postcode format only."),
    "australia-postcode-formatter": e("Checks whether an Australian postcode uses exactly four digits.", "2000 passes the four-digit format check.", "Enter four digits. The tool does not match the code to a town or suburb.", "Does it identify the suburb?", "No. It checks the four-digit pattern only."),
    "english-date-format-converter": e("Converts an ISO date to the selected US month/day/year or UK day/month/year notation and rejects impossible dates.", "2026-03-04 becomes 03/04/2026 in US mode or 04/03/2026 in UK mode.", "Choose US or UK order because the two local formats differ. No time-zone conversion is performed.", "Can it infer what 03/04/2026 means?", "No. Select month/day or day/month explicitly."),
  },
  ja: {
    "uk-postcode-formatter": e("対応する英国郵便番号を大文字にし、外側コードと内側コードの間に空白を入れます。", "sw1a1aaはSW1A 1AAになります。", "英国式の文字と数字の並びを確認してください。住所検索は行いません。", "住所に配達可能か確認しますか？", "いいえ。郵便番号の形式だけを検査します。"),
    "australia-postcode-formatter": e("オーストラリアの郵便番号が数字4桁の形式か確認します。", "2000は4桁形式として通過します。", "数字4桁を入力してください。都市や郊外との対応は調べません。", "郊外名を特定できますか？", "いいえ。4桁パターンだけを確認します。"),
    "english-date-format-converter": e("ISO日付を選択した米国式の月/日/年または英国式の日/月/年に変換し、無効な日付は拒否します。", "2026-03-04は米国式03/04/2026、英国式04/03/2026になります。", "各国で順序が異なるため、米国式か英国式を選択してください。タイムゾーン変換はありません。", "03/04/2026の意味を自動判断しますか？", "いいえ。月/日か日/月かを選択します。"),
  },
  zh: {
    "uk-postcode-formatter": e("将支持的英国邮编转为大写，并在外部码与内部码之间加入空格。", "sw1a1aa 会变成 SW1A 1AA。", "检查英国邮编的字母与数字顺序；不会根据邮编查询地址。", "会确认地址能否投递吗？", "不会，只检查邮编格式。"),
    "australia-postcode-formatter": e("检查澳大利亚邮编是否恰好由四位数字组成。", "2000 通过四位格式检查。", "请输入四位数字；不会查询邮编对应的城镇或郊区。", "会识别郊区名称吗？", "不会，只检查四位数字模式。"),
    "english-date-format-converter": e("将 ISO 日期转换为所选美国月/日/年或英国日/月/年写法，并拒绝不存在的日期。", "2026-03-04 在美国模式为 03/04/2026，在英国模式为 04/03/2026。", "两种本地顺序不同，请选择美国或英国格式；不会转换时区。", "能自动判断 03/04/2026 的含义吗？", "不能，请明确选择月/日或日/月。"),
  },
  "zh-tw": {
    "uk-postcode-formatter": e("將支援的英國郵遞區號轉為大寫，並在外碼與內碼之間加入空格。", "sw1a1aa 會變成 SW1A 1AA。", "檢查英國郵遞區號的字母與數字順序；不會依郵遞區號查地址。", "會確認地址能否投遞嗎？", "不會，只檢查郵遞區號格式。"),
    "australia-postcode-formatter": e("檢查澳洲郵遞區號是否恰好由四位數字組成。", "2000 通過四位格式檢查。", "請輸入四位數字；不會查詢郵遞區號對應的城鎮或郊區。", "會辨識郊區名稱嗎？", "不會，只檢查四位數字模式。"),
    "english-date-format-converter": e("將 ISO 日期轉為所選美式月/日/年或英式日/月/年寫法，並拒絕不存在的日期。", "2026-03-04 在美式模式為 03/04/2026，在英式模式為 04/03/2026。", "兩種本地順序不同，請選擇美式或英式格式；不會轉換時區。", "能自動判斷 03/04/2026 的意思嗎？", "不能，請明確選擇月/日或日/月。"),
  },
  es: {
    "uk-postcode-formatter": e("Normaliza un código postal británico compatible en mayúsculas e inserta un espacio entre sus partes externa e interna.", "sw1a1aa pasa a SW1A 1AA.", "Comprueba el patrón británico de letras y cifras. No busca una dirección.", "¿Confirma que la dirección admite entrega?", "No. Solo valida el formato del código postal."),
    "australia-postcode-formatter": e("Comprueba si un código postal australiano tiene exactamente cuatro cifras.", "2000 supera la comprobación de cuatro cifras.", "Introduce cuatro cifras. No relaciona el código con una ciudad o suburbio.", "¿Identifica el suburbio?", "No. Solo comprueba el patrón de cuatro cifras."),
    "english-date-format-converter": e("Convierte una fecha ISO al orden estadounidense mes/día/año o británico día/mes/año seleccionado y rechaza fechas imposibles.", "2026-03-04 pasa a 03/04/2026 en modo US o 04/03/2026 en modo UK.", "Elige US o UK porque cambia el orden local. No hay conversión de zona horaria.", "¿Puede deducir el significado de 03/04/2026?", "No. Selecciona explícitamente mes/día o día/mes."),
  },
  "pt-br": {
    "uk-postcode-formatter": e("Normaliza um código postal britânico aceito em maiúsculas e insere espaço entre as partes externa e interna.", "sw1a1aa vira SW1A 1AA.", "Confira o padrão britânico de letras e números. O endereço não é pesquisado.", "Confirma se o endereço recebe entrega?", "Não. Só verifica o formato do código postal."),
    "australia-postcode-formatter": e("Verifica se um código postal australiano tem exatamente quatro dígitos.", "2000 passa na verificação de quatro dígitos.", "Digite quatro dígitos. O código não é relacionado a cidade ou bairro.", "Identifica o bairro?", "Não. Confere apenas o padrão de quatro dígitos."),
    "english-date-format-converter": e("Converte uma data ISO para o formato americano mês/dia/ano ou britânico dia/mês/ano selecionado e rejeita datas impossíveis.", "2026-03-04 vira 03/04/2026 no modo US ou 04/03/2026 no modo UK.", "Escolha US ou UK porque a ordem local muda. Não há conversão de fuso horário.", "Ele deduz o significado de 03/04/2026?", "Não. Selecione mês/dia ou dia/mês explicitamente."),
  },
  de: {
    "uk-postcode-formatter": e("Normalisiert ein unterstütztes britisches Postleitzahlenmuster in Großbuchstaben und setzt ein Leerzeichen zwischen Außen- und Innenbereich.", "sw1a1aa wird zu SW1A 1AA.", "Prüfe die britische Buchstaben- und Ziffernfolge. Eine Adresse wird nicht gesucht.", "Wird die Zustellbarkeit der Adresse bestätigt?", "Nein. Nur das Postleitzahlenformat wird geprüft."),
    "australia-postcode-formatter": e("Prüft, ob eine australische Postleitzahl genau vier Ziffern hat.", "2000 besteht die Vier-Ziffern-Prüfung.", "Gib vier Ziffern ein. Es erfolgt keine Zuordnung zu Stadt oder Vorort.", "Wird der Vorort ermittelt?", "Nein. Geprüft wird nur das Vier-Ziffern-Muster."),
    "english-date-format-converter": e("Wandelt ein ISO-Datum in die gewählte US-Schreibweise Monat/Tag/Jahr oder UK-Schreibweise Tag/Monat/Jahr um und weist ungültige Daten zurück.", "2026-03-04 wird im US-Modus 03/04/2026, im UK-Modus 04/03/2026.", "Wähle US oder UK, da sich die Reihenfolge unterscheidet. Zeitzonen werden nicht umgerechnet.", "Kann es die Bedeutung von 03/04/2026 erraten?", "Nein. Wähle Monat/Tag oder Tag/Monat ausdrücklich."),
  },
  fr: {
    "uk-postcode-formatter": e("Normalise un code postal britannique accepté en majuscules et insère un espace entre les parties externe et interne.", "sw1a1aa devient SW1A 1AA.", "Vérifiez le motif britannique de lettres et chiffres. Aucune adresse n'est recherchée.", "Confirme-t-il que l'adresse est livrable ?", "Non. Seul le format du code postal est vérifié."),
    "australia-postcode-formatter": e("Vérifie qu'un code postal australien comporte exactement quatre chiffres.", "2000 passe le contrôle des quatre chiffres.", "Saisissez quatre chiffres. Le code n'est pas relié à une ville ou une banlieue.", "Identifie-t-il la banlieue ?", "Non. Il vérifie uniquement le motif à quatre chiffres."),
    "english-date-format-converter": e("Convertit une date ISO au format américain mois/jour/année ou britannique jour/mois/année choisi et rejette les dates impossibles.", "2026-03-04 devient 03/04/2026 en mode US ou 04/03/2026 en mode UK.", "Choisissez US ou UK car l'ordre diffère. Aucun fuseau horaire n'est converti.", "Peut-il déduire le sens de 03/04/2026 ?", "Non. Choisissez explicitement mois/jour ou jour/mois."),
  },
  vi: {
    "uk-postcode-formatter": e("Chuẩn hóa mã bưu chính Anh được hỗ trợ thành chữ hoa và chèn khoảng trắng giữa hai phần mã.", "sw1a1aa thành SW1A 1AA.", "Kiểm tra thứ tự chữ và số theo mẫu Anh. Công cụ không tra địa chỉ.", "Có xác nhận địa chỉ giao được không?", "Không, chỉ kiểm tra định dạng mã bưu chính."),
    "australia-postcode-formatter": e("Kiểm tra mã bưu chính Úc có đúng bốn chữ số hay không.", "2000 vượt qua kiểm tra định dạng bốn chữ số.", "Nhập bốn chữ số. Không tra mã với thành phố hay vùng ngoại ô.", "Có xác định tên ngoại ô không?", "Không, chỉ kiểm tra mẫu bốn chữ số."),
    "english-date-format-converter": e("Đổi ngày ISO sang kiểu Mỹ tháng/ngày/năm hoặc kiểu Anh ngày/tháng/năm đã chọn và từ chối ngày không hợp lệ.", "2026-03-04 thành 03/04/2026 ở chế độ US hoặc 04/03/2026 ở chế độ UK.", "Chọn US hoặc UK vì thứ tự khác nhau. Không đổi múi giờ.", "Công cụ tự đoán ý nghĩa 03/04/2026 không?", "Không, hãy chọn rõ tháng/ngày hoặc ngày/tháng."),
  },
  id: {
    "uk-postcode-formatter": e("Menormalkan pola kode pos UK yang didukung menjadi kapital dan menyisipkan spasi di antara bagian luar dan dalam.", "sw1a1aa menjadi SW1A 1AA.", "Periksa urutan huruf dan angka khas UK. Alamat tidak dicari.", "Apakah alamat dipastikan dapat dikirim?", "Tidak. Hanya format kode pos yang diperiksa."),
    "australia-postcode-formatter": e("Memeriksa apakah kode pos Australia tepat terdiri dari empat digit.", "2000 lolos pemeriksaan format empat digit.", "Masukkan empat digit. Kode tidak dicocokkan dengan kota atau pinggiran kota.", "Apakah nama suburb dikenali?", "Tidak. Hanya pola empat digit yang diperiksa."),
    "english-date-format-converter": e("Mengubah tanggal ISO ke urutan AS bulan/hari/tahun atau UK hari/bulan/tahun yang dipilih dan menolak tanggal mustahil.", "2026-03-04 menjadi 03/04/2026 dalam mode US atau 04/03/2026 dalam mode UK.", "Pilih US atau UK karena urutannya berbeda. Zona waktu tidak dikonversi.", "Apakah arti 03/04/2026 ditebak otomatis?", "Tidak. Pilih bulan/hari atau hari/bulan secara eksplisit."),
  },
  th: {
    "uk-postcode-formatter": e("จัดรูปแบบรหัสไปรษณีย์สหราชอาณาจักรที่รองรับเป็นตัวพิมพ์ใหญ่และเว้นวรรคระหว่างรหัสสองส่วน", "sw1a1aa เปลี่ยนเป็น SW1A 1AA", "ตรวจลำดับตัวอักษรและตัวเลขตามรูปแบบ UK ไม่มีการค้นหาที่อยู่", "ยืนยันได้ไหมว่าที่อยู่จัดส่งได้", "ไม่ได้ ตรวจเฉพาะรูปแบบรหัสไปรษณีย์"),
    "australia-postcode-formatter": e("ตรวจว่ารหัสไปรษณีย์ออสเตรเลียมีตัวเลขครบสี่หลัก", "2000 ผ่านการตรวจรูปแบบสี่หลัก", "ป้อนตัวเลขสี่หลัก ไม่จับคู่รหัสกับเมืองหรือย่านชานเมือง", "ระบุชื่อชานเมืองได้ไหม", "ไม่ได้ ตรวจเฉพาะรูปแบบสี่หลัก"),
    "english-date-format-converter": e("แปลงวันที่ ISO เป็นแบบสหรัฐฯ เดือน/วัน/ปี หรือแบบ UK วัน/เดือน/ปีที่เลือก และปฏิเสธวันที่ที่ไม่มีจริง", "2026-03-04 เป็น 03/04/2026 ในโหมด US หรือ 04/03/2026 ในโหมด UK", "เลือก US หรือ UK เพราะลำดับต่างกัน ไม่มีการแปลงเขตเวลา", "ระบบเดาความหมายของ 03/04/2026 เองไหม", "ไม่ ต้องเลือกลำดับเดือน/วันหรือวัน/เดือน"),
  },
  it: {
    "uk-postcode-formatter": e("Normalizza uno schema postale britannico supportato in maiuscolo e inserisce uno spazio tra le due parti.", "sw1a1aa diventa SW1A 1AA.", "Controlla la sequenza britannica di lettere e cifre. Non cerca indirizzi.", "Conferma la consegna all'indirizzo?", "No. Verifica solo il formato postale."),
    "australia-postcode-formatter": e("Controlla che un codice postale australiano abbia esattamente quattro cifre.", "2000 supera il controllo a quattro cifre.", "Inserisci quattro cifre. Non associa il codice a città o sobborghi.", "Identifica il sobborgo?", "No. Controlla solo lo schema a quattro cifre."),
    "english-date-format-converter": e("Converte una data ISO nel formato USA mese/giorno/anno o UK giorno/mese/anno scelto e rifiuta date impossibili.", "2026-03-04 diventa 03/04/2026 in modalità US o 04/03/2026 in modalità UK.", "Scegli US o UK perché l'ordine varia. Non converte i fusi orari.", "Deduce il significato di 03/04/2026?", "No. Seleziona esplicitamente mese/giorno o giorno/mese."),
  },
  nl: {
    "uk-postcode-formatter": e("Normaliseert een ondersteund Brits postcodepatroon naar hoofdletters en zet een spatie tussen de twee codegedeelten.", "sw1a1aa wordt SW1A 1AA.", "Controleer de Britse letter- en cijferreeks. Er wordt geen adres opgezocht.", "Bevestigt de tool dat het adres bezorgbaar is?", "Nee. Alleen het postcodeformaat wordt gecontroleerd."),
    "australia-postcode-formatter": e("Controleert of een Australische postcode precies vier cijfers bevat.", "2000 slaagt voor de controle op vier cijfers.", "Voer vier cijfers in. De code wordt niet aan een stad of buitenwijk gekoppeld.", "Wordt de buitenwijk herkend?", "Nee. Alleen het viercijferpatroon wordt gecontroleerd."),
    "english-date-format-converter": e("Zet een ISO-datum om naar de gekozen Amerikaanse maand/dag/jaar- of Britse dag/maand/jaar-notatie en weigert onmogelijke datums.", "2026-03-04 wordt 03/04/2026 in US-modus of 04/03/2026 in UK-modus.", "Kies US of UK omdat de volgorde verschilt. Tijdzones worden niet omgerekend.", "Kan de tool de betekenis van 03/04/2026 afleiden?", "Nee. Kies expliciet maand/dag of dag/maand."),
  },
  hi: {
    "uk-postcode-formatter": e("समर्थित UK पोस्टकोड को बड़े अक्षरों में बदलकर दोनों कोड भागों के बीच रिक्त स्थान जोड़ता है।", "sw1a1aa बदलकर SW1A 1AA होता है।", "UK अक्षर-अंक क्रम देखें। पते की खोज नहीं होती।", "क्या यह बताता है कि पते पर डिलीवरी होगी?", "नहीं। केवल पोस्टकोड प्रारूप जाँचा जाता है।"),
    "australia-postcode-formatter": e("जाँचता है कि ऑस्ट्रेलियाई पोस्टकोड ठीक चार अंकों का है।", "2000 चार-अंक प्रारूप जाँच पास करता है।", "चार अंक दें। कोड को शहर या उपनगर से नहीं मिलाया जाता।", "क्या यह उपनगर का नाम बताता है?", "नहीं। केवल चार-अंक पैटर्न जाँचता है।"),
    "english-date-format-converter": e("ISO तारीख को चुने गए अमेरिकी महीना/दिन/वर्ष या ब्रिटिश दिन/महीना/वर्ष क्रम में बदलता है और असंभव तारीख अस्वीकार करता है।", "2026-03-04 अमेरिकी मोड में 03/04/2026 और UK मोड में 04/03/2026 होता है।", "US या UK क्रम चुनें क्योंकि स्थानीय क्रम अलग है। समय क्षेत्र नहीं बदलता।", "क्या यह 03/04/2026 का अर्थ खुद पहचानता है?", "नहीं। महीना/दिन या दिन/महीना चुनें।"),
  },
  ru: {
    "uk-postcode-formatter": e("Приводит поддерживаемый британский почтовый индекс к верхнему регистру и вставляет пробел между частями.", "sw1a1aa становится SW1A 1AA.", "Проверьте британскую последовательность букв и цифр. Адрес не ищется.", "Подтверждается доставка по адресу?", "Нет. Проверяется только формат индекса."),
    "australia-postcode-formatter": e("Проверяет, состоит ли австралийский почтовый индекс ровно из четырех цифр.", "2000 проходит проверку четырехзначного формата.", "Введите четыре цифры. Индекс не сопоставляется с городом или пригородом.", "Определяется название пригорода?", "Нет. Проверяется только шаблон из четырех цифр."),
    "english-date-format-converter": e("Преобразует ISO-дату в выбранный формат США месяц/день/год или Великобритании день/месяц/год и отклоняет невозможные даты.", "2026-03-04 становится 03/04/2026 в режиме US или 04/03/2026 в режиме UK.", "Выберите US или UK, поскольку порядок различается. Часовой пояс не меняется.", "Можно автоматически понять смысл 03/04/2026?", "Нет. Явно выберите месяц/день или день/месяц."),
  },
  tr: {
    "uk-postcode-formatter": e("Desteklenen Birleşik Krallık posta kodunu büyük harfe çevirir ve iki kod bölümü arasına boşluk ekler.", "sw1a1aa, SW1A 1AA olur.", "İngiliz harf-rakam dizilimini kontrol edin. Adres aranmaz.", "Adrese teslim edilebildiğini doğrular mı?", "Hayır. Yalnızca posta kodu biçimi denetlenir."),
    "australia-postcode-formatter": e("Avustralya posta kodunun tam dört rakam olup olmadığını kontrol eder.", "2000 dört rakam biçim kontrolünden geçer.", "Dört rakam girin. Kod şehir veya banliyöyle eşleştirilmez.", "Banliyö adını belirler mi?", "Hayır. Yalnızca dört rakam kalıbı denetlenir."),
    "english-date-format-converter": e("ISO tarihini seçilen ABD ay/gün/yıl veya Birleşik Krallık gün/ay/yıl biçimine çevirir ve imkânsız tarihleri reddeder.", "2026-03-04, US modunda 03/04/2026; UK modunda 04/03/2026 olur.", "Sıra farklı olduğundan US veya UK seçin. Saat dilimi dönüşümü yapılmaz.", "03/04/2026 değerinin anlamını tahmin eder mi?", "Hayır. Ay/gün veya gün/ay sırasını seçin."),
  },
  pl: {
    "uk-postcode-formatter": e("Normalizuje obsługiwany brytyjski kod pocztowy do wielkich liter i wstawia spację między częściami.", "sw1a1aa zmienia się w SW1A 1AA.", "Sprawdź brytyjski układ liter i cyfr. Adres nie jest wyszukiwany.", "Czy potwierdza możliwość doręczenia?", "Nie. Sprawdzany jest tylko format kodu."),
    "australia-postcode-formatter": e("Sprawdza, czy australijski kod pocztowy składa się dokładnie z czterech cyfr.", "2000 przechodzi kontrolę czterech cyfr.", "Wpisz cztery cyfry. Kod nie jest łączony z miastem ani przedmieściem.", "Czy rozpoznaje nazwę przedmieścia?", "Nie. Sprawdza tylko wzorzec czterech cyfr."),
    "english-date-format-converter": e("Konwertuje datę ISO na wybrany amerykański układ miesiąc/dzień/rok lub brytyjski dzień/miesiąc/rok i odrzuca niemożliwe daty.", "2026-03-04 to 03/04/2026 w trybie US albo 04/03/2026 w trybie UK.", "Wybierz US lub UK, ponieważ kolejność jest inna. Strefa czasowa nie jest zmieniana.", "Czy rozpozna znaczenie 03/04/2026?", "Nie. Wybierz jawnie miesiąc/dzień lub dzień/miesiąc."),
  },
  fil: {
    "uk-postcode-formatter": e("Ginagawang malaking titik ang suportadong UK postcode at naglalagay ng espasyo sa pagitan ng dalawang bahagi ng code.", "Nagiging SW1A 1AA ang sw1a1aa.", "Suriin ang ayos ng letra at digit sa UK. Walang address na hinahanap.", "Kinukumpirma ba ang paghahatid sa address?", "Hindi. Format ng postcode lang ang sinusuri."),
    "australia-postcode-formatter": e("Sinusuri kung eksaktong apat na digit ang Australian postcode.", "Pumapasa ang 2000 sa format check na apat na digit.", "Apat na digit ang ilagay. Hindi iniuugnay ang code sa lungsod o suburb.", "Tinutukoy ba ang pangalan ng suburb?", "Hindi. Pattern na apat na digit lang ang sinusuri."),
    "english-date-format-converter": e("Kinokonvert ang ISO date sa napiling US na buwan/araw/taon o UK na araw/buwan/taon at tinatanggihan ang imposibleng petsa.", "Nagiging 03/04/2026 ang 2026-03-04 sa US mode o 04/03/2026 sa UK mode.", "Piliin ang US o UK dahil magkaiba ang ayos. Walang time-zone conversion.", "Kaya ba nitong hulaan ang kahulugan ng 03/04/2026?", "Hindi. Piliin nang malinaw ang buwan/araw o araw/buwan."),
  },
  bn: {
    "uk-postcode-formatter": e("সমর্থিত UK পোস্টকোড বড় হাতের অক্ষরে করে দুই অংশের মাঝে ফাঁক বসায়।", "sw1a1aa হয় SW1A 1AA।", "UK অক্ষর-সংখ্যার ক্রম পরীক্ষা করুন। ঠিকানা খোঁজা হয় না।", "ঠিকানায় ডেলিভারি নিশ্চিত করে?", "না। শুধু পোস্টকোডের বিন্যাস পরীক্ষা হয়।"),
    "australia-postcode-formatter": e("অস্ট্রেলীয় পোস্টকোড ঠিক চার অঙ্কের কি না পরীক্ষা করে।", "2000 চার অঙ্কের বিন্যাস পরীক্ষায় পাস করে।", "চার অঙ্ক দিন। শহর বা উপশহরের সঙ্গে মিলিয়ে দেখে না।", "উপশহরের নাম শনাক্ত করে?", "না। শুধু চার অঙ্কের ধরন পরীক্ষা করে।"),
    "english-date-format-converter": e("ISO তারিখকে নির্বাচিত US মাস/দিন/বছর বা UK দিন/মাস/বছর রীতিতে বদলায় এবং অসম্ভব তারিখ প্রত্যাখ্যান করে।", "2026-03-04 US মোডে 03/04/2026, UK মোডে 04/03/2026 হয়।", "ক্রম আলাদা বলে US বা UK বেছে নিন। সময় অঞ্চল বদলায় না।", "03/04/2026-এর অর্থ নিজে বুঝে নেয়?", "না। মাস/দিন বা দিন/মাস স্পষ্টভাবে বেছে নিন।"),
  },
  uk: {
    "uk-postcode-formatter": e("Нормалізує підтримуваний британський поштовий індекс у верхній регістр і вставляє пробіл між частинами.", "sw1a1aa стає SW1A 1AA.", "Перевірте британський порядок літер і цифр. Адреса не шукається.", "Підтверджується доставка за адресою?", "Ні. Перевіряється лише формат індексу."),
    "australia-postcode-formatter": e("Перевіряє, чи має австралійський поштовий індекс рівно чотири цифри.", "2000 проходить перевірку формату з чотирьох цифр.", "Введіть чотири цифри. Індекс не зіставляється з містом чи передмістям.", "Визначається назва передмістя?", "Ні. Перевіряється лише шаблон із чотирьох цифр."),
    "english-date-format-converter": e("Перетворює ISO-дату на вибраний американський порядок місяць/день/рік або британський день/місяць/рік і відхиляє неможливі дати.", "2026-03-04 стає 03/04/2026 у режимі US або 04/03/2026 у режимі UK.", "Оберіть US або UK, оскільки порядок відрізняється. Часовий пояс не змінюється.", "Чи можна вгадати значення 03/04/2026?", "Ні. Явно виберіть місяць/день або день/місяць."),
  },
  ms: {
    "uk-postcode-formatter": e("Menormalkan poskod UK yang disokong kepada huruf besar dan meletakkan ruang antara dua bahagian kod.", "sw1a1aa menjadi SW1A 1AA.", "Semak susunan huruf dan digit UK. Alamat tidak dicari.", "Adakah kebolehhantaran alamat disahkan?", "Tidak. Format poskod sahaja diperiksa."),
    "australia-postcode-formatter": e("Memeriksa sama ada poskod Australia mengandungi tepat empat digit.", "2000 lulus semakan format empat digit.", "Masukkan empat digit. Kod tidak dipadankan dengan bandar atau pinggir bandar.", "Adakah nama pinggir bandar dikenal pasti?", "Tidak. Pola empat digit sahaja diperiksa."),
    "english-date-format-converter": e("Menukar tarikh ISO kepada susunan AS bulan/hari/tahun atau UK hari/bulan/tahun yang dipilih dan menolak tarikh mustahil.", "2026-03-04 menjadi 03/04/2026 dalam mod US atau 04/03/2026 dalam mod UK.", "Pilih US atau UK kerana susunannya berbeza. Zon masa tidak ditukar.", "Bolehkah maksud 03/04/2026 diteka?", "Tidak. Pilih bulan/hari atau hari/bulan dengan jelas."),
  },
  sv: {
    "uk-postcode-formatter": e("Normaliserar ett brittiskt postnummermönster till versaler och infogar ett mellanslag mellan koddelarna.", "sw1a1aa blir SW1A 1AA.", "Kontrollera brittisk ordning av bokstäver och siffror. Ingen adress söks.", "Bekräftas att adressen kan levereras?", "Nej. Endast postnummerformatet kontrolleras."),
    "australia-postcode-formatter": e("Kontrollerar om ett australiskt postnummer består av exakt fyra siffror.", "2000 klarar kontrollen av fyrsiffrigt format.", "Ange fyra siffror. Koden kopplas inte till en ort eller förort.", "Identifieras förortens namn?", "Nej. Bara fyrsiffermönstret kontrolleras."),
    "english-date-format-converter": e("Konverterar ISO-datum till valt amerikanskt månad/dag/år eller brittiskt dag/månad/år och avvisar omöjliga datum.", "2026-03-04 blir 03/04/2026 i US-läge eller 04/03/2026 i UK-läge.", "Välj US eller UK eftersom ordningen skiljer sig. Tidszoner konverteras inte.", "Kan betydelsen av 03/04/2026 avgöras automatiskt?", "Nej. Välj månad/dag eller dag/månad uttryckligen."),
  },
  cs: {
    "uk-postcode-formatter": e("Převede podporovaný britský poštovní vzor na velká písmena a vloží mezeru mezi části kódu.", "sw1a1aa se změní na SW1A 1AA.", "Zkontrolujte britské pořadí písmen a číslic. Adresa se nehledá.", "Potvrzuje možnost doručení na adresu?", "Ne. Ověřuje se pouze formát kódu."),
    "australia-postcode-formatter": e("Ověřuje, zda má australské poštovní směrovací číslo přesně čtyři číslice.", "2000 projde kontrolou čtyřmístného formátu.", "Zadejte čtyři číslice. Kód se nepřiřazuje k městu ani předměstí.", "Určí název předměstí?", "Ne. Kontroluje se pouze vzor čtyř číslic."),
    "english-date-format-converter": e("Převádí ISO datum na zvolený americký formát měsíc/den/rok nebo britský den/měsíc/rok a odmítá nemožná data.", "2026-03-04 je v režimu US 03/04/2026 a v režimu UK 04/03/2026.", "Zvolte US nebo UK, protože pořadí se liší. Časová pásma se nepřevádějí.", "Pozná význam 03/04/2026 automaticky?", "Ne. Výslovně zvolte měsíc/den nebo den/měsíc."),
  },
  ro: {
    "uk-postcode-formatter": e("Normalizează un cod poștal britanic acceptat la majuscule și inserează spațiu între cele două părți.", "sw1a1aa devine SW1A 1AA.", "Verifică ordinea britanică a literelor și cifrelor. Adresa nu este căutată.", "Confirmă livrarea la adresă?", "Nu. Este verificat doar formatul codului."),
    "australia-postcode-formatter": e("Verifică dacă un cod poștal australian are exact patru cifre.", "2000 trece verificarea formatului cu patru cifre.", "Introdu patru cifre. Codul nu este asociat unui oraș sau unei suburbii.", "Identifică numele suburbiei?", "Nu. Verifică doar modelul de patru cifre."),
    "english-date-format-converter": e("Convertește data ISO în formatul american lună/zi/an sau britanic zi/lună/an ales și respinge datele imposibile.", "2026-03-04 devine 03/04/2026 în modul US sau 04/03/2026 în modul UK.", "Alege US sau UK deoarece ordinea diferă. Fusul orar nu se convertește.", "Poate deduce sensul lui 03/04/2026?", "Nu. Selectează explicit lună/zi sau zi/lună."),
  },
  el: {
    "uk-postcode-formatter": e("Κανονικοποιεί υποστηριζόμενο βρετανικό ταχυδρομικό κώδικα σε κεφαλαία και εισάγει κενό ανάμεσα στα δύο τμήματα.", "Το sw1a1aa γίνεται SW1A 1AA.", "Ελέγξτε τη βρετανική σειρά γραμμάτων και ψηφίων. Δεν αναζητείται διεύθυνση.", "Επιβεβαιώνεται ότι παραδίδεται στη διεύθυνση;", "Όχι. Ελέγχεται μόνο η μορφή του κώδικα."),
    "australia-postcode-formatter": e("Ελέγχει αν ένας αυστραλιανός ταχυδρομικός κώδικας έχει ακριβώς τέσσερα ψηφία.", "Το 2000 περνά τον έλεγχο τετραψήφιου κώδικα.", "Εισαγάγετε τέσσερα ψηφία. Δεν αντιστοιχίζεται ο κώδικας σε πόλη ή προάστιο.", "Αναγνωρίζει το όνομα του προαστίου;", "Όχι. Ελέγχεται μόνο το μοτίβο τεσσάρων ψηφίων."),
    "english-date-format-converter": e("Μετατρέπει ημερομηνία ISO στην επιλεγμένη αμερικανική σειρά μήνας/ημέρα/έτος ή βρετανική ημέρα/μήνας/έτος και απορρίπτει αδύνατες ημερομηνίες.", "Το 2026-03-04 γίνεται 03/04/2026 σε λειτουργία US ή 04/03/2026 σε λειτουργία UK.", "Επιλέξτε US ή UK επειδή η σειρά διαφέρει. Δεν γίνεται μετατροπή ζώνης ώρας.", "Μπορεί να συναγάγει τη σημασία του 03/04/2026;", "Όχι. Επιλέξτε ρητά μήνας/ημέρα ή ημέρα/μήνας."),
  },
};
