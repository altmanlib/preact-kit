import { kitText } from "../texts.ts";

/** A non-2xx answer from the API; `code` is the `error` field of its body. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string) {
    super(code);
    this.status = status;
    this.code = code;
  }
}

let errorTexts: Record<string, string> = {};

/** Register the sentence to show for each API error code (include `unknown` as the fallback); call once before rendering. */
export function setErrorTexts(texts: Record<string, string>): void {
  errorTexts = texts;
}

/** The sentence to show for any thrown value. */
export function errorMessage(error: unknown): string {
  const code = error instanceof ApiError ? error.code : "unknown";
  return errorTexts[code] ?? errorTexts.unknown ?? kitText.unknownError;
}

/** The `error` code of an error body, `unknown` when the body is not one. */
export function errorCodeOf(body: unknown): string {
  return body && typeof body === "object" && "error" in body && typeof body.error === "string" ? body.error : "unknown";
}
