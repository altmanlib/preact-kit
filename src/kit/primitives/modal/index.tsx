import "./modal.css";

import { X } from "lucide-preact";
import type { ComponentChildren } from "preact";

import { useLeavingDialog } from "../../lib/leaving-dialog.ts";
import { kitText } from "../../texts.ts";
import { Button } from "../button/index.tsx";
import { IconButton } from "../icon-button/index.tsx";
import { ErrorNote } from "../note/index.tsx";

/**
 * A centred dialog. Without `onSubmit` it is only for looking; with `onSubmit` it is a short form with cancel and confirm.
 * Esc, the close button and a click on the dimmed page all leave with the reverse of the enter motion; a successful
 * submit does the same after `onSubmit` resolves.
 */
export function Modal({
  title,
  onClose,
  onSubmit,
  submitLabel = kitText.confirm,
  submitVariant = "primary",
  submitDisabled = false,
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
  /** A failed submit, shown at the end of the form. */
  error?: unknown;
  children: ComponentChildren;
}) {
  const isForm = onSubmit !== undefined;
  const { dialog, leaving, leave, finish } = useLeavingDialog({ onClose, animate: "dialog", focusFirst: isForm });
  const head = (
    <header class="modal-head">
      <h2>{title}</h2>
      <IconButton label={kitText.close} onClick={leave}>
        <X aria-hidden="true" />
      </IconButton>
    </header>
  );

  return (
    <dialog
      ref={dialog}
      class={leaving ? "modal leaving" : "modal"}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        leave();
      }}
      onClose={finish}
      onClick={(event) => {
        // The dialog is exactly its panel, so a click that lands on the dialog itself is a click on the dimmed page.
        if (event.target === event.currentTarget) leave();
      }}
    >
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
            <Button variant="quiet" onClick={leave}>
              {kitText.cancel}
            </Button>
            <Button type="submit" variant={submitVariant} disabled={submitDisabled}>
              {submitLabel}
            </Button>
          </footer>
        </form>
      ) : (
        <>
          {head}
          <div class="modal-body">{children}</div>
        </>
      )}
    </dialog>
  );
}
