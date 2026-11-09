import { defineDemo } from "../../../demo.ts";
import { CopyButton, CopyField } from "./index.tsx";

export default defineDemo({
  name: "Copy",
  kind: "primitive",
  summary: "CopyButton and CopyField: copy a value, with an answer for a moment.",
  examples: [
    {
      title: "CopyField",
      render: () => (
        <div class="demo-stack">
          <CopyField label="API endpoint" value="https://api.example.com/v1/orders" />
        </div>
      ),
    },
    {
      title: "CopyButton with a lazy value",
      note: "A function is called at click time, so a secret is fetched on demand and never sits in the page.",
      render: () => <CopyButton value={async () => "sk_live_fetched_on_click"} title="Copy key" />,
    },
  ],
});
