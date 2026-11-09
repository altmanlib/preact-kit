import * as zag from "@zag-js/toast";

export type ToastTone = "info" | "ok" | "warn" | "bad";

/** The most toasts on screen at once; the rest wait their turn. */
export const MAX_TOASTS = 5;
export const DEFAULT_DURATION_MS = 5000;

/** How long a dismissed toast stays mounted so its exit transition can play; matches `--duration-slide` (320ms). */
const EXIT_MS = 320;

const TYPES: Record<ToastTone, zag.Type> = { info: "info", ok: "success", warn: "warning", bad: "error" };

/** The Zag toast store behind `showToast`; the `Toaster` component draws it. */
export const toaster = zag.createStore({
  placement: "bottom",
  overlap: false,
  gap: 8,
  max: MAX_TOASTS,
  removeDelay: EXIT_MS,
  offsets: "1rem",
});

/** The tone a toast was raised with (its Zag `type` mapped back). */
export function toneOf(type: zag.Type | undefined): ToastTone {
  return (Object.keys(TYPES) as ToastTone[]).find((tone) => TYPES[tone] === type) ?? "info";
}

/** Show a toast from anywhere (a click handler, a mutation callback); a `Toaster` must be mounted once to draw it. `duration: 0` keeps it until dismissed. Returns its id. */
export function showToast(input: { message: string; tone?: ToastTone; duration?: number }): string {
  const duration = input.duration ?? DEFAULT_DURATION_MS;
  return toaster.create({ title: input.message, type: TYPES[input.tone ?? "info"], duration: duration === 0 ? Number.POSITIVE_INFINITY : duration });
}

/** Start a toast's exit; it leaves the list once the exit has played. Does nothing for an unknown toast. */
export function dismissToast(id: string): void {
  toaster.dismiss(id);
}

/** Take every toast off at once, without an exit. */
export function clearToasts(): void {
  toaster.remove();
}
