import { ApiError, errorCodeOf } from "./errors.ts";

/** One JSON call to the API; a non-2xx answer throws `ApiError`. */
export async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method,
    headers: body === undefined ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "same-origin",
  });
  const raw = await response.text();
  let json: unknown;
  try {
    json = raw === "" ? undefined : JSON.parse(raw);
  } catch {
    json = undefined;
  }
  if (!response.ok) throw new ApiError(response.status, errorCodeOf(json));
  return json as T;
}

/** A query string from the parameters that are set, with the leading `?`; empty when none is. */
export function query(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value !== undefined) search.set(key, String(value));
  const text = search.toString();
  return text === "" ? "" : `?${text}`;
}
