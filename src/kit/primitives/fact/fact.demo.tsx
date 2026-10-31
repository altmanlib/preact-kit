import { defineDemo } from "../../demo.ts";
import { Badge } from "../badge/index.tsx";
import { Fact, Facts } from "./index.tsx";

export default defineDemo({
  name: "Fact",
  kind: "primitive",
  summary: "A label and value list for one record.",
  examples: [
    {
      title: "Facts",
      note: 'Pass `class="mono"` for ids and times, `mono wrap` for long values.',
      render: () => (
        <div class="demo-stack">
          <Facts>
            <Fact label="Order">
              <span class="mono">ORD-20261031-0042</span>
            </Fact>
            <Fact label="Status">
              <Badge tone="ok">Paid</Badge>
            </Fact>
            <Fact label="Created" class="mono">
              2026-10-31 09:12:44
            </Fact>
            <Fact label="Callback" class="mono wrap">
              https://merchant.example.com/api/payments/notify?order=ORD-20261031-0042
            </Fact>
          </Facts>
        </div>
      ),
    },
  ],
});
