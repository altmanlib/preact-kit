import "./card.css";

import type { ComponentChildren } from "preact";

/**
 * A box that groups related content: a gray shell with an optional title row (and `actions` on its right), the content
 * in a lighter inner block, and an optional `footer` under it. For a figure use Tile; for a block with no box use Section.
 */
export function Card({
  title,
  actions,
  footer,
  children,
}: {
  title?: ComponentChildren;
  actions?: ComponentChildren;
  footer?: ComponentChildren;
  children: ComponentChildren;
}) {
  return (
    <section class="card">
      {title !== undefined || actions !== undefined ? (
        <header class="card-head">
          <h3>{title}</h3>
          {actions}
        </header>
      ) : null}
      <div class="card-body">{children}</div>
      {footer ? <footer class="card-foot">{footer}</footer> : null}
    </section>
  );
}
