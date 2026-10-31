import { defineDemo } from "../../demo.ts";
import { Avatar } from "./index.tsx";

// A tiny inline picture so the demo needs no network; its fills are picture content, not UI colour.
const PICTURE = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#5b3df5"/><circle cx="20" cy="16" r="7" fill="#fff"/><rect x="8" y="26" width="24" height="14" rx="7" fill="#fff"/></svg>')}`;

export default defineDemo({
  name: "Avatar",
  kind: "primitive",
  summary: "A round picture, with initials when there is none.",
  examples: [
    {
      title: "Initials and sizes",
      render: () => (
        <>
          <Avatar name="Ada Lovelace" size="sm" />
          <Avatar name="Grace Hopper" />
          <Avatar name="Alan" size="lg" />
          <Avatar name="珂珂" />
        </>
      ),
    },
    {
      title: "Picture, and a picture that fails",
      note: "A failed load falls back to the initials.",
      render: () => (
        <>
          <Avatar name="Ada Lovelace" src={PICTURE} />
          <Avatar name="Edsger Dijkstra" src="http://localhost:1/missing.png" />
        </>
      ),
    },
  ],
});
