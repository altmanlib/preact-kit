import { useSignal } from "@preact/signals";

import { defineDemo } from "../../../demo.ts";
import { Dropdown } from "./index.tsx";

function DropdownDemo({ align }: { align: "start" | "end" }) {
  const last = useSignal("nothing yet");
  const pick = (name: string) => () => (last.value = name);
  return (
    <>
      <div style={align === "end" ? "margin-left: auto" : undefined}>
        <Dropdown
          label="Order actions"
          align={align}
          items={[
            { key: "view", label: "View details", onSelect: pick("view") },
            { key: "copy", label: "Copy id", onSelect: pick("copy") },
            { key: "refund", label: "Refund", onSelect: pick("refund"), disabled: true },
            { key: "delete", label: "Delete", tone: "danger", onSelect: pick("delete") },
          ]}
        >
          Actions
        </Dropdown>
      </div>
      <span class="muted">Chose: {last.value}</span>
    </>
  );
}

export default defineDemo({
  name: "Dropdown",
  kind: "primitive",
  summary: "A button that opens a menu of actions.",
  examples: [
    {
      title: "Menu",
      note: "ArrowDown on the button opens it; arrows, Home, End and typing a letter move; Esc and clicking outside close it.",
      render: () => <DropdownDemo align="start" />,
    },
    {
      title: "Aligned to the end",
      note: 'Use `align="end"` for a button near the right edge, such as a row action.',
      render: () => (
        <div class="demo-stack">
          <DropdownDemo align="end" />
        </div>
      ),
    },
  ],
});
