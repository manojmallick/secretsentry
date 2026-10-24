import * as assert from "node:assert";
import { scanText } from "../logic/index.js";

suite("SecretSentry logic", () => {
  test("detects AWS key", () => {
    const f = scanText("key = AKIAIOSFODNN7EXAMPLE");
    assert.ok(f.some((x) => x.name.includes("AWS")));
  });
});
