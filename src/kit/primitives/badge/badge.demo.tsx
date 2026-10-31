import { defineDemo } from "../../demo.ts";
import { Badge } from "./index.tsx";

export default defineDemo({
  name: "Badge",
  kind: "primitive",
  summary: "A pill that carries a state.",
  examples: [
    {
      title: "Tones",
      note: "ok: fine, warn: waiting, bad: wrong, idle: nothing to do.",
      render: () => (
        <>
          <Badge tone="ok">Paid</Badge>
          <Badge tone="warn">Pending</Badge>
          <Badge tone="bad">Failed</Badge>
          <Badge tone="idle">Closed</Badge>
        </>
      ),
    },
  ],
});
