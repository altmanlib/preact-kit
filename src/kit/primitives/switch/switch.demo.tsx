import { useSignal } from "@preact/signals";

import { defineDemo } from "../../demo.ts";
import { Switch } from "./index.tsx";

function SwitchDemo() {
  const notify = useSignal(true);
  const beta = useSignal(false);
  return (
    <div class="demo-stack">
      <Switch label="Email notifications" hint="Sent when an order changes state." field={notify} />
      <Switch label="Beta features" field={beta} />
      <Switch label="Managed by your admin" field={notify} disabled />
    </div>
  );
}

export default defineDemo({
  name: "Switch",
  kind: "primitive",
  summary: "An on/off switch for a setting that applies at once.",
  examples: [{ title: "States", note: "Use CheckField for a choice that is submitted with a form.", render: () => <SwitchDemo /> }],
});
