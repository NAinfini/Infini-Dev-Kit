import { getThemeSpec, type ThemeId, type ThemeSpec } from "./theme-specs";
import type { ScopedCssVariables } from "./antd-types";

export function buildScopedThemeClass(scope: string): string {
  return `infini-theme-scope-${sanitizeScope(scope)}`;
}

export function buildScopedCssVariables(themeId: ThemeId, selector: string): ScopedCssVariables {
  const theme = getThemeSpec(themeId);

  return {
    selector,
    variables: {
      "--infini-color-primary": theme.palette.primary,
      "--infini-color-secondary": theme.palette.secondary,
      "--infini-color-accent": theme.palette.accent,
      "--infini-color-bg": theme.foundation.background,
      "--infini-color-surface": theme.foundation.surface,
      "--infini-color-sidebar": theme.foundation.sidebarBackground,
      "--infini-border-color": theme.foundation.borderColor,
      "--infini-border-width": `${theme.foundation.borderWidth}px`,
      "--infini-radius": `${theme.foundation.radius}px`,
      "--infini-font-display": theme.typography.display,
      "--infini-font-body": theme.typography.body,
      "--infini-shadow": theme.foundation.shadow,
      "--infini-shadow-sm": theme.foundation.shadowSm,
      "--infini-shadow-lg": theme.foundation.shadowLg,
      "--infini-shadow-hover": theme.foundation.shadowHover,
      "--infini-shadow-pressed": theme.foundation.shadowPressed,
      "--infini-shadow-inset": theme.foundation.shadowInset ?? "none",
      "--infini-shadow-danger": theme.foundation.shadowDanger ?? theme.foundation.shadow,
      "--infini-shadow-focus": theme.foundation.shadowFocus ?? theme.foundation.focusRing,
      "--infini-motion-enter": `${theme.motion.enterMs}ms`,
      "--infini-motion-exit": `${theme.motion.exitMs}ms`,
      "--infini-motion-hover": `${theme.motion.hoverMs}ms`,
      "--infini-motion-press": `${theme.motion.pressMs}ms`,
      "--infini-motion-easing": theme.motion.easing,
      "--infini-motion-distance": `${theme.motion.distancePx}px`,
      "--infini-motion-spring": resolveSpring(theme.motion.overshoot, theme.motion.enterMs),
      "--infini-bg-pattern": resolvePattern(theme.foundation.backgroundPattern),
      "--infini-panel-clip": resolvePanelClip(themeId),
      "--infini-overlay-backdrop": theme.overlays.modalBackdrop,
      "--infini-overlay-tone": theme.overlays.toastTone,
      "--infini-corner-accent": resolveCornerAccent(themeId),
      "--infini-table-density": theme.dataUi.density,
      "--infini-row-separator": theme.dataUi.rowSeparator,
      "--infini-status-shape": theme.dataUi.statusShape,
    },
  };
}

function resolvePattern(pattern: ThemeSpec["foundation"]["backgroundPattern"]): string {
  switch (pattern) {
    case "radial-dot":
      return "radial-gradient(#FF9AAE 2px, transparent 2px)";
    case "chibi-sparkle-grid":
      return "linear-gradient(to right, rgba(43,27,46,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(43,27,46,0.06) 1px, transparent 1px), radial-gradient(rgba(43,27,46,0.12) 1.5px, transparent 1.5px)";
    case "circuit-scanline":
      return "linear-gradient(to right, rgba(0,240,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,240,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 50%, rgba(0,0,0,0.14) 50%)";
    case "grid-scanline":
      return "linear-gradient(to right, rgba(50,50,50,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(50,50,50,0.1) 1px, transparent 1px)";
    case "dot-grid":
      return "radial-gradient(#000000 1.5px, transparent 1.5px)";
    case "brutalist-halftone":
      return "linear-gradient(to right, rgba(0,0,0,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.12) 1px, transparent 1px), radial-gradient(#000000 1.5px, transparent 1.5px)";
    case "aurum-grain":
      return "linear-gradient(to right, rgba(212,175,55,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.025) 0.8px, transparent 0.8px)";
    case "faint-ornament":
      return "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")";
    case "imperial-grain":
      return "linear-gradient(to right, rgba(212,175,55,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,175,55,0.07) 1px, transparent 1px), radial-gradient(rgba(237,41,57,0.08) 1px, transparent 1px)";
    case "imperial-cross":
      return "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFD700' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")";
    default:
      return "none";
  }
}

function resolveSpring(overshoot: number, enterMs: number): string {
  if (overshoot <= 0) {
    return `cubic-bezier(0.22, 1, 0.36, 1) ${enterMs}ms`;
  }

  if (overshoot < 0.08) {
    return `cubic-bezier(0.2, 0.9, 0.2, 1.04) ${enterMs}ms`;
  }

  return `cubic-bezier(0.18, 1.18, 0.2, 1) ${enterMs}ms`;
}

function resolvePanelClip(themeId: ThemeId): string {
  switch (themeId) {
    case "cyberpunk":
      return "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";
    case "red-gold":
      return "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)";
    default:
      return "none";
  }
}

function resolveCornerAccent(themeId: ThemeId): string {
  switch (themeId) {
    case "cyberpunk":
      return "cyber-bracket";
    case "red-gold":
      return "imperial-frame";
    default:
      return "none";
  }
}

export function sanitizeScope(scope: string): string {
  return scope
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "");
}
