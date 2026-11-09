import { useSignal } from "@preact/signals";

import { defineDemo } from "../../demo.ts";
import { RangeSlider, Slider } from "./index.tsx";

function SliderDemo() {
  const volume = useSignal(40);
  const price = useSignal<[number, number]>([20, 80]);
  return (
    <div class="demo-stack">
      <Slider label="Volume" field={volume} hint="Arrows move by one, Page Up/Down by ten." />
      <Slider label="Opacity" value={0.5} min={0} max={1} step={0.1} format={(value) => `${Math.round(value * 100)}%`} onChange={() => undefined} />
      <RangeSlider label="Price" field={price} min={0} max={100} step={5} format={(value) => `$${value}`} />
      <Slider label="Locked" value={30} onChange={() => undefined} disabled />
    </div>
  );
}

export default defineDemo({
  name: "Slider",
  kind: "primitive",
  summary: "Choose a number, or a span between two, by dragging.",
  examples: [
    {
      title: "Single and range",
      note: "Use NumberField when the value must be typed exactly.",
      render: () => <SliderDemo />,
    },
  ],
});
