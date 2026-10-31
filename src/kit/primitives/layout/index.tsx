import "./layout.css";

import type { ComponentChildren } from "preact";

/** A step on the spacing scale: 1 is `--space-1` (4px) up to 6 (`--space-6`, 24px). */
export type Gap = 1 | 2 | 3 | 4 | 5 | 6;

/** Lays its children out in a column (or a row), a fixed `gap` apart; a row wraps when it runs out of room. */
export function Stack({
  gap = 3,
  direction = "column",
  align,
  justify,
  children,
}: {
  gap?: Gap;
  direction?: "column" | "row";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  children: ComponentChildren;
}) {
  const style = [
    `--gap: var(--space-${gap})`,
    align ? `--align: ${align === "start" || align === "end" ? `flex-${align}` : align}` : "",
    justify ? `--justify: ${justify === "between" ? "space-between" : justify === "start" || justify === "end" ? `flex-${justify}` : justify}` : "",
  ]
    .filter(Boolean)
    .join("; ");
  return (
    <div class={direction === "row" ? "stack stack-row" : "stack"} style={style}>
      {children}
    </div>
  );
}

/** A grid of equal columns that are at least `min` wide: as many as fit, wrapping onto new rows. */
export function Grid({ min = "14rem", gap = 3, children }: { min?: string; gap?: Gap; children: ComponentChildren }) {
  return (
    <div class="grid" style={`--grid-min: ${min}; --gap: var(--space-${gap})`}>
      {children}
    </div>
  );
}
