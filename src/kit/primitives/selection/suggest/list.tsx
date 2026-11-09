import "../../_shared/popover.css";
import "./suggest.css";

import type { ComponentChildren, RefObject } from "preact";
import { useEffect, useRef } from "preact/hooks";

export type SuggestItem = {
  key: string;
  label: string;
  /** Quiet text at the row's end. */
  hint?: string;
  /** Shown before the label, such as an avatar. */
  leading?: ComponentChildren;
  /** What replaces the trigger and the typed text when this row is chosen; the trigger plus the label and a space by default. */
  insert?: string;
};

export const optionIdOf = (listId: string, index: number) => `${listId}-${index}`;

/** A `manual` popover's ref, opened and closed to follow `shown`; the input keeps focus, so the browser's light dismiss is not wanted. */
export function useManualPopover(shown: boolean): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const popover = ref.current;
    if (!popover) return;
    if (shown && !popover.matches(":popover-open")) popover.showPopover();
    else if (!shown && popover.matches(":popover-open")) popover.hidePopover();
  }, [shown]);
  return ref;
}

/** The candidate rows of `Suggest` and `MentionInput`, placed against the anchor named `anchor`. */
export function SuggestList({
  id,
  anchor,
  label,
  rows,
  active,
  listRef,
  onHover,
  onPick,
}: {
  id: string;
  anchor: string;
  label: string;
  rows: SuggestItem[];
  active: number;
  listRef: RefObject<HTMLDivElement | null>;
  onHover: (index: number) => void;
  onPick: (index: number) => void;
}) {
  return (
    <div
      ref={listRef}
      id={id}
      popover="manual"
      role="listbox"
      aria-label={label}
      class="pop suggest-list"
      style={`position-anchor: ${anchor}`}
      // A press on the list must not take focus from the input, or the blur would close the list before the click lands.
      onPointerDown={(event) => event.preventDefault()}
    >
      {rows.map((row, index) => (
        <div
          key={row.key}
          id={optionIdOf(id, index)}
          role="option"
          class="pop-item suggest-item"
          aria-selected={index === active}
          onPointerMove={() => onHover(index)}
          onClick={() => onPick(index)}
        >
          {row.leading}
          <span class="suggest-label">{row.label}</span>
          {row.hint ? <span class="suggest-hint">{row.hint}</span> : null}
        </div>
      ))}
    </div>
  );
}
