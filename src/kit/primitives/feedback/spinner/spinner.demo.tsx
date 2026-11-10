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
      note: "Use `busy` on the button: it shows a spinner, blocks clicks, and keeps its width.",
      render: () => <Button busy>Saving</Button>,
    },
  ],
});
