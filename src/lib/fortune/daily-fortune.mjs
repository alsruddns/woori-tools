/** Stable daily selections; intentionally deterministic, not cryptographic. */
export function fortuneSeed(birthDate, date) {
  const value = `${birthDate}|${date}`;
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function fortuneIndices(birthDate, date, lengths) {
  let state = fortuneSeed(birthDate, date) || 0x9e3779b9;
  return lengths.map((length) => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return length > 0 ? state % length : 0;
  });
}
