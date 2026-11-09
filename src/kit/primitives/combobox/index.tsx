import "../_shared/popover.css";
import "../field/field.css";
import "../select/select.css";
import "./combobox.css";

import * as zag from "@zag-js/combobox";
import { normalizeProps, useMachine } from "@zag-js/preact";
import { Check, ChevronDown } from "lucide-preact";
import { useId, useMemo, useState } from "preact/hooks";

import { kitText } from "../../texts.ts";

export type ComboboxOption = { value: string; label: string; disabled?: boolean };

/**
 * A text input with a list of options that narrows as you type, for choosing one value from a list too long for Select.
 * `value` is the chosen option (`undefined` for none); the typed text only filters and is not a value. Arrow keys move
 * the highlight, Enter chooses, Esc closes (Zag combobox machine). Filtering is a case-insensitive "contains" on the
 * label; `emptyText` shows when nothing matches. With `name` a hidden input carries the value in a form.
 */
export function Combobox({
  label,
  hint,
  error,
  options,
  value,
  onChange,
  placeholder,
  emptyText = kitText.noResults,
  name,
  disabled = false,
}: {
  label: string;
  hint?: string;
  error?: string;
  options: ComboboxOption[];
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  emptyText?: string;
  name?: string;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState("");
  const selected = options.find((option) => option.value === value);
  // While the input shows the chosen label, offer the whole list rather than only that option.
  const needle = selected !== undefined && query === selected.label ? "" : query.trim().toLowerCase();
  const shown = useMemo(() => (needle === "" ? options : options.filter((option) => option.label.toLowerCase().includes(needle))), [options, needle]);
  const collection = useMemo(
    () =>
      zag.collection({
        items: shown,
        itemToValue: (item) => item.value,
        itemToString: (item) => item.label,
        isItemDisabled: (item) => item.disabled === true,
      }),
    [shown],
  );
  const service = useMachine(zag.machine, {
    id: useId(),
    collection,
    value: value === undefined ? [] : [value],
    disabled,
    invalid: error !== undefined && error !== "",
    placeholder,
    openOnClick: true,
    inputBehavior: "autohighlight",
    onInputValueChange: (details) => setQuery(details.inputValue),
    onValueChange: (details) => onChange(details.value[0]),
    positioning: { placement: "bottom-start", gutter: 4, sameWidth: true, strategy: "fixed" },
  });
  const api = zag.connect(service, normalizeProps);

  return (
    <div class="field" {...api.getRootProps()}>
      <label {...api.getLabelProps()}>{label}</label>
      <div class="combobox-control" {...api.getControlProps()}>
        {/* Zag types the input role more loosely than Preact accepts */}
        <input class="input" {...(api.getInputProps() as Record<string, unknown>)} />
        <button type="button" class="combobox-trigger" aria-label={kitText.showOptions} {...api.getTriggerProps()}>
          <ChevronDown size={16} aria-hidden="true" />
        </button>
      </div>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      <div class="popup-positioner" {...api.getPositionerProps()}>
        <div class="popup select-list" {...api.getContentProps()}>
          {shown.length === 0 ? <p class="combobox-empty">{emptyText}</p> : null}
          {shown.map((option) => (
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
