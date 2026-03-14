import type { Variants } from "motion/react";

import type { ThemeId } from "@infini-dev-kit/theme-core";

const INPUT_VARIANTS: Record<ThemeId, Variants> = {
  default: {
    idle: { scale: 1, opacity: 1, filter: "none", x: 0, y: 0, rotate: 0 },
    focus: { opacity: [0.92, 1], boxShadow: "var(--infini-glow-primary, none)" },
    error: { x: [0, -4, 4, -3, 3, 0], boxShadow: "var(--infini-glow-error, none)" },
    success: { scale: [1, 1.01, 1], boxShadow: "var(--infini-glow-success, none)" },
    warning: { rotate: [0, -0.5, 0.5, 0], boxShadow: "var(--infini-glow-warning, none)" },
  },
  chibi: {
    idle: { scale: 1, opacity: 1, filter: "none", x: 0, y: 0, rotate: 0 },
    focus: { scale: [1, 1.01, 1], boxShadow: "var(--infini-glow-primary, none)" },
    error: { x: [0, -3, 3, -2, 2, 0], boxShadow: "var(--infini-glow-error, none)" },
    success: { scale: [1, 1.015, 1], boxShadow: "var(--infini-glow-success, none)" },
    warning: { rotate: [0, -0.7, 0.7, 0], boxShadow: "var(--infini-glow-warning, none)" },
  },
  cyberpunk: {
    idle: { scale: 1, opacity: 1, filter: "none", x: 0, y: 0, rotate: 0 },
    focus: {
      opacity: [0.9, 1, 0.95, 1],
      filter: ["none", "brightness(1.15)", "none"],
      boxShadow: "var(--infini-glow-primary, none)",
    },
    error: {
      opacity: [1, 0.6, 1, 0.7, 1, 0.85, 1],
      x: [0, -3, 2, -1, 0],
      filter: ["none", "hue-rotate(60deg)", "none", "hue-rotate(-30deg)", "none"],
      boxShadow: "var(--infini-glow-error, none)",
    },
    success: {
      opacity: [0.85, 1],
      scale: [1, 1.01, 1],
      filter: ["none", "saturate(1.2)", "none"],
      boxShadow: "var(--infini-glow-success, none)",
    },
    warning: {
      opacity: [1, 0.75, 1, 0.88, 1],
      filter: ["none", "hue-rotate(20deg)", "none"],
      boxShadow: "var(--infini-glow-warning, none)",
    },
  },
  "neu-brutalism": {
    idle: { x: 0, y: 0, opacity: 1, scale: 1, rotate: 0, filter: "none" },
    focus: { scale: [1, 1.01, 1], boxShadow: "var(--infini-glow-primary, none)" },
    error: { x: [0, -4, 4, -3, 3, 0], boxShadow: "var(--infini-glow-error, none)" },
    success: { y: [0, -2, 0], boxShadow: "var(--infini-glow-success, none)" },
    warning: { x: [0, -2, 2, 0], boxShadow: "var(--infini-glow-warning, none)" },
  },
  "black-gold": {
    idle: { scale: 1, opacity: 1, filter: "none", x: 0, y: 0, rotate: 0 },
    focus: {
      opacity: [0.92, 1],
      scale: [1, 1.01, 1],
      filter: ["none", "brightness(1.08)", "none"],
      boxShadow: "var(--infini-glow-primary, none)",
    },
    error: { x: [0, -2, 2, -1, 1, 0], boxShadow: "var(--infini-glow-error, none)" },
    success: { scale: [1, 1.01, 1], boxShadow: "var(--infini-glow-success, none)" },
    warning: { rotate: [0, -0.3, 0.3, 0], boxShadow: "var(--infini-glow-warning, none)" },
  },
  "red-gold": {
    idle: { scale: 1, opacity: 1, filter: "none", x: 0, y: 0, rotate: 0 },
    focus: {
      opacity: [0.92, 1],
      scale: [1, 1.01, 1],
      filter: ["none", "brightness(1.08)", "none"],
      boxShadow: "var(--infini-glow-primary, none)",
    },
    error: { x: [0, -2, 2, -1, 1, 0], boxShadow: "var(--infini-glow-error, none)" },
    success: { scale: [1, 1.01, 1], boxShadow: "var(--infini-glow-success, none)" },
    warning: { rotate: [0, -0.3, 0.3, 0], boxShadow: "var(--infini-glow-warning, none)" },
  },
};

export function getInputVariants(themeId: ThemeId): Variants {
  return INPUT_VARIANTS[themeId];
}
