import "../_shared/popover.css";
import "../field/field.css";
import "./date-picker.css";

import { parseDate } from "@internationalized/date";
import * as zag from "@zag-js/date-picker";
import { normalizeProps, useMachine } from "@zag-js/preact";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-preact";
import { useId, useState } from "preact/hooks";

import { kitText } from "../../texts.ts";

type PickerBase = {
  label: string;
  hint?: string;
  error?: string;
  /** The earliest and latest date that can be chosen, as `YYYY-MM-DD`. */
  min?: string;
  max?: string;
  /** A BCP 47 tag that sets the typed format, the month names and the first weekday, e.g. `zh-CN`; default `en-US`. */
  locale?: string;
  /** With it a hidden input carries the `YYYY-MM-DD` value in a form (a range posts `<name>-start` and `<name>-end`). */
  name?: string;
  disabled?: boolean;
};

const toDates = (values: string[]) => values.map((value) => parseDate(value));

function Calendar({ api }: { api: zag.Api }) {
  const columns = 4;
  return (
    <>
      <div class="cal-head" {...api.getViewControlProps({ view: "year" })}>
        <button type="button" class="cal-nav" {...api.getPrevTriggerProps()}>
          <ChevronLeft size={16} aria-hidden="true" />
        </button>
        <button type="button" class="cal-title" {...api.getViewTriggerProps()}>
          {api.visibleRangeText.formatted}
        </button>
        <button type="button" class="cal-nav" {...api.getNextTriggerProps()}>
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>

      {api.view === "day" ? (
        <table class="cal-table" {...api.getTableProps({ view: "day" })}>
          <thead {...api.getTableHeadProps({ view: "day" })}>
            <tr {...api.getTableRowProps({ view: "day" })}>
              {api.weekDays.map((day) => (
                <th key={day.long} scope="col" aria-label={day.long}>
                  {day.narrow}
                </th>
              ))}
            </tr>
          </thead>
          <tbody {...api.getTableBodyProps({ view: "day" })}>
            {api.weeks.map((week) => (
              <tr key={week[0]?.toString()} {...api.getTableRowProps({ view: "day" })}>
                {week.map((value) => (
                  <td key={value.toString()} {...api.getDayTableCellProps({ value })}>
                    <div class="cal-cell" {...api.getDayTableCellTriggerProps({ value })}>
                      {value.day}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {api.view === "month" ? (
        <table class="cal-table" {...api.getTableProps({ view: "month", columns })}>
          <tbody {...api.getTableBodyProps({ view: "month" })}>
            {api.getMonthsGrid({ columns, format: "short" }).map((months) => (
              <tr key={months[0]?.value} {...api.getTableRowProps()}>
                {months.map((month) => (
                  <td key={month.value} {...api.getMonthTableCellProps({ ...month, columns })}>
                    <div class="cal-cell" {...api.getMonthTableCellTriggerProps({ ...month, columns })}>
                      {month.label}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {api.view === "year" ? (
        <table class="cal-table" {...api.getTableProps({ view: "year", columns })}>
          <tbody {...api.getTableBodyProps({ view: "year" })}>
            {api.getYearsGrid({ columns }).map((years) => (
              <tr key={years[0]?.value} {...api.getTableRowProps()}>
                {years.map((year) => (
                  <td key={year.value} {...api.getYearTableCellProps({ ...year, columns })}>
                    <div class="cal-cell" {...api.getYearTableCellTriggerProps({ ...year, columns })}>
                      {year.label}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </>
  );
}

function Picker({
  label,
  hint,
  error,
  min,
  max,
  locale,
  name,
  disabled = false,
  range,
  values,
  onValues,
}: PickerBase & { range: boolean; values: string[]; onValues: (values: string[]) => void }) {
  // In a range, the start is chosen before the end: hold it here and report only a complete range.
  const [draft, setDraft] = useState<string[] | undefined>(undefined);
  const service = useMachine(zag.machine, {
    id: useId(),
    selectionMode: range ? "range" : "single",
    value: toDates(draft ?? values),
    min: min === undefined ? undefined : parseDate(min),
    max: max === undefined ? undefined : parseDate(max),
    locale,
    disabled,
    closeOnSelect: true,
    fixedWeeks: true,
    onValueChange: (details) => {
      const next = details.value.map((date) => date.toString());
      if (range && next.length === 1) {
        setDraft(next);
        return;
      }
      setDraft(undefined);
      onValues(next);
    },
    onOpenChange: (details) => {
      if (!details.open) setDraft(undefined);
    },
    positioning: { placement: "bottom-start", gutter: 4, strategy: "fixed" },
  });
  const api = zag.connect(service, normalizeProps);
  const invalid = error !== undefined && error !== "";

  return (
    <div class="field" {...api.getRootProps()}>
      <label {...api.getLabelProps()}>{label}</label>
      <div class="date-control" data-invalid={invalid ? "" : undefined} {...api.getControlProps()}>
        <input class="date-input" {...(api.getInputProps({ index: 0 }) as Record<string, unknown>)} />
        {range ? (
          <>
            <span class="date-sep" aria-hidden="true">
              –
            </span>
            <input class="date-input" {...(api.getInputProps({ index: 1 }) as Record<string, unknown>)} />
          </>
        ) : null}
        <button type="button" class="date-trigger" {...api.getTriggerProps()}>
          <CalendarDays size={16} aria-hidden="true" />
        </button>
      </div>
      {name && !range ? <input type="hidden" name={name} value={values[0] ?? ""} /> : null}
      {name && range ? (
        <>
          <input type="hidden" name={`${name}-start`} value={values[0] ?? ""} />
          <input type="hidden" name={`${name}-end`} value={values[1] ?? ""} />
        </>
      ) : null}
      <div class="popup-positioner" {...api.getPositionerProps()}>
        <div class="popup calendar" {...api.getContentProps()}>
          {api.open ? <Calendar api={api} /> : null}
          {range || !api.open ? null : (
            <button type="button" class="cal-today" onClick={() => api.selectToday()}>
              {kitText.today}
            </button>
          )}
        </div>
      </div>
      {hint ? <small>{hint}</small> : null}
      {invalid ? <small class="field-bad">{error}</small> : null}
    </div>
  );
}

/**
 * A date field with a calendar. `value` is a `YYYY-MM-DD` string (`undefined` for none), whatever the locale shows in the
 * box, so it goes straight to a server. The date can be typed in the locale's format or picked: the month and year in
 * the heading open a month or year grid, and the arrow keys, Page Up/Down, Home and End move around the calendar
 * (Zag date-picker machine). Dates outside `min`/`max` cannot be chosen.
 */
export function DatePicker({ value, onChange, ...base }: PickerBase & { value: string | undefined; onChange: (value: string | undefined) => void }) {
  return <Picker {...base} range={false} values={value === undefined ? [] : [value]} onValues={(values) => onChange(values[0])} />;
}

/** A start date and an end date in two boxes with one calendar; `value` is `[start, end]`, `undefined` until both are chosen. */
export function DateRangePicker({
  value,
  onChange,
  ...base
}: PickerBase & { value: [string, string] | undefined; onChange: (value: [string, string] | undefined) => void }) {
  return (
    <Picker
      {...base}
      range={true}
      values={value ?? []}
      onValues={(values) => {
        const [start, end] = values;
        onChange(start !== undefined && end !== undefined ? [start, end] : undefined);
      }}
    />
  );
}
