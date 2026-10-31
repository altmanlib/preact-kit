import type { ComponentChildren } from "preact";

import { usePagedList } from "../../lib/paging.ts";
import { Chips } from "../../primitives/chips/index.tsx";
import { type Column, QueryTable } from "../../primitives/data-table/index.tsx";
import { PageHead } from "../../primitives/heading/index.tsx";
import { Pager } from "../../primitives/pager/index.tsx";

/**
 * The shape of a list page: title (with actions), a status filter, the table in every state, and previous/next.
 * The page supplies what is its own: the title, the status options, the columns and how to fetch a page.
 * It must sit under a TanStack `QueryClientProvider`.
 */
export function ListPage<Status extends string, Row>({
  title,
  intro,
  actions,
  queryKey,
  statusOptions,
  columns,
  rowKey,
  fetchPage,
  empty,
}: {
  title: string;
  intro?: ComponentChildren;
  actions?: ComponentChildren;
  /** First part of the query key, so the list can be invalidated by name. */
  queryKey: readonly unknown[];
  statusOptions: { value: Status | undefined; label: string }[];
  columns: Column<Row>[];
  rowKey: (row: Row) => string;
  /** One page of rows; ask for `limit` rows from `offset`, filtered by `status` (`undefined` is all). */
  fetchPage: (params: { status: Status | undefined; limit: number; offset: number }) => Promise<Row[]>;
  empty?: ComponentChildren;
}) {
  const list = usePagedList<Status, Row>({ key: queryKey, initialStatus: undefined, fetch: fetchPage });
  return (
    <>
      <PageHead title={title} intro={intro}>
        {actions}
      </PageHead>
      <Chips options={statusOptions} value={list.status} onChange={list.changeStatus} />
      <QueryTable query={list.query} rows={list.rows} columns={columns} rowKey={rowKey} empty={empty} />
      <Pager page={list.page} hasNext={list.hasNext} onPage={list.setPage} />
    </>
  );
}
