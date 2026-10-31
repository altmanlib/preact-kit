import "./badge.css";

import type { ComponentChildren } from "preact";

export type Tone = "ok" | "warn" | "bad" | "idle";

/** A small pill that carries a state; the tone says how it should read (fine, waiting, wrong, nothing to do). */
export function Badge({ tone, children }: { tone: Tone; children: ComponentChildren }) {
  return <span class={`badge badge-${tone}`}>{children}</span>;
}
