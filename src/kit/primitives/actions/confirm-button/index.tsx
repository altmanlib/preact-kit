import { useSignal } from "@preact/signals";

import { kitText } from "../../../texts.ts";
import { Modal } from "../../overlays/modal/index.tsx";
import { Button, type ButtonProps } from "../button/index.tsx";

/**
 * A button that asks `question` in a dialog first and runs `onConfirm` only on a yes: the one place an irreversible
 * action is confirmed. A `danger` button gets a danger confirm button. `onConfirm` may return a promise; the dialog
 * leaves when it resolves and stays open, showing `error`, when it throws.
 */
export function ConfirmButton({
  question,
  onConfirm,
  title = kitText.confirmTitle,
  confirmLabel = kitText.confirm,
  error,
  ...button
}: Omit<ButtonProps, "onClick" | "title"> & {
  question: string;
  onConfirm: () => unknown;
  /** The dialog's heading. */
  title?: string;
  confirmLabel?: string;
  /** A failed `onConfirm`, shown in the dialog. */
  error?: unknown;
}) {
  const open = useSignal(false);
  return (
    <>
      <Button {...button} onClick={() => (open.value = true)} />
      {open.value ? (
        <Modal
          title={title}
          onClose={() => (open.value = false)}
          onSubmit={onConfirm}
          submitLabel={confirmLabel}
          submitVariant={button.variant === "danger" ? "danger" : "primary"}
          error={error}
        >
          <p>{question}</p>
        </Modal>
      ) : null}
    </>
  );
}
