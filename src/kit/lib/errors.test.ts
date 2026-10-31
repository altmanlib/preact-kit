import { afterEach, expect, test } from "bun:test";

import { defaultText } from "../texts.ts";
import { ApiError, errorCodeOf, errorMessage, setErrorTexts } from "./errors.ts";

afterEach(() => setErrorTexts({}));

test("errorCodeOf reads the error field of a body and falls back to unknown", () => {
  expect(errorCodeOf({ error: "not_found" })).toBe("not_found");
  expect(errorCodeOf({ error: 1 })).toBe("unknown");
  expect(errorCodeOf(null)).toBe("unknown");
  expect(errorCodeOf("x")).toBe("unknown");
});

test("errorMessage maps an ApiError code through the registered texts", () => {
  setErrorTexts({ not_found: "Not found", unknown: "Oops" });
  expect(errorMessage(new ApiError(404, "not_found"))).toBe("Not found");
  expect(errorMessage(new ApiError(500, "other"))).toBe("Oops");
  expect(errorMessage(new Error("boom"))).toBe("Oops");
});

test("errorMessage falls back to the kit sentence when nothing is registered", () => {
  expect(errorMessage(new Error("boom"))).toBe(defaultText.unknownError);
});
