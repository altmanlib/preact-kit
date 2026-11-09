import "./pager.css";

import { type Bound, bound } from "../../../lib/signals.ts";
import { kitText } from "../../../texts.ts";
import { Button } from "../../actions/button/index.tsx";

type PagerOwn = { hasNext: boolean };

/** The props of `Pager`: `hasNext`, then either a `field` signal or `value` with `onChange` (never both); the value is the zero-based page. */
export type PagerProps = PagerOwn & Bound<number>;

/** Previous / next with the current page number; shows nothing while there is a single page. */
export function Pager(props: PagerProps) {
  const { value: page, set: onPage, rest } = bound<number, PagerOwn>(props);
  const { hasNext } = rest;
  if (page === 0 && !hasNext) return null;
  return (
    <nav class="pager" aria-label={kitText.pagination}>
      <Button variant="quiet" disabled={page === 0} onClick={() => onPage(page - 1)}>
        {kitText.prevPage}
      </Button>
      <span class="muted mono pager-num">{page + 1}</span>
      <Button variant="quiet" disabled={!hasNext} onClick={() => onPage(page + 1)}>
        {kitText.nextPage}
      </Button>
    </nav>
  );
}
