import { defineDemo } from "../../../demo.ts";
import { Breadcrumb } from "./index.tsx";

export default defineDemo({
  name: "Breadcrumb",
  kind: "primitive",
  summary: "The path to the current page.",
  examples: [
    {
      title: "Three levels",
      note: "The last item is the current page and is not a link.",
      render: () => <Breadcrumb items={[{ label: "Home", href: "#/" }, { label: "Orders", href: "#/breadcrumb" }, { label: "ORD-0042" }]} />,
    },
  ],
});
