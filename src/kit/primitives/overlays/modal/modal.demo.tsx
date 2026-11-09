import { useSignal } from "@preact/signals";

import { defineDemo } from "../../../demo.ts";
import { ApiError } from "../../../lib/errors.ts";
import { useFields } from "../../../lib/signals.ts";
import { Button } from "../../actions/button/index.tsx";
import { TextField } from "../../form/field/index.tsx";
import { Modal } from "./index.tsx";

function ViewDemo() {
  const open = useSignal(false);
  return (
    <>
      <Button onClick={() => (open.value = true)}>Open</Button>
      {open.value ? (
        <Modal title="Webhook secret" onClose={() => (open.value = false)}>
          <p>Only for looking: Esc, the close button or a click outside leaves.</p>
        </Modal>
      ) : null}
    </>
  );
}

function FormDemo() {
  const open = useSignal(false);
  const error = useSignal<unknown>(null);
  const fields = useFields({ name: "" });
  const submit = async () => {
    error.value = null;
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (fields.name.value.trim() === "") {
      error.value = new ApiError(400, "bad_request");
      throw error.value;
    }
  };
  return (
    <>
      <Button variant="primary" onClick={() => (open.value = true)}>
        Rename
      </Button>
      {open.value ? (
        <Modal title="Rename" onClose={() => (open.value = false)} onSubmit={submit} error={error.value} submitLabel="Save">
          <TextField label="Name" field={fields.name} hint="Leave it empty to see a failed submit." />
        </Modal>
      ) : null}
    </>
  );
}

function FooterStartDemo() {
  const open = useSignal(false);
  const seed = useSignal(1);
  return (
    <>
      <Button onClick={() => (open.value = true)}>Pick a colour</Button>
      {open.value ? (
        <Modal
          title="Accent colour"
          onClose={() => (open.value = false)}
          onSubmit={() => undefined}
          submitLabel="Save"
          footerStart={
            <Button variant="quiet" size="sm" onClick={() => (seed.value += 1)}>
              Shuffle
            </Button>
          }
        >
          <p>Current seed: {seed.value}. `footerStart` sits opposite cancel/confirm.</p>
        </Modal>
      ) : null}
    </>
  );
}

export default defineDemo({
  name: "Modal",
  kind: "primitive",
  summary: "A centred dialog for looking at something, or for a short form.",
  examples: [
    { title: "View only", render: () => <ViewDemo /> },
    {
      title: "Short form",
      note: "`onSubmit` may return a promise: the dialog leaves when it resolves and stays open, showing `error`, when it throws.",
      render: () => <FormDemo />,
    },
    {
      title: "Footer start",
      note: "`footerStart` places extra actions at the start of the form footer, opposite cancel/confirm.",
      render: () => <FooterStartDemo />,
    },
  ],
});
