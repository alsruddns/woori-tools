import type { PlannedLocale } from "./routing";

type ExpandedLocale = "fil" | "bn" | "uk" | "ms" | "sv" | "cs" | "ro" | "el";

export type TargetBrowserDeveloperCopy = {
  fields: [string, string, string, string];
  helper: {
    jwt: string;
    ua: string;
    cidr: string;
    pdf: string;
    unsupported: string;
    success: string;
    failure: string;
    directionA: string;
    directionB: string;
  };
  expiry: { label: string; absent: string; active: string; expired: string };
};

const copy = {
  fil: {
    fields: ["Halaga ng input", "Pangalawang halaga", "Pattern o JSONPath", "Pumili ng PDF file"],
    helper: {
      jwt: "Binabasa lang nito ang payload at exp. Hindi nito sinusuri ang lagda o pinatutunayan ang token.",
      ua: "Gumagamit ito ng lokal na pagtatantiya; maaaring hindi eksakto ang pagkilala sa browser.",
      cidr: "Halimbawa ng IPv4 CIDR: 192.168.1.15/24",
      pdf: "Binabasa ang file sa browser. Ipinapakita ang sukat ng pahina sa PDF point at milimetro.",
      unsupported: "Tumatakbo ang tool na ito sa browser at hindi ipinapadala sa server ang mga inilagay mo.",
      success: "Tapos na",
      failure: "Suriin ang format ng inilagay mo.",
      directionA: "I-encode",
      directionB: "I-decode",
    },
    expiry: { label: "Status ng pag-expire", absent: "Walang exp claim", active: "Hindi pa expired", expired: "Expired na" },
  },
  bn: {
    fields: ["ইনপুট মান", "দ্বিতীয় মান", "প্যাটার্ন বা JSONPath", "PDF ফাইল বেছে নিন"],
    helper: {
      jwt: "এটি শুধু payload পড়ে এবং exp পরীক্ষা করে। স্বাক্ষর বা টোকেনের বৈধতা যাচাই করে না।",
      ua: "এটি ব্রাউজারে স্থানীয় অনুমান ব্যবহার করে; ব্রাউজার শনাক্তকরণ নিশ্চিত নয়।",
      cidr: "IPv4 CIDR উদাহরণ: 192.168.1.15/24",
      pdf: "ফাইলটি ব্রাউজারেই পড়া হয়। পাতার মাপ PDF পয়েন্ট ও মিলিমিটারে দেখানো হয়।",
      unsupported: "এই টুল ব্রাউজারে চলে। আপনার ইনপুট সার্ভারে পাঠানো হয় না।",
      success: "সম্পন্ন",
      failure: "ইনপুটের বিন্যাস পরীক্ষা করুন।",
      directionA: "এনকোড",
      directionB: "ডিকোড",
    },
    expiry: { label: "মেয়াদ অবস্থা", absent: "exp দাবি নেই", active: "মেয়াদ শেষ হয়নি", expired: "মেয়াদ শেষ" },
  },
  uk: {
    fields: ["Вхідне значення", "Друге значення", "Шаблон або JSONPath", "Виберіть файл PDF"],
    helper: {
      jwt: "Декодується лише вміст payload і перевіряється exp. Підпис і чинність токена не перевіряються.",
      ua: "Використовуються локальні евристики; визначення браузера не гарантоване.",
      cidr: "Приклад IPv4 CIDR: 192.168.1.15/24",
      pdf: "Файл читається у браузері. Розміри сторінок показано в пунктах PDF і міліметрах.",
      unsupported: "Інструмент працює у браузері й не надсилає введені дані на сервер.",
      success: "Готово",
      failure: "Перевірте формат введених даних.",
      directionA: "Кодувати",
      directionB: "Декодувати",
    },
    expiry: { label: "Стан строку дії", absent: "Немає поля exp", active: "Строк дії не минув", expired: "Строк дії минув" },
  },
  ms: {
    fields: ["Nilai input", "Nilai kedua", "Corak atau JSONPath", "Pilih fail PDF"],
    helper: {
      jwt: "Hanya payload dibaca dan exp diperiksa. Tandatangan serta kesahan token tidak disahkan.",
      ua: "Anggaran setempat digunakan; pengecaman pelayar tidak dijamin.",
      cidr: "Contoh IPv4 CIDR: 192.168.1.15/24",
      pdf: "Fail dibaca dalam pelayar. Saiz halaman dipaparkan dalam titik PDF dan milimeter.",
      unsupported: "Alat ini berjalan dalam pelayar dan tidak menghantar input ke pelayan.",
      success: "Selesai",
      failure: "Semak format input.",
      directionA: "Pengekodan",
      directionB: "Penyahkodan",
    },
    expiry: { label: "Status tamat tempoh", absent: "Tiada tuntutan exp", active: "Belum tamat tempoh", expired: "Tamat tempoh" },
  },
  sv: {
    fields: ["Indatavärde", "Andra värdet", "Mönster eller JSONPath", "Välj en PDF-fil"],
    helper: {
      jwt: "Endast innehållet avkodas och exp kontrolleras. Signaturen eller tokenens giltighet verifieras inte.",
      ua: "Lokala uppskattningar används; webbläsaren identifieras inte säkert.",
      cidr: "IPv4 CIDR-exempel: 192.168.1.15/24",
      pdf: "Filen läses i webbläsaren. Sidstorlekar visas i PDF-punkter och millimeter.",
      unsupported: "Verktyget körs i webbläsaren. Inmatningen skickas inte till en server.",
      success: "Klart",
      failure: "Kontrollera inmatningsformatet.",
      directionA: "Koda",
      directionB: "Avkoda",
    },
    expiry: { label: "Utgångsstatus", absent: "Inget exp-anspråk", active: "Inte utgången", expired: "Utgången" },
  },
  cs: {
    fields: ["Vstupní hodnota", "Druhá hodnota", "Vzor nebo JSONPath", "Vyberte soubor PDF"],
    helper: {
      jwt: "Dekóduje se pouze payload a kontroluje se exp. Podpis ani platnost tokenu se neověřují.",
      ua: "Používá místní odhady; identifikace prohlížeče není zaručena.",
      cidr: "Příklad IPv4 CIDR: 192.168.1.15/24",
      pdf: "Soubor se čte v prohlížeči. Velikost stránek se zobrazuje v bodech PDF a milimetrech.",
      unsupported: "Nástroj běží v prohlížeči a vstup se neodesílá na server.",
      success: "Hotovo",
      failure: "Zkontrolujte formát vstupu.",
      directionA: "Zakódovat",
      directionB: "Dekódovat",
    },
    expiry: { label: "Stav platnosti", absent: "Chybí claim exp", active: "Platnost nevypršela", expired: "Platnost vypršela" },
  },
  ro: {
    fields: ["Valoare de intrare", "A doua valoare", "Model sau JSONPath", "Alege un fișier PDF"],
    helper: {
      jwt: "Este decodat doar payload-ul și se verifică exp. Semnătura și validitatea tokenului nu sunt verificate.",
      ua: "Folosește estimări locale; identificarea browserului nu este garantată.",
      cidr: "Exemplu IPv4 CIDR: 192.168.1.15/24",
      pdf: "Fișierul este citit în browser. Dimensiunile paginii sunt afișate în puncte PDF și milimetri.",
      unsupported: "Instrumentul rulează în browser și nu trimite datele la server.",
      success: "Gata",
      failure: "Verifică formatul introdus.",
      directionA: "Codifică",
      directionB: "Decodifică",
    },
    expiry: { label: "Starea expirării", absent: "Fără valoarea exp", active: "Nu a expirat", expired: "Expirat" },
  },
  el: {
    fields: ["Τιμή εισόδου", "Δεύτερη τιμή", "Μοτίβο ή JSONPath", "Επιλέξτε αρχείο PDF"],
    helper: {
      jwt: "Αποκωδικοποιείται μόνο το payload και ελέγχεται το exp. Δεν επαληθεύεται η υπογραφή ή η εγκυρότητα του token.",
      ua: "Χρησιμοποιούνται τοπικές εκτιμήσεις· η αναγνώριση του browser δεν είναι εγγυημένη.",
      cidr: "Παράδειγμα IPv4 CIDR: 192.168.1.15/24",
      pdf: "Το αρχείο διαβάζεται στο browser. Τα μεγέθη σελίδων εμφανίζονται σε μονάδες PDF και χιλιοστά.",
      unsupported: "Το εργαλείο εκτελείται στο browser και δεν στέλνει τα δεδομένα σε διακομιστή.",
      success: "Ολοκληρώθηκε",
      failure: "Ελέγξτε τη μορφή εισόδου.",
      directionA: "Κωδικοποίηση",
      directionB: "Αποκωδικοποίηση",
    },
    expiry: { label: "Κατάσταση λήξης", absent: "Χωρίς πεδίο exp", active: "Δεν έχει λήξει", expired: "Έχει λήξει" },
  },
} satisfies Record<ExpandedLocale, TargetBrowserDeveloperCopy>;

export function getTargetBrowserDeveloperCopy(locale: PlannedLocale): TargetBrowserDeveloperCopy | undefined {
  return locale in copy ? copy[locale as ExpandedLocale] : undefined;
}
