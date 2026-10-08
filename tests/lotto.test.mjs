import assert from "node:assert/strict";
import test from "node:test";
import { generateLottoGames } from "../src/lib/lotto.mjs";

test("generates six unique numbers between 1 and 45", () => {
  const [game] = generateLottoGames();
  assert.equal(game.length, 6);
  assert.equal(new Set(game).size, 6);
  assert.ok(game.every((number) => number >= 1 && number <= 45));
});

test("honors included and excluded numbers and the odd/even ratio", () => {
  const [game] = generateLottoGames({ included: [3, 7], excluded: [2, 4, 6], oddCount: 4 });
  assert.ok(game.includes(3) && game.includes(7));
  assert.ok(game.every((number) => ![2, 4, 6].includes(number)));
  assert.equal(game.filter((number) => number % 2 === 1).length, 4);
});

test("rejects conflicting or impossible settings", () => {
  assert.throws(() => generateLottoGames({ included: [5], excluded: [5] }));
  assert.throws(() => generateLottoGames({ included: [1, 3, 5, 7, 9, 11], oddCount: 0 }));
});

test("creates five distinct games", () => {
  const games = generateLottoGames({ count: 5 });
  assert.equal(games.length, 5);
  assert.equal(new Set(games.map((game) => [...game].sort((a, b) => a - b).join(","))).size, 5);
});
