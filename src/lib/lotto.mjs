function randomInt(min, max) {
  const range = max - min + 1;
  const limit = Math.floor(0x1_0000_0000 / range) * range;
  const value = new Uint32Array(1);
  do crypto.getRandomValues(value); while (value[0] >= limit);
  return min + (value[0] % range);
}

function pick(items, count) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index--) {
    const other = randomInt(0, index);
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy.slice(0, count);
}

function choose(n, k) {
  if (k < 0 || k > n) return 0;
  let result = 1;
  for (let i = 1; i <= Math.min(k, n - k); i++) result = result * (n - i + 1) / i;
  return Math.round(result);
}

export function generateLottoGames({ count = 1, included = [], excluded = [], oddCount = null, sorted = true } = {}) {
  if (![1, 5].includes(count)) throw new Error("Choose one or five games.");
  const include = [...new Set(included)];
  const exclude = [...new Set(excluded)];
  if (include.length !== included.length || exclude.length !== excluded.length) throw new Error("Number selections must be unique.");
  if (include.some((number) => !Number.isInteger(number) || number < 1 || number > 45) || exclude.some((number) => !Number.isInteger(number) || number < 1 || number > 45)) throw new Error("Numbers must be between 1 and 45.");
  if (include.length > 6) throw new Error("Choose at most six included numbers.");
  if (include.some((number) => exclude.includes(number))) throw new Error("A number cannot be both included and excluded.");
  if (oddCount !== null && (!Number.isInteger(oddCount) || oddCount < 0 || oddCount > 6)) throw new Error("Choose a valid odd/even ratio.");

  const availableOdd = Array.from({ length: 45 }, (_, index) => index + 1).filter((number) => number % 2 && !exclude.includes(number) && !include.includes(number));
  const availableEven = Array.from({ length: 45 }, (_, index) => index + 1).filter((number) => !(number % 2) && !exclude.includes(number) && !include.includes(number));
  const includedOdd = include.filter((number) => number % 2).length;
  const targetOdd = oddCount ?? null;
  const oddNeeded = targetOdd === null ? undefined : targetOdd - includedOdd;
  if (oddNeeded !== undefined && (oddNeeded < 0 || oddNeeded > availableOdd.length || 6 - targetOdd - (include.length - includedOdd) > availableEven.length)) {
    throw new Error("The included and excluded numbers cannot satisfy this odd/even ratio.");
  }
  const remainingSlots = 6 - include.length;
  const candidateCount = targetOdd === null
    ? choose(availableOdd.length + availableEven.length, remainingSlots)
    : choose(availableOdd.length, oddNeeded) * choose(availableEven.length, remainingSlots - oddNeeded);
  if (candidateCount < count) throw new Error("There are not enough valid number combinations for the requested games.");

  const games = [];
  const seen = new Set();
  for (let attempts = 0; attempts < count * 2000 && games.length < count; attempts++) {
    let picks;
    if (targetOdd === null) {
      picks = pick([...availableOdd, ...availableEven], remainingSlots);
    } else {
      picks = [
        ...pick(availableOdd, oddNeeded),
        ...pick(availableEven, remainingSlots - oddNeeded),
      ];
    }
    const game = [...include, ...picks];
    const key = [...game].sort((a, b) => a - b).join(",");
    if (seen.has(key)) continue;
    seen.add(key);
    games.push(sorted ? [...game].sort((a, b) => a - b) : game);
  }
  if (games.length < count) throw new Error("Could not find enough distinct valid games. Relax the conditions and try again.");
  return games;
}
