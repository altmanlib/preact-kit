import "./field.css";

import type { ComponentChildren, ComponentProps } from "preact";

import { type Bound, bound } from "../../lib/signals.ts";

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

/** The props of `TextField`: the frame, then either a `field` signal or `value` with `onValue` (never both), then the input's own attributes. */
export type TextFieldProps = FieldFrame & ComponentProps<"input"> & Bound<string>;

/**
 * A labelled text input. It follows `field` (a signal), or is plain controlled with `value` and `onValue`; everything
 * else (`type`, `name`, `maxLength`, …) goes to the input as it is; `onInput` is the kit's own.
 */
export function TextField(props: TextFieldProps) {
  const { value, set, rest } = bound<string, FieldFrame & ComponentProps<"input">>(props);
  const { label, hint, error, class: className, ...input } = rest;
  return (
    <Field label={label} hint={hint} error={error}>
      <input {...input} class={joinClass("input", className as string | undefined)} value={value} onInput={(event) => set(event.currentTarget.value)} />
    </Field>
  );
}

/** The props of `TextAreaField`; same two modes as `TextFieldProps`. */
export type TextAreaFieldProps = FieldFrame & ComponentProps<"textarea"> & Bound<string>;

/** `TextField` for several lines. */
export function TextAreaField(props: TextAreaFieldProps) {
  const { value, set, rest } = bound<string, FieldFrame & ComponentProps<"textarea">>(props);
  const { label, hint, error, class: className, ...input } = rest;
  return (
    <Field label={label} hint={hint} error={error}>
      <textarea {...input} class={joinClass("input", className as string | undefined)} value={value} onInput={(event) => set(event.currentTarget.value)} />
    </Field>
  );
}

/** The props of `CheckField`: either a `field` signal or `value` with `onValue` (never both). */
export type CheckFieldProps = { label: string; hint?: string; name?: string } & Bound<boolean>;

/** A checkbox with an optional hint beneath; follows a signal or is plain controlled, like `TextField`. */
export function CheckField(props: CheckFieldProps) {
  const { value, set, rest } = bound<boolean, { label: string; hint?: string; name?: string }>(props);
  const { label, hint, name } = rest;
  return (
    <div class="field">
      <label class="check">
        <input
          type="checkbox"
          name={name}
          checked={value}
          onChange={(event) => {
            set(event.currentTarget.checked);
          }}
        />
        {label}
      </label>
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}
