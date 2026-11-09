import "../field/field.css";
import "./file-upload.css";

import * as zag from "@zag-js/file-upload";
import { normalizeProps, useMachine } from "@zag-js/preact";
import { File as FileIcon, UploadCloud, X } from "lucide-preact";
import { useId } from "preact/hooks";

import { formatBytes } from "../../lib/format.ts";
import { kitText } from "../../texts.ts";

const REJECT_TEXT: Record<string, () => string> = {
  FILE_INVALID_TYPE: () => kitText.fileInvalidType,
  FILE_TOO_LARGE: () => kitText.fileTooLarge,
  FILE_TOO_SMALL: () => kitText.fileTooSmall,
  TOO_MANY_FILES: () => kitText.tooManyFiles,
};

/**
 * A drop zone for choosing files by clicking it or dragging them onto it (Zag file-upload machine; the zone is also
 * reachable and operable by keyboard). The chosen files are the caller's: `files` goes in, `onFiles` brings the new list
 * out, and the component only picks and shows them, it does not upload. A file that breaks `accept`, `maxFileSize` or
 * `maxFiles` is refused with a message under the zone.
 */
export function FileUpload({
  label,
  prompt,
  hint,
  accept,
  maxFileSize,
  maxFiles = 1,
  files,
  onFiles,
  disabled = false,
}: {
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
  files: File[];
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}) {
  const service = useMachine(zag.machine, {
    id: useId(),
    accept,
    maxFileSize,
    maxFiles,
    disabled,
    translations: { dropzone: prompt },
    acceptedFiles: files,
    onFileChange: (details) => onFiles(details.acceptedFiles),
  });
  const api = zag.connect(service, normalizeProps);
  const rejected = api.rejectedFiles[0]?.errors[0];

  return (
    <div class="field" {...api.getRootProps()}>
      <label {...api.getLabelProps()}>{label}</label>
      <div class={rejected === undefined ? "dropzone" : "dropzone dropzone-bad"} {...api.getDropzoneProps()}>
        {/* Zag types the hidden input role more loosely than Preact accepts */}
        <input {...(api.getHiddenInputProps() as Record<string, unknown>)} />
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
      {rejected !== undefined ? <small class="field-bad">{(REJECT_TEXT[rejected] ?? (() => kitText.fileRejected))()}</small> : null}
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}
