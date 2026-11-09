import { useSignal } from "@preact/signals";

import { defineDemo } from "../../../demo.ts";
import { ApiError } from "../../../lib/errors.ts";
import { ConfirmButton } from "./index.tsx";

function ConfirmDemo() {
  const deleted = useSignal(0);
  return (
    <>
      <ConfirmButton variant="danger" question="Delete this key? This cannot be undone." confirmLabel="Delete" onConfirm={() => (deleted.value += 1)}>
        Delete key
      </ConfirmButton>
      <span class="muted">Confirmed {deleted.value} time(s)</span>
    </>
  );
}

function FailingDemo() {
  const error = useSignal<unknown>(null);
  const confirm = async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    error.value = new ApiError(500, "unknown");
    throw error.value;
  };
  return (
    <ConfirmButton question="Revoke all sessions?" title="Revoke sessions" onConfirm={confirm} error={error.value}>
      Revoke
    </ConfirmButton>
  );
}

export default defineDemo({
  name: "ConfirmButton",
  kind: "primitive",
  summary: "A button that asks in a dialog before it acts.",
  examples: [
    {
      title: "Destructive action",
      note: "A danger button gets a danger confirm button. Keep the question in your own texts, not inline.",
      render: () => <ConfirmDemo />,
    },
    {
      title: "Async action that fails",
      note: "`onConfirm` may return a promise; the dialog stays open and shows `error` when it throws.",
      render: () => <FailingDemo />,
    },
  ],
});
