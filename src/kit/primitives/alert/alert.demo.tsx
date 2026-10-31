import { useSignal } from "@preact/signals";

import { defineDemo } from "../../demo.ts";
import { Button } from "../button/index.tsx";
import { Alert } from "./index.tsx";

function Dismissible() {
  const shown = useSignal(true);
  return shown.value ? (
    <Alert tone="info" title="New: dark mode" onClose={() => (shown.value = false)}>
      Follows your system, or switch it from the sidebar.
    </Alert>
  ) : (
    <Button onClick={() => (shown.value = true)}>Show again</Button>
  );
}

export default defineDemo({
  name: "Alert",
  kind: "primitive",
  summary: "A block-level message with an icon, a title and actions.",
  examples: [
    {
      title: "Tones",
      note: "Heavier than Note: use it for something the page is about; use Note for a line under a field.",
      render: () => (
        <div class="demo-stack">
          <Alert tone="info" title="Heads up">
            Orders are kept for 90 days.
          </Alert>
          <Alert tone="ok" title="Import finished">
            All 128 rows were added.
          </Alert>
          <Alert tone="warn" title="Limit almost reached" actions={<Button size="sm">Upgrade</Button>}>
            You have used 9 of 10 seats.
          </Alert>
          <Alert tone="bad" title="Import failed" actions={<Button size="sm">Retry</Button>}>
            The file is not valid CSV.
          </Alert>
        </div>
      ),
    },
    {
      title: "Dismissible",
      render: () => (
        <div class="demo-stack">
          <Dismissible />
        </div>
      ),
    },
  ],
});
