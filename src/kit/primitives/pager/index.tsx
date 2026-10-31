import "./pager.css";

import { kitText } from "../../texts.ts";
import { Button } from "../button/index.tsx";

/** Previous / next with the current page number; shows nothing while there is a single page. `page` is zero-based. */
export function Pager({ page, hasNext, onPage }: { page: number; hasNext: boolean; onPage: (next: number) => void }) {
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
