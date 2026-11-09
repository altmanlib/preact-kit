import { QueryClient, QueryClientProvider } from "@tanstack/preact-query";

import { defineDemo } from "../../demo.ts";
import { Button } from "../../primitives/actions/button/index.tsx";
import { Badge, type Tone } from "../../primitives/data-display/badge/index.tsx";
import type { Column } from "../../primitives/data-display/data-table/index.tsx";
import { ListPage } from "./index.tsx";

type Status = "paid" | "pending" | "failed";
type Row = { id: string; customer: string; status: Status };

const STATUSES: Status[] = ["paid", "pending", "failed"];
const TONES: Record<Status, Tone> = { paid: "ok", pending: "warn", failed: "bad" };

// 57 rows, so there are three pages and the last one is short.
const ALL: Row[] = Array.from({ length: 57 }, (_, index) => ({
  id: `ORD-${String(index + 1).padStart(4, "0")}`,
  customer: ["Ada", "Grace", "Alan", "Edsger", "Barbara"][index % 5] ?? "Ada",
  status: STATUSES[index % 3] ?? "paid",
}));

async function fetchPage(params: { status: Status | undefined; limit: number; offset: number }): Promise<Row[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const matching = params.status === undefined ? ALL : ALL.filter((row) => row.status === params.status);
  return matching.slice(params.offset, params.offset + params.limit);
}

const COLUMNS: Column<Row>[] = [
  { key: "id", header: "Order", cellClass: "mono", cell: (row) => row.id },
  { key: "customer", header: "Customer", cell: (row) => row.customer },
  { key: "status", header: "Status", cell: (row) => <Badge tone={TONES[row.status]}>{row.status}</Badge> },
];

const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: 60_000 } } });

export default defineDemo({
  name: "ListPage",
  kind: "pattern",
  summary: "Title, status filter, table in every state, and paging: the shape of a list page.",
  examples: [
    {
      title: "Orders",
      note: "Fetching is mocked with a 400 ms delay. Switch a filter or turn a page: the old rows stay, dimmed, until the new ones arrive.",
      render: () => (
        <QueryClientProvider client={client}>
          <div class="demo-stack">
            <ListPage
              title="Orders"
              intro="Every order created through the API."
              actions={<Button variant="primary">New order</Button>}
              queryKey={["demo-orders"]}
              statusOptions={[
                { value: undefined, label: "All" },
                { value: "paid", label: "Paid" },
                { value: "pending", label: "Pending" },
                { value: "failed", label: "Failed" },
              ]}
              columns={COLUMNS}
              rowKey={(row) => row.id}
              fetchPage={fetchPage}
            />
          </div>
        </QueryClientProvider>
      ),
    },
  ],
});
