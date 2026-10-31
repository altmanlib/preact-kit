import { afterEach, expect, test } from "bun:test";

import { ApiError } from "./errors.ts";
import { query, request } from "./http.ts";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

function stubFetch(status: number, body: string): void {
  globalThis.fetch = (async () => new Response(body, { status })) as unknown as typeof fetch;
}

test("query keeps only the parameters that are set", () => {
  expect(query({ a: 1, b: undefined, c: "x y" })).toBe("?a=1&c=x+y");
  expect(query({ a: undefined })).toBe("");
});

test("request returns the parsed body of a 2xx answer", async () => {
  stubFetch(200, '{"ok":true}');
  expect(await request("GET", "/x")).toEqual({ ok: true });
});

test("request throws ApiError with the code of a non-2xx body", async () => {
  stubFetch(404, '{"error":"not_found"}');
  const error = await request("GET", "/x").catch((caught) => caught);
  expect(error).toBeInstanceOf(ApiError);
  expect(error).toMatchObject({ status: 404, code: "not_found" });
});

test("request tolerates an empty or non-JSON error body", async () => {
  stubFetch(500, "<html>");
  expect(await request("GET", "/x").catch((caught) => caught)).toMatchObject({ status: 500, code: "unknown" });
});
