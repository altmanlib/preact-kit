import "../field/field.css";
import "./search-input.css";

import { Search } from "lucide-preact";

import { type Bound, bound } from "../../lib/signals.ts";

/** The props of `SearchInput`: either a `field` signal or `value` with `onChange` (never both). */
export type SearchInputProps = { label: string; placeholder?: string } & Bound<string>;

/**
 * A compact text filter for a toolbar, with a search icon; Esc clears it. `label` is its accessible name (it shows no
 * visible label). It follows a signal or is plain controlled, like `TextField`.
 */
export function SearchInput(props: SearchInputProps) {
  const { value, set, rest } = bound<string, { label: string; placeholder?: string }>(props);
  return (
    <label class="control-box search-input">
      <Search size={16} aria-hidden="true" />
      <input
        type="search"
        value={value}
        placeholder={rest.placeholder}
        aria-label={rest.label}
        onInput={(event) => set(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key !== "Escape" || value === "") return;
          // The first Esc only clears; it must not also dismiss a dialog around the input.
          event.preventDefault();
          event.stopPropagation();
          set("");
        }}
      />
    </label>
  );
}
