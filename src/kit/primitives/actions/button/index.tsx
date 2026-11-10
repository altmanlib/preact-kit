import "./button.css";

import type { ComponentChildren, ComponentProps } from "preact";

import { Spinner } from "../../feedback/spinner/index.tsx";

type Look = {
  /** `default` is the neutral fill; `primary` is the one main action of a view; `quiet` has no fill until hovered; `text` is link-like, with no fill at all. */
  variant?: "default" | "primary" | "quiet" | "text" | "danger";
  size?: "sm" | "md" | "lg";
  /** Shows a spinner, blocks the action, and keeps the control's width. */
  busy?: boolean;
};

export type ButtonProps = Omit<ComponentProps<"button">, "size"> & Look;

export type LinkButtonProps = Omit<ComponentProps<"a">, "size"> & Look & { href: string };

function buttonClass({ variant = "default", size = "md", busy = false }: Look, extra: string | undefined): string {
  return ["btn", variant === "default" ? "" : `btn-${variant}`, size === "md" ? "" : `btn-${size}`, busy ? "btn-busy" : "", extra ?? ""]
    .filter(Boolean)
    .join(" ");
}

function BusyContents({ children }: { children: ComponentChildren }) {
  return (
    <>
      <span class="btn-label">{children}</span>
      <span class="btn-busy-spin" aria-hidden="true">
        <Spinner size="sm" />
      </span>
    </>
  );
}

/** A native button in the kit's look; every other attribute goes to the element. */
export function Button({ variant, size, type = "button", class: className, children, busy, disabled, ...rest }: ButtonProps) {
  const isBusy = Boolean(busy);
  return (
    <button
      {...rest}
      type={type}
      class={buttonClass({ variant, size, busy: isBusy }, className as string | undefined)}
      disabled={disabled || isBusy}
      aria-busy={isBusy || undefined}
    >
      {isBusy ? <BusyContents>{children}</BusyContents> : children}
    </button>
  );
}

/** A link in the button's look, for an action that navigates or downloads. */
export function LinkButton({ variant, size, class: className, children, busy, onClick, "aria-disabled": ariaDisabled, ...rest }: LinkButtonProps) {
  const isBusy = Boolean(busy);
  return (
    <a
      {...(rest as Record<string, unknown>)}
      class={buttonClass({ variant, size, busy: isBusy }, className as string | undefined)}
      aria-busy={isBusy || undefined}
      aria-disabled={isBusy || ariaDisabled}
      onClick={(event) => {
        if (isBusy) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        onClick?.(event);
      }}
    >
      {isBusy ? <BusyContents>{children}</BusyContents> : children}
    </a>
  );
}
