import type { SevenTargetLocale, TargetSevenToolTranslation } from "./target-seven-tools-translations";

type Shared = { category: string; choose: string; review: string; caution: string; faq: string; privacy: string; tail: string };
type Copy = [string, string, string, string, string, string];

const shared: Record<SevenTargetLocale, Shared> = {
  bn: { category: "ছবি সম্পাদনা ও রূপান্তর", choose: "আপনার ডিভাইস থেকে একটি ছবি বেছে নিন।", review: "প্রিভিউ পরীক্ষা করে ফলাফল ডাউনলোড করুন।", caution: "ছবি ব্রাউজারেই প্রক্রিয়া হয়; সার্ভারে পাঠানো হয় না।", faq: "ছবিটি কি সার্ভারে আপলোড হয়?", privacy: "না, ছবি আপনার ব্রাউজারেই প্রক্রিয়া করা হয়।", tail: "ছবি সরাসরি আপনার ডিভাইসে প্রক্রিয়া করুন।" },
  uk: { category: "Редагування та конвертація зображень", choose: "Виберіть зображення на своєму пристрої.", review: "Перегляньте результат і завантажте його.", caution: "Зображення обробляється у браузері й не надсилається на сервер.", faq: "Чи завантажується зображення на сервер?", privacy: "Ні, зображення обробляється безпосередньо у браузері.", tail: "Обробляйте зображення безпосередньо на пристрої." },
  ms: { category: "Suntingan dan penukaran imej", choose: "Pilih imej daripada peranti anda.", review: "Semak pratonton dan muat turun hasilnya.", caution: "Imej diproses dalam pelayar dan tidak dihantar ke pelayan.", faq: "Adakah imej dimuat naik ke pelayan?", privacy: "Tidak, imej diproses terus dalam pelayar anda.", tail: "Proses imej terus pada peranti anda." },
  sv: { category: "Bildredigering och konvertering", choose: "Välj en bild från enheten.", review: "Granska förhandsvisningen och ladda ned resultatet.", caution: "Bilden bearbetas i webbläsaren och skickas inte till en server.", faq: "Laddas bilden upp till en server?", privacy: "Nej, bilden bearbetas direkt i webbläsaren.", tail: "Bearbeta bilder direkt på enheten." },
  cs: { category: "Úprava a převod obrázků", choose: "Vyberte obrázek ze svého zařízení.", review: "Zkontrolujte náhled a stáhněte výsledek.", caution: "Obrázek se zpracovává v prohlížeči a neposílá se na server.", faq: "Nahrává se obrázek na server?", privacy: "Ne, obrázek se zpracovává přímo v prohlížeči.", tail: "Zpracovávejte obrázky přímo ve svém zařízení." },
  ro: { category: "Editare și conversie imagini", choose: "Alegeți o imagine de pe dispozitiv.", review: "Verificați previzualizarea și descărcați rezultatul.", caution: "Imaginea este prelucrată în browser și nu este trimisă la server.", faq: "Este încărcată imaginea pe un server?", privacy: "Nu, imaginea este prelucrată direct în browser.", tail: "Prelucrați imaginile direct pe dispozitivul dvs." },
  el: { category: "Επεξεργασία και μετατροπή εικόνων", choose: "Επιλέξτε μια εικόνα από τη συσκευή σας.", review: "Ελέγξτε την προεπισκόπηση και κατεβάστε το αποτέλεσμα.", caution: "Η εικόνα επεξεργάζεται στο πρόγραμμα περιήγησης και δεν αποστέλλεται σε διακομιστή.", faq: "Μεταφορτώνεται η εικόνα σε διακομιστή;", privacy: "Όχι, η εικόνα επεξεργάζεται απευθείας στο πρόγραμμα περιήγησης.", tail: "Επεξεργαστείτε εικόνες απευθείας στη συσκευή σας." },
};

