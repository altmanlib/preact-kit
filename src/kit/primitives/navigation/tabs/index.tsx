import "../../selection/chips/chips.css";

import { normalizeProps, useMachine } from "@zag-js/preact";
import * as zag from "@zag-js/tabs";
import type { ComponentChildren } from "preact";
import { useId } from "preact/hooks";

import { type Bound, bound } from "../../../lib/signals.ts";

export type TabItem = { key: string; label: string; disabled?: boolean };

type TabsOwn = { label: string; items: TabItem[]; children: ComponentChildren };

/** The props of `Tabs`: the own props, then either a `field` signal or `value` with `onChange` (never both); the value is the key of the standing tab. */
export type TabsProps = TabsOwn & Bound<string>;

/**
 * Tabs that switch a panel without changing the address: the value is the key of the standing tab, `children` is its
 * panel. Arrow keys, Home and End move between tabs and select them (the tab list is one tab stop); the tab list and
 * panel semantics come from the Zag tabs machine. For parts that each have their own address use SubNav.
 */
export function Tabs(props: TabsProps) {
  const { value, set, rest } = bound<string, TabsOwn>(props);
  const { label, items, children } = rest;
  const service = useMachine(zag.machine, {
    id: useId(),
    value,
    activationMode: "automatic",
    onValueChange: (details) => set(details.value),
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
