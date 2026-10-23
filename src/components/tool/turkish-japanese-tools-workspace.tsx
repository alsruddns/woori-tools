"use client";

import { useState } from "react";
import { convertKana, convertWidth, gregorianToWareki, japaneseZodiac, kanaToRomaji, kanjiToNumber, numberToKanji, warekiToGregorian, yakudoshi } from "@/lib/japanese-tools";

export type TurkishJapaneseSlug = "wareki-converter" | "hiragana-katakana-converter" | "fullwidth-halfwidth-converter" | "japanese-romaji-converter" | "japanese-number-kanji-converter" | "yakudoshi-calculator" | "japanese-zodiac-calculator";

const labels: Record<TurkishJapaneseSlug, { title: string; input: string; placeholder: string; action: string; privacy: string }> = {
  "wareki-converter": { title: "Japon dönemi tarihi dönüştürücü", input: "Miladi tarih veya dönem yılı", placeholder: "YYYY-AA-GG biçiminde tarih girin", action: "Dönüştür", privacy: "Tarih tarayıcınızda dönüştürülür." },
  "hiragana-katakana-converter": { title: "Hiragana ve Katakana dönüştürücü", input: "Japonca metin", placeholder: "Dönüştürülecek kana metnini girin", action: "Kana biçimini değiştir", privacy: "Metin tarayıcınızda dönüştürülür." },
  "fullwidth-halfwidth-converter": { title: "Tam ve yarım genişlik dönüştürücü", input: "Japonca metin", placeholder: "Genişliği dönüştürülecek metni girin", action: "Genişliği dönüştür", privacy: "Metin tarayıcınızda dönüştürülür." },
  "japanese-romaji-converter": { title: "Japonca Romaji dönüştürücü", input: "Hiragana veya Katakana metni", placeholder: "Romaji biçimine dönüştürülecek kana metnini girin", action: "Romaji'ye dönüştür", privacy: "Metin tarayıcınızda dönüştürülür." },
  "japanese-number-kanji-converter": { title: "Japonca sayı ve Kanji dönüştürücü", input: "Sayı veya Kanji", placeholder: "Dönüştürülecek değeri girin", action: "Sayı biçimini değiştir", privacy: "Değer tarayıcınızda dönüştürülür." },
  "yakudoshi-calculator": { title: "Japon yakudoshi yaş hesaplayıcı", input: "Doğum yılı", placeholder: "Örnek: 1990", action: "Yaş dönemlerini hesapla", privacy: "Japon geleneksel yaş hesabı tarayıcınızda yapılır." },
  "japanese-zodiac-calculator": { title: "Japon zodyak ve altmış yıllık döngü", input: "Yıl", placeholder: "Örnek: 2026", action: "Döngüyü göster", privacy: "Takvim döngüsü tarayıcınızda hesaplanır." },
};
const eras = [["明治", "Meiji"], ["大正", "Taishō"], ["昭和", "Shōwa"], ["平成", "Heisei"], ["令和", "Reiwa"]] as const;

