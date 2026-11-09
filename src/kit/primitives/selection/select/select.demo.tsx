import { useSignal } from "@preact/signals";

import { defineDemo } from "../../../demo.ts";
import { Select } from "./index.tsx";

const PLANS = [
  { value: "free", label: "Free" },
  { value: "team", label: "Team" },
  { value: "business", label: "Business" },
  { value: "enterprise", label: "Enterprise", disabled: true },
];

function SelectDemo() {
  const plan = useSignal<string | undefined>(undefined);
  const region = useSignal<string | undefined>("eu");
  return (
    <div class="demo-stack">
      <Select label="Plan" placeholder="Choose a plan" hint="Type a letter to jump." options={PLANS} field={plan} />
      <Select
        label="Region"
        options={[
          { value: "us", label: "United States" },
          { value: "eu", label: "Europe" },
          { value: "ap", label: "Asia Pacific" },
        ]}
        value={region.value}
        onChange={(value) => (region.value = value)}
        name="region"
      />
      <Select label="Locked" options={PLANS} value="team" onChange={() => undefined} disabled />
      <Select label="Currency" placeholder="Choose one" options={PLANS} value={undefined} onChange={() => undefined} error="This field is required." />
    </div>
  );
}

export default defineDemo({
  name: "Select",
  kind: "primitive",
  summary: "Choose one value from a short list.",
  examples: [
    {
      title: "States",
      note: "Placeholder, preselected, disabled option, disabled, error. ArrowDown on the button opens it.",
      render: () => <SelectDemo />,
    },
  ],
});
