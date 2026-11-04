import { afterEach, expect, test } from "bun:test";

import { applyTheme, DEFAULT_THEME_KEY, loadTheme, parseTheme, saveTheme, theme, themeAttribute, type ThemeRoot, type ThemeStorage } from "./theme.ts";

afterEach(() => {
  theme.value = "system";
});

const memoryStorage = (initial: Record<string, string> = {}): ThemeStorage & { data: Record<string, string> } => {
  const data = { ...initial };
  return { data, getItem: (key) => data[key] ?? null, setItem: (key, value) => void (data[key] = value) };
};

const fakeRoot = (): ThemeRoot & { attributes: Record<string, string> } => {
  const attributes: Record<string, string> = {};
  return {
    attributes,
    setAttribute: (name, value) => void (attributes[name] = value),
    removeAttribute: (name) => void delete attributes[name],
  };
};

const brokenStorage: ThemeStorage = {
  getItem: () => {
    throw new Error("denied");
  },
  setItem: () => {
    throw new Error("denied");
  },
};

test("parseTheme accepts the three themes and falls back to system", () => {
  expect(["system", "light", "dark"].map(parseTheme)).toEqual(["system", "light", "dark"]);
  expect([parseTheme("sepia"), parseTheme(""), parseTheme(null), parseTheme(undefined)]).toEqual(["system", "system", "system", "system"]);
});

test("themeAttribute is absent for system", () => {
  expect([themeAttribute("system"), themeAttribute("light"), themeAttribute("dark")]).toEqual([undefined, "light", "dark"]);
});

test("loadTheme and saveTheme survive missing and throwing storage", () => {
  const storage = memoryStorage({ k: "dark", bad: "x" });
  expect(loadTheme(storage, "k")).toBe("dark");
  expect(loadTheme(storage, "bad")).toBe("system");
  expect(loadTheme(storage, "none")).toBe("system");
  expect(loadTheme(undefined, "k")).toBe("system");
  expect(loadTheme(brokenStorage, "k")).toBe("system");
  saveTheme(storage, "k", "light");
  expect(storage.data.k).toBe("light");
  expect(() => saveTheme(brokenStorage, "k", "light")).not.toThrow();
  expect(() => saveTheme(undefined, "k", "light")).not.toThrow();
});

test("applyTheme loads the stored choice, applies it and does not write it back", () => {
  const storage = memoryStorage({ [DEFAULT_THEME_KEY]: "dark" });
  const root = fakeRoot();
  const stop = applyTheme({ storage, root });
  expect(theme.value).toBe("dark");
  expect(root.attributes["data-theme"]).toBe("dark");
  stop();
});

test("applyTheme follows the signal: attribute set for light and dark, removed for system, choice stored", () => {
  const storage = memoryStorage();
  const root = fakeRoot();
  const stop = applyTheme({ storage, root });
  expect(root.attributes["data-theme"]).toBeUndefined();
  expect(storage.data).toEqual({});
  theme.value = "light";
  expect(root.attributes["data-theme"]).toBe("light");
  expect(storage.data[DEFAULT_THEME_KEY]).toBe("light");
  theme.value = "system";
  expect(root.attributes["data-theme"]).toBeUndefined();
  expect(storage.data[DEFAULT_THEME_KEY]).toBe("system");
  stop();
});

test("applyTheme uses the injected storage key and stops when told to", () => {
  const storage = memoryStorage({ "my-app:theme": "light" });
  const root = fakeRoot();
  const stop = applyTheme({ storage, root, storageKey: "my-app:theme" });
  expect(theme.value).toBe("light");
  theme.value = "dark";
  expect(storage.data["my-app:theme"]).toBe("dark");
  expect(storage.data[DEFAULT_THEME_KEY]).toBeUndefined();
  stop();
  theme.value = "light";
  expect(root.attributes["data-theme"]).toBe("dark");
  expect(storage.data["my-app:theme"]).toBe("dark");
});

test("applyTheme works without storage or a page", () => {
  const stop = applyTheme({ storage: null, root: null });
  theme.value = "dark";
  expect(theme.value).toBe("dark");
  stop();
  const withBroken = applyTheme({ storage: brokenStorage, root: fakeRoot() });
  expect(() => {
    theme.value = "light";
  }).not.toThrow();
  withBroken();
});
