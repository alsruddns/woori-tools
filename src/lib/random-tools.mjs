function randomInt(min, max) {
  const range = max - min + 1;
  const limit = Math.floor(0x1_0000_0000 / range) * range;
  const values = new Uint32Array(1);
  do crypto.getRandomValues(values); while (values[0] >= limit);
  return min + (values[0] % range);
}

export function rollDice(sides, count = 1) {
  if (![4, 6, 8, 10, 12, 20].includes(sides) || !Number.isInteger(count) || count < 1 || count > 20) throw new Error("Choose a supported die and roll between one and twenty dice.");
  return Array.from({ length: count }, () => randomInt(1, sides));
}

export function secureShuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const other = randomInt(0, index);
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

export function normalizeWheelItems(text, { allowDuplicates = true, limit = 50 } = {}) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const items = allowDuplicates ? lines : [...new Set(lines)];
  if (items.length > limit) throw new Error(`A wheel can contain up to ${limit} entries.`);
  return items;
}

export function divideEvenly(participants, teamCount) {
  const names = participants.map((name) => name.trim()).filter(Boolean);
  if (!names.length) throw new Error("Add at least one participant.");
  if (!Number.isInteger(teamCount) || teamCount < 1 || teamCount > names.length) throw new Error("Team count must be between one and the number of participants.");
  const teams = Array.from({ length: teamCount }, () => []);
  secureShuffle(names).forEach((name, index) => teams[index % teamCount].push(name));
  return teams;
}
