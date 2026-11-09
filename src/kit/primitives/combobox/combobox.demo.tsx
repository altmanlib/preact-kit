import { useSignal } from "@preact/signals";

import { defineDemo } from "../../demo.ts";
import { Combobox } from "./index.tsx";

const COUNTRIES = [
  "Argentina",
  "Australia",
  "Brazil",
  "Canada",
  "Chile",
  "China",
  "Denmark",
  "Egypt",
  "France",
  "Germany",
  "India",
  "Japan",
  "Kenya",
  "Mexico",
  "Norway",
  "Peru",
  "Spain",
  "Sweden",
].map((label) => ({ value: label.toLowerCase(), label, disabled: label === "Egypt" }));

function ComboboxDemo() {
  const country = useSignal<string | undefined>(undefined);
  return (
    <div class="demo-stack">
      <Combobox
        label="Country"
        placeholder="Type to filter"
        hint={`Chosen: ${country.value ?? "nothing yet"}`}
        options={COUNTRIES}
        field={country}
        name="country"
      />
      <Combobox label="Locked" options={COUNTRIES} value="japan" onChange={() => undefined} disabled />
      <Combobox
        label="Required"
        placeholder="Type to filter"
        options={COUNTRIES}
        value={undefined}
        onChange={() => undefined}
        error="This field is required."
      />
    </div>
  );
}

export default defineDemo({
  name: "Combobox",
  kind: "primitive",
  summary: "Choose one value from a long list by typing to narrow it.",
  examples: [
    {
      title: "States",
      note: "Typing filters; arrows, Enter and Esc work as in Select. Use Select for a short list.",
      render: () => <ComboboxDemo />,
    },
  ],
});
