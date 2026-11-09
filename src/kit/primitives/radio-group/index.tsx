import "./radio-group.css";

import { useId } from "preact/hooks";

import { type Bound, bound } from "../../lib/signals.ts";

export type RadioOption = { value: string; label: string; hint?: string; disabled?: boolean };

type RadioGroupOwn = {
  label: string;
  hint?: string;
  error?: string;
  options: RadioOption[];
  name?: string;
  disabled?: boolean;
};

/** The props of `RadioGroup`: the own props, then either a `field` signal or `value` with `onChange` (never both). */
export type RadioGroupProps = RadioGroupOwn & Bound<string | undefined>;

/**
 * A labelled group of radio buttons for choosing one of a few options that should all stay visible (use Select for a
 * longer list). The browser's own arrow-key behaviour applies within the group. With `name` the value goes with a form.
 */
export function RadioGroup(props: RadioGroupProps) {
  const { value, set, rest } = bound<string | undefined, RadioGroupOwn>(props);
  const { label, hint, error, options, name, disabled = false } = rest;
  const fallbackName = useId();
  return (
    <fieldset class="choices" disabled={disabled} aria-invalid={error ? true : undefined}>
      <legend class="choices-label">{label}</legend>
      {options.map((option) => (
        <label key={option.value} class={option.disabled ? "choice choice-disabled" : "choice"}>
          <input
            type="radio"
            name={name ?? fallbackName}
            value={option.value}
            checked={option.value === value}
            disabled={option.disabled}
            onChange={() => set(option.value)}
          />
          <span class="choice-text">
            {option.label}
            {option.hint ? <small>{option.hint}</small> : null}
          </span>
        </label>
      ))}
      {hint ? <small class="choices-hint">{hint}</small> : null}
      {error ? <small class="choices-hint field-bad">{error}</small> : null}
    </fieldset>
  );
}
