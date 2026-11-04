import { nextIndex } from "./roving.ts";

/** A trigger character and the text typed after it, up to the caret: `start` is the trigger's index in the text. */
export type TriggerMatch = { trigger: string; query: string; start: number };

/** A character that, right before a trigger, means the trigger is part of a word (an address such as a@b), not the start of a mention. */
const ASCII_WORD = /[A-Za-z0-9_]/;

/**
 * The trigger being typed at the caret, if any: the nearest trigger character before the caret with no whitespace in
 * between. It does not count after `notAfter` (ASCII letters, digits and `_` by default) or after another trigger, so
 * `a@b` and `@@` stay plain text while `hi@` and `你好@` open a list.
 */
export function findTrigger(options: { text: string; caret: number; triggers: readonly string[]; notAfter?: RegExp }): TriggerMatch | undefined {
  const { text, caret, triggers, notAfter = ASCII_WORD } = options;
  for (let index = caret - 1; index >= 0; index -= 1) {
    const char = text[index] ?? "";
    if (/\s/.test(char)) return undefined;
    if (!triggers.includes(char)) continue;
    const before = index > 0 ? (text[index - 1] ?? "") : "";
    if (before !== "" && (notAfter.test(before) || triggers.includes(before))) return undefined;
    return { trigger: char, query: text.slice(index + 1, caret), start: index };
  }
  return undefined;
}

/** The text with the trigger and its query replaced by `insert`, and where the caret goes: right after the insertion. */
export function applyPick(options: { text: string; match: TriggerMatch; caret: number; insert: string }): { text: string; caret: number } {
  const { text, match, caret, insert } = options;
  return { text: text.slice(0, match.start) + insert + text.slice(caret), caret: match.start + insert.length };
}

export type SuggestAction = { type: "move"; index: number } | { type: "pick" } | { type: "dismiss" };

/** What a key does to an open suggestion list: arrows move the highlight (wrapping), Enter and Tab choose it, Esc closes the list; anything else is the input's. */
export function suggestAction(options: { key: string; active: number; count: number }): SuggestAction | undefined {
  const { key, active, count } = options;
  if (count <= 0) return undefined;
  if (key === "Enter" || key === "Tab") return { type: "pick" };
  if (key === "Escape") return { type: "dismiss" };
  const index = key === "ArrowDown" || key === "ArrowUp" ? nextIndex({ current: active, count, key, orientation: "vertical" }) : undefined;
  return index === undefined ? undefined : { type: "move", index };
}
