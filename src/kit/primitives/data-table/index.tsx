import "./data-table.css";

import type { ComponentChildren } from "preact";

import { Empty } from "../empty/index.tsx";
import { QueryStatus } from "../query-status/index.tsx";

export type Column<T> = {
  key: string;
  header?: ComponentChildren;
  /** Applied to the header and to every cell, e.g. `num` or `actions`. */
  class?: string;
  /** Applied to the cells only, e.g. `mono muted`. */
  cellClass?: string;
  cell: (row: T) => ComponentChildren;
};

/** A table drawn from column definitions, so a list and its skeleton can share the same columns. */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  rowAttrs,
  busy = false,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Extra attributes for a row's `<tr>`, such as a `data-*` marker. */
  rowAttrs?: (row: T) => Record<string, string>;
  /** The rows are the previous ones, kept until the new ones arrive; they are drawn dimmed. */
  busy?: boolean;
}) {
  return (
    <div class="table-wrap" aria-busy={busy}>
      <table class="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} class={column.class}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} {...rowAttrs?.(row)}>
              {columns.map((column) => (
                <td key={column.key} class={[column.class, column.cellClass].filter(Boolean).join(" ") || undefined}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** What a query looks like to `QueryTable`; TanStack Query's result fits it, and so does a hand-made object. */
export type QueryLike = { isPending: boolean; error: unknown; refetch: () => unknown; data?: unknown; isPlaceholderData?: boolean };

/**
 * A list read by a query, in every state it passes through: the skeleton while pending, the error with a retry when it
 * failed, `Empty` when it came back without rows, and the table otherwise. `rows` is what to show once there is data.
 */
export function QueryTable<T>({
  query,
  rows,
  columns,
  rowKey,
  rowAttrs,
  empty,
  skeletonRows,
}: {
  query: QueryLike;
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  rowAttrs?: (row: T) => Record<string, string>;
  /** What to say for no rows; the stock empty text when omitted. */
  empty?: ComponentChildren;
  skeletonRows?: number;
}) {
  return (
    <>
      <QueryStatus query={query} loading={{ kind: "table", cols: columns.length, rows: skeletonRows }} />
      {query.data !== undefined && rows.length === 0 ? <Empty>{empty}</Empty> : null}
      {rows.length > 0 ? <DataTable columns={columns} rows={rows} rowKey={rowKey} rowAttrs={rowAttrs} busy={query.isPlaceholderData} /> : null}
    </>
  );
}
