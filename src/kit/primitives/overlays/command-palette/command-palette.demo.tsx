import { useSignal } from "@preact/signals";
import { FileText, Moon, Settings } from "lucide-preact";

import { defineDemo } from "../../../demo.ts";
import { Button } from "../../actions/button/index.tsx";
import { CommandPalette } from "./index.tsx";

function PaletteDemo() {
  const open = useSignal(false);
  const last = useSignal("nothing yet");
  const run = (name: string) => () => (last.value = name);
  return (
    <>
      <Button onClick={() => (open.value = true)}>Open palette</Button>
      <span class="muted"> Ran: {last.value}</span>
      {open.value ? (
        <CommandPalette
          label="Command palette"
          placeholder="Type a command or a page…"
          onClose={() => (open.value = false)}
          items={[
            { key: "home", group: "Pages", label: "Home", hint: "The overview", icon: <FileText size={16} aria-hidden="true" />, onSelect: run("Home") },
            { key: "docs", group: "Pages", label: "Documentation", icon: <FileText size={16} aria-hidden="true" />, onSelect: run("Documentation") },
            { key: "settings", group: "Pages", label: "Settings", icon: <Settings size={16} aria-hidden="true" />, onSelect: run("Settings") },
            { key: "theme", group: "Actions", label: "Toggle dark mode", icon: <Moon size={16} aria-hidden="true" />, onSelect: run("Toggle dark mode") },
            { key: "signout", group: "Actions", label: "Sign out", onSelect: run("Sign out") },
          ]}
        />
      ) : null}
    </>
  );
}

export default defineDemo({
  name: "CommandPalette",
  kind: "primitive",
  summary: "A search-and-run dialog: type to narrow a list of commands, arrows and Enter to run one.",
  examples: [
    {
      title: "Pages and actions",
      note: "Focus stays in the box; arrows move the highlight, Enter runs it, Esc closes. Bind the opening key in the app. With `filter={false}` the caller narrows the list itself.",
      render: () => <PaletteDemo />,
    },
  ],
});
