// Release helper for CHANGELOG.md: the notes of the next version live under `## Unreleased`.
//   bun scripts/changelog.ts check                       exits 1 when `## Unreleased` has no entries
//   bun scripts/changelog.ts release <version> <file>    turns `## Unreleased` into `## <version> - <date>`, keeps an empty
//                                                        `## Unreleased` above it and writes the release notes to <file>
import { readFileSync, writeFileSync } from "node:fs";

const HEADING = "## Unreleased";

/** The Unreleased entries, and the changelog with them moved under a dated version heading. Throws when there are no entries. */
export function releaseChangelog(text: string, version: string, date: string): { text: string; notes: string } {
  const lines = text.split("\n");
  const start = lines.indexOf(HEADING);
  if (start === -1) throw new Error(`CHANGELOG.md has no "${HEADING}" section`);
  const next = lines.findIndex((line, index) => index > start && line.startsWith("## "));
  const end = next === -1 ? lines.length : next;
  const notes = lines
    .slice(start + 1, end)
    .join("\n")
    .trim();
  if (notes === "") throw new Error(`CHANGELOG.md has nothing under "${HEADING}"`);
  const released = [...lines.slice(0, start), HEADING, "", `## ${version} - ${date}`, "", ...notes.split("\n"), "", ...lines.slice(end)];
  return { text: released.join("\n"), notes };
}

if (import.meta.main) {
  const path = new URL("../CHANGELOG.md", import.meta.url).pathname;
  const [command, version, notesFile] = process.argv.slice(2);
  try {
    if (command === "check") {
      releaseChangelog(readFileSync(path, "utf8"), "0.0.0", "1970-01-01");
    } else if (command === "release" && version && notesFile) {
      const { text, notes } = releaseChangelog(readFileSync(path, "utf8"), version, new Date().toISOString().slice(0, 10));
      writeFileSync(path, text);
      writeFileSync(notesFile, `${notes}\n`);
    } else {
      console.error("usage: changelog.ts check | release <version> <notes-file>");
      process.exit(2);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
