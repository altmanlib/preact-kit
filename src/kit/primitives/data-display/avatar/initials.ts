/** Up to two letters standing for a name: the first letters of the first two words (`Ada Lovelace` is `AL`), or the first character of a single word (`珂珂` is `珂`). Empty for an empty name. */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const letters = (words.length === 1 ? [words[0] ?? ""] : words.slice(0, 2)).map((word) => Array.from(word)[0] ?? "");
  return letters.join("").toUpperCase();
}