const content: Record<SevenTargetLocale, Record<string, Copy>> = {
  bn: {
    "png-to-webp": ["PNG থেকে WebP রূপান্তর", "PNG ছবিকে WebP-তে রূপান্তর করুন এবং স্বচ্ছতা ও ছবির গুণমান বজায় রাখুন।", "PNG থেকে WebP রূপান্তর", "PNG নির্বাচন করুন এবং WebP গুণমান ঠিক করুন।", "ওয়েব পৃষ্ঠার জন্য PNG গ্রাফিককে WebP-তে রূপান্তর করুন।", "গুণমান কমালে ফাইল ছোট হতে পারে; স্বচ্ছতা সমর্থিত থাকে।"],
    "heic-to-jpg": ["HEIC থেকে JPG রূপান্তর", "HEIC ছবি JPG ফরম্যাটে রূপান্তর করে সহজে দেখা ও ভাগ করার জন্য ডাউনলোড করুন।", "HEIC থেকে JPG রূপান্তর", "একটি HEIC ছবি নির্বাচন করে JPG তৈরি করুন।", "ফোনের HEIC ছবিকে JPG ফাইলে রূপান্তর করুন।", "রূপান্তরের পর ছবির মেটাডেটা বজায় নাও থাকতে পারে; ব্যক্তিগত তথ্যের কথা বিবেচনা করুন।"],
    "image-compress": ["ছবির আকার কমান", "পিক্সেলের মাপ না বদলে ছবির ফাইল সাইজ কমাতে গুণমান সামঞ্জস্য করুন।", "ছবি কমপ্রেসর", "ছবি বেছে নিয়ে কমপ্রেশন গুণমান সেট করুন।", "ওয়েবসাইটে আপলোডের আগে ছবির আকার কমান।", "কমপ্রেশন বেশি হলে ছবির দৃশ্যমান মান কমতে পারে; প্রিভিউ দেখে নিন।"],
    "image-resize": ["ছবির মাপ পরিবর্তন", "নতুন প্রস্থ ও উচ্চতা দিয়ে ছবির পিক্সেল মাত্রা পরিবর্তন করুন।", "ছবির মাপ পরিবর্তন", "ছবি নির্বাচন করে নতুন প্রস্থ ও উচ্চতা দিন।", "প্রোফাইল ছবিকে ছোট নির্দিষ্ট মাপে পরিবর্তন করুন।", "আকৃতির অনুপাত ঠিক রাখতে লক চালু করুন; বড় করা ছবির মান কমতে পারে।"],
    "image-crop": ["ছবি ক্রপ করুন", "ছবির অপ্রয়োজনীয় অংশ কেটে কাঙ্ক্ষিত ফ্রেম রাখুন।", "ছবি ক্রপ টুল", "ছবি নির্বাচন করে প্রিভিউতে ক্রপ এলাকা নির্ধারণ করুন।", "শেয়ার করার আগে ছবির চারপাশের ফাঁকা অংশ কাটুন।", "ডাউনলোডের আগে ক্রপ করা অংশ পরীক্ষা করুন; মূল ফাইল অপরিবর্তিত থাকে।"],
  },
  uk: {
    "png-to-webp": ["Конвертер PNG у WebP", "Перетворіть PNG на WebP та збережіть прозорість і якість зображення.", "конвертер PNG у WebP", "Виберіть PNG і налаштуйте якість WebP.", "Перетворіть графіку PNG на WebP для вебсторінки.", "Нижча якість може зменшити розмір файлу; прозорість підтримується."],
    "heic-to-jpg": ["Конвертер HEIC у JPG", "Перетворіть зображення HEIC на JPG для зручнішого перегляду та поширення.", "конвертер HEIC у JPG", "Виберіть зображення HEIC, щоб створити JPG.", "Перетворіть фото HEIC із телефона на файл JPG.", "Метадані можуть не зберегтися після перетворення; зважайте на особисту інформацію."],
    "image-compress": ["Стиснення зображень", "Зменште розмір файлу, налаштувавши якість без зміни кількості пікселів.", "стиснення зображень", "Виберіть зображення та налаштуйте рівень стиснення.", "Зменште розмір зображення перед завантаженням на сайт.", "Сильніше стиснення може погіршити вигляд; перевірте попередній перегляд."],
    "image-resize": ["Зміна розміру зображення", "Змініть кількість пікселів зображення, задавши нову ширину та висоту.", "зміна розміру зображення", "Виберіть зображення та введіть ширину й висоту.", "Зменште фото профілю до потрібного розміру.", "Увімкніть збереження пропорцій; збільшення може знизити чіткість."],
    "image-crop": ["Обрізання зображення", "Видаліть зайві краї та залиште потрібну частину зображення у кадрі.", "інструмент обрізання зображення", "Виберіть зображення та задайте область обрізання у попередньому перегляді.", "Обріжте порожні краї фото перед поширенням.", "Перевірте вибрану область перед завантаженням; оригінал залишається незмінним."],
  },
  ms: {
    "png-to-webp": ["Penukar PNG kepada WebP", "Tukar PNG kepada WebP sambil mengekalkan ketelusan dan melaraskan kualiti imej.", "penukar PNG kepada WebP", "Pilih PNG dan laraskan kualiti WebP.", "Tukar grafik PNG kepada WebP untuk halaman web.", "Kualiti yang lebih rendah boleh mengecilkan fail; ketelusan disokong."],
    "heic-to-jpg": ["Penukar HEIC kepada JPG", "Tukar imej HEIC kepada JPG supaya lebih mudah dilihat dan dikongsi.", "penukar HEIC kepada JPG", "Pilih imej HEIC untuk menghasilkan JPG.", "Tukar foto HEIC telefon kepada fail JPG.", "Metadata mungkin tidak dikekalkan selepas penukaran; pertimbangkan maklumat peribadi."],
    "image-compress": ["Pemampat imej", "Kurangkan saiz fail imej dengan melaraskan kualiti tanpa mengubah dimensi piksel.", "pemampat imej", "Pilih imej dan tetapkan tahap pemampatan.", "Kecilkan imej sebelum memuat naiknya ke laman web.", "Pemampatan yang kuat boleh menjejaskan rupa imej; semak pratontonnya."],
    "image-resize": ["Ubah saiz imej", "Ubah dimensi piksel imej dengan menetapkan lebar dan tinggi baharu.", "ubah saiz imej", "Pilih imej dan masukkan lebar serta tinggi baharu.", "Kecilkan foto profil kepada dimensi yang diperlukan.", "Kunci nisbah aspek untuk mengekalkan bentuk; pembesaran boleh mengurangkan ketajaman."],
    "image-crop": ["Pangkas imej", "Potong bahagian tepi yang tidak diperlukan untuk mengekalkan bingkai imej yang dikehendaki.", "alat pangkas imej", "Pilih imej dan tetapkan kawasan pangkas dalam pratonton.", "Pangkas ruang kosong di sekeliling foto sebelum berkongsi.", "Semak kawasan pilihan sebelum memuat turun; fail asal tidak diubah."],
  },
  sv: {
    "png-to-webp": ["Konvertera PNG till WebP", "Konvertera PNG till WebP och behåll transparens samtidigt som bildkvaliteten kan justeras.", "konvertera PNG till WebP", "Välj PNG och ställ in WebP-kvalitet.", "Konvertera PNG-grafik till WebP för en webbsida.", "Lägre kvalitet kan ge en mindre fil; transparens stöds."],
    "heic-to-jpg": ["Konvertera HEIC till JPG", "Konvertera HEIC-bilder till JPG för enklare visning och delning.", "konvertera HEIC till JPG", "Välj en HEIC-bild för att skapa en JPG-fil.", "Konvertera en HEIC-bild från telefonen till JPG.", "Metadata kanske inte bevaras efter konverteringen; tänk på personlig information."],
    "image-compress": ["Komprimera bild", "Minska bildens filstorlek genom att justera kvaliteten utan att ändra pixelmåtten.", "komprimera bild", "Välj en bild och ställ in komprimeringsnivån.", "Minska bildstorleken före uppladdning till en webbplats.", "Hög komprimering kan försämra utseendet; granska förhandsvisningen."],
    "image-resize": ["Ändra bildstorlek", "Ändra bildens pixelmått genom att ange en ny bredd och höjd.", "ändra bildstorlek", "Välj en bild och ange ny bredd och höjd.", "Anpassa ett profilfoto till önskade mått.", "Lås proportionerna för att behålla formen; förstoring kan minska skärpan."],
    "image-crop": ["Beskär bild", "Ta bort oönskade kanter och behåll den del av bilden som ska vara kvar.", "beskär bild", "Välj en bild och markera beskärningsområdet i förhandsvisningen.", "Beskär tomma kanter runt ett foto före delning.", "Granska området innan du laddar ned; originalfilen ändras inte."],
  },
  cs: {
    "png-to-webp": ["Převod PNG na WebP", "Převeďte PNG do WebP, zachovejte průhlednost a upravte kvalitu obrázku.", "převod PNG na WebP", "Vyberte PNG a nastavte kvalitu WebP.", "Převeďte grafiku PNG do WebP pro webovou stránku.", "Nižší kvalita může zmenšit soubor; průhlednost je podporována."],
    "heic-to-jpg": ["Převod HEIC na JPG", "Převeďte obrázky HEIC do JPG pro snadnější prohlížení a sdílení.", "převod HEIC na JPG", "Vyberte obrázek HEIC a vytvořte soubor JPG.", "Převeďte fotografii HEIC z telefonu na JPG.", "Metadata se po převodu nemusí zachovat; zvažte osobní údaje."],
    "image-compress": ["Komprese obrázku", "Zmenšete velikost souboru úpravou kvality bez změny počtu pixelů.", "komprese obrázku", "Vyberte obrázek a nastavte úroveň komprese.", "Zmenšete obrázek před nahráním na web.", "Silná komprese může zhoršit vzhled; zkontrolujte náhled."],
    "image-resize": ["Změna velikosti obrázku", "Změňte rozměry obrázku v pixelech zadáním nové šířky a výšky.", "změna velikosti obrázku", "Vyberte obrázek a zadejte novou šířku a výšku.", "Upravte profilovou fotku na požadované rozměry.", "Uzamkněte poměr stran; zvětšení může snížit ostrost."],
    "image-crop": ["Oříznutí obrázku", "Ořízněte nežádoucí okraje a ponechte požadovanou část obrázku.", "nástroj pro oříznutí obrázku", "Vyberte obrázek a v náhledu určete oblast oříznutí.", "Před sdílením ořízněte prázdné okraje fotografie.", "Před stažením zkontrolujte vybranou oblast; původní soubor se nemění."],
  },
  ro: {
    "png-to-webp": ["Convertor PNG în WebP", "Convertiți PNG în WebP, păstrând transparența și ajustând calitatea imaginii.", "convertor PNG în WebP", "Alegeți PNG și reglați calitatea WebP.", "Convertiți o grafică PNG în WebP pentru un site web.", "O calitate mai mică poate reduce dimensiunea fișierului; transparența este acceptată."],
    "heic-to-jpg": ["Convertor HEIC în JPG", "Convertiți imaginile HEIC în JPG pentru vizualizare și partajare mai ușoară.", "convertor HEIC în JPG", "Alegeți o imagine HEIC pentru a crea un fișier JPG.", "Convertiți fotografia HEIC din telefon într-un fișier JPG.", "Metadatele pot să nu fie păstrate după conversie; luați în calcul informațiile personale."],
    "image-compress": ["Comprimare imagine", "Reduceți dimensiunea fișierului ajustând calitatea fără a schimba dimensiunile în pixeli.", "comprimare imagine", "Alegeți o imagine și setați nivelul de comprimare.", "Reduceți dimensiunea imaginii înainte de încărcarea pe site.", "Comprimarea puternică poate afecta aspectul; verificați previzualizarea."],
    "image-resize": ["Redimensionare imagine", "Schimbați dimensiunile imaginii în pixeli introducând o lățime și o înălțime noi.", "redimensionare imagine", "Alegeți o imagine și introduceți noua lățime și înălțime.", "Redimensionați fotografia de profil la dimensiunea dorită.", "Blocați proporțiile pentru a păstra forma; mărirea poate reduce claritatea."],
    "image-crop": ["Decupare imagine", "Eliminați marginile nedorite și păstrați cadrul de imagine dorit.", "instrument decupare imagine", "Alegeți imaginea și definiți zona de decupare în previzualizare.", "Decupați spațiul gol din jurul fotografiei înainte de partajare.", "Verificați zona selectată înainte de descărcare; fișierul original rămâne neschimbat."],
  },
  el: {
    "png-to-webp": ["Μετατροπή PNG σε WebP", "Μετατρέψτε PNG σε WebP, διατηρώντας τη διαφάνεια και ρυθμίζοντας την ποιότητα εικόνας.", "μετατροπέας PNG σε WebP", "Επιλέξτε PNG και ορίστε ποιότητα WebP.", "Μετατρέψτε γραφικό PNG σε WebP για ιστοσελίδα.", "Η χαμηλότερη ποιότητα μπορεί να μειώσει το μέγεθος αρχείου· υποστηρίζεται διαφάνεια."],
    "heic-to-jpg": ["Μετατροπή HEIC σε JPG", "Μετατρέψτε εικόνες HEIC σε JPG για ευκολότερη προβολή και κοινή χρήση.", "μετατροπέας HEIC σε JPG", "Επιλέξτε εικόνα HEIC για να δημιουργήσετε αρχείο JPG.", "Μετατρέψτε φωτογραφία HEIC από κινητό σε αρχείο JPG.", "Τα μεταδεδομένα ενδέχεται να μη διατηρηθούν μετά τη μετατροπή· λάβετε υπόψη προσωπικές πληροφορίες."],
    "image-compress": ["Συμπίεση εικόνας", "Μειώστε το μέγεθος αρχείου ρυθμίζοντας την ποιότητα χωρίς αλλαγή των διαστάσεων σε pixel.", "συμπίεση εικόνας", "Επιλέξτε εικόνα και ορίστε το επίπεδο συμπίεσης.", "Μειώστε την εικόνα πριν τη μεταφόρτωση σε ιστοσελίδα.", "Η έντονη συμπίεση μπορεί να επηρεάσει την εμφάνιση· ελέγξτε την προεπισκόπηση."],
    "image-resize": ["Αλλαγή μεγέθους εικόνας", "Αλλάξτε τις διαστάσεις pixel της εικόνας ορίζοντας νέο πλάτος και ύψος.", "αλλαγή μεγέθους εικόνας", "Επιλέξτε εικόνα και εισαγάγετε νέο πλάτος και ύψος.", "Προσαρμόστε φωτογραφία προφίλ στις επιθυμητές διαστάσεις.", "Κλειδώστε την αναλογία για να διατηρήσετε το σχήμα· η μεγέθυνση μπορεί να μειώσει την ευκρίνεια."],
    "image-crop": ["Περικοπή εικόνας", "Αφαιρέστε ανεπιθύμητα άκρα και κρατήστε το επιθυμητό κάδρο της εικόνας.", "εργαλείο περικοπής εικόνας", "Επιλέξτε εικόνα και ορίστε περιοχή περικοπής στην προεπισκόπηση.", "Περικόψτε κενό χώρο γύρω από φωτογραφία πριν την κοινοποίηση.", "Ελέγξτε την επιλεγμένη περιοχή πριν τη λήψη· το αρχικό αρχείο δεν αλλάζει."],
  },
};

function build(locale: SevenTargetLocale, slug: string, [title, description, keyword, action, example, options]: Copy): TargetSevenToolTranslation {
  const ui = shared[locale];
  return { title, description, seoTitle: `${title} | Woori Tools`, seoDescription: `${description} ${ui.tail}`, category: ui.category, keywords: [keyword, title, slug], steps: [ui.choose, action, ui.review], example, options, caution: ui.caution, faq: { example: ui.faq, caution: ui.privacy } };
}

const translations = Object.fromEntries((Object.keys(content) as SevenTargetLocale[]).map((locale) => [locale, Object.fromEntries(Object.entries(content[locale]).map(([slug, value]) => [slug, build(locale, slug, value)]))])) as Record<SevenTargetLocale, Record<string, TargetSevenToolTranslation>>;

export const targetSevenImageBatchSevenSlugs = ["png-to-webp", "heic-to-jpg", "image-compress", "image-resize", "image-crop"] as const;

export function getTargetSevenImageBatchSevenTranslation(locale: SevenTargetLocale, slug: string): TargetSevenToolTranslation | undefined {
  return translations[locale][slug];
}
