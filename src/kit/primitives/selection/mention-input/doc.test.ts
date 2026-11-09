import { expect, test } from "bun:test";

import type { Node as ProseNode } from "prosemirror-model";
import { TextSelection } from "prosemirror-state";

import { findTrigger } from "../../../lib/suggest.ts";
import { insertLineBreak, insertMention, insertPlainText, isEmpty, mentionSchema, newState, serialize, textBeforeCaret } from "./doc.ts";

const para = (...children: ProseNode[]) => mentionSchema.node("doc", null, [mentionSchema.node("paragraph", null, children)]);
const lineBreak = () => mentionSchema.nodes.hard_break?.create() as ProseNode;
const mention = (text = "@Ada") => mentionSchema.nodes.mention?.create({ key: "ada", text });
const withCaret = (doc: ReturnType<typeof para>, pos: number) => {
  const state = newState([]);
  const next = state.apply(state.tr.replaceWith(0, state.doc.content.size, doc.content));
  return next.apply(next.tr.setSelection(TextSelection.create(next.doc, pos)));
};

test("an empty editor is empty and serializes to nothing", () => {
  const state = newState([]);
  expect(isEmpty(state.doc)).toBe(true);
  expect(serialize(state.doc)).toBe("");
});

test("serializing gives text, a mention's text, and a newline for a line break", () => {
  const m = mention();
  if (!m) throw new Error("no mention node");
  const doc = para(mentionSchema.text("hi "), m, mentionSchema.text(" there"), lineBreak(), mentionSchema.text("bye"));
  expect(serialize(doc)).toBe("hi @Ada there\nbye");
  expect(isEmpty(doc)).toBe(false);
});

test("the text before the caret counts a mention as one character, so offsets match positions", () => {
  const m = mention();
  if (!m) throw new Error("no mention node");
  const state = withCaret(para(mentionSchema.text("a"), m, mentionSchema.text(" @b")), 6);
  const before = textBeforeCaret(state);
  expect(before).toEqual({ text: "a\ufffc @b", caret: 5, start: 1 });
  expect(findTrigger({ text: before?.text ?? "", caret: before?.caret ?? 0, triggers: ["@"] })).toEqual({ trigger: "@", query: "b", start: 3 });
});

test("a range selection has no text before a caret", () => {
  const state = withCaret(para(mentionSchema.text("abc")), 1);
  const ranged = state.apply(state.tr.setSelection(TextSelection.create(state.doc, 1, 3)));
  expect(textBeforeCaret(ranged)).toBeUndefined();
});

test("picking replaces the typed trigger text with a mention and a space, caret after them", () => {
  const state = withCaret(para(mentionSchema.text("hi @ma there")), 7);
  const before = textBeforeCaret(state);
  expect(before?.text).toBe("hi @ma");
  const from = (before?.start ?? 0) + 3;
  const next = state.apply(insertMention(state, { from, key: "bot", text: "@Machine" }));
  expect(serialize(next.doc)).toBe("hi @Machine  there");
  expect(next.selection.from).toBe(from + 2);
  expect(next.selection.empty).toBe(true);
});

test("a line break is inserted at the caret", () => {
  const state = withCaret(para(mentionSchema.text("ab")), 2);
  expect(serialize(state.apply(insertLineBreak(state)).doc)).toBe("a\nb");
});

test("pasted text becomes text and line break nodes, never markup", () => {
  const state = withCaret(para(mentionSchema.text("ab")), 2);
  const next = state.apply(insertPlainText(state, "x\r\ny\n\nz<b>"));
  expect(serialize(next.doc)).toBe("ax\ny\n\nz<b>b");
  // Adjacent text merges into one node, so the paragraph holds: "ax", break, "y", break, break, "z<b>b".
  expect(next.doc.firstChild?.childCount).toBe(6);
});
