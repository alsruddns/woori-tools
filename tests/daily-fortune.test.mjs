import assert from "node:assert/strict";
import test from "node:test";
import { fortuneIndices, fortuneSeed } from "../src/lib/fortune/daily-fortune.mjs";

test("a birth date and local calendar date produce stable daily selections", () => {
  const first = fortuneIndices("1990-04-12", "2026-10-08", [6, 5, 6, 5, 5, 6, 6, 5]);
  assert.deepEqual(fortuneIndices("1990-04-12", "2026-10-08", [6, 5, 6, 5, 5, 6, 6, 5]), first);
  assert.ok(first.every((index, i) => index >= 0 && index < [6, 5, 6, 5, 5, 6, 6, 5][i]));
});

test("changing the date changes the deterministic seed", () => {
  assert.notEqual(fortuneSeed("1990-04-12", "2026-10-08"), fortuneSeed("1990-04-12", "2026-10-09"));
});

test("different birth dates are part of the seed", () => {
  assert.notEqual(fortuneSeed("1990-04-12", "2026-10-08"), fortuneSeed("1990-04-13", "2026-10-08"));
});
