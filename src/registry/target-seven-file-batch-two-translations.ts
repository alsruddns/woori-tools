import type { SevenTargetLocale, TargetSevenToolTranslation } from "./target-seven-tools-translations";

type Copy = { category: string; choose: string; review: string; caution: string; faq: string; privacy: string; seoTail: string };
type ToolCopy = [title: string, description: string, keyword: string, action: string, example: string, options: string];

const copy: Record<SevenTargetLocale, Copy> = {
  bn: { category: "ফাইল ও লেখা", choose: "আপনার লেখা লিখুন বা পেস্ট করুন।", review: "ফলাফল পরীক্ষা করে প্রয়োজন হলে কপি করুন।", caution: "প্রক্রিয়াকরণ আপনার ব্রাউজারেই হয়; কোনো ফাইল সার্ভারে পাঠানো হয় না।", faq: "কোন ধরনের লেখা ব্যবহার করা যায়?", privacy: "আপনার লেখা কি সার্ভারে পাঠানো হয়? না, প্রক্রিয়াকরণ এই ব্রাউজারেই সম্পন্ন হয়।", seoTail: "দ্রুত, সহজে এবং ব্যক্তিগতভাবে ব্যবহার করুন।" },
  uk: { category: "Файли й текст", choose: "Введіть або вставте текст.", review: "Перевірте результат і за потреби скопіюйте його.", caution: "Обробка виконується у вашому браузері; файли не надсилаються на сервер.", faq: "Який текст можна використовувати?", privacy: "Чи надсилається текст на сервер? Ні, обробка відбувається у цьому браузері.", seoTail: "Користуйтеся швидко, просто та конфіденційно." },
  ms: { category: "Fail dan teks", choose: "Masukkan atau tampalkan teks anda.", review: "Semak hasil dan salin jika perlu.", caution: "Pemprosesan berlaku dalam pelayar anda; fail tidak dihantar ke pelayan.", faq: "Apakah jenis teks yang boleh digunakan?", privacy: "Adakah teks anda dihantar ke pelayan? Tidak, pemprosesan berlaku dalam pelayar ini.", seoTail: "Gunakannya dengan pantas, mudah dan secara peribadi." },
  sv: { category: "Filer och text", choose: "Skriv eller klistra in din text.", review: "Granska resultatet och kopiera vid behov.", caution: "Bearbetningen sker i webbläsaren; inga filer skickas till en server.", faq: "Vilken typ av text kan jag använda?", privacy: "Skickas texten till en server? Nej, bearbetningen sker i den här webbläsaren.", seoTail: "Använd verktyget snabbt, enkelt och privat." },
  cs: { category: "Soubory a text", choose: "Zadejte nebo vložte text.", review: "Zkontrolujte výsledek a podle potřeby jej zkopírujte.", caution: "Zpracování probíhá ve vašem prohlížeči; soubory se na server neodesílají.", faq: "Jaký text lze použít?", privacy: "Odesílá se text na server? Ne, zpracování probíhá v tomto prohlížeči.", seoTail: "Používejte nástroj rychle, snadno a soukromě." },
  ro: { category: "Fișiere și text", choose: "Introduceți sau lipiți textul.", review: "Verificați rezultatul și copiați-l dacă este necesar.", caution: "Prelucrarea are loc în browser; fișierele nu sunt trimise la server.", faq: "Ce tip de text pot folosi?", privacy: "Textul este trimis la server? Nu, prelucrarea are loc în acest browser.", seoTail: "Folosiți instrumentul rapid, simplu și în siguranță." },
  el: { category: "Αρχεία και κείμενο", choose: "Πληκτρολογήστε ή επικολλήστε το κείμενό σας.", review: "Ελέγξτε το αποτέλεσμα και αντιγράψτε το αν χρειάζεται.", caution: "Η επεξεργασία γίνεται στο πρόγραμμα περιήγησής σας· δεν αποστέλλονται αρχεία σε διακομιστή.", faq: "Τι είδους κείμενο μπορώ να χρησιμοποιήσω;", privacy: "Αποστέλλεται το κείμενο σε διακομιστή; Όχι, η επεξεργασία γίνεται σε αυτό το πρόγραμμα περιήγησης.", seoTail: "Χρησιμοποιήστε το εργαλείο γρήγορα, εύκολα και ιδιωτικά." },
};

