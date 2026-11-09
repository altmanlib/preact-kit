import { expect, test } from "bun:test";

import { formatBytes, formatTime } from "./format.ts";

test("formatTime prints local time with zero padding", () => {
  expect(formatTime(new Date(2026, 0, 2, 3, 4, 5).getTime())).toBe("2026-01-02 03:04:05");
});

test("formatBytes switches unit at each power of 1024", () => {
  expect(formatBytes(512)).toBe("512 B");
  expect(formatBytes(1536)).toBe("1.5 KB");
  expect(formatBytes(3.2 * 1024 * 1024)).toBe("3.2 MB");
  expect(formatBytes(2 * 1024 ** 3)).toBe("2.0 GB");
});
