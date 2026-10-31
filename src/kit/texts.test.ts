import { afterEach, expect, test } from "bun:test";

import { defaultText, kitText, setKitText } from "./texts.ts";

afterEach(() => setKitText(defaultText));

test("setKitText replaces only the given sentences", () => {
  setKitText({ cancel: "取消" });
  expect(kitText.cancel).toBe("取消");
  expect(kitText.confirm).toBe(defaultText.confirm);
});
