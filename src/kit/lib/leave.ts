/** How long to wait for an exit animation that never reports its end (the element is hidden, or the animation was removed). */
export const LEAVE_FALLBACK_MS = 400;

/**
 * Calls `done` once, when the animation that ends on `element` itself finishes (or after `fallbackMs` if it never does).
 * Returns a cleanup that cancels the wait; call it when the owner unmounts.
 */
export function afterLeave(element: HTMLElement, done: () => void, fallbackMs = LEAVE_FALLBACK_MS): () => void {
  let finished = false;
  const cancel = () => {
    element.removeEventListener("animationend", onEnd);
    clearTimeout(timer);
  };
  const end = () => {
    if (finished) return;
    finished = true;
    cancel();
    done();
  };
  const onEnd = (event: AnimationEvent) => {
    if (event.target === element) end();
  };
  element.addEventListener("animationend", onEnd);
  const timer = setTimeout(end, fallbackMs);
  return cancel;
}
