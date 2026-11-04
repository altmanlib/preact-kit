import { effect, signal } from "@preact/signals";

/** `system` follows the OS; `light` and `dark` force a side. */
export type Theme = "system" | "light" | "dark";

export const THEMES: readonly Theme[] = ["system", "light", "dark"];

/** The default storage key; an app that shares its origin with other code can pass its own to `applyTheme`. */
export const DEFAULT_THEME_KEY = "preact-kit:theme";

/** The part of `Storage` the theme needs, so tests and non-browser hosts can pass their own. */
export type ThemeStorage = Pick<Storage, "getItem" | "setItem">;

/** The part of an element the theme writes to (`<html>`). */
export type ThemeRoot = Pick<Element, "setAttribute" | "removeAttribute">;

/** The chosen theme. Starts as `system`; `applyTheme` loads the stored choice into it and keeps the page and storage in step with it. */
export const theme = signal<Theme>("system");

/** `value` when it names a theme, otherwise `system`. */
export function parseTheme(value: string | null | undefined): Theme {
  return THEMES.find((item) => item === value) ?? "system";
}

/** The `data-theme` value for a theme: `undefined` for `system`, so the attribute is removed and the OS decides. */
export function themeAttribute(value: Theme): "light" | "dark" | undefined {
  return value === "system" ? undefined : value;
}

/** The stored theme, or `system` when nothing usable is stored, there is no storage, or reading it throws. */
export function loadTheme(storage: ThemeStorage | undefined, key: string): Theme {
  try {
    return parseTheme(storage?.getItem(key));
  } catch {
    return "system";
  }
}

/** Stores the theme; a storage that refuses (private mode, quota, disabled) is ignored, since the choice then just lasts for the session. */
export function saveTheme(storage: ThemeStorage | undefined, key: string, value: Theme): void {
  try {
    storage?.setItem(key, value);
  } catch {
    // Nothing to do: the theme still applies for this page.
  }
}

/** Sets or removes `data-theme` on `root`. */
export function writeThemeAttribute(root: ThemeRoot, value: Theme): void {
  const attribute = themeAttribute(value);
  if (attribute) root.setAttribute("data-theme", attribute);
  else root.removeAttribute("data-theme");
}

/** `localStorage` when the host has one and allows touching it (reading the property itself can throw), otherwise `undefined`. */
function browserStorage(): ThemeStorage | undefined {
  try {
    return globalThis.localStorage ?? undefined;
  } catch {
    return undefined;
  }
}

export type ApplyThemeOptions = {
  /** Where the choice is stored; default `DEFAULT_THEME_KEY`. */
  storageKey?: string;
  /** Replace `localStorage`; `null` stores nothing. */
  storage?: ThemeStorage | null;
  /** Replace `<html>`; `null` touches no element (e.g. on the server). */
  root?: ThemeRoot | null;
};

/**
 * Call once at startup, before rendering: loads the stored theme into `theme`, then keeps `<html data-theme>` (removed
 * for `system`) and storage in step with it. Without `localStorage` or `document` (server rendering, a locked-down
 * browser) the theme still works, it just is not stored or not written to the page. Returns a function that stops it.
 */
export function applyTheme(options: ApplyThemeOptions = {}): () => void {
  const key = options.storageKey ?? DEFAULT_THEME_KEY;
  const storage = options.storage === undefined ? browserStorage() : (options.storage ?? undefined);
  const root = options.root === undefined ? globalThis.document?.documentElement : (options.root ?? undefined);
  let saved = loadTheme(storage, key);
  theme.value = saved;
  return effect(() => {
    const value = theme.value;
    if (root) writeThemeAttribute(root, value);
    if (value === saved) return;
    saved = value;
    saveTheme(storage, key, value);
  });
}
