import { Converter } from "opencc-js";
import type { CountryToolSlug } from "./country-tool-slugs";

export function convertSimplifiedTraditional(input: string, direction: "to-traditional" | "to-simplified") {
  const converter = Converter(direction === "to-traditional" ? { from: "cn", to: "twp" } : { from: "twp", to: "cn" });
  return converter(input);
}

const CN_DIGITS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
const CN_SMALL = ["", "十", "百", "千"];
const CN_BIG = ["", "万", "亿", "兆"];
function chineseChunk(n: number) {
  let output = "", zero = false;
  for (let pos = 3; pos >= 0; pos--) {
    const digit = Math.floor(n / 10 ** pos) % 10;
    if (!digit) { if (output) zero = true; continue; }
    if (zero) output += "零";
    if (!(digit === 1 && pos === 1 && !output)) output += CN_DIGITS[digit];
    output += CN_SMALL[pos]; zero = false;
  }
  return output;
}
export function numberToChinese(input: string | number) {
  const number = Number(input);
  if (!Number.isSafeInteger(number)) throw new Error("invalid-number");
  if (!number) return "零";
  const negative = number < 0;
  let rest = Math.abs(number), output = "", pendingZero = false;
  for (let group = 3; group >= 0; group--) {
    const chunk = Math.floor(rest / 10 ** (group * 4)) % 10000;
    if (!chunk) { if (output && rest) pendingZero = true; continue; }
    if (pendingZero || (output && chunk < 1000)) output += "零";
    output += chineseChunk(chunk) + CN_BIG[group];
    rest %= 10 ** (group * 4); pendingZero = false;
  }
  return `${negative ? "负" : ""}${output}`;
}

const FINANCIAL_DIGITS = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
function chineseFinancialInteger(value: number) {
  if (value === 0) return "零元";
  const groups = ["", "万", "亿", "兆"];
  let output = "", rest = value, needsZero = false;
  for (let group = 3; group >= 0; group--) {
    const chunk = Math.floor(rest / 10 ** (group * 4)) % 10000;
    if (!chunk) { if (output && rest) needsZero = true; continue; }
    if (needsZero || (output && chunk < 1000)) output += "零";
    let part = "", zero = false;
    for (let pos = 3; pos >= 0; pos--) {
      const digit = Math.floor(chunk / 10 ** pos) % 10;
      if (!digit) { if (part) zero = true; continue; }
      if (zero) part += "零";
      part += FINANCIAL_DIGITS[digit] + ["", "拾", "佰", "仟"][pos]; zero = false;
    }
    output += part + groups[group]; rest %= 10 ** (group * 4); needsZero = false;
  }
  return `${output}元`;
}
export function rmbUppercase(input: string) {
  const normalized = input.replace(/[￥¥,，\s]/g, "");
  if (!/^-?\d+(?:\.\d{1,2})?$/.test(normalized)) throw new Error("invalid-amount");
  const negative = normalized.startsWith("-");
  const [whole, decimal = ""] = normalized.replace(/^-/, "").split(".");
  const integer = Number(whole), centsFraction = Number((decimal + "00").slice(0,2));
  if (!Number.isSafeInteger(integer) || integer > Number.MAX_SAFE_INTEGER / 100) throw new Error("invalid-amount");
  const jiao = Math.floor(centsFraction / 10), fen = centsFraction % 10;
  let result = `${chineseFinancialInteger(integer)}`;
  if (jiao) result += `${FINANCIAL_DIGITS[jiao]}角`;
  else if (fen) result += "零";
  if (fen) result += `${FINANCIAL_DIGITS[fen]}分`;
  if (!jiao && !fen) result += "整";
  return `${negative ? "负" : ""}${result}`;
}

export function chineseCycle(year: number) {
  if (!Number.isInteger(year) || year < 1 || year > 9999) throw new Error("invalid-year");
  const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const offset = ((year - 4) % 60 + 60) % 60;
  return { stem: stems[offset % 10], branch: branches[offset % 12], zodiac: branches[offset % 12], cycle: `${stems[offset % 10]}${branches[offset % 12]}` };
}

