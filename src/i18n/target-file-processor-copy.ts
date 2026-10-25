import type { PlannedLocale } from "./routing";

export type ExpandedLocale = "fil" | "bn" | "uk" | "ms" | "sv" | "cs" | "ro" | "el";

export type TargetFileProcessorCopy = {
  duplicateGroup: (number: number) => string;
  noDuplicates: string;
  unknownMime: string;
};

const targetFileProcessorCopy = {
  fil: {
    duplicateGroup: (number: number) => `Pangkat ${number}`,
    noDuplicates: "Walang nahanap na magkaparehong nilalaman ng file.",
    unknownMime: "Hindi alam na uri ng MIME",
  },
  bn: {
    duplicateGroup: (number: number) => `গ্রুপ ${number}`,
    noDuplicates: "ফাইলের একই বিষয়বস্তু পাওয়া যায়নি।",
    unknownMime: "অজানা MIME ধরন",
  },
  uk: {
    duplicateGroup: (number: number) => `Група ${number}`,
    noDuplicates: "Однаковий вміст файлів не знайдено.",
    unknownMime: "Невідомий тип MIME",
  },
  ms: {
    duplicateGroup: (number: number) => `Kumpulan ${number}`,
    noDuplicates: "Tiada kandungan fail yang sama ditemui.",
    unknownMime: "Jenis MIME tidak diketahui",
  },
  sv: {
    duplicateGroup: (number: number) => `Grupp ${number}`,
    noDuplicates: "Inget identiskt filinnehåll hittades.",
    unknownMime: "Okänd MIME-typ",
  },
  cs: {
    duplicateGroup: (number: number) => `Skupina ${number}`,
    noDuplicates: "Nebyly nalezeny stejné obsahy souborů.",
    unknownMime: "Neznámý typ MIME",
  },
  ro: {
    duplicateGroup: (number: number) => `Grupul ${number}`,
    noDuplicates: "Nu s-a găsit conținut identic în fișiere.",
    unknownMime: "Tip MIME necunoscut",
  },
  el: {
    duplicateGroup: (number: number) => `Ομάδα ${number}`,
    noDuplicates: "Δεν βρέθηκε ίδιο περιεχόμενο αρχείων.",
    unknownMime: "Άγνωστος τύπος MIME",
  },
} satisfies Record<ExpandedLocale, TargetFileProcessorCopy>;

export function getTargetFileProcessorCopy(locale: PlannedLocale): TargetFileProcessorCopy | undefined {
  return locale in targetFileProcessorCopy ? targetFileProcessorCopy[locale as ExpandedLocale] : undefined;
}
