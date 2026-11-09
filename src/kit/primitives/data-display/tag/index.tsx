import "./tag.css";

import { X } from "lucide-preact";
import type { ComponentChildren } from "preact";

import { kitText } from "../../../texts.ts";

/**
 * A label that belongs to a thing (a category, a filter, a recipient), optionally removable. Not a state: for a state
 * such as paid or failed use Badge.
 */
export function Tag({
  tone = "neutral",
  onRemove,
  removeLabel = kitText.remove,
  children,
}: {
  tone?: "neutral" | "accent";
  onRemove?: () => void;
  removeLabel?: string;
  children: ComponentChildren;
}) {
  return (
    <span class={tone === "accent" ? "tag tag-accent" : "tag"}>
      {children}
      {onRemove ? (
        <button type="button" class="tag-remove" aria-label={removeLabel} title={removeLabel} onClick={onRemove}>
          <X size={12} aria-hidden="true" />
        </button>
      ) : null}
    </span>
  );
}
