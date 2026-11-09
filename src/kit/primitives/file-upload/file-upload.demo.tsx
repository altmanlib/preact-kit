import { useSignal } from "@preact/signals";

import { defineDemo } from "../../demo.ts";
import { FileUpload } from "./index.tsx";

function FileUploadDemo() {
  const archive = useSignal<File[]>([]);
  const images = useSignal<File[]>([]);
  return (
    <div class="demo-stack">
      <FileUpload
        label="Package"
        prompt="Drop a .zip here or click to choose"
        hint="One file, up to 5 MB. Choosing another replaces it."
        accept={{ "application/zip": [".zip"] }}
        maxFileSize={5 * 1024 * 1024}
        field={archive}
      />
      <FileUpload
        label="Images"
        prompt="Drop images here or click to choose"
        hint="Up to four."
        accept={{ "image/*": [".png", ".jpg", ".webp"] }}
        maxFiles={4}
        field={images}
      />
      <FileUpload label="Locked" prompt="Uploads are closed" value={[]} onChange={() => undefined} disabled />
    </div>
  );
}

export default defineDemo({
  name: "FileUpload",
  kind: "primitive",
  summary: "A drop zone for choosing files by click or drag; the caller owns the files and does the uploading.",
  examples: [
    {
      title: "Single and several",
      note: "A file that breaks the type, size or count limit is refused with a message under the zone.",
      render: () => <FileUploadDemo />,
    },
  ],
});
