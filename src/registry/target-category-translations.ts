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
  fil: { utility: "Mga praktikal na tool para sa mga code at pang-araw-araw na gawain.", developer: "Mga tool para sa pag-format, pag-edit, at pag-preview ng text at code." },
  bn: { utility: "কোড ও দৈনন্দিন কাজের জন্য ব্যবহারিক সরঞ্জাম।", developer: "লেখা ও কোড ফরম্যাট, সম্পাদনা এবং প্রিভিউ করার সরঞ্জাম।" },
  uk: { utility: "Практичні інструменти для кодів і повсякденних завдань.", developer: "Інструменти для форматування, редагування та попереднього перегляду тексту й коду." },
  ms: { utility: "Alat praktikal untuk kod dan urusan harian.", developer: "Alat untuk memformat, mengedit dan melihat pratonton teks serta kod." },
  sv: { utility: "Praktiska verktyg för koder och vardagliga uppgifter.", developer: "Verktyg för att formatera, redigera och förhandsgranska text och kod." },
  cs: { utility: "Praktické nástroje pro kódy a každodenní úkoly.", developer: "Nástroje pro formátování, úpravy a náhled textu a kódu." },
  ro: { utility: "Instrumente practice pentru coduri și activități zilnice.", developer: "Instrumente pentru formatarea, editarea și previzualizarea textului și a codului." },
  el: { utility: "Πρακτικά εργαλεία για κωδικούς και καθημερινές εργασίες.", developer: "Εργαλεία μορφοποίησης, επεξεργασίας και προεπισκόπησης κειμένου και κώδικα." },
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
