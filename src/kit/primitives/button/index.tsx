import "./button.css";

import type { ComponentProps } from "preact";

type Look = {
  /** `default` is the neutral fill; `primary` is the one main action of a view. */
  variant?: "default" | "primary" | "quiet" | "danger";
  size?: "sm" | "md" | "lg";
};

export type ButtonProps = Omit<ComponentProps<"button">, "size"> & Look;

export type LinkButtonProps = Omit<ComponentProps<"a">, "size"> & Look & { href: string };

function buttonClass({ variant = "default", size = "md" }: Look, extra: string | undefined): string {
  return ["btn", variant === "default" ? "" : `btn-${variant}`, size === "md" ? "" : `btn-${size}`, extra ?? ""].filter(Boolean).join(" ");
}

/** A native button in the kit's look; every other attribute goes to the element. */
export function Button({ variant, size, type = "button", class: className, children, ...rest }: ButtonProps) {
  return (
    <button type={type} class={buttonClass({ variant, size }, className as string | undefined)} {...rest}>
      {children}
    </button>
  );
}

/** A link in the button's look, for an action that navigates or downloads. */
export function LinkButton({ variant, size, class: className, children, ...rest }: LinkButtonProps) {
  return (
    <a class={buttonClass({ variant, size }, className as string | undefined)} {...(rest as Record<string, unknown>)}>
      {children}
    </a>
  );
}
