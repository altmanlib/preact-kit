import { defineDemo } from "../../demo.ts";
import { Button } from "../button/index.tsx";
import { PageHead, Section } from "./index.tsx";

export default defineDemo({
  name: "Heading",
  kind: "primitive",
  summary: "PageHead and Section: the title blocks of a page.",
  examples: [
    {
      title: "PageHead",
      note: "Actions go in the children; `intro` reads with the title as one unit.",
      render: () => (
        <div class="demo-stack">
          <PageHead title="Orders" intro="Every order created through the API.">
            <Button variant="primary">New order</Button>
          </PageHead>
        </div>
      ),
    },
    {
      title: "Section",
      note: "An open block with no box; use `<h3>` for sub-headings inside.",
      render: () => (
        <div class="demo-stack">
          <Section title="Webhook" intro="Where results are posted." actions={<Button size="sm">Edit</Button>}>
            <p>https://example.com/notify</p>
            <h3>Retries</h3>
            <p class="muted">Up to five attempts, one minute apart.</p>
          </Section>
        </div>
      ),
    },
  ],
});
