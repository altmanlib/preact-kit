import "../../_shared/popover.css";
import "./dropdown.css";

import * as zag from "@zag-js/menu";
import { normalizeProps, useMachine } from "@zag-js/preact";
import { ChevronDown } from "lucide-preact";
import type { ComponentChildren } from "preact";
import { useId } from "preact/hooks";

import { popupPositioning } from "../../../lib/zag.ts";
import { Button, type ButtonProps } from "../../actions/button/index.tsx";

export type MenuItem = {
  key: string;
  label: string;
  onSelect: () => void;
  /** Colour the item as a destructive action. */
  tone?: "danger";
  disabled?: boolean;
};

/**
 * A button that opens a menu of actions. Arrow keys, Home, End and type-ahead move between items, Esc and a click
 * outside close the menu and give focus back to the button, and choosing an item runs it and closes the menu (Zag menu
 * machine). For choosing a value use Select.
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
  const service = useMachine(zag.machine, {
    id: useId(),
    "aria-label": label,
    positioning: popupPositioning(align === "end" ? "bottom-end" : "bottom-start"),
    onSelect: (details) => items.find((item) => item.key === details.value)?.onSelect(),
  });
  const api = zag.connect(service, normalizeProps);

  return (
    <>
      <Button variant={variant} size={size} {...api.getTriggerProps()}>
        {children}
        <ChevronDown size={16} aria-hidden="true" />
      </Button>
      <div class="popup-positioner" {...api.getPositionerProps()}>
        <div class="popup" {...api.getContentProps()}>
          {items.map((item) => (
            <div
              key={item.key}
              class={item.tone === "danger" ? "pop-item pop-item-danger" : "pop-item"}
              {...api.getItemProps({ value: item.key, disabled: item.disabled })}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
