import { defineDemo } from "../../../demo.ts";
import { Tile, Tiles } from "./index.tsx";

export default defineDemo({
  name: "Tile",
  kind: "primitive",
  summary: "One figure on a row: label, large value, hint.",
  examples: [
    {
      title: "Lead layout",
      note: "The first tile is the main figure; peers use other variants so the row has hierarchy.",
      render: () => (
        <div class="demo-stack">
          <Tiles>
            <Tile variant="accent" label="Revenue today" unit="¥" value="12,480.50" hint="+8% vs yesterday" />
            <Tile label="Orders" value="86" hint="3 waiting" />
            <Tile variant="ok" label="Success rate" value="98.2" suffix="%" />
          </Tiles>
        </div>
      ),
    },
    {
      title: "Quad, with link and alert",
      note: "`href` makes a tile a link; `alert` marks one that wants attention.",
      render: () => (
        <div class="demo-stack">
          <Tiles layout="quad">
            <Tile label="Paid" value="412" />
            <Tile label="Pending" value="7" href="#/tile" alert hint="Open the list" />
            <Tile variant="warn" label="Expiring" value="2" />
            <Tile variant="bad" label="Failed" value="1" />
          </Tiles>
        </div>
      ),
    },
  ],
});
