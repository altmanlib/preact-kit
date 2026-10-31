/**
 * Who may import what, checked by architecture.test.ts.
 *
 * Every source file under src/ belongs to the zone with the longest path that covers it. A file may import files of its
 * own zone and the paths its zone lists in `uses`; relative imports only, packages are free. Zones marked `browser`
 * may not use node:* or bun*. Paths are relative to src/; a path covers itself and everything below it.
 *
 * Add a zone when its first directory appears (e.g. `kit/patterns`, `kit/lib`), not before.
 */
import { dirname, join } from "node:path";

export type Zone = {
  name: string;
  paths: string[];
  /** Why the zone is where it is: shown with every violation. */
  why: string;
  uses: string[];
  browser?: boolean;
};

export type Import = { from: string; specifier: string };

export const ZONES: Zone[] = [
  {
    name: "kit-core",
    paths: ["kit/demo.ts", "kit/texts.ts", "kit/texts.test.ts"],
    why: "the demo contract and the kit's fixed sentences; they know nothing else",
    uses: [],
    browser: true,
  },
  {
    name: "kit/lib",
    paths: ["kit/lib"],
    why: "hooks and request helpers with no markup of their own; they know only the kit's sentences",
    uses: ["kit/texts.ts"],
    browser: true,
  },
  {
    name: "kit/primitives",
    paths: ["kit/primitives"],
    why: "generic controls: no business words, texts or endpoints; they know the demo contract, the kit's sentences and lib",
    uses: ["kit/demo.ts", "kit/texts.ts", "kit/lib"],
    browser: true,
  },
  {
    name: "kit/patterns",
    paths: ["kit/patterns"],
    why: "page shapes built from primitives and lib; what is the page's own (texts, columns, fetching) comes in as props",
    uses: ["kit/demo.ts", "kit/texts.ts", "kit/lib", "kit/primitives"],
    browser: true,
  },
  {
    name: "gallery",
    paths: ["gallery"],
    why: "the showcase app; it reads the kit, and the kit never reads it",
    uses: ["kit"],
    browser: true,
  },
  {
    name: "architecture",
    paths: ["architecture.ts", "architecture.test.ts"],
    why: "the rule table and its check are tooling",
    uses: [],
  },
  {
    name: "server.ts",
    paths: ["server.ts"],
    why: "the dev server only serves the gallery entry",
    uses: ["gallery/index.html"],
  },
];

const covers = (path: string, file: string): boolean => file === path || file.startsWith(`${path}/`);

/** The zone with the longest path covering `file` (relative to src/). */
export function zoneOf(file: string): Zone | undefined {
  let best: { zone: Zone; length: number } | undefined;
  for (const zone of ZONES) {
    for (const path of zone.paths) {
      if (covers(path, file) && (!best || path.length > best.length)) best = { zone, length: path.length };
    }
  }
  return best?.zone;
}

/** Why an import breaks the rules, or undefined when it is allowed. */
export function violation({ from, specifier }: Import): string | undefined {
  const zone = zoneOf(from);
  if (!zone) return `${from} is in no zone`;
  if (zone.browser && !from.endsWith(".test.ts") && /^(node:|bun(:|$))/.test(specifier))
    return `${from} runs in the browser and may not import ${specifier} (${zone.name}: ${zone.why})`;
  if (!specifier.startsWith(".")) return undefined;
  const target = join(dirname(from), specifier);
  const targetZone = zoneOf(target);
  if (targetZone === zone) return undefined;
  if (zone.uses.some((path) => covers(path, target))) return undefined;
  return `${from} may not import ${target} (${zone.name}: ${zone.why})`;
}
