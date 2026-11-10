import "./progress.css";

/**
 * A bar for work with a known length: `value` out of `max`. Without `value` it is indeterminate and just moves.
 * `label` names what is progressing and is required for assistive technology.
 */
export function Progress({ label, value, max = 100, showValue = false }: { label: string; value?: number; max?: number; showValue?: boolean }) {
  const ratio = value === undefined ? undefined : Math.min(Math.max(value / max, 0), 1);
  const percent = ratio === undefined ? undefined : Math.round(ratio * 100);
  return (
    <div class="progress">
      <div class="progress-head">
        <span>{label}</span>
        {showValue && percent !== undefined ? <span class="muted mono">{percent}%</span> : null}
      </div>
      <div
        class={ratio === undefined ? "progress-track progress-indeterminate" : "progress-track"}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={ratio === undefined ? undefined : Math.min(Math.max(value ?? 0, 0), max)}
      >
        <span class="progress-bar" style={ratio === undefined ? undefined : { "--progress": String(ratio) }} />
      </div>
    </div>
  );
}
