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
test("PAN and GSTIN validators report structure without claiming government verification", () => {
  assert.deepEqual(tools.validatePan("ABCPA1234F"), { valid:true, level:"format" });
  assert.deepEqual(tools.validateGstin("27ABCPE1234F1Z5"), { valid:true, level:"format" });
  assert.equal(tools.validateGstin("ABCDE1234F").valid, false);
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
