import { useSignal } from "@preact/signals";

import { defineDemo } from "../../../demo.ts";
import { Button } from "../../actions/button/index.tsx";
import { GlideHeight } from "./index.tsx";

function GlideDemo() {
  const long = useSignal(false);
  return (
    <div class="demo-stack">
      <div>
        <Button onClick={() => (long.value = !long.value)}>{long.value ? "Show less" : "Show more"}</Button>
      </div>
      <GlideHeight>
        <p>This block follows the height of its content.</p>
        {long.value ? <p class="muted">More text arrives, and the box grows to fit it with a short transition instead of jumping.</p> : null}
      </GlideHeight>
    </div>
  );
}

export default defineDemo({
  name: "GlideHeight",
  kind: "primitive",
  summary: "A wrapper whose height transitions when its content changes.",
  examples: [{ title: "Toggle", render: () => <GlideDemo /> }],
});
