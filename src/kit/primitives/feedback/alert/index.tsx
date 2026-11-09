import "./alert.css";

import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-preact";
import type { ComponentChildren } from "preact";

import { kitText } from "../../../texts.ts";
import { IconButton } from "../../actions/icon-button/index.tsx";

const ICONS = { info: Info, ok: CircleCheck, warn: TriangleAlert, bad: CircleAlert };

/**
 * A block-level message with an icon, an optional title and optional actions (and a close button when `onClose` is given).
 * Heavier than Note: use it for something the page is about, such as a limit reached or a failed import; use Note for a
 * line under a field. A failure is announced as an alert, the rest politely.
 */
export function Alert({
  tone = "info",
  title,
  actions,
  onClose,
  children,
}: {
  tone?: "info" | "ok" | "warn" | "bad";
  title?: string;
  /** Buttons or links under the message. */
  actions?: ComponentChildren;
  onClose?: () => void;
  children?: ComponentChildren;
}) {
  const Icon = ICONS[tone];
  return (
    <div class={`alert alert-${tone}`} role={tone === "bad" ? "alert" : "status"}>
      <Icon class="alert-icon" size={18} aria-hidden="true" />
      <div class="alert-body">
        {title ? <p class="alert-title">{title}</p> : null}
        {children ? <div class="alert-text">{children}</div> : null}
        {actions ? <div class="alert-actions">{actions}</div> : null}
      </div>
      {onClose ? (
        <IconButton label={kitText.close} onClick={onClose}>
          <X aria-hidden="true" />
        </IconButton>
      ) : null}
    </div>
  );
}
