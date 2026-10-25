import type { PlannedLocale } from "./routing";

type ExpandedLocale = "fil" | "bn" | "uk" | "ms" | "sv" | "cs" | "ro" | "el";

export type TargetRandomProcessorCopy = {
  total: string;
  heads: string;
  tails: string;
  headsRatio: string;
  team: string;
  rangeHint: string;
};

const copy = {
  fil: { total: "Kabuuan", heads: "Ulo", tails: "Buntot", headsRatio: "Bahagdan ng ulo", team: "Pangkat", rangeHint: "Pinakamababa, pinakamataas (halimbawa: 1, 45)" },
  bn: { total: "মোট", heads: "হেড", tails: "টেল", headsRatio: "হেডের অনুপাত", team: "দল", rangeHint: "সর্বনিম্ন, সর্বোচ্চ (যেমন: 1, 45)" },
  uk: { total: "Усього", heads: "Орел", tails: "Решка", headsRatio: "Частка орла", team: "Команда", rangeHint: "Мінімум, максимум (наприклад: 1, 45)" },
  ms: { total: "Jumlah", heads: "Kepala", tails: "Ekor", headsRatio: "Nisbah kepala", team: "Pasukan", rangeHint: "Minimum, maksimum (contoh: 1, 45)" },
  sv: { total: "Summa", heads: "Krona", tails: "Klave", headsRatio: "Andel krona", team: "Lag", rangeHint: "Minsta, största värde (till exempel: 1, 45)" },
  cs: { total: "Celkem", heads: "Orel", tails: "Panna", headsRatio: "Podíl orla", team: "Tým", rangeHint: "Minimum, maximum (například: 1, 45)" },
  ro: { total: "Total", heads: "Cap", tails: "Pajură", headsRatio: "Procent cap", team: "Echipa", rangeHint: "Minim, maxim (de exemplu: 1, 45)" },
  el: { total: "Σύνολο", heads: "Κορώνα", tails: "Γράμματα", headsRatio: "Ποσοστό κορώνας", team: "Ομάδα", rangeHint: "Ελάχιστο, μέγιστο (π.χ. 1, 45)" },
} satisfies Record<ExpandedLocale, TargetRandomProcessorCopy>;

export function getTargetRandomProcessorCopy(locale: PlannedLocale): TargetRandomProcessorCopy | undefined {
  return locale in copy ? copy[locale as ExpandedLocale] : undefined;
}
