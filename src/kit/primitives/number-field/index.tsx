import "../field/field.css";
import "./number-field.css";

import type { Signal } from "@preact/signals";
import { Minus, Plus } from "lucide-preact";
import type { ComponentProps } from "preact";
import { useId } from "preact/hooks";

import { normalizeNumber, parseNumber, stepNumber } from "../../lib/number.ts";
import { kitText } from "../../texts.ts";
import { IconButton } from "../icon-button/index.tsx";

/**
 * A labelled number input that follows `field` (the text, so an empty or half-typed value can be held) with − and + steppers.
 * ArrowUp and ArrowDown step too; leaving the field pulls a readable number into `min`/`max`. Read the number with
 * `parseNumber(field.value)`; unreadable text is for the caller to report through `error`.
 */
export function NumberField({
  label,
  hint,
  error,
  field,
  min,
  max,
  step = 1,
  disabled = false,
  ...input
}: {
  label: string;
  hint?: string;
  error?: string;
  field: Signal<string>;
  min?: number;
  max?: number;
  step?: number;
} & Omit<ComponentProps<"input">, "value" | "onInput" | "type" | "min" | "max" | "step" | "label">) {
  const labelId = useId();
  const current = parseNumber(field.value);
  const stepBy = (direction: 1 | -1) => {
    field.value = stepNumber({ text: field.value, direction, step, min, max });
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
          value={field.value}
          onInput={(event) => (field.value = event.currentTarget.value)}
          onBlur={() => (field.value = normalizeNumber(field.value, { min, max }))}
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
      {hint ? <small>{hint}</small> : null}
      {error ? <small class="field-bad">{error}</small> : null}
    </div>
  );
}
