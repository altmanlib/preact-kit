import "../_shared/popover.css";
import "../field/field.css";
import "./select.css";

import { normalizeProps, useMachine } from "@zag-js/preact";
import * as zag from "@zag-js/select";
import { Check, ChevronDown } from "lucide-preact";
import { useId, useMemo } from "preact/hooks";

export type SelectOption = { value: string; label: string; disabled?: boolean };

/**
 * A labelled list box for choosing one value from a short list. `value` is the chosen option (`undefined` shows
 * `placeholder`). Keyboard, type-ahead, focus return and the listbox semantics come from the Zag select machine; the
 * list is placed against the trigger and as wide as it, and never clipped by a scrolling ancestor. With `name` a hidden
 * input carries the value in a form. For a handful of actions use Dropdown.
 */
export function Select({
  label,
  hint,
  error,
  options,
  value,
  onChange,
  placeholder = "",
  name,
  disabled = false,
}: {
  label: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
}) {
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
    invalid: error !== undefined && error !== "",
    onValueChange: (details) => {
      const picked = details.value[0];
      if (picked !== undefined) onChange(picked);
    },
    positioning: { placement: "bottom-start", gutter: 4, sameWidth: true, strategy: "fixed" },
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
      <div class="popup-positioner" {...api.getPositionerProps()}>
        <div class="popup select-list" {...api.getContentProps()}>
          {options.map((option) => (
            <div key={option.value} class="pop-item" {...api.getItemProps({ item: option })}>
              <span {...api.getItemTextProps({ item: option })}>{option.label}</span>
              <span {...api.getItemIndicatorProps({ item: option })}>
                <Check size={16} aria-hidden="true" />
              </span>
            </div>
          ))}
        </div>
      </div>
      {hint ? <small>{hint}</small> : null}
      {error ? <small class="field-bad">{error}</small> : null}
    </div>
  );
}
