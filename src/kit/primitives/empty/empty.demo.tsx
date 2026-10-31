import { defineDemo } from "../../demo.ts";
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
  ],
});
