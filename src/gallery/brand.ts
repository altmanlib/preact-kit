import { effect, signal } from "@preact/signals";

/** A named --ink pair the gallery can apply to <html>. An empty `ink` means the kit default. */
export type BrandPreset = {
  id: string;
  label: string;
  /** A `light-dark(light, dark)` pair, or empty to clear the override. */
  ink: string;
};

/**
 * Presets used only by the gallery Theming page. Each pair is chosen so derived fills and
 * text still meet 4.5:1 on the default surfaces; the hue is free, the contrast is not.
 */
export const BRAND_PRESETS: readonly BrandPreset[] = [
  { id: "default", label: "Default", ink: "" },
  { id: "blue", label: "Blue", ink: "light-dark(#1d4ed8, #8fb0ff)" },
  { id: "green", label: "Green", ink: "light-dark(#0f7a45, #5dce98)" },
  { id: "orange", label: "Orange", ink: "light-dark(#8f3f07, #e39a4a)" },
];

/** The current gallery --ink override. Empty is the kit default. Not written to storage. */
export const brandInk = signal("");

/** Keeps `document.documentElement` (or `root`) in step with `brandInk`. Call once at startup. */
export function applyBrand(root?: HTMLElement | null): () => void {
  const el = root === undefined ? globalThis.document?.documentElement : root;
  return effect(() => {
    if (!el) return;
    const ink = brandInk.value;
    if (ink) el.style.setProperty("--ink", ink);
    else el.style.removeProperty("--ink");
  });
}
