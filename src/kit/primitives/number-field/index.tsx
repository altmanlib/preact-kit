import "../field/field.css";
import "./number-field.css";

import { Minus, Plus } from "lucide-preact";
import type { ComponentProps } from "preact";
import { useId } from "preact/hooks";

import { normalizeNumber, parseNumber, stepNumber } from "../../lib/number.ts";
import { type Bound, bound } from "../../lib/signals.ts";
import { kitText } from "../../texts.ts";
import { FieldNotes } from "../field/index.tsx";
import { IconButton } from "../icon-button/index.tsx";

/** The props of `NumberField`: either a `field` signal or `value` with `onValue` (never both); both carry the text, not the number. */
export type NumberFieldProps = NumberFieldOwn & Bound<string>;

type NumberFieldOwn = {
  label: string;
  hint?: string;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
} & Omit<ComponentProps<"input">, "value" | "onInput" | "type" | "min" | "max" | "step" | "label">;

/**
 * A labelled number input that follows `field` (the text, so an empty or half-typed value can be held), or is plain
 * controlled with `value` and `onValue`, with − and + steppers.
 * ArrowUp and ArrowDown step too; leaving the field pulls a readable number into `min`/`max`. Read the number with
 * `parseNumber(text)`; unreadable text is for the caller to report through `error`.
 */
export function NumberField(props: NumberFieldProps) {
  const { value: text, set, rest } = bound<string, NumberFieldOwn>(props);
  const { label, hint, error, min, max, step = 1, disabled = false, ...input } = rest;
  const labelId = useId();
  const current = parseNumber(text);
  const stepBy = (direction: 1 | -1) => {
    set(stepNumber({ text, direction, step, min, max }));
  };

  return (
    <div class="field">
      <span id={labelId}>{label}</span>
      <div class="number-field">
        <IconButton label={kitText.decrease} disabled={disabled || (current !== undefined && min !== undefined && current <= min)} onClick={() => stepBy(-1)}>
          <Minus aria-hidden="true" />
        </IconButton>
        <input
          {...input}
          class="input number-input"
          type="text"
          inputMode="decimal"
          role="spinbutton"
          aria-labelledby={labelId}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={current}
          aria-invalid={error ? true : undefined}
          disabled={disabled}
          value={text}
          onInput={(event) => set(event.currentTarget.value)}
          onBlur={() => set(normalizeNumber(text, { min, max }))}
          onKeyDown={(event) => {
            if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
            event.preventDefault();
            stepBy(event.key === "ArrowUp" ? 1 : -1);
          }}
        />
        <IconButton label={kitText.increase} disabled={disabled || (current !== undefined && max !== undefined && current >= max)} onClick={() => stepBy(1)}>
          <Plus aria-hidden="true" />
        </IconButton>
      </div>
      <FieldNotes hint={hint} error={error} />
    </div>
  );
}
