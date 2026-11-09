import { expect, test } from "bun:test";

import { renderDemos } from "./gen-demos.ts";

test("renderDemos imports every demo in sorted order and lists them", () => {
  const out = renderDemos(["kit/primitives/selection/select/select.demo.tsx", "kit/primitives/actions/button/button.demo.tsx"]);
  expect(out).toContain('import demo0 from "../kit/primitives/actions/button/button.demo.tsx";');
  expect(out).toContain('import demo1 from "../kit/primitives/selection/select/select.demo.tsx";');
  expect(out).toContain("export const demos: Demo[] = [demo0, demo1];");
});

test("renderDemos with no demos exports an empty list", () => {
  expect(renderDemos([])).toContain("export const demos: Demo[] = [];");
});
