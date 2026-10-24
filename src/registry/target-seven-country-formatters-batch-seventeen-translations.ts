import type { SevenTargetLocale, TargetSevenToolTranslation } from "./target-seven-tools-translations";

type Copy = readonly [title: string, description: string, keyword: string, action: string, example: string, options: string];
type Shared = { category: string; steps: [string, string, string]; caution: string; faq: { example: string; caution: string }; privacy: string };

const shared: Record<SevenTargetLocale, Shared> = {
  bn: { category: "সংখ্যা ও বিন্যাসের সরঞ্জাম", steps: ["প্রয়োজনীয় মান বা ফলের সংখ্যা লিখুন।", "বিকল্প ও বিন্যাস নির্বাচন করুন।", "তৈরি করা ফল পরীক্ষা করে কপি করুন।"], caution: "ফলাফল কেবল বিন্যাস বা দৈব নির্বাচনের জন্য; এটি কোনো ঠিকানা, পরিচয় বা জয়ের নিশ্চয়তা দেয় না।", faq: { example: "আমি কি ফলাফলটি আবার তৈরি করতে পারি?", caution: "এই টুল কি ঠিকানা বা পরিচয় যাচাই করে?" }, privacy: "তথ্য আপনার ব্রাউজারেই প্রক্রিয়া হয়; এটি সার্ভারে পাঠানো হয় না।" },
  uk: { category: "Інструменти для чисел і форматування", steps: ["Введіть потрібне значення або кількість результатів.", "Оберіть параметри та формат.", "Перевірте й скопіюйте результат."], caution: "Результат призначений лише для форматування або випадкового вибору; він не підтверджує адресу, особу чи виграш.", faq: { example: "Чи можна створити результат ще раз?", caution: "Чи перевіряє інструмент адресу або особу?" }, privacy: "Дані обробляються у вашому браузері й не надсилаються на сервер." },
  ms: { category: "Alat nombor dan pemformatan", steps: ["Masukkan nilai atau bilangan hasil yang diperlukan.", "Pilih pilihan dan format.", "Semak dan salin hasil."], caution: "Hasil hanya untuk pemformatan atau pilihan rawak; ia tidak mengesahkan alamat, identiti atau kemenangan.", faq: { example: "Bolehkah saya menjana hasil sekali lagi?", caution: "Adakah alat ini mengesahkan alamat atau identiti?" }, privacy: "Data diproses dalam pelayar anda dan tidak dihantar ke pelayan." },
  sv: { category: "Verktyg för tal och formatering", steps: ["Ange värdet eller antalet resultat.", "Välj alternativ och format.", "Granska och kopiera resultatet."], caution: "Resultatet är endast till för formatering eller slumpval och bekräftar inte en adress, identitet eller vinst.", faq: { example: "Kan jag skapa ett nytt resultat?", caution: "Kontrollerar verktyget adresser eller identitet?" }, privacy: "Dina uppgifter behandlas i webbläsaren och skickas inte till en server." },
  cs: { category: "Nástroje pro čísla a formátování", steps: ["Zadejte požadovanou hodnotu nebo počet výsledků.", "Vyberte možnosti a formát.", "Zkontrolujte a zkopírujte výsledek."], caution: "Výsledek slouží pouze k formátování nebo náhodnému výběru; nepotvrzuje adresu, totožnost ani výhru.", faq: { example: "Mohu vytvořit další výsledek?", caution: "Ověřuje nástroj adresu nebo totožnost?" }, privacy: "Data se zpracovávají ve vašem prohlížeči a neodesílají se na server." },
  ro: { category: "Instrumente pentru numere și formatare", steps: ["Introduceți valoarea sau numărul de rezultate dorit.", "Alegeți opțiunile și formatul.", "Verificați și copiați rezultatul."], caution: "Rezultatul este destinat doar formatării sau selecției aleatorii; nu confirmă o adresă, identitatea ori un câștig.", faq: { example: "Pot genera un alt rezultat?", caution: "Instrumentul verifică adrese sau identități?" }, privacy: "Datele sunt procesate în browser și nu sunt trimise la un server." },
  el: { category: "Εργαλεία αριθμών και μορφοποίησης", steps: ["Εισαγάγετε την τιμή ή τον αριθμό αποτελεσμάτων.", "Επιλέξτε τις ρυθμίσεις και τη μορφή.", "Ελέγξτε και αντιγράψτε το αποτέλεσμα."], caution: "Το αποτέλεσμα προορίζεται μόνο για μορφοποίηση ή τυχαία επιλογή· δεν επιβεβαιώνει διεύθυνση, ταυτότητα ή κέρδος.", faq: { example: "Μπορώ να δημιουργήσω νέο αποτέλεσμα;", caution: "Το εργαλείο επαληθεύει διευθύνσεις ή ταυτότητα;" }, privacy: "Τα δεδομένα επεξεργάζονται στο πρόγραμμα περιήγησής σας και δεν αποστέλλονται σε διακομιστή." },
};

