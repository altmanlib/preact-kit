import "../field/field.css";
import "./slider.css";

import { normalizeProps, useMachine } from "@zag-js/preact";
import * as zag from "@zag-js/slider";
import { useId } from "preact/hooks";

import { type Bound, bound } from "../../../lib/signals.ts";
import { inputProps } from "../../../lib/zag.ts";
import { FieldNotes } from "../field/index.tsx";

type SliderBase = {
  label: string;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
  name?: string;
  disabled?: boolean;
  /** Formats a value for the text beside the label (default: the number as is). */
  format?: (value: number) => string;
};

function Track({
  label,
  hint,
  min = 0,
  max = 100,
  step = 1,
  name,
  disabled = false,
  format = String,
  values,
  onValues,
}: SliderBase & { values: number[]; onValues: (values: number[]) => void }) {
  const service = useMachine(zag.machine, {
    id: useId(),
    value: values,
    min,
    max,
    step,
    name,
    disabled,
    "aria-label": values.map(() => label),
    onValueChange: (details) => onValues(details.value),
  });
  const api = zag.connect(service, normalizeProps);

  return (
    <div class="field slider" {...api.getRootProps()}>
      <div class="slider-head">
        <label {...api.getLabelProps()}>{label}</label>
        <output class="slider-value mono" {...api.getValueTextProps()}>
          {values.map(format).join(" – ")}
        </output>
      </div>
      <div class="slider-control" {...api.getControlProps()}>
        <div class="slider-track" {...api.getTrackProps()}>
          <div class="slider-range" {...api.getRangeProps()} />
        </div>
        {values.map((_, index) => (
          <div key={index} class="slider-thumb" {...api.getThumbProps({ index })}>
            <input {...inputProps(api.getHiddenInputProps({ index }))} />
          </div>
        ))}
      </div>
      <FieldNotes hint={hint} />
    </div>
  );
}

/**
 * Chooses one number in a range by dragging a thumb or with the arrow keys, Home, End and Page Up/Down (Zag slider
 * machine). The current value shows beside the label. For a value that must be typed exactly use NumberField.
 * Either a `field` signal or `value` with `onChange` (never both).
 */
export function Slider(props: SliderBase & Bound<number>) {
  const { value, set, rest } = bound<number, SliderBase>(props);
  return <Track {...rest} values={[value]} onValues={(values) => set(values[0] ?? value)} />;
}

/** Chooses a span between two numbers with two thumbs; the thumbs cannot cross. Same two modes as `Slider`, with a `[start, end]` value. */
export function RangeSlider(props: SliderBase & Bound<[number, number]>) {
  const { value, set, rest } = bound<[number, number], SliderBase>(props);
  return <Track {...rest} values={value} onValues={(values) => set([values[0] ?? value[0], values[1] ?? value[1]])} />;
}
