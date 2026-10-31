import { useSignal } from "@preact/signals";

import { defineDemo } from "../../demo.ts";
import { useFields } from "../../lib/signals.ts";
import { Button } from "../button/index.tsx";
import { TextAreaField, TextField } from "../field/index.tsx";
import { Drawer } from "./index.tsx";

function DrawerDemo({ stickyFooter }: { stickyFooter: boolean }) {
  const open = useSignal(false);
  const fields = useFields({ name: "", note: "" });
  return (
    <>
      <Button onClick={() => (open.value = true)}>Open drawer</Button>
      {open.value ? (
        <Drawer
          title="New endpoint"
          stickyFooter={stickyFooter}
          onClose={() => (open.value = false)}
          onSubmit={() => (open.value = false)}
          submitLabel="Create"
        >
          <TextField label="Name" field={fields.name} />
          <TextAreaField label="Note" field={fields.note} />
        </Drawer>
      ) : null}
    </>
  );
}

export default defineDemo({
  name: "Drawer",
  kind: "primitive",
  summary: "A right-side panel for a long form; use Modal for short ones.",
  examples: [
    { title: "Footer follows the content", render: () => <DrawerDemo stickyFooter={false} /> },
    { title: "Pinned footer", note: "For forms long enough to scroll.", render: () => <DrawerDemo stickyFooter /> },
  ],
});
