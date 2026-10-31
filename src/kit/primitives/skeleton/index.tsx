import "./skeleton.css";

import { kitText } from "../../texts.ts";

const bars = (count: number) => Array.from({ length: count }, (_, index) => index);

/** Bar widths cycle so neighbouring cells do not look stamped from one mold. */
const BAR_WIDTHS = ["72%", "54%", "86%", "62%", "78%"];

export type SkeletonProps = { kind?: "lines"; rows?: number } | { kind: "table"; rows?: number; cols: number } | { kind: "tiles"; count?: number };

/**
 * A placeholder for content that is on its way; the shape follows what will replace it: `lines` for text and forms,
 * `table` for a list, `tiles` for a row of figures. It fades in only after `--skeleton-delay`, so a quick answer never
 * flashes one. The loading text stays available to assistive technology.
 */
export function Skeleton(props: SkeletonProps) {
  let body;
  if (props.kind === "table") {
    const { cols, rows = 5 } = props;
    body = (
      <div class="skeleton-table">
        {bars(rows).map((row) => (
          <div key={row} class="skeleton-row" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {bars(cols).map((col) => (
              <span key={col} class="skeleton-bar" style={{ width: BAR_WIDTHS[(row + col) % BAR_WIDTHS.length] }} />
            ))}
          </div>
        ))}
      </div>
    );
  } else if (props.kind === "tiles") {
    body = (
      <div class="skeleton-tiles">
        {bars(props.count ?? 3).map((index) => (
          <div key={index} class="skeleton-tile">
            <span class="skeleton-bar skeleton-bar-sm" style={{ width: "40%" }} />
            <span class="skeleton-bar skeleton-bar-lg" style={{ width: "55%" }} />
            <span class="skeleton-bar skeleton-bar-sm" style={{ width: "70%" }} />
          </div>
        ))}
      </div>
    );
  } else {
    body = (
      <div class="skeleton-lines">
        {bars(props.rows ?? 3).map((index) => (
          <span key={index} class="skeleton-bar" style={{ width: BAR_WIDTHS[index % BAR_WIDTHS.length] }} />
        ))}
      </div>
    );
  }
  return (
    <div class="skeleton" role="status" aria-busy="true" aria-label={kitText.loading}>
      {body}
    </div>
  );
}
