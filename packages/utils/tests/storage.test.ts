import { describe, expect, it } from "vitest";

import {
  createBrowserLocalStorageAdapter,
  createCookieStorageAdapter,
  createMemoryStorageAdapter,
} from "../storage";

describe("createMemoryStorageAdapter", () => {
  it("stores and retrieves values", () => {
    const adapter = createMemoryStorageAdapter();

    adapter.setItem("theme", "cyberpunk");

    expect(adapter.getItem("theme")).toBe("cyberpunk");
  });

  it("removes values", () => {
    const adapter = createMemoryStorageAdapter({ theme: "default" });

    adapter.removeItem("theme");

    expect(adapter.getItem("theme")).toBeNull();
  });
});

describe("createBrowserLocalStorageAdapter", () => {
  it("uses injected storage", () => {
    const store = new Map<string, string>();
    const adapter = createBrowserLocalStorageAdapter({
      getItem: (key) => (store.has(key) ? store.get(key)! : null),
      setItem: (key, value) => {
        store.set(key, value);
      },
      removeItem: (key) => {
        store.delete(key);
      },
    });

    adapter.setItem("theme", "aurum");

    expect(adapter.getItem("theme")).toBe("aurum");
    adapter.removeItem("theme");
    expect(adapter.getItem("theme")).toBeNull();
  });

  it("falls back to memory in non-browser contexts", () => {
    const adapter = createBrowserLocalStorageAdapter(undefined);

    adapter.setItem("theme", "imperium");

    expect(adapter.getItem("theme")).toBe("imperium");
  });
});

describe("createCookieStorageAdapter", () => {
  it("reads and writes cookies with injected adapters", () => {
    let cookieJar = "";

    const adapter = createCookieStorageAdapter({
      getCookieString: () => cookieJar,
      setCookieString: (value) => {
        cookieJar = value;
      },
    });

    adapter.setItem("theme", "chibi mode");
    expect(cookieJar).toContain("theme=chibi%20mode");
    expect(adapter.getItem("theme")).toBe("chibi mode");

    adapter.removeItem("theme");
    expect(adapter.getItem("theme")).toBeNull();
  });

  it("falls back to memory when no cookie APIs exist", () => {
    const adapter = createCookieStorageAdapter();

    adapter.setItem("theme", "default");

    expect(adapter.getItem("theme")).toBe("default");
  });
});
