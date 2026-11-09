import "../field/field.css";
import "../tag/tag.css";
import "./tags-input.css";

import { normalizeProps, useMachine } from "@zag-js/preact";
import * as zag from "@zag-js/tags-input";
import { X } from "lucide-preact";
import { useId } from "preact/hooks";

import { inputProps } from "../../lib/zag.ts";
import { kitText } from "../../texts.ts";
import { FieldNotes, isInvalid } from "../field/index.tsx";

/**
 * A box that turns what you type into removable tags: Enter or a delimiter (a comma by default) adds one, Backspace on
 * an empty box removes the last, pasting splits on the delimiter, and leaving the box adds what is still typed (Zag
 * tags-input machine). Duplicates are ignored, ignoring case. `value` is the list of tag texts. With `name` the tags go
 * with a form as one comma-separated field.
 */
export function TagsInput({
  label,
  hint,
  error,
  value,
  onChange,
  placeholder,
  delimiter = /[,，、]/,
  max,
  name,
  disabled = false,
}: {
  label: string;
  hint?: string;
  error?: string;
  value: string[];
  onChange: (value: string[]) => void;
  /** Shown only while there are no tags. */
  placeholder?: string;
  /** What ends a tag besides Enter: a string or a pattern. */
  delimiter?: string | RegExp;
  /** The most tags allowed. */
  max?: number;
  name?: string;
  disabled?: boolean;
}) {
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
    onValueChange: (details) => onChange(details.value),
  });
  const api = zag.connect(service, normalizeProps);

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
        <input class="tags-field" placeholder={value.length === 0 ? placeholder : undefined} {...inputProps(api.getInputProps())} />
      </div>
      <input {...inputProps(api.getHiddenInputProps())} />
      <FieldNotes hint={hint} error={error} />
    </div>
  );
}
