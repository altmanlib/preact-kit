import { expect, test } from "bun:test";

import { nextIndex } from "./roving.ts";

const base = { count: 4, orientation: "horizontal" as const };

test("arrow keys of the orientation step and wrap around", () => {
  expect(nextIndex({ ...base, current: 1, key: "ArrowRight" })).toBe(2);
  expect(nextIndex({ ...base, current: 3, key: "ArrowRight" })).toBe(0);
  expect(nextIndex({ ...base, current: 0, key: "ArrowLeft" })).toBe(3);
  expect(nextIndex({ ...base, current: 1, key: "ArrowDown" })).toBeUndefined();
  expect(nextIndex({ count: 4, orientation: "vertical", current: 1, key: "ArrowDown" })).toBe(2);
});

test("Home and End jump to the ends", () => {
  expect(nextIndex({ ...base, current: 2, key: "Home" })).toBe(0);
  expect(nextIndex({ ...base, current: 1, key: "End" })).toBe(3);
});

test("disabled items are skipped, including at the ends", () => {
  const isDisabled = (index: number) => index === 0 || index === 2;
  expect(nextIndex({ ...base, current: 1, key: "ArrowRight", isDisabled })).toBe(3);
  expect(nextIndex({ ...base, current: 3, key: "ArrowRight", isDisabled })).toBe(1);
  expect(nextIndex({ ...base, current: 2, key: "Home", isDisabled })).toBe(1);
});

test("other keys, an empty list and an all-disabled list give nothing", () => {
  expect(nextIndex({ ...base, current: 0, key: "a" })).toBeUndefined();
  expect(nextIndex({ ...base, count: 0, current: 0, key: "ArrowRight" })).toBeUndefined();
  expect(nextIndex({ ...base, current: 0, key: "ArrowRight", isDisabled: () => true })).toBeUndefined();
});