export function indianNumber(input: string | number) { return formatNumber(input, "en-IN"); }
const numberLocales: Record<string, string> = { "german-number-format-converter": "de-DE", "spanish-number-format-converter": "es-ES", "french-number-format-converter": "fr-FR", "dutch-number-format-converter": "nl-NL", "vietnam-number-format-converter": "vi-VN", "italy-number-format-converter": "it-IT" };
export function formatNumber(input: string | number, localeOrSlug = "en-US") {
  const locale = numberLocales[localeOrSlug] ?? localeOrSlug;
  let value: number;
  if (typeof input === "number") value = input;
  else {
    const sample = new Intl.NumberFormat(locale).formatToParts(12345.6);
    const group = sample.find((part) => part.type === "group")?.value ?? ",";
    const decimal = sample.find((part) => part.type === "decimal")?.value ?? ".";
    let text = input.trim().replace(/[\s\u00a0\u202f'’]/g, "");
    const lastDecimal = text.lastIndexOf(decimal);
    if (lastDecimal >= 0 && decimal !== group) {
      text = text.slice(0,lastDecimal).split(group).join("") + "." + text.slice(lastDecimal + decimal.length).split(group).join("");
    } else if (group && text.includes(group)) {
      const lastGroup = text.lastIndexOf(group);
      const fractionalDigits = text.length - lastGroup - group.length;
      if (group === "." && fractionalDigits > 0 && fractionalDigits <= 2 && !text.includes(decimal)) text = text.slice(0,lastGroup) + "." + text.slice(lastGroup + 1);
      else text = text.split(group).join("");
    }
    value = Number(text.replace(/,/g, ""));
  }
  if (!Number.isFinite(value)) throw new Error("invalid-number");
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 20 }).format(value);
}
export function lakhCrore(input: string) {
  const normalized = input.trim().toLowerCase().replace(/,/g, "");
  const direct = normalized.match(/^([+-]?\d+(?:\.\d+)?)\s*(lakh|lac|crore|cr)$/);
  if (direct) return String(Number(direct[1]) * (direct[2] === "lakh" || direct[2] === "lac" ? 100_000 : 10_000_000));
  const value = Number(normalized);
  if (!Number.isFinite(value)) throw new Error("invalid-number");
  const abs = Math.abs(value);
  if (abs >= 10_000_000) return `${value / 10_000_000} crore`;
  if (abs >= 100_000) return `${value / 100_000} lakh`;
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 6 }).format(value);
}

export function validateIban(country: "DE" | "NL", input: string) {
  const iban = input.replace(/[\s-]/g, "").toUpperCase();
  const structure = country === "DE" ? /^DE\d{20}$/ : /^NL\d{2}[A-Z]{4}\d{10}$/;
  if (!structure.test(iban)) return { valid: false, level: "format" as const };
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const char of rearranged) {
    const expanded = char >= "A" ? String(char.charCodeAt(0) - 55) : char;
    for (const digit of expanded) remainder = (remainder * 10 + Number(digit)) % 97;
  }
  return { valid: remainder === 1, level: "checksum" as const };
}
const DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";
export function validateSpanishId(kind: "dni" | "nie", input: string) {
  const value = input.toUpperCase().replace(/[\s.-]/g, "");
  if (kind === "dni") {
    const match = value.match(/^(\d{8})([A-Z])$/);
    if (!match) return { valid: false, level: "format" as const };
    return { valid: DNI_LETTERS[Number(match[1]) % 23] === match[2], level: "checksum" as const };
  }
  const match = value.match(/^([XYZ])(\d{7})([A-Z])$/);
  if (!match) return { valid: false, level: "format" as const };
  const number = `${"XYZ".indexOf(match[1])}${match[2]}`;
  return { valid: DNI_LETTERS[Number(number) % 23] === match[3], level: "checksum" as const };
}

