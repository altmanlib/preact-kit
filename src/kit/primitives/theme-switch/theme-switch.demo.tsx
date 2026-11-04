import { defineDemo } from "../../demo.ts";
import { theme } from "../../lib/theme.ts";
import { ThemeSwitch } from "./index.tsx";

export default defineDemo({
  name: "ThemeSwitch",
  kind: "primitive",
  summary: "A three-way control for the page theme: follow the system, light or dark.",
  examples: [
    {
      title: "Icons",
      note: "Each option is named by `kitText` (shown as a tooltip and read by screen readers); this is the compact form for a sidebar or a bar.",
      render: () => <ThemeSwitch />,
    },
    {
      title: "With labels",
      note: "`showLabels` adds the words where there is room, e.g. in a settings page.",
      render: () => <ThemeSwitch showLabels />,
    },
    {
      title: "Current value",
      note: "The choice lives in the `theme` signal of `lib/theme`; `applyTheme()` at startup stores it and sets `<html data-theme>`.",
      render: () => (
        <p class="muted">
          Theme: <code>{theme.value}</code>
        </p>
      ),
    },
  ],
});
