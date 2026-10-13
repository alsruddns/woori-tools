const ERA_STARTS = [
  { name: "明治", start: "1868-10-23", end: "1912-07-29" },
  { name: "大正", start: "1912-07-30", end: "1926-12-24" },
  { name: "昭和", start: "1926-12-25", end: "1989-01-07" },
  { name: "平成", start: "1989-01-08", end: "2019-04-30" },
  { name: "令和", start: "2019-05-01", end: "9999-12-31" },
] as const;

export function gregorianToWareki(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("invalid-date");
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== value) throw new Error("invalid-date");
  const era = [...ERA_STARTS].reverse().find(({ start }) => value >= start);
  if (!era || value > era.end) throw new Error("unsupported-date");
  const year = date.getUTCFullYear() - Number(era.start.slice(0, 4)) + 1;
  return { era: era.name, year, yearLabel: year === 1 ? "元年" : `${year}年`, date: value };
}

export function warekiToGregorian(eraName: string, eraYear: string | number, month: string | number, day: string | number) {
  const era = ERA_STARTS.find(({ name }) => name === eraName);
  if (!era) throw new Error("invalid-era");
  const yearNumber = eraYear === "元" || eraYear === "元年" ? 1 : Number(String(eraYear).replace(/年$/, ""));
  const monthNumber = Number(month), dayNumber = Number(day);
  if (!Number.isInteger(yearNumber) || yearNumber < 1 || !Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12 || !Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 31) throw new Error("invalid-date");
  const gregorianYear = Number(era.start.slice(0, 4)) + yearNumber - 1;
  const date = new Date(Date.UTC(gregorianYear, monthNumber - 1, dayNumber));
  const value = date.toISOString().slice(0, 10);
  if (date.getUTCMonth() !== monthNumber - 1 || date.getUTCDate() !== dayNumber || value < era.start || value > era.end) throw new Error("invalid-era-date");
  return value;
}

export function convertKana(value: string, direction: "to-katakana" | "to-hiragana") {
  return Array.from(value, (character) => {
    const code = character.codePointAt(0)!;
    if (direction === "to-katakana" && code >= 0x3041 && code <= 0x3096) return String.fromCodePoint(code + 0x60);
    if (direction === "to-hiragana" && code >= 0x30a1 && code <= 0x30f6) return String.fromCodePoint(code - 0x60);
    return character;
  }).join("");
}

const HALF_KANA = Array.from({ length: 0x9e - 0x61 }, (_, index) => String.fromCodePoint(0xff61 + index));
const HALF_TO_FULL = new Map(HALF_KANA.map((character) => [character, character.normalize("NFKC")]));
const FULL_TO_HALF = new Map([...HALF_TO_FULL].map(([half, full]) => [full, half]));
const HALF_KANA_PAIRS = new Map<string, string>();
for (const base of HALF_KANA) for (const mark of ["ﾞ", "ﾟ"]) {
  const pair = base + mark, full = pair.normalize("NFKC");
  if (full.length === 1 && full !== pair) { HALF_KANA_PAIRS.set(pair, full); FULL_TO_HALF.set(full, pair); }
}
export function convertWidth(value: string, direction: "to-half" | "to-full") {
  if (direction === "to-full") {
    let result = "";
    for (let index = 0; index < value.length;) {
      const pair = value.slice(index, index + 2);
      if (HALF_KANA_PAIRS.has(pair)) { result += HALF_KANA_PAIRS.get(pair); index += 2; continue; }
      const character = Array.from(value.slice(index))[0];
      result += HALF_TO_FULL.get(character) ?? character;
      index += character.length;
    }
    return result.normalize("NFC");
  }
  return Array.from(value.normalize("NFC"), (character) => {
    if (FULL_TO_HALF.has(character)) return FULL_TO_HALF.get(character)!;
    const decomposed = character.normalize("NFD");
    if (decomposed.length > 1 && [...decomposed].every((part) => FULL_TO_HALF.has(part))) return [...decomposed].map((part) => FULL_TO_HALF.get(part)).join("");
    return FULL_TO_HALF.get(character) ?? (character >= "！" && character <= "～" ? String.fromCharCode(character.charCodeAt(0) - 0xfee0) : character === "　" ? " " : character);
  }).join("");
}

