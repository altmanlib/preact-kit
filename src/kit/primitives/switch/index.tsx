import "./switch.css";

import type { Signal } from "@preact/signals";

/** A on/off switch that follows a signal, with an optional hint beneath. Use it for a setting that applies at once; use CheckField for a choice that is submitted. */
export function Switch({
  label,
  hint,
  field,
  name,
  disabled = false,
}: {
  label: string;
  hint?: string;
  field: Signal<boolean>;
  name?: string;
  disabled?: boolean;
}) {
  return (
    <div class="field">
      <label class={disabled ? "switch switch-disabled" : "switch"}>
        <input
          class="switch-input"
          type="checkbox"
          role="switch"
          name={name}
          checked={field.value}
          disabled={disabled}
          onChange={(event) => {
            field.value = event.currentTarget.checked;
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
