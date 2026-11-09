import "./chips.css";

import { type Bound, bound } from "../../../lib/signals.ts";

type ChipsOwn<T extends string> = { options: { value: T | undefined; label: string }[]; title?: string };

/** The props of `Chips`: the own props, then either a `field` signal or `value` with `onChange` (never both); the value is `undefined` for all. */
export type ChipsProps<T extends string> = ChipsOwn<T> & Bound<T | undefined>;

/** Filter chips: one selected value, or `undefined` for all. With a `title` the group is named and shows it as a prefix. */
export function Chips<T extends string>(props: ChipsProps<T>) {
  const { value, set: onChange, rest } = bound<T | undefined, ChipsOwn<T>>(props);
  const { options, title } = rest;
  const chips = (
    <div class="chips" role="group" aria-label={title}>
      {options.map((option) => (
        <button
          key={option.label}
          type="button"
          class={`chip${option.value === value ? " chip-on" : ""}`}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
  if (title === undefined) return chips;
  return (
    <div class="chips-titled">
      <span class="chips-title" aria-hidden="true">
        {title}
      </span>
      {chips}
    </div>
  );
}
