import "./field.css";

import type { Signal } from "@preact/signals";
import type { ComponentChildren, ComponentProps } from "preact";

/** A labelled form control with an optional hint and an optional error line beneath it. Put native controls inside with `class="input"`. */
export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ComponentChildren }) {
  return (
    <label class="field">
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
      {error ? <small class="field-bad">{error}</small> : null}
    </label>
  );
}

type FieldFrame = { label: string; hint?: string; error?: string };

const joinClass = (...names: (string | undefined)[]) => names.filter(Boolean).join(" ");

/** A labelled text input that follows `field`; everything else (`type`, `name`, `maxLength`, …) goes to the input as it is. */
export function TextField({ label, hint, error, field, class: className, ...input }: FieldFrame & { field: Signal<string> } & ComponentProps<"input">) {
  return (
    <Field label={label} hint={hint} error={error}>
      <input
        {...input}
        class={joinClass("input", className as string | undefined)}
        value={field.value}
        onInput={(event) => (field.value = event.currentTarget.value)}
      />
    </Field>
  );
}

/** `TextField` for several lines. */
export function TextAreaField({
  label,
  hint,
  error,
  field,
  class: className,
  ...input
}: FieldFrame & { field: Signal<string> } & Omit<ComponentProps<"textarea">, "value" | "onInput">) {
  return (
    <Field label={label} hint={hint} error={error}>
      <textarea
        {...input}
        class={joinClass("input", className as string | undefined)}
        value={field.value}
        onInput={(event) => (field.value = event.currentTarget.value)}
      />
    </Field>
  );
}

/** A checkbox that follows a signal, with an optional hint beneath. */
export function CheckField({ label, hint, field, name }: { label: string; hint?: string; field: Signal<boolean>; name?: string }) {
  return (
    <div class="field">
      <label class="check">
        <input
          type="checkbox"
          name={name}
          checked={field.value}
          onChange={(event) => {
            field.value = event.currentTarget.checked;
          }}
        />
        {label}
      </label>
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}
