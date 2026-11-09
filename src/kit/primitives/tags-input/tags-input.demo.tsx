import { useSignal } from "@preact/signals";

import { defineDemo } from "../../demo.ts";
import { TagsInput } from "./index.tsx";

function TagsDemo() {
  const tags = useSignal(["design", "frontend"]);
  const limited = useSignal<string[]>([]);
  return (
    <div class="demo-stack">
      <TagsInput
        label="Topics"
        placeholder="Type and press Enter"
        hint="Enter or a comma adds; Backspace removes the last; paste splits on commas."
        value={tags.value}
        onChange={(value) => (tags.value = value)}
        name="topics"
      />
      <TagsInput label="At most three" value={limited.value} max={3} onChange={(value) => (limited.value = value)} />
      <TagsInput label="Locked" value={["read", "only"]} onChange={() => undefined} disabled />
      <TagsInput label="Required" value={[]} onChange={() => undefined} error="Add at least one tag." />
    </div>
  );
}

export default defineDemo({
  name: "TagsInput",
  kind: "primitive",
  summary: "Type to build a list of removable tags.",
  examples: [
    {
      title: "States",
      note: "Duplicates are ignored regardless of case. Use Chips to filter by a fixed set instead.",
      render: () => <TagsDemo />,
    },
  ],
});
