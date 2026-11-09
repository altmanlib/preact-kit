import { defineDemo } from "../../../demo.ts";
import { Button } from "../../actions/button/index.tsx";
import { Spinner } from "./index.tsx";

export default defineDemo({
  name: "Spinner",
  kind: "primitive",
  summary: "A spinning ring for work with no known length.",
  examples: [
    {
      title: "Sizes",
      render: () => (
        <>
          <Spinner size="sm" />
          <Spinner />
          <Spinner size="lg" />
        </>
      ),
    },
    {
      title: "Inside a button",
      note: "Disable the button while it works.",
      render: () => (
        <Button disabled>
          <Spinner size="sm" label="Saving" /> Saving
        </Button>
      ),
    },
  ],
});
