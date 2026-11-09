import "../field/field.css";
import "./file-upload.css";

import * as zag from "@zag-js/file-upload";
import { normalizeProps, useMachine } from "@zag-js/preact";
import { File as FileIcon, UploadCloud, X } from "lucide-preact";
import { useId } from "preact/hooks";

import { formatBytes } from "../../lib/format.ts";
import { type Bound, bound } from "../../lib/signals.ts";
import { inputProps } from "../../lib/zag.ts";
import { kitText } from "../../texts.ts";
import { FieldNotes } from "../field/index.tsx";

const REJECT_TEXT: Record<string, () => string> = {
  FILE_INVALID_TYPE: () => kitText.fileInvalidType,
  FILE_TOO_LARGE: () => kitText.fileTooLarge,
  FILE_TOO_SMALL: () => kitText.fileTooSmall,
  TOO_MANY_FILES: () => kitText.tooManyFiles,
};

type FileUploadOwn = {
  label: string;
  /** The line inside the empty zone, e.g. "Drop a file here or click to choose". */
  prompt: string;
  hint?: string;
  /** Allowed types as MIME type to extensions, e.g. `{ "application/zip": [".zip"] }`; any file when omitted. */
  accept?: Record<string, string[]>;
  /** The largest size of one file, in bytes. */
  maxFileSize?: number;
  /** How many files at most; 1 (the default) makes the zone replace its file instead of adding to a list. */
  maxFiles?: number;
  disabled?: boolean;
};

/** The props of `FileUpload`: the own props, then either a `field` signal or `value` with `onChange` (never both); the value is the list of chosen files. */
export type FileUploadProps = FileUploadOwn & Bound<File[]>;

/**
 * A drop zone for choosing files by clicking it or dragging them onto it (Zag file-upload machine; the zone is also
 * reachable and operable by keyboard). The chosen files are the caller's: the value goes in and the new list comes out
 * through `onChange`, and the component only picks and shows them, it does not upload. A file that breaks `accept`,
 * `maxFileSize` or `maxFiles` is refused with a message under the zone.
 */
export function FileUpload(props: FileUploadProps) {
  const { value: files, set, rest } = bound<File[], FileUploadOwn>(props);
  const { label, prompt, hint, accept, maxFileSize, maxFiles = 1, disabled = false } = rest;
  const service = useMachine(zag.machine, {
    id: useId(),
    accept,
    maxFileSize,
    maxFiles,
    disabled,
    translations: { dropzone: prompt },
    acceptedFiles: files,
    onFileChange: (details) => set(details.acceptedFiles),
  });
  const api = zag.connect(service, normalizeProps);
  const rejected = api.rejectedFiles[0]?.errors[0];

  return (
    <div class="field" {...api.getRootProps()}>
      <label {...api.getLabelProps()}>{label}</label>
      <div class={rejected === undefined ? "dropzone" : "dropzone dropzone-bad"} {...api.getDropzoneProps()}>
        {/* Zag types the hidden input role more loosely than Preact accepts */}
        <input {...inputProps(api.getHiddenInputProps())} />
        <UploadCloud size={20} aria-hidden="true" />
        <span class="dropzone-text">{prompt}</span>
      </div>
      {files.length > 0 ? (
        <ul class="dropzone-files" {...api.getItemGroupProps()}>
          {files.map((file) => (
            <li key={`${file.name}-${file.size}-${file.lastModified}`} class="dropzone-file" {...api.getItemProps({ file })}>
              <FileIcon size={16} aria-hidden="true" />
              <span class="dropzone-file-name" {...api.getItemNameProps({ file })}>
                {file.name}
              </span>
              <span class="dropzone-file-size muted" {...api.getItemSizeTextProps({ file })}>
                {formatBytes(file.size)}
              </span>
              <button type="button" class="dropzone-remove" aria-label={`${kitText.remove} ${file.name}`} {...api.getItemDeleteTriggerProps({ file })}>
                <X size={14} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <FieldNotes hint={hint} error={rejected === undefined ? undefined : (REJECT_TEXT[rejected] ?? (() => kitText.fileRejected))()} />
    </div>
  );
}
