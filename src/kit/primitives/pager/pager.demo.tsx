import { useSignal } from "@preact/signals";

import { defineDemo } from "../../demo.ts";
import { Pager } from "./index.tsx";

const LAST_PAGE = 4;

function PagerDemo() {
  const page = useSignal(0);
  return <Pager page={page.value} hasNext={page.value < LAST_PAGE} onPage={(next) => (page.value = next)} />;
}

export default defineDemo({
  name: "Pager",
  kind: "primitive",
  summary: "Previous / next for lists that do not know their total.",
  examples: [
    { title: "Five pages", note: "`hasNext` comes from asking for one row more than a page; with a single page nothing renders.", render: () => <PagerDemo /> },
  ],
});