const strings: Record<SevenTargetLocale, Record<string, ToolCopy>> = {
  bn: {
    "bulk-file-renamer": ["একাধিক ফাইলের নাম পরিবর্তন", "নিয়ম, ধারাবাহিক নম্বর ও ঐচ্ছিক টেক্সট ব্যবহার করে একসঙ্গে একাধিক ফাইলের নাম পরিবর্তন করুন।", "একাধিক ফাইলের নাম পরিবর্তন", "নামকরণের নিয়ম ও নম্বরের শুরু নির্ধারণ করুন, তারপর প্রিভিউ পরীক্ষা করুন।", "ছবির ফাইলগুলোকে trip-01, trip-02 এ সাজান।", "প্রতিস্থাপন টেক্সট, নম্বরের শুরু ও শূন্য দিয়ে পূরণের সংখ্যা নির্বাচন করুন।"],
    "filename-cleaner": ["ফাইলের নাম পরিষ্কার", "ফাইলের নাম থেকে অনুপযুক্ত অক্ষর সরিয়ে নিরাপদ ও সহজপাঠ্য নামের প্রিভিউ তৈরি করুন।", "ফাইলের নাম পরিষ্কার", "ফাইল যোগ করুন বা নামের তালিকা পেস্ট করুন, তারপর প্রস্তাবিত নামগুলো দেখুন।", "রিপোর্ট final copy!.pdf-কে report-final-copy.pdf করুন।", "ফাঁকা স্থান, বিশেষ চিহ্ন ও নামের সংঘর্ষ কীভাবে সামলানো হবে তা বেছে নিন।"],
    "shuffle-lines": ["লাইনের ক্রম এলোমেলো করুন", "লেখার প্রতিটি লাইন এলোমেলোভাবে সাজান এবং মূল লাইনগুলো অক্ষত রাখুন।", "লাইনের ক্রম এলোমেলো করুন", "লাইনগুলো পেস্ট করুন এবং এলোমেলো সাজাতে বোতাম চাপুন।", "প্রশ্নের তালিকা এলোমেলো করে কুইজ তৈরি করুন।", "ফাঁকা লাইন রাখবেন কি না নির্বাচন করুন; প্রতিটি লাইন একবারই ব্যবহৃত হয়।"],
    "add-line-numbers": ["লাইনে নম্বর যোগ", "আপনার লেখার প্রতিটি লাইনে ধারাবাহিক নম্বর যোগ করুন।", "লাইনে নম্বর যোগ", "লাইনগুলো পেস্ট করুন এবং নম্বরের শুরু ও বিন্যাস বেছে নিন।", "শুরুতে 1 দিয়ে কোডের লাইন নম্বর দিন।", "প্রারম্ভিক নম্বর, বিভাজক এবং ফাঁকা লাইন নম্বর হবে কি না নির্ধারণ করুন।"],
    "remove-line-numbers": ["লাইনের নম্বর সরান", "প্রতিটি লাইনের শুরুতে থাকা নম্বর সরিয়ে মূল পাঠ্য ফিরিয়ে আনুন।", "লাইনের নম্বর সরান", "নম্বরযুক্ত লেখা পেস্ট করুন এবং শনাক্ত করা নম্বরগুলো পরীক্ষা করুন।", "কপি করা লগ থেকে 001: ধরনের নম্বর সরান।", "কোলন, বন্ধনী বা বিন্দুর মতো প্রচলিত বিভাজক শনাক্ত করা হয়।"],
  },
  uk: {
    "bulk-file-renamer": ["Пакетне перейменування файлів", "Перейменовуйте кілька файлів за шаблоном із послідовними номерами та додатковим текстом.", "пакетне перейменування файлів", "Налаштуйте шаблон і початковий номер, а потім перевірте попередній перегляд.", "Упорядкуйте фото як trip-01, trip-02.", "Виберіть текст для заміни, початковий номер і кількість нулів для заповнення."],
    "filename-cleaner": ["Очищення назв файлів", "Приберіть небажані символи з назв файлів і перегляньте безпечніші та читабельні варіанти.", "очищення назв файлів", "Додайте файли або вставте список назв і перегляньте запропоновані варіанти.", "Перетворіть звіт final copy!.pdf на report-final-copy.pdf.", "Виберіть, як обробляти пробіли, спеціальні символи та однакові назви."],
    "shuffle-lines": ["Перемішування рядків", "Випадково змініть порядок рядків тексту, не змінюючи їхній вміст.", "перемішування рядків", "Вставте рядки та запустіть перемішування.", "Перемішайте список запитань для вікторини.", "Виберіть, чи зберігати порожні рядки; кожен рядок використовується один раз."],
    "add-line-numbers": ["Додавання номерів рядків", "Додайте послідовний номер до кожного рядка тексту.", "додавання номерів рядків", "Вставте рядки та виберіть початковий номер і формат.", "Пронумеруйте рядки коду, починаючи з 1.", "Налаштуйте початковий номер, роздільник і нумерацію порожніх рядків."],
    "remove-line-numbers": ["Видалення номерів рядків", "Приберіть початкові номери з рядків і відновіть чистий текст.", "видалення номерів рядків", "Вставте пронумерований текст і перевірте знайдені номери.", "Видаліть префікси на кшталт 001: зі скопійованого журналу.", "Розпізнаються поширені роздільники: двокрапка, дужка або крапка."],
  },
  ms: {
    "bulk-file-renamer": ["Penamaan semula fail pukal", "Namakan semula beberapa fail serentak menggunakan corak, nombor turutan dan teks pilihan.", "penamaan semula fail pukal", "Tetapkan corak nama dan nombor permulaan, kemudian semak pratonton.", "Susun foto sebagai trip-01, trip-02.", "Pilih teks gantian, nombor permulaan dan bilangan sifar pendahulu."],
    "filename-cleaner": ["Pembersih nama fail", "Buang aksara yang tidak sesuai daripada nama fail dan pratonton nama yang lebih selamat serta mudah dibaca.", "pembersih nama fail", "Pilih fail atau tampalkan senarai nama untuk melihat cadangan.", "Tukar laporan final copy!.pdf kepada report-final-copy.pdf.", "Pilih cara mengendalikan ruang, simbol khas dan nama yang bertindih."],
    "shuffle-lines": ["Rawakkan susunan baris", "Susun semula setiap baris teks secara rawak tanpa mengubah kandungannya.", "rawakkan susunan baris", "Tampalkan baris dan jalankan proses rawak.", "Rawakkan senarai soalan untuk kuiz.", "Pilih sama ada baris kosong dikekalkan; setiap baris digunakan sekali sahaja."],
    "add-line-numbers": ["Tambah nombor baris", "Tambahkan nombor berturutan pada setiap baris teks anda.", "tambah nombor baris", "Tampalkan baris dan pilih nombor permulaan serta format.", "Nomborkan baris kod bermula dengan 1.", "Tetapkan nombor permulaan, pemisah dan sama ada baris kosong dinomborkan."],
    "remove-line-numbers": ["Buang nombor baris", "Buang nombor di awal setiap baris untuk mendapatkan semula teks asal.", "buang nombor baris", "Tampalkan teks bernombor dan semak nombor yang dikenal pasti.", "Buang awalan seperti 001: daripada log yang disalin.", "Pemisah lazim seperti titik bertindih, kurungan atau noktah dikenal pasti."],
  },
  sv: {
    "bulk-file-renamer": ["Byt namn på flera filer", "Byt namn på flera filer samtidigt med ett mönster, löpnummer och valfri text.", "byt namn på flera filer", "Ange namnregler och startnummer och granska sedan förhandsvisningen.", "Ordna foton som trip-01, trip-02.", "Välj ersättningstext, startnummer och antal inledande nollor."],
    "filename-cleaner": ["Rensa filnamn", "Ta bort olämpliga tecken från filnamn och förhandsgranska säkrare, mer lättlästa namn.", "rensa filnamn", "Välj filer eller klistra in en lista med namn för att se förslag.", "Gör om rapport final copy!.pdf till report-final-copy.pdf.", "Välj hur mellanslag, specialtecken och krockar mellan namn ska hanteras."],
    "shuffle-lines": ["Blanda rader", "Ordna om textraderna slumpmässigt utan att ändra deras innehåll.", "blanda rader", "Klistra in raderna och starta blandningen.", "Blanda en lista med frågor till ett quiz.", "Välj om tomma rader ska behållas; varje rad används en gång."],
    "add-line-numbers": ["Lägg till radnummer", "Lägg till ett löpnummer framför varje textrad.", "lägg till radnummer", "Klistra in raderna och välj startnummer och format.", "Numrera kodrader från 1.", "Ange startnummer, avgränsare och om tomma rader ska numreras."],
    "remove-line-numbers": ["Ta bort radnummer", "Ta bort inledande nummer från varje rad och återställ den rena texten.", "ta bort radnummer", "Klistra in numrerad text och granska vilka nummer som hittas.", "Ta bort prefix som 001: från en kopierad logg.", "Vanliga avgränsare som kolon, parentes eller punkt känns igen."],
  },
  cs: {
    "bulk-file-renamer": ["Hromadné přejmenování souborů", "Přejmenujte několik souborů najednou podle šablony s pořadovými čísly a volitelným textem.", "hromadné přejmenování souborů", "Nastavte pravidlo názvu a počáteční číslo, potom zkontrolujte náhled.", "Seřaďte fotografie jako trip-01, trip-02.", "Vyberte nahrazovaný text, počáteční číslo a počet úvodních nul."],
    "filename-cleaner": ["Čištění názvů souborů", "Odstraňte nevhodné znaky z názvů souborů a zobrazte bezpečnější a čitelnější návrhy.", "čištění názvů souborů", "Vyberte soubory nebo vložte seznam názvů a prohlédněte si návrhy.", "Upravte report final copy!.pdf na report-final-copy.pdf.", "Zvolte zpracování mezer, zvláštních znaků a duplicitních názvů."],
    "shuffle-lines": ["Promíchání řádků", "Náhodně změňte pořadí řádků textu, aniž by se změnil jejich obsah.", "promíchání řádků", "Vložte řádky a spusťte promíchání.", "Promíchejte seznam otázek do kvízu.", "Určete, zda ponechat prázdné řádky; každý řádek se použije jednou."],
    "add-line-numbers": ["Přidání čísel řádků", "Přidejte před každý řádek textu pořadové číslo.", "přidání čísel řádků", "Vložte řádky a zvolte počáteční číslo i formát.", "Očíslujte řádky kódu od čísla 1.", "Nastavte počáteční číslo, oddělovač a číslování prázdných řádků."],
    "remove-line-numbers": ["Odebrání čísel řádků", "Odstraňte počáteční čísla z řádků a získejte zpět čistý text.", "odebrání čísel řádků", "Vložte očíslovaný text a zkontrolujte rozpoznaná čísla.", "Odstraňte předpony jako 001: ze zkopírovaného protokolu.", "Rozpoznají se běžné oddělovače, například dvojtečka, závorka nebo tečka."],
  },
  ro: {
    "bulk-file-renamer": ["Redenumire în bloc a fișierelor", "Redenumiți mai multe fișiere după un model cu numere consecutive și text opțional.", "redenumire în bloc a fișierelor", "Setați modelul și numărul de început, apoi verificați previzualizarea.", "Organizați fotografiile ca trip-01, trip-02.", "Alegeți textul de înlocuire, numărul de început și zerourile de completare."],
    "filename-cleaner": ["Curățare nume de fișiere", "Eliminați caracterele nepotrivite și previzualizați nume de fișiere mai sigure și mai ușor de citit.", "curățare nume de fișiere", "Alegeți fișierele sau lipiți o listă de nume pentru a vedea sugestiile.", "Transformați raport final copy!.pdf în report-final-copy.pdf.", "Alegeți cum sunt tratate spațiile, simbolurile speciale și numele duplicate."],
    "shuffle-lines": ["Amestecare rânduri", "Reordonați aleatoriu rândurile textului fără a le modifica conținutul.", "amestecare rânduri", "Lipiți rândurile și porniți amestecarea.", "Amestecați lista de întrebări pentru un test.", "Alegeți dacă păstrați rândurile goale; fiecare rând este folosit o singură dată."],
    "add-line-numbers": ["Adăugare numere de rând", "Adăugați un număr consecutiv înaintea fiecărui rând de text.", "adăugare numere de rând", "Lipiți rândurile și alegeți numărul inițial și formatul.", "Numerotați liniile de cod începând cu 1.", "Setați numărul de început, separatorul și numerotarea rândurilor goale."],
    "remove-line-numbers": ["Eliminare numere de rând", "Eliminați numerele de la începutul rândurilor pentru a obține textul curat.", "eliminare numere de rând", "Lipiți textul numerotat și verificați numerele detectate.", "Eliminați prefixe precum 001: dintr-un jurnal copiat.", "Sunt recunoscuți separatorii uzuali: două puncte, paranteză sau punct."],
  },
  el: {
    "bulk-file-renamer": ["Μαζική μετονομασία αρχείων", "Μετονομάστε πολλά αρχεία μαζί με μοτίβο, διαδοχικούς αριθμούς και προαιρετικό κείμενο.", "μαζική μετονομασία αρχείων", "Ορίστε το μοτίβο και τον αρχικό αριθμό και ελέγξτε την προεπισκόπηση.", "Οργανώστε φωτογραφίες ως trip-01, trip-02.", "Επιλέξτε κείμενο αντικατάστασης, αρχικό αριθμό και μηδενικά συμπλήρωσης."],
    "filename-cleaner": ["Καθαρισμός ονομάτων αρχείων", "Αφαιρέστε ακατάλληλους χαρακτήρες και δείτε προτάσεις για πιο ασφαλή και ευανάγνωστα ονόματα.", "καθαρισμός ονομάτων αρχείων", "Επιλέξτε αρχεία ή επικολλήστε λίστα ονομάτων για να δείτε προτάσεις.", "Μετατρέψτε το report final copy!.pdf σε report-final-copy.pdf.", "Επιλέξτε πώς θα αντιμετωπίζονται τα κενά, οι ειδικοί χαρακτήρες και οι διπλές ονομασίες."],
    "shuffle-lines": ["Ανακάτεμα γραμμών", "Αναδιατάξτε τυχαία τις γραμμές του κειμένου χωρίς να αλλάξετε το περιεχόμενό τους.", "ανακάτεμα γραμμών", "Επικολλήστε τις γραμμές και ξεκινήστε την αναδιάταξη.", "Ανακατέψτε μια λίστα ερωτήσεων για κουίζ.", "Επιλέξτε αν θα διατηρηθούν οι κενές γραμμές· κάθε γραμμή χρησιμοποιείται μία φορά."],
    "add-line-numbers": ["Προσθήκη αριθμών γραμμών", "Προσθέστε διαδοχικούς αριθμούς πριν από κάθε γραμμή κειμένου.", "προσθήκη αριθμών γραμμών", "Επικολλήστε τις γραμμές και επιλέξτε αριθμό έναρξης και μορφή.", "Αριθμήστε τις γραμμές κώδικα ξεκινώντας από το 1.", "Ορίστε αρχικό αριθμό, διαχωριστικό και αν θα αριθμούνται οι κενές γραμμές."],
    "remove-line-numbers": ["Αφαίρεση αριθμών γραμμών", "Αφαιρέστε τους αρχικούς αριθμούς από κάθε γραμμή για να επαναφέρετε το καθαρό κείμενο.", "αφαίρεση αριθμών γραμμών", "Επικολλήστε αριθμημένο κείμενο και ελέγξτε τους αριθμούς που εντοπίστηκαν.", "Αφαιρέστε προθέματα όπως 001: από ένα αντιγραμμένο αρχείο καταγραφής.", "Αναγνωρίζονται συνηθισμένα διαχωριστικά, όπως άνω και κάτω τελεία, παρένθεση ή τελεία."],
  },
};

