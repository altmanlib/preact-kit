import "./accordion.css";

import { ChevronDown } from "lucide-preact";
import type { ComponentChildren } from "preact";
import { useId } from "preact/hooks";

export type AccordionItem = { key: string; title: string; content: ComponentChildren; /** Start expanded. */ open?: boolean };

/**
 * Sections that expand and collapse, built on the native `<details>`, so keyboard, find-in-page and no-script all work.
 * By default only one section is open at a time (the browser closes the others); with `multiple` they open independently.
 */
export function Accordion({ items, multiple = false }: { items: AccordionItem[]; multiple?: boolean }) {
  const group = useId();
  return (
    <div class="accordion">
      {items.map((item) => (
        <details key={item.key} class="accordion-item" name={multiple ? undefined : group} open={item.open}>
          <summary>
            {item.title}
            <ChevronDown class="accordion-chevron" size={16} aria-hidden="true" />
          </summary>
          <div class="accordion-content">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
