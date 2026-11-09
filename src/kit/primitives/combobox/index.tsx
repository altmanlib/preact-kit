import "../_shared/popover.css";
import "../field/field.css";
import "../select/select.css";
import "./combobox.css";

import * as zag from "@zag-js/combobox";
import { normalizeProps, useMachine } from "@zag-js/preact";
import { ChevronDown } from "lucide-preact";
import { useId, useMemo, useState } from "preact/hooks";

import { inputProps, popupPositioning } from "../../lib/zag.ts";
import { kitText } from "../../texts.ts";
import { FieldNotes, isInvalid } from "../field/index.tsx";
import { OptionList, type SelectOption } from "../select/option-list.tsx";

export type ComboboxOption = SelectOption;

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
    invalid: isInvalid(error),
    placeholder,
    openOnClick: true,
    inputBehavior: "autohighlight",
    onInputValueChange: (details) => setQuery(details.inputValue),
    onValueChange: (details) => onChange(details.value[0]),
    positioning: popupPositioning("bottom-start", { sameWidth: true }),
  });
  const api = zag.connect(service, normalizeProps);

  return (
    <div class="field" {...api.getRootProps()}>
      <label {...api.getLabelProps()}>{label}</label>
      <div class="combobox-control" {...api.getControlProps()}>
        <input class="input" {...inputProps(api.getInputProps())} />
        <button type="button" class="combobox-trigger" aria-label={kitText.showOptions} {...api.getTriggerProps()}>
          <ChevronDown size={16} aria-hidden="true" />
        </button>
      </div>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      <OptionList api={api} options={shown} empty={<p class="combobox-empty">{emptyText}</p>} />
      <FieldNotes hint={hint} error={error} />
    </div>
  );
}
