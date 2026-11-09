import { useSignal } from "@preact/signals";
import type { ComponentChildren } from "preact";
import { useEffect, useRef } from "preact/hooks";

import { useAnchor } from "../../../lib/anchor.ts";
import { applyPick, findTrigger, suggestAction, type TriggerMatch } from "../../../lib/suggest.ts";
import { optionIdOf, type SuggestItem, SuggestList, useManualPopover } from "./list.tsx";

export type { SuggestItem } from "./list.tsx";

export type SuggestPick = {
  item: SuggestItem;
  /** The whole value with the choice applied; set it as the input's value. */
  text: string;
  /** Where the caret goes in `text`; `Suggest` moves it there once the value is set. */
  caret: number;
  match: TriggerMatch;
};

/**
 * Wraps one `<input>` or `<textarea>` and lists candidates under it while the caret sits right after a trigger
 * character (`@`, `#`, …). Focus stays in the input: arrows move the highlight, Enter or Tab choose it, Esc closes the
 * list, and these keys do not reach the input's own handlers while the list is open (so Enter does not also submit).
 * Keys pressed during IME composition are left alone. The caller filters: `items` gets the current match and returns the
 * rows to show (none hides the list), and `onPick` hands back the new value to put in the input.
 */
export function Suggest({
  label,
  triggers,
  items,
  onPick,
  notAfter,
  class: className,
  children,
}: {
  /** The list's accessible name. */
  label: string;
  /** Single characters that start a mention. */
  triggers: readonly string[];
  items: (match: TriggerMatch) => SuggestItem[];
  onPick: (pick: SuggestPick) => void;
  /** A character that, just before a trigger, keeps it from counting; ASCII letters, digits and `_` by default. */
  notAfter?: RegExp;
  class?: string;
  children: ComponentChildren;
}) {
  const { id, anchor } = useAnchor();
  const box = useRef<HTMLDivElement>(null);
  const match = useSignal<TriggerMatch | undefined>(undefined);
  const active = useSignal(0);
  // The trigger index the user closed the list at; typing on at the same trigger keeps it closed.
  const dismissed = useSignal<number | undefined>(undefined);

  const rows = match.value ? items(match.value) : [];
  const shown = match.value !== undefined && rows.length > 0 && dismissed.value !== match.value.start;
  const activeIndex = Math.min(active.value, Math.max(rows.length - 1, 0));

  const field = () => box.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>("textarea, input") ?? undefined;

  function refresh() {
    const el = field();
    const next =
      el && el.selectionStart === el.selectionEnd
        ? findTrigger({ text: el.value, caret: el.selectionStart ?? el.value.length, triggers, notAfter })
        : undefined;
    const before = match.value;
    if (next?.start !== before?.start || next?.query !== before?.query) active.value = 0;
    if (next === undefined) dismissed.value = undefined;
    match.value = next;
  }

  function pick(index: number) {
    const el = field();
    const item = rows[index];
    const current = match.value;
    if (!el || !item || !current) return;
    const caret = el.selectionStart ?? el.value.length;
    const insert = item.insert ?? `${current.trigger}${item.label} `;
    const applied = applyPick({ text: el.value, match: current, caret, insert });
    onPick({ item, text: applied.text, caret: applied.caret, match: current });
    // The caller sets the value first; the caret can only be placed after it has rendered.
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(applied.caret, applied.caret);
      refresh();
    });
  }

  const list = useManualPopover(shown);

  // The input is the combobox; the wrapper cannot pass props to a child it does not render, so the attributes go on it here.
  useEffect(() => {
    const el = field();
    if (!el) return;
    el.setAttribute("role", "combobox");
    el.setAttribute("aria-autocomplete", "list");
    el.setAttribute("aria-haspopup", "listbox");
    el.setAttribute("aria-controls", id);
    el.setAttribute("aria-expanded", String(shown));
    if (shown) el.setAttribute("aria-activedescendant", optionIdOf(id, activeIndex));
    else el.removeAttribute("aria-activedescendant");
  }, [shown, activeIndex, id]);

  return (
    <div
      ref={box}
      class={className ? `suggest ${className}` : "suggest"}
      style={`anchor-name: ${anchor}`}
      onInput={refresh}
      onKeyUp={refresh}
      onClick={refresh}
      onFocusIn={refresh}
      onFocusOut={() => (match.value = undefined)}
      onKeyDownCapture={(event) => {
        if (!shown || event.isComposing || event.keyCode === 229 || event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
        const action = suggestAction({ key: event.key, active: activeIndex, count: rows.length });
        if (!action) return;
        event.preventDefault();
        event.stopPropagation();
        if (action.type === "move") active.value = action.index;
        else if (action.type === "pick") pick(activeIndex);
        else dismissed.value = match.value?.start;
      }}
    >
      {children}
      <SuggestList
        id={id}
        anchor={anchor}
        label={label}
        rows={rows}
        active={activeIndex}
        listRef={list}
        onHover={(index) => (active.value = index)}
        onPick={pick}
      />
    </div>
  );
}
