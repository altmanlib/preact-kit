import { useSignal } from "@preact/signals";
import * as zag from "@zag-js/dialog";
import { normalizeProps, useMachine } from "@zag-js/preact";
import { useId, useRef } from "preact/hooks";

import { afterLeave } from "./leave.ts";

/**
 * The life of a modal dialog (Zag dialog machine) that is mounted open and leaves with an exit animation: focus trap,
 * Esc and outside dismissal, scroll lock and focus return come from the machine, and `onClose` is called only once the
 * exit animation has ended. `leave()` starts the exit (or closes at once under reduced motion).
 *
 * Put `exiting` on the content element: it carries the exit animation and holds the form to focus. The parts stay
 * rendered during the exit (spread the `api` props, then pass `hidden={false}`), and the animation CSS keys on
 * `data-state="closed"`.
 */
export function useLeavingDialog({ onClose, focusFirst }: { onClose: () => void; focusFirst: boolean }) {
  const exiting = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  const leaving = useSignal(false);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    onClose();
  };
  const leave = () => {
    if (leaving.value) return;
    leaving.value = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !exiting.current) {
      finish();
      return;
    }
    // The timeout inside afterLeave covers an exit animation that never reports its end.
    afterLeave(exiting.current, finish);
  };

  const service = useMachine(zag.machine, {
    id: useId(),
    open: !leaving.value,
    onOpenChange: (details) => {
      if (!details.open) leave();
    },
    // A form starts on its first field, or on its submit button when it has none (a plain confirmation).
    initialFocusEl: () => {
      if (!focusFirst) return null;
      const root = exiting.current;
      return root?.querySelector<HTMLElement>("input, textarea") ?? root?.querySelector<HTMLElement>('[type="submit"]') ?? null;
    },
  });
  const api = zag.connect(service, normalizeProps);

  return { api, exiting, leave, leaving: leaving.value };
}
