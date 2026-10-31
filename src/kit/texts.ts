/** The fixed sentences of the kit's components. English by default; an app calls `setKitText` once, before rendering, to translate or reword them. */
export const defaultText = {
  loading: "Loading…",
  retry: "Retry",
  cancel: "Cancel",
  confirm: "Confirm",
  close: "Close",
  copy: "Copy",
  copied: "Copied",
  copyFailed: "Copy failed",
  empty: "No records",
  prevPage: "Previous",
  nextPage: "Next",
  pagination: "Pagination",
  notifications: "Notifications",
  unknownError: "Something went wrong. Please try again.",
};

export type KitText = typeof defaultText;

export const kitText: KitText = { ...defaultText };

/** Replace some or all of the kit's sentences. */
export function setKitText(overrides: Partial<KitText>): void {
  Object.assign(kitText, overrides);
}
