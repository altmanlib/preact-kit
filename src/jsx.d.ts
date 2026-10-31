// The Popover API attributes that Preact's JSX types do not know yet.
import "preact";

declare module "preact" {
  namespace JSX {
    interface HTMLAttributes<RefType extends EventTarget = EventTarget> {
      popover?: "auto" | "manual" | "hint" | "";
      popovertarget?: string;
      popovertargetaction?: "toggle" | "show" | "hide";
      onToggle?: (event: Event & { newState: "open" | "closed" }) => void;
    }
  }
}
