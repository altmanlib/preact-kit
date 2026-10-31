import { effect, signal } from "@preact/signals";

export type Theme = "system" | "light" | "dark";

const STORAGE_KEY = "preact-kit:theme";
const ORDER: Theme[] = ["system", "light", "dark"];

function isTheme(value: string | null): value is Theme {
  return value === "system" || value === "light" || value === "dark";
}

const stored = localStorage.getItem(STORAGE_KEY);

export const theme = signal<Theme>(isTheme(stored) ? stored : "system");

/** Keeps `<html data-theme>` and storage in step with the signal; `system` removes the attribute so the OS decides. */
export function applyTheme(): void {
  effect(() => {
    const root = document.documentElement;
    if (theme.value === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme.value);
    localStorage.setItem(STORAGE_KEY, theme.value);
  });
}

export function cycleTheme(): void {
  theme.value = ORDER[(ORDER.indexOf(theme.value) + 1) % ORDER.length] ?? "system";
}
