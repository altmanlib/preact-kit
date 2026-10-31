import "./spinner.css";

import { kitText } from "../../texts.ts";

/** A spinning ring for work that is in progress and has no known length; its `label` (the stock loading text by default) is read by assistive technology. */
export function Spinner({ size = "md", label = kitText.loading }: { size?: "sm" | "md" | "lg"; label?: string }) {
  return <span class={size === "md" ? "spinner" : `spinner spinner-${size}`} role="status" aria-label={label} />;
}
