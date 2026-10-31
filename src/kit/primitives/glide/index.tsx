import "./glide.css";

import type { ComponentChildren } from "preact";
import { useLayoutEffect, useRef } from "preact/hooks";

/** Follows the height of its content with a transition, so a form that swaps for a taller or shorter one does not jump. */
export function GlideHeight({ children }: { children: ComponentChildren }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const box = outer.current;
    const content = inner.current;
    if (!box || !content) return;
    let first = true;
    const follow = () => {
      box.style.height = `${content.offsetHeight}px`;
      // The first height is set at once; moves after it glide.
      if (first) {
        first = false;
        requestAnimationFrame(() => box.classList.add("glide-on"));
      }
    };
    const watch = new ResizeObserver(follow);
    watch.observe(content);
    follow();
    return () => watch.disconnect();
  }, []);
  return (
    <div class="glide" ref={outer}>
      <div ref={inner}>{children}</div>
    </div>
  );
}
