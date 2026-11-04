import "./switch.css";

import { type Bound, bound } from "../../lib/signals.ts";

/** The props of `Switch`: either a `field` signal or `value` with `onValue` (never both). */
export type SwitchProps = { label: string; hint?: string; name?: string; disabled?: boolean } & Bound<boolean>;

/**
 * An on/off switch with an optional hint beneath; it follows a signal or is plain controlled with `value` and `onValue`.
 * Use it for a setting that applies at once; use CheckField for a choice that is submitted.
 */
export function Switch(props: SwitchProps) {
  const { value, set, rest } = bound<boolean, { label: string; hint?: string; name?: string; disabled?: boolean }>(props);
  const { label, hint, name, disabled = false } = rest;
  return (
    <div class="field">
      <label class={disabled ? "switch switch-disabled" : "switch"}>
        <input
          class="switch-input"
          type="checkbox"
          role="switch"
          name={name}
          checked={value}
          disabled={disabled}
          onChange={(event) => {
            set(event.currentTarget.checked);
          }}
        />
        <span class="switch-track" aria-hidden="true">
          <span class="switch-thumb" />
        </span>
        <span class="switch-label">{label}</span>
      </label>
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}
