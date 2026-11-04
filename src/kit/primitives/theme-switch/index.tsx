import "../chips/chips.css";
import "./theme-switch.css";

import { Monitor, Moon, Sun } from "lucide-preact";
import { useId } from "preact/hooks";

import { type Theme, theme, THEMES } from "../../lib/theme.ts";
import { kitText } from "../../texts.ts";

const OPTIONS = {
  system: { Icon: Monitor, text: () => kitText.themeSystem },
  light: { Icon: Sun, text: () => kitText.themeLight },
  dark: { Icon: Moon, text: () => kitText.themeDark },
} satisfies Record<Theme, unknown>;

/**
 * A three-way segmented control (system, light, dark) bound to the kit's `theme` signal. Radios under a radiogroup, so
 * the arrow keys and the group's single tab stop are the browser's own. Each option shows an icon; `showLabels` adds the
 * word. Call `applyTheme()` once at startup, or the choice changes nothing on the page.
 */
export function ThemeSwitch({ label = kitText.theme, showLabels = false }: { label?: string; showLabels?: boolean }) {
  const name = useId();
  return (
    <div class="theme-switch" role="radiogroup" aria-label={label}>
      {THEMES.map((value) => {
        const { Icon, text } = OPTIONS[value];
        return (
          <label key={value} class="theme-option" title={text()}>
            <input
              class="theme-input"
              type="radio"
              name={name}
              value={value}
              checked={theme.value === value}
              aria-label={text()}
              onChange={() => {
                theme.value = value;
              }}
            />
            <Icon size={16} aria-hidden="true" />
            {showLabels ? <span aria-hidden="true">{text()}</span> : null}
          </label>
        );
      })}
    </div>
  );
}
