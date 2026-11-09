import "./icon-button.css";

import type { ComponentProps } from "preact";

export type IconButtonProps = Omit<ComponentProps<"button">, "aria-label" | "title"> & {
  /** What the button does; it is the accessible name and the tooltip, since the button shows only an icon. */
  label: string;
  /** Colour the button for an outcome, e.g. a copy that just worked. */
  state?: "ok" | "bad";
};

/** A quiet square button that carries only an icon; give it a 16px icon as its child. */
export function IconButton({ label, state, type = "button", class: className, children, ...rest }: IconButtonProps) {
  const classes = ["btn-icon", state ? `btn-icon-${state}` : "", className ?? ""].filter(Boolean).join(" ");
  return (
    <button type={type} class={classes} aria-label={label} title={label} {...rest}>
      {children}
    </button>
  );
}
