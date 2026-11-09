import { defineDemo } from "../../../demo.ts";
import { Empty } from "./index.tsx";

export default defineDemo({
  name: "Empty",
  kind: "primitive",
  summary: "The state of a list that came back without rows.",
  examples: [
    {
      title: "Stock sentence",
      render: () => (
        <div class="demo-stack">
          <Empty />
        </div>
      ),
    },
    {
      title: "Own sentence",
      note: "Say what to do next when there is something to do.",
      render: () => (
        <div class="demo-stack">
          <Empty>No orders yet. Create one to see it here.</Empty>
        </div>
      ),
    },
    {
      title: "Compact",
      note: "`compact` has no illustration or fill and little padding: for a spot inside a list or a panel.",
      render: () => (
        <div class="demo-stack">
          <Empty compact />
          <Empty compact>No items in this group.</Empty>
        </div>
      ),
    },
    {
      title: "Compact in a panel",
      note: "Next to a heading the host provides the surface, so only the line of text is left.",
      render: () => (
        <div class="demo-stack" style="max-width: 20rem; padding: var(--space-3); background: var(--card-inner); border-radius: var(--radius)">
          <h3>Attachments</h3>
          <Empty compact>Nothing attached.</Empty>
        </div>
      ),
    },
  ],
});
