import { useSignal } from "@preact/signals";

import { defineDemo } from "../../demo.ts";
import { ConfirmButton } from "./index.tsx";

function ConfirmDemo() {
  const deleted = useSignal(0);
  return (
    <>
      <ConfirmButton variant="danger" question="Delete this key? This cannot be undone." onConfirm={() => (deleted.value += 1)}>
        Delete key
      </ConfirmButton>
      <span class="muted">Confirmed {deleted.value} time(s)</span>
    </>
  );
}

export default defineDemo({
  name: "ConfirmButton",
  kind: "primitive",
  summary: "A button that asks before it acts.",
  examples: [{ title: "Destructive action", note: "Keep the question in your own texts, not inline.", render: () => <ConfirmDemo /> }],
});
