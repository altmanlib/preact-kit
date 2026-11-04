import { afterEach, expect, test } from "bun:test";

import { clearToasts, DEFAULT_DURATION_MS, dismissToast, MAX_TOASTS, removeToast, showToast, toasts } from "./toasts.ts";

afterEach(clearToasts);

test("showToast appends a toast with defaults and returns its id", () => {
  const id = showToast({ message: "Saved" });
  expect(toasts.value).toEqual([{ id, message: "Saved", tone: "info", duration: DEFAULT_DURATION_MS }]);
});

test("showToast keeps the tone and duration it is given, and ids never repeat", () => {
  const first = showToast({ message: "a", tone: "bad", duration: 0 });
  const second = showToast({ message: "b" });
  expect(second).toBeGreaterThan(first);
  expect(toasts.value[0]).toMatchObject({ tone: "bad", duration: 0 });
});

test("dismissToast marks only that toast as leaving and keeps it listed", () => {
  const first = showToast({ message: "a" });
  const second = showToast({ message: "b" });
  dismissToast(first);
  expect(toasts.value.map((item) => [item.id, item.leaving])).toEqual([
    [first, true],
    [second, undefined],
  ]);
  const before = toasts.value;
  dismissToast(999);
  dismissToast(first);
  expect(toasts.value).toBe(before);
});

test("removeToast takes only that toast off the list", () => {
  const first = showToast({ message: "a" });
  const second = showToast({ message: "b" });
  removeToast(first);
  expect(toasts.value.map((item) => item.id)).toEqual([second]);
  removeToast(999);
  expect(toasts.value).toHaveLength(1);
});

test("a toast beyond the limit pushes the oldest out", () => {
  const ids = Array.from({ length: MAX_TOASTS + 2 }, (_, index) => showToast({ message: String(index) }));
  expect(toasts.value.map((item) => item.id)).toEqual(ids.slice(-MAX_TOASTS));
});
