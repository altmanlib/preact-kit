import "../../_shared/popover.css";
import "./select.css";

import { Check } from "lucide-preact";
import type { ComponentChildren } from "preact";

export type SelectOption = { value: string; label: string; disabled?: boolean };

/** The part of a Zag select or combobox `api` that draws a list of options, so both can share this component. */
export type OptionListApi = {
  getPositionerProps: () => object;
  getContentProps: () => object;
  getItemProps: (props: { item: SelectOption }) => object;
  getItemTextProps: (props: { item: SelectOption }) => object;
  getItemIndicatorProps: (props: { item: SelectOption }) => object;
};

/** The popup of a Select or Combobox: the positioner, the surface, and one row per option with its check mark. `empty` shows in place of the rows when there are none. */
export function OptionList({ api, options, empty }: { api: OptionListApi; options: SelectOption[]; empty?: ComponentChildren }) {
  return (
    <div class="popup-positioner" {...api.getPositionerProps()}>
      <div class="popup select-list" {...api.getContentProps()}>
        {options.length === 0 ? empty : null}
        {options.map((option) => (
          <div key={option.value} class="pop-item" {...api.getItemProps({ item: option })}>
            <span {...api.getItemTextProps({ item: option })}>{option.label}</span>
            <span {...api.getItemIndicatorProps({ item: option })}>
              <Check size={16} aria-hidden="true" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
