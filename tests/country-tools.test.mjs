import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import * as opencc from "opencc-js";

globalThis.__opencc = opencc;
let source = await readFile(new URL("../src/lib/country-tools.ts", import.meta.url), "utf8");
source = source.replace('import { Converter } from "opencc-js";', "const { Converter } = globalThis.__opencc;");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const tools = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

test("OpenCC conversion handles phrase-aware simplified and traditional Chinese", () => {
  assert.equal(tools.convertSimplifiedTraditional("汉字", "to-traditional"), "漢字");
  assert.equal(tools.convertSimplifiedTraditional("繁體中文", "to-simplified"), "繁体中文");
});
test("Chinese numerals and RMB uppercase preserve place values and cents", () => {
  for (const [n, words] of [[0,"零"],[10,"十"],[101,"一百零一"],[10001,"一万零一"],[100000000,"一亿"]]) assert.equal(tools.numberToChinese(n), words);
  assert.equal(tools.chineseToNumber("一亿零三万零五"), 100030005);
  assert.equal(tools.chineseToNumber("负一百二十三"), -123);
  assert.equal(tools.rmbUppercase("123.45"), "壹佰贰拾叁元肆角伍分");
});
test("Chinese cycle gives deterministic zodiac and sexagenary year", () => {
  assert.deepEqual(tools.chineseCycle(1984), { stem:"甲", branch:"子", zodiac:"子", cycle:"甲子" });
  assert.equal(tools.chineseCycle(2024).cycle, "甲辰");
});
test("Indian digit grouping and lakh/crore conversions use the Indian scale", () => {
  assert.equal(tools.indianNumber("100000"), "1,00,000");
  assert.equal(tools.lakhCrore("100000"), "1 lakh");
  assert.equal(tools.lakhCrore("2 crore"), "20000000");
  assert.equal(tools.formatNumber("1.234,56", "german-number-format-converter"), "1.234,56");
  assert.equal(tools.formatNumber("1 234 567,89", "french-number-format-converter"), "1 234 567,89");
});
test("IBAN validation checks country structure and MOD 97", () => {
  assert.deepEqual(tools.validateIban("DE", "DE89 3704 0044 0532 0130 00"), { valid:true, level:"checksum" });
  assert.deepEqual(tools.validateIban("NL", "NL91ABNA0417164300"), { valid:true, level:"checksum" });
  assert.equal(tools.validateIban("DE", "DE00370400440532013000").valid, false);
  assert.equal(tools.validateIban("DE", "NL91ABNA0417164300").level, "format");
});
test("Spanish DNI and NIE checks use the official modulo-23 control letter", () => {
  assert.equal(tools.validateSpanishId("dni", "12345678Z").valid, true);
  assert.equal(tools.validateSpanishId("dni", "12345678A").valid, false);
  assert.deepEqual(tools.validateSpanishId("nie", "X1234567L"), { valid:true, level:"checksum" });
});
test("PAN reports structure only and GSTIN verifies its check character without claiming government verification", () => {
  assert.deepEqual(tools.validatePan("ABCPA1234F"), { valid:true, level:"format" });
  assert.deepEqual(tools.validateGstin("27AAPFU0939F1ZV"), { valid:true, level:"checksum" });
  assert.deepEqual(tools.validateGstin("27AAPFU0939F1ZA"), { valid:false, level:"checksum" });
  assert.deepEqual(tools.validateGstin("ABCDE1234F"), { valid:false, level:"format" });
});
test("CPF checksum and numeric or alphanumeric CNPJ checksum validate", () => {
  assert.deepEqual(tools.validateCpf("529.982.247-25"), { valid:true, level:"checksum" });
  assert.equal(tools.validateCpf("111.111.111-11").valid, false);
  assert.deepEqual(tools.validateCnpj("11.222.333/0001-81"), { valid:true, level:"checksum" });
  assert.deepEqual(tools.validateCnpj("12.ABC.345/01DE-35"), { valid:true, level:"checksum" });
  assert.equal(tools.validateCnpj("12.ABC.345/01DE-34").valid, false);
});
test("phone and date formatters validate supported local patterns", () => {
  assert.equal(tools.formatPhone("france-phone-number-formatter", "0612345678"), "+33 6 12 34 56 78");
  assert.equal(tools.formatPhone("brazil-phone-number-formatter", "11987654321"), "+55 (11) 98765-4321");
  assert.equal(tools.convertDate("2026-10-13", "DE"), "13.10.2026");
  assert.equal(tools.convertDate("2026-10-13", "FR"), "13/10/2026");
  assert.throws(() => tools.convertDate("2026-02-30", "FR"));
});
test("Codice Fiscale checks its control character without claiming real identity verification", () => {
  assert.deepEqual(tools.validateCodiceFiscale("RSSMRA85T10A562S"), { valid:true, level:"checksum" });
  assert.equal(tools.validateCodiceFiscale("RSSMRA85T10A562A").valid, false);
  assert.equal(tools.validateCodiceFiscale("invalid").valid, false);
});

