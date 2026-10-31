import { useSignal } from "@preact/signals";
import { keepPreviousData, useQuery } from "@tanstack/preact-query";

export const PAGE_SIZE = 20;

/**
 * A list read one page at a time, filtered by a status and by any further conditions the page owns. One extra row is
 * requested to tell whether a next page exists; changing a filter goes back to the first page.
 */
export function usePagedList<Status extends string, Row, Extra extends object = Record<never, never>>(options: {
  /** First part of the query key, so the list can be invalidated by name. */
  key: readonly unknown[];
  initialStatus: Status | undefined;
  /** The conditions besides the status; they must be plain data, since they are part of the query key. */
  initialExtra?: Extra;
  fetch: (params: Extra & { status: Status | undefined; limit: number; offset: number }) => Promise<Row[]>;
}) {
  const status = useSignal<Status | undefined>(options.initialStatus);
  const extra = useSignal<Extra>(options.initialExtra ?? ({} as Extra));
  const page = useSignal(0);
  // Read once per render, so the key and the request below describe the same list.
  const currentStatus = status.value;
  const currentExtra = extra.value;
  const currentPage = page.value;
  const query = useQuery({
    queryKey: [...options.key, currentStatus ?? "all", currentExtra, currentPage],
    queryFn: () => options.fetch({ ...currentExtra, status: currentStatus, limit: PAGE_SIZE + 1, offset: currentPage * PAGE_SIZE }),
    // Changing a filter or a page keeps the rows on screen (dimmed) until the next ones arrive, instead of dropping to a skeleton.
    placeholderData: keepPreviousData,
  });
  return {
    query,
    rows: query.data?.slice(0, PAGE_SIZE) ?? [],
    status: currentStatus,
    changeStatus: (next: Status | undefined) => {
      status.value = next;
      page.value = 0;
    },
    extra: currentExtra,
    changeExtra: (next: Extra) => {
      extra.value = next;
      page.value = 0;
    },
    page: currentPage,
    setPage: (next: number) => {
      page.value = next;
    },
    hasNext: (query.data?.length ?? 0) > PAGE_SIZE,
  };
}
