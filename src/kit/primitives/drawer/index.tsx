import "./drawer.css";

import type { ComponentChildren } from "preact";

import { useLeavingDialog } from "../../lib/leaving-dialog.ts";
import { kitText } from "../../texts.ts";
import { DialogHead, DialogLayer } from "../_shared/dialog-layer.tsx";
import { Button } from "../button/index.tsx";
import { ErrorNote } from "../note/index.tsx";

/**
 * A right-side drawer (Zag dialog machine: focus trap, scroll lock, focus return): a form that slides in over the
 * dimmed page, and slides out again before it unmounts. The action buttons follow the content; with `stickyFooter` they
 * stay at the bottom of the panel instead. It renders in a portal on `document.body`.
 */
export function Drawer({
  title,
  onClose,
  onSubmit,
  submitLabel = kitText.confirm,
  submitDisabled = false,
  stickyFooter = false,
  error,
  children,
}: {
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  submitDisabled?: boolean;
  /** Pin the action buttons to the bottom of the panel rather than placing them right after the content. */
  stickyFooter?: boolean;
  /** A failed submit, shown at the end of the form. */
  error?: unknown;
  children: ComponentChildren;
}) {
  const { api, exiting, leave } = useLeavingDialog({ onClose, focusFirst: true });
  return (
    <DialogLayer api={api} exiting={exiting} contentClass="drawer-panel" positionerClass="drawer">
      <form
        class={stickyFooter ? "drawer-form drawer-sticky" : "drawer-form"}
        onSubmit={(event) => {
          event.preventDefault();
          if (!submitDisabled) onSubmit();
        }}
      >
        <DialogHead api={api} title={title} onClose={leave} />
        <div class="dialog-body drawer-body">
          {children}
          <ErrorNote error={error} />
        </div>
        <footer class="drawer-foot">
          <Button variant="quiet" onClick={leave}>
            {kitText.cancel}
          </Button>
          <Button type="submit" variant="primary" disabled={submitDisabled}>
            {submitLabel}
          </Button>
        </footer>
      </form>
    </DialogLayer>
  );
}
