import assert from "node:assert/strict";
import test from "node:test";
import { calculateFourPillars } from "manseryeok";

test("solar and lunar input for the published 1992 example produce the same chart", () => {
  const solar = calculateFourPillars({ year: 1992, month: 10, day: 24, hour: 5, minute: 30 });
  const lunar = calculateFourPillars({ year: 1992, month: 9, day: 29, hour: 5, minute: 30, isLunar: true, isLeapMonth: false });
  assert.deepEqual(solar.toObject(), { year: "임신", month: "경술", day: "계유", hour: "을묘" });
  assert.deepEqual(lunar.toObject(), solar.toObject());
});

test("year and month pillars change at the published 2024 Ipchun instant", () => {
  const before = calculateFourPillars({ year: 2024, month: 2, day: 4, hour: 17, minute: 26 });
  const after = calculateFourPillars({ year: 2024, month: 2, day: 4, hour: 17, minute: 27 });
  assert.equal(before.yearString, "계묘");
  assert.equal(before.monthString, "을축");
  assert.equal(after.yearString, "갑진");
  assert.equal(after.monthString, "병인");
});

test("element pairs expose the stem and branch count for all four pillars", () => {
  const chart = calculateFourPillars({ year: 1992, month: 10, day: 24, hour: 5, minute: 30 });
  const pairs = [chart.yearElement, chart.monthElement, chart.dayElement, chart.hourElement];
  assert.equal(pairs.flatMap(({ stem, branch }) => [stem, branch]).length, 8);
  assert.ok(pairs.every(({ stem, branch }) => stem && branch));
});