function createTranslation(locale: SevenTargetLocale, slug: string, [title, description, keyword, action, example, options]: ToolCopy): TargetSevenToolTranslation {
  const ui = copy[locale];
  return {
    title,
    description,
    seoTitle: `${title} | Woori Tools`,
    seoDescription: `${description} ${ui.seoTail}`,
    category: ui.category,
    keywords: [keyword, title, slug],
    steps: [ui.choose, action, ui.review],
    example,
    options,
    caution: ui.caution,
    faq: { example: ui.faq, caution: ui.privacy },
  };
}

const translations = Object.fromEntries(
  (Object.keys(strings) as SevenTargetLocale[]).map((locale) => [
    locale,
    Object.fromEntries(Object.entries(strings[locale]).map(([slug, toolCopy]) => [slug, createTranslation(locale, slug, toolCopy)])),
  ]),
) as Record<SevenTargetLocale, Record<string, TargetSevenToolTranslation>>;

export const targetSevenFileBatchTwoSlugs = ["bulk-file-renamer", "filename-cleaner", "shuffle-lines", "add-line-numbers", "remove-line-numbers"] as const;

export function getTargetSevenFileBatchTwoTranslation(locale: SevenTargetLocale, slug: string): TargetSevenToolTranslation | undefined {
  return translations[locale][slug];
}
