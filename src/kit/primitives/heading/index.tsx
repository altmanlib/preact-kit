import "./heading.css";

import type { ComponentChildren } from "preact";

/** A head with the line that explains it: placed in one block so the two sit closer than the page's own gap. */
function HeadIntro({ intro, children }: { intro?: ComponentChildren; children: ComponentChildren }) {
  if (intro === undefined) return <>{children}</>;
  return (
    <div class="head-intro">
      {children}
      <p class="muted">{intro}</p>
    </div>
  );
}

/** The page title with its actions (`children`) on the right; an `intro` line sits right under the title as one unit. */
export function PageHead({ title, intro, children }: { title: string; intro?: ComponentChildren; children?: ComponentChildren }) {
  return (
    <HeadIntro intro={intro}>
      <header class="page-head">
        <h1>{title}</h1>
        {children}
      </header>
    </HeadIntro>
  );
}

/**
 * An open section: the title row (and optional `actions`, such as an edit button) above its content, with no box around
 * it. Use it for a block that takes a whole row; side-by-side peers are Tiles. Sub-headings inside are `<h3>`.
 */
export function Section({
  title,
  actions,
  intro,
  testId,
  children,
}: {
  title: ComponentChildren;
  actions?: ComponentChildren;
  /** A line right under the title, read with it as one unit. */
  intro?: ComponentChildren;
  testId?: string;
  children: ComponentChildren;
}) {
  return (
    <section class="section" data-testid={testId}>
      <HeadIntro intro={intro}>
        <div class="section-head">
          <h2>{title}</h2>
          {actions}
        </div>
      </HeadIntro>
      {children}
    </section>
  );
}
