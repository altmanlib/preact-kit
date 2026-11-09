import { useSignal } from "@preact/signals";

import { defineDemo } from "../../demo.ts";
import { Button } from "../button/index.tsx";
import { CheckField } from "../field/index.tsx";
import { Popover } from "./index.tsx";

function FilterDemo() {
  const unread = useSignal(true);
  const mine = useSignal(false);
  return (
    <Popover title="Filters" trigger="Filter">
      <CheckField label="Unread only" field={unread} />
      <CheckField label="Assigned to me" field={mine} />
      <Button variant="primary" size="sm">
        Apply
      </Button>
    </Popover>
  );
}

export default defineDemo({
  name: "Popover",
  kind: "primitive",
  summary: "A button that opens a small panel of any content next to it.",
  examples: [
    {
      title: "With a title",
      note: "The title names the panel and adds a close button; Esc and a click outside close it, and Tab moves into it.",
      render: () => <FilterDemo />,
    },
    {
      title: "Without a title",
      note: 'A short explanation; `align="end"` lines the panel up with the button\'s right edge.',
      render: () => (
        <div class="demo-stack">
          <Popover trigger="What is this?" variant="text" align="end">
            <p>A short note that explains a term without leaving the page.</p>
          </Popover>
        </div>
      ),
    },
  ],
});
