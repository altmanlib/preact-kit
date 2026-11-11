import "./drawer.css";

import type { ComponentChildren } from "preact";

import { useLeavingDialog } from "../../../lib/leaving-dialog.ts";
import { kitText } from "../../../texts.ts";
import { DialogHead, DialogLayer } from "../../_shared/dialog-layer.tsx";
import { Button } from "../../actions/button/index.tsx";
import { ErrorNote } from "../../feedback/note/index.tsx";

/**
 * A right-side drawer (Zag dialog machine: focus trap, scroll lock, focus return): a form that slides in over the
 * dimmed page, and slides out again before it unmounts. The action buttons follow the content; with `stickyFooter` they
 * stay at the bottom of the panel instead. Without `onSubmit` it is a viewing panel: no wrapping form and no footer, so
 * the content may hold its own forms and is closed from the title row or Escape. It renders in a portal on `document.body`.
 */
export function Drawer({
  title,
  onClose,
  onSubmit,
  submitLabel = kitText.confirm,
  submitDisabled = false,
  stickyFooter = false,
  width,
  error,
  children,
}: {
  title: string;
  onClose: () => void;
  /** Omit it for a viewing panel without the form and the footer. */
  onSubmit?: () => void;
  submitLabel?: string;
  submitDisabled?: boolean;
  /** Pin the action buttons to the bottom of the panel rather than placing them right after the content. */
  stickyFooter?: boolean;
  /** A CSS length for the panel width; the default is `--drawer-width`. */
  width?: string;
  /** A failed submit, shown at the end of the form. */
  error?: unknown;
  children: ComponentChildren;
}) {
  const { api, exiting, leave } = useLeavingDialog({ onClose, focusFirst: true });
  const style = width === undefined ? undefined : `--drawer-width: ${width}`;
  if (onSubmit === undefined) {
    return (
      <DialogLayer api={api} exiting={exiting} contentClass="drawer-panel" positionerClass="drawer" style={style}>
        <div class="drawer-form drawer-view">
          <DialogHead api={api} title={title} onClose={leave} />
          <div class="dialog-body drawer-body">{children}</div>
        </div>
      </DialogLayer>
    );
  }
  return (
    <DialogLayer api={api} exiting={exiting} contentClass="drawer-panel" positionerClass="drawer" style={style}>
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
