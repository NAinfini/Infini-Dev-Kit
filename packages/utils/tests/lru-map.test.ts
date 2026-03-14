import { describe, expect, it } from "vitest";

import { LRUMap } from "../lru-map";

describe("LRUMap", () => {
  it("evicts least recently used entries when max size is exceeded", () => {
    const cache = new LRUMap<string, number>(2);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3);

    expect(cache.has("a")).toBe(false);
    expect(cache.has("b")).toBe(true);
    expect(cache.has("c")).toBe(true);
  });

  it("updates recency on get", () => {
    const cache = new LRUMap<string, number>(2);
    cache.set("a", 1);
    cache.set("b", 2);

    expect(cache.get("a")).toBe(1);

    cache.set("c", 3);

    expect(cache.has("a")).toBe(true);
    expect(cache.has("b")).toBe(false);
    expect(cache.has("c")).toBe(true);
  });
});
