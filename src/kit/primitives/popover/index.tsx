import "../_shared/popover.css";
import "./popover.css";

import * as zag from "@zag-js/popover";
import { normalizeProps, useMachine } from "@zag-js/preact";
import { X } from "lucide-preact";
import type { ComponentChildren } from "preact";
import { useId } from "preact/hooks";

import { kitText } from "../../texts.ts";
import { Button, type ButtonProps } from "../button/index.tsx";
import { IconButton } from "../icon-button/index.tsx";

/**
 * A button that opens a small panel of arbitrary content next to it (Zag popover machine): a filter form, a short
 * explanation, a colour picker. Esc and a click outside close it and give focus back to the button; Tab moves into the
 * panel. For a list of actions use Dropdown; for a hint on hover use Tooltip.
 */
export function Popover({
  title,
  trigger,
  align = "start",
  variant,
  size,
  children,
}: {
  /** The panel's heading and accessible name; with it the panel also gets a close button. */
  title?: string;
  /** The button's content. */
  trigger: ComponentChildren;
  /** Which edge of the button the panel lines up with. */
  align?: "start" | "end";
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  children: ComponentChildren;
}) {
  const service = useMachine(zag.machine, {
    id: useId(),
    positioning: { placement: align === "end" ? "bottom-end" : "bottom-start", gutter: 4, strategy: "fixed" },
  });
  const api = zag.connect(service, normalizeProps);

  return (
    <>
      <Button variant={variant} size={size} {...api.getTriggerProps()}>
        {trigger}
      </Button>
      <div class="popup-positioner" {...api.getPositionerProps()}>
        <div class="popup popover" {...api.getContentProps()}>
          {title ? (
            <div class="popover-head">
              <h2 class="popover-title" {...api.getTitleProps()}>
                {title}
              </h2>
              <IconButton label={kitText.close} {...api.getCloseTriggerProps()}>
                <X aria-hidden="true" />
              </IconButton>
            </div>
          ) : null}
          <div class="popover-body">{children}</div>
        </div>
      </div>
    </>
  );
}
