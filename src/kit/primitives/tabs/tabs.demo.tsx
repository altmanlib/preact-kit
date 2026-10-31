import { useSignal } from "@preact/signals";

import { defineDemo } from "../../demo.ts";
import { Tabs } from "./index.tsx";

function TabsDemo() {
  const tab = useSignal("overview");
  return (
    <div class="demo-stack">
      <Tabs
        label="Order sections"
        value={tab.value}
        onChange={(key) => (tab.value = key)}
        items={[
          { key: "overview", label: "Overview" },
          { key: "history", label: "History" },
          { key: "refunds", label: "Refunds", disabled: true },
          { key: "raw", label: "Raw" },
        ]}
      >
        <p class="muted">Panel for “{tab.value}”.</p>
      </Tabs>
    </div>
  );
}

export default defineDemo({
  name: "Tabs",
  kind: "primitive",
  summary: "Tabs that switch a panel in place.",
  examples: [{ title: "With a disabled tab", note: "Arrow keys, Home and End move between tabs; the list is one tab stop.", render: () => <TabsDemo /> }],
});
