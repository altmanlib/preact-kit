import "../_shared/dialog.css";
import "./drawer.css";

import { X } from "lucide-preact";
import type { ComponentChildren } from "preact";
import { createPortal } from "preact/compat";

import { useLeavingDialog } from "../../lib/leaving-dialog.ts";
import { kitText } from "../../texts.ts";
import { Button } from "../button/index.tsx";
import { IconButton } from "../icon-button/index.tsx";
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
  return createPortal(
    <>
      <div class="dialog-backdrop" {...api.getBackdropProps()} hidden={false} />
      <div class="dialog-positioner drawer" {...api.getPositionerProps()}>
        <div class="drawer-panel" {...api.getContentProps()} hidden={false} ref={exiting}>
          <form
            class={stickyFooter ? "drawer-form drawer-sticky" : "drawer-form"}
            onSubmit={(event) => {
              event.preventDefault();
              if (!submitDisabled) onSubmit();
            }}
          >
            <header class="drawer-head">
              <h2 {...api.getTitleProps()}>{title}</h2>
              <IconButton label={kitText.close} onClick={leave}>
                <X aria-hidden="true" />
              </IconButton>
            </header>
            <div class="drawer-body">
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
        </div>
      </div>
    </>,
    document.body,
  );
}
