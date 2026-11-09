import { defineDemo } from "../../../demo.ts";
import { ApiError } from "../../../lib/errors.ts";
import { QueryStatus, type StatusQuery } from "./index.tsx";

const query = (patch: Partial<StatusQuery>): StatusQuery => ({ isPending: false, error: null, refetch: () => undefined, ...patch });

export default defineDemo({
  name: "QueryStatus",
  kind: "primitive",
  summary: "What a read shows until it has data: the skeleton, or the error with a retry.",
  examples: [
    {
      title: "Pending",
      note: "`loading` picks the skeleton's shape; the default is lines.",
      render: () => (
        <div class="demo-stack">
          <QueryStatus query={query({ isPending: true })} loading={{ rows: 2 }} />
        </div>
      ),
    },
    {
      title: "Failed",
      render: () => (
        <div class="demo-stack">
          <QueryStatus query={query({ error: new ApiError(500, "unknown") })} />
        </div>
      ),
    },
    {
      title: "Loaded",
      note: "Draws nothing, so it can sit above the content unconditionally.",
      render: () => (
        <div class="demo-stack">
          <QueryStatus query={query({})} />
          <p class="muted">The content follows here.</p>
        </div>
      ),
    },
  ],
});
