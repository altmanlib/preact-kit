import { expect, test } from "bun:test";

// route.ts reads `location` at import time, so give it a stand-in before loading.
Object.assign(globalThis, { location: { hash: "" }, window: { addEventListener: () => undefined } });
const { demoPath, parseHash } = await import("./route.ts");

test("demoPath and parseHash round-trip a name", () => {
  expect(parseHash(demoPath("Button"))).toBe("button");
  expect(parseHash(demoPath("Date Picker"))).toBe("date picker");
});

test("parseHash of an empty or bare hash is empty", () => {
  expect(parseHash("")).toBe("");
  expect(parseHash("#/")).toBe("");
});
