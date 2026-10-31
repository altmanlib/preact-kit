import "./button.css";

import type { ComponentProps } from "preact";

export type ButtonProps = Omit<ComponentProps<"button">, "size"> & {
  /** `default` is the neutral fill; `primary` is the one main action of a view. */
  variant?: "default" | "primary" | "quiet" | "danger";
  size?: "sm" | "md" | "lg";
};

/** A native button in the kit's look; every other attribute goes to the element. */
export function Button({ variant = "default", size = "md", type = "button", class: className, children, ...rest }: ButtonProps) {
  const classes = ["btn", variant === "default" ? "" : `btn-${variant}`, size === "md" ? "" : `btn-${size}`, className ?? ""].filter(Boolean).join(" ");
  return (
    <button type={type} class={classes} {...rest}>
      {children}
    </button>
  );
}
