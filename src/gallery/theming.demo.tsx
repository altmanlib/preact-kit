import { defineDemo } from "../kit/demo.ts";
import { Button } from "../kit/primitives/actions/button/index.tsx";
import { Note } from "../kit/primitives/feedback/note/index.tsx";
import { TextField } from "../kit/primitives/form/field/index.tsx";
import { BRAND_PRESETS, brandInk } from "./brand.ts";

function BrandSwitcher() {
  const current = brandInk.value;
  return (
    <div class="demo-stack">
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
        {BRAND_PRESETS.map((preset) => (
          <Button
            key={preset.id}
            variant={current === preset.ink ? "primary" : "default"}
            onClick={() => {
              brandInk.value = preset.ink;
            }}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <p class="muted">The override stays while you browse other pages. Reset returns to the kit purple.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", alignItems: "center" }}>
        <Button variant="primary">Primary</Button>
        <Button>Default</Button>
        <Button variant="text">Text link</Button>
        <TextField label="Email" type="email" value="" onChange={() => undefined} placeholder="you@example.com" />
      </div>
      <Note tone="ok">A soft accent and the focus ring follow --ink as well.</Note>
    </div>
  );
}

/** Gallery-only: lives here so kit never imports the gallery (architecture.test.ts). */
export default defineDemo({
  name: "Theming",
  kind: "primitive",
  summary: "Override one --ink pair to rebrand the kit. Hover, fill, soft accent and the focus ring follow.",
  examples: [
    {
      title: "Brand presets",
      note: "Each preset is a light-dark() pair assigned to --ink on the document. Derived tokens use var(--ink), so one override is enough.",
      render: () => <BrandSwitcher />,
    },
  ],
});
