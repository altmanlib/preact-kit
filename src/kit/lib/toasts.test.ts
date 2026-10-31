import { afterEach, expect, test } from "bun:test";

import { clearToasts, DEFAULT_DURATION_MS, dismissToast, MAX_TOASTS, showToast, toasts } from "./toasts.ts";

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

test("dismissToast removes only that toast", () => {
  const first = showToast({ message: "a" });
  const second = showToast({ message: "b" });
  dismissToast(first);
  expect(toasts.value.map((item) => item.id)).toEqual([second]);
  dismissToast(999);
  expect(toasts.value).toHaveLength(1);
});

test("a toast beyond the limit pushes the oldest out", () => {
  const ids = Array.from({ length: MAX_TOASTS + 2 }, (_, index) => showToast({ message: String(index) }));
  expect(toasts.value.map((item) => item.id)).toEqual(ids.slice(-MAX_TOASTS));
});
