import { describe, expect, it } from "vitest";

import { getSpringProfile } from "../theme/spring-profiles";

describe("spring profiles", () => {
  it("maps each theme to its intended motion feel", () => {
    expect(getSpringProfile("default")).toMatchObject({
      stiffness: 300,
      damping: 24,
      mass: 0.8,
      bounce: 0.15,
    });

    expect(getSpringProfile("chibi")).toMatchObject({
      stiffness: 260,
      damping: 22,
      mass: 0.6,
      bounce: 0.18,
    });

    expect(getSpringProfile("cyberpunk")).toMatchObject({
      stiffness: 500,
      damping: 30,
      mass: 1,
      bounce: 0,
    });
  });

  it("keeps luxury themes smooth and low-bounce", () => {
    const blackGold = getSpringProfile("black-gold");
    const redGold = getSpringProfile("red-gold");

    expect(blackGold.bounce).toBe(0.05);
    expect(redGold.bounce).toBe(0.05);
    expect(blackGold.stiffness).toBe(redGold.stiffness);
    expect(blackGold.damping).toBe(redGold.damping);
  });
});
