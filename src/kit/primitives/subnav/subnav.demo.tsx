import { defineDemo } from "../../demo.ts";
import { SubNav } from "./index.tsx";

export default defineDemo({
  name: "SubNav",
  kind: "primitive",
  summary: "In-page tabs where every part has its own address.",
  examples: [
    {
      title: "Route tabs",
      note: "Links, not buttons: the address is the state. For state-only tabs use Tabs (planned).",
      render: () => (
        <SubNav
          label="Settings"
          current="profile"
          items={[
            { key: "profile", href: "#/subnav", label: "Profile" },
            { key: "security", href: "#/subnav", label: "Security" },
            { key: "notifications", href: "#/subnav", label: "Notifications" },
          ]}
        />
      ),
    },
  ],
});
