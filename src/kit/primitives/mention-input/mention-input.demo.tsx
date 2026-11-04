import { useSignal } from "@preact/signals";
import { useRef } from "preact/hooks";

import { defineDemo } from "../../demo.ts";
import { Avatar } from "../avatar/index.tsx";
import { Button } from "../button/index.tsx";
import { MentionInput, type MentionInputHandle } from "./index.tsx";

const PEOPLE = [
  { id: "ada", name: "Ada Lovelace", role: "Engineering" },
  { id: "alan", name: "Alan Turing", role: "Research" },
  { id: "grace", name: "Grace Hopper", role: "Engineering" },
  { id: "linus", name: "Linus Pauling", role: "Chemistry" },
];

function ChatDemo() {
  const text = useSignal("");
  const sent = useSignal<string[]>([]);
  const handle = useRef<MentionInputHandle | null>(null);
  const send = (body: string) => {
    if (body.trim() === "") return;
    sent.value = [...sent.value, body.trim()];
    handle.current?.clear();
  };
  return (
    <div class="demo-stack">
      <MentionInput
        label="Message"
        triggers={["@", "＠"]}
        placeholder="Type @ to mention someone, Enter to send, Shift+Enter for a new line"
        handle={handle}
        items={(match) =>
          PEOPLE.filter((person) => person.name.toLowerCase().includes(match.query.toLowerCase())).map((person) => ({
            key: person.id,
            label: person.name,
            hint: person.role,
            leading: <Avatar name={person.name} size="sm" />,
          }))
        }
        onChange={(next) => (text.value = next)}
        onSubmit={send}
      />
      <div>
        <Button size="sm" onClick={() => send(text.value)} disabled={text.value.trim() === ""}>
          Send
        </Button>
      </div>
      <p>
        Plain text now: <code>{JSON.stringify(text.value)}</code>
      </p>
      <ul>
        {sent.value.map((line, index) => (
          <li key={index}>
            <code>{JSON.stringify(line)}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default defineDemo({
  name: "MentionInput",
  kind: "primitive",
  summary: "A text field whose mentions are chips: chosen from a list after a trigger character, deleted as a whole, kept as plain text.",
  examples: [
    {
      title: "Chat message",
      note: "Type @ and a few letters; arrows move, Enter or Tab choose, Esc closes. Backspace removes a chip in one press. Pasted text keeps text only.",
      render: () => <ChatDemo />,
    },
    {
      title: "Disabled",
      note: "No editing, no list.",
      render: () => (
        <div class="demo-stack">
          <MentionInput label="Message" triggers={["@"]} items={() => []} placeholder="Waiting for a connection…" disabled />
        </div>
      ),
    },
  ],
});
