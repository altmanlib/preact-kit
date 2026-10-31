import "../chips/chips.css";

/** Tabs for the parts of one page that each have their own address; the part whose `key` is `current` is marked as the standing page. */
export function SubNav({ label, items, current }: { label: string; items: { key: string; href: string; label: string }[]; current: string }) {
  return (
    <nav class="subnav" aria-label={label}>
      {items.map((item) => (
        <a key={item.key} href={item.href} aria-current={item.key === current ? "page" : undefined}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
