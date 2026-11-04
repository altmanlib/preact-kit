import { useSignal } from "@preact/signals";

import { defineDemo } from "./demo.ts";

const DURATIONS = [
  { token: "--duration-fast", use: "hover, press, colour changes, popovers" },
  { token: "--duration-enter", use: "something arriving, swapping or leaving" },
  { token: "--duration-slide", use: "a size change or a panel move" },
];

const EASES = [
  { token: "--ease-out", use: "arriving and state changes" },
  { token: "--ease-in", use: "leaving" },
  { token: "--ease-in-out", use: "a bounded sweep that repeats" },
  { token: "--ease-linear", use: "an endless turn or shimmer" },
];

const ROW = { display: "grid", gridTemplateColumns: "minmax(10rem, 14rem) 1fr", gap: "var(--space-3)", alignItems: "center" } as const;
const TRACK = { position: "relative", height: "var(--space-4)", background: "var(--surface-sunken)", borderRadius: "var(--radius-pill)" } as const;

/** A dot that travels the length of a track with the given duration and curve tokens when `on` flips. */
function Lane({ token, use, duration, ease, on }: { token: string; use: string; duration: string; ease: string; on: boolean }) {
  return (
    <div style={ROW}>
      <div>
        <code>{token}</code>
        <div style={{ color: "var(--muted)", fontSize: "var(--text-xs)" }}>{use}</div>
      </div>
      <div style={TRACK} aria-hidden="true">
        <span
          style={{
            position: "absolute",
            top: 0,
            left: on ? "calc(100% - var(--space-4))" : 0,
            width: "var(--space-4)",
            height: "var(--space-4)",
            background: "var(--ink)",
            borderRadius: "var(--radius-pill)",
            transition: `left var(${duration}) var(${ease})`,
          }}
        />
      </div>
    </div>
  );
}

function Player({ lanes }: { lanes: Parameters<typeof Lane>[0][] }) {
  const on = useSignal(false);
  return (
    <div style={{ display: "grid", gap: "var(--space-3)", width: "min(100%, 48rem)" }}>
      <div>
        <button type="button" class="btn btn-sm" onClick={() => (on.value = !on.value)}>
          Play
        </button>
      </div>
      {lanes.map((lane) => (
        <Lane key={lane.token} {...lane} on={on.value} />
      ))}
    </div>
  );
}

export default defineDemo({
  name: "Motion",
  kind: "primitive",
  summary: "The duration and easing tokens every component's motion is built on; use a token, never a literal time or curve.",
  examples: [
    {
      title: "Durations",
      note: "Same curve (`--ease-out`), three lengths; Play runs all lanes at once.",
      render: () => <Player lanes={DURATIONS.map((item) => ({ ...item, duration: item.token, ease: "--ease-out", on: false }))} />,
    },
    {
      title: "Easing",
      note: "Same length (`--duration-slide`), four curves; compare how each starts and settles.",
      render: () => <Player lanes={EASES.map((item) => ({ ...item, duration: "--duration-slide", ease: item.token, on: false }))} />,
    },
  ],
});
