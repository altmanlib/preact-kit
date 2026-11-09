import { defineDemo } from "../../../demo.ts";
import { Button, LinkButton } from "./index.tsx";

export default defineDemo({
  name: "Button",
  kind: "primitive",
  summary: "A native button in five looks and three sizes, and a link in the same look.",
  examples: [
    {
      title: "Variants",
      note: "One primary per view; danger only for destructive actions. Text is link-like and lighter than quiet: for a small action inside a line or a note.",
      render: () => (
        <>
          <Button>Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="quiet">Quiet</Button>
          <Button variant="text">Text</Button>
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
      title: "Text variant in a line",
      note: "It has no fill in any state: hover only underlines it, so it reads as part of the sentence.",
      render: () => (
        <p>
          Your changes are not saved. <Button variant="text">Save now</Button> or <Button variant="text">discard</Button>.
        </p>
      ),
    },
    {
      title: "LinkButton",
      note: "For an action that navigates or downloads: an anchor with the button's look.",
      render: () => (
        <>
          <LinkButton href="#/button">Open</LinkButton>
          <LinkButton href="#/button" variant="primary">
            Download
          </LinkButton>
          <LinkButton href="#/button" variant="text">
            Learn more
          </LinkButton>
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
          <Button variant="text" disabled>
            Text
          </Button>
        </>
      ),
    },
  ],
});
