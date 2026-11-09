import { afterEach, expect, test } from "bun:test";

import { clearToasts, dismissToast, showToast, toaster, toneOf } from "./toasts.ts";

afterEach(clearToasts);

test("showToast adds a toast with the tone as its Zag type and returns its id", () => {
  const id = showToast({ message: "Saved", tone: "ok" });
  expect(toaster.getVisibleToasts().map((item) => [item.id, item.title, item.type])).toEqual([[id, "Saved", "success"]]);
});

test("toneOf maps a type back to its tone and falls back to info", () => {
  expect(toneOf("error")).toBe("bad");
  expect(toneOf("warning")).toBe("warn");
  expect(toneOf(undefined)).toBe("info");
});

test("duration 0 keeps a toast until it is dismissed", () => {
  showToast({ message: "sticky", duration: 0 });
  showToast({ message: "timed", duration: 1234 });
  expect(toaster.getVisibleToasts().map((item) => item.duration)).toHaveLength(2);
  expect(toaster.getVisibleToasts().map((item) => item.duration)).toContain(Number.POSITIVE_INFINITY);
  expect(toaster.getVisibleToasts().map((item) => item.duration)).toContain(1234);
});

test("clearToasts removes every toast", () => {
  showToast({ message: "a" });
  showToast({ message: "b" });
  clearToasts();
  expect(toaster.getVisibleToasts()).toEqual([]);
});

test("dismissToast ignores an unknown id", () => {
  showToast({ message: "a" });
  dismissToast("nope");
  expect(toaster.getVisibleToasts()).toHaveLength(1);
});
