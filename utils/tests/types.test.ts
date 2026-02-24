import { describe, expect, it } from "vitest";

import {
  err,
  isErr,
  isOk,
  mapResult,
  none,
  ok,
  some,
  unwrapOr,
} from "../types";

describe("result helpers", () => {
  it("creates ok and err results", () => {
    const success = ok(42);
    const failure = err("boom");

    expect(isOk(success)).toBe(true);
    expect(isErr(success)).toBe(false);
    expect(isErr(failure)).toBe(true);
    expect(isOk(failure)).toBe(false);
  });

  it("maps ok values and keeps errors", () => {
    const success = mapResult(ok(2), (value) => value * 3);
    const failure = mapResult(err("x"), (value) => value * 3);

    expect(success).toEqual(ok(6));
    expect(failure).toEqual(err("x"));
  });

  it("unwraps with fallback", () => {
    expect(unwrapOr(ok("a"), "b")).toBe("a");
    expect(unwrapOr(err("x"), "b")).toBe("b");
  });
});

describe("option helpers", () => {
  it("creates some and none options", () => {
    expect(some(123)).toEqual({ kind: "some", value: 123 });
    expect(none()).toEqual({ kind: "none" });
  });
});
