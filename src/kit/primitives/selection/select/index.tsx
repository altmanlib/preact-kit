import "../../_shared/popover.css";
import "../../form/field/field.css";
import "./select.css";

import { normalizeProps, useMachine } from "@zag-js/preact";
import * as zag from "@zag-js/select";
import { ChevronDown } from "lucide-preact";
import { useId, useMemo } from "preact/hooks";

import { type Bound, bound } from "../../../lib/signals.ts";
import { popupPositioning } from "../../../lib/zag.ts";
import { FieldNotes, isInvalid } from "../../form/field/index.tsx";
import { OptionList, type SelectOption } from "./option-list.tsx";

export type { SelectOption };

type SelectOwn = {
  label: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  name?: string;
  disabled?: boolean;
};

/** The props of `Select`: the own props, then either a `field` signal or `value` with `onChange` (never both). */
export type SelectProps = SelectOwn & Bound<string | undefined>;

/**
 * A labelled list box for choosing one value from a short list. The value is the chosen option (`undefined` shows
 * `placeholder`). Keyboard, type-ahead, focus return and the listbox semantics come from the Zag select machine; the
 * list is placed against the trigger and as wide as it, and never clipped by a scrolling ancestor. With `name` a hidden
 * input carries the value in a form. For a handful of actions use Dropdown.
 */
export function Select(props: SelectProps) {
  const { value, set, rest } = bound<string | undefined, SelectOwn>(props);
  const { label, hint, error, options, placeholder = "", name, disabled = false } = rest;
  const collection = useMemo(
    () =>
      zag.collection({
        items: options,
        itemToValue: (item) => item.value,
        itemToString: (item) => item.label,
        isItemDisabled: (item) => item.disabled === true,
      }),
    [options],
  );
  const service = useMachine(zag.machine, {
    id: useId(),
    collection,
    value: value === undefined ? [] : [value],
    disabled,
    invalid: isInvalid(error),
    onValueChange: (details) => {
      const picked = details.value[0];
      if (picked !== undefined) set(picked);
    },
    positioning: popupPositioning("bottom-start", { sameWidth: true }),
  });
  const api = zag.connect(service, normalizeProps);
  const selected = options.find((option) => option.value === value);

  return (
    <div class="field" {...api.getRootProps()}>
      <span {...api.getLabelProps()}>{label}</span>
      <div {...api.getControlProps()}>
        <button type="button" class="input select-trigger" {...api.getTriggerProps()}>
          <span class={selected ? "select-value" : "select-value select-placeholder"}>{selected?.label ?? placeholder}</span>
          <ChevronDown size={16} aria-hidden="true" />
        </button>
      </div>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      <OptionList api={api} options={options} />
      <FieldNotes hint={hint} error={error} />
    </div>
  );
}