test("Italian VAT validates its modulo-10 control digit and rejects malformed identifiers", () => {
  assert.deepEqual(tools.validateItalianVat("01114601006"), { valid:true, level:"checksum" });
  assert.equal(tools.validateItalianVat("01114601007").valid, false);
  assert.equal(tools.validateItalianVat("123").level, "format");
});

test("new country phone formats normalize local and international numbers without lookup", () => {
  assert.equal(tools.formatPhone("taiwan-phone-number-formatter", "0912345678"), "+886 0912 345 678");
  assert.equal(tools.formatPhone("india-phone-number-formatter", "+91 9876543210"), "+91 98765 43210");
  assert.equal(tools.formatPhone("us-phone-number-formatter", "2125550123"), "+1 (212) 555-0123");
  assert.throws(() => tools.formatPhone("us-phone-number-formatter", "1125550123"));
});

test("postal formatters normalize valid ZIP, Canadian, UK, Brazilian, and Australian patterns", () => {
  assert.equal(tools.formatUsZip("123456789"), "12345-6789");
  assert.equal(tools.formatCanadaPostalCode("k1a0b1"), "K1A 0B1");
  assert.equal(tools.formatUkPostcode("sw1a1aa"), "SW1A 1AA");
  assert.equal(tools.formatUkPostcode("GIR 0AA"), "GIR 0AA");
  assert.equal(tools.formatBrazilCep("01001000"), "01001-000");
  assert.deepEqual(tools.validateAustraliaPostcode("2000"), { valid:true, level:"format" });
  assert.throws(() => tools.formatCanadaPostalCode("D1A 0B1"));
  assert.throws(() => tools.formatUkPostcode("ABCDE"));
  assert.throws(() => tools.formatUsZip("1234"));
});

test("localized dates round trip with leap-day validation and explicit US or UK order", () => {
  assert.equal(tools.convertLocalizedDate("2024-02-29", "ES"), "29/02/2024");
  assert.equal(tools.convertLocalizedDate("29/02/2024", "NL", "to-iso"), "2024-02-29");
  assert.equal(tools.convertLocalizedDate("31/12/2026", "IT", "to-iso"), "2026-12-31");
  assert.equal(tools.convertLocalizedDate("2026-03-04", "US"), "03/04/2026");
  assert.equal(tools.convertLocalizedDate("2026-03-04", "UK"), "04/03/2026");
  assert.equal(tools.convertLocalizedDate("03/04/2026", "US", "to-iso"), "2026-03-04");
  assert.equal(tools.convertLocalizedDate("03/04/2026", "UK", "to-iso"), "2026-04-03");
  assert.throws(() => tools.convertLocalizedDate("2025-02-29", "ES"));
  assert.throws(() => tools.convertLocalizedDate("31/04/2026", "IT", "to-iso"));
});