export function TurkishJapaneseToolsWorkspace({ slug }: { slug: TurkishJapaneseSlug }) {
  const copy = labels[slug];
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState(slug === "japanese-number-kanji-converter" ? "to-kanji" : slug === "fullwidth-halfwidth-converter" ? "to-full" : "to-katakana");
  const [mode, setMode] = useState("forward");
  const [era, setEra] = useState<string>("令和");
  const [year, setYear] = useState("1");
  const [month, setMonth] = useState("1");
  const [day, setDay] = useState("1");
  const [currentYear, setCurrentYear] = useState(String(new Date().getFullYear()));
  const [gender, setGender] = useState<"male" | "female">("male");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function run() {
    setOutput(""); setError("");
    if (slug !== "wareki-converter" && !input.trim()) { setError("Dönüştürülecek bir değer girin."); return; }
    try {
      let result: string;
      if (slug === "yakudoshi-calculator") {
        const periods = yakudoshi(Number(input), Number(currentYear), gender);
        result = periods.length ? periods.map((item) => `${item.year}: yaş ${item.age} — ${item.phase === "maeyaku" ? "öncesi" : item.phase === "atoyaku" ? "sonrası" : "ana dönem"}`).join("\n") : "Seçilen yıl çevresinde bir yakudoshi dönemi bulunmuyor.";
      } else if (slug === "japanese-zodiac-calculator") {
        const cycle = japaneseZodiac(Number(input)); result = `Japon burcu: ${cycle.branch}\nAltmış yıllık döngü: ${cycle.eto}`;
      } else if (slug === "wareki-converter") {
        if (mode === "forward") { const value = gregorianToWareki(input.trim()); result = `${eras.find(([name]) => name === value.era)?.[1] ?? value.era} ${value.yearLabel} (${value.date})`; }
        else result = warekiToGregorian(era, year, month, day);
      } else if (slug === "hiragana-katakana-converter") result = convertKana(input, direction as "to-katakana" | "to-hiragana");
      else if (slug === "fullwidth-halfwidth-converter") result = convertWidth(input, direction as "to-full" | "to-half");
      else if (slug === "japanese-romaji-converter") result = kanaToRomaji(input);
      else result = direction === "to-kanji" ? numberToKanji(input.trim()) : String(kanjiToNumber(input.trim()));
      setOutput(result);
    } catch { setError("Değeri ve seçtiğiniz dönüştürme yönünü kontrol edin."); }
  }

  return <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <h2 className="text-xl font-semibold text-slate-900">{copy.title}</h2>
    {(slug === "yakudoshi-calculator" || slug === "japanese-zodiac-calculator") && <div className="mt-4 flex flex-wrap gap-3">{slug === "yakudoshi-calculator" && <><label className="text-sm font-medium">Referans yılı<input type="number" min="1" max="9999" value={currentYear} onChange={(event) => setCurrentYear(event.target.value)} className="mt-2 block min-h-11 w-28 rounded-xl border border-slate-300 px-3" /></label><label className="text-sm font-medium">Cinsiyet<select value={gender} onChange={(event) => setGender(event.target.value as "male" | "female")} className="mt-2 block min-h-11 rounded-xl border border-slate-300 px-3"><option value="male">Erkek</option><option value="female">Kadın</option></select></label></>}</div>}
    {slug === "wareki-converter" && <div className="mt-4 flex flex-wrap gap-3"><label className="text-sm font-medium">Yön<select value={mode} onChange={(event) => setMode(event.target.value)} className="mt-2 block min-h-11 rounded-xl border border-slate-300 px-3"><option value="forward">Miladi tarihten Japon dönemine</option><option value="reverse">Japon döneminden miladi tarihe</option></select></label>{mode === "reverse" && <><label className="text-sm font-medium">Dönem<select value={era} onChange={(event) => setEra(event.target.value)} className="mt-2 block min-h-11 rounded-xl border border-slate-300 px-3">{eras.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="text-sm font-medium">Yıl<input type="number" min="1" value={year} onChange={(event) => setYear(event.target.value)} className="mt-2 block min-h-11 w-24 rounded-xl border border-slate-300 px-3" /></label><label className="text-sm font-medium">Ay<input type="number" min="1" max="12" value={month} onChange={(event) => setMonth(event.target.value)} className="mt-2 block min-h-11 w-24 rounded-xl border border-slate-300 px-3" /></label><label className="text-sm font-medium">Gün<input type="number" min="1" max="31" value={day} onChange={(event) => setDay(event.target.value)} className="mt-2 block min-h-11 w-24 rounded-xl border border-slate-300 px-3" /></label></>}</div>}
    {(slug === "hiragana-katakana-converter" || slug === "fullwidth-halfwidth-converter" || slug === "japanese-number-kanji-converter") && <label className="mt-4 block text-sm font-medium">Dönüştürme yönü<select value={direction} onChange={(event) => setDirection(event.target.value)} className="mt-2 block min-h-11 rounded-xl border border-slate-300 px-3">{slug === "hiragana-katakana-converter" ? <><option value="to-katakana">Hiragana → Katakana</option><option value="to-hiragana">Katakana → Hiragana</option></> : slug === "fullwidth-halfwidth-converter" ? <><option value="to-full">Yarım genişlik → Tam genişlik</option><option value="to-half">Tam genişlik → Yarım genişlik</option></> : <><option value="to-kanji">Arap rakamları → Japon Kanji</option><option value="to-number">Japon Kanji → Sayı</option></>}</select></label>}
    {!(slug === "wareki-converter" && mode === "reverse") && <label htmlFor={`tr-${slug}-input`} className="mt-4 block text-sm font-medium text-slate-800">{copy.input}<input id={`tr-${slug}-input`} type={slug === "yakudoshi-calculator" || slug === "japanese-zodiac-calculator" ? "number" : "text"} value={input} onChange={(event) => setInput(event.target.value)} placeholder={copy.placeholder} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3" /></label>}
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={run} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white">{copy.action}</button><button type="button" onClick={() => { setInput(""); setOutput(""); setError(""); }} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium">Sıfırla</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {output && <div className="mt-5"><h3 className="font-semibold">Sonuç</h3><pre role="status" aria-live="polite" className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm">{output}</pre></div>}
    <p className="mt-4 text-sm text-slate-600">{copy.privacy} Japonca dönem adları ve takvim kuralları Japonya sistemine göre uygulanır.</p>
  </section>;
}
