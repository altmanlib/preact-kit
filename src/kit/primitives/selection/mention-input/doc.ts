import { Fragment, type Node as ProseNode, Schema, Slice } from "prosemirror-model";
import { EditorState, type Plugin, TextSelection, type Transaction } from "prosemirror-state";

/** One paragraph of inline content: text, line breaks, and mentions, which are atoms (deleted and selected as a whole). */
export const mentionSchema = new Schema({
  nodes: {
    doc: { content: "paragraph" },
    paragraph: { content: "inline*", toDOM: () => ["p", 0] },
    text: { group: "inline" },
    hard_break: { inline: true, group: "inline", selectable: false, toDOM: () => ["br"] },
    mention: {
      inline: true,
      group: "inline",
      atom: true,
      selectable: true,
      attrs: { key: {}, text: {} },
      toDOM: (node) => ["span", { class: "mention-chip", "data-key": String(node.attrs.key), contenteditable: "false" }, String(node.attrs.text)],
    },
  },
});

const node = (name: string) => {
  const type = mentionSchema.nodes[name];
  if (!type) throw new Error(`unknown node ${name}`);
  return type;
};

export const newState = (plugins: readonly Plugin[]) => EditorState.create({ schema: mentionSchema, plugins: [...plugins] });

/** The plain text the editor holds, which is what a caller sends: a mention is its `text`, a line break is `\n`. */
export function serialize(doc: ProseNode): string {
  let out = "";
  doc.firstChild?.forEach((child) => {
    if (child.type.name === "hard_break") out += "\n";
    else if (child.type.name === "mention") out += String(child.attrs.text);
    else out += child.text ?? "";
  });
  return out;
}

export const isEmpty = (doc: ProseNode): boolean => doc.firstChild?.content.size === 0;

/** The paragraph text before an empty selection's caret, with each mention as one placeholder character so offsets match positions; `start` is the paragraph's first position. */
export function textBeforeCaret(state: EditorState): { text: string; caret: number; start: number } | undefined {
  const { $from, empty } = state.selection;
  if (!empty) return undefined;
  const start = $from.start();
  return { text: state.doc.textBetween(start, $from.pos, undefined, "\ufffc"), caret: $from.pos - start, start };
}

/** Replaces the text from `from` to the caret with a mention and a space, and puts the caret after the space. */
export function insertMention(state: EditorState, options: { from: number; key: string; text: string }): Transaction {
  const { from, key, text } = options;
  const tr = state.tr.replaceWith(from, state.selection.from, [node("mention").create({ key, text }), mentionSchema.text(" ")]);
  return tr.setSelection(TextSelection.create(tr.doc, from + 2));
}

export function insertLineBreak(state: EditorState): Transaction {
  return state.tr.replaceSelectionWith(node("hard_break").create());
}

/** Inserts plain text at the selection; line breaks in it become line break nodes, the same as Shift+Enter makes. */
export function insertPlainText(state: EditorState, raw: string): Transaction {
  const pieces: ProseNode[] = [];
  raw
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .forEach((line, index) => {
      if (index > 0) pieces.push(node("hard_break").create());
      if (line !== "") pieces.push(mentionSchema.text(line));
    });
  return state.tr.replaceSelection(new Slice(Fragment.from(pieces), 0, 0));
}
