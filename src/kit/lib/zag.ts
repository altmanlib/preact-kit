/** Where a Zag popup opens relative to its trigger. */
type Placement = "bottom-start" | "bottom-end" | "top";

/**
 * The `positioning` option every kit popup shares: fixed, so a scrolling ancestor cannot clip it, and a small gap from the
 * trigger. `sameWidth` makes the popup as wide as the trigger (lists of options).
 */
export function popupPositioning(placement: Placement, { sameWidth = false, gutter = 4 }: { sameWidth?: boolean; gutter?: number } = {}) {
  return { placement, gutter, sameWidth, strategy: "fixed" } as const;
}

/** Zag types an input's `role` more loosely than Preact accepts; this narrows the spread to what Preact takes. */
export function inputProps(props: object): Record<string, unknown> {
  return props as Record<string, unknown>;
}
