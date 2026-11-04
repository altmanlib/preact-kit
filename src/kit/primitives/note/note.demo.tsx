import { defineDemo } from "../../demo.ts";
import { ApiError } from "../../lib/errors.ts";
import { Button } from "../button/index.tsx";
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
    {
      title: "With an action",
      note: "`action` sits at the trailing side; use a small text Button, e.g. to retry or undo. ErrorNote's retry is built on it.",
      render: () => (
        <div class="demo-stack">
          <Note
            tone="bad"
            role="alert"
            action={
              <Button variant="text" size="sm">
                Retry
              </Button>
            }
          >
            The export failed.
          </Note>
          <Note
            tone="warn"
            action={
              <Button variant="text" size="sm">
                Undo
              </Button>
            }
          >
            Three items were removed from the list.
          </Note>
        </div>
      ),
    },
    {
      title: "Long text with an action",
      note: "The text wraps and the action keeps its size at the trailing edge.",
      render: () => (
        <div class="demo-stack" style="max-width: 24rem">
          <Note
            tone="ok"
            action={
              <Button variant="text" size="sm">
                View
              </Button>
            }
          >
            The import finished and every row in the file was added to the list without any problem at all.
          </Note>
        </div>
      ),
    },
  ],
});