function cpfDigit(base: string, factor: number) {
  const sum = [...base].reduce((total, digit, index) => total + Number(digit) * (factor - index), 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}
export function validateCpf(input: string) {
  const digits = input.replace(/\D/g, "");
  if (!/^\d{11}$/.test(digits) || /^(\d)\1{10}$/.test(digits)) return { valid: false, level: "format" as const };
  const first = cpfDigit(digits.slice(0, 9), 10);
  const second = cpfDigit(digits.slice(0, 9) + first, 11);
  return { valid: first === Number(digits[9]) && second === Number(digits[10]), level: "checksum" as const };
}
function cnpjDigit(base: string, weights: number[]) {
  const sum = [...base].reduce((total, char, index) => total + (char.charCodeAt(0) - 48) * weights[index], 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}
export function validateCnpj(input: string) {
  const value = input.toUpperCase().replace(/[./\-\s]/g, "");
  if (!/^[A-Z0-9]{12}\d{2}$/.test(value) || /^([A-Z0-9])\1{13}$/.test(value)) return { valid: false, level: "format" as const };
  const first = cnpjDigit(value.slice(0, 12), [5,4,3,2,9,8,7,6,5,4,3,2]);
  const second = cnpjDigit(value.slice(0, 12) + first, [6,5,4,3,2,9,8,7,6,5,4,3,2]);
  return { valid: first === Number(value[12]) && second === Number(value[13]), level: "checksum" as const };
}
export function validatePan(input: string) {
  return { valid: /^[A-Z]{3}[ABCFGHLJPT][A-Z]\d{4}[A-Z]$/.test(input.toUpperCase().replace(/\s/g, "")), level: "format" as const };
}
export function validateGstin(input: string) {
  const value = input.toUpperCase().replace(/[\s-]/g, "");
  const valid = /^(0[1-9]|[12][0-9]|3[0-8]|97)[A-Z]{3}[ABCFGHLJPT][A-Z][0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(value);
  return { valid, level: "format" as const };
}
export function validateCodiceFiscale(input: string) {
  const value = input.toUpperCase().replace(/\s/g, "");
  if (!/^[A-Z]{6}\d{2}[A-EHLMPR-T]\d{2}[A-Z]\d{3}[A-Z]$/.test(value)) return { valid:false, level:"format" as const };
  const odd = [1,0,5,7,9,13,15,17,19,21,2,4,18,20,11,3,6,8,12,14,16,10,22,25,24,23];
  const sum = [...value.slice(0,15)].reduce((total, character, index) => {
    if (index % 2 === 0) return total + odd[character >= "0" && character <= "9" ? Number(character) : character.charCodeAt(0) - 65];
    return total + (character >= "0" && character <= "9" ? Number(character) : character.charCodeAt(0) - 65);
  }, 0);
  return { valid: String.fromCharCode(65 + sum % 26) === value[15], level:"checksum" as const };
}

const PHONE_COUNTRY: Record<string, { country: string }> = {
  "chinese-phone-number-formatter": { country: "+86" }, "france-phone-number-formatter": { country: "+33" },
  "brazil-phone-number-formatter": { country: "+55" }, "vietnam-phone-number-formatter": { country: "+84" },
};
export function formatPhone(slug: string, input: string) {
  const { country } = PHONE_COUNTRY[slug] ?? { country: "" };
  const digits = input.replace(/\D/g, "");
  if (!digits) throw new Error("invalid-phone");
  if (slug === "chinese-phone-number-formatter") {
    const local = digits.startsWith("86") && digits.length > 11 ? digits.slice(2) : digits;
    if (local.length === 11) return `${country} ${local.slice(0, 3)} ${local.slice(3, 7)} ${local.slice(7)}`;
    if (local.length >= 10 && local.length <= 12) return `${country} ${local.slice(0, 3)} ${local.slice(3)}`;
    throw new Error("invalid-phone");
  }
  if (slug === "france-phone-number-formatter") {
    const local = digits.startsWith("33") && digits.length === 11 ? `0${digits.slice(2)}` : digits;
    if (!/^0\d{9}$/.test(local)) throw new Error("invalid-phone");
    return local.replace(/(\d{2})(?=\d)/g, "$1 ").trim().replace(/^0/, `${country} `);
  }
  if (slug === "brazil-phone-number-formatter") {
    const local = digits.startsWith("55") && digits.length > 11 ? digits.slice(2) : digits;
    if (local.length !== 10 && local.length !== 11) throw new Error("invalid-phone");
    return `${country} (${local.slice(0, 2)}) ${local.length === 11 ? local.slice(2, 7) : local.slice(2, 6)}-${local.slice(local.length === 11 ? 7 : 6)}`;
  }
  const local = digits.startsWith("84") && digits.length > 10 ? `0${digits.slice(2)}` : digits;
  if (local.length < 9 || local.length > 11) throw new Error("invalid-phone");
  return `${country} ${local.slice(0, 4)} ${local.slice(4)}`;
}

export function convertDate(input: string, country: "DE" | "FR") {
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(input) ? input : null;
  const local = /^\d{2}[./-]\d{2}[./-]\d{4}$/.test(input) ? input.replace(/[./]/g, "-") : null;
  const candidate = iso ?? (local ? `${local.slice(6)}-${local.slice(3,5)}-${local.slice(0,2)}` : null);
  if (!candidate) throw new Error("invalid-date");
  const d = new Date(`${candidate}T00:00:00Z`);
  if (Number.isNaN(d.valueOf()) || d.toISOString().slice(0,10) !== candidate) throw new Error("invalid-date");
  const separator = country === "FR" ? "/" : ".";
  return `${candidate.slice(8,10)}${separator}${candidate.slice(5,7)}${separator}${candidate.slice(0,4)}`;
}

export function runCountryTool(slug: CountryToolSlug, input: string, mode = "forward") {
  switch (slug) {
    case "simplified-traditional-chinese-converter": return convertSimplifiedTraditional(input, mode === "reverse" ? "to-simplified" : "to-traditional");
    case "chinese-number-kanji-converter": return mode === "reverse" ? String(chineseToNumber(input)) : numberToChinese(input);
    case "rmb-uppercase-converter": return rmbUppercase(input);
    case "chinese-zodiac-calculator": return chineseCycle(Number(input)).zodiac;
    case "chinese-sexagenary-cycle-calculator": return chineseCycle(Number(input)).cycle;
    case "indian-number-format-converter": return indianNumber(input);
    case "lakh-crore-converter": return lakhCrore(input);
    case "pan-format-validator": return validatePan(input);
    case "gstin-format-validator": return validateGstin(input);
    case "germany-iban-validator": return validateIban("DE", input);
    case "netherlands-iban-validator": return validateIban("NL", input);
    case "german-number-format-converter": case "spanish-number-format-converter": case "french-number-format-converter": case "dutch-number-format-converter": case "vietnam-number-format-converter": case "italy-number-format-converter": return formatNumber(input, slug);
    case "german-date-format-converter": case "french-date-format-converter": return convertDate(input, slug.startsWith("german") ? "DE" : "FR");
    case "spain-dni-validator": return validateSpanishId("dni", input);
    case "spain-nie-validator": return validateSpanishId("nie", input);
    case "brazil-cpf-validator": return validateCpf(input);
    case "brazil-cnpj-validator": return validateCnpj(input);
    case "italy-fiscal-code-format-validator": return validateCodiceFiscale(input);
    case "chinese-phone-number-formatter": case "france-phone-number-formatter": case "brazil-phone-number-formatter": case "vietnam-phone-number-formatter": return formatPhone(slug, input);
    default: throw new Error("unsupported-tool");
  }
}

export function chineseToNumber(input: string) {
  let value = input.trim(), negative = false;
  if (value.startsWith("负")) { negative = true; value = value.slice(1); }
  const digits: Record<string, number> = Object.fromEntries(CN_DIGITS.map((digit, index) => [digit, index]));
  const small: Record<string, number> = { 十: 10, 百: 100, 千: 1000 }, big: Record<string, number> = { 万: 1e4, 亿: 1e8, 兆: 1e12 };
  let total = 0, section = 0, current = 0;
  for (const char of value) {
    if (char in digits) current = digits[char];
    else if (char in small) { section += (current || 1) * small[char]; current = 0; }
    else if (char in big) { total += (section + current) * big[char]; section = 0; current = 0; }
    else throw new Error("invalid-chinese-number");
  }
  const result = total + section + current;
  if (!Number.isSafeInteger(result)) throw new Error("invalid-number");
  return negative ? -result : result;
}
