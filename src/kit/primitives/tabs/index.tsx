import "../chips/chips.css";

import type { ComponentChildren } from "preact";
import { useId, useRef } from "preact/hooks";

import { nextIndex } from "../../lib/roving.ts";

export type TabItem = { key: string; label: string; disabled?: boolean };

/**
 * Tabs that switch a panel without changing the address: `value` is the key of the standing tab, `children` is its
 * panel. Arrow keys, Home and End move between tabs (the tab list is one tab stop). For parts that each have their own
 * address use SubNav.
 */
export function Tabs({
  label,
  items,
  value,
  onChange,
  children,
}: {
  label: string;
  items: TabItem[];
  value: string;
  onChange: (key: string) => void;
  children: ComponentChildren;
}) {
  const id = useId();
  const list = useRef<HTMLDivElement>(null);
  const tabId = (key: string) => `${id}-tab-${key}`;
  const current = items.findIndex((item) => item.key === value);

  return (
    <div>
      <div
        ref={list}
        class="tabs"
        role="tablist"
        aria-label={label}
        onKeyDown={(event) => {
          const next = nextIndex({
            current,
            count: items.length,
            key: event.key,
            orientation: "horizontal",
            isDisabled: (index) => items[index]?.disabled === true,
          });
          const item = next === undefined ? undefined : items[next];
          if (!item) return;
          event.preventDefault();
          onChange(item.key);
          list.current?.querySelector<HTMLElement>(`[id="${tabId(item.key)}"]`)?.focus();
        }}
      >
        {items.map((item) => (
          <button
            key={item.key}
            id={tabId(item.key)}
            type="button"
            role="tab"
            class="tab"
            aria-selected={item.key === value}
            aria-controls={`${id}-panel`}
            tabIndex={item.key === value ? 0 : -1}
            disabled={item.disabled}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div id={`${id}-panel`} class="tab-panel" role="tabpanel" aria-labelledby={tabId(value)} tabIndex={0}>
        {children}
      </div>
    </div>
  );
}
