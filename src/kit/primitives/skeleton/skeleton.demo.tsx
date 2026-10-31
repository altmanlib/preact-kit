import { defineDemo } from "../../demo.ts";
import { Skeleton } from "./index.tsx";

export default defineDemo({
  name: "Skeleton",
  kind: "primitive",
  summary: "A placeholder shaped like what is loading; it appears only after a short wait.",
  examples: [
    {
      title: "Lines",
      note: "Text and forms.",
      render: () => (
        <div class="demo-stack">
          <Skeleton rows={4} />
        </div>
      ),
    },
    {
      title: "Table",
      note: "A list; `cols` follows the real columns.",
      render: () => (
        <div class="demo-stack">
          <Skeleton kind="table" cols={4} rows={4} />
        </div>
      ),
    },
    {
      title: "Tiles",
      note: "A row of figures.",
      render: () => (
        <div class="demo-stack">
          <Skeleton kind="tiles" />
        </div>
      ),
    },
  ],
});
