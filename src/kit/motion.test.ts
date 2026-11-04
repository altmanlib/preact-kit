import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

import { Glob } from "bun";

const SRC = new URL("../", import.meta.url).pathname;
const TIME = /(^|[\s,(])-?\d*\.?\d+m?s\b/;
const CURVE = /\b(ease|ease-in|ease-out|ease-in-out|linear|step-start|step-end)\b|cubic-bezier\(|steps\(|linear\(/;

/**
 * The motion declarations in a stylesheet that use a literal time or curve instead of a token. Only `tokens.css`
 * defines them; `motion.css` may collapse durations to 1ms for reduced motion.
 */
export function motionViolations(css: string, file: string): string[] {
  if (file.endsWith("tokens.css")) return [];
  const bare = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const found: string[] = [];
  for (const match of bare.matchAll(/(?<![\w-])((?:transition|animation)(?:-[a-z]+)*)\s*:\s*([^;}]+)/g)) {
    const property = match[1] ?? "";
    const value = match[2] ?? "";
    // Strip var(...) so a token name such as `--ease-linear` is not mistaken for a keyword.
    const literal = value.replace(/var\([^)]*\)/g, " ");
    if (property === "transition-property" || property === "transition-behavior" || property === "animation-name") continue;
    const time = literal.replace(/(^|[\s,])(0s|0ms)\b/g, "$1");
    const reduced = file.endsWith("motion.css") && /\b1ms\b/.test(time);
    if ((TIME.test(time) && !reduced) || CURVE.test(literal.replace(/\b(infinite|both|forwards|backwards|none|allow-discrete)\b/g, " ")))
      found.push(`${file}: ${property}: ${value.trim()}`);
  }
  return found;
}

test("every stylesheet uses motion tokens, not literal times or curves", () => {
  const found = [...new Glob("**/*.css").scanSync(SRC)].sort().flatMap((file) => motionViolations(readFileSync(`${SRC}${file}`, "utf8"), file));
  expect(found).toEqual([]);
});

test("the check rejects what it should and accepts tokens", () => {
  const bad = (css: string) => motionViolations(css, "a.css").length;
  expect(bad(".a { transition: color 0.2s var(--ease-out); }")).toBe(1);
  expect(bad(".a { transition: color var(--duration-fast) ease-out; }")).toBe(1);
  expect(bad(".a { animation: spin var(--duration-spin) linear infinite; }")).toBe(1);
  expect(bad(".a { animation: spin var(--duration-spin) cubic-bezier(0, 0, 1, 1); }")).toBe(1);
  expect(bad(".a { transition-duration: 120ms; }")).toBe(1);
  expect(bad(".a { transition: color var(--duration-fast) var(--ease-out); }")).toBe(0);
  expect(bad(".a { animation: spin var(--duration-spin) var(--ease-linear) infinite; }")).toBe(0);
  expect(bad(".a { transition: opacity var(--duration-fast) var(--ease-in), display var(--duration-fast) allow-discrete; }")).toBe(0);
  expect(bad(".a { background: linear-gradient(90deg, red, blue); }")).toBe(0);
  expect(bad("/* transition: color 1s; */ .a { color: red; }")).toBe(0);
  expect(motionViolations(".a { transition-duration: 1ms !important; }", "kit/motion.css")).toEqual([]);
  expect(motionViolations(".a { transition-duration: 1ms !important; }", "kit/x.css")).toHaveLength(1);
});
