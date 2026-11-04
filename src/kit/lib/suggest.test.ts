import { expect, test } from "bun:test";

import { applyPick, findTrigger, suggestAction } from "./suggest.ts";

const triggers = ["@", "＠"];
const at = (text: string, caret = text.length) => findTrigger({ text, caret, triggers });

test("a trigger at the start, after a space or after non-ASCII text opens a match with what follows it", () => {
  expect(at("@")).toEqual({ trigger: "@", query: "", start: 0 });
  expect(at("hello @ab")).toEqual({ trigger: "@", query: "ab", start: 6 });
  expect(at("你好@机")).toEqual({ trigger: "@", query: "机", start: 2 });
  expect(at("a\n@x")).toEqual({ trigger: "@", query: "x", start: 2 });
});

test("a full-width trigger counts the same", () => {
  expect(at("＠机器")).toEqual({ trigger: "＠", query: "机器", start: 0 });
});

test("the match ends at the caret, not at the end of the text", () => {
  expect(at("@abc def", 3)).toEqual({ trigger: "@", query: "ab", start: 0 });
  expect(at("@abc def", 6)).toBeUndefined();
});

test("whitespace between the trigger and the caret ends the match", () => {
  expect(at("@ab cd")).toBeUndefined();
  expect(at("@ab ")).toBeUndefined();
  expect(at("plain text")).toBeUndefined();
  expect(at("")).toBeUndefined();
});

test("a trigger inside a word or after another trigger is plain text", () => {
  expect(at("ann@example")).toBeUndefined();
  expect(at("a_1@x")).toBeUndefined();
  expect(at("@@x")).toBeUndefined();
  expect(at("＠@x")).toBeUndefined();
});

test("only the nearest trigger is considered", () => {
  expect(at("@a @b")).toEqual({ trigger: "@", query: "b", start: 3 });
  expect(at("a@b@c")).toBeUndefined();
});

test("notAfter replaces the default rule", () => {
  expect(findTrigger({ text: "ab@c", caret: 4, triggers, notAfter: /[0-9]/ })).toEqual({ trigger: "@", query: "c", start: 2 });
  expect(findTrigger({ text: "你@c", caret: 3, triggers, notAfter: /\p{L}/u })).toBeUndefined();
});

test("picking replaces the trigger and its query and puts the caret after the insertion", () => {
  const match = at("hi @ab there", 6);
  expect(match).toBeDefined();
  if (!match) return;
  expect(applyPick({ text: "hi @ab there", match, caret: 6, insert: "@Alice " })).toEqual({ text: "hi @Alice  there", caret: 10 });
  expect(applyPick({ text: "@", match: { trigger: "@", query: "", start: 0 }, caret: 1, insert: "@Bob " })).toEqual({ text: "@Bob ", caret: 5 });
});

test("keys move the highlight, choose it or close the list", () => {
  expect(suggestAction({ key: "ArrowDown", active: 0, count: 3 })).toEqual({ type: "move", index: 1 });
  expect(suggestAction({ key: "ArrowDown", active: 2, count: 3 })).toEqual({ type: "move", index: 0 });
  expect(suggestAction({ key: "ArrowUp", active: 0, count: 3 })).toEqual({ type: "move", index: 2 });
  expect(suggestAction({ key: "Enter", active: 1, count: 3 })).toEqual({ type: "pick" });
  expect(suggestAction({ key: "Tab", active: 1, count: 3 })).toEqual({ type: "pick" });
  expect(suggestAction({ key: "Escape", active: 1, count: 3 })).toEqual({ type: "dismiss" });
});

test("other keys, and an empty list, are left to the input", () => {
  expect(suggestAction({ key: "a", active: 0, count: 3 })).toBeUndefined();
  expect(suggestAction({ key: "ArrowLeft", active: 0, count: 3 })).toBeUndefined();
  expect(suggestAction({ key: "Enter", active: 0, count: 0 })).toBeUndefined();
});
