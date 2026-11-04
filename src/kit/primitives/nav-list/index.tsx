import "./nav-list.css";

import type { ComponentChildren } from "preact";
import { useRef } from "preact/hooks";

import { nextIndex } from "../../lib/roving.ts";

export type NavListItem = {
  key: string;
  title: string;
  /** A second, quieter line under the title. */
  secondary?: string;
  /** Before the text: an icon or an Avatar. */
  leading?: ComponentChildren;
  /** After the text: a count, a Badge, a time. */
  trailing?: ComponentChildren;
  /** Makes the item a link. Without it the item is a button that calls `onSelect`. */
  href?: string;
  disabled?: boolean;
};

/**
 * A vertical list of selectable items, each with a title, an optional second line, and optional slots on either side;
 * long text is cut with an ellipsis. The item whose `key` is `current` is marked with `aria-current`. An item with `href`
 * is a link (the address is the state, like SubNav); one without is a button that calls `onSelect(key)` (the caller keeps
 * the state, like Tabs). ArrowUp, ArrowDown, Home and End move focus between enabled items; every item stays a tab stop.
 */
export function NavList({ label, items, current, onSelect }: { label: string; items: NavListItem[]; current?: string; onSelect?: (key: string) => void }) {
  const list = useRef<HTMLUListElement>(null);
  return (
    <nav class="nav-list" aria-label={label}>
      <ul
        ref={list}
        onKeyDown={(event) => {
          const rows = [...(list.current?.querySelectorAll<HTMLElement>(".nav-item") ?? [])];
          const focused = rows.indexOf((event.target as HTMLElement).closest<HTMLElement>(".nav-item") as HTMLElement);
          if (focused < 0) return;
          const next = nextIndex({
            current: focused,
            count: items.length,
            key: event.key,
            orientation: "vertical",
            isDisabled: (index) => items[index]?.disabled === true,
          });
          if (next === undefined) return;
          event.preventDefault();
          rows[next]?.focus();
        }}
      >
        {items.map((item) => {
          const marked = item.key === current;
          const body = (
            <>
              {item.leading ? <span class="nav-item-lead">{item.leading}</span> : null}
              <span class="nav-item-text">
                <span class="nav-item-title">{item.title}</span>
                {item.secondary ? <span class="nav-item-secondary">{item.secondary}</span> : null}
              </span>
              {item.trailing ? <span class="nav-item-trail">{item.trailing}</span> : null}
            </>
          );
          return (
            <li key={item.key}>
              {item.href !== undefined ? (
                <a
                  class="nav-item"
                  // A disabled link has no address, so it is neither focusable nor followed.
                  href={item.disabled ? undefined : item.href}
                  aria-current={marked ? "page" : undefined}
                  aria-disabled={item.disabled ? true : undefined}
                >
                  {body}
                </a>
              ) : (
                <button type="button" class="nav-item" aria-current={marked ? "true" : undefined} disabled={item.disabled} onClick={() => onSelect?.(item.key)}>
                  {body}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
