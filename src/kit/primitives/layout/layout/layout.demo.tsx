import { defineDemo } from "../../../demo.ts";
import { Button } from "../../actions/button/index.tsx";
import { Card } from "../../data-display/card/index.tsx";
import { Container, Grid, Page, Spacer, Split, Stack } from "./index.tsx";

export default defineDemo({
  name: "Layout",
  kind: "primitive",
  summary: "Stack, Grid, Split, Container and Page: spacing from the token scale instead of ad-hoc margins.",
  examples: [
    {
      title: "Stack",
      note: 'A column by default; `direction="row"` wraps (or stays on one line with `wrap={false}`). `gap` is a step on the spacing scale.',
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
      title: "Spacer",
      note: "In a row, pushes what follows it to the end: a title on the left, actions on the right.",
      render: () => (
        <div class="demo-stack">
          <Stack direction="row" gap={2} wrap={false}>
            <strong>Members</strong>
            <Spacer />
            <Button size="sm">Invite</Button>
            <Button size="sm" variant="primary">
              Add
            </Button>
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
    {
      title: "Split",
      note: "A main area beside a fixed-width column; below 760px they stack, main first. `sideFirst` puts the column on the left.",
      render: () => (
        <div class="demo-stack">
          <Split side={<Card title="Details">Fixed width, here 14rem.</Card>} sideWidth="14rem">
            <Card title="Main">Takes the rest of the row and may shrink below its content.</Card>
          </Split>
          <Split side={<Card title="Filters">On the left.</Card>} sideWidth="12rem" sideFirst>
            <Card title="Results">Main area.</Card>
          </Split>
        </div>
      ),
    },
    {
      title: "Container",
      note: "Centres a column no wider than `sm`, `md` or `lg`, with the page gutter on each side.",
      render: () => (
        <Container size="sm">
          <Card title="Narrow column">Never wider than the `sm` width, however wide the window.</Card>
        </Container>
      ),
    },
    {
      title: "Page",
      note: "The title block and the body: the body's children stack with `gap`.",
      render: () => (
        <div class="demo-stack">
          <Page
            title="Settings"
            intro="Everything that applies to the whole workspace."
            actions={
              <Button variant="primary" size="sm">
                Save
              </Button>
            }
          >
            <Card title="Profile">Name and avatar.</Card>
            <Card title="Billing">Plan and invoices.</Card>
          </Page>
        </div>
      ),
    },
  ],
});
