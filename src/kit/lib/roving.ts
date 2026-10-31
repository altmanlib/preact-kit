export type Orientation = "horizontal" | "vertical";

const KEYS: Record<Orientation, { next: string; prev: string }> = {
  horizontal: { next: "ArrowRight", prev: "ArrowLeft" },
  vertical: { next: "ArrowDown", prev: "ArrowUp" },
};

/**
 * Where keyboard focus goes next in a list of `count` items (tabs, menu items, options): the arrow keys of the
 * `orientation` step and wrap around, Home and End jump to the ends, and items for which `isDisabled` is true are skipped.
 * Returns `undefined` for any other key, or when no item can take focus.
 */
export function nextIndex(options: {
  current: number;
  count: number;
  key: string;
  orientation: Orientation;
  isDisabled?: (index: number) => boolean;
}): number | undefined {
  const { current, count, key, orientation, isDisabled = () => false } = options;
  if (count <= 0) return undefined;
  const keys = KEYS[orientation];
  let step: number;
  let from: number;
  if (key === keys.next) {
    step = 1;
    from = current;
  } else if (key === keys.prev) {
    step = -1;
    from = current;
  } else if (key === "Home") {
    step = 1;
    from = -1;
  } else if (key === "End") {
    step = -1;
    from = count;
  } else {
    return undefined;
  }
  for (let taken = 0; taken < count; taken += 1) {
    from = (((from + step) % count) + count) % count;
    if (!isDisabled(from)) return from;
  }
  return undefined;
}
