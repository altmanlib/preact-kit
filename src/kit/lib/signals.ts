import { type Signal, signal, useSignal } from "@preact/signals";
import { useMemo } from "preact/hooks";

/** An event handler that sets `field` to `value`: `onClick={set(shown, true)}`. */
export function set<T>(field: Signal<T>, value: T) {
  return () => {
    field.value = value;
  };
}

/** One signal per key, created once; the keys are the field names and the initial values are the strings they start with. */
export function useFields<K extends string>(initial: Record<K, string>): Record<K, Signal<string>> {
  // The initial values are read once on purpose: later renders keep what the user has typed.
  // biome-ignore lint/correctness/useExhaustiveDependencies: see above
  return useMemo(() => Object.fromEntries(Object.entries<string>(initial).map(([key, value]) => [key, signal(value)])) as Record<K, Signal<string>>, []);
}

/** Whether something (a drawer, a dialog) is open, and what it was opened for: `open(target)` shows it, `close()` hides it. */
export function useOpen<T = true>() {
  const target = useSignal<T | undefined>(undefined);
  return {
    target: target.value,
    isOpen: target.value !== undefined,
    open: (value: T = true as T) => {
      target.value = value;
    },
    close: () => {
      target.value = undefined;
    },
  };
}
