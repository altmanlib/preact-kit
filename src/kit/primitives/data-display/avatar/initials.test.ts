import { expect, test } from "bun:test";

import { initials } from "./initials.ts";

test("two words give two letters, upper-cased", () => {
  expect(initials("Ada Lovelace")).toBe("AL");
  expect(initials("grace brewster hopper")).toBe("GB");
});

test("one word gives its first character, including a wide one", () => {
  expect(initials("Ada")).toBe("A");
  expect(initials("珂珂")).toBe("珂");
  expect(initials("😀 Smile")).toBe("😀S");
});

test("blank names give nothing", () => {
  expect(initials("")).toBe("");
  expect(initials("   ")).toBe("");
});
