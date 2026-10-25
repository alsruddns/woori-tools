import type { PlannedLocale } from "@/i18n/routing";

type ExpandedWorkspaceLocale = Extract<PlannedLocale, "fil" | "bn" | "uk" | "ms" | "sv" | "cs" | "ro" | "el">;

export const targetBarcodeWorkspaceCopy = {
  fil: { value: "Teksto o numero", format: "Format ng barcode", run: "Gumawa ng barcode", error: "Hindi magawa ang barcode. Suriin ang inilagay at subukan muli.", result: "Nabuong barcode", download: "I-download ang SVG" },
  bn: { value: "লেখা বা নম্বর", format: "বারকোডের ফরম্যাট", run: "বারকোড তৈরি করুন", error: "বারকোড তৈরি করা যায়নি। লেখা যাচাই করে আবার চেষ্টা করুন।", result: "তৈরি করা বারকোড", download: "SVG ডাউনলোড করুন" },
  uk: { value: "Текст або число", format: "Формат штрихкоду", run: "Створити штрихкод", error: "Не вдалося створити штрихкод. Перевірте введені дані й повторіть спробу.", result: "Створений штрихкод", download: "Завантажити SVG" },
  ms: { value: "Teks atau nombor", format: "Format kod bar", run: "Jana kod bar", error: "Kod bar tidak dapat dijana. Semak input dan cuba lagi.", result: "Kod bar yang dijana", download: "Muat turun SVG" },
  sv: { value: "Text eller nummer", format: "Streckkodsformat", run: "Skapa streckkod", error: "Streckkoden kunde inte skapas. Kontrollera värdet och försök igen.", result: "Skapad streckkod", download: "Ladda ned SVG" },
  cs: { value: "Text nebo číslo", format: "Formát čárového kódu", run: "Vytvořit čárový kód", error: "Čárový kód se nepodařilo vytvořit. Zkontrolujte vstup a zkuste to znovu.", result: "Vytvořený čárový kód", download: "Stáhnout SVG" },
  ro: { value: "Text sau număr", format: "Formatul codului de bare", run: "Generează codul de bare", error: "Codul de bare nu a putut fi generat. Verificați datele și încercați din nou.", result: "Cod de bare generat", download: "Descarcă SVG" },
  el: { value: "Κείμενο ή αριθμός", format: "Μορφή γραμμωτού κώδικα", run: "Δημιουργία γραμμωτού κώδικα", error: "Δεν ήταν δυνατή η δημιουργία του γραμμωτού κώδικα. Ελέγξτε την τιμή και δοκιμάστε ξανά.", result: "Γραμμωτός κώδικας που δημιουργήθηκε", download: "Λήψη SVG" },
} satisfies Record<ExpandedWorkspaceLocale, { value: string; format: string; run: string; error: string; result: string; download: string }>;

export function getTargetBarcodeWorkspaceCopy(locale: ExpandedWorkspaceLocale) {
  return targetBarcodeWorkspaceCopy[locale];
}
