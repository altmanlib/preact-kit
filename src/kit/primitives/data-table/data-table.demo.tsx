import { defineDemo } from "../../demo.ts";
import { ApiError } from "../../lib/errors.ts";
import { Badge, type Tone } from "../badge/index.tsx";
import { Button } from "../button/index.tsx";
import { type Column, DataTable, type QueryLike, QueryTable } from "./index.tsx";

type Row = { id: string; customer: string; amount: string; status: "Paid" | "Pending" | "Failed"; at: string };

const ROWS: Row[] = [
  { id: "ORD-0042", customer: "Ada Lovelace", amount: "128.00", status: "Paid", at: "2026-10-31 09:12" },
  { id: "ORD-0041", customer: "Grace Hopper", amount: "64.50", status: "Pending", at: "2026-10-31 08:47" },
  { id: "ORD-0040", customer: "Alan Turing", amount: "9.90", status: "Failed", at: "2026-10-30 22:05" },
];

const TONES: Record<Row["status"], Tone> = { Paid: "ok", Pending: "warn", Failed: "bad" };

const COLUMNS: Column<Row>[] = [
  { key: "id", header: "Order", cellClass: "mono", cell: (row) => row.id },
  { key: "customer", header: "Customer", cell: (row) => row.customer },
  { key: "amount", header: "Amount", class: "num", cellClass: "mono", cell: (row) => row.amount },
  { key: "status", header: "Status", cell: (row) => <Badge tone={TONES[row.status]}>{row.status}</Badge> },
  { key: "at", header: "Time", cellClass: "mono muted", cell: (row) => row.at },
  { key: "actions", class: "actions", cell: () => <Button variant="quiet">View</Button> },
];

const query = (patch: Partial<QueryLike>): QueryLike => ({ isPending: false, error: null, refetch: () => undefined, data: ROWS, ...patch });

export default defineDemo({
  name: "DataTable",
  kind: "primitive",
  summary: "DataTable draws columns and rows; QueryTable adds every state a read passes through.",
  examples: [
    {
      title: "DataTable",
      note: 'Row actions go in the last column with `class: "actions"`; `num` right-aligns figures.',
      render: () => (
        <div class="demo-stack">
          <DataTable columns={COLUMNS} rows={ROWS} rowKey={(row) => row.id} />
        </div>
      ),
    },
    {
      title: "QueryTable: pending",
      render: () => (
        <div class="demo-stack">
          <QueryTable query={query({ isPending: true, data: undefined })} rows={[]} columns={COLUMNS} rowKey={(row: Row) => row.id} skeletonRows={3} />
        </div>
      ),
    },
    {
      title: "QueryTable: failed",
      render: () => (
        <div class="demo-stack">
          <QueryTable query={query({ error: new ApiError(500, "unknown"), data: undefined })} rows={[]} columns={COLUMNS} rowKey={(row: Row) => row.id} />
        </div>
      ),
    },
    {
      title: "QueryTable: empty",
      render: () => (
        <div class="demo-stack">
          <QueryTable query={query({ data: [] })} rows={[]} columns={COLUMNS} rowKey={(row: Row) => row.id} empty="No orders match this filter." />
        </div>
      ),
    },
    {
      title: "QueryTable: refreshing",
      note: "While the next filter loads, the previous rows stay on screen, dimmed.",
      render: () => (
        <div class="demo-stack">
          <QueryTable query={query({ isPlaceholderData: true })} rows={ROWS} columns={COLUMNS} rowKey={(row: Row) => row.id} />
        </div>
      ),
    },
  ],
});
