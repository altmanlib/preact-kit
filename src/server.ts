/** Dev server for the gallery: Bun bundles the HTML entry and its scripts and styles on demand. */
import gallery from "./gallery/index.html";

const server = Bun.serve({
  port: Number(process.env.PORT ?? 5600),
  routes: { "/": gallery },
  development: true,
});

console.log(`gallery: ${server.url}`);
