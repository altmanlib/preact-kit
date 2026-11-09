import { defineDemo } from "../../../demo.ts";
import { Button } from "../../actions/button/index.tsx";
import { Modal } from "../modal/index.tsx";
import { DialogProvider, useDialog } from "./index.tsx";

function Greeting({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <Modal title="From a component" onClose={onClose}>
      <p>Hello, {name}.</p>
    </Modal>
  );
}

function Buttons() {
  const dialog = useDialog();
  return (
    <>
      <Button onClick={() => dialog.open(Greeting, { name: "Ada" })}>Open a component</Button>
      <Button
        onClick={() =>
          dialog.open((close) => (
            <Modal title="Inline" onClose={close}>
              <p>Rendered by a function that receives `close`.</p>
            </Modal>
          ))
        }
      >
        Open inline
      </Button>
    </>
  );
}

export default defineDemo({
  name: "DialogProvider",
  kind: "primitive",
  summary: "Hosts the one open dialog of an app: `useDialog().open(...)` from anywhere below it.",
  examples: [
    {
      title: "open(Component, props) and open(render)",
      note: "No open/closed signal per dialog in each page; `onClose` is supplied by the host.",
      render: () => (
        <DialogProvider>
          <Buttons />
        </DialogProvider>
      ),
    },
  ],
});
