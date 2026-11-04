import { expect, test } from "bun:test";

import { signal } from "@preact/signals";

import { type Bound, bound, set } from "./signals.ts";

test("set builds a handler that writes the value into the signal", () => {
  const shown = signal(false);
  const handler = set(shown, true);
  expect(shown.value).toBe(false);
  handler();
  expect(shown.value).toBe(true);
});

test("bound reads and writes through a field signal and passes the other props on", () => {
  const field = signal("a");
  const { value, set, rest } = bound<string, { label: string }>({ field, label: "Name" });
  expect(value).toBe("a");
  expect(rest).toEqual({ label: "Name" });
  set("b");
  expect(field.value).toBe("b");
});

test("bound reads the plain value and writes through onValue", () => {
  const seen: boolean[] = [];
  const { value, set, rest } = bound<boolean, { label: string }>({ value: true, onValue: (next) => seen.push(next), label: "Flag" });
  expect(value).toBe(true);
  expect(rest).toEqual({ label: "Flag" });
  set(false);
  expect(seen).toEqual([false]);
});

test("Bound allows exactly one mode", () => {
  const field = signal("");
  const onValue = () => undefined;
  const _field: Bound<string> = { field };
  const _plain: Bound<string> = { value: "", onValue };
  // @ts-expect-error both modes at once
  const _both: Bound<string> = { field, value: "", onValue };
  // @ts-expect-error a value without a way to change it
  const _half: Bound<string> = { value: "" };
  // @ts-expect-error neither mode
  const _none: Bound<string> = {};
  expect([_field, _plain, _both, _half, _none]).toHaveLength(5);
});
