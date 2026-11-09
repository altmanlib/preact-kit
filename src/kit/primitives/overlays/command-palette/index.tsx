import "./command-palette.css";

import { Search } from "lucide-preact";
import type { ComponentChildren } from "preact";
import { useEffect, useId, useRef, useState } from "preact/hooks";

import { useLeavingDialog } from "../../../lib/leaving-dialog.ts";
import { kitText } from "../../../texts.ts";
import { DialogLayer } from "../../_shared/dialog-layer.tsx";

export type CommandItem = {
  key: string;
  label: string;
  /** Items with the same group that follow each other share one heading. */
  group?: string;
  /** A short secondary line beside the label. */
  hint?: string;
  /** Something before the label, e.g. an icon. */
  icon?: ComponentChildren;
  onSelect: () => void;
};

/**
 * A search-and-run dialog: a text box over a list of commands that narrows as you type. Arrow keys move the highlight
 * while focus stays in the box, Enter runs the highlighted command and closes, Esc or a click outside closes (Zag
 * dialog machine); typing with an input method does not trigger Enter. Mount it to open it, like `Modal`.
 *
 * By default the component narrows `items` itself, by a case-insensitive match on label and hint. Pass `filter={false}`
 * when the caller narrows them (for example from a server search) and watch the text through `onQueryChange`.
 */
export function CommandPalette({
  label,
  placeholder,
  items,
  filter = true,
  onQueryChange,
  emptyText = kitText.noResults,
  onClose,
}: {
  /** The dialog's accessible name. */
  label: string;
  placeholder?: string;
  items: CommandItem[];
  filter?: boolean;
  onQueryChange?: (query: string) => void;
  emptyText?: string;
  onClose: () => void;
}) {
  const { api, exiting, leave } = useLeavingDialog({ onClose, focusFirst: true });
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const listId = useId();

  const needle = query.trim().toLowerCase();
  const shown = filter && needle !== "" ? items.filter((item) => `${item.label} ${item.hint ?? ""}`.toLowerCase().includes(needle)) : items;
  const count = shown.length;
  const current = count === 0 ? 0 : Math.min(active, count - 1);
  const optionId = (index: number) => `${listId}-${index}`;

  useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [current, query]);

  const run = (item: CommandItem | undefined) => {
    if (item === undefined) return;
    leave();
    item.onSelect();
  };

  let lastGroup: string | undefined;
  return (
    <DialogLayer api={api} exiting={exiting} contentClass="palette" positionerClass="palette-positioner" label={label}>
      <div class="palette-input">
        <Search size={16} aria-hidden="true" />
        <input
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={count === 0 ? undefined : optionId(current)}
          aria-autocomplete="list"
          aria-label={label}
          placeholder={placeholder}
          autocomplete="off"
          spellcheck={false}
          value={query}
          onInput={(event) => {
            setQuery(event.currentTarget.value);
            setActive(0);
            onQueryChange?.(event.currentTarget.value);
          }}
          onKeyDown={(event) => {
            if (event.isComposing || event.keyCode === 229) return;
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              if (count > 0) setActive((current + (event.key === "ArrowDown" ? 1 : count - 1)) % count);
            } else if (event.key === "Enter") {
              event.preventDefault();
              run(shown[current]);
            }
          }}
        />
      </div>
      <div id={listId} class="palette-list" role="listbox" aria-label={label} ref={list}>
        {count === 0 ? <p class="palette-empty">{emptyText}</p> : null}
        {shown.map((item, index) => {
          const heading = item.group !== lastGroup ? item.group : undefined;
          lastGroup = item.group;
          return (
            <div key={item.key} role="presentation">
              {heading !== undefined ? <div class="palette-group">{heading}</div> : null}
              <div
                id={optionId(index)}
                role="option"
                class="pop-item palette-item"
                aria-selected={index === current}
                data-highlighted={index === current ? "" : undefined}
                onPointerMove={() => setActive(index)}
                onClick={() => run(item)}
              >
                {item.icon}
                <span class="palette-label">{item.label}</span>
                {item.hint !== undefined ? <span class="palette-hint">{item.hint}</span> : null}
              </div>
            </div>
          );
        })}
      </div>
    </DialogLayer>
  );
}
