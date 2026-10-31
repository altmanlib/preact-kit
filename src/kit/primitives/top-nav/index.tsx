import "./top-nav.css";

import { useEffect, useLayoutEffect, useRef } from "preact/hooks";

import { kitText } from "../../texts.ts";

export type TopNavItem = { href: string; label: string; /** Mark only the exact path, not the pages below it. */ exact: boolean };

/** Whether `href` is the page `path` is on (or, unless `exact`, a page below it). */
export const isCurrentPath = (path: string, href: string, exact: boolean) =>
  exact ? path === href || path === `${href}/` : path === href || path.startsWith(`${href}/`);

/** The tabs of a top bar: the one for `path` is marked and a single rule slides between the links as the page changes. */
export function TopNav({ items, path, label = kitText.mainNavigation }: { items: TopNavItem[]; path: string; label?: string }) {
  const ref = useRef<HTMLElement>(null);
  const measure = () => {
    const nav = ref.current;
    if (!nav) return;
    const active = nav.querySelector<HTMLElement>('a[aria-current="page"]');
    nav.style.setProperty("--nav-on", active ? "1" : "0");
    if (!active) return;
    nav.style.setProperty("--nav-x", `${active.offsetLeft}px`);
    nav.style.setProperty("--nav-w", `${active.offsetWidth}px`);
  };
  // After every render the marked link may have changed; the first measure must not animate from the start of the bar.
  useLayoutEffect(() => {
    measure();
    const frame = requestAnimationFrame(() => ref.current?.setAttribute("data-ready", ""));
    return () => cancelAnimationFrame(frame);
  });
  // A resize or a late font changes the widths without a render.
  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    for (const link of nav.querySelectorAll("a")) observer.observe(link);
    return () => observer.disconnect();
  });
  return (
    <nav class="top-nav" aria-label={label} ref={ref}>
      {items.map((item) => (
        <a key={item.href} href={item.href} aria-current={isCurrentPath(path, item.href, item.exact) ? "page" : undefined}>
          {item.label}
        </a>
      ))}
      <span class="top-nav-indicator" aria-hidden="true" />
    </nav>
  );
}
