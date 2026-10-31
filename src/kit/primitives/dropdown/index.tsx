import "../_shared/popover.css";
import "./dropdown.css";

import { useSignal } from "@preact/signals";
import { ChevronDown } from "lucide-preact";
import type { ComponentChildren } from "preact";
import { useRef } from "preact/hooks";

import { useAnchor } from "../../lib/anchor.ts";
import { nextIndex, typeahead } from "../../lib/roving.ts";
import { Button, type ButtonProps } from "../button/index.tsx";

export type MenuItem = {
  key: string;
  label: string;
  onSelect: () => void;
  /** Colour the item as a destructive action. */
  tone?: "danger";
  disabled?: boolean;
};

/**
 * A button that opens a menu of actions. The browser's popover handles light dismiss and Esc and puts the menu above the
 * page; arrow keys, Home, End and type-ahead move between items, and choosing one runs it and closes the menu.
 * For choosing a value use Select.
 */
export function Dropdown({
  label,
  items,
  align = "start",
  variant,
  size,
  children,
}: {
  /** The menu's accessible name. */
  label: string;
  items: MenuItem[];
  /** Which edge of the button the menu lines up with. */
  align?: "start" | "end";
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  /** The button's content. */
  children: ComponentChildren;
}) {
  const { id, anchor } = useAnchor();
  const menu = useRef<HTMLDivElement>(null);
  const open = useSignal(false);

  const rows = () => [...(menu.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [])];
  const close = () => menu.current?.hidePopover();
  const isDisabled = (index: number) => items[index]?.disabled === true;

  return (
    <>
      <Button
        variant={variant}
        size={size}
        popovertarget={id}
        style={`anchor-name: ${anchor}`}
        aria-haspopup="menu"
        aria-expanded={open.value}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown" || open.value) return;
          event.preventDefault();
          menu.current?.showPopover();
        }}
      >
        {children}
        <ChevronDown size={16} aria-hidden="true" />
      </Button>
      <div
        ref={menu}
        id={id}
        popover="auto"
        role="menu"
        aria-label={label}
        class={align === "end" ? "pop pop-end" : "pop"}
        style={`position-anchor: ${anchor}`}
        onToggle={(event) => {
          open.value = event.newState === "open";
          if (event.newState === "open")
            rows()
              .find((row) => !row.disabled)
              ?.focus();
        }}
        onKeyDown={(event) => {
          if (event.key === "Tab") {
            close();
            return;
          }
          const list = rows();
          const current = list.indexOf(document.activeElement as HTMLButtonElement);
          const next =
            nextIndex({ current, count: items.length, key: event.key, orientation: "vertical", isDisabled }) ??
            typeahead({ labels: items.map((item) => item.label), current, char: event.key, isDisabled });
          if (next === undefined) return;
          event.preventDefault();
          list[next]?.focus();
        }}
      >
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            role="menuitem"
            class={item.tone === "danger" ? "pop-item pop-item-danger" : "pop-item"}
            disabled={item.disabled}
            onClick={() => {
              close();
              item.onSelect();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}
