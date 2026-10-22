import type { PlannedLocale } from "@/i18n/routing";

const lotteryTools = {
  "lotto-number-generator": { count: 6, range: "1–45", kind: "local" },
  "powerball-number-generator": { count: 5, range: "1–69", kind: "powerball" },
  "mega-millions-number-generator": { count: 5, range: "1–70", kind: "mega" },
  "japan-loto6-number-generator": { count: 6, range: "1–43", kind: "japan6" },
  "japan-loto7-number-generator": { count: 7, range: "1–37", kind: "japan7" },
} as const;

type LotterySlug = keyof typeof lotteryTools;
type LotteryCopy = {
  titles: Record<LotterySlug, string>;
  standardDescription: (title: string, count: number, range: string) => string;
  powerballDescription: string;
  megaDescription: string;
  japanDescription: (title: string, count: number, range: string) => string;
  steps: readonly [string, string, string];
  example: (count: number, range: string) => string;
  options: string;
  caution: string;
  faqExample: (title: string) => string;
  faqCaution: (title: string) => string;
  keywords: readonly string[];
};

const copy = {
  ru: {
    titles: { "lotto-number-generator": "Генератор чисел лотереи", "powerball-number-generator": "Генератор чисел Powerball", "mega-millions-number-generator": "Генератор чисел Mega Millions", "japan-loto6-number-generator": "Генератор чисел японской LOTO 6", "japan-loto7-number-generator": "Генератор чисел японской LOTO 7" },
    standardDescription: (title, count, range) => `${title}: случайно выберите ${count} неповторяющихся чисел от ${range}. Можно настроить включённые и исключённые числа, соотношение чётных и нечётных чисел и создать один или пять наборов.`,
    powerballDescription: "Случайно выберите пять белых шаров от 1 до 69 и один красный Powerball от 1 до 26. Настройте включённые и исключённые числа, баланс чётных и нечётных чисел и создайте один или пять наборов.",
    megaDescription: "Случайно выберите пять основных чисел от 1 до 70 и один Mega Ball от 1 до 24. Настройте включённые и исключённые числа, баланс чётных и нечётных чисел и создайте один или пять наборов.",
    japanDescription: (title, count, range) => `${title}: случайно выберите ${count} разных чисел от ${range} по правилам японской лотереи. Настройте числа, которые нужно включить или исключить, и создайте один или пять наборов.`,
    steps: ["Выберите один или пять наборов и при необходимости задайте числа для включения или исключения.", "Настройте соотношение чётных и нечётных чисел, если такая опция доступна.", "Создайте наборы, скопируйте нужный результат или сгенерируйте новые числа."],
    example: (count, range) => `Каждый набор содержит ${count} разных основных чисел из диапазона ${range}; дополнительные шары, если они есть, показаны отдельно.`,
    options: "Числа выбираются случайно в браузере. Сортировка меняет только порядок отображения, а не набор чисел.",
    caution: "Случайные числа не повышают вероятность выигрыша и не предсказывают результат розыгрыша. Играйте ответственно и в пределах своих возможностей.",
    faqExample: (title) => `Какой результат можно получить в инструменте «${title}»?`, faqCaution: (title) => `Может ли результат «${title}» предсказать выигрыш?`, keywords: ["лотерея", "случайные числа", "генератор чисел"],
  },
  tr: {
    titles: { "lotto-number-generator": "Loto Numarası Oluşturucu", "powerball-number-generator": "Powerball Numarası Oluşturucu", "mega-millions-number-generator": "Mega Millions Numarası Oluşturucu", "japan-loto6-number-generator": "Japonya LOTO 6 Numarası Oluşturucu", "japan-loto7-number-generator": "Japonya LOTO 7 Numarası Oluşturucu" },
    standardDescription: (title, count, range) => `${title}: ${range} aralığından birbirinden farklı ${count} sayı seçin. Dahil edilecek veya hariç tutulacak sayıları ve tek/çift dengesini belirleyip bir ya da beş kolon oluşturun.`,
    powerballDescription: "1–69 arasından beş farklı beyaz top ve 1–26 arasından bir kırmızı Powerball seçin. Dahil edilecek veya hariç tutulacak sayıları ve tek/çift dengesini belirleyip bir ya da beş kolon oluşturun.",
    megaDescription: "1–70 arasından beş farklı ana sayı ve 1–24 arasından bir Mega Ball seçin. Dahil edilecek veya hariç tutulacak sayıları ve tek/çift dengesini belirleyip bir ya da beş kolon oluşturun.",
    japanDescription: (title, count, range) => `${title}: Japonya LOTO kurallarına göre ${range} aralığından birbirinden farklı ${count} sayı seçin. İstediğiniz sayıları dahil edip hariç tutabilir, bir ya da beş kolon oluşturabilirsiniz.`,
    steps: ["Bir ya da beş kolon seçin; isterseniz dahil edilecek ve hariç tutulacak sayıları belirleyin.", "Bu seçenek varsa tek ve çift sayı oranını ayarlayın.", "Kolonları oluşturun, istediğiniz sonucu kopyalayın veya yeni sayılar üretin."],
    example: (count, range) => `Her kolonda ${range} aralığından ${count} farklı ana sayı bulunur. Ek toplar varsa ayrı gösterilir.`,
    options: "Sayılar tarayıcınızda rastgele oluşturulur. Sıralama yalnızca görüntüleme sırasını değiştirir.",
    caution: "Rastgele sayılar kazanma ihtimalini artırmaz ve çekiliş sonucunu tahmin edemez. Sorumlu davranın ve kendi sınırlarınız içinde oynayın.",
    faqExample: (title) => `${title} nasıl bir sonuç oluşturur?`, faqCaution: (title) => `${title} kazanacak sayıları tahmin edebilir mi?`, keywords: ["piyango", "rastgele sayılar", "sayı oluşturucu"],
  },
  pl: {
    titles: { "lotto-number-generator": "Generator liczb lotto", "powerball-number-generator": "Generator liczb Powerball", "mega-millions-number-generator": "Generator liczb Mega Millions", "japan-loto6-number-generator": "Generator liczb japońskiej LOTO 6", "japan-loto7-number-generator": "Generator liczb japońskiej LOTO 7" },
    standardDescription: (title, count, range) => `${title}: wylosuj ${count} różnych liczb z zakresu ${range}. Ustaw liczby uwzględniane i wykluczane oraz proporcję liczb parzystych do nieparzystych. Wygeneruj jeden lub pięć zestawów.`,
    powerballDescription: "Wylosuj pięć różnych białych kul od 1 do 69 oraz jedną czerwoną kulę Powerball od 1 do 26. Ustaw liczby uwzględniane i wykluczane, proporcję parzystych do nieparzystych i wygeneruj jeden lub pięć zestawów.",
    megaDescription: "Wylosuj pięć różnych liczb głównych od 1 do 70 oraz jedną Mega Ball od 1 do 24. Ustaw liczby uwzględniane i wykluczane, proporcję parzystych do nieparzystych i wygeneruj jeden lub pięć zestawów.",
    japanDescription: (title, count, range) => `${title}: wylosuj ${count} różnych liczb z zakresu ${range} zgodnie z zasadami japońskiej loterii. Wybierz liczby uwzględniane lub wykluczane i wygeneruj jeden lub pięć zestawów.`,
    steps: ["Wybierz jeden lub pięć zestawów oraz, jeśli chcesz, liczby do uwzględnienia lub wykluczenia.", "Ustaw proporcję liczb parzystych i nieparzystych, jeśli ta opcja jest dostępna.", "Wygeneruj zestawy, skopiuj wybrany wynik albo losuj ponownie."],
    example: (count, range) => `Każdy zestaw zawiera ${count} różnych liczb głównych z zakresu ${range}; dodatkowe kule, jeśli występują, są pokazane osobno.`,
    options: "Liczby są losowane w przeglądarce. Sortowanie zmienia tylko kolejność wyświetlania.",
    caution: "Losowe liczby nie zwiększają szans na wygraną ani nie przewidują wyników losowania. Graj odpowiedzialnie i w granicach swoich możliwości.",
    faqExample: (title) => `Jakie wyniki tworzy narzędzie „${title}”?`, faqCaution: (title) => `Czy „${title}” przewiduje zwycięskie liczby?`, keywords: ["lotto", "losowe liczby", "generator liczb"],
  },
  fil: {
    titles: { "lotto-number-generator": "Tagabuo ng Numero sa Lotto", "powerball-number-generator": "Tagabuo ng Numero sa Powerball", "mega-millions-number-generator": "Tagabuo ng Numero sa Mega Millions", "japan-loto6-number-generator": "Tagabuo ng Numero sa Japan LOTO 6", "japan-loto7-number-generator": "Tagabuo ng Numero sa Japan LOTO 7" },
    standardDescription: (title, count, range) => `${title}: pumili nang random ng ${count} magkakaibang numero mula ${range}. Itakda ang mga numerong isasama o ibubukod at ang balanse ng odd at even, pagkatapos gumawa ng isa o limang laro.`,
    powerballDescription: "Pumili nang random ng limang magkakaibang puting bola mula 1 hanggang 69 at isang pulang Powerball mula 1 hanggang 26. Itakda ang mga numerong isasama o ibubukod, ang balanse ng odd at even, at gumawa ng isa o limang laro.",
    megaDescription: "Pumili nang random ng limang magkakaibang pangunahing numero mula 1 hanggang 70 at isang Mega Ball mula 1 hanggang 24. Itakda ang mga numerong isasama o ibubukod, ang balanse ng odd at even, at gumawa ng isa o limang laro.",
    japanDescription: (title, count, range) => `${title}: pumili nang random ng ${count} magkakaibang numero mula ${range} ayon sa mga tuntunin ng Japan lottery. Itakda ang mga numerong isasama o ibubukod at gumawa ng isa o limang laro.`,
    steps: ["Pumili ng isa o limang laro. Maaari ka ring magtakda ng mga numerong isasama o ibubukod.", "Ayusin ang balanse ng odd at even kung available ang opsyong ito.", "Bumuo ng mga numero, kopyahin ang napiling resulta, o bumuo ulit."],
    example: (count, range) => `May ${count} magkakaibang pangunahing numero mula ${range} sa bawat laro. Hiwalay na ipinapakita ang dagdag na bola kung mayroon.`,
    options: "Sa browser ginagawa ang random na pagpili. Ayos ng pagpapakita lang ang binabago ng pag-uuri.",
    caution: "Hindi pinapataas ng random na mga numero ang tsansang manalo at hindi nito nahuhulaan ang draw. Maglaro nang responsable at ayon sa kaya mo.",
    faqExample: (title) => `Anong resulta ang ginagawa ng ${title}?`, faqCaution: (title) => `Nahuhulaan ba ng ${title} ang mga numerong mananalo?`, keywords: ["lotto", "random na numero", "tagabuo ng numero"],
  },
  bn: {
    titles: { "lotto-number-generator": "লটারি নম্বর জেনারেটর", "powerball-number-generator": "পাওয়ারবল নম্বর জেনারেটর", "mega-millions-number-generator": "মেগা মিলিয়নস নম্বর জেনারেটর", "japan-loto6-number-generator": "জাপান LOTO 6 নম্বর জেনারেটর", "japan-loto7-number-generator": "জাপান LOTO 7 নম্বর জেনারেটর" },
    standardDescription: (title, count, range) => `${title}: ${range} সীমার মধ্যে থেকে এলোমেলোভাবে ${count}টি আলাদা সংখ্যা বেছে নিন। অন্তর্ভুক্ত বা বাদ দেওয়ার সংখ্যা এবং জোড়-বিজোড়ের অনুপাত ঠিক করে এক বা পাঁচটি সেট তৈরি করুন।`,
    powerballDescription: "১–৬৯ থেকে পাঁচটি আলাদা সাদা বল এবং ১–২৬ থেকে একটি লাল Powerball বেছে নিন। অন্তর্ভুক্ত বা বাদ দেওয়ার সংখ্যা ও জোড়-বিজোড়ের অনুপাত ঠিক করে এক বা পাঁচটি সেট তৈরি করুন।",
    megaDescription: "১–৭০ থেকে পাঁচটি আলাদা মূল সংখ্যা এবং ১–২৪ থেকে একটি Mega Ball বেছে নিন। অন্তর্ভুক্ত বা বাদ দেওয়ার সংখ্যা ও জোড়-বিজোড়ের অনুপাত ঠিক করে এক বা পাঁচটি সেট তৈরি করুন।",
    japanDescription: (title, count, range) => `${title}: জাপানের লটারি নিয়ম মেনে ${range} সীমা থেকে এলোমেলোভাবে ${count}টি আলাদা সংখ্যা বেছে নিন। অন্তর্ভুক্ত বা বাদ দেওয়ার সংখ্যা ঠিক করে এক বা পাঁচটি সেট তৈরি করুন।`,
    steps: ["এক বা পাঁচটি সেট বেছে নিন। চাইলে অন্তর্ভুক্ত বা বাদ দেওয়ার সংখ্যা নির্ধারণ করুন।", "বিকল্পটি থাকলে জোড় ও বিজোড় সংখ্যার অনুপাত ঠিক করুন।", "সংখ্যা তৈরি করুন, পছন্দের ফল কপি করুন অথবা আবার তৈরি করুন।"],
    example: (count, range) => `প্রতিটি সেটে ${range} সীমার মধ্যে ${count}টি আলাদা মূল সংখ্যা থাকে। অতিরিক্ত বল থাকলে সেটি আলাদাভাবে দেখানো হয়।`,
    options: "ব্রাউজারেই এলোমেলোভাবে সংখ্যা তৈরি হয়। সাজানোর বিকল্পটি শুধু প্রদর্শনের ক্রম বদলায়।",
    caution: "এলোমেলো সংখ্যা জেতার সম্ভাবনা বাড়ায় না বা ড্রয়ের ফল অনুমান করে না। দায়িত্বশীলভাবে এবং সামর্থ্যের মধ্যে অংশ নিন।",
    faqExample: (title) => `${title} কী ধরনের ফল তৈরি করে?`, faqCaution: (title) => `${title} কি বিজয়ী সংখ্যা অনুমান করতে পারে?`, keywords: ["লটারি", "এলোমেলো সংখ্যা", "নম্বর জেনারেটর"],
  },
  uk: {
    titles: { "lotto-number-generator": "Генератор чисел лотереї", "powerball-number-generator": "Генератор чисел Powerball", "mega-millions-number-generator": "Генератор чисел Mega Millions", "japan-loto6-number-generator": "Генератор чисел японської LOTO 6", "japan-loto7-number-generator": "Генератор чисел японської LOTO 7" },
    standardDescription: (title, count, range) => `${title}: випадково виберіть ${count} різних чисел у діапазоні ${range}. Задайте числа для включення чи виключення та співвідношення парних і непарних чисел, а потім створіть один або п’ять наборів.`,
    powerballDescription: "Випадково виберіть п’ять різних білих куль від 1 до 69 і одну червону кулю Powerball від 1 до 26. Налаштуйте числа для включення чи виключення, баланс парних і непарних чисел і створіть один або п’ять наборів.",
    megaDescription: "Випадково виберіть п’ять різних основних чисел від 1 до 70 і одну Mega Ball від 1 до 24. Налаштуйте числа для включення чи виключення, баланс парних і непарних чисел і створіть один або п’ять наборів.",
    japanDescription: (title, count, range) => `${title}: за правилами японської лотереї випадково виберіть ${count} різних чисел у діапазоні ${range}. Задайте числа для включення чи виключення та створіть один або п’ять наборів.`,
    steps: ["Виберіть один або п’ять наборів і за потреби вкажіть числа для включення чи виключення.", "За наявності опції налаштуйте співвідношення парних і непарних чисел.", "Створіть набори, скопіюйте потрібний результат або згенеруйте нові числа."],
    example: (count, range) => `Кожен набір містить ${count} різних основних чисел із діапазону ${range}; додаткові кулі, якщо вони є, показані окремо.`,
    options: "Числа випадково генеруються у браузері. Сортування змінює лише порядок відображення.",
    caution: "Випадкові числа не підвищують шанси на виграш і не передбачають результат розіграшу. Грайте відповідально та в межах своїх можливостей.",
    faqExample: (title) => `Який результат створює інструмент «${title}»?`, faqCaution: (title) => `Чи може «${title}» передбачити виграшні числа?`, keywords: ["лотерея", "випадкові числа", "генератор чисел"],
  },
  ms: {
    titles: { "lotto-number-generator": "Penjana Nombor Loteri", "powerball-number-generator": "Penjana Nombor Powerball", "mega-millions-number-generator": "Penjana Nombor Mega Millions", "japan-loto6-number-generator": "Penjana Nombor Jepun LOTO 6", "japan-loto7-number-generator": "Penjana Nombor Jepun LOTO 7" },
    standardDescription: (title, count, range) => `${title}: pilih ${count} nombor berlainan secara rawak daripada julat ${range}. Tetapkan nombor yang disertakan atau dikecualikan serta imbangan genap/ganjil, kemudian jana satu atau lima set.`,
    powerballDescription: "Pilih lima bola putih berlainan daripada 1 hingga 69 dan satu Powerball merah daripada 1 hingga 26 secara rawak. Tetapkan nombor yang disertakan atau dikecualikan, imbangan genap/ganjil, dan jana satu atau lima set.",
    megaDescription: "Pilih lima nombor utama berlainan daripada 1 hingga 70 dan satu Mega Ball daripada 1 hingga 24 secara rawak. Tetapkan nombor yang disertakan atau dikecualikan, imbangan genap/ganjil, dan jana satu atau lima set.",
    japanDescription: (title, count, range) => `${title}: pilih ${count} nombor berlainan secara rawak daripada julat ${range} mengikut peraturan loteri Jepun. Tetapkan nombor untuk disertakan atau dikecualikan, kemudian jana satu atau lima set.`,
    steps: ["Pilih satu atau lima set. Anda juga boleh menetapkan nombor untuk disertakan atau dikecualikan.", "Laraskan imbangan nombor genap dan ganjil jika pilihan ini tersedia.", "Jana set, salin hasil yang dikehendaki atau jana nombor baharu."],
    example: (count, range) => `Setiap set mengandungi ${count} nombor utama berlainan daripada julat ${range}; bola tambahan, jika ada, dipaparkan berasingan.`,
    options: "Nombor dijana secara rawak dalam pelayar anda. Pengisihan hanya mengubah susunan paparan.",
    caution: "Nombor rawak tidak meningkatkan peluang menang dan tidak meramalkan keputusan cabutan. Bermainlah dengan bertanggungjawab mengikut kemampuan anda.",
    faqExample: (title) => `Apakah hasil yang dijana oleh ${title}?`, faqCaution: (title) => `Bolehkah ${title} meramalkan nombor yang menang?`, keywords: ["loteri", "nombor rawak", "penjana nombor"],
  },
  sv: {
    titles: { "lotto-number-generator": "Slumptalsgenerator för lotto", "powerball-number-generator": "Slumptalsgenerator för Powerball", "mega-millions-number-generator": "Slumptalsgenerator för Mega Millions", "japan-loto6-number-generator": "Slumptalsgenerator för japanska LOTO 6", "japan-loto7-number-generator": "Slumptalsgenerator för japanska LOTO 7" },
    standardDescription: (title, count, range) => `${title}: dra ${count} unika tal slumpmässigt från intervallet ${range}. Välj tal som ska ingå eller uteslutas och ange fördelningen mellan jämna och udda tal. Skapa en eller fem rader.`,
    powerballDescription: "Dra fem unika vita bollar mellan 1 och 69 och en röd Powerball mellan 1 och 26. Välj tal som ska ingå eller uteslutas, ställ in jämn/udda-fördelningen och skapa en eller fem rader.",
    megaDescription: "Dra fem unika huvudtal mellan 1 och 70 och en Mega Ball mellan 1 och 24. Välj tal som ska ingå eller uteslutas, ställ in jämn/udda-fördelningen och skapa en eller fem rader.",
    japanDescription: (title, count, range) => `${title}: dra ${count} unika tal från intervallet ${range} enligt reglerna för det japanska lotteriet. Välj tal som ska ingå eller uteslutas och skapa en eller fem rader.`,
    steps: ["Välj en eller fem rader och ange eventuellt tal som ska tas med eller uteslutas.", "Ställ in fördelningen mellan jämna och udda tal om alternativet finns.", "Skapa rader, kopiera resultatet eller slumpa fram nya tal."],
    example: (count, range) => `Varje rad innehåller ${count} unika huvudtal från intervallet ${range}. Eventuella extrabollar visas separat.`,
    options: "Talen slumpas fram i webbläsaren. Sortering ändrar bara visningsordningen.",
    caution: "Slumptal ökar inte vinstchansen och kan inte förutsäga dragningen. Spela ansvarsfullt och inom dina egna gränser.",
    faqExample: (title) => `Vilket resultat skapar ${title}?`, faqCaution: (title) => `Kan ${title} förutsäga vinnande tal?`, keywords: ["lotteri", "slumptal", "slumptalsgenerator"],
  },
  cs: {
    titles: { "lotto-number-generator": "Generátor čísel loterie", "powerball-number-generator": "Generátor čísel Powerball", "mega-millions-number-generator": "Generátor čísel Mega Millions", "japan-loto6-number-generator": "Generátor čísel japonské LOTO 6", "japan-loto7-number-generator": "Generátor čísel japonské LOTO 7" },
    standardDescription: (title, count, range) => `${title}: náhodně vyberte ${count} různých čísel z rozsahu ${range}. Zvolte zahrnutá či vyloučená čísla a poměr sudých a lichých čísel a vytvořte jeden nebo pět sloupců.`,
    powerballDescription: "Náhodně vyberte pět různých bílých koulí od 1 do 69 a jednu červenou Powerball od 1 do 26. Zvolte zahrnutá či vyloučená čísla, poměr sudých a lichých čísel a vytvořte jeden nebo pět sloupců.",
    megaDescription: "Náhodně vyberte pět různých hlavních čísel od 1 do 70 a jednu Mega Ball od 1 do 24. Zvolte zahrnutá či vyloučená čísla, poměr sudých a lichých čísel a vytvořte jeden nebo pět sloupců.",
    japanDescription: (title, count, range) => `${title}: podle pravidel japonské loterie náhodně vyberte ${count} různých čísel z rozsahu ${range}. Zvolte zahrnutá či vyloučená čísla a vytvořte jeden nebo pět sloupců.`,
    steps: ["Zvolte jeden nebo pět sloupců a případně čísla, která chcete zahrnout či vyloučit.", "Pokud je tato možnost dostupná, upravte poměr sudých a lichých čísel.", "Vygenerujte sloupce, zkopírujte výsledek nebo si nechte vylosovat nová čísla."],
    example: (count, range) => `Každý sloupec obsahuje ${count} různých hlavních čísel z rozsahu ${range}; případné další koule se zobrazí zvlášť.`,
    options: "Čísla se náhodně generují v prohlížeči. Řazení mění pouze pořadí zobrazení.",
    caution: "Náhodná čísla nezvyšují šanci na výhru ani nepředpovídají losování. Hrajte zodpovědně a v rámci svých možností.",
    faqExample: (title) => `Jaký výsledek nástroj ${title} vytvoří?`, faqCaution: (title) => `Dokáže ${title} předpovědět výherní čísla?`, keywords: ["loterie", "náhodná čísla", "generátor čísel"],
  },
  ro: {
    titles: { "lotto-number-generator": "Generator de numere loto", "powerball-number-generator": "Generator de numere Powerball", "mega-millions-number-generator": "Generator de numere Mega Millions", "japan-loto6-number-generator": "Generator de numere Japonia LOTO 6", "japan-loto7-number-generator": "Generator de numere Japonia LOTO 7" },
    standardDescription: (title, count, range) => `${title}: alege aleatoriu ${count} numere diferite din intervalul ${range}. Setează numerele incluse sau excluse și raportul par/impar, apoi generează una sau cinci variante.`,
    powerballDescription: "Alege aleatoriu cinci bile albe diferite între 1 și 69 și o bilă roșie Powerball între 1 și 26. Setează numerele incluse sau excluse, raportul par/impar și generează una sau cinci variante.",
    megaDescription: "Alege aleatoriu cinci numere principale diferite între 1 și 70 și o bilă Mega Ball între 1 și 24. Setează numerele incluse sau excluse, raportul par/impar și generează una sau cinci variante.",
    japanDescription: (title, count, range) => `${title}: alege aleatoriu ${count} numere diferite din intervalul ${range}, conform regulilor loteriei japoneze. Setează numerele incluse sau excluse și generează una sau cinci variante.`,
    steps: ["Alege una sau cinci variante și, dacă dorești, numerele de inclus sau exclus.", "Reglează raportul dintre numerele pare și impare dacă opțiunea este disponibilă.", "Generează variantele, copiază rezultatul dorit sau extrage alte numere."],
    example: (count, range) => `Fiecare variantă conține ${count} numere principale diferite din intervalul ${range}; bilele suplimentare, dacă există, sunt afișate separat.`,
    options: "Numerele sunt generate aleatoriu în browser. Sortarea schimbă doar ordinea de afișare.",
    caution: "Numerele aleatorii nu cresc șansele de câștig și nu pot anticipa extragerea. Joacă responsabil și în limitele tale.",
    faqExample: (title) => `Ce rezultat generează ${title}?`, faqCaution: (title) => `Poate ${title} să prevadă numerele câștigătoare?`, keywords: ["loterie", "numere aleatorii", "generator de numere"],
  },
  el: {
    titles: { "lotto-number-generator": "Γεννήτρια αριθμών ΛΟΤΤΟ", "powerball-number-generator": "Γεννήτρια αριθμών Powerball", "mega-millions-number-generator": "Γεννήτρια αριθμών Mega Millions", "japan-loto6-number-generator": "Γεννήτρια αριθμών Japan LOTO 6", "japan-loto7-number-generator": "Γεννήτρια αριθμών Japan LOTO 7" },
    standardDescription: (title, count, range) => `${title}: επιλέξτε τυχαία ${count} διαφορετικούς αριθμούς από το εύρος ${range}. Ορίστε αριθμούς προς συμπερίληψη ή εξαίρεση και την αναλογία ζυγών/μονών και δημιουργήστε μία ή πέντε σειρές.`,
    powerballDescription: "Επιλέξτε τυχαία πέντε διαφορετικές λευκές μπάλες από το 1 έως το 69 και μία κόκκινη Powerball από το 1 έως το 26. Ορίστε αριθμούς προς συμπερίληψη ή εξαίρεση, την αναλογία ζυγών/μονών και δημιουργήστε μία ή πέντε σειρές.",
    megaDescription: "Επιλέξτε τυχαία πέντε διαφορετικούς βασικούς αριθμούς από το 1 έως το 70 και μία Mega Ball από το 1 έως το 24. Ορίστε αριθμούς προς συμπερίληψη ή εξαίρεση, την αναλογία ζυγών/μονών και δημιουργήστε μία ή πέντε σειρές.",
    japanDescription: (title, count, range) => `${title}: επιλέξτε τυχαία ${count} διαφορετικούς αριθμούς από το εύρος ${range}, σύμφωνα με τους κανόνες του ιαπωνικού λαχείου. Ορίστε αριθμούς προς συμπερίληψη ή εξαίρεση και δημιουργήστε μία ή πέντε σειρές.`,
    steps: ["Επιλέξτε μία ή πέντε σειρές και, αν θέλετε, ορίστε αριθμούς προς συμπερίληψη ή εξαίρεση.", "Ρυθμίστε την αναλογία ζυγών και μονών αριθμών, αν υπάρχει αυτή η επιλογή.", "Δημιουργήστε σειρές, αντιγράψτε το αποτέλεσμα που θέλετε ή επιλέξτε νέους αριθμούς."],
    example: (count, range) => `Κάθε σειρά περιέχει ${count} διαφορετικούς βασικούς αριθμούς από το εύρος ${range}. Τυχόν πρόσθετες μπάλες εμφανίζονται ξεχωριστά.`,
    options: "Οι αριθμοί δημιουργούνται τυχαία στο πρόγραμμα περιήγησης. Η ταξινόμηση αλλάζει μόνο τη σειρά εμφάνισης.",
    caution: "Οι τυχαίοι αριθμοί δεν αυξάνουν τις πιθανότητες νίκης και δεν προβλέπουν την κλήρωση. Παίξτε υπεύθυνα και μέσα στα όριά σας.",
    faqExample: (title) => `Τι αποτέλεσμα δημιουργεί το εργαλείο ${title};`, faqCaution: (title) => `Μπορεί το ${title} να προβλέψει τους αριθμούς που κερδίζουν;`, keywords: ["λαχείο", "τυχαίοι αριθμοί", "γεννήτρια αριθμών"],
  },
} satisfies Record<PlannedLocale, LotteryCopy>;

export type TargetLotteryTranslation = {
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  steps: readonly [string, string, string];
  example: string;
  options: string;
  caution: string;
  faq: { example: string; caution: string };
};

export function getTargetLotteryTranslation(locale: PlannedLocale, slug: string): TargetLotteryTranslation | undefined {
  if (!(slug in lotteryTools)) return undefined;
  const key = slug as LotterySlug;
  const tool = lotteryTools[key];
  const language = copy[locale];
  const title = language.titles[key];
  const description = tool.kind === "powerball"
    ? language.powerballDescription
    : tool.kind === "mega"
      ? language.megaDescription
      : tool.kind === "local"
        ? language.standardDescription(title, tool.count, tool.range)
        : language.japanDescription(title, tool.count, tool.range);
  return {
    title,
    description,
    seoTitle: title,
    seoDescription: description,
    keywords: [title, ...language.keywords],
    steps: language.steps,
    example: language.example(tool.count, tool.range),
    options: language.options,
    caution: language.caution,
    faq: { example: language.faqExample(title), caution: language.faqCaution(title) },
  };
}

export const targetLotterySlugs = Object.keys(lotteryTools) as LotterySlug[];
