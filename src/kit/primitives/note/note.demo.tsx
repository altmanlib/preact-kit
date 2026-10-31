import { defineDemo } from "../../demo.ts";
import { ApiError } from "../../lib/errors.ts";
import { ErrorNote, Note } from "./index.tsx";

export default defineDemo({
  name: "Note",
  kind: "primitive",
  summary: "A tinted line of text: fine, a caution or a failure.",
  examples: [
    {
      title: "Tones",
      render: () => (
        <div class="demo-stack">
          <Note tone="ok">Saved.</Note>
          <Note tone="warn">This cannot be undone once confirmed.</Note>
          <Note tone="bad" role="alert">
            The request failed.
          </Note>
        </div>
      ),
    },
    {
      title: "ErrorNote",
      note: "Takes any thrown value, shows nothing for no error, and offers a retry when `onRetry` is given.",
      render: () => (
        <div class="demo-stack">
          <ErrorNote error={new ApiError(500, "unknown")} onRetry={() => undefined} />
          <ErrorNote error={undefined} />
        </div>
      ),
    },
  ],
});
