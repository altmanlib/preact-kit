/** The contract between a component and the gallery: a `*.demo.tsx` next to the component default-exports one `Demo`. */
import type { ComponentChild } from "preact";

export type DemoExample = {
  title: string;
  /** One line on when to use this variant. */
  note?: string;
  render: () => ComponentChild;
};

export type Demo = {
  name: string;
  /** `primitive`: no business words, texts or endpoints. `pattern`: a page shape built from primitives. */
  kind: "primitive" | "pattern";
  summary: string;
  examples: DemoExample[];
};

export function defineDemo(demo: Demo): Demo {
  return demo;
}
