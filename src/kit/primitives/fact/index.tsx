import "./fact.css";

import type { ComponentChildren } from "preact";

/** The detail list of one record: label column and value column, one hairline per row. Fill it with `Fact`s. */
export function Facts({ children }: { children: ComponentChildren }) {
  return <dl class="facts">{children}</dl>;
}

/** One line of a fact list. `class` (e.g. `mono wrap`) and `testId` go to the value. */
export function Fact({ label, class: className, testId, children }: { label: string; class?: string; testId?: string; children: ComponentChildren }) {
  return (
    <>
      <dt>{label}</dt>
      <dd class={className} data-testid={testId}>
        {children}
      </dd>
    </>
  );
}
