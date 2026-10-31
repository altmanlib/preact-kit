import "../_shared/popover.css";
import "../field/field.css";
import "./select.css";

import { useSignal } from "@preact/signals";
import { Check, ChevronDown } from "lucide-preact";
import { useId, useRef } from "preact/hooks";

import { useAnchor } from "../../lib/anchor.ts";
import { nextIndex, typeahead } from "../../lib/roving.ts";

export type SelectOption = { value: string; label: string; disabled?: boolean };

/**
 * A labelled list box for choosing one value from a short list. `value` is the chosen option (`undefined` shows
 * `placeholder`). It follows the select-only combobox pattern: the browser's popover handles light dismiss and Esc,
 * arrows, Home, End and type-ahead move between options, Enter or Space chooses. With `name` a hidden input carries the
 * value in a form. For a handful of actions use Dropdown; for a native control use `<select class="input">` inside Field.
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
  const { id, anchor } = useAnchor();
  const labelId = useId();
  const list = useRef<HTMLDivElement>(null);
  const open = useSignal(false);
  const selected = options.find((option) => option.value === value);

  const rows = () => [...(list.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ?? [])];
  const isDisabled = (index: number) => options[index]?.disabled === true;
  const pick = (option: SelectOption) => {
    onChange(option.value);
    list.current?.hidePopover();
  };

  return (
    <div class="field">
      <span id={labelId}>{label}</span>
      <button
        type="button"
        class="input select-trigger"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open.value}
        aria-controls={id}
        aria-labelledby={labelId}
        aria-invalid={error ? true : undefined}
        popovertarget={id}
        style={`anchor-name: ${anchor}`}
        disabled={disabled}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
          event.preventDefault();
          list.current?.showPopover();
        }}
      >
        <span class={selected ? "select-value" : "select-value select-placeholder"}>{selected?.label ?? placeholder}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      <div
        ref={list}
        id={id}
        popover="auto"
        role="listbox"
        aria-labelledby={labelId}
        class="pop select-list"
        style={`position-anchor: ${anchor}`}
        onToggle={(event) => {
          open.value = event.newState === "open";
          if (event.newState !== "open") return;
          const all = rows();
          (all.find((row) => row.getAttribute("aria-selected") === "true") ?? all.find((row) => !row.disabled))?.focus();
        }}
        onKeyDown={(event) => {
          if (event.key === "Tab") {
            list.current?.hidePopover();
            return;
          }
          const all = rows();
          const current = all.indexOf(document.activeElement as HTMLButtonElement);
          const next =
            nextIndex({ current, count: options.length, key: event.key, orientation: "vertical", isDisabled }) ??
            typeahead({ labels: options.map((option) => option.label), current, char: event.key, isDisabled });
          if (next === undefined) return;
          event.preventDefault();
          all[next]?.focus();
        }}
      >
        {options.map((option) => {
          const chosen = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="option"
              class="pop-item"
              aria-selected={chosen}
              disabled={option.disabled}
              onClick={() => pick(option)}
            >
              {option.label}
              {chosen ? <Check size={16} aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>
      {hint ? <small>{hint}</small> : null}
      {error ? <small class="field-bad">{error}</small> : null}
    </div>
  );
}
