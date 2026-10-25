import type { SevenTargetLocale, TargetSevenToolTranslation } from "./target-seven-tools-translations";

type Shared = { category: string; input: string; review: string; caution: string; faq: string; privacy: string; tail: string };
type Copy = [string, string, string, string, string, string];

const shared: Record<SevenTargetLocale, Shared> = {
  bn: { category: "লেখা ও ডেভেলপার সরঞ্জাম", input: "লেখা বা ডেটা পেস্ট করুন।", review: "ফলাফল পরীক্ষা করুন এবং প্রয়োজন হলে কপি করুন।", caution: "ডেটা আপনার ব্রাউজারেই প্রক্রিয়া হয়; সার্ভারে পাঠানো হয় না।", faq: "আমার ডেটা কি সার্ভারে পাঠানো হয়?", privacy: "না, প্রক্রিয়াকরণ আপনার ডিভাইসের ব্রাউজারেই হয়।", tail: "তথ্য ব্রাউজারেই প্রক্রিয়া করুন এবং নিয়ন্ত্রণ নিজের কাছে রাখুন।" },
  uk: { category: "Текст і інструменти розробника", input: "Вставте текст або дані.", review: "Перевірте результат і за потреби скопіюйте його.", caution: "Дані обробляються у браузері й не надсилаються на сервер.", faq: "Чи надсилаються мої дані на сервер?", privacy: "Ні, обробка відбувається у браузері на вашому пристрої.", tail: "Обробляйте дані у браузері та зберігайте контроль над ними." },
  ms: { category: "Teks dan alat pembangun", input: "Tampalkan teks atau data.", review: "Semak hasil dan salin jika perlu.", caution: "Data diproses dalam pelayar dan tidak dihantar ke pelayan.", faq: "Adakah data saya dihantar ke pelayan?", privacy: "Tidak, pemprosesan berlaku dalam pelayar pada peranti anda.", tail: "Proses data dalam pelayar dan kekalkan kawalan anda." },
  sv: { category: "Text- och utvecklarverktyg", input: "Klistra in text eller data.", review: "Granska resultatet och kopiera vid behov.", caution: "Data bearbetas i webbläsaren och skickas inte till en server.", faq: "Skickas mina data till en server?", privacy: "Nej, bearbetningen sker i webbläsaren på din enhet.", tail: "Bearbeta data i webbläsaren och behåll kontrollen." },
  cs: { category: "Textové a vývojářské nástroje", input: "Vložte text nebo data.", review: "Zkontrolujte výsledek a podle potřeby jej zkopírujte.", caution: "Data se zpracovávají v prohlížeči a neodesílají se na server.", faq: "Odesílají se moje data na server?", privacy: "Ne, zpracování probíhá v prohlížeči ve vašem zařízení.", tail: "Zpracovávejte data v prohlížeči a mějte je pod kontrolou." },
  ro: { category: "Instrumente pentru text și dezvoltare", input: "Lipiți text sau date.", review: "Verificați rezultatul și copiați-l dacă este necesar.", caution: "Datele sunt prelucrate în browser și nu sunt trimise la server.", faq: "Sunt trimise datele mele la server?", privacy: "Nu, prelucrarea are loc în browserul de pe dispozitivul dvs.", tail: "Prelucrați datele în browser și păstrați controlul asupra lor." },
  el: { category: "Εργαλεία κειμένου και προγραμματιστών", input: "Επικολλήστε κείμενο ή δεδομένα.", review: "Ελέγξτε το αποτέλεσμα και αντιγράψτε το αν χρειάζεται.", caution: "Τα δεδομένα επεξεργάζονται στο πρόγραμμα περιήγησης και δεν αποστέλλονται σε διακομιστή.", faq: "Αποστέλλονται τα δεδομένα μου σε διακομιστή;", privacy: "Όχι, η επεξεργασία γίνεται στο πρόγραμμα περιήγησης της συσκευής σας.", tail: "Επεξεργαστείτε δεδομένα στο πρόγραμμα περιήγησης και διατηρήστε τον έλεγχο." },
};

