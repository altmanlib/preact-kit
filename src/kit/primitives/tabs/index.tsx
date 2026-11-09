import "../chips/chips.css";

import { normalizeProps, useMachine } from "@zag-js/preact";
import * as zag from "@zag-js/tabs";
import type { ComponentChildren } from "preact";
import { useId } from "preact/hooks";

export type TabItem = { key: string; label: string; disabled?: boolean };

/**
 * Tabs that switch a panel without changing the address: `value` is the key of the standing tab, `children` is its
 * panel. Arrow keys, Home and End move between tabs and select them (the tab list is one tab stop); the tab list and
 * panel semantics come from the Zag tabs machine. For parts that each have their own address use SubNav.
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
  const service = useMachine(zag.machine, {
    id: useId(),
    value,
    activationMode: "automatic",
    onValueChange: (details) => onChange(details.value),
  });
  const api = zag.connect(service, normalizeProps);

  return (
    <div {...api.getRootProps()}>
      <div class="tabs" {...api.getListProps()} aria-label={label}>
        {items.map((item) => (
          <button key={item.key} type="button" class="tab" {...api.getTriggerProps({ value: item.key, disabled: item.disabled })}>
            {item.label}
          </button>
        ))}
      </div>
      <div class="tab-panel" {...api.getContentProps({ value })}>
        {children}
      </div>
    </div>
  );
}
