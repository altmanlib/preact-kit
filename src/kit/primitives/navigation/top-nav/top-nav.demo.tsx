import { useSignal } from "@preact/signals";

import { defineDemo } from "../../../demo.ts";
import { TopNav, type TopNavItem } from "./index.tsx";

const ITEMS: TopNavItem[] = [
  { href: "/overview", label: "Overview", exact: true },
  { href: "/orders", label: "Orders", exact: false },
  { href: "/settings", label: "Settings", exact: false },
];

function Bar() {
  const path = useSignal("/orders/ORD-0042");
  return (
    <div class="demo-stack">
      <div
        style="display: flex; min-height: var(--bar-h); background: var(--surface); box-shadow: var(--shadow-bar)"
        onClickCapture={(event) => {
          const link = (event.target as HTMLElement).closest("a");
          if (!link) return;
          event.preventDefault();
          path.value = link.getAttribute("href") ?? path.value;
        }}
      >
        <TopNav items={ITEMS} path={path.value} />
      </div>
    </div>
  );
}

export default defineDemo({
  name: "TopNav",
  kind: "primitive",
  summary: "The tabs of a top bar, with one rule that slides to the standing page.",
  examples: [
    {
      title: "Standing page",
      note: "`exact` marks only that path; without it the pages below it count too (here `/orders/ORD-0042` keeps Orders marked). Click the tabs to see the rule slide.",
      render: () => <Bar />,
    },
  ],
});
