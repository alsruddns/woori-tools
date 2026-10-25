import type { PlannedLocale } from "./routing";

export type TargetCoreMessageKey =
  | "language" | "tools" | "categories" | "privacy" | "terms" | "allTools"
  | "search" | "searchPlaceholder" | "howTo" | "introduction" | "faq" | "relatedTools"
  | "result" | "download" | "process" | "run" | "processing" | "reset" | "copy" | "clear"
  | "chooseOrDrop" | "selectFile" | "filePrivacy" | "error" | "copySuccess" | "copyFailure" | "workspaceUnavailable";

export type TargetCoreMessages = Record<TargetCoreMessageKey, string>;

// This dictionary is deliberately separate from the active UI dictionaries.
// A locale becomes publishable only after its tool pages and SEO copy are complete.
export const targetCoreMessages = {
  ru: {
    language: "Язык", tools: "Инструменты", categories: "Категории", privacy: "Конфиденциальность", terms: "Условия использования", allTools: "Все инструменты",
    search: "Поиск инструментов", searchPlaceholder: "Какую задачу нужно решить?", howTo: "Как пользоваться", introduction: "Об этом инструменте", faq: "Частые вопросы", relatedTools: "Похожие инструменты",
    result: "Результат", download: "Скачать", process: "Обработать", run: "Запустить", processing: "Обработка…", reset: "Сбросить", copy: "Копировать", clear: "Очистить",
    chooseOrDrop: "Перетащите файлы сюда или выберите их", selectFile: "Выбрать файл", filePrivacy: "Файлы обрабатываются в браузере и не отправляются на сервер.", error: "Не удалось выполнить действие. Проверьте данные и попробуйте ещё раз.", copySuccess: "Скопировано.", copyFailure: "Не удалось скопировать.", workspaceUnavailable: "Перевод этой рабочей области ещё не завершён.",
  },
  tr: {
    language: "Dil", tools: "Araçlar", categories: "Kategoriler", privacy: "Gizlilik", terms: "Kullanım koşulları", allTools: "Tüm araçlar",
    search: "Araç ara", searchPlaceholder: "Hangi işi yapmak istiyorsunuz?", howTo: "Kullanım", introduction: "Bu araç hakkında", faq: "Sık sorulan sorular", relatedTools: "Benzer araçlar",
    result: "Sonuç", download: "İndir", process: "İşle", run: "Çalıştır", processing: "İşleniyor…", reset: "Sıfırla", copy: "Kopyala", clear: "Temizle",
    chooseOrDrop: "Dosyaları buraya bırakın veya seçin", selectFile: "Dosya seç", filePrivacy: "Dosyalar tarayıcınızda işlenir ve sunucuya yüklenmez.", error: "İşlem tamamlanamadı. Bilgileri kontrol edip yeniden deneyin.", copySuccess: "Kopyalandı.", copyFailure: "Kopyalanamadı.", workspaceUnavailable: "Bu çalışma alanının çevirisi henüz tamamlanmadı.",
  },
  pl: {
    language: "Język", tools: "Narzędzia", categories: "Kategorie", privacy: "Prywatność", terms: "Warunki korzystania", allTools: "Wszystkie narzędzia",
    search: "Szukaj narzędzi", searchPlaceholder: "Jakie zadanie chcesz wykonać?", howTo: "Jak używać", introduction: "O tym narzędziu", faq: "Częste pytania", relatedTools: "Podobne narzędzia",
    result: "Wynik", download: "Pobierz", process: "Przetwórz", run: "Uruchom", processing: "Przetwarzanie…", reset: "Resetuj", copy: "Kopiuj", clear: "Wyczyść",
    chooseOrDrop: "Upuść pliki tutaj lub wybierz je", selectFile: "Wybierz plik", filePrivacy: "Pliki są przetwarzane w przeglądarce i nie są wysyłane na serwer.", error: "Nie udało się wykonać operacji. Sprawdź dane i spróbuj ponownie.", copySuccess: "Skopiowano.", copyFailure: "Nie udało się skopiować.", workspaceUnavailable: "Tłumaczenie tego obszaru roboczego nie jest jeszcze kompletne.",
  },
  fil: {
    language: "Wika", tools: "Mga tool", categories: "Mga kategorya", privacy: "Pagkapribado", terms: "Mga tuntunin sa paggamit", allTools: "Lahat ng tool",
    search: "Maghanap ng mga tool", searchPlaceholder: "Anong gawain ang gusto mong gawin?", howTo: "Paano gamitin", introduction: "Tungkol sa tool na ito", faq: "Mga madalas itanong", relatedTools: "Mga kaugnay na tool",
    result: "Resulta", download: "I-download", process: "Iproseso", run: "Simulan", processing: "Pinoproseso…", reset: "I-reset", copy: "Kopyahin", clear: "I-clear",
    chooseOrDrop: "Ihulog dito ang mga file o piliin ang mga ito", selectFile: "Pumili ng file", filePrivacy: "Pagkapribado", error: "Hindi nakumpleto ang operasyon. Suriin ang inilagay at subukan muli.", copySuccess: "Nakopya.", copyFailure: "Hindi makopya.", workspaceUnavailable: "Hindi pa kumpleto ang salin ng workspace na ito.",
  },
  bn: {
    language: "ভাষা", tools: "টুল", categories: "বিভাগ", privacy: "গোপনীয়তা", terms: "ব্যবহারের শর্তাবলি", allTools: "সব টুল",
    search: "টুল খুঁজুন", searchPlaceholder: "আপনি কোন কাজটি করতে চান?", howTo: "ব্যবহারের নিয়ম", introduction: "এই টুল সম্পর্কে", faq: "সাধারণ প্রশ্ন", relatedTools: "সম্পর্কিত টুল",
    result: "ফলাফল", download: "ডাউনলোড", process: "প্রক্রিয়া করুন", run: "চালান", processing: "প্রক্রিয়াকরণ চলছে…", reset: "রিসেট", copy: "কপি করুন", clear: "মুছুন",
    chooseOrDrop: "ফাইল এখানে ছেড়ে দিন অথবা বেছে নিন", selectFile: "ফাইল বেছে নিন", filePrivacy: "গোপনীয়তা", error: "কাজটি সম্পন্ন করা যায়নি। তথ্য যাচাই করে আবার চেষ্টা করুন।", copySuccess: "কপি হয়েছে।", copyFailure: "কপি করা যায়নি।", workspaceUnavailable: "এই কাজের অংশটির অনুবাদ এখনও সম্পূর্ণ হয়নি।",
  },
  uk: {
    language: "Мова", tools: "Інструменти", categories: "Категорії", privacy: "Конфіденційність", terms: "Умови використання", allTools: "Усі інструменти",
    search: "Пошук інструментів", searchPlaceholder: "Яке завдання потрібно виконати?", howTo: "Як користуватися", introduction: "Про цей інструмент", faq: "Поширені запитання", relatedTools: "Схожі інструменти",
    result: "Результат", download: "Завантажити", process: "Обробити", run: "Запустити", processing: "Обробка…", reset: "Скинути", copy: "Копіювати", clear: "Очистити",
    chooseOrDrop: "Перетягніть файли сюди або виберіть їх", selectFile: "Вибрати файл", filePrivacy: "Конфіденційність", error: "Не вдалося виконати дію. Перевірте дані й спробуйте ще раз.", copySuccess: "Скопійовано.", copyFailure: "Не вдалося скопіювати.", workspaceUnavailable: "Переклад цієї робочої області ще не завершено.",
  },
  ms: {
    language: "Bahasa", tools: "Alat", categories: "Kategori", privacy: "Privasi", terms: "Syarat penggunaan", allTools: "Semua alat",
    search: "Cari alat", searchPlaceholder: "Apakah yang ingin anda lakukan?", howTo: "Cara penggunaan", introduction: "Tentang alat ini", faq: "Soalan lazim", relatedTools: "Alat berkaitan",
    result: "Hasil", download: "Muat turun", process: "Proses", run: "Jalankan", processing: "Sedang diproses…", reset: "Tetapkan semula", copy: "Salin", clear: "Kosongkan",
    chooseOrDrop: "Lepaskan fail di sini atau pilih fail", selectFile: "Pilih fail", filePrivacy: "Privasi", error: "Tindakan tidak berjaya. Semak maklumat dan cuba lagi.", copySuccess: "Disalin.", copyFailure: "Tidak dapat menyalin.", workspaceUnavailable: "Terjemahan ruang kerja ini belum selesai.",
  },
  sv: {
    language: "Språk", tools: "Verktyg", categories: "Kategorier", privacy: "Integritet", terms: "Användarvillkor", allTools: "Alla verktyg",
    search: "Sök verktyg", searchPlaceholder: "Vad vill du göra?", howTo: "Så här gör du", introduction: "Om verktyget", faq: "Vanliga frågor", relatedTools: "Liknande verktyg",
    result: "Resultat", download: "Ladda ned", process: "Bearbeta", run: "Kör", processing: "Bearbetar…", reset: "Återställ", copy: "Kopiera", clear: "Rensa",
    chooseOrDrop: "Släpp filer här eller välj dem", selectFile: "Välj fil", filePrivacy: "Integritet", error: "Det gick inte att slutföra åtgärden. Kontrollera uppgifterna och försök igen.", copySuccess: "Kopierat.", copyFailure: "Det gick inte att kopiera.", workspaceUnavailable: "Översättningen av den här arbetsytan är inte klar ännu.",
  },
  cs: {
    language: "Jazyk", tools: "Nástroje", categories: "Kategorie", privacy: "Soukromí", terms: "Podmínky použití", allTools: "Všechny nástroje",
    search: "Hledat nástroje", searchPlaceholder: "Co potřebujete udělat?", howTo: "Jak nástroj používat", introduction: "O tomto nástroji", faq: "Časté dotazy", relatedTools: "Podobné nástroje",
    result: "Výsledek", download: "Stáhnout", process: "Zpracovat", run: "Spustit", processing: "Zpracování…", reset: "Obnovit", copy: "Kopírovat", clear: "Vymazat",
    chooseOrDrop: "Přetáhněte sem soubory nebo je vyberte", selectFile: "Vybrat soubor", filePrivacy: "Soukromí", error: "Akci se nepodařilo dokončit. Zkontrolujte údaje a zkuste to znovu.", copySuccess: "Zkopírováno.", copyFailure: "Kopírování se nezdařilo.", workspaceUnavailable: "Překlad tohoto pracovního prostoru ještě není dokončen.",
  },
  ro: {
    language: "Limbă", tools: "Instrumente", categories: "Categorii", privacy: "Confidențialitate", terms: "Condiții de utilizare", allTools: "Toate instrumentele",
    search: "Caută instrumente", searchPlaceholder: "Ce dorești să faci?", howTo: "Cum se folosește", introduction: "Despre acest instrument", faq: "Întrebări frecvente", relatedTools: "Instrumente similare",
    result: "Rezultat", download: "Descarcă", process: "Procesează", run: "Rulează", processing: "Se procesează…", reset: "Resetează", copy: "Copiază", clear: "Șterge",
    chooseOrDrop: "Trage fișierele aici sau selectează-le", selectFile: "Selectează un fișier", filePrivacy: "Confidențialitate", error: "Acțiunea nu a putut fi finalizată. Verifică datele și încearcă din nou.", copySuccess: "Copiat.", copyFailure: "Copierea nu a reușit.", workspaceUnavailable: "Traducerea acestui spațiu de lucru nu este încă finalizată.",
  },
  el: {
    language: "Γλώσσα", tools: "Εργαλεία", categories: "Κατηγορίες", privacy: "Απόρρητο", terms: "Όροι χρήσης", allTools: "Όλα τα εργαλεία",
    search: "Αναζήτηση εργαλείων", searchPlaceholder: "Τι θέλετε να κάνετε;", howTo: "Τρόπος χρήσης", introduction: "Σχετικά με το εργαλείο", faq: "Συχνές ερωτήσεις", relatedTools: "Σχετικά εργαλεία",
    result: "Αποτέλεσμα", download: "Λήψη", process: "Επεξεργασία", run: "Εκτέλεση", processing: "Γίνεται επεξεργασία…", reset: "Επαναφορά", copy: "Αντιγραφή", clear: "Εκκαθάριση",
    chooseOrDrop: "Αφήστε εδώ τα αρχεία ή επιλέξτε τα", selectFile: "Επιλογή αρχείου", filePrivacy: "Απόρρητο", error: "Δεν ήταν δυνατή η ολοκλήρωση. Ελέγξτε τα στοιχεία και δοκιμάστε ξανά.", copySuccess: "Αντιγράφηκε.", copyFailure: "Δεν ήταν δυνατή η αντιγραφή.", workspaceUnavailable: "Η μετάφραση αυτού του χώρου εργασίας δεν έχει ολοκληρωθεί ακόμη.",
  },
} satisfies Record<PlannedLocale, TargetCoreMessages>;
