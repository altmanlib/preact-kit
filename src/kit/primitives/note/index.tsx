import "./note.css";

import type { ComponentChildren } from "preact";

import { errorMessage } from "../../lib/errors.ts";
import { kitText } from "../../texts.ts";

/** A tinted line of text with a tone. `role` makes assistive technology announce it; `as` swaps the element where a `<p>` cannot go. */
export function Note({
  tone,
  role,
  testId,
  as: Element = "p",
  children,
}: {
  tone: "ok" | "warn" | "bad";
  role?: "status" | "alert";
  testId?: string;
  as?: "p" | "span";
  children: ComponentChildren;
}) {
  return (
    <Element class={`note note-${tone}`} role={role} data-testid={testId}>
      {children}
    </Element>
  );
}

/** The sentence for a failure, with a retry when `onRetry` is given. Shows nothing for no error, so it can be placed unconditionally. */
export function ErrorNote({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  if (error === null || error === undefined) return null;
  return (
    <Note tone="bad" role="alert">
      {errorMessage(error)}
      {onRetry ? (
        <button type="button" class="note-retry" onClick={onRetry}>
          {kitText.retry}
        </button>
      ) : null}
    </Note>
  );
}
