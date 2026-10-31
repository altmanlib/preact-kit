import "../_shared/popover.css";
import "./tooltip.css";

import { cloneElement, type VNode } from "preact";
import { useEffect, useRef } from "preact/hooks";

import { useAnchor } from "../../lib/anchor.ts";

const SHOW_DELAY_MS = 300;

/**
 * A short hint for a control, shown on hover (after a short delay) and on keyboard focus, hidden on leave, blur and
 * Esc. `children` is the one element it describes; it is given `aria-describedby`. Keep `text` to a few words: anything
 * the user needs in order to act belongs in the page, not in a tooltip.
 */
export function Tooltip({ text, children }: { text: string; children: VNode<Record<string, unknown>> }) {
  const { id, anchor } = useAnchor();
  const tip = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const hide = () => {
    clearTimeout(timer.current);
    if (tip.current?.matches(":popover-open")) tip.current.hidePopover();
  };
  const show = (delay: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => tip.current?.showPopover(), delay);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <>
      <span
        class="tooltip-anchor"
        style={`anchor-name: ${anchor}`}
        onMouseEnter={() => show(SHOW_DELAY_MS)}
        onMouseLeave={hide}
        onFocusIn={() => show(0)}
        onFocusOut={hide}
        onKeyDown={(event) => {
          if (event.key === "Escape") hide();
        }}
      >
        {cloneElement(children, { "aria-describedby": id })}
      </span>
      <div ref={tip} id={id} popover="manual" role="tooltip" class="pop tooltip" style={`position-anchor: ${anchor}`}>
        {text}
      </div>
    </>
  );
}
