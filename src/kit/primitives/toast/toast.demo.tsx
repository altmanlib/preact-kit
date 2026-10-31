import { defineDemo } from "../../demo.ts";
import { clearToasts, showToast } from "../../lib/toasts.ts";
import { Button } from "../button/index.tsx";
import { Toaster } from "./index.tsx";

export default defineDemo({
  name: "Toast",
  kind: "primitive",
  summary: "A short message that leaves by itself: call showToast from anywhere, mount Toaster once.",
  examples: [
    {
      title: "Tones",
      note: "Hover or focus a toast to pause it. A failure is announced as an alert, the rest politely. Up to five at once.",
      render: () => (
        <>
          <Toaster />
          <Button onClick={() => showToast({ message: "Link copied to the clipboard." })}>Info</Button>
          <Button onClick={() => showToast({ message: "Settings saved.", tone: "ok" })}>Success</Button>
          <Button onClick={() => showToast({ message: "Your session expires in five minutes.", tone: "warn" })}>Warning</Button>
          <Button onClick={() => showToast({ message: "The request failed. Try again.", tone: "bad" })}>Failure</Button>
        </>
      ),
    },
    {
      title: "Stays until dismissed",
      note: "`duration: 0` keeps it; use it for something the user must read.",
      render: () => (
        <>
          <Button onClick={() => showToast({ message: "Import finished with 3 skipped rows.", tone: "warn", duration: 0 })}>Show sticky</Button>
          <Button variant="quiet" onClick={clearToasts}>
            Clear all
          </Button>
        </>
      ),
    },
  ],
});
