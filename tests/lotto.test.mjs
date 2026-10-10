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


import { generateLotteryGame, generateLotteryGames, lotteryRules } from "../src/lib/lottery.mjs";

test("draws valid lottery results for 1,000 repetitions per game", () => {
  for (const kind of ["lotto", "powerball", "megaMillions"]) {
    const rule = lotteryRules[kind];
    for (let index = 0; index < 1000; index++) {
      const { main, special } = generateLotteryGame(kind);
      assert.equal(main.length, rule.mainCount);
      assert.equal(new Set(main).size, rule.mainCount);
      assert.deepEqual(main, [...main].sort((a, b) => a - b));
      assert.ok(main.every((number) => number >= rule.mainMin && number <= rule.mainMax));
      if (rule.specialMin !== undefined) assert.ok(special >= rule.specialMin && special <= rule.specialMax);
      else assert.equal(special, undefined);
    }
  }
});

test("supports one or five American lottery games", () => {
  assert.deepEqual(lotteryRules.powerball, { mainMin: 1, mainMax: 69, mainCount: 5, specialMin: 1, specialMax: 26 });
  assert.deepEqual(lotteryRules.megaMillions, { mainMin: 1, mainMax: 70, mainCount: 5, specialMin: 1, specialMax: 24 });
  assert.deepEqual(lotteryRules.lotto, { mainMin: 1, mainMax: 45, mainCount: 6 });
  assert.equal(generateLotteryGames("powerball").length, 1);
  assert.equal(generateLotteryGames("megaMillions", 5).length, 5);
  assert.throws(() => generateLotteryGames("powerball", 6));
});