const ROMAJI: Record<string, string> = {
  あ:"a",い:"i",う:"u",え:"e",お:"o",か:"ka",き:"ki",く:"ku",け:"ke",こ:"ko",さ:"sa",し:"shi",す:"su",せ:"se",そ:"so",た:"ta",ち:"chi",つ:"tsu",て:"te",と:"to",な:"na",に:"ni",ぬ:"nu",ね:"ne",の:"no",は:"ha",ひ:"hi",ふ:"fu",へ:"he",ほ:"ho",ま:"ma",み:"mi",む:"mu",め:"me",も:"mo",や:"ya",ゆ:"yu",よ:"yo",ら:"ra",り:"ri",る:"ru",れ:"re",ろ:"ro",わ:"wa",を:"o",ん:"n",が:"ga",ぎ:"gi",ぐ:"gu",げ:"ge",ご:"go",ざ:"za",じ:"ji",ず:"zu",ぜ:"ze",ぞ:"zo",だ:"da",ぢ:"ji",づ:"zu",で:"de",ど:"do",ば:"ba",び:"bi",ぶ:"bu",べ:"be",ぼ:"bo",ぱ:"pa",ぴ:"pi",ぷ:"pu",ぺ:"pe",ぽ:"po",
};
const YOON: Record<string, string> = {};
for (const [kana, base] of Object.entries({き:"k",ぎ:"g",し:"sh",じ:"j",ち:"ch",ぢ:"j",に:"n",ひ:"h",び:"b",ぴ:"p",み:"m",り:"r"})) {
  for (const [small, vowel] of Object.entries({ゃ:"a",ゅ:"u",ょ:"o"})) YOON[kana + small] = base + (["k","g","n","h","b","p","m","r"].includes(base) ? "y" : "") + vowel;
}
export function kanaToRomaji(input: string) {
  const value = convertKana(input, "to-hiragana");
  let result = "", previousVowel = "";
  for (let index = 0; index < value.length;) {
    const character = value[index];
    if (character === "っ") {
      const next = YOON[value.slice(index + 1, index + 3)] ?? ROMAJI[value[index + 1]] ?? "";
      if (next) result += next[0] === "c" ? "t" : next[0];
      index++; continue;
    }
    if (character === "ー") { result += previousVowel; index++; continue; }
    const pair = value.slice(index, index + 2);
    const romaji = YOON[pair] ?? ROMAJI[character] ?? character;
    if (character === "ん" && /^[aeiouy]/.test(YOON[value.slice(index + 1, index + 3)] ?? ROMAJI[value[index + 1]] ?? "")) result += "n'";
    else result += romaji;
    const last = romaji.match(/[aeiou](?!.*[aeiou])/);
    if (last) previousVowel = last[0];
    index += YOON[pair] ? 2 : 1;
  }
  return result;
}

const DIGITS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
const SMALL_UNITS = ["", "十", "百", "千"];
const LARGE_UNITS = ["", "万", "億", "兆"];
function chunkToKanji(value: number) {
  let result = "";
  for (let position = 3; position >= 0; position--) {
    const digit = Math.floor(value / 10 ** position) % 10;
    if (!digit) continue;
    if (digit !== 1 || position === 0) result += DIGITS[digit];
    result += SMALL_UNITS[position];
  }
  return result;
}
export function numberToKanji(input: string | number) {
  const value = Number(input);
  if (!Number.isSafeInteger(value)) throw new Error("invalid-number");
  if (value === 0) return DIGITS[0];
  const negative = value < 0;
  let rest = Math.abs(value), result = "";
  for (let group = LARGE_UNITS.length - 1; group >= 0; group--) {
    const chunk = Math.floor(rest / 10 ** (group * 4));
    if (chunk) result += chunkToKanji(chunk) + LARGE_UNITS[group];
    rest %= 10 ** (group * 4);
  }
  return `${negative ? "マイナス" : ""}${result}`;
}
export function kanjiToNumber(input: string) {
  let value = input.trim(), negative = false;
  if (value.startsWith("マイナス")) { negative = true; value = value.slice(4); }
  if (value === "零" || value === "〇" || value === "ゼロ") return 0;
  const digits: Record<string, number> = Object.fromEntries(DIGITS.map((digit, index) => [digit, index]));
  let total = 0, section = 0, current = 0;
  for (const character of value) {
    if (character in digits) { current = digits[character]; continue; }
    const small: Record<string, number> = {十:10,百:100,千:1000};
    if (character in small) { section += (current || 1) * small[character]; current = 0; continue; }
    const large: Record<string, number> = {万:1e4,億:1e8,兆:1e12};
    if (character in large) { total += (section + current) * large[character]; section = 0; current = 0; continue; }
    throw new Error("invalid-kanji-number");
  }
  const result = total + section + current;
  if (!Number.isSafeInteger(result)) throw new Error("number-out-of-range");
  return negative ? -result : result;
}

const ZODIAC = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
export function japaneseZodiac(year: number) {
  if (!Number.isInteger(year) || year < 1 || year > 9999) throw new Error("invalid-year");
  return { branch: ZODIAC[((year - 4) % 12 + 12) % 12], stem: STEMS[((year - 4) % 10 + 10) % 10], eto: `${STEMS[((year - 4) % 10 + 10) % 10]}${ZODIAC[((year - 4) % 12 + 12) % 12]}` };
}

export function yakudoshi(birthYear: number, currentYear: number, gender: "male" | "female") {
  if (![birthYear, currentYear].every(Number.isInteger) || birthYear < 1 || birthYear > currentYear) throw new Error("invalid-year");
  const targetAges = gender === "male" ? [25, 42, 61] : [19, 33, 37, 61];
  return targetAges.flatMap((age) => {
    const mainYear = birthYear + age - 1;
    return [-1, 0, 1].map((offset) => {
      const year = mainYear + offset;
      return { year, age: year - birthYear + 1, phase: offset < 0 ? "maeyaku" : offset > 0 ? "atoyaku" : "honyaku" } as const;
    }).filter((item) => Math.abs(item.year - currentYear) <= 1);
  });
}

export const BINGO5_RANGES = [[1,5],[6,10],[11,15],[16,20],null,[21,25],[26,30],[31,35],[36,40]] as const;
export function generateNumbersGame(digits: 3 | 4, count = 1) {
  if (!Number.isInteger(count) || count < 1 || count > 10) throw new Error("invalid-count");
  return Array.from({ length: count }, () => Array.from({ length: digits }, () => Math.floor(Math.random() * 10)).join(""));
}
export function generateBingo5() {
  return BINGO5_RANGES.map((range) => range ? Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0] : null);
}
