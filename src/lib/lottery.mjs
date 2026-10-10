function randomInt(min, max) {
  const range = max - min + 1;
  const limit = Math.floor(0x1_0000_0000 / range) * range;
  const value = new Uint32Array(1);
  do crypto.getRandomValues(value); while (value[0] >= limit);
  return min + (value[0] % range);
}

function pickUniqueRange(min, max, count) {
  if (!Number.isInteger(min) || !Number.isInteger(max) || min > max || !Number.isInteger(count) || count < 0 || count > max - min + 1) {
    throw new Error("Pick count must fit the number range.");
  }
  const chosen = new Set();
  while (chosen.size < count) chosen.add(randomInt(min, max));
  return [...chosen].sort((a, b) => a - b);
}

export const lotteryRules = {
  lotto: { mainMin: 1, mainMax: 45, mainCount: 6 },
  powerball: { mainMin: 1, mainMax: 69, mainCount: 5, specialMin: 1, specialMax: 26 },
  megaMillions: { mainMin: 1, mainMax: 70, mainCount: 5, specialMin: 1, specialMax: 24 },
};

export function generateLotteryGame(kind) {
  const rules = lotteryRules[kind];
  if (!rules) throw new Error("Unknown lottery game.");
  const main = pickUniqueRange(rules.mainMin, rules.mainMax, rules.mainCount);
  return rules.specialMin === undefined
    ? { main }
    : { main, special: randomInt(rules.specialMin, rules.specialMax) };
}

export function generateLotteryGames(kind, count = 1) {
  if (!Number.isInteger(count) || count < 1 || count > 5) throw new Error("Choose between one and five games.");
  return Array.from({ length: count }, () => generateLotteryGame(kind));
}
