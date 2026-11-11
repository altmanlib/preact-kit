#!/usr/bin/env bun
import { rm } from "node:fs/promises";
import { relative } from "node:path";

/** Static gallery for GitHub project pages (`/preact-kit/`). */
const outdir = "dist";
const publicPath = "/preact-kit/";

await rm(outdir, { recursive: true, force: true });

const result = await Bun.build({
  entrypoints: ["src/gallery/index.html"],
  outdir,
  minify: true,
  publicPath,
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});

if (!result.success) {
  for (const message of result.logs) console.error(message);
  process.exit(1);
}

const files = result.outputs.map((output) => {
  const sizeKb = (output.size / 1024).toFixed(output.size >= 1024 * 100 ? 0 : 1);
  return `  ${relative(process.cwd(), output.path)}  ${sizeKb} KB`;
});
console.log(`Built ${result.outputs.length} files → ${outdir}/ (${publicPath})\n${files.join("\n")}`);
