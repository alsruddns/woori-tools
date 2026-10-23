export type TargetPolishToolTranslation = {
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  category: string;
  keywords: string[];
  steps: readonly [string, string, string];
  example: string;
  options: string;
  caution: string;
  faq: { example: string; caution: string };
};

const translations = {
  "tarot-card": {
    title: "Darmowy rozkład kart tarota",
    description: "Wylosuj kartę dnia albo wykonaj rozkład trzech kart dotyczący przeszłości, teraźniejszości i przyszłości.",
    seoTitle: "Darmowy tarot online | Karta dnia i rozkład trzech kart",
    seoDescription: "Wylosuj kartę tarota w przeglądarce i poznaj jej znaczenie w pozycji prostej lub odwróconej. Pytania i wyniki pozostają na Twoim urządzeniu.",
    category: "Wróżby i rozrywka",
    keywords: ["darmowy tarot", "karta tarota dnia", "rozkład tarota", "trzy karty tarota"],
    steps: ["Wpisz pytanie lub wybierz temat rozkładu.", "Wylosuj jedną kartę dnia albo rozkład trzech kart.", "Przeczytaj znaczenie kart wylosowanych w pozycji prostej lub odwróconej."],
    example: "Pytanie o relacje, finanse lub pracę może pomóc uporządkować własne przemyślenia; rozkład nie przewiduje przyszłości.",
    options: "W jednym rozkładzie karty się nie powtarzają. Pozycja prosta lub odwrócona jest losowa.",
    caution: "Pytania i karty nie są wysyłane na serwer. Tarot służy rozrywce i osobistej refleksji, a nie pewnym przepowiedniom.",
    faq: { example: "Jakie rozkłady kart mogę wykonać?", caution: "Czy tarot dokładnie przepowiada przyszłość?" },
  },
  "daily-fortune": {
    title: "Codzienna wróżba na podstawie daty urodzenia",
    description: "Sprawdź codzienną wróżbę dotyczącą relacji, pracy i finansów. Wynik jest tworzony lokalnie na podstawie daty urodzenia.",
    seoTitle: "Codzienna wróżba | Prognoza na podstawie daty urodzenia",
    seoDescription: "Podaj datę urodzenia, aby zobaczyć dzisiejszą wróżbę, szczęśliwą liczbę i kolor. Dane są przetwarzane w przeglądarce.",
    category: "Wróżby i rozrywka",
    keywords: ["codzienna wróżba", "wróżba z daty urodzenia", "szczęśliwa liczba", "horoskop dzienny"],
    steps: ["Wybierz datę urodzenia.", "Uruchom obliczanie dzisiejszej wróżby.", "Przeczytaj wyniki dla relacji, pracy i finansów."],
    example: "Wróć do narzędzia innego dnia, aby zobaczyć wynik obliczony dla nowej daty.",
    options: "Wynik jest powtarzalny dla tej samej daty urodzenia i dnia kalendarzowego.",
    caution: "Wróżba ma charakter rozrywkowy i nie zastępuje profesjonalnej porady ani ważnych decyzji.",
    faq: { example: "Czy wynik zmienia się każdego dnia?", caution: "Czy moja data urodzenia jest wysyłana na serwer?" },
  },
  saju: {
    title: "Kalkulator saju",
    description: "Sprawdź cztery filary saju na podstawie daty, godziny i kalendarza urodzenia. Obliczenia odbywają się w przeglądarce.",
    seoTitle: "Kalkulator saju | Cztery filary i pięć żywiołów",
    seoDescription: "Wprowadź dane urodzenia i zobacz filary roku, miesiąca, dnia i godziny wraz z tradycyjną interpretacją pięciu żywiołów.",
    category: "Wróżby i rozrywka",
    keywords: ["kalkulator saju", "cztery filary", "saju z daty urodzenia", "pięć żywiołów"],
    steps: ["Wpisz datę i, jeśli ją znasz, godzinę urodzenia.", "Wybierz kalendarz użyty przy zapisie daty.", "Sprawdź wyliczone filary i ich tradycyjne oznaczenia."],
    example: "Porównaj filary dla przykładowej daty, aby zobaczyć układ znaków i żywiołów.",
    options: "Wynik zależy od wybranej konwencji kalendarza i dokładności godziny urodzenia.",
    caution: "Interpretacja ma charakter kulturowy i rozrywkowy. Nie jest diagnozą ani naukową prognozą.",
    faq: { example: "Czy muszę znać godzinę urodzenia?", caution: "Czy obliczenia są wykonywane na serwerze?" },
  },
  "random-number": {
    title: "Generator liczb losowych",
    description: "Losuj liczby z wybranego zakresu. Ustaw granice, liczbę wyników i zdecyduj, czy wartości mogą się powtarzać.",
    seoTitle: "Generator liczb losowych | Losuj z wybranego zakresu",
    seoDescription: "Wybierz zakres i liczbę wyników, aby wylosować liczby bez powtórzeń lub z powtórzeniami w przeglądarce.",
    category: "Narzędzia losujące",
    keywords: ["generator liczb losowych", "losowanie liczb", "losowe liczby z zakresu"],
    steps: ["Podaj minimalną i maksymalną wartość.", "Wybierz liczbę losowanych wartości i ustawienia powtórzeń.", "Wylosuj i skopiuj wynik."],
    example: "Wylosuj sześć różnych liczb z zakresu od 1 do 49.",
    options: "Liczba wyników nie może przekraczać liczby dostępnych wartości, jeśli wyłączysz powtórzenia.",
    caution: "Losowanie jest przeznaczone do prostych zastosowań i rozrywki, a nie do kryptografii ani gier na pieniądze.",
    faq: { example: "Czy wynik może zawierać powtórzenia?", caution: "Czy podany zakres jest wysyłany na serwer?" },
  },
  "random-name-picker": {
    title: "Losowanie imion i nazw",
    description: "Wybierz losowo jedną pozycję z listy imion, nazw lub innych wpisów.",
    seoTitle: "Losowanie imion i nazw | Wybierz losowo z listy",
    seoDescription: "Wklej listę pozycji, aby losowo wybrać osobę lub nazwę. Lista jest przetwarzana lokalnie w przeglądarce.",
    category: "Narzędzia losujące",
    keywords: ["losowanie imion", "losowanie nazw", "wybór z listy", "losowanie osoby"],
    steps: ["Wpisz każdą osobę lub pozycję w osobnym wierszu.", "Uruchom losowanie.", "Zobacz wybrany wpis lub kontynuuj losowanie."],
    example: "Wklej listę uczestników, aby wylosować osobę rozpoczynającą spotkanie.",
    options: "Puste wiersze są pomijane. Każda pozostała linia jest osobną pozycją.",
    caution: "Lista nie opuszcza przeglądarki. Nie wpisuj danych, których nie chcesz wyświetlać na ekranie.",
    faq: { example: "Czy mogę losować ponownie?", caution: "Czy lista jest zapisywana?" },
  },
  "random-wheel": {
    title: "Koło losujące",
    description: "Dodaj własne opcje i zakręć kołem, aby wybrać jedną z nich losowo.",
    seoTitle: "Koło losujące | Losuj spośród własnych opcji",
    seoDescription: "Wpisz opcje, zakręć interaktywnym kołem i zobacz wylosowany wynik. Wpisy są obsługiwane w przeglądarce.",
    category: "Narzędzia losujące",
    keywords: ["koło losujące", "koło fortuny", "losowanie opcji", "random wheel"],
    steps: ["Wpisz każdą opcję w osobnym wierszu.", "Uruchom koło.", "Odczytaj wskazaną opcję i w razie potrzeby losuj ponownie."],
    example: "Dodaj propozycje obiadu, aby wylosować jedną z nich.",
    options: "Każdy niepusty wiersz staje się osobnym polem na kole.",
    caution: "Koło służy do prostych decyzji i rozrywki. Nie jest narzędziem do losowań wymagających formalnej kontroli.",
    faq: { example: "Czy mogę zmienić pozycje na kole?", caution: "Czy wpisane opcje są przesyłane?" },
  },
  "draw-lots": {
    title: "Losowanie z listy",
    description: "Wprowadź uczestników i losuj pozycje bez powtórzeń, aby ustalić kolejność lub wskazać wybraną osobę.",
    seoTitle: "Losowanie z listy | Wybierz osobę lub kolejność",
    seoDescription: "Wklej pozycje w osobnych wierszach i wylosuj jedną osobę albo losową kolejność. Dane pozostają w przeglądarce.",
    category: "Narzędzia losujące",
    keywords: ["losowanie z listy", "losowanie uczestników", "losowanie kolejności"],
    steps: ["Wpisz uczestników, po jednym w każdym wierszu.", "Wybierz losowanie jednej osoby lub kolejności.", "Uruchom losowanie i sprawdź wynik."],
    example: "Ustal losową kolejność prezentacji dla grupy.",
    options: "Każdy wpis może zostać wybrany tylko raz w obrębie jednego losowania kolejności.",
    caution: "Wynik nie jest protokołowany ani weryfikowany przez niezależny system losujący.",
    faq: { example: "Czy mogę wylosować całą kolejność?", caution: "Czy mogę użyć tej strony do oficjalnego konkursu?" },
  },
  "random-team-maker": {
    title: "Losowy podział na zespoły",
    description: "Podziel listę uczestników na losowe zespoły, określając liczbę zespołów lub osób w każdym z nich.",
    seoTitle: "Losowy podział na zespoły | Generator grup",
    seoDescription: "Wklej listę uczestników i utwórz losowe grupy w przeglądarce. Możesz ustawić liczbę zespołów lub ich rozmiar.",
    category: "Narzędzia losujące",
    keywords: ["losowy podział na zespoły", "generator grup", "losowanie drużyn"],
    steps: ["Wpisz uczestników w osobnych wierszach.", "Wybierz liczbę zespołów albo liczbę osób w zespole.", "Utwórz grupy i sprawdź przydział."],
    example: "Podziel 12 uczestników na trzy zespoły po cztery osoby.",
    options: "Jeśli liczba uczestników nie dzieli się równo, zespoły mogą różnić się wielkością o jedną osobę.",
    caution: "Lista uczestników jest przetwarzana lokalnie. Sprawdź przydział przed jego wykorzystaniem.",
    faq: { example: "Czy zespoły muszą mieć identyczny rozmiar?", caution: "Czy lista osób jest wysyłana?" },
  },
  "random-order": {
    title: "Losowa kolejność",
    description: "Przemieszaj własną listę i uzyskaj losową kolejność pozycji bez ich pomijania.",
    seoTitle: "Generator losowej kolejności | Przemieszaj listę",
    seoDescription: "Wklej pozycje w osobnych wierszach i utwórz ich losową kolejność bez wysyłania listy na serwer.",
    category: "Narzędzia losujące",
    keywords: ["losowa kolejność", "przemieszaj listę", "losowe ustawienie pozycji"],
    steps: ["Wpisz elementy listy, po jednym w każdym wierszu.", "Uruchom losowanie kolejności.", "Odczytaj lub skopiuj przestawioną listę."],
    example: "Przemieszaj kolejność tematów lub uczestników przed spotkaniem.",
    options: "Każdy niepusty wiersz jest zachowywany jako oddzielna pozycja.",
    caution: "Narzędzie nie zapewnia audytowalnego ani kryptograficznie bezpiecznego losowania.",
    faq: { example: "Czy każda pozycja pozostaje na liście?", caution: "Czy moja lista jest przesyłana?" },
  },
  "random-seat": {
    title: "Losowe przydzielanie miejsc",
    description: "Przypisz uczestników do numerowanych miejsc w losowej kolejności.",
    seoTitle: "Losowe przydzielanie miejsc | Generator układu miejsc",
    seoDescription: "Wklej listę uczestników i wylosuj przydział do miejsc. Dane są przetwarzane w przeglądarce.",
    category: "Narzędzia losujące",
    keywords: ["losowanie miejsc", "przydzielanie miejsc", "losowy układ uczestników"],
    steps: ["Wpisz uczestników w osobnych wierszach.", "Podaj liczbę dostępnych miejsc.", "Wylosuj przypisanie osób do miejsc."],
    example: "Wylosuj miejsca dla gości przy wspólnym stole.",
    options: "Jeśli miejsc jest więcej niż uczestników, niewykorzystane miejsca pozostają puste.",
    caution: "Sprawdź wynik przed użyciem; narzędzie nie zapisuje ani nie certyfikuje losowania.",
    faq: { example: "Czy mogę mieć puste miejsca?", caution: "Czy dane uczestników opuszczają urządzenie?" },
  },
} satisfies Record<string, TargetPolishToolTranslation>;

export const targetPolishToolSlugs = Object.keys(translations) as Array<keyof typeof translations>;

export function getTargetPolishToolTranslation(slug: string): TargetPolishToolTranslation | undefined {
  return Object.prototype.hasOwnProperty.call(translations, slug) ? translations[slug as keyof typeof translations] : undefined;
}
