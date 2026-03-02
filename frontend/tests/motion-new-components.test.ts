import { describe, expect, it } from "vitest";

import {
  GlowBorder,
  LoadingSkeleton,
  PageTransition,
  ShimmerButton,
  TiltCard,
} from "../components";

describe("new motion components", () => {
  it("exports reusable motion primitives", () => {
    expect(typeof TiltCard).toBe("function");
    expect(typeof ShimmerButton).toBe("function");
    expect(typeof PageTransition).toBe("function");
    expect(typeof LoadingSkeleton).toBe("function");
    expect(typeof GlowBorder).toBe("function");
  });
});
