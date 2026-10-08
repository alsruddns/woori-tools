import assert from "node:assert/strict";
import test from "node:test";
import { divideEvenly, normalizeWheelItems, rollDice } from "../src/lib/random-tools.mjs";

test("normalizes wheel entries and applies duplicate handling", () => {
  assert.deepEqual(normalizeWheelItems(" Pizza \n\nPizza\n Sushi ", { allowDuplicates: false }), ["Pizza", "Sushi"]);
  assert.deepEqual(normalizeWheelItems("A\nA", { allowDuplicates: true }), ["A", "A"]);
  assert.throws(() => normalizeWheelItems(Array.from({ length: 51 }, (_, index) => `item ${index}`).join("\n")));
});

test("assigns every participant exactly once across teams", () => {
  const participants = ["A", "B", "C", "D", "E", "F", "G"];
  const teams = divideEvenly(participants, 3);
  assert.equal(teams.length, 3);
  assert.deepEqual(teams.flat().sort(), [...participants].sort());
  assert.ok(Math.max(...teams.map((team) => team.length)) - Math.min(...teams.map((team) => team.length)) <= 1);
});

test("dice results stay within the selected die and validate the roll count", () => {
  for (const sides of [4, 6, 8, 10, 12, 20]) {
    const result = rollDice(sides, 20);
    assert.equal(result.length, 20);
    assert.ok(result.every((value) => value >= 1 && value <= sides));
  }
  assert.throws(() => rollDice(5, 1));
  assert.throws(() => rollDice(20, 21));
});
