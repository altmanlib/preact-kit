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
  increase: "Increase",
  decrease: "Decrease",
  confirmTitle: "Please confirm",
  remove: "Remove",
  breadcrumb: "Breadcrumb",
  mainNavigation: "Main navigation",
  theme: "Theme",
  themeSystem: "System",
  themeLight: "Light",
  themeDark: "Dark",
  today: "Today",
  noResults: "No matches",
  showOptions: "Show options",
  fileInvalidType: "This file type is not allowed",
  fileTooLarge: "The file is too large",
  fileTooSmall: "The file is too small",
  tooManyFiles: "Too many files",
  fileRejected: "This file cannot be used",
  unknownError: "Something went wrong. Please try again.",
};

export type KitText = typeof defaultText;

export const kitText: KitText = { ...defaultText };

/** Replace some or all of the kit's sentences. */
export function setKitText(overrides: Partial<KitText>): void {
  Object.assign(kitText, overrides);
}
