import "./dialog.css";

import type * as zag from "@zag-js/dialog";
import { X } from "lucide-preact";
import type { ComponentChildren, RefObject } from "preact";
import { createPortal } from "preact/compat";

import { kitText } from "../../texts.ts";
import { IconButton } from "../icon-button/index.tsx";

/** The title row of a dialog: the heading, linked to the dialog as its name, and a close button. */
export function DialogHead({ api, title, onClose }: { api: zag.Api; title: string; onClose: () => void }) {
  return (
    <header class="dialog-head">
      <h2 {...api.getTitleProps()}>{title}</h2>
      <IconButton label={kitText.close} onClick={onClose}>
        <X aria-hidden="true" />
      </IconButton>
    </header>
  );
}

/**
 * The layers every kit dialog shares, rendered in a portal on `document.body`: the dimmed scrim, the full-viewport
 * positioner, and the content. All three stay rendered (`hidden={false}`) while the exit animation plays, which the
 * styles key on `data-state="closed"`. `exiting` is the content element, the one `useLeavingDialog` waits on.
 */
export function DialogLayer({
  api,
  exiting,
  contentClass,
  positionerClass,
  label,
  children,
}: {
  api: zag.Api;
  exiting: RefObject<HTMLDivElement | null>;
  /** The class of the content element (the sheet, the panel). */
  contentClass: string;
  /** Extra class for the positioner, to place the content somewhere other than the centre. */
  positionerClass?: string;
  /** The content's accessible name, when no visible title is linked to it. */
  label?: string;
  children: ComponentChildren;
}) {
  return createPortal(
    <>
      <div class="dialog-backdrop" {...api.getBackdropProps()} hidden={false} />
      <div class={positionerClass ? `dialog-positioner ${positionerClass}` : "dialog-positioner"} {...api.getPositionerProps()}>
        <div class={contentClass} {...api.getContentProps()} aria-label={label} hidden={false} ref={exiting}>
          {children}
        </div>
      </div>
    </>,
    document.body,
  );
}
