import { expect, test } from "bun:test";

import { formatTime } from "./format.ts";

test("formatTime prints local time with zero padding", () => {
  expect(formatTime(new Date(2026, 0, 2, 3, 4, 5).getTime())).toBe("2026-01-02 03:04:05");
});
