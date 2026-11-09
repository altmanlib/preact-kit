import { computed } from "@preact/signals";
import { useState } from "preact/hooks";

import { defineDemo } from "../../../demo.ts";
import { parseNumber } from "../../../lib/number.ts";
import { useFields } from "../../../lib/signals.ts";
import { NumberField } from "./index.tsx";

function NumberDemo() {
  const fields = useFields({ seats: "3", price: "9.9", empty: "" });
  const total = computed(() => {
    const seats = parseNumber(fields.seats.value);
    const price = parseNumber(fields.price.value);
    return seats === undefined || price === undefined ? "—" : (seats * price).toFixed(2);
  });
  return (
    <div class="demo-stack">
      <NumberField label="Seats" hint="1 to 20. Arrow keys step; leaving the field clamps it." field={fields.seats} min={1} max={20} />
      <NumberField label="Price" hint="Steps of 0.1 without float noise." field={fields.price} min={0} step={0.1} />
      <p class="muted">Total: {total}</p>
      <NumberField label="Quantity" field={fields.empty} min={0} error="Enter a quantity." />
      <NumberField label="Locked" field={fields.seats} disabled />
    </div>
  );
}

function PlainNumber() {
  const [amount, setAmount] = useState("5");
  return (
    <div class="demo-stack">
      <NumberField label="Amount" hint="Plain state: value and onChange." value={amount} onChange={setAmount} min={0} max={10} />
      <p class="muted">Text: {JSON.stringify(amount)}</p>
    </div>
  );
}

export default defineDemo({
  name: "NumberField",
  kind: "primitive",
  summary: "A number input with steppers that holds its text, so empty and half-typed values are representable.",
  examples: [
    { title: "Limits, step, error and disabled", render: () => <NumberDemo /> },
    { title: "Without signals", note: "`value` and `onChange` carry the text, just as `field` does.", render: () => <PlainNumber /> },
  ],
});
