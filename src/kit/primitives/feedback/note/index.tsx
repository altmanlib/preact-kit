import "./note.css";

import type { ComponentChildren } from "preact";

import { errorMessage } from "../../../lib/errors.ts";
import { kitText } from "../../../texts.ts";
import { Button } from "../../actions/button/index.tsx";

/**
 * A tinted line of text with a tone. `role` makes assistive technology announce it; `as` swaps the element where a `<p>`
 * cannot go. `action` (typically a small `Button`, e.g. a retry) sits at the trailing side of the line.
 */
export function Note({
  tone,
  role,
  testId,
  as: Element = "p",
  action,
  children,
}: {
  tone: "ok" | "warn" | "bad";
  role?: "status" | "alert";
  testId?: string;
  as?: "p" | "span";
  action?: ComponentChildren;
  children: ComponentChildren;
}) {
  const classes = `note note-${tone}${action ? " note-split" : ""}`;
  return (
    <Element class={classes} role={role} data-testid={testId}>
      {action ? (
        <>
          <span class="note-text">{children}</span>
          <span class="note-action">{action}</span>
        </>
      ) : (
        children
      )}
    </Element>
  );
}

/** The sentence for a failure, with a retry when `onRetry` is given. Shows nothing for no error, so it can be placed unconditionally. */
export function ErrorNote({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  if (error === null || error === undefined) return null;
  return (
    <Note
      tone="bad"
      role="alert"
      action={
        onRetry ? (
          <Button variant="text" size="sm" onClick={onRetry}>
            {kitText.retry}
          </Button>
        ) : undefined
      }
    >
      {errorMessage(error)}
    </Note>
  );
}
