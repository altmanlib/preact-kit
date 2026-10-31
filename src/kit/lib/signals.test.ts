import { expect, test } from "bun:test";

import { signal } from "@preact/signals";

import { set } from "./signals.ts";

test("set builds a handler that writes the value into the signal", () => {
  const shown = signal(false);
  const handler = set(shown, true);
  expect(shown.value).toBe(false);
  handler();
  expect(shown.value).toBe(true);
});
