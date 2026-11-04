import "./toast.css";

import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-preact";
import { useEffect, useRef } from "preact/hooks";

import { afterLeave } from "../../lib/leave.ts";
import { dismissToast, removeToast, type ToastItem, toasts } from "../../lib/toasts.ts";
import { kitText } from "../../texts.ts";
import { IconButton } from "../icon-button/index.tsx";

const ICONS = { info: Info, ok: CircleCheck, warn: TriangleAlert, bad: CircleAlert };

function ToastView({ item }: { item: ToastItem }) {
  const Icon = ICONS[item.tone];
  const element = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const left = useRef(item.duration);
  const startedAt = useRef(0);

  const start = () => {
    if (item.duration === 0 || item.leaving) return;
    clearTimeout(timer.current);
    startedAt.current = Date.now();
    timer.current = setTimeout(() => dismissToast(item.id), left.current);
  };
  // Hovering or focusing a toast pauses its countdown; leaving resumes with the time that was left.
  const pause = () => {
    if (item.duration === 0 || item.leaving) return;
    clearTimeout(timer.current);
    left.current = Math.max(left.current - (Date.now() - startedAt.current), 1000);
  };
  useEffect(() => {
    start();
    return () => clearTimeout(timer.current);
  }, []);
  // Once dismissed, stop the countdown and take the toast off the list when its exit animation ends.
  useEffect(() => {
    if (!item.leaving || !element.current) return;
    clearTimeout(timer.current);
    return afterLeave(element.current, () => removeToast(item.id));
  }, [item.leaving]);

  return (
    <div
      ref={element}
      class={`toast toast-${item.tone} ${item.leaving ? "leaving" : "enter"}`}
      role={item.tone === "bad" ? "alert" : "status"}
      onMouseEnter={pause}
      onMouseLeave={start}
      onFocusIn={pause}
      onFocusOut={start}
    >
      <Icon class="toast-icon" size={16} aria-hidden="true" />
      <p class="toast-message">{item.message}</p>
      <IconButton label={kitText.close} onClick={() => dismissToast(item.id)}>
        <X aria-hidden="true" />
      </IconButton>
    </div>
  );
}

/**
 * Draws the toasts raised by `showToast` (lib/toasts.ts): mount it once near the root. It lives in the top layer, so
 * toasts stay above an open Modal or Drawer. Each leaves by itself after its duration (0 keeps it), pausing while the
 * pointer or focus is on it; a failure is announced as an alert, the rest politely.
 */
export function Toaster() {
  const region = useRef<HTMLDivElement>(null);
  const items = toasts.value;
  const newest = items.at(-1)?.id;

  useEffect(() => {
    const element = region.current;
    if (!element) return;
    const shown = element.matches(":popover-open");
    if (newest === undefined) {
      if (shown) element.hidePopover();
      return;
    }
    // Showing again moves the region to the front, which is needed when a dialog opened after it.
    if (shown && document.documentElement.classList.contains("dialog-open")) element.hidePopover();
    if (!element.matches(":popover-open")) element.showPopover();
  }, [newest]);

  return (
    <div ref={region} popover="manual" class="toaster" role="region" aria-label={kitText.notifications}>
      {items.map((item) => (
        <ToastView key={item.id} item={item} />
      ))}
    </div>
  );
}
