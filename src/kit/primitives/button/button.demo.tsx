import { defineDemo } from "../../demo.ts";
import { Button } from "./index.tsx";

export default defineDemo({
  name: "Button",
  kind: "primitive",
  summary: "A native button in four tones and three sizes.",
  examples: [
    {
      title: "Variants",
      note: "One primary per view; danger only for destructive actions.",
      render: () => (
        <>
          <Button>Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="quiet">Quiet</Button>
          <Button variant="danger">Danger</Button>
        </>
      ),
    },
    {
      title: "Sizes",
      render: () => (
        <>
          <Button size="sm">Small</Button>
          <Button>Medium</Button>
          <Button size="lg">Large</Button>
        </>
      ),
    },
    {
      title: "Disabled",
      render: () => (
        <>
          <Button disabled>Default</Button>
          <Button variant="primary" disabled>
            Primary
          </Button>
          <Button variant="quiet" disabled>
            Quiet
          </Button>
        </>
      ),
    },
  ],
});
