import type { SevenTargetLocale, TargetSevenToolTranslation } from "./target-seven-tools-translations";

type Copy = { category: string; choose: string; review: string; caution: string; faq: string; faqPrivacy: string };
const copy: Record<SevenTargetLocale, Copy> = {
  bn: { category: "ফাইল ও ডেভেলপার টুল", choose: "প্রয়োজনীয় ফাইল নির্বাচন করুন।", review: "ফলাফল পরীক্ষা করুন এবং প্রয়োজনে মানটি কপি করুন।", caution: "ফাইল আপনার ব্রাউজারেই প্রক্রিয়া হয়; ব্যক্তিগত ফাইল সার্ভারে পাঠানো হয় না।", faq: "ফাইলটি কোথায় প্রক্রিয়া হয়?", faqPrivacy: "প্রক্রিয়ার সময় কি ফাইলের বিষয়বস্তু সার্ভারে যায়?" },
  uk: { category: "Файли й інструменти розробника", choose: "Виберіть потрібний файл або файли.", review: "Перевірте результат і за потреби скопіюйте значення.", caution: "Файл обробляється у браузері; приватні файли не надсилаються на сервер.", faq: "Де обробляється файл?", faqPrivacy: "Чи надсилається вміст файлу на сервер під час обробки?" },
  ms: { category: "Fail dan pembangun", choose: "Pilih fail yang diperlukan.", review: "Semak hasilnya dan salin nilai jika perlu.", caution: "Fail diproses dalam pelayar; fail peribadi tidak dihantar ke pelayan.", faq: "Di manakah fail diproses?", faqPrivacy: "Adakah kandungan fail dihantar ke pelayan semasa pemprosesan?" },
  sv: { category: "Filer och utvecklarverktyg", choose: "Välj den eller de filer som behövs.", review: "Granska resultatet och kopiera värdet vid behov.", caution: "Filen bearbetas i webbläsaren; privata filer skickas inte till en server.", faq: "Var bearbetas filen?", faqPrivacy: "Skickas filinnehållet till en server under bearbetningen?" },
  cs: { category: "Soubory a nástroje pro vývojáře", choose: "Vyberte potřebný soubor nebo soubory.", review: "Zkontrolujte výsledek a podle potřeby hodnotu zkopírujte.", caution: "Soubor se zpracuje v prohlížeči; soukromé soubory se na server neodesílají.", faq: "Kde se soubor zpracovává?", faqPrivacy: "Odesílá se při zpracování obsah souboru na server?" },
  ro: { category: "Fișiere și instrumente pentru dezvoltatori", choose: "Alegeți fișierul sau fișierele necesare.", review: "Verificați rezultatul și copiați valoarea dacă este nevoie.", caution: "Fișierul este procesat în browser; fișierele private nu sunt trimise la server.", faq: "Unde este procesat fișierul?", faqPrivacy: "Este trimis conținutul fișierului la server în timpul procesării?" },
  el: { category: "Αρχεία και εργαλεία προγραμματιστών", choose: "Επιλέξτε το αρχείο ή τα αρχεία που χρειάζεστε.", review: "Ελέγξτε το αποτέλεσμα και αντιγράψτε την τιμή αν χρειάζεται.", caution: "Το αρχείο επεξεργάζεται στο πρόγραμμα περιήγησης· ιδιωτικά αρχεία δεν αποστέλλονται σε διακομιστή.", faq: "Πού γίνεται η επεξεργασία του αρχείου;", faqPrivacy: "Αποστέλλεται το περιεχόμενο του αρχείου σε διακομιστή κατά την επεξεργασία;" },
};

const seoTail: Record<SevenTargetLocale, string> = {
  bn: "দ্রুত এবং সহজে ফলাফল দেখুন।",
  uk: "Швидко та зручно перегляньте результат.",
  ms: "Lihat hasil dengan pantas dan mudah.",
  sv: "Se resultatet snabbt och enkelt.",
  cs: "Výsledek si prohlédněte rychle a snadno.",
  ro: "Consultați rezultatul rapid și ușor.",
  el: "Δείτε το αποτέλεσμα γρήγορα και εύκολα.",
};

