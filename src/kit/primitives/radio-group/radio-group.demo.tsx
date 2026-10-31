import { useSignal } from "@preact/signals";

import { defineDemo } from "../../demo.ts";
import { RadioGroup } from "./index.tsx";

function RadioDemo() {
  const delivery = useSignal<string | undefined>("standard");
  const payment = useSignal<string | undefined>(undefined);
  return (
    <div class="demo-stack">
      <RadioGroup
        label="Delivery"
        hint="Arrow keys move within the group."
        value={delivery.value}
        onChange={(value) => (delivery.value = value)}
        options={[
          { value: "standard", label: "Standard", hint: "3 to 5 days" },
          { value: "express", label: "Express", hint: "Next day" },
          { value: "pickup", label: "Pickup", hint: "Not available here", disabled: true },
        ]}
      />
      <RadioGroup
        label="Payment"
        error="Choose a payment method."
        value={payment.value}
        onChange={(value) => (payment.value = value)}
        options={[
          { value: "card", label: "Card" },
          { value: "transfer", label: "Bank transfer" },
        ]}
      />
    </div>
  );
}

export default defineDemo({
  name: "RadioGroup",
  kind: "primitive",
  summary: "Choose one of a few options that should all stay visible.",
  examples: [{ title: "With hints, a disabled option and an error", render: () => <RadioDemo /> }],
});
