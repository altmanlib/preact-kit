import { useSignal } from "@preact/signals";

import { defineDemo } from "../../demo.ts";
import { Button } from "../button/index.tsx";
import { Progress } from "./index.tsx";

function Stepper() {
  const value = useSignal(30);
  return (
    <div class="demo-stack">
      <Progress label="Uploading" value={value.value} showValue />
      <div>
        <Button onClick={() => (value.value = Math.min(value.value + 20, 100))}>+20</Button>
        <Button variant="quiet" onClick={() => (value.value = 0)}>
          Reset
        </Button>
      </div>
    </div>
  );
}

export default defineDemo({
  name: "Progress",
  kind: "primitive",
  summary: "A bar for work with a known length.",
  examples: [
    { title: "Determinate", render: () => <Stepper /> },
    {
      title: "Indeterminate",
      note: "Without `value`; use Spinner when there is no bar to draw.",
      render: () => (
        <div class="demo-stack">
          <Progress label="Preparing export" />
        </div>
      ),
    },
  ],
});
