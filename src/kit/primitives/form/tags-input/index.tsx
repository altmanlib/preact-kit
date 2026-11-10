import "../field/field.css";
import "../../data-display/tag/tag.css";
import "./tags-input.css";

import { normalizeProps, useMachine } from "@zag-js/preact";
import * as zag from "@zag-js/tags-input";
import { X } from "lucide-preact";
import { useId } from "preact/hooks";

import { type Bound, bound } from "../../../lib/signals.ts";
import { inputProps } from "../../../lib/zag.ts";
import { kitText } from "../../../texts.ts";
import { FieldNotes, isInvalid, useFieldNotes } from "../field/index.tsx";

type TagsInputOwn = {
  label: string;
  hint?: string;
  error?: string;
  /** Shown only while there are no tags. */
  placeholder?: string;
  /** What ends a tag besides Enter: a string or a pattern. */
  delimiter?: string | RegExp;
  /** The most tags allowed. */
  max?: number;
  name?: string;
  disabled?: boolean;
};

/** The props of `TagsInput`: the own props, then either a `field` signal or `value` with `onChange` (never both); the value is the list of tag texts. */
export type TagsInputProps = TagsInputOwn & Bound<string[]>;

/**
 * A box that turns what you type into removable tags: Enter or a delimiter (a comma by default) adds one, Backspace on
 * an empty box removes the last, pasting splits on the delimiter, and leaving the box adds what is still typed (Zag
 * tags-input machine). Duplicates are ignored, ignoring case. With `name` the tags go
 * with a form as one comma-separated field.
 */
export function TagsInput(props: TagsInputProps) {
  const { value, set, rest } = bound<string[], TagsInputOwn>(props);
  const { label, hint, error, placeholder, delimiter = /[,，、]/, max, name, disabled = false } = rest;
  const service = useMachine(zag.machine, {
    id: useId(),
    value,
    delimiter,
    max,
    name,
    disabled,
    invalid: isInvalid(error),
    editable: false,
    addOnPaste: true,
    blurBehavior: "add",
    validate: (details) => !details.value.some((existing) => existing.toLowerCase() === details.inputValue.toLowerCase()),
    onValueChange: (details) => set(details.value),
  });
  const api = zag.connect(service, normalizeProps);
  const { hintId, errorId, describedBy } = useFieldNotes(hint, error);

  return (
    <div class="field" {...api.getRootProps()}>
      <label {...api.getLabelProps()}>{label}</label>
      <div class="control-box tags-control" {...api.getControlProps()}>
        {value.map((tag, index) => (
          <span key={tag} class="tag" {...api.getItemProps({ index, value: tag })}>
            <span {...api.getItemPreviewProps({ index, value: tag })}>
              <span {...api.getItemTextProps({ index, value: tag })}>{tag}</span>
            </span>
            <button type="button" class="tag-remove" aria-label={`${kitText.remove} ${tag}`} {...api.getItemDeleteTriggerProps({ index, value: tag })}>
              <X size={12} aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          class="tags-field"
          placeholder={value.length === 0 ? placeholder : undefined}
          {...inputProps(api.getInputProps())}
          aria-describedby={describedBy}
        />
      </div>
      <input {...inputProps(api.getHiddenInputProps())} />
      <FieldNotes hint={hint} error={error} hintId={hintId} errorId={errorId} />
    </div>
  );
}
