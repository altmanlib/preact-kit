export type NumberLimits = { min?: number; max?: number };

/** The number a field's text stands for, or `undefined` for empty or anything that is not a plain decimal. */
export function parseNumber(text: string): number | undefined {
  const trimmed = text.trim();
  if (!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(trimmed)) return undefined;
  return Number(trimmed);
}

function decimalPlaces(value: number): number {
  const text = String(value);
  const dot = text.indexOf(".");
  return dot === -1 ? 0 : text.length - dot - 1;
}

function clamp(value: number, { min, max }: NumberLimits): number {
  if (min !== undefined && value < min) return min;
  if (max !== undefined && value > max) return max;
  return value;
}

/**
 * The text after pressing a stepper: one `step` up (`direction` 1) or down (-1) from the current value, rounded to the
 * precision of the step and the value so 0.1 + 0.2 reads 0.3, and kept within the limits. From empty or unreadable
 * text the first press lands on the start value: `min`, or 0.
 */
export function stepNumber(options: { text: string; direction: 1 | -1; step?: number } & NumberLimits): string {
  const { text, direction, step = 1, min, max } = options;
  const current = parseNumber(text);
  if (current === undefined) return String(clamp(min ?? 0, { min, max }));
  const places = Math.max(decimalPlaces(step), decimalPlaces(current));
  const next = Number((current + direction * step).toFixed(places));
  return String(clamp(next, { min, max }));
}

/** The text after the field loses focus: a readable number is pulled into the limits and tidied (`007` becomes `7`); anything else is left for the caller to report. */
export function normalizeNumber(text: string, limits: NumberLimits): string {
  const value = parseNumber(text);
  return value === undefined ? text : String(clamp(value, limits));
}
