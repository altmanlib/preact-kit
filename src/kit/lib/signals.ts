import { type Signal, signal, useSignal } from "@preact/signals";
import { useMemo } from "preact/hooks";

/**
 * How every value-carrying control of the kit gets its value: either it follows a `field` signal, or it is plain
 * controlled with `value` and `onChange`. Exactly one mode is allowed; the `never` members make a mix a type error.
 * A control that wraps a native element drops that element's own `onChange` from its attributes, so the name is free.
 */
export type Bound<T> = { field: Signal<T>; value?: never; onChange?: never } | { value: T; onChange: (value: T) => void; field?: never };

/**
 * Resolves a control's props to its current `value` and a `set` that writes it, in whichever mode the caller chose, and
 * hands back the remaining props `P` (name it explicitly: `bound<string, Own>(props)`) as `rest`. Call it in render: reading a signal's value there subscribes the component.
 */
export function bound<T, P extends object>(props: Bound<T> & P): { value: T; set: (value: T) => void; rest: P } {
  const { field, value, onChange, ...rest } = props as Bound<T> & Record<string, unknown>;
  if (field) return { value: field.value, set: (next) => (field.value = next), rest: rest as P };
  return { value: value as T, set: onChange as (value: T) => void, rest: rest as P };
}

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
