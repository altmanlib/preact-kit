import { useSignal } from "@preact/signals";

import { defineDemo } from "../../demo.ts";
import { useFields } from "../../lib/signals.ts";
import { CheckField, Field, TextAreaField, TextField } from "./index.tsx";

function TextFields() {
  const fields = useFields({ name: "", email: "not-an-email", about: "" });
  return (
    <div class="demo-stack">
      <TextField label="Name" hint="Shown on receipts." field={fields.name} placeholder="Ada Lovelace" />
      <TextField label="Email" type="email" field={fields.email} error="Enter a valid address." />
      <TextAreaField label="About" field={fields.about} placeholder="A few lines…" />
    </div>
  );
}

function Checks() {
  const news = useSignal(true);
  return (
    <div class="demo-stack">
      <CheckField label="Send me release notes" hint="At most one email a month." field={news} />
    </div>
  );
}

export default defineDemo({
  name: "Field",
  kind: "primitive",
  summary: "Labelled form controls that follow a signal.",
  examples: [
    { title: "Text, email and textarea", note: "`useFields` makes one signal per key; extra attributes go to the input.", render: () => <TextFields /> },
    { title: "Checkbox", render: () => <Checks /> },
    {
      title: "Native select and disabled input",
      note: 'Any other control sits inside `Field` with `class="input"`.',
      render: () => (
        <div class="demo-stack">
          <Field label="Plan">
            <select class="input">
              <option>Free</option>
              <option>Team</option>
            </select>
          </Field>
          <Field label="Tenant id">
            <input class="input" value="t_01hxyz" disabled />
          </Field>
        </div>
      ),
    },
  ],
});
