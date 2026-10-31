import { useSignal, useSignalEffect } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";

/**
 * The life of a native `<dialog>` that is shown as a modal and leaves with an exit animation: it opens on mount, keeps
 * the page behind it from scrolling, and calls `onClose` only once the exit animation has ended. `leave()` starts the
 * exit (or closes at once under reduced motion); `finish()` is for the dialog's own `close` event.
 *
 * `animate` says which element carries the exit animation: the dialog itself (Modal) or the `panel` inside it (Drawer).
 * Give the element a `leaving` class while `leaving` is true.
 */
export function useLeavingDialog({ onClose, animate, focusFirst }: { onClose: () => void; animate: "dialog" | "panel"; focusFirst: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const leavingRef = useRef(false);
  const closed = useRef(false);
  const leaving = useSignal(false);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!element.open) element.showModal();
    document.documentElement.classList.add("dialog-open");
    return () => document.documentElement.classList.remove("dialog-open");
  }, []);

  useEffect(() => {
    if (focusFirst) dialog.current?.querySelector<HTMLElement>("input, textarea")?.focus();
  }, [focusFirst]);

  const finish = () => {
    if (closed.current) return;
    closed.current = true;
    if (dialog.current?.open) dialog.current.close();
    onClose();
  };
  const leave = () => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    leaving.value = true;
  };

  // Close only once the exit animation has finished; the timeout is the fallback when it never fires.
  useSignalEffect(() => {
    if (!leaving.value) return;
    const element = animate === "panel" ? panel.current : dialog.current;
    if (!element) return;
    let done = false;
    const end = () => {
      if (done) return;
      done = true;
      element.removeEventListener("animationend", onEnd);
      clearTimeout(timer);
      finish();
    };
    const onEnd = (event: AnimationEvent) => {
      if (event.target === element) end();
    };
    element.addEventListener("animationend", onEnd);
    const timer = setTimeout(end, 400);
    return () => {
      clearTimeout(timer);
      element.removeEventListener("animationend", onEnd);
    };
  });

  return { dialog, panel, leaving: leaving.value, leave, finish };
}
