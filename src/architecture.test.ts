import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

import { Glob } from "bun";
import ts from "typescript";

import { type Import, violation, zoneOf, ZONES } from "./architecture.ts";

const SRC = new URL("./", import.meta.url).pathname;

const files = [...new Glob("**/*.{ts,tsx}").scanSync(SRC)].filter((file) => !file.endsWith(".d.ts") && !file.endsWith(".gen.ts")).sort();

/** Every import and re-export of a file as written, dynamic imports included. */
function importsOf(file: string): Import[] {
  const source = ts.createSourceFile(
    file,
    readFileSync(`${SRC}${file}`, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const found: Import[] = [];
  const visit = (node: ts.Node): void => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      found.push({ from: file, specifier: node.moduleSpecifier.text });
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments[0] &&
      ts.isStringLiteralLike(node.arguments[0])
    ) {
      found.push({ from: file, specifier: node.arguments[0].text });
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return found;
}

test("every source file belongs to a zone, and every zone path exists", () => {
  expect(files.filter((file) => !zoneOf(file))).toEqual([]);
  expect(ZONES.flatMap((zone) => zone.paths).filter((path) => !existsSync(`${SRC}${path}`))).toEqual([]);
  expect(ZONES.flatMap((zone) => zone.uses).filter((path) => !existsSync(`${SRC}${path}`))).toEqual([]);
});

test("no import crosses the layers", () => {
  const found = files.flatMap((file) =>
    importsOf(file)
      .map((imported) => violation(imported))
      .filter((why) => why !== undefined),
  );
  expect(found).toEqual([]);
});

test("the rules reject what they should", () => {
  expect(violation({ from: "kit/primitives/actions/button/index.tsx", specifier: "../../../../gallery/app.tsx" })).toBeDefined();
  expect(violation({ from: "kit/primitives/actions/button/index.tsx", specifier: "node:fs" })).toBeDefined();
  expect(violation({ from: "kit/primitives/actions/button/button.demo.tsx", specifier: "../../../demo.ts" })).toBeUndefined();
  expect(violation({ from: "gallery/app.tsx", specifier: "../kit/primitives/actions/button/index.tsx" })).toBeUndefined();
  expect(violation({ from: "kit/demo.ts", specifier: "./primitives/button/index.tsx" })).toBeDefined();
});
