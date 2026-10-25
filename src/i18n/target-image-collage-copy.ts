import type { PlannedLocale } from "./routing";

export type TargetImageCollageCopy = {
  countError: (maximum: number) => string;
  result: (count: number, width: number, height: number) => string;
  invalidImage: string;
};

export const targetImageCollageCopy = {
  fil: { countError:(maximum:number)=>`Pumili ng 2 hanggang ${maximum} larawan para sa layout na ito.`, result:(count:number,width:number,height:number)=>`${count} larawan · ${width} × ${height}px`, invalidImage:"Hindi mabasa ang isa sa mga larawan. Pumili ng wastong image file." },
  bn: { countError:(maximum:number)=>`এই বিন্যাসের জন্য ২ থেকে ${maximum}টি ছবি বাছুন।`, result:(count:number,width:number,height:number)=>`${count}টি ছবি · ${width} × ${height}px`, invalidImage:"একটি ছবি পড়া যায়নি। একটি বৈধ ছবির ফাইল বেছে নিন।" },
  uk: { countError:(maximum:number)=>`Для цього макета виберіть від 2 до ${maximum} зображень.`, result:(count:number,width:number,height:number)=>`${count} зображень · ${width} × ${height}px`, invalidImage:"Не вдалося прочитати одне із зображень. Виберіть коректний файл зображення." },
  ms: { countError:(maximum:number)=>`Pilih 2 hingga ${maximum} imej untuk reka letak ini.`, result:(count:number,width:number,height:number)=>`${count} imej · ${width} × ${height}px`, invalidImage:"Salah satu imej tidak dapat dibaca. Pilih fail imej yang sah." },
  sv: { countError:(maximum:number)=>`Välj 2–${maximum} bilder för den här layouten.`, result:(count:number,width:number,height:number)=>`${count} bilder · ${width} × ${height}px`, invalidImage:"En av bilderna kunde inte läsas. Välj en giltig bildfil." },
  cs: { countError:(maximum:number)=>`Pro toto rozvržení vyberte 2 až ${maximum} obrázků.`, result:(count:number,width:number,height:number)=>`${count} obrázků · ${width} × ${height}px`, invalidImage:"Jeden z obrázků se nepodařilo načíst. Vyberte platný soubor obrázku." },
  ro: { countError:(maximum:number)=>`Selectează între 2 și ${maximum} imagini pentru acest aspect.`, result:(count:number,width:number,height:number)=>`${count} imagini · ${width} × ${height}px`, invalidImage:"Unul dintre imagini nu a putut fi citit. Alege un fișier imagine valid." },
  el: { countError:(maximum:number)=>`Επιλέξτε 2 έως ${maximum} εικόνες για αυτή τη διάταξη.`, result:(count:number,width:number,height:number)=>`${count} εικόνες · ${width} × ${height}px`, invalidImage:"Δεν ήταν δυνατή η ανάγνωση μίας εικόνας. Επιλέξτε ένα έγκυρο αρχείο εικόνας." },
} satisfies Record<"fil" | "bn" | "uk" | "ms" | "sv" | "cs" | "ro" | "el", TargetImageCollageCopy>;

export function getTargetImageCollageCopy(locale: PlannedLocale): TargetImageCollageCopy | undefined {
  return locale in targetImageCollageCopy ? targetImageCollageCopy[locale as keyof typeof targetImageCollageCopy] : undefined;
}
