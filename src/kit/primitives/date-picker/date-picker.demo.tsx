import { useSignal } from "@preact/signals";

import { defineDemo } from "../../demo.ts";
import { DatePicker, DateRangePicker } from "./index.tsx";

function DateDemo() {
  const day = useSignal<string | undefined>(undefined);
  const stay = useSignal<[string, string] | undefined>(undefined);
  return (
    <div class="demo-stack">
      <DatePicker label="Due date" hint={`Value: ${day.value ?? "none"}`} value={day.value} onChange={(value) => (day.value = value)} name="due" />
      <DatePicker label="Within 2026" min="2026-01-01" max="2026-12-31" value="2026-06-15" onChange={() => undefined} />
      <DatePicker label="Chinese format" locale="zh-CN" value={day.value} onChange={(value) => (day.value = value)} />
      <DateRangePicker label="Stay" hint={`Value: ${stay.value?.join(" → ") ?? "none"}`} value={stay.value} onChange={(value) => (stay.value = value)} />
      <DatePicker label="Locked" value="2026-01-01" onChange={() => undefined} disabled />
      <DatePicker label="Required" value={undefined} onChange={() => undefined} error="This field is required." />
    </div>
  );
}

export default defineDemo({
  name: "DatePicker",
  kind: "primitive",
  summary: "Type or pick a date, or a start and an end date; the value is always `YYYY-MM-DD`.",
  examples: [
    {
      title: "Single and range",
      note: "Click the month in the calendar heading for a month grid, again for years. Arrows, Page Up/Down, Home and End move around.",
      render: () => <DateDemo />,
    },
  ],
});
