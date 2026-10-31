import { useId } from "preact/hooks";

/**
 * The names that tie a popover to its trigger: `id` is the popover's id (for `popovertarget`), `anchor` is the CSS
 * anchor name (a dashed ident) the trigger declares and the popover positions itself against.
 */
export function useAnchor(): { id: string; anchor: string } {
  const key = useId().replace(/[^a-zA-Z0-9]/g, "");
  return { id: `pop-${key}`, anchor: `--anchor-${key}` };
}
