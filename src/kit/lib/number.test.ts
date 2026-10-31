import { expect, test } from "bun:test";

import { normalizeNumber, parseNumber, stepNumber } from "./number.ts";

test("parseNumber accepts plain decimals and nothing else", () => {
  expect(parseNumber("12")).toBe(12);
  expect(parseNumber(" -3.5 ")).toBe(-3.5);
  expect(parseNumber(".5")).toBe(0.5);
  expect(parseNumber("")).toBeUndefined();
  expect(parseNumber("1e3")).toBeUndefined();
  expect(parseNumber("1,000")).toBeUndefined();
  expect(parseNumber("abc")).toBeUndefined();
});

test("stepNumber moves by the step and rounds away float noise", () => {
  expect(stepNumber({ text: "5", direction: 1 })).toBe("6");
  expect(stepNumber({ text: "5", direction: -1, step: 2 })).toBe("3");
  expect(stepNumber({ text: "0.1", direction: 1, step: 0.2 })).toBe("0.3");
  expect(stepNumber({ text: "0.3", direction: -1, step: 0.1 })).toBe("0.2");
});

test("stepNumber stays within the limits", () => {
  expect(stepNumber({ text: "10", direction: 1, max: 10 })).toBe("10");
  expect(stepNumber({ text: "0", direction: -1, min: 0 })).toBe("0");
  expect(stepNumber({ text: "99", direction: 1, step: 5, max: 100 })).toBe("100");
});

test("stepNumber from empty or unreadable text lands on the start value", () => {
  expect(stepNumber({ text: "", direction: 1 })).toBe("0");
  expect(stepNumber({ text: "", direction: -1, min: 3 })).toBe("3");
  expect(stepNumber({ text: "abc", direction: 1, min: 1, max: 9 })).toBe("1");
});

test("normalizeNumber clamps and tidies a readable number and leaves the rest", () => {
  expect(normalizeNumber("007", {})).toBe("7");
  expect(normalizeNumber("150", { max: 100 })).toBe("100");
  expect(normalizeNumber("-5", { min: 0 })).toBe("0");
  expect(normalizeNumber("", { min: 0 })).toBe("");
  expect(normalizeNumber("abc", { min: 0 })).toBe("abc");
});
