// Checks the Markdown under docs/: front matter, `title` against the `# ` heading, and repo-relative links.
// Run `bun scripts/check-docs.ts` (or `bun run docs:check`); exits 1 and lists every problem when any is found.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

const TYPES = new Set(["guide", "runbook", "reference", "design", "record"]);
const STATUSES = new Set(["draft", "published", "deprecated"]);
const REQUIRED = ["title", "type", "status", "updated"] as const;

export type DocProblem = { file: string; line: number; message: string };

function markdownFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.name.endsWith(".md") ? [path] : [];
  });
}

/** The front matter's `key: value` pairs and the line the body starts on (1-based), or undefined when there is no front matter. */
function parseFrontMatter(lines: string[]): { fields: Map<string, string>; bodyStart: number } | undefined {
  if (lines[0] !== "---") return undefined;
  const end = lines.indexOf("---", 1);
  if (end === -1) return undefined;
  const fields = new Map<string, string>();
  for (const line of lines.slice(1, end)) {
    const match = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (match?.[1] !== undefined) fields.set(match[1], (match[2] ?? "").trim().replace(/^(["'])(.*)\1$/, "$2"));
  }
  return { fields, bodyStart: end + 2 };
}

function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

/** The body lines outside fenced code, with inline code removed; fenced lines come back empty so line numbers stay put. */
function proseLines(lines: string[], from: number): { line: number; text: string }[] {
  const out: { line: number; text: string }[] = [];
  let fence: string | undefined;
  for (let index = from - 1; index < lines.length; index += 1) {
    const raw = lines[index] ?? "";
    const marker = /^\s*(`{3,}|~{3,})/.exec(raw)?.[1];
    if (fence !== undefined) {
      if (marker !== undefined && marker[0] === fence[0] && marker.length >= fence.length) fence = undefined;
      continue;
    }
    if (marker !== undefined) {
      fence = marker;
      continue;
    }
    out.push({ line: index + 1, text: raw.replace(/(`+)[^`]*?\1/g, "") });
  }
  return out;
}

const LINK = /\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
const EXTERNAL = /^([a-z][a-z0-9+.-]*:|\/\/)/i;

/** Every problem in the Markdown files under `<root>/docs`. */
export function checkDocs(root: string): DocProblem[] {
  const problems: DocProblem[] = [];
  const docsDir = join(root, "docs");
  if (!existsSync(docsDir)) return problems;
  for (const path of markdownFiles(docsDir).sort()) {
    const file = relative(root, path).split(sep).join("/");
    const report = (line: number, message: string) => problems.push({ file, line, message });
    const lines = readFileSync(path, "utf8").split(/\r?\n/);

    const front = parseFrontMatter(lines);
    if (!front) {
      report(1, "front matter is missing or not closed");
      continue;
    }
    for (const key of REQUIRED) {
      if (!front.fields.get(key)) report(1, `front matter lacks \`${key}\``);
    }
    const type = front.fields.get("type");
    if (type && !TYPES.has(type)) report(1, `\`type\` must be one of ${[...TYPES].join(" / ")}, got \`${type}\``);
    const status = front.fields.get("status");
    if (status && !STATUSES.has(status)) report(1, `\`status\` must be one of ${[...STATUSES].join(" / ")}, got \`${status}\``);
    const updated = front.fields.get("updated");
    if (updated && !isRealDate(updated)) report(1, `\`updated\` must be a date as YYYY-MM-DD, got \`${updated}\``);

    const prose = proseLines(lines, front.bodyStart);
    const heading = prose.find((entry) => /^# /.test(entry.text));
    const title = front.fields.get("title");
    if (!heading) report(front.bodyStart, "no `# ` heading in the body");
    else if (title && heading.text.slice(2).trim() !== title)
      report(heading.line, `heading \`${heading.text.slice(2).trim()}\` differs from title \`${title}\``);

    for (const { line, text } of prose) {
      for (const match of text.matchAll(LINK)) {
        const target = match[1] ?? "";
        if (target.startsWith("#") || target.startsWith("<") || EXTERNAL.test(target)) continue;
        const [pathPart = ""] = target.split(/[#?]/);
        if (pathPart === "") continue;
        let decoded = pathPart;
        try {
          decoded = decodeURIComponent(pathPart);
        } catch {
          report(line, `link \`${target}\` is not valid percent-encoding`);
          continue;
        }
        const resolved = decoded.startsWith("/") ? resolve(root, `.${decoded}`) : resolve(dirname(path), decoded);
        const inside = relative(root, resolved);
        if (inside.startsWith("..") || inside === "") report(line, `link \`${target}\` leaves the repository`);
        else if (!existsSync(resolved)) report(line, `link \`${target}\` points at nothing`);
      }
    }
  }
  return problems;
}

if (import.meta.main) {
  const root = resolve(import.meta.dir, "..");
  const problems = checkDocs(root);
  for (const problem of problems) console.error(`${problem.file}:${problem.line}: ${problem.message}`);
  if (problems.length > 0) {
    console.error(`docs:check found ${problems.length} problem(s)`);
    process.exit(1);
  }
  console.log("docs:check ok");
}
