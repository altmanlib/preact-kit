import { useSignal } from "@preact/signals";
import { FileText, Folder, Star } from "lucide-preact";
import type { ComponentChildren } from "preact";

import { defineDemo } from "../../demo.ts";
import { Avatar } from "../avatar/index.tsx";
import { Badge } from "../badge/index.tsx";
import { Empty } from "../empty/index.tsx";
import { NavList, type NavListItem } from "./index.tsx";

const frame = (children: ComponentChildren) => (
  <div class="demo-stack" style="max-width: 20rem">
    {children}
  </div>
);

function Selectable() {
  const current = useSignal("alpha");
  const items: NavListItem[] = [
    { key: "alpha", title: "Project Alpha", secondary: "Updated 2 hours ago", trailing: <Badge tone="ok">3</Badge> },
    { key: "beta", title: "Project Beta", secondary: "Updated yesterday" },
    { key: "gamma", title: "Project Gamma", secondary: "Updated last week", trailing: <Badge tone="warn">12</Badge> },
    { key: "delta", title: "Project Delta" },
  ];
  return frame(
    <>
      <NavList label="Projects" items={items} current={current.value} onSelect={(key) => (current.value = key)} />
      <p class="muted">Selected: {current.value}. Try ArrowUp, ArrowDown, Home and End.</p>
    </>,
  );
}

function LinkItems() {
  return frame(
    <NavList
      label="Sections"
      current="reports"
      items={[
        { key: "overview", title: "Overview", href: "#/navlist", leading: <Folder size={16} aria-hidden="true" /> },
        { key: "reports", title: "Reports", href: "#/navlist", leading: <FileText size={16} aria-hidden="true" />, trailing: <Badge tone="idle">8</Badge> },
        { key: "starred", title: "Starred", href: "#/navlist", leading: <Star size={16} aria-hidden="true" /> },
      ]}
    />,
  );
}

function WithAvatars() {
  const current = useSignal("ada");
  return frame(
    <NavList
      label="People"
      current={current.value}
      onSelect={(key) => (current.value = key)}
      items={[
        {
          key: "ada",
          title: "Ada Lovelace",
          secondary: "Mathematician",
          leading: <Avatar name="Ada Lovelace" size="sm" />,
          trailing: <Badge tone="ok">online</Badge>,
        },
        { key: "alan", title: "Alan Turing", secondary: "Logician", leading: <Avatar name="Alan Turing" size="sm" /> },
        { key: "grace", title: "Grace Hopper", secondary: "Computer scientist", leading: <Avatar name="Grace Hopper" size="sm" /> },
      ]}
    />,
  );
}

function Long() {
  return frame(
    <NavList
      label="Long text"
      current="a"
      onSelect={() => undefined}
      items={[
        {
          key: "a",
          title: "A title that is far too long to fit into the narrow column it has been given",
          secondary: "A second line that is just as long and is cut with an ellipsis as well",
          trailing: <Badge tone="bad">128</Badge>,
        },
        { key: "b", title: "Another extremely long title without any secondary text at all, to be cut", leading: <Star size={16} aria-hidden="true" /> },
      ]}
    />,
  );
}

function Disabled() {
  return frame(
    <NavList
      label="Mixed states"
      current="open"
      onSelect={() => undefined}
      items={[
        { key: "open", title: "Open item" },
        { key: "locked", title: "Disabled button", secondary: "Skipped by the arrow keys", disabled: true },
        { key: "link", title: "Disabled link", href: "#/navlist", disabled: true },
        { key: "other", title: "Another open item" },
      ]}
    />,
  );
}

export default defineDemo({
  name: "NavList",
  kind: "primitive",
  summary: "A vertical list of selectable items with a title, a second line and slots on either side.",
  examples: [
    {
      title: "Buttons with a selected value",
      note: "Items without `href` are buttons: the caller keeps `current` and handles `onSelect`.",
      render: () => <Selectable />,
    },
    { title: "Links", note: "Items with `href` are links: the address is the state, so mark the standing one with `current`.", render: () => <LinkItems /> },
    { title: "Leading slot", note: "An Avatar or an icon goes in `leading`, a Badge or a count in `trailing`.", render: () => <WithAvatars /> },
    { title: "Long text", note: "Title and second line are cut with an ellipsis; the slots keep their size.", render: () => <Long /> },
    { title: "Disabled items", note: "Disabled items are not focusable and the arrow keys skip them.", render: () => <Disabled /> },
    {
      title: "No items",
      note: "An empty list draws nothing by itself; show a compact Empty in its place.",
      render: () => frame(<Empty compact>Nothing here yet.</Empty>),
    },
  ],
});
