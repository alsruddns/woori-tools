/** Browser-only unbiased random helpers backed by Web Crypto. */
export function randomInt(min: number, max: number): number {
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min > max) throw new Error("Enter a valid integer range.");
  const range = max - min + 1;
  if (range < 1 || range > 0x1_0000_0000) throw new Error("The range is too large.");
  const limit = Math.floor(0x1_0000_0000 / range) * range;
  const value = new Uint32Array(1);
  do crypto.getRandomValues(value); while (value[0] >= limit);
  return min + (value[0] % range);
}

export function secureShuffle<T>(items: readonly T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function pickUnique<T>(items: readonly T[], count: number): T[] {
  if (!Number.isInteger(count) || count < 0 || count > items.length) throw new Error("Pick count must fit the available items.");
  return secureShuffle(items).slice(0, count);
}

export function pickUniqueRange(min: number, max: number, count: number): number[] {
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min > max || !Number.isInteger(count) || count < 0 || count > max - min + 1) throw new Error("Pick count must fit the number range.");
  const chosen = new Set<number>();
  while (chosen.size < count) chosen.add(randomInt(min, max));
  return [...chosen];
}
