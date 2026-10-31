import { expect, test } from "bun:test";

import { releaseChangelog } from "./changelog.ts";

const BEFORE = ["# Changelog", "", "## Unreleased", "", "- add Toast", "- fix Modal focus", "", "## 0.1.0 - 2026-10-31", "", "- first release", ""].join("\n");

test("releaseChangelog moves the entries under a dated heading and keeps an empty Unreleased", () => {
  const { text, notes } = releaseChangelog(BEFORE, "0.2.0", "2026-11-01");
  expect(notes).toBe("- add Toast\n- fix Modal focus");
  expect(text).toBe(
    [
      "# Changelog",
      "",
      "## Unreleased",
      "",
      "## 0.2.0 - 2026-11-01",
      "",
      "- add Toast",
      "- fix Modal focus",
      "",
      "## 0.1.0 - 2026-10-31",
      "",
      "- first release",
      "",
    ].join("\n"),
  );
});

test("releaseChangelog works when Unreleased is the last section", () => {
  const { text } = releaseChangelog("# Changelog\n\n## Unreleased\n\n- a\n", "0.2.0", "2026-11-01");
  expect(text).toContain("## 0.2.0 - 2026-11-01\n\n- a");
});

test("releaseChangelog refuses an empty or missing Unreleased section", () => {
  expect(() => releaseChangelog("# Changelog\n\n## Unreleased\n\n## 0.1.0 - 2026-10-31\n\n- x\n", "0.2.0", "2026-11-01")).toThrow("nothing under");
  expect(() => releaseChangelog("# Changelog\n\n## 0.1.0 - 2026-10-31\n", "0.2.0", "2026-11-01")).toThrow('no "## Unreleased"');
});
