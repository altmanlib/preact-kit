import { defineDemo } from "../../../demo.ts";
import { Button } from "../../actions/button/index.tsx";
import { Badge } from "../badge/index.tsx";
import { Fact, Facts } from "../fact/index.tsx";
import { Card } from "./index.tsx";

export default defineDemo({
  name: "Card",
  kind: "primitive",
  summary: "A box that groups related content.",
  examples: [
    {
      title: "Title, actions and footer",
      note: "For a figure use Tile; for a block with no box use Section.",
      render: () => (
        <div class="demo-stack">
          <Card title="Webhook" actions={<Button size="sm">Edit</Button>} footer="Last delivery 2 minutes ago">
            <Facts>
              <Fact label="Endpoint" class="mono wrap">
                https://example.com/hooks/notify
              </Fact>
              <Fact label="Status">
                <Badge tone="ok">Healthy</Badge>
              </Fact>
            </Facts>
          </Card>
        </div>
      ),
    },
    {
      title: "Body only",
      render: () => (
        <div class="demo-stack">
          <Card>
            <p>A short note that needs a frame and nothing else.</p>
          </Card>
        </div>
      ),
    },
  ],
});
