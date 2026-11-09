import { useSignal } from "@preact/signals";

import { defineDemo } from "../../../demo.ts";
import { Avatar } from "../../data-display/avatar/index.tsx";
import { Suggest } from "./index.tsx";

const PEOPLE = [
  { id: "ada", name: "Ada Lovelace", role: "Engineering" },
  { id: "alan", name: "Alan Turing", role: "Research" },
  { id: "grace", name: "Grace Hopper", role: "Engineering" },
  { id: "linus", name: "Linus Pauling", role: "Chemistry" },
];

function MentionDemo() {
  const text = useSignal("");
  const sent = useSignal<string[]>([]);
  return (
    <div class="demo-stack">
      <Suggest
        label="People"
        triggers={["@"]}
        items={(match) =>
          PEOPLE.filter((person) => person.name.toLowerCase().includes(match.query.toLowerCase())).map((person) => ({
            key: person.id,
            label: person.name,
            hint: person.role,
            leading: <Avatar name={person.name} size="sm" />,
          }))
        }
        onPick={(pick) => (text.value = pick.text)}
      >
        <textarea
          class="input"
          rows={3}
          placeholder="Type @ to mention someone, Enter to send"
          value={text.value}
          onInput={(event) => (text.value = event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
            event.preventDefault();
            if (text.value.trim() === "") return;
            sent.value = [...sent.value, text.value];
            text.value = "";
          }}
        />
      </Suggest>
      <ul>
        {sent.value.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

function TwoTriggersDemo() {
  const text = useSignal("");
  const sources: Record<string, { key: string; label: string }[]> = {
    "@": PEOPLE.map((person) => ({ key: person.id, label: person.name })),
    "#": [
      { key: "bug", label: "bug" },
      { key: "docs", label: "docs" },
      { key: "design", label: "design" },
    ],
  };
  return (
    <Suggest
      label="Mentions and tags"
      triggers={["@", "#"]}
      items={(match) => (sources[match.trigger] ?? []).filter((row) => row.label.toLowerCase().startsWith(match.query.toLowerCase()))}
      onPick={(pick) => (text.value = pick.text)}
    >
      <input class="input" placeholder="@ for people, # for tags" value={text.value} onInput={(event) => (text.value = event.currentTarget.value)} />
    </Suggest>
  );
}

export default defineDemo({
  name: "Suggest",
  kind: "primitive",
  summary: "A candidate list under a text input while a trigger character is being typed.",
  examples: [
    {
      title: "Mention",
      note: "Type @ then a few letters; arrows move, Enter or Tab choose, Esc closes. While the list is open Enter does not send.",
      render: () => <MentionDemo />,
    },
    {
      title: "Two triggers",
      note: "Each trigger brings its own candidates. An address such as ada@example.com does not open the list.",
      render: () => <TwoTriggersDemo />,
    },
  ],
});
