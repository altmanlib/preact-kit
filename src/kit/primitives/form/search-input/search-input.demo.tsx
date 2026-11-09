import { signal } from "@preact/signals";

import { defineDemo } from "../../../demo.ts";
import { SearchInput } from "./index.tsx";

const query = signal("");
const FRUIT = ["Apple", "Apricot", "Banana", "Cherry", "Grape", "Lemon"];

function SearchDemo() {
  const needle = query.value.trim().toLowerCase();
  const shown = FRUIT.filter((name) => name.toLowerCase().includes(needle));
  return (
    <div class="demo-stack">
      <SearchInput label="Filter fruit" placeholder="Filter…" field={query} />
      <p class="muted">{shown.length === 0 ? "No match" : shown.join(", ")}</p>
    </div>
  );
}

export default defineDemo({
  name: "SearchInput",
  kind: "primitive",
  summary: "A compact text filter for a toolbar; Esc clears it.",
  examples: [
    {
      title: "Filtering a list",
      note: "Use TextField when the input needs a visible label and hint.",
      render: () => <SearchDemo />,
    },
  ],
});
