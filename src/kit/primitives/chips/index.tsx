import "./chips.css";

/** Filter chips: one selected value, or `undefined` for all. With a `title` the group is named and shows it as a prefix. */
export function Chips<T extends string>({
  options,
  value,
  onChange,
  title,
}: {
  options: { value: T | undefined; label: string }[];
  value: T | undefined;
  onChange: (next: T | undefined) => void;
  title?: string;
}) {
  const chips = (
    <div class="chips" role="group" aria-label={title}>
      {options.map((option) => (
        <button
          key={option.label}
          type="button"
          class={`chip${option.value === value ? " chip-on" : ""}`}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
  if (title === undefined) return chips;
  return (
    <div class="chips-titled">
      <span class="chips-title" aria-hidden="true">
        {title}
      </span>
      {chips}
    </div>
  );
}
