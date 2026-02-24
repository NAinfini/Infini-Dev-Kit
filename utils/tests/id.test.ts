import { describe, expect, it } from "vitest";

import { createRequestId, createSpanId, createTraceId } from "../id";

describe("id helpers", () => {
  it("creates unique request ids", () => {
    const a = createRequestId("req");
    const b = createRequestId("req");

    expect(a).toMatch(/^req_[a-z0-9]+$/);
    expect(b).toMatch(/^req_[a-z0-9]+$/);
    expect(a).not.toBe(b);
  });

  it("creates trace/span ids in hex formats", () => {
    const traceId = createTraceId();
    const spanId = createSpanId();

    expect(traceId).toMatch(/^[0-9a-f]{32}$/);
    expect(spanId).toMatch(/^[0-9a-f]{16}$/);
  });
});