const content: Record<SevenTargetLocale, Record<string, Copy>> = {
  bn: {
    "text-compare": ["দুটি লেখা তুলনা", "দুটি লাইনের তালিকা তুলনা করে কোন লাইন শুধু প্রথম বা দ্বিতীয় লেখায় আছে তা দেখুন।", "দুটি লেখা তুলনা", "প্রথম লেখাটি এবং দ্বিতীয় লেখাটি আলাদা ঘরে পেস্ট করুন।", "দুই সংস্করণের মধ্যে যোগ ও বাদ হওয়া লাইন চিহ্নিত করুন।", "লাইনভিত্তিক তুলনা হয়; একই লাইন উভয় লেখায় থাকলে আলাদা করে দেখানো হয় না।"],
    "reverse-text": ["লেখার ক্রম উল্টান", "লেখার অক্ষরগুলো বিপরীত ক্রমে সাজান।", "লেখার ক্রম উল্টানো", "লেখা পেস্ট করে উল্টো ফলাফল তৈরি করুন।", "লেখার শেষ অক্ষরটি প্রথমে আনুন।", "এটি সম্পূর্ণ অক্ষরক্রম উল্টায়; শব্দের ক্রম আলাদাভাবে নয়।"],
    "remove-duplicate-words": ["পুনরাবৃত্ত শব্দ সরান", "একই শব্দের পরের উপস্থিতিগুলো বাদ দিয়ে প্রথমটিকে রেখে দিন।", "পুনরাবৃত্ত শব্দ সরান", "লেখা পেস্ট করে ডুপ্লিকেট শব্দ সরান।", "অনুচ্ছেদে বারবার আসা শব্দের পুনরাবৃত্তি কমান।", "বড়-ছোট অক্ষর উপেক্ষা করে শব্দ মিলানো হয়; যতিচিহ্ন শব্দের অংশ থাকতে পারে।"],
    "json-validator": ["JSON বৈধতা পরীক্ষা", "JSON ডেটার গঠন যাচাই করে এটি সঠিকভাবে পার্স করা যায় কি না দেখুন।", "JSON বৈধতা পরীক্ষা", "JSON পেস্ট করে যাচাই চালান।", "API থেকে পাওয়া JSON ডেটা ঠিক আছে কি না পরীক্ষা করুন।", "বৈধ JSON হলে নিশ্চিতকরণ দেখায়; অবৈধ হলে একটি ত্রুটি বার্তা দেয়।"],
    "json-to-yaml": ["JSON থেকে YAML রূপান্তর", "সঠিক JSON ডেটাকে YAML ফরম্যাটে রূপান্তর করুন।", "JSON থেকে YAML রূপান্তর", "বৈধ JSON পেস্ট করে YAML ফলাফল তৈরি করুন।", "কনফিগারেশন অবজেক্টকে YAML-এ রূপান্তর করুন।", "ইনপুট অবশ্যই বৈধ JSON হতে হবে; রূপান্তরের আগে গঠন পরীক্ষা করুন।"],
  },
  uk: {
    "text-compare": ["Порівняння тексту", "Порівняйте два списки рядків і перегляньте рядки, що є лише в першому або другому тексті.", "порівняння двох текстів", "Вставте перший і другий текст в окремі поля.", "Знайдіть додані й вилучені рядки між двома версіями.", "Порівняння виконується за рядками; рядки, наявні в обох текстах, не позначаються."],
    "reverse-text": ["Перевертання тексту", "Розташуйте символи тексту у зворотному порядку.", "перевернути текст", "Вставте текст і створіть результат у зворотному порядку.", "Перемістіть останній символ тексту на початок.", "Перевертається весь порядок символів, а не лише порядок слів."],
    "remove-duplicate-words": ["Видалення повторюваних слів", "Приберіть наступні повтори того самого слова та залиште перше входження.", "видалення повторюваних слів", "Вставте текст і видаліть повтори слів.", "Приберіть повторення слів у чернетці абзацу.", "Регістр не враховується; розділові знаки можуть залишатися частиною слова."],
    "json-validator": ["Перевірка JSON", "Перевірте структуру JSON і переконайтеся, що дані можна коректно розібрати.", "перевірка коректності JSON", "Вставте JSON і запустіть перевірку.", "Перевірте, чи коректні дані JSON, отримані від API.", "Для коректного JSON відображається підтвердження; для некоректного — повідомлення про помилку."],
    "json-to-yaml": ["Перетворення JSON у YAML", "Перетворіть коректні дані JSON у формат YAML.", "конвертер JSON у YAML", "Вставте коректний JSON, щоб створити результат YAML.", "Перетворіть об'єкт конфігурації на YAML.", "Вхідні дані мають бути коректним JSON; перевірте структуру перед перетворенням."],
  },
  ms: {
    "text-compare": ["Bandingkan teks", "Bandingkan dua senarai baris dan lihat baris yang hanya wujud dalam teks pertama atau kedua.", "bandingkan dua teks", "Tampalkan teks pertama dan kedua dalam medan yang berasingan.", "Kenal pasti baris yang ditambah atau dibuang antara dua versi.", "Perbandingan dibuat mengikut baris; baris yang sama dalam kedua-dua teks tidak ditandakan."],
    "reverse-text": ["Balikkan teks", "Susun aksara dalam teks dalam turutan terbalik.", "balikkan turutan teks", "Tampalkan teks untuk menghasilkan hasil terbalik.", "Letakkan aksara terakhir teks di hadapan.", "Seluruh turutan aksara diterbalikkan, bukan hanya susunan perkataan."],
    "remove-duplicate-words": ["Buang perkataan pendua", "Buang kemunculan seterusnya bagi perkataan yang sama dan kekalkan kemunculan pertamanya.", "buang perkataan pendua", "Tampalkan teks dan buang perkataan berulang.", "Kurangkan pengulangan perkataan dalam draf perenggan.", "Perbezaan huruf besar dan kecil diabaikan; tanda baca mungkin kekal sebagai sebahagian perkataan."],
    "json-validator": ["Pengesah JSON", "Sahkan struktur data JSON dan semak sama ada data boleh dihuraikan dengan betul.", "pengesah JSON", "Tampalkan JSON dan jalankan pengesahan.", "Semak sama ada data JSON daripada API sah.", "Pengesahan dipaparkan untuk JSON yang sah; mesej ralat ditunjukkan jika tidak sah."],
    "json-to-yaml": ["Tukar JSON kepada YAML", "Tukar data JSON yang sah kepada format YAML.", "penukar JSON kepada YAML", "Tampalkan JSON yang sah untuk menghasilkan YAML.", "Tukar objek konfigurasi kepada YAML.", "Input mestilah JSON yang sah; semak strukturnya sebelum penukaran."],
  },
  sv: {
    "text-compare": ["Jämför text", "Jämför två listor med rader och visa rader som bara finns i den ena texten.", "jämför två texter", "Klistra in den första och den andra texten i separata fält.", "Hitta rader som lagts till eller tagits bort mellan två versioner.", "Jämförelsen görs rad för rad; gemensamma rader markeras inte."],
    "reverse-text": ["Vänd text", "Ordna textens tecken i omvänd ordning.", "vänd textordning", "Klistra in texten för att skapa ett resultat i omvänd ordning.", "Flytta textens sista tecken först.", "Hela teckenordningen vänds, inte bara ordens ordning."],
    "remove-duplicate-words": ["Ta bort upprepade ord", "Ta bort senare förekomster av samma ord och behåll den första.", "ta bort upprepade ord", "Klistra in texten och ta bort dubblerade ord.", "Minska upprepade ord i ett styckeutkast.", "Skiftläge ignoreras; skiljetecken kan fortfarande räknas till ordet."],
    "json-validator": ["Validera JSON", "Kontrollera JSON-strukturen och se om data kan tolkas korrekt.", "validera JSON", "Klistra in JSON och kör valideringen.", "Kontrollera om JSON-data från ett API är giltiga.", "Ett godkänt resultat visas för giltig JSON; annars visas ett felmeddelande."],
    "json-to-yaml": ["Konvertera JSON till YAML", "Konvertera giltiga JSON-data till YAML-format.", "konvertera JSON till YAML", "Klistra in giltig JSON för att skapa YAML-resultatet.", "Konvertera ett konfigurationsobjekt till YAML.", "Indata måste vara giltig JSON; kontrollera strukturen före konverteringen."],
  },
  cs: {
    "text-compare": ["Porovnání textu", "Porovnejte dva seznamy řádků a zobrazte řádky, které jsou pouze v jednom z textů.", "porovnání dvou textů", "Vložte první a druhý text do samostatných polí.", "Najděte řádky přidané nebo odebrané mezi dvěma verzemi.", "Porovnání probíhá po řádcích; společné řádky se neoznačují."],
    "reverse-text": ["Obrácení textu", "Uspořádejte znaky textu v opačném pořadí.", "obrácení pořadí textu", "Vložte text a vytvořte výsledek v opačném pořadí.", "Přesuňte poslední znak textu na začátek.", "Obrátí se celé pořadí znaků, nikoli pouze pořadí slov."],
    "remove-duplicate-words": ["Odstranění duplicitních slov", "Odeberte další výskyty stejného slova a ponechte jeho první výskyt.", "odstranění duplicitních slov", "Vložte text a odstraňte opakovaná slova.", "Omezte opakování slov v konceptu odstavce.", "Velikost písmen se ignoruje; interpunkce může zůstat součástí slova."],
    "json-validator": ["Ověření JSON", "Ověřte strukturu dat JSON a zjistěte, zda je lze správně zpracovat.", "validátor JSON", "Vložte JSON a spusťte ověření.", "Zkontrolujte, zda jsou JSON data z API platná.", "U platného JSON se zobrazí potvrzení; jinak se zobrazí chybová zpráva."],
    "json-to-yaml": ["Převod JSON na YAML", "Převeďte platná data JSON do formátu YAML.", "převod JSON na YAML", "Vložte platný JSON a vytvořte výsledek YAML.", "Převeďte konfigurační objekt do YAML.", "Vstup musí být platný JSON; před převodem zkontrolujte jeho strukturu."],
  },
  ro: {
    "text-compare": ["Comparare texte", "Comparați două liste de rânduri și vedeți rândurile care apar doar într-unul dintre texte.", "comparare două texte", "Lipiți primul și al doilea text în câmpuri separate.", "Identificați rândurile adăugate sau eliminate între două versiuni.", "Compararea se face pe rânduri; rândurile comune nu sunt marcate."],
    "reverse-text": ["Inversare text", "Aranjați caracterele textului în ordine inversă.", "inversare ordine text", "Lipiți textul pentru a crea rezultatul inversat.", "Mutați ultimul caracter al textului la început.", "Se inversează întreaga ordine a caracterelor, nu doar ordinea cuvintelor."],
    "remove-duplicate-words": ["Eliminare cuvinte duplicate", "Eliminați aparițiile ulterioare ale aceluiași cuvânt și păstrați prima apariție.", "eliminare cuvinte duplicate", "Lipiți textul și eliminați cuvintele repetate.", "Reduceți repetarea cuvintelor într-o ciornă de paragraf.", "Majusculele și minusculele nu contează; semnele de punctuație pot rămâne parte a cuvântului."],
    "json-validator": ["Validare JSON", "Verificați structura datelor JSON și dacă acestea pot fi interpretate corect.", "validator JSON", "Lipiți JSON-ul și porniți validarea.", "Verificați dacă datele JSON primite de la un API sunt valide.", "Pentru JSON valid se afișează confirmarea; altfel apare un mesaj de eroare."],
    "json-to-yaml": ["Convertire JSON în YAML", "Convertiți date JSON valide în format YAML.", "convertor JSON în YAML", "Lipiți JSON valid pentru a genera rezultatul YAML.", "Convertiți un obiect de configurare în YAML.", "Datele introduse trebuie să fie JSON valid; verificați structura înainte de conversie."],
  },
  el: {
    "text-compare": ["Σύγκριση κειμένου", "Συγκρίνετε δύο λίστες γραμμών και δείτε ποιες γραμμές υπάρχουν μόνο στο ένα κείμενο.", "σύγκριση δύο κειμένων", "Επικολλήστε το πρώτο και το δεύτερο κείμενο σε ξεχωριστά πεδία.", "Εντοπίστε γραμμές που προστέθηκαν ή αφαιρέθηκαν ανάμεσα σε δύο εκδόσεις.", "Η σύγκριση γίνεται ανά γραμμή· οι κοινές γραμμές δεν επισημαίνονται."],
    "reverse-text": ["Αντιστροφή κειμένου", "Τοποθετήστε τους χαρακτήρες του κειμένου με αντίστροφη σειρά.", "αντιστροφή σειράς κειμένου", "Επικολλήστε κείμενο για να δημιουργήσετε αντίστροφο αποτέλεσμα.", "Μεταφέρετε τον τελευταίο χαρακτήρα του κειμένου στην αρχή.", "Αντιστρέφεται ολόκληρη η σειρά χαρακτήρων, όχι μόνο η σειρά λέξεων."],
    "remove-duplicate-words": ["Αφαίρεση διπλών λέξεων", "Αφαιρέστε τις επόμενες εμφανίσεις της ίδιας λέξης και κρατήστε την πρώτη.", "αφαίρεση διπλών λέξεων", "Επικολλήστε κείμενο και αφαιρέστε τις επαναλαμβανόμενες λέξεις.", "Μειώστε την επανάληψη λέξεων σε προσχέδιο παραγράφου.", "Δεν λαμβάνονται υπόψη πεζά και κεφαλαία· τα σημεία στίξης μπορεί να παραμείνουν στη λέξη."],
    "json-validator": ["Επικύρωση JSON", "Ελέγξτε τη δομή δεδομένων JSON και αν μπορούν να αναλυθούν σωστά.", "επικύρωση JSON", "Επικολλήστε JSON και εκτελέστε τον έλεγχο.", "Ελέγξτε αν τα δεδομένα JSON από API είναι έγκυρα.", "Για έγκυρο JSON εμφανίζεται επιβεβαίωση· διαφορετικά εμφανίζεται μήνυμα σφάλματος."],
    "json-to-yaml": ["Μετατροπή JSON σε YAML", "Μετατρέψτε έγκυρα δεδομένα JSON σε μορφή YAML.", "μετατροπέας JSON σε YAML", "Επικολλήστε έγκυρο JSON για να δημιουργήσετε αποτέλεσμα YAML.", "Μετατρέψτε αντικείμενο ρυθμίσεων σε YAML.", "Η είσοδος πρέπει να είναι έγκυρο JSON· ελέγξτε τη δομή πριν τη μετατροπή."],
  },
};

function build(locale: SevenTargetLocale, slug: string, [title, description, keyword, action, example, options]: Copy): TargetSevenToolTranslation {
  const ui = shared[locale];
  return { title, description, seoTitle: `${title} | Woori Tools`, seoDescription: `${description} ${ui.tail}`, category: ui.category, keywords: [keyword, title, slug], steps: [ui.input, action, ui.review], example, options, caution: ui.caution, faq: { example: ui.faq, caution: ui.privacy } };
}

const translations = Object.fromEntries((Object.keys(content) as SevenTargetLocale[]).map((locale) => [locale, Object.fromEntries(Object.entries(content[locale]).map(([slug, value]) => [slug, build(locale, slug, value)]))])) as Record<SevenTargetLocale, Record<string, TargetSevenToolTranslation>>;

export const targetSevenTextBatchThirteenSlugs = ["text-compare", "reverse-text", "remove-duplicate-words", "json-validator", "json-to-yaml"] as const;

export function getTargetSevenTextBatchThirteenTranslation(locale: SevenTargetLocale, slug: string): TargetSevenToolTranslation | undefined {
  return translations[locale][slug];
}
