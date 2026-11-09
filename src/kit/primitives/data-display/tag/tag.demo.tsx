import { useSignal } from "@preact/signals";

import { defineDemo } from "../../../demo.ts";
import { Tag } from "./index.tsx";

function Removable() {
  const tags = useSignal(["design", "billing", "urgent"]);
  return (
    <>
      {tags.value.map((name) => (
        <Tag key={name} onRemove={() => (tags.value = tags.value.filter((item) => item !== name))}>
          {name}
        </Tag>
      ))}
      {tags.value.length === 0 ? <span class="muted">All removed.</span> : null}
    </>
  );
}

export default defineDemo({
  name: "Tag",
  kind: "primitive",
  summary: "A label that belongs to a thing, optionally removable.",
  examples: [
    {
      title: "Plain and accent",
      note: "Not a state: use Badge for paid, failed and the like.",
      render: () => (
        <>
          <Tag>Design</Tag>
          <Tag tone="accent">Featured</Tag>
        </>
      ),
    },
    { title: "Removable", render: () => <Removable /> },
  ],
});
