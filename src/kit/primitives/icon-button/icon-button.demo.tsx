import { Pencil, Trash2, X } from "lucide-preact";

import { defineDemo } from "../../demo.ts";
import { IconButton } from "./index.tsx";

export default defineDemo({
  name: "IconButton",
  kind: "primitive",
  summary: "A square button that shows only an icon; its `label` is the accessible name and the tooltip.",
  examples: [
    {
      title: "Default and states",
      render: () => (
        <>
          <IconButton label="Close">
            <X aria-hidden="true" />
          </IconButton>
          <IconButton label="Edit">
            <Pencil aria-hidden="true" />
          </IconButton>
          <IconButton label="Done" state="ok">
            <Pencil aria-hidden="true" />
          </IconButton>
          <IconButton label="Delete" state="bad">
            <Trash2 aria-hidden="true" />
          </IconButton>
        </>
      ),
    },
  ],
});
