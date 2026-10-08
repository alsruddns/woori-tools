import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import { webcrypto } from "node:crypto";

globalThis.crypto ??= webcrypto;
const deckSource = await readFile(new URL("../src/lib/fortune/tarot-deck.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(deckSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { tarotDeck } = await import("data:text/javascript;base64," + Buffer.from(outputText).toString("base64"));

test("tarot deck contains 22 unique Major Arcana with all four localized readings", () => {
  assert.equal(tarotDeck.length, 22);
  assert.equal(new Set(tarotDeck.map(({ id }) => id)).size, 22);
  for (const card of tarotDeck) {
    for (const locale of ["ko", "en", "ja", "zh"]) {
      assert.ok(card.name[locale]);
      assert.ok(card.upright[locale]);
      assert.ok(card.reversed[locale]);
      assert.ok(card.keywords[locale].length > 0);
    }
  }
});

test("a three-card draw can be unique and every orientation is valid", async () => {
  const randomSource = await readFile(new URL("../src/lib/random.ts", import.meta.url), "utf8");
  const compiled = ts.transpileModule(randomSource, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  const random = await import("data:text/javascript;base64," + Buffer.from(compiled.outputText).toString("base64"));
  const draw = random.pickUnique(tarotDeck, 3).map((card) => ({ card, reversed: crypto.getRandomValues(new Uint32Array(1))[0] % 2 === 1 }));
  assert.equal(new Set(draw.map(({ card }) => card.id)).size, 3);
  assert.ok(draw.every(({ reversed }) => typeof reversed === "boolean"));
});
