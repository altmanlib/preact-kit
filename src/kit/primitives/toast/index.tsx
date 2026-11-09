import "./toast.css";

import { normalizeProps, useMachine } from "@zag-js/preact";
import * as zag from "@zag-js/toast";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-preact";
import { createPortal } from "preact/compat";

import { toaster, toneOf } from "../../lib/toasts.ts";
import { kitText } from "../../texts.ts";
import { IconButton } from "../icon-button/index.tsx";

const ICONS = { info: Info, ok: CircleCheck, warn: TriangleAlert, bad: CircleAlert };

function ToastView({ item, index, parent }: { item: zag.Props; index: number; parent: zag.GroupService }) {
  const service = useMachine(zag.machine, { ...item, index, parent });
  const api = zag.connect(service, normalizeProps);
  const tone = toneOf(item.type);
  const Icon = ICONS[tone];
  return (
    <div class={`toast toast-${tone}`} {...api.getRootProps()}>
      <Icon class="toast-icon" size={16} aria-hidden="true" />
      <p class="toast-message" {...api.getTitleProps()}>
        {item.title}
      </p>
      <IconButton label={kitText.close} {...api.getCloseTriggerProps()}>
        <X aria-hidden="true" />
      </IconButton>
    </div>
  );
}

/**
 * Draws the toasts raised by `showToast` (lib/toasts.ts) on the Zag toast machine: mount it once near the root. The
 * stack sits above everything, including an open Modal or Drawer. Each toast leaves by itself after its duration
 * (0 keeps it), pausing while the pointer or focus is on it; at most five show at once.
 */
export function Toaster() {
  const service = useMachine(zag.group.machine, { id: "toaster", store: toaster });
  const api = zag.group.connect(service, normalizeProps);
  // A portal on the body keeps the fixed stack out of any ancestor that has a transform or containment.
  return createPortal(
    <div {...api.getGroupProps({ label: kitText.notifications })}>
      {api.getToasts().map((item, index) => (
        <ToastView key={item.id} item={item} index={index} parent={service} />
      ))}
    </div>,
    document.body,
  );
}
