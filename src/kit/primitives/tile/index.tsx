import "./tile.css";

import type { ComponentChildren, ComponentProps } from "preact";

/** Shell colour of a Tile; peers on one page use different variants so the row has hierarchy. */
export type TileVariant = "default" | "accent" | "ok" | "warn" | "bad";

/** A row of Tiles: `lead` gives the first one more room, `even` makes three equal, `quad` four equal (two per row on a narrow screen). */
export function Tiles({ layout = "lead", children }: { layout?: "lead" | "even" | "quad"; children: ComponentChildren }) {
  return <div class={layout === "lead" ? "tiles" : `tiles tiles-${layout}`}>{children}</div>;
}

/**
 * One figure on a row of tiles: a label, the value in large type and a line of hint. With `href` the tile is a link; `alert`
 * marks one that wants attention; `unit` goes before the value (a currency sign) and `suffix` after it.
 */
export function Tile({
  label,
  value,
  hint,
  href,
  alert = false,
  variant = "default",
  unit,
  suffix,
  live = false,
  valueTestId,
  class: extraClass,
  children,
  ...rest
}: Omit<ComponentProps<"div">, "label" | "value" | "class" | "className" | "children"> & {
  label: ComponentChildren;
  value: ComponentChildren;
  hint?: ComponentChildren;
  href?: string;
  alert?: boolean;
  /** Shell colour; default is the gray shell. */
  variant?: TileVariant;
  unit?: string;
  suffix?: string;
  /** Announce changes of the tile to assistive technology. */
  live?: boolean;
  valueTestId?: string;
  /** An extra class, such as a status colour. */
  class?: string;
  /** Further lines under the hint. */
  children?: ComponentChildren;
}) {
  const className = ["tile", variant === "default" ? undefined : `tile-${variant}`, alert ? "tile-alert" : undefined, extraClass].filter(Boolean).join(" ");
  const body = (
    <>
      <span class="tile-label">{label}</span>
      <span class="tile-body">
        <span class="tile-value" data-testid={valueTestId}>
          {unit ? <span class="tile-unit">{unit}</span> : null}
          {value}
          {suffix ? <small class="tile-unit">{suffix}</small> : null}
        </span>
        {hint === undefined ? null : <span class="tile-hint">{hint}</span>}
        {children}
      </span>
    </>
  );
  if (href !== undefined) {
    return (
      <a {...(rest as Record<string, unknown>)} class={className} href={href}>
        {body}
      </a>
    );
  }
  return (
    <div {...rest} class={className} aria-live={live ? "polite" : undefined}>
      {body}
    </div>
  );
}
