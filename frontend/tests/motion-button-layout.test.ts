import { describe, expect, it } from "vitest";

import { resolveMotionButtonWrapperStyle } from "../components/buttons/MotionButton";

describe("motion button wrapper layout", () => {
  it("keeps non-block buttons content-sized in flex containers", () => {
    const style = resolveMotionButtonWrapperStyle({ block: false });

    expect(style.display).toBe("inline-flex");
    expect(style.alignSelf).toBe("flex-start");
    expect(style.width).toBeUndefined();
  });

  it("keeps block buttons stretched to container width", () => {
    const style = resolveMotionButtonWrapperStyle({ block: true });

    expect(style.display).toBe("flex");
    expect(style.alignSelf).toBe("stretch");
    expect(style.width).toBe("100%");
  });
});
