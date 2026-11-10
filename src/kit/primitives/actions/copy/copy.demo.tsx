import { defineDemo } from "../../../demo.ts";
import { CopyBlock, CopyButton, CopyField } from "./index.tsx";

const snippet = `<div class="card">
  <h2>Welcome</h2>
  <p>Hello, world.</p>
</div>`;

export default defineDemo({
  name: "Copy",
  kind: "primitive",
  summary: "CopyButton, CopyField and CopyBlock: copy a value, with an answer for a moment.",
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
      title: "CopyBlock",
      note: "A read-only <pre> for a multiline value: monospace, wrapping lines, with the copy button in the top-right corner.",
      render: () => (
        <div class="demo-stack">
          <CopyBlock label="Embed snippet" value={snippet} />
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
