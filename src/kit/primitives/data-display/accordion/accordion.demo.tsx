import { defineDemo } from "../../../demo.ts";
import { Accordion } from "./index.tsx";

const ITEMS = [
  { key: "billing", title: "How is billing calculated?", content: "Per seat, per month, prorated to the day.", open: true },
  { key: "export", title: "Can I export my data?", content: "Yes: orders and members export as CSV from Settings." },
  { key: "cancel", title: "How do I cancel?", content: "Any time from Settings; access stays until the period ends." },
];

export default defineDemo({
  name: "Accordion",
  kind: "primitive",
  summary: "Sections that expand and collapse, on the native details element.",
  examples: [
    {
      title: "One open at a time",
      render: () => (
        <div class="demo-stack">
          <Accordion items={ITEMS} />
        </div>
      ),
    },
    {
      title: "Independent",
      note: "`multiple` lets several stay open.",
      render: () => (
        <div class="demo-stack">
          <Accordion items={ITEMS} multiple />
        </div>
      ),
    },
  ],
});
