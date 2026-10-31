import { signal } from "@preact/signals";

/** The demo name in `#/<name>` (lower-cased), or empty for the index. */
export function parseHash(hash: string): string {
  return decodeURIComponent(hash.replace(/^#\/?/, "")).toLowerCase();
}

export function demoPath(name: string): string {
  return `#/${encodeURIComponent(name.toLowerCase())}`;
}

export const current = signal(parseHash(location.hash));

window.addEventListener("hashchange", () => {
  current.value = parseHash(location.hash);
});
