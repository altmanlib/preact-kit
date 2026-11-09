import { ErrorNote } from "../note/index.tsx";
import { Skeleton, type SkeletonProps } from "../skeleton/index.tsx";

/** What a query looks like to `QueryStatus`; TanStack Query's result fits it, and so does a hand-made object. */
export type StatusQuery = { isPending: boolean; error: unknown; refetch: () => unknown };

/** What a read shows until it has data: the skeleton while pending, the error with a retry when it failed, nothing once data is there. */
export function QueryStatus({ query, loading = {} }: { query: StatusQuery; loading?: SkeletonProps }) {
  if (query.isPending) return <Skeleton {...loading} />;
  if (query.error) return <ErrorNote error={query.error} onRetry={() => query.refetch()} />;
  return null;
}
