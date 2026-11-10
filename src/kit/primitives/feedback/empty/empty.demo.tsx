import { defineDemo } from "../../../demo.ts";
import { Section } from "../../data-display/heading/index.tsx";
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
      note: "`compact` has no illustration or fill, little padding, and is left-aligned: for a spot inside a list or a panel.",
      render: () => (
        <div class="demo-stack">
          <Empty compact />
          <Empty compact>No items in this group.</Empty>
        </div>
      ),
    },
    {
      title: "Compact in a section",
      note: 'Next to a heading the host provides the surface, so only the line of text is left. It lines up with the title; pass `align="center"` to centre it.',
      render: () => (
        <div class="demo-stack">
          <Section title="Attachments">
            <Empty compact>Nothing attached.</Empty>
          </Section>
          <Section title="Centered">
            <Empty compact align="center">
              Nothing attached.
            </Empty>
          </Section>
        </div>
      ),
    },
  ],
});
