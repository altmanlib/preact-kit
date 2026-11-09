import "./avatar.css";

import { useSignal } from "@preact/signals";

import { initials } from "./initials.ts";

/** A round picture of a person or thing; the initials of `name` stand in when there is no `src` or it fails to load. `name` is also the accessible name. */
export function Avatar({ name, src, size = "md" }: { name: string; src?: string; size?: "sm" | "md" | "lg" }) {
  const failed = useSignal(false);
  const showImage = src !== undefined && !failed.value;
  return (
    <span class={size === "md" ? "avatar" : `avatar avatar-${size}`} role="img" aria-label={name}>
      {showImage ? <img src={src} alt="" onError={() => (failed.value = true)} /> : <span aria-hidden="true">{initials(name)}</span>}
    </span>
  );
}
