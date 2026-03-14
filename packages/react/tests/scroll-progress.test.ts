import { describe, expect, it, vi } from "vitest";

import {
  clampProgressScale,
  ensureNonStaticScrollContainerPosition,
} from "../components/data-display/ScrollProgress";

describe("scroll progress clamp", () => {
  it("clamps values below 0 to 0", () => {
    expect(clampProgressScale(-0.2)).toBe(0);
  });

  it("clamps values above 1 to 1", () => {
    expect(clampProgressScale(1.08)).toBe(1);
  });

  it("keeps values inside range unchanged", () => {
    expect(clampProgressScale(0.64)).toBe(0.64);
  });
});

describe("scroll progress container positioning", () => {
  it("promotes static containers to relative positioning and restores empty inline style", () => {
    const node = {
      style: {
        position: "",
        removeProperty: vi.fn((property: string) => {
          if (property === "position") {
            node.style.position = "";
          }
        }),
      },
    };

    const cleanup = ensureNonStaticScrollContainerPosition(node, () => "static");

    expect(node.style.position).toBe("relative");

    cleanup?.();

    expect(node.style.removeProperty).toHaveBeenCalledWith("position");
    expect(node.style.position).toBe("");
  });

  it("restores the previous inline position when it already existed", () => {
    const node = {
      style: {
        position: "sticky",
        removeProperty: vi.fn(),
      },
    };

    const cleanup = ensureNonStaticScrollContainerPosition(node, () => "static");

    expect(node.style.position).toBe("relative");

    cleanup?.();

    expect(node.style.position).toBe("sticky");
    expect(node.style.removeProperty).not.toHaveBeenCalled();
  });

  it("leaves already positioned containers unchanged", () => {
    const node = {
      style: {
        position: "",
        removeProperty: vi.fn(),
      },
    };

    const cleanup = ensureNonStaticScrollContainerPosition(node, () => "relative");

    expect(cleanup).toBeUndefined();
    expect(node.style.position).toBe("");
    expect(node.style.removeProperty).not.toHaveBeenCalled();
  });
});
