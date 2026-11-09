import "prosemirror-view/style/prosemirror.css";
import "./mention-input.css";

import { useSignal } from "@preact/signals";
import type { RefObject } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { baseKeymap } from "prosemirror-commands";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import type { Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

import { useAnchor } from "../../../lib/anchor.ts";
import { findTrigger, suggestAction, type TriggerMatch } from "../../../lib/suggest.ts";
import { optionIdOf, type SuggestItem, SuggestList, useManualPopover } from "../suggest/list.tsx";
import { insertLineBreak, insertMention, insertPlainText, isEmpty, newState, serialize, textBeforeCaret } from "./doc.ts";

export type MentionInputHandle = { clear: () => void; focus: () => void };

export type MentionInputProps = {
  /** The editor's and the list's accessible name. */
  label: string;
  /** Single characters that start a mention. */
  triggers: readonly string[];
  /** The rows for the current match; none hides the list. A row's `insert` (without its trailing space) is the mention's text, the trigger plus the label by default. */
  items: (match: TriggerMatch) => SuggestItem[];
  /** The plain text after every change: a mention is its text, a line break is `\n`. */
  onChange?: (text: string) => void;
  /** Enter with no list open; Shift+Enter breaks the line. Clearing is up to the caller, through `handle`. */
  onSubmit?: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Lines the field is tall at least; it grows with the text up to a limit, then scrolls. */
  rows?: number;
  /** A character that, just before a trigger, keeps it from counting; ASCII letters, digits and `_` by default. */
  notAfter?: RegExp;
  /** Filled with `clear` and `focus` while mounted. */
  handle?: RefObject<MentionInputHandle | null>;
  class?: string;
};

/**
 * A text field whose mentions are inline chips. Typing a trigger character (`@`, `#`, …) lists candidates; choosing
 * one turns the typed text into a chip that is selected and deleted as a whole. What the field holds is plain text
 * (`onChange`/`onSubmit` get a string; a chip is its text), pasting and dropping keep text only, and nothing is ever
 * stored as markup. Focus stays in the field while the list is open: arrows move, Enter or Tab choose, Esc closes. It
 * is built on ProseMirror, which handles composition input, undo and the caret; those packages are optional peers of
 * this kit, needed only by this component.
 */
export function MentionInput(props: MentionInputProps) {
  const { label, triggers, placeholder = "", disabled = false, rows = 2, class: className } = props;
  const { id, anchor } = useAnchor();
  const mount = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const match = useSignal<TriggerMatch | undefined>(undefined);
  const active = useSignal(0);
  // The trigger index the user closed the list at; typing on at the same trigger keeps it closed.
  const dismissed = useSignal<number | undefined>(undefined);
  const empty = useSignal(true);

  const candidates = match.value ? props.items(match.value) : [];
  const shown = match.value !== undefined && candidates.length > 0 && dismissed.value !== match.value.start;
  const activeIndex = Math.min(active.value, Math.max(candidates.length - 1, 0));
  const list = useManualPopover(shown);

  // The editor outlives renders, so its handlers read the latest props and list through this.
  const latest = useRef({ props, candidates, shown, activeIndex, id });
  latest.current = { props, candidates, shown, activeIndex, id };

  function refresh(v: EditorView) {
    const before = textBeforeCaret(v.state);
    const { triggers: current, notAfter } = latest.current.props;
    const next = before ? findTrigger({ text: before.text, caret: before.caret, triggers: current, notAfter }) : undefined;
    if (next?.start !== match.value?.start || next?.query !== match.value?.query) active.value = 0;
    if (next === undefined) dismissed.value = undefined;
    match.value = next;
    empty.value = isEmpty(v.state.doc);
  }

  function pick(index: number) {
    const v = view.current;
    const row = latest.current.candidates[index];
    const current = match.value;
    const before = v ? textBeforeCaret(v.state) : undefined;
    if (!v || !row || !current || !before) return;
    const text = row.insert?.trimEnd() ?? `${current.trigger}${row.label}`;
    v.dispatch(insertMention(v.state, { from: before.start + current.start, key: row.key, text }).scrollIntoView());
    v.focus();
  }

  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    const editor = new EditorView(host, {
      state: newState([
        history(),
        keymap({
          "Mod-z": undo,
          "Mod-y": redo,
          "Shift-Mod-z": redo,
          "Shift-Enter": (state, dispatch) => {
            dispatch?.(insertLineBreak(state).scrollIntoView());
            return true;
          },
          Enter: (state) => {
            latest.current.props.onSubmit?.(serialize(state.doc));
            return true;
          },
        }),
        keymap(baseKeymap),
      ]),
      editable: () => !latest.current.props.disabled,
      attributes: () => {
        const { props: current, shown: open, activeIndex: highlighted, id: listId } = latest.current;
        return {
          role: "combobox",
          class: "input mention-editor",
          style: `--mention-rows: ${current.rows ?? 2}`,
          "aria-multiline": "true",
          "aria-label": current.label,
          "aria-autocomplete": "list",
          "aria-haspopup": "listbox",
          "aria-controls": listId,
          "aria-expanded": String(open),
          "aria-disabled": String(current.disabled ?? false),
          ...(open ? { "aria-activedescendant": optionIdOf(listId, highlighted) } : {}),
        };
      },
      // The list's keys go first, so Enter chooses a row instead of submitting.
      handleKeyDown(v, event) {
        const { shown: open, candidates: rowsNow, activeIndex: highlighted } = latest.current;
        if (!open || v.composing || event.isComposing || event.keyCode === 229 || event.shiftKey || event.ctrlKey || event.metaKey || event.altKey)
          return false;
        const action = suggestAction({ key: event.key, active: highlighted, count: rowsNow.length });
        if (!action) return false;
        if (action.type === "move") active.value = action.index;
        else if (action.type === "pick") pick(highlighted);
        else dismissed.value = match.value?.start;
        return true;
      },
      handlePaste(v, event) {
        v.dispatch(insertPlainText(v.state, event.clipboardData?.getData("text/plain") ?? "").scrollIntoView());
        return true;
      },
      handleDrop: () => true,
      dispatchTransaction(this: EditorView, tr: Transaction) {
        this.updateState(this.state.apply(tr));
        refresh(this);
        if (tr.docChanged) latest.current.props.onChange?.(serialize(this.state.doc));
      },
    });
    view.current = editor;
    return () => {
      editor.destroy();
      view.current = null;
    };
  }, []);

  // Attributes and editability are functions of the props and the list; recompute them when those change.
  useEffect(() => view.current?.setProps({}), [shown, activeIndex, label, disabled, rows, id]);

  useEffect(() => {
    const target = props.handle;
    if (!target) return;
    target.current = {
      focus: () => view.current?.focus(),
      clear() {
        const v = view.current;
        if (!v) return;
        v.updateState(newState(v.state.plugins));
        refresh(v);
        latest.current.props.onChange?.("");
      },
    };
    return () => {
      target.current = null;
    };
  }, [props.handle]);

  return (
    <div
      class={className ? `mention-input ${className}` : "mention-input"}
      data-placeholder={placeholder}
      data-empty={empty.value}
      style={`anchor-name: ${anchor}`}
      onFocusIn={() => view.current && refresh(view.current)}
      onFocusOut={() => (match.value = undefined)}
    >
      <div ref={mount} />
      <SuggestList
        id={id}
        anchor={anchor}
        label={label}
        rows={candidates}
        active={activeIndex}
        listRef={list}
        onHover={(index) => (active.value = index)}
        onPick={pick}
      />
    </div>
  );
}