function entry(locale: SevenTargetLocale, title: string, description: string, keyword: string, action: string, example: string, options: string): TargetSevenToolTranslation {
  const ui = copy[locale];
  return { title, description, seoTitle: `${title} | Woori Tools`, seoDescription: `${description} ${seoTail[locale]}`, category: ui.category, keywords: [keyword, title], steps: [ui.choose, action, ui.review], example, options, caution: ui.caution, faq: { example: ui.faq, caution: ui.faqPrivacy } };
}

const files: Record<SevenTargetLocale, Record<string, TargetSevenToolTranslation>> = {
  bn: {
    "mime-type-checker": entry("bn", "MIME টাইপ পরীক্ষক", "ফাইলের ধরন ও নির্বাচিত ফাইলের MIME তথ্য শনাক্ত করুন।", "MIME টাইপ পরীক্ষক", "MIME ধরন এবং ফাইলের ধরন দেখুন।", "একটি ডাউনলোড করা ফাইলের MIME ধরন পরীক্ষা করুন।", "ফাইলের ধরন অনুযায়ী MIME মান দেখানো হয়।"),
    "file-extension-checker": entry("bn", "ফাইল এক্সটেনশন পরীক্ষক", "ফাইলের নাম বা ফাইল নির্বাচন করে এক্সটেনশন ও ধরন যাচাই করুন।", "ফাইল এক্সটেনশন যাচাই", "ফাইলের এক্সটেনশন ও ধরন যাচাই করুন।", "একটি ফাইলের এক্সটেনশন দেখে সেটি কোন ধরনের তা বুঝুন।", "নাম থেকে এক্সটেনশন শনাক্ত করা হয়; এটি ফাইলের নিরাপত্তা যাচাই নয়।"),
    "file-size-checker": entry("bn", "ফাইলের আকার পরীক্ষক", "ফাইলের আকার বাইট ও পাঠযোগ্য এককে দেখুন।", "ফাইলের আকার পরীক্ষা", "ফাইলের আকার ও একক দেখুন।", "আপলোডের আগে একটি ছবির আকার পরীক্ষা করুন।", "আকার বাইট ও বড় এককে দেখানো হয়।"),
    "duplicate-file-checker": entry("bn", "ডুপ্লিকেট ফাইল খুঁজুন", "একাধিক ফাইলের বিষয়বস্তু তুলনা করে একই ফাইলের কপি শনাক্ত করুন।", "ডুপ্লিকেট ফাইল খোঁজা", "নির্বাচিত ফাইলগুলোর হ্যাশ তুলনা করে অভিন্ন কপি চিহ্নিত করুন।", "একই ফাইল একাধিকবার আছে কি না পরীক্ষা করুন।", "ফাইলের বিষয়বস্তু মিলিয়ে দেখা হয়; শুধু নাম এক হওয়া যথেষ্ট নয়।"),
    "zip-files": entry("bn", "ফাইল ZIP আর্কাইভে রাখুন", "একাধিক ফাইল ব্রাউজারেই ZIP আর্কাইভে সংকুচিত করুন।", "ফাইল ZIP করা", "নির্বাচিত ফাইলগুলো ZIP আর্কাইভে তৈরি করুন।", "কয়েকটি নথি এক ZIP ফাইলে সাজান।", "ফাইলের আকার ও ব্রাউজারের মেমোরি সীমা প্রযোজ্য।"),
  },
  uk: {
    "mime-type-checker": entry("uk", "Перевірка MIME-типу", "Визначте тип файлу та перегляньте MIME-дані вибраного файлу.", "перевірка MIME-типу", "Перегляньте MIME-тип і визначений формат файлу.", "Перевірте MIME-тип завантаженого файлу.", "MIME-значення залежить від формату файлу."),
    "file-extension-checker": entry("uk", "Перевірка розширення файлу", "Перевірте розширення та тип за назвою або вибраним файлом.", "перевірка розширення файлу", "Визначте розширення та формат файлу.", "З’ясуйте формат за розширенням файлу.", "Розширення назви не є перевіркою безпеки вмісту файлу."),
    "file-size-checker": entry("uk", "Перевірка розміру файлу", "Перегляньте розмір файлу в байтах і зручних для читання одиницях.", "перевірка розміру файлу", "Перегляньте розмір файлу та одиниці вимірювання.", "Перевірте розмір зображення перед надсиланням.", "Розмір показано в байтах і більших одиницях."),
    "duplicate-file-checker": entry("uk", "Пошук дублікатів файлів", "Порівняйте вміст кількох файлів і знайдіть ідентичні копії.", "пошук дублікатів файлів", "Порівняйте хеші вибраних файлів, щоб позначити однакові копії.", "Перевірте, чи є файл у кількох копіях.", "Порівнюється вміст; однакова назва файлу сама по собі не означає дублікат."),
    "zip-files": entry("uk", "Створення ZIP-архіву", "Стисніть кілька файлів у ZIP-архів безпосередньо у браузері.", "створити ZIP", "Створіть ZIP-архів із вибраних файлів.", "Зберіть кілька документів в один ZIP-файл.", "Діють обмеження розміру файлів і пам’яті браузера."),
  },
  ms: {
    "mime-type-checker": entry("ms", "Pemeriksa jenis MIME", "Kenal pasti jenis fail dan lihat maklumat MIME bagi fail pilihan.", "pemeriksa jenis MIME", "Lihat jenis MIME dan format fail yang dikenal pasti.", "Semak jenis MIME bagi fail yang dimuat turun.", "Nilai MIME bergantung pada format fail."),
    "file-extension-checker": entry("ms", "Pemeriksa sambungan fail", "Semak sambungan dan jenis fail daripada nama atau fail yang dipilih.", "semak sambungan fail", "Kenal pasti sambungan dan jenis fail.", "Kenal pasti jenis fail melalui sambungannya.", "Sambungan nama bukan pemeriksaan keselamatan kandungan fail."),
    "file-size-checker": entry("ms", "Pemeriksa saiz fail", "Lihat saiz fail dalam bait dan unit yang mudah dibaca.", "semak saiz fail", "Lihat saiz fail dan unitnya.", "Semak saiz imej sebelum menghantarnya.", "Saiz dipaparkan dalam bait dan unit yang lebih besar."),
    "duplicate-file-checker": entry("ms", "Cari fail pendua", "Bandingkan kandungan beberapa fail untuk mengenal pasti salinan yang sama.", "pencari fail pendua", "Bandingkan cincangan fail pilihan untuk mengesan salinan sepadan.", "Semak sama ada fail yang sama wujud beberapa kali.", "Kandungan fail dibandingkan; nama yang sama sahaja tidak bermakna fail pendua."),
    "zip-files": entry("ms", "Zip fail ke dalam arkib", "Mampatkan beberapa fail ke dalam arkib ZIP terus dalam pelayar.", "zip fail", "Cipta arkib ZIP daripada fail yang dipilih.", "Gabungkan beberapa dokumen ke dalam satu fail ZIP.", "Had saiz fail dan memori pelayar dikenakan."),
  },
  sv: {
    "mime-type-checker": entry("sv", "Kontrollera MIME-typ", "Identifiera filtypen och visa MIME-information för den valda filen.", "kontrollera MIME-typ", "Visa MIME-typ och identifierat filformat.", "Kontrollera MIME-typen för en nedladdad fil.", "MIME-värdet beror på filformatet."),
    "file-extension-checker": entry("sv", "Kontrollera filändelse", "Kontrollera filändelse och typ utifrån namn eller vald fil.", "kontrollera filändelse", "Identifiera filändelse och filtyp.", "Ta reda på filtypen från dess ändelse.", "Filnamnets ändelse verifierar inte filinnehållets säkerhet."),
    "file-size-checker": entry("sv", "Kontrollera filstorlek", "Visa filstorleken i byte och lättlästa enheter.", "kontrollera filstorlek", "Visa filstorlek och enhet.", "Kontrollera bildens storlek före delning.", "Storleken visas i byte och större enheter."),
    "duplicate-file-checker": entry("sv", "Hitta dubbletter av filer", "Jämför innehållet i flera filer för att hitta identiska kopior.", "hitta dubbla filer", "Jämför hashvärden för att markera identiska filer.", "Kontrollera om samma fil finns i flera kopior.", "Filinnehållet jämförs; samma namn innebär inte automatiskt en dubblett."),
    "zip-files": entry("sv", "Skapa ZIP-arkiv av filer", "Komprimera flera filer till ett ZIP-arkiv direkt i webbläsaren.", "komprimera filer till ZIP", "Skapa ett ZIP-arkiv av de valda filerna.", "Samla flera dokument i en ZIP-fil.", "Begränsningar för filstorlek och webbläsarminne gäller."),
  },
  cs: {
    "mime-type-checker": entry("cs", "Kontrola MIME typu", "Určete typ souboru a zobrazte MIME údaje vybraného souboru.", "kontrola MIME typu", "Zobrazte MIME typ a rozpoznaný formát souboru.", "Zkontrolujte MIME typ staženého souboru.", "Hodnota MIME závisí na formátu souboru."),
    "file-extension-checker": entry("cs", "Kontrola přípony souboru", "Ověřte příponu a typ podle názvu nebo vybraného souboru.", "kontrola přípony souboru", "Určete příponu a typ souboru.", "Zjistěte typ souboru podle jeho přípony.", "Přípona názvu neověřuje bezpečnost obsahu souboru."),
    "file-size-checker": entry("cs", "Kontrola velikosti souboru", "Zobrazte velikost souboru v bajtech a čitelných jednotkách.", "kontrola velikosti souboru", "Zobrazte velikost souboru a jednotky.", "Před odesláním zkontrolujte velikost obrázku.", "Velikost se zobrazuje v bajtech a vyšších jednotkách."),
    "duplicate-file-checker": entry("cs", "Vyhledání duplicitních souborů", "Porovnejte obsah několika souborů a najděte totožné kopie.", "vyhledání duplicitních souborů", "Porovnejte hashe vybraných souborů a označte shodné kopie.", "Zjistěte, zda se stejný soubor nachází ve více kopiích.", "Porovnává se obsah; stejný název sám o sobě neznamená duplicitu."),
    "zip-files": entry("cs", "Vytvoření ZIP archivu", "Zkomprimujte více souborů do ZIP archivu přímo v prohlížeči.", "vytvořit ZIP archiv", "Vytvořte ZIP archiv z vybraných souborů.", "Sbalte několik dokumentů do jednoho ZIP souboru.", "Platí omezení velikosti souborů a paměti prohlížeče."),
  },
  ro: {
    "mime-type-checker": entry("ro", "Verificator tip MIME", "Identificați tipul fișierului și consultați informațiile MIME ale fișierului ales.", "verificator tip MIME", "Consultați tipul MIME și formatul identificat.", "Verificați tipul MIME al unui fișier descărcat.", "Valoarea MIME depinde de formatul fișierului."),
    "file-extension-checker": entry("ro", "Verificator extensie fișier", "Verificați extensia și tipul după nume sau fișierul ales.", "verificare extensie fișier", "Identificați extensia și tipul fișierului.", "Aflați tipul unui fișier după extensie.", "Extensia numelui nu verifică siguranța conținutului fișierului."),
    "file-size-checker": entry("ro", "Verificator dimensiune fișier", "Consultați dimensiunea fișierului în octeți și unități ușor de citit.", "verificare dimensiune fișier", "Vedeți dimensiunea fișierului și unitatea.", "Verificați dimensiunea unei imagini înainte de trimitere.", "Dimensiunea este afișată în octeți și unități mai mari."),
    "duplicate-file-checker": entry("ro", "Găsire fișiere duplicate", "Comparați conținutul mai multor fișiere pentru a găsi copii identice.", "găsire fișiere duplicate", "Comparați hash-urile fișierelor selectate și marcați copiile identice.", "Verificați dacă același fișier apare de mai multe ori.", "Se compară conținutul; același nume nu înseamnă automat duplicat."),
    "zip-files": entry("ro", "Arhivare fișiere în ZIP", "Comprimați mai multe fișiere într-o arhivă ZIP direct în browser.", "arhivare fișiere ZIP", "Creați o arhivă ZIP din fișierele alese.", "Grupați mai multe documente într-un singur fișier ZIP.", "Se aplică limite de dimensiune a fișierelor și de memorie a browserului."),
  },
  el: {
    "mime-type-checker": entry("el", "Έλεγχος τύπου MIME", "Αναγνωρίστε τον τύπο αρχείου και δείτε τα στοιχεία MIME του επιλεγμένου αρχείου.", "έλεγχος τύπου MIME", "Δείτε τον τύπο MIME και τη μορφή αρχείου που αναγνωρίστηκε.", "Ελέγξτε τον τύπο MIME ενός ληφθέντος αρχείου.", "Η τιμή MIME εξαρτάται από τη μορφή αρχείου."),
    "file-extension-checker": entry("el", "Έλεγχος επέκτασης αρχείου", "Ελέγξτε την επέκταση και τον τύπο από το όνομα ή το επιλεγμένο αρχείο.", "έλεγχος επέκτασης αρχείου", "Αναγνωρίστε την επέκταση και τον τύπο αρχείου.", "Μάθετε τον τύπο αρχείου από την επέκτασή του.", "Η επέκταση ονόματος δεν ελέγχει την ασφάλεια του περιεχομένου."),
    "file-size-checker": entry("el", "Έλεγχος μεγέθους αρχείου", "Δείτε το μέγεθος αρχείου σε byte και ευανάγνωστες μονάδες.", "έλεγχος μεγέθους αρχείου", "Δείτε το μέγεθος και τη μονάδα του αρχείου.", "Ελέγξτε το μέγεθος εικόνας πριν την αποστολή.", "Το μέγεθος εμφανίζεται σε byte και μεγαλύτερες μονάδες."),
    "duplicate-file-checker": entry("el", "Εύρεση διπλότυπων αρχείων", "Συγκρίνετε το περιεχόμενο αρχείων για να εντοπίσετε πανομοιότυπα αντίγραφα.", "εύρεση διπλότυπων αρχείων", "Συγκρίνετε hash επιλεγμένων αρχείων και εντοπίστε αντίγραφα με ίδιο περιεχόμενο.", "Ελέγξτε αν το ίδιο αρχείο υπάρχει πολλές φορές.", "Συγκρίνεται το περιεχόμενο· ίδιο όνομα δεν σημαίνει απαραίτητα διπλότυπο."),
    "zip-files": entry("el", "Συμπίεση αρχείων σε ZIP", "Συμπιέστε πολλά αρχεία σε αρχείο ZIP απευθείας στο πρόγραμμα περιήγησης.", "συμπίεση αρχείων ZIP", "Δημιουργήστε αρχείο ZIP από τα επιλεγμένα αρχεία.", "Συγκεντρώστε πολλά έγγραφα σε ένα αρχείο ZIP.", "Ισχύουν όρια μεγέθους αρχείων και μνήμης προγράμματος περιήγησης."),
  },
};

export const targetSevenFileSlugs = ["mime-type-checker", "file-extension-checker", "file-size-checker", "duplicate-file-checker", "zip-files"] as const;

export function getTargetSevenFileTranslation(locale: SevenTargetLocale, slug: string): TargetSevenToolTranslation | undefined {
  return files[locale][slug];
}
