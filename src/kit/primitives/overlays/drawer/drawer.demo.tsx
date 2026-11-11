import { useSignal } from "@preact/signals";

import { defineDemo } from "../../../demo.ts";
import { useFields } from "../../../lib/signals.ts";
import { Button } from "../../actions/button/index.tsx";
import { TextAreaField, TextField } from "../../form/field/index.tsx";
import { Tabs } from "../../navigation/tabs/index.tsx";
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

function ViewDrawerDemo() {
  const open = useSignal(false);
  const tab = useSignal("a");
  return (
    <>
      <Button onClick={() => (open.value = true)}>Open viewing drawer</Button>
      {open.value ? (
        <Drawer title="Endpoint" width="36rem" onClose={() => (open.value = false)}>
          <Tabs
            label="Sections"
            field={tab}
            items={[
              { key: "a", label: "Overview" },
              { key: "b", label: "Settings" },
            ]}
          >
            {tab.value === "a" ? <p>Overview content.</p> : <p>Settings content.</p>}
          </Tabs>
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
    { title: "Viewing panel", note: "Without onSubmit: no form, no footer; `width` sets the panel width.", render: () => <ViewDrawerDemo /> },
    { title: "Pinned footer", note: "For forms long enough to scroll.", render: () => <DrawerDemo stickyFooter /> },
  ],
});
