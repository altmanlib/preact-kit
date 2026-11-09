import "./modal.css";

import type { ComponentChildren } from "preact";

import { useLeavingDialog } from "../../../lib/leaving-dialog.ts";
import { kitText } from "../../../texts.ts";
import { DialogHead, DialogLayer } from "../../_shared/dialog-layer.tsx";
import { Button } from "../../actions/button/index.tsx";
import { ErrorNote } from "../../feedback/note/index.tsx";

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
  const head = <DialogHead api={api} title={title} onClose={leave} />;

  return (
    <DialogLayer api={api} exiting={exiting} contentClass="modal">
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
          <div class="dialog-body">
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
          <div class="dialog-body">{children}</div>
        </>
      )}
    </DialogLayer>
  );
}
