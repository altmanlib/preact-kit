import "./layout.css";

import type { ComponentChildren } from "preact";

import { PageHead } from "../heading/index.tsx";

/** A step on the spacing scale: 1 is `--space-1` (4px) up to 6 (`--space-6`, 24px). */
export type Gap = 1 | 2 | 3 | 4 | 5 | 6;

/** Lays its children out in a column (or a row), a fixed `gap` apart; a row wraps when it runs out of room unless `wrap` is false. */
export function Stack({
  gap = 3,
  direction = "column",
  align,
  justify,
  wrap = true,
  children,
}: {
  gap?: Gap;
  direction?: "column" | "row";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  /** For a row: wrap onto new lines (the default) or stay on one line. */
  wrap?: boolean;
  children: ComponentChildren;
}) {
  const style = [
    `--gap: var(--space-${gap})`,
    align ? `--align: ${align === "start" || align === "end" ? `flex-${align}` : align}` : "",
    justify ? `--justify: ${justify === "between" ? "space-between" : justify === "start" || justify === "end" ? `flex-${justify}` : justify}` : "",
    direction === "row" && !wrap ? "--wrap: nowrap" : "",
  ]
    .filter(Boolean)
    .join("; ");
  return (
    <div class={direction === "row" ? "stack stack-row" : "stack"} style={style}>
      {children}
    </div>
  );
}

/** Pushes the siblings after it to the end of a row `Stack`. */
export function Spacer() {
  return <span class="layout-spacer" aria-hidden="true" />;
}

/** A grid of equal columns that are at least `min` wide: as many as fit, wrapping onto new rows. On a narrow screen the gap never exceeds step 3. */
export function Grid({ min = "14rem", gap = 3, children }: { min?: string; gap?: Gap; children: ComponentChildren }) {
  return (
    <div class="grid" style={`--grid-min: ${min}; --gap: var(--space-${gap})`}>
      {children}
    </div>
  );
}

/** A main area beside a fixed-width side column (`side`, a CSS length), on the right or with `sideFirst` on the left; below the narrow breakpoint they stack, main first. */
export function Split({
  side,
  sideWidth = "18rem",
  sideFirst = false,
  gap = 4,
  children,
}: {
  side: ComponentChildren;
  sideWidth?: string;
  sideFirst?: boolean;
  gap?: Gap;
  /** The main area. */
  children: ComponentChildren;
}) {
  const sideColumn = <div class="layout-split-side">{side}</div>;
  const mainColumn = <div class="layout-split-main">{children}</div>;
  return (
    <div class={sideFirst ? "layout-split layout-split-first" : "layout-split"} style={`--side: ${sideWidth}; --gap: var(--space-${gap})`}>
      {sideFirst ? sideColumn : mainColumn}
      {sideFirst ? mainColumn : sideColumn}
    </div>
  );
}

/** Centres its content in a column no wider than `size`, with the page gutter on each side. */
export function Container({ size = "md", children }: { size?: "sm" | "md" | "lg"; children: ComponentChildren }) {
  return <div class={`layout-container layout-container-${size}`}>{children}</div>;
}

/** A page: the title block (`PageHead`), then the body, whose children stack `gap` apart. */
export function Page({
  title,
  intro,
  actions,
  gap = 5,
  children,
}: {
  title: string;
  /** A line right under the title. */
  intro?: ComponentChildren;
  /** Buttons at the end of the title row. */
  actions?: ComponentChildren;
  gap?: Gap;
  children: ComponentChildren;
}) {
  return (
    <div class="layout-page">
      <PageHead title={title} intro={intro}>
        {actions}
      </PageHead>
      <Stack gap={gap}>{children}</Stack>
    </div>
  );
}
