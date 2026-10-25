import type { TargetPageMessageLocale } from "./target-page-messages";

export type TargetCountryWorkspaceCopy = {
  example: string;
  privacyNotice: string;
  conventions: string;
  checkInput: string;
  validFormat: string;
  validChecksum: string;
  formatDisclaimer: string;
  direction: string;
  simplifiedToTraditional: string;
  traditionalToSimplified: string;
  arabicToChinese: string;
  chineseToArabic: string;
  year: string;
  checkFormat: string;
  formatOrChecksumInvalid: string;
  isoToLocal: string;
  localToIso: string;
  usDateFormat: string;
  ukDateFormat: string;
  ambiguousDate: string;
  phonePostalDisclaimer: string;
  cycleNote: string;
};

export const targetCountryWorkspaceCopy = {
  fil: {
    example: "Halimbawa: ",
    privacyNotice: "Pinoproseso ang inilagay sa browser at hindi ito ipinapadala sa server.",
    conventions: "I-convert o suriin ang format ayon sa mga tuntunin ng bansang tinutukoy ng tool na ito.",
    checkInput: "Suriin ang inilagay.", validFormat: "Wasto ang format.", validChecksum: "Wasto ang check digit.",
    formatDisclaimer: "Format lamang ang sinusuri; hindi kinukumpirma ang opisyal na pag-isyu o bisa sa totoong buhay.",
    direction: "Direksiyon", simplifiedToTraditional: "Pinasimple papuntang tradisyonal", traditionalToSimplified: "Tradisyonal papuntang pinasimple",
    arabicToChinese: "Mga numerong Arabiko papuntang numerong Tsino", chineseToArabic: "Mga numerong Tsino papuntang numerong Arabiko",
    year: "Taon", checkFormat: "Suriin ang format", formatOrChecksumInvalid: "Hindi wasto ang format o hindi tugma ang check digit.",
    isoToLocal: "ISO papuntang lokal na format", localToIso: "Lokal na format papuntang ISO", usDateFormat: "Format ng petsa sa US", ukDateFormat: "Format ng petsa sa UK",
    ambiguousDate: "Maaaring malabo ang pagkakasunod-sunod ng petsa. Piliin ang nilalayong ayos.",
    phonePostalDisclaimer: "Sinusuri ang format lamang; hindi kinukumpirma ang pagtatalaga o paggamit ng numero o address.",
    cycleNote: "Gumagamit ang pagkalkula ng zodiac ng nakatalagang kalendaryong Tsino. Maaaring mag-iba ang mga interpretasyon.",
  },
  bn: {
    example: "উদাহরণ: ",
    privacyNotice: "আপনার দেওয়া তথ্য ব্রাউজারেই প্রক্রিয়া করা হয় এবং সার্ভারে পাঠানো হয় না।",
    conventions: "এই টুলে উল্লেখিত দেশ বা অঞ্চলের নিয়ম অনুযায়ী ফরম্যাট রূপান্তর বা যাচাই করুন।",
    checkInput: "ইনপুট যাচাই করুন।", validFormat: "ফরম্যাটটি সঠিক।", validChecksum: "চেক ডিজিটটি সঠিক।",
    formatDisclaimer: "শুধু ফরম্যাট যাচাই করা হয়েছে; সরকারি ইস্যু বা বাস্তব বৈধতা নিশ্চিত করা হয়নি।",
    direction: "রূপান্তরের দিক", simplifiedToTraditional: "সরলীকৃত থেকে ঐতিহ্যবাহী", traditionalToSimplified: "ঐতিহ্যবাহী থেকে সরলীকৃত",
    arabicToChinese: "আরবি সংখ্যা থেকে চীনা সংখ্যায়", chineseToArabic: "চীনা সংখ্যা থেকে আরবি সংখ্যায়",
    year: "বছর", checkFormat: "ফরম্যাট যাচাই করুন", formatOrChecksumInvalid: "ফরম্যাটটি সঠিক নয় অথবা চেক ডিজিট মেলেনি।",
    isoToLocal: "ISO থেকে স্থানীয় ফরম্যাটে", localToIso: "স্থানীয় ফরম্যাট থেকে ISO-তে", usDateFormat: "মার্কিন তারিখের ফরম্যাট", ukDateFormat: "যুক্তরাজ্যের তারিখের ফরম্যাট",
    ambiguousDate: "তারিখের ক্রম অস্পষ্ট হতে পারে। উদ্দেশ্য অনুযায়ী ক্রম বেছে নিন।",
    phonePostalDisclaimer: "শুধু ফরম্যাট যাচাই হয়; নম্বর বা ঠিকানার বরাদ্দ কিংবা ব্যবহার যাচাই হয় না।",
    cycleNote: "রাশিচক্রের হিসাব চীনা ক্যালেন্ডারের নিয়ম অনুসরণ করে। ব্যাখ্যা ভিন্ন হতে পারে।",
  },
  uk: {
    example: "Приклад: ",
    privacyNotice: "Введені дані обробляються у браузері й не надсилаються на сервер.",
    conventions: "Перетворіть або перевірте формат за правилами країни чи регіону, зазначеного в інструменті.",
    checkInput: "Перевірте введені дані.", validFormat: "Формат правильний.", validChecksum: "Контрольна цифра правильна.",
    formatDisclaimer: "Перевіряється лише формат; офіційне присвоєння та фактична чинність не підтверджуються.",
    direction: "Напрямок", simplifiedToTraditional: "Спрощене на традиційне", traditionalToSimplified: "Традиційне на спрощене",
    arabicToChinese: "Арабські цифри на китайські числа", chineseToArabic: "Китайські числа на арабські цифри",
    year: "Рік", checkFormat: "Перевірити формат", formatOrChecksumInvalid: "Формат неправильний або контрольна цифра не збігається.",
    isoToLocal: "З ISO у місцевий формат", localToIso: "З місцевого формату в ISO", usDateFormat: "Формат дати США", ukDateFormat: "Формат дати Великої Британії",
    ambiguousDate: "Порядок дати може бути неоднозначним. Виберіть потрібний формат.",
    phonePostalDisclaimer: "Перевіряється лише формат; належність номера чи адреси та їх фактичне використання не підтверджуються.",
    cycleNote: "Розрахунок китайського зодіаку використовує календарні правила Китаю. Тлумачення можуть відрізнятися.",
  },
  ms: {
    example: "Contoh: ",
    privacyNotice: "Input diproses dalam pelayar dan tidak dihantar ke pelayan.",
    conventions: "Tukar atau semak format mengikut peraturan negara atau wilayah yang dinyatakan oleh alat ini.",
    checkInput: "Semak input.", validFormat: "Format ini sah.", validChecksum: "Digit semakan ini sah.",
    formatDisclaimer: "Format sahaja yang disemak; pengeluaran rasmi atau kesahihan sebenar tidak disahkan.",
    direction: "Arah", simplifiedToTraditional: "Ringkas kepada tradisional", traditionalToSimplified: "Tradisional kepada ringkas",
    arabicToChinese: "Angka Arab kepada angka Cina", chineseToArabic: "Angka Cina kepada angka Arab",
    year: "Tahun", checkFormat: "Semak format", formatOrChecksumInvalid: "Format tidak sah atau digit semakan tidak sepadan.",
    isoToLocal: "ISO kepada format tempatan", localToIso: "Format tempatan kepada ISO", usDateFormat: "Format tarikh AS", ukDateFormat: "Format tarikh UK",
    ambiguousDate: "Susunan tarikh mungkin tidak jelas. Pilih susunan yang dimaksudkan.",
    phonePostalDisclaimer: "Format sahaja yang disemak; pemilikan atau penggunaan nombor dan alamat tidak disahkan.",
    cycleNote: "Pengiraan zodiak menggunakan peraturan kalendar Cina. Tafsirannya mungkin berbeza.",
  },
  sv: {
    example: "Exempel: ",
    privacyNotice: "Inmatningen bearbetas i webbläsaren och skickas inte till en server.",
    conventions: "Konvertera eller kontrollera formatet enligt reglerna för landet eller regionen som verktyget gäller.",
    checkInput: "Kontrollera inmatningen.", validFormat: "Formatet är giltigt.", validChecksum: "Kontrollsiffran är giltig.",
    formatDisclaimer: "Endast formatet kontrolleras. Officiell utfärdning eller faktisk giltighet verifieras inte.",
    direction: "Riktning", simplifiedToTraditional: "Förenklad till traditionell", traditionalToSimplified: "Traditionell till förenklad",
    arabicToChinese: "Arabiska siffror till kinesiska tal", chineseToArabic: "Kinesiska tal till arabiska siffror",
    year: "År", checkFormat: "Kontrollera formatet", formatOrChecksumInvalid: "Formatet är ogiltigt eller kontrollsiffran stämmer inte.",
    isoToLocal: "ISO till lokalt format", localToIso: "Lokalt format till ISO", usDateFormat: "Amerikanskt datumformat", ukDateFormat: "Brittiskt datumformat",
    ambiguousDate: "Datumordningen kan vara tvetydig. Välj den avsedda ordningen.",
    phonePostalDisclaimer: "Endast formatet kontrolleras. Nummer eller adress verifieras inte mot något register.",
    cycleNote: "Kinesisk zodiak beräknas enligt kinesiska kalenderregler. Tolkningar kan variera.",
  },
  cs: {
    example: "Příklad: ",
    privacyNotice: "Zadané údaje se zpracovávají v prohlížeči a neodesílají se na server.",
    conventions: "Převeďte nebo ověřte formát podle pravidel země či oblasti, které se nástroj týká.",
    checkInput: "Zkontrolujte vstup.", validFormat: "Formát je platný.", validChecksum: "Kontrolní číslice je platná.",
    formatDisclaimer: "Ověřuje se pouze formát; úřední vydání ani skutečná platnost se nepotvrzuje.",
    direction: "Směr", simplifiedToTraditional: "Zjednodušené na tradiční", traditionalToSimplified: "Tradiční na zjednodušené",
    arabicToChinese: "Arabské číslice na čínské číslovky", chineseToArabic: "Čínské číslovky na arabské číslice",
    year: "Rok", checkFormat: "Ověřit formát", formatOrChecksumInvalid: "Formát není platný nebo kontrolní číslice nesouhlasí.",
    isoToLocal: "Z ISO do místního formátu", localToIso: "Z místního formátu do ISO", usDateFormat: "Americký formát data", ukDateFormat: "Britský formát data",
    ambiguousDate: "Pořadí data může být nejednoznačné. Vyberte zamýšlené pořadí.",
    phonePostalDisclaimer: "Ověřuje se pouze formát; přidělení ani skutečné použití čísla či adresy se neověřuje.",
    cycleNote: "Výpočet čínského zvěrokruhu používá pravidla čínského kalendáře. Výklady se mohou lišit.",
  },
  ro: {
    example: "Exemplu: ",
    privacyNotice: "Datele introduse sunt procesate în browser și nu sunt trimise către un server.",
    conventions: "Convertește sau verifică formatul conform regulilor țării ori regiunii indicate de instrument.",
    checkInput: "Verifică datele introduse.", validFormat: "Formatul este valid.", validChecksum: "Cifra de control este validă.",
    formatDisclaimer: "Se verifică doar formatul; emiterea oficială sau valabilitatea reală nu este confirmată.",
    direction: "Direcție", simplifiedToTraditional: "Simplificat în tradițional", traditionalToSimplified: "Tradițional în simplificat",
    arabicToChinese: "Cifre arabe în numere chinezești", chineseToArabic: "Numere chinezești în cifre arabe",
    year: "An", checkFormat: "Verifică formatul", formatOrChecksumInvalid: "Formatul nu este valid sau cifra de control nu corespunde.",
    isoToLocal: "ISO în format local", localToIso: "Format local în ISO", usDateFormat: "Format de dată american", ukDateFormat: "Format de dată britanic",
    ambiguousDate: "Ordinea datei poate fi ambiguă. Alege ordinea dorită.",
    phonePostalDisclaimer: "Se verifică doar formatul; alocarea sau utilizarea reală a numărului ori adresei nu este verificată.",
    cycleNote: "Zodiacul chinezesc este calculat după regulile calendarului chinezesc. Interpretările pot varia.",
  },
  el: {
    example: "Παράδειγμα: ",
    privacyNotice: "Τα δεδομένα υποβάλλονται σε επεξεργασία στο πρόγραμμα περιήγησης και δεν αποστέλλονται σε διακομιστή.",
    conventions: "Μετατρέψτε ή ελέγξτε τη μορφή σύμφωνα με τους κανόνες της χώρας ή της περιοχής που αναφέρει το εργαλείο.",
    checkInput: "Ελέγξτε τα δεδομένα.", validFormat: "Η μορφή είναι έγκυρη.", validChecksum: "Το ψηφίο ελέγχου είναι έγκυρο.",
    formatDisclaimer: "Ελέγχεται μόνο η μορφή· δεν επιβεβαιώνεται η επίσημη έκδοση ή η πραγματική ισχύς.",
    direction: "Κατεύθυνση", simplifiedToTraditional: "Απλοποιημένη σε παραδοσιακή", traditionalToSimplified: "Παραδοσιακή σε απλοποιημένη",
    arabicToChinese: "Αραβικοί αριθμοί σε κινεζικούς αριθμούς", chineseToArabic: "Κινεζικοί αριθμοί σε αραβικούς αριθμούς",
    year: "Έτος", checkFormat: "Έλεγχος μορφής", formatOrChecksumInvalid: "Η μορφή δεν είναι έγκυρη ή το ψηφίο ελέγχου δεν ταιριάζει.",
    isoToLocal: "ISO σε τοπική μορφή", localToIso: "Τοπική μορφή σε ISO", usDateFormat: "Μορφή ημερομηνίας ΗΠΑ", ukDateFormat: "Μορφή ημερομηνίας Ηνωμένου Βασιλείου",
    ambiguousDate: "Η σειρά της ημερομηνίας μπορεί να είναι ασαφής. Επιλέξτε την επιθυμητή σειρά.",
    phonePostalDisclaimer: "Ελέγχεται μόνο η μορφή· δεν επαληθεύεται η εκχώρηση ή η πραγματική χρήση αριθμού ή διεύθυνσης.",
    cycleNote: "Ο κινεζικός ζωδιακός υπολογίζεται με τους κανόνες του κινεζικού ημερολογίου. Οι ερμηνείες διαφέρουν.",
  },
} satisfies Record<TargetPageMessageLocale, TargetCountryWorkspaceCopy>;
