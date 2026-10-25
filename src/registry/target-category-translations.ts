import type { PlannedLocale } from "@/i18n/routing";
import { categories, type ToolCategory } from "./categories";

type ExpandedLocale = Extract<PlannedLocale, "fil" | "bn" | "uk" | "ms" | "sv" | "cs" | "ro" | "el">;
const labels = {
  fil: { random: "Random at Bunutan", "date-time": "Petsa at Oras", utility: "Mga Utility", fortune: "Kapalaran at Aliwan", image: "Larawan", pdf: "PDF", text: "Teksto", developer: "Developer", qr: "QR at Mga Utility" },
  bn: { random: "এলোমেলো ও নির্বাচন", "date-time": "তারিখ ও সময়", utility: "দৈনন্দিন সরঞ্জাম", fortune: "ভাগ্য ও বিনোদন", image: "ছবি", pdf: "PDF", text: "লেখা", developer: "ডেভেলপার", qr: "QR ও উপযোগী সরঞ্জাম" },
  uk: { random: "Випадковий вибір", "date-time": "Дата й час", utility: "Корисні інструменти", fortune: "Ворожіння та розваги", image: "Зображення", pdf: "PDF", text: "Текст", developer: "Для розробників", qr: "QR та утиліти" },
  ms: { random: "Rawak dan Cabutan", "date-time": "Tarikh dan Masa", utility: "Alat Harian", fortune: "Tuah dan Hiburan", image: "Imej", pdf: "PDF", text: "Teks", developer: "Pembangun", qr: "QR dan Utiliti" },
  sv: { random: "Slump och utlottning", "date-time": "Datum och tid", utility: "Vardagsverktyg", fortune: "Spådom och nöje", image: "Bild", pdf: "PDF", text: "Text", developer: "Utvecklare", qr: "QR och verktyg" },
  cs: { random: "Náhodný výběr", "date-time": "Datum a čas", utility: "Praktické nástroje", fortune: "Věštění a zábava", image: "Obrázky", pdf: "PDF", text: "Text", developer: "Pro vývojáře", qr: "QR a nástroje" },
  ro: { random: "Aleatoriu și extrageri", "date-time": "Dată și oră", utility: "Instrumente utile", fortune: "Ghicire și divertisment", image: "Imagini", pdf: "PDF", text: "Text", developer: "Pentru dezvoltatori", qr: "QR și utilitare" },
  el: { random: "Τυχαία επιλογή", "date-time": "Ημερομηνία και ώρα", utility: "Χρήσιμα εργαλεία", fortune: "Μαντεία και ψυχαγωγία", image: "Εικόνες", pdf: "PDF", text: "Κείμενο", developer: "Για προγραμματιστές", qr: "QR και εργαλεία" },
} satisfies Record<ExpandedLocale, Record<ToolCategory, string>>;
const descriptions = {
  fil: { random: "Mga tool para sa random na pagpili, bunutan, at pagbuo ng mga grupo.", "date-time": "Mga tool para sa oras, petsa, timer, at pag-aayos ng iskedyul.", utility: "Mga praktikal na tool para sa mga code at pang-araw-araw na gawain.", fortune: "Mga tool para sa horoscope, tarot, at libangan.", image: "Mga tool para baguhin, i-edit, at suriin ang mga larawan.", pdf: "Mga tool para pagsamahin, ayusin, at suriin ang mga PDF.", text: "Mga tool para baguhin at suriin ang teksto.", developer: "Mga tool para sa pag-format, pag-edit, at pag-preview ng text at code.", qr: "Mga tool para gumawa at magbasa ng QR code." },
  bn: { random: "এলোমেলো নির্বাচন, ড্র এবং দল তৈরির সরঞ্জাম।", "date-time": "সময়, তারিখ, টাইমার ও সময়সূচির সরঞ্জাম।", utility: "কোড ও দৈনন্দিন কাজের জন্য ব্যবহারিক সরঞ্জাম।", fortune: "রাশিফল, ট্যারো ও বিনোদনের সরঞ্জাম।", image: "ছবি রূপান্তর, সম্পাদনা ও পরীক্ষা করার সরঞ্জাম।", pdf: "PDF একত্র করা, সাজানো ও পরীক্ষা করার সরঞ্জাম।", text: "লেখা রূপান্তর ও বিশ্লেষণের সরঞ্জাম।", developer: "লেখা ও কোড ফরম্যাট, সম্পাদনা এবং প্রিভিউ করার সরঞ্জাম।", qr: "QR কোড তৈরি ও পড়ার সরঞ্জাম।" },
  uk: { random: "Інструменти для випадкового вибору, жеребкування та створення команд.", "date-time": "Інструменти для часу, дат, таймерів і планування.", utility: "Практичні інструменти для кодів і повсякденних завдань.", fortune: "Інструменти для гороскопів, таро та розваг.", image: "Інструменти для перетворення, редагування та перевірки зображень.", pdf: "Інструменти для об’єднання, упорядкування та перевірки PDF-файлів.", text: "Інструменти для перетворення й аналізу тексту.", developer: "Інструменти для форматування, редагування та попереднього перегляду тексту й коду.", qr: "Інструменти для створення та читання QR-кодів." },
  ms: { random: "Alat untuk pilihan rawak, cabutan dan pembentukan pasukan.", "date-time": "Alat untuk masa, tarikh, pemasa dan jadual.", utility: "Alat praktikal untuk kod dan urusan harian.", fortune: "Alat untuk horoskop, tarot dan hiburan.", image: "Alat untuk menukar, mengedit dan memeriksa imej.", pdf: "Alat untuk menggabungkan, menyusun dan memeriksa PDF.", text: "Alat untuk menukar dan menganalisis teks.", developer: "Alat untuk memformat, mengedit dan melihat pratonton teks serta kod.", qr: "Alat untuk menjana dan membaca kod QR." },
  sv: { random: "Verktyg för slumpmässiga val, utlottningar och lagindelning.", "date-time": "Verktyg för tid, datum, tidtagning och planering.", utility: "Praktiska verktyg för koder och vardagliga uppgifter.", fortune: "Verktyg för horoskop, tarot och nöje.", image: "Verktyg för att konvertera, redigera och granska bilder.", pdf: "Verktyg för att slå ihop, ordna och granska PDF-filer.", text: "Verktyg för att omvandla och analysera text.", developer: "Verktyg för att formatera, redigera och förhandsgranska text och kod.", qr: "Verktyg för att skapa och läsa QR-koder." },
  cs: { random: "Nástroje pro náhodný výběr, losování a sestavení týmů.", "date-time": "Nástroje pro čas, datum, časovače a plánování.", utility: "Praktické nástroje pro kódy a každodenní úkoly.", fortune: "Nástroje pro horoskopy, tarot a zábavu.", image: "Nástroje pro převod, úpravu a kontrolu obrázků.", pdf: "Nástroje pro slučování, řazení a kontrolu souborů PDF.", text: "Nástroje pro úpravu a analýzu textu.", developer: "Nástroje pro formátování, úpravy a náhled textu a kódu.", qr: "Nástroje pro vytváření a čtení QR kódů." },
  ro: { random: "Instrumente pentru alegeri aleatorii, extrageri și formarea echipelor.", "date-time": "Instrumente pentru oră, dată, cronometre și planificare.", utility: "Instrumente practice pentru coduri și activități zilnice.", fortune: "Instrumente pentru horoscop, tarot și divertisment.", image: "Instrumente pentru conversia, editarea și verificarea imaginilor.", pdf: "Instrumente pentru îmbinarea, organizarea și verificarea fișierelor PDF.", text: "Instrumente pentru transformarea și analizarea textului.", developer: "Instrumente pentru formatarea, editarea și previzualizarea textului și a codului.", qr: "Instrumente pentru crearea și citirea codurilor QR." },
  el: { random: "Εργαλεία για τυχαίες επιλογές, κληρώσεις και δημιουργία ομάδων.", "date-time": "Εργαλεία για ώρα, ημερομηνία, χρονόμετρα και προγραμματισμό.", utility: "Πρακτικά εργαλεία για κωδικούς και καθημερινές εργασίες.", fortune: "Εργαλεία για ωροσκόπια, ταρώ και ψυχαγωγία.", image: "Εργαλεία για μετατροπή, επεξεργασία και έλεγχο εικόνων.", pdf: "Εργαλεία για συγχώνευση, οργάνωση και έλεγχο αρχείων PDF.", text: "Εργαλεία για μετατροπή και ανάλυση κειμένου.", developer: "Εργαλεία μορφοποίησης, επεξεργασίας και προεπισκόπησης κειμένου και κώδικα.", qr: "Εργαλεία για δημιουργία και ανάγνωση κωδικών QR." },
} satisfies Record<ExpandedLocale, Partial<Record<ToolCategory, string>>>;

export function getTargetCategoryName(locale: ExpandedLocale, id: ToolCategory): string {
  return labels[locale][id];
}

export function getTargetCategoryDescription(locale: ExpandedLocale, id: ToolCategory): string {
  const localizedDescriptions: Partial<Record<ToolCategory, string>> = descriptions[locale];
  const description = localizedDescriptions[id];
  if (!description) throw new Error(`Missing ${locale} category description for ${id}`);
  return description;
}

export function isExpandedLocale(locale: PlannedLocale): locale is ExpandedLocale {
  return Object.hasOwn(labels, locale);
}

export function getTargetCategories(locale: ExpandedLocale, visibleIds: readonly ToolCategory[]) {
  return categories.filter(({ id }) => visibleIds.includes(id)).map((category) => ({ ...category, name: getTargetCategoryName(locale, category.id), description: getTargetCategoryDescription(locale, category.id) }));
}

export type { ExpandedLocale };
