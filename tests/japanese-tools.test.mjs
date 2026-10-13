import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/lib/japanese-tools.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const tools = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

test("Wareki conversion observes actual era boundary dates and first year", () => {
  assert.deepEqual(tools.gregorianToWareki("2019-05-01"), { era: "令和", year: 1, yearLabel: "元年", date: "2019-05-01" });
  assert.equal(tools.gregorianToWareki("1989-01-07").era, "昭和");
  assert.equal(tools.gregorianToWareki("1989-01-08").era, "平成");
  assert.equal(tools.warekiToGregorian("令和", "元", 5, 1), "2019-05-01");
  assert.equal(tools.warekiToGregorian("平成", 1, 1, 8), "1989-01-08");
  assert.throws(() => tools.warekiToGregorian("令和", 1, 4, 30), /invalid-era-date/);
  assert.throws(() => tools.warekiToGregorian("平成", 31, 5, 1), /invalid-era-date/);
  assert.throws(() => tools.gregorianToWareki("2019-02-30"), /invalid-date/);
});

test("Kana conversion preserves punctuation and long marks", () => {
  assert.equal(tools.convertKana("ひらがな・カタカナー", "to-katakana"), "ヒラガナ・カタカナー");
  assert.equal(tools.convertKana("ガッツポーズ！", "to-hiragana"), "がっつぽーず！");
});

test("full-width conversion handles Latin text, numbers, symbols, and voiced half-width kana", () => {
  assert.equal(tools.convertWidth("ＡＢＣ１２３！　", "to-half"), "ABC123! ");
  assert.equal(tools.convertWidth("ｶﾞｯﾂﾎﾟｰｽﾞ", "to-full"), "ガッツポーズ");
  assert.equal(tools.convertWidth("ガッツポーズ", "to-half"), "ｶﾞｯﾂﾎﾟｰｽﾞ");
});

test("romaji conversion handles basic kana, contracted sounds, sokuon, n, and long vowels", () => {
  assert.equal(tools.kanaToRomaji("ひらがな カタカナ"), "hiragana katakana");
  assert.equal(tools.kanaToRomaji("きょう"), "kyou");
  assert.equal(tools.kanaToRomaji("がっこう"), "gakkou");
  assert.equal(tools.kanaToRomaji("しんよう"), "shin'you");
  assert.equal(tools.kanaToRomaji("スーパー"), "suupaa");
  assert.equal(tools.kanaToRomaji("漢字かな"), "漢字kana");
});

test("Japanese number kanji handles zero, place values, large units, signs, and reverse conversion", () => {
  for (const [number, kanji] of [[0,"零"],[10,"十"],[100,"百"],[1000,"千"],[1234,"千二百三十四"],[10000,"一万"],[100000000,"一億"],[1000000000000,"一兆"],[-42,"マイナス四十二"]]) {
    assert.equal(tools.numberToKanji(number), kanji);
    assert.equal(tools.kanjiToNumber(kanji), number);
  }
  assert.throws(() => tools.numberToKanji(1.5), /invalid-number/);
  assert.throws(() => tools.kanjiToNumber("一億円"), /invalid-kanji-number/);
});

test("Yakudoshi uses count-year ages for men and women and marks adjacent years", () => {
  assert.deepEqual(tools.yakudoshi(2000, 2024, "male"), [{ year: 2023, age: 24, phase: "maeyaku" }, { year: 2024, age: 25, phase: "honyaku" }, { year: 2025, age: 26, phase: "atoyaku" }]);
  assert.deepEqual(tools.yakudoshi(2000, 2032, "female"), [{ year: 2031, age: 32, phase: "maeyaku" }, { year: 2032, age: 33, phase: "honyaku" }, { year: 2033, age: 34, phase: "atoyaku" }]);
  assert.deepEqual(tools.yakudoshi(2000, 2023, "male"), [{ year: 2023, age: 24, phase: "maeyaku" }, { year: 2024, age: 25, phase: "honyaku" }]);
});

test("Japanese zodiac matches known years and repeats both 12- and 60-year cycles", () => {
  assert.deepEqual(tools.japaneseZodiac(1984), { branch: "子", stem: "甲", eto: "甲子" });
  assert.deepEqual(tools.japaneseZodiac(2024), { branch: "辰", stem: "甲", eto: "甲辰" });
  assert.equal(tools.japaneseZodiac(2036).branch, tools.japaneseZodiac(2024).branch);
  assert.equal(tools.japaneseZodiac(2044).eto, tools.japaneseZodiac(1984).eto);
});

test("Numbers 3 and 4 preserve fixed digit counts; BINGO5 follows every official cell range", () => {
  assert.ok(tools.generateNumbersGame(3, 10).every((number) => /^\d{3}$/.test(number)));
  assert.ok(tools.generateNumbersGame(4, 10).every((number) => /^\d{4}$/.test(number)));
  assert.throws(() => tools.generateNumbersGame(3, 11), /invalid-count/);
  const card = tools.generateBingo5();
  assert.equal(card.length, 9);
  assert.equal(card[4], null);
  for (let index = 0; index < card.length; index++) {
    const range = tools.BINGO5_RANGES[index];
    if (range) assert.ok(card[index] >= range[0] && card[index] <= range[1]);
  }
});