const content: Record<SevenTargetLocale, Record<string, Copy>> = {
  bn: {
    "numbers4-number-generator": ["Numbers4 নম্বর জেনারেটর", "জাপানের Numbers4 লটারির জন্য ০ থেকে ৯ পর্যন্ত অঙ্ক দিয়ে চার অঙ্কের একটি দৈব নম্বর তৈরি করুন।", "Numbers4 দৈব নম্বর", "চার অঙ্কের ফল তৈরি করুন।", "একটি চার অঙ্কের Numbers4 নম্বর তৈরি করুন।", "প্রতিটি অঙ্ক ০–৯ সীমার মধ্যে; পুনরাবৃত্তি সম্ভব।"],
    "bingo5-number-generator": ["Bingo5 নম্বর জেনারেটর", "জাপানের Bingo5-এর কলামভিত্তিক সীমা মেনে আটটি দৈব সংখ্যা তৈরি করুন।", "Bingo5 সংখ্যা", "আটটি সংখ্যা তৈরি করুন।", "Bingo5-এর জন্য আটটি সংখ্যা তৈরি করুন।", "প্রতিটি কলামের নির্ধারিত সংখ্যার পরিসর বজায় থাকে।"],
    "us-phone-number-formatter": ["মার্কিন ফোন নম্বর ফরম্যাটার", "মার্কিন ফোন নম্বরকে সাধারণ পাঠযোগ্য বিন্যাসে সাজান।", "মার্কিন ফোন নম্বর ফরম্যাট", "ফোন নম্বর লিখুন ও ফরম্যাট করুন।", "একটি মার্কিন ফোন নম্বরকে প্রচলিত বিন্যাসে দেখান।", "বিরামচিহ্ন ও প্রদর্শন বিন্যাস নির্বাচন করুন।"],
    "us-zip-code-formatter": ["মার্কিন ZIP কোড ফরম্যাটার", "ZIP বা ZIP+4 মানকে প্রচলিত মার্কিন পোস্টাল বিন্যাসে সাজান।", "ZIP কোড ফরম্যাট", "ZIP মান লিখুন ও ফরম্যাট করুন।", "একটি ZIP+4 মানকে পাঠযোগ্যভাবে সাজান।", "ZIP ও ZIP+4 প্রদর্শন বেছে নিন।"],
    "canada-postal-code-formatter": ["কানাডিয়ান পোস্টাল কোড ফরম্যাটার", "কানাডার পোস্টাল কোডকে বড় হাতের অক্ষর ও মাঝখানে ফাঁকসহ সাজান।", "কানাডিয়ান পোস্টাল কোড ফরম্যাট", "পোস্টাল কোড লিখুন ও ফরম্যাট করুন।", "একটি কানাডিয়ান কোডে মাঝের ফাঁক যোগ করুন।", "অক্ষরের বড় হাতের রূপ ও ফাঁকের বিন্যাস প্রয়োগ করুন।"],
  },
  uk: {
    "numbers4-number-generator": ["Генератор чисел Numbers4", "Створіть випадкове чотиризначне число з цифр від 0 до 9 для японської лотереї Numbers4.", "випадкове число Numbers4", "Створіть чотиризначний результат.", "Створіть чотиризначне число для Numbers4.", "Кожна цифра від 0 до 9; повторення можливі."],
    "bingo5-number-generator": ["Генератор чисел Bingo5", "Створіть вісім випадкових чисел у межах, визначених для стовпців японської Bingo5.", "числа Bingo5", "Створіть вісім чисел.", "Створіть набір із восьми чисел для Bingo5.", "Дотримуються діапазони чисел для кожного стовпця."],
    "us-phone-number-formatter": ["Форматувач телефонів США", "Відформатуйте номер телефону США у звичному для читання вигляді.", "формат номера США", "Введіть і відформатуйте номер.", "Покажіть номер США у звичному форматі.", "Оберіть розділові знаки та вигляд номера."],
    "us-zip-code-formatter": ["Форматувач ZIP-кодів США", "Відформатуйте значення ZIP або ZIP+4 у поширеному форматі поштових індексів США.", "формат ZIP-коду", "Введіть і відформатуйте ZIP-код.", "Відобразіть значення ZIP+4 у зручному вигляді.", "Оберіть формат ZIP або ZIP+4."],
    "canada-postal-code-formatter": ["Форматувач поштових індексів Канади", "Відформатуйте канадський поштовий індекс великими літерами з пробілом посередині.", "формат індексу Канади", "Введіть і відформатуйте індекс.", "Додайте пробіл до канадського індексу.", "Застосуйте великі літери та стандартне розділення пробілом."],
  },
  ms: {
    "numbers4-number-generator": ["Penjana nombor Numbers4", "Jana satu nombor rawak empat digit daripada 0 hingga 9 untuk loteri Numbers4 Jepun.", "nombor rawak Numbers4", "Jana hasil empat digit.", "Jana nombor empat digit untuk Numbers4.", "Setiap digit antara 0 hingga 9; digit boleh berulang."],
    "bingo5-number-generator": ["Penjana nombor Bingo5", "Jana lapan nombor rawak mengikut julat lajur permainan Bingo5 Jepun.", "nombor Bingo5", "Jana lapan nombor.", "Jana set lapan nombor untuk Bingo5.", "Julat nombor yang ditetapkan bagi setiap lajur dikekalkan."],
    "us-phone-number-formatter": ["Pemformat nombor telefon AS", "Format nombor telefon Amerika Syarikat supaya mudah dibaca.", "format nombor telefon AS", "Masukkan dan format nombor telefon.", "Paparkan nombor telefon AS dalam format lazim.", "Pilih tanda pemisah dan gaya paparan."],
    "us-zip-code-formatter": ["Pemformat kod ZIP AS", "Format nilai ZIP atau ZIP+4 dalam gaya pos Amerika Syarikat yang lazim.", "format kod ZIP", "Masukkan dan format kod ZIP.", "Paparkan nilai ZIP+4 dengan kemas.", "Pilih paparan ZIP atau ZIP+4."],
    "canada-postal-code-formatter": ["Pemformat poskod Kanada", "Format poskod Kanada menggunakan huruf besar dan ruang di bahagian tengah.", "format poskod Kanada", "Masukkan dan format poskod.", "Tambahkan ruang pada kod pos Kanada.", "Gunakan huruf besar dan pemisahan ruang standard."],
  },
  sv: {
    "numbers4-number-generator": ["Numbers4-talgenerator", "Skapa ett slumpmässigt fyrsiffrigt tal med siffrorna 0–9 för det japanska Numbers4-lotteriet.", "slumpmässigt Numbers4-tal", "Skapa ett fyrsiffrigt resultat.", "Skapa ett fyrsiffrigt tal för Numbers4.", "Varje siffra är 0–9 och kan upprepas."],
    "bingo5-number-generator": ["Bingo5-talgenerator", "Skapa åtta slumpmässiga tal enligt kolumnernas intervall i japanska Bingo5.", "Bingo5-tal", "Skapa åtta tal.", "Skapa en uppsättning med åtta Bingo5-tal.", "Varje kolumns angivna talintervall följs."],
    "us-phone-number-formatter": ["Formatera amerikanska telefonnummer", "Formatera ett amerikanskt telefonnummer så att det blir lättare att läsa.", "format för amerikanskt telefonnummer", "Ange och formatera telefonnumret.", "Visa ett amerikanskt nummer i ett vanligt format.", "Välj skiljetecken och visningsformat."],
    "us-zip-code-formatter": ["Formatera amerikanska ZIP-koder", "Formatera ett ZIP- eller ZIP+4-värde enligt vanligt amerikanskt postformat.", "format för ZIP-kod", "Ange och formatera ZIP-koden.", "Visa ett ZIP+4-värde på ett lättläst sätt.", "Välj visning för ZIP eller ZIP+4."],
    "canada-postal-code-formatter": ["Formatera kanadensiska postnummer", "Formatera ett kanadensiskt postnummer med versaler och ett mellanslag i mitten.", "format för kanadensiskt postnummer", "Ange och formatera postnumret.", "Lägg till mellanrummet i en kanadensisk kod.", "Använd versaler och standardmellanrum."],
  },
  cs: {
    "numbers4-number-generator": ["Generátor čísel Numbers4", "Vytvořte náhodné čtyřmístné číslo z číslic 0 až 9 pro japonskou loterii Numbers4.", "náhodné číslo Numbers4", "Vytvořte čtyřmístný výsledek.", "Vygenerujte čtyřmístné číslo pro Numbers4.", "Každá číslice je v rozsahu 0–9 a může se opakovat."],
    "bingo5-number-generator": ["Generátor čísel Bingo5", "Vytvořte osm náhodných čísel podle rozsahů sloupců japonské hry Bingo5.", "čísla Bingo5", "Vytvořte osm čísel.", "Vygenerujte osm čísel pro Bingo5.", "Dodržují se číselné rozsahy určené pro jednotlivé sloupce."],
    "us-phone-number-formatter": ["Formátovač telefonních čísel USA", "Upravte telefonní číslo USA do běžně čitelného formátu.", "formát telefonního čísla USA", "Zadejte a naformátujte číslo.", "Zobrazte číslo USA v obvyklém formátu.", "Vyberte oddělovače a způsob zobrazení."],
    "us-zip-code-formatter": ["Formátovač ZIP kódů USA", "Upravte hodnotu ZIP nebo ZIP+4 do běžného amerického poštovního formátu.", "formát ZIP kódu", "Zadejte a naformátujte ZIP kód.", "Zobrazte hodnotu ZIP+4 přehledně.", "Zvolte zobrazení ZIP nebo ZIP+4."],
    "canada-postal-code-formatter": ["Formátovač kanadských poštovních směrovacích čísel", "Upravte kanadské poštovní směrovací číslo na velká písmena s mezerou uprostřed.", "formát kanadského PSČ", "Zadejte a naformátujte PSČ.", "Vložte mezeru do kanadského PSČ.", "Použijte velká písmena a standardní mezeru."],
  },
  ro: {
    "numbers4-number-generator": ["Generator de numere Numbers4", "Generați un număr aleatoriu de patru cifre, de la 0 la 9, pentru loteria japoneză Numbers4.", "număr aleatoriu Numbers4", "Generați un rezultat din patru cifre.", "Generați un număr din patru cifre pentru Numbers4.", "Fiecare cifră este între 0 și 9 și se poate repeta."],
    "bingo5-number-generator": ["Generator de numere Bingo5", "Generați opt numere aleatorii respectând intervalele coloanelor pentru Bingo5 din Japonia.", "numere Bingo5", "Generați opt numere.", "Generați un set de opt numere pentru Bingo5.", "Sunt respectate intervalele stabilite pentru fiecare coloană."],
    "us-phone-number-formatter": ["Formatator de numere de telefon SUA", "Formatați un număr de telefon din SUA într-un format ușor de citit.", "format număr telefon SUA", "Introduceți și formatați numărul.", "Afișați un număr american într-un format uzual.", "Alegeți separatorii și stilul de afișare."],
    "us-zip-code-formatter": ["Formatator de coduri ZIP SUA", "Formatați o valoare ZIP sau ZIP+4 în stilul poștal uzual din SUA.", "format cod ZIP", "Introduceți și formatați codul ZIP.", "Afișați lizibil o valoare ZIP+4.", "Alegeți afișarea ZIP sau ZIP+4."],
    "canada-postal-code-formatter": ["Formatator de coduri poștale canadiene", "Formatați codul poștal canadian cu majuscule și spațiu la mijloc.", "format cod poștal Canada", "Introduceți și formatați codul poștal.", "Adăugați spațiul în codul canadian.", "Folosiți majuscule și separatorul standard."],
  },
  el: {
    "numbers4-number-generator": ["Γεννήτρια αριθμών Numbers4", "Δημιουργήστε έναν τυχαίο τετραψήφιο αριθμό με ψηφία 0–9 για την ιαπωνική λοταρία Numbers4.", "τυχαίος αριθμός Numbers4", "Δημιουργήστε τετραψήφιο αποτέλεσμα.", "Δημιουργήστε έναν τετραψήφιο αριθμό για το Numbers4.", "Κάθε ψηφίο είναι από 0 έως 9 και μπορεί να επαναληφθεί."],
    "bingo5-number-generator": ["Γεννήτρια αριθμών Bingo5", "Δημιουργήστε οκτώ τυχαίους αριθμούς σύμφωνα με τα εύρη στηλών του ιαπωνικού Bingo5.", "αριθμοί Bingo5", "Δημιουργήστε οκτώ αριθμούς.", "Δημιουργήστε ένα σύνολο οκτώ αριθμών για το Bingo5.", "Τηρούνται τα καθορισμένα εύρη αριθμών για κάθε στήλη."],
    "us-phone-number-formatter": ["Μορφοποίηση τηλεφώνων ΗΠΑ", "Μορφοποιήστε έναν αριθμό τηλεφώνου ΗΠΑ σε ευανάγνωστη συνηθισμένη μορφή.", "μορφή τηλεφωνικού αριθμού ΗΠΑ", "Εισαγάγετε και μορφοποιήστε τον αριθμό.", "Εμφανίστε έναν αριθμό ΗΠΑ σε καθιερωμένη μορφή.", "Επιλέξτε διαχωριστικά και τρόπο εμφάνισης."],
    "us-zip-code-formatter": ["Μορφοποίηση ταχυδρομικών κωδικών ZIP ΗΠΑ", "Μορφοποιήστε τιμή ZIP ή ZIP+4 στη συνηθισμένη ταχυδρομική μορφή των ΗΠΑ.", "μορφή κωδικού ZIP", "Εισαγάγετε και μορφοποιήστε τον κωδικό ZIP.", "Εμφανίστε ευανάγνωστα μια τιμή ZIP+4.", "Επιλέξτε εμφάνιση ZIP ή ZIP+4."],
    "canada-postal-code-formatter": ["Μορφοποίηση ταχυδρομικών κωδικών Καναδά", "Μορφοποιήστε καναδικό ταχυδρομικό κωδικό με κεφαλαία και κενό στη μέση.", "μορφή ταχυδρομικού κωδικού Καναδά", "Εισαγάγετε και μορφοποιήστε τον κωδικό.", "Προσθέστε το κενό στον καναδικό κωδικό.", "Χρησιμοποιήστε κεφαλαία και το τυπικό κενό διαχωρισμού."],
  },
};

function build(locale: SevenTargetLocale, slug: string, [title, description, keyword, action, example, options]: Copy): TargetSevenToolTranslation {
  const ui = shared[locale];
  return { title, description, seoTitle: `${title} | Woori Tools`, seoDescription: `${description} ${ui.privacy}`, category: ui.category, keywords: [keyword, title, slug], steps: [ui.steps[0], action, ui.steps[2]], example, options, caution: ui.caution, faq: { example: ui.faq.example, caution: ui.faq.caution } };
}

const translations = Object.fromEntries((Object.keys(content) as SevenTargetLocale[]).map((locale) => [locale, Object.fromEntries(Object.entries(content[locale]).map(([slug, copy]) => [slug, build(locale, slug, copy)]))])) as Record<SevenTargetLocale, Record<string, TargetSevenToolTranslation>>;

export const targetSevenCountryFormattersBatchSeventeenSlugs = ["numbers4-number-generator", "bingo5-number-generator", "us-phone-number-formatter", "us-zip-code-formatter", "canada-postal-code-formatter"] as const;

export function getTargetSevenCountryFormattersBatchSeventeenTranslation(locale: SevenTargetLocale, slug: string): TargetSevenToolTranslation | undefined {
  return translations[locale][slug];
}
