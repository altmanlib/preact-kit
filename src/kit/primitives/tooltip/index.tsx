import "../_shared/popover.css";
import "./tooltip.css";

import { normalizeProps, useMachine } from "@zag-js/preact";
import * as zag from "@zag-js/tooltip";
import type { ComponentChildren } from "preact";
import { useId } from "preact/hooks";

/**
 * A short hint for a control, shown on hover (after a short delay) and on keyboard focus, hidden on leave, blur and
 * Esc (Zag tooltip machine, which also links it to the control with `aria-describedby`). `children` is the one thing it
 * describes. Keep `text` to a few words: anything the user needs in order to act belongs in the page, not in a tooltip.
 */
export function Tooltip({ text, children }: { text: string; children: ComponentChildren }) {
  const service = useMachine(zag.machine, {
    id: useId(),
    openDelay: 300,
    closeDelay: 100,
    positioning: { placement: "top", gutter: 6, strategy: "fixed" },
  });
  const api = zag.connect(service, normalizeProps);

  return (
    <>
      <span class="tooltip-anchor" {...api.getTriggerProps()}>
        {children}
      </span>
      {api.open ? (
        <div class="popup-positioner" {...api.getPositionerProps()}>
          <div class="popup tooltip" {...api.getContentProps()}>
            {text}
          </div>
        </div>
      ) : null}
    </>
  );
}
