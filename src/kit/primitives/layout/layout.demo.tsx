import { defineDemo } from "../../demo.ts";
import { Button } from "../button/index.tsx";
import { Card } from "../card/index.tsx";
import { Grid, Stack } from "./index.tsx";

export default defineDemo({
  name: "Layout",
  kind: "primitive",
  summary: "Stack and Grid: spacing from the token scale instead of ad-hoc margins.",
  examples: [
    {
      title: "Stack",
      note: 'A column by default; `direction="row"` wraps. `gap` is a step on the spacing scale.',
      render: () => (
        <div class="demo-stack">
          <Stack gap={4}>
            <p>First line</p>
            <p>Second line</p>
            <Stack direction="row" gap={2} justify="between">
              <Button>Cancel</Button>
              <Button variant="primary">Save</Button>
            </Stack>
          </Stack>
        </div>
      ),
    },
    {
      title: "Grid",
      note: "As many columns as fit at least `min` wide; resize the window to see it reflow.",
      render: () => (
        <div class="demo-stack">
          <Grid min="12rem">
            <Card title="One">First</Card>
            <Card title="Two">Second</Card>
            <Card title="Three">Third</Card>
            <Card title="Four">Fourth</Card>
          </Grid>
        </div>
      ),
    },
  ],
});
