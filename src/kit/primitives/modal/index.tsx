import "../_shared/dialog.css";
import "./modal.css";

import { X } from "lucide-preact";
import type { ComponentChildren } from "preact";
import { createPortal } from "preact/compat";

import { useLeavingDialog } from "../../lib/leaving-dialog.ts";
import { kitText } from "../../texts.ts";
import { Button } from "../button/index.tsx";
import { IconButton } from "../icon-button/index.tsx";
import { ErrorNote } from "../note/index.tsx";

/**
 * A centred dialog (Zag dialog machine: focus trap, scroll lock, focus return). Without `onSubmit` it is only for
 * looking; with `onSubmit` it is a short form with cancel and confirm. Esc, the close button and a click on the dimmed
 * page all leave with the reverse of the enter motion; a successful submit does the same after `onSubmit` resolves.
 * It renders in a portal on `document.body`, above the page's own stacking contexts.
 */
export function Modal({
  title,
  onClose,
  onSubmit,
  submitLabel = kitText.confirm,
  submitVariant = "primary",
  submitDisabled = false,
  footerStart,
  error,
  children,
}: {
  title: string;
  onClose: () => void;
  /** When set, the dialog is a form with cancel and confirm. May return a promise; the dialog leaves once it resolves. */
  onSubmit?: () => unknown;
  submitLabel?: string;
  /** `danger` for a dialog that confirms a destructive action. */
  submitVariant?: "primary" | "danger";
  submitDisabled?: boolean;
  /** Optional content at the start of the form footer (opposite the cancel/confirm actions). */
  footerStart?: ComponentChildren;
  /** A failed submit, shown at the end of the form. */
  error?: unknown;
  children: ComponentChildren;
}) {
  const isForm = onSubmit !== undefined;
  const { api, exiting, leave } = useLeavingDialog({ onClose, focusFirst: isForm });
  const head = (
    <header class="modal-head">
      <h2 {...api.getTitleProps()}>{title}</h2>
      <IconButton label={kitText.close} onClick={leave}>
        <X aria-hidden="true" />
      </IconButton>
    </header>
  );

  return createPortal(
    <>
      <div class="dialog-backdrop" {...api.getBackdropProps()} hidden={false} />
      <div class="dialog-positioner" {...api.getPositionerProps()}>
        <div class="modal" {...api.getContentProps()} hidden={false} ref={exiting}>
          {isForm ? (
            <form
              class="modal-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (submitDisabled) return;
                void Promise.resolve(onSubmit())
                  .then(() => leave())
                  .catch(() => {
                    /* The caller keeps the dialog open and surfaces the failure through `error`. */
                  });
              }}
            >
              {head}
              <div class="modal-body">
                {children}
                <ErrorNote error={error} />
              </div>
              <footer class="modal-foot">
                {footerStart}
                <div class="modal-foot-actions">
                  <Button variant="quiet" onClick={leave}>
                    {kitText.cancel}
                  </Button>
                  <Button type="submit" variant={submitVariant} disabled={submitDisabled}>
                    {submitLabel}
                  </Button>
                </div>
              </footer>
            </form>
          ) : (
            <>
              {head}
              <div class="modal-body">{children}</div>
            </>
          )}
        </div>
      </div>
    </>,
    document.body,
  );
}
