import "./field.css";

import { cloneElement, type ComponentChildren, type ComponentProps, isValidElement, type VNode } from "preact";
import { useId } from "preact/hooks";

import { type Bound, bound } from "../../../lib/signals.ts";

/** Whether an `error` prop means the control is invalid: any non-empty text. */
export function isInvalid(error: string | undefined): boolean {
  return error !== undefined && error !== "";
}

/** Ids and ARIA for a labelled control and its hint/error lines. */
export function useFieldNotes(
  hint?: string,
  error?: string,
): {
  hintId: string | undefined;
  errorId: string | undefined;
  describedBy: string | undefined;
  invalid: boolean;
} {
  const hintId = useId();
  const errorId = useId();
  const invalid = isInvalid(error);
  const describedBy = [hint ? hintId : undefined, invalid ? errorId : undefined].filter(Boolean).join(" ") || undefined;
  return { hintId: hint ? hintId : undefined, errorId: invalid ? errorId : undefined, describedBy, invalid };
}

/** The lines under a form control: its hint, then its error. The one place the kit draws them, so every control looks the same. */
export function FieldNotes({ hint, error, hintId, errorId }: { hint?: string; error?: string; hintId?: string; errorId?: string }) {
  return (
    <>
      {hint ? <small id={hintId}>{hint}</small> : null}
      {error ? (
        <small class="field-bad" id={errorId}>
          {error}
        </small>
      ) : null}
    </>
  );
}

type ControlProps = { "aria-invalid"?: boolean; "aria-describedby"?: string };

/** A labelled form control with an optional hint and an optional error line beneath it. Put native controls inside with `class="input"`. */
export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ComponentChildren }) {
  const { hintId, errorId, describedBy, invalid } = useFieldNotes(hint, error);
  const control = isValidElement(children)
    ? cloneElement(children as VNode<ControlProps>, {
        "aria-invalid": invalid || undefined,
        "aria-describedby": [((children as VNode<ControlProps>).props ?? {})["aria-describedby"], describedBy].filter(Boolean).join(" ") || undefined,
      })
    : children;
  return (
    <label class="field">
      <span>{label}</span>
      {control}
      <FieldNotes hint={hint} error={error} hintId={hintId} errorId={errorId} />
    </label>
  );
}

type FieldFrame = { label: string; hint?: string; error?: string };

const joinClass = (...names: (string | undefined)[]) => names.filter(Boolean).join(" ");

// Preact's input attributes are a union keyed by `type`, so the omission has to apply to each member.
type OmitEach<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
type InputAttrs = OmitEach<ComponentProps<"input">, "value" | "onChange">;
type TextAreaAttrs = OmitEach<ComponentProps<"textarea">, "value" | "onChange">;

/** The props of `TextField`: the frame, then either a `field` signal or `value` with `onChange` (never both), then the input's own attributes. */
export type TextFieldProps = FieldFrame & InputAttrs & Bound<string>;

/**
 * A labelled text input. It follows `field` (a signal), or is plain controlled with `value` and `onChange` (which gets
 * the text, not an event); everything else (`type`, `name`, `maxLength`, …) goes to the input as it is.
 * `type="email"` defaults to `autocomplete="email"` and `spellcheck={false}`; an explicit attribute still wins.
 */
export function TextField(props: TextFieldProps) {
  const { value, set, rest } = bound<string, FieldFrame & InputAttrs>(props);
  const { label, hint, error, class: className, ...input } = rest;
  const emailDefaults = input.type === "email" ? { spellcheck: false as const, autocomplete: "email" } : {};
  return (
    <Field label={label} hint={hint} error={error}>
      <input
        {...emailDefaults}
        {...input}
        class={joinClass("input", className as string | undefined)}
        value={value}
        onInput={(event) => set(event.currentTarget.value)}
      />
    </Field>
  );
}

/** The props of `TextAreaField`; same two modes as `TextFieldProps`. */
export type TextAreaFieldProps = FieldFrame & TextAreaAttrs & Bound<string>;

/** `TextField` for several lines. */
export function TextAreaField(props: TextAreaFieldProps) {
  const { value, set, rest } = bound<string, FieldFrame & TextAreaAttrs>(props);
  const { label, hint, error, class: className, ...input } = rest;
  return (
    <Field label={label} hint={hint} error={error}>
      <textarea {...input} class={joinClass("input", className as string | undefined)} value={value} onInput={(event) => set(event.currentTarget.value)} />
    </Field>
  );
}

/** The props of `CheckField`: either a `field` signal or `value` with `onChange` (never both). */
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
      <FieldNotes hint={hint} />
    </div>
  );
}
