import "./copy.css";

import { useSignal } from "@preact/signals";
import { Check, Copy, TriangleAlert } from "lucide-preact";

import { kitText } from "../../../texts.ts";
import { IconButton } from "../icon-button/index.tsx";

/** An icon-only button that copies `value` to the clipboard and answers with a tick or a warning for a moment. A function is called at click time, so a value that must not sit in the page can be fetched on demand. */
export function CopyButton({ value, title = kitText.copy }: { value: string | (() => Promise<string>); title?: string }) {
  const copied = useSignal<"idle" | "done" | "failed">("idle");
  const state = copied.value;
  const label = state === "done" ? kitText.copied : state === "failed" ? kitText.copyFailed : title;
  return (
    <IconButton
      label={label}
      state={state === "done" ? "ok" : state === "failed" ? "bad" : undefined}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(typeof value === "string" ? value : await value());
          copied.value = "done";
        } catch {
          copied.value = "failed";
        }
        setTimeout(() => {
          copied.value = "idle";
        }, 1500);
      }}
    >
      {state === "done" ? <Check aria-hidden="true" /> : state === "failed" ? <TriangleAlert aria-hidden="true" /> : <Copy aria-hidden="true" />}
    </IconButton>
  );
}

/** A read-only field showing `value`, with the copy button inside its right edge. */
export function CopyField({ value, label, copyTitle }: { value: string; label: string; copyTitle?: string }) {
  return (
    <div class="copy-field">
      <input class="input" type="text" readOnly value={value} aria-label={label} spellcheck={false} onFocus={(event) => event.currentTarget.select()} />
      <CopyButton value={value} title={copyTitle} />
    </div>
  );
}

/** A read-only multiline block showing `value` in a `<pre>`, with the copy button in the top-right corner. */
export function CopyBlock({
  value,
  label,
  copyTitle,
  class: className,
}: {
  value: string;
  /** Accessible name of the block, same role as `CopyField`'s `label`. */
  label: string;
  copyTitle?: string;
  class?: string;
}) {
  return (
    <div class={className ? `copy-block ${className}` : "copy-block"}>
      <pre class="copy-block-body" tabIndex={0} aria-label={label}>
        {value}
      </pre>
      <CopyButton value={value} title={copyTitle} />
    </div>
  );
}
