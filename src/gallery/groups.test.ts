import { expect, test } from "bun:test";

import { demos } from "./demos.gen.ts";
import { groupDemos, GROUPS } from "./groups.ts";

test("every demo is in exactly one sidebar group", () => {
  const grouped = GROUPS.flatMap((group) => group.names);
  expect(demos.map((demo) => demo.name).filter((name) => !grouped.includes(name))).toEqual([]);
  expect(grouped.filter((name, index) => grouped.indexOf(name) !== index)).toEqual([]);
});

test("every grouped name is a real demo", () => {
  const known = demos.map((demo) => demo.name);
  expect(GROUPS.flatMap((group) => group.names).filter((name) => !known.includes(name))).toEqual([]);
});

test("groupDemos sorts each group by name", () => {
  for (const group of groupDemos(demos)) {
    const names = group.demos.map((demo) => demo.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  }
});
