import "./drawer.css";

import { X } from "lucide-preact";
import type { ComponentChildren } from "preact";

import { useLeavingDialog } from "../../lib/leaving-dialog.ts";
import { kitText } from "../../texts.ts";
import { Button } from "../button/index.tsx";
import { IconButton } from "../icon-button/index.tsx";
import { ErrorNote } from "../note/index.tsx";

/**
 * A right-side drawer: a form that slides in over the dimmed page, and slides out again before it unmounts. The action
 * buttons follow the content; with `stickyFooter` they stay at the bottom of the panel instead.
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
  const { dialog, panel, leaving, leave, finish } = useLeavingDialog({ onClose, animate: "panel", focusFirst: true });
  const state = leaving ? " leaving" : "";
  return (
    <dialog
      ref={dialog}
      class={`drawer${state}`}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        leave();
      }}
      onClose={finish}
      onClick={(event) => {
        // The dialog covers the viewport; a click on it and not on the panel is a click on the dimmed page.
        if (event.target === event.currentTarget) leave();
      }}
    >
      <div ref={panel} class={`drawer-panel${state}`}>
        <form
          class={stickyFooter ? "drawer-form drawer-sticky" : "drawer-form"}
          onSubmit={(event) => {
            event.preventDefault();
            if (!submitDisabled) onSubmit();
          }}
        >
          <header class="drawer-head">
            <h2>{title}</h2>
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
    </dialog>
  );
}
