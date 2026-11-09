import "./breadcrumb.css";

import { ChevronRight } from "lucide-preact";

import { kitText } from "../../../texts.ts";

export type Crumb = { label: string; href?: string };

/** The path to the current page: links for the ancestors, plain text for the last item (`items` ends with the current page, which needs no `href`). */
export function Breadcrumb({ items, label = kitText.breadcrumb }: { items: Crumb[]; label?: string }) {
  return (
    <nav class="breadcrumb" aria-label={label}>
      <ol>
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${index}-${item.label}`}>
              {last || item.href === undefined ? <span aria-current={last ? "page" : undefined}>{item.label}</span> : <a href={item.href}>{item.label}</a>}
              {last ? null : <ChevronRight class="breadcrumb-sep" size={14} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
