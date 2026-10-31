import { useSignal } from "@preact/signals";

import { defineDemo } from "../../demo.ts";
import { Chips } from "./index.tsx";

type Status = "paid" | "pending" | "failed";

const OPTIONS: { value: Status | undefined; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

function StatusChips({ title }: { title?: string }) {
  const value = useSignal<Status | undefined>(undefined);
  return <Chips options={OPTIONS} value={value.value} onChange={(next) => (value.value = next)} title={title} />;
}

export default defineDemo({
  name: "Chips",
  kind: "primitive",
  summary: "A segmented filter: one chosen value, or all.",
  examples: [
    { title: "Plain", render: () => <StatusChips /> },
    { title: "Titled", note: "The title names the group and sits before it.", render: () => <StatusChips title="Status" /> },
  ],
});
