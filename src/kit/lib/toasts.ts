import { signal } from "@preact/signals";

export type ToastTone = "info" | "ok" | "warn" | "bad";

export type ToastItem = {
  id: number;
  message: string;
  tone: ToastTone;
  /** Milliseconds before it leaves by itself; 0 keeps it until dismissed. */ duration: number;
  /** Set by `dismissToast`: the toast is playing its exit and the `Toaster` removes it when that ends. */
  leaving?: boolean;
};

/** The most toasts on screen at once; a new one beyond it pushes the oldest out. */
export const MAX_TOASTS = 5;
export const DEFAULT_DURATION_MS = 5000;

export const toasts = signal<ToastItem[]>([]);

let lastId = 0;

/** Show a toast from anywhere (a click handler, a mutation callback); a `Toaster` must be mounted once to draw it. Returns its id. */
export function showToast(input: { message: string; tone?: ToastTone; duration?: number }): number {
  lastId += 1;
  const item: ToastItem = { id: lastId, message: input.message, tone: input.tone ?? "info", duration: input.duration ?? DEFAULT_DURATION_MS };
  toasts.value = [...toasts.value, item].slice(-MAX_TOASTS);
  return item.id;
}

/** Start a toast's exit; the `Toaster` calls `removeToast` once it has played. Does nothing for an unknown or already leaving toast. */
export function dismissToast(id: number): void {
  if (!toasts.value.some((item) => item.id === id && !item.leaving)) return;
  toasts.value = toasts.value.map((item) => (item.id === id ? { ...item, leaving: true } : item));
}

/** Take a toast off the list at once, without an exit. */
export function removeToast(id: number): void {
  toasts.value = toasts.value.filter((item) => item.id !== id);
}

export function clearToasts(): void {
  toasts.value = [];
}
