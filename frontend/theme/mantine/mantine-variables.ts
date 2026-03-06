import { getThemeSpec, type ThemeId, type ThemeSpec } from "../theme-specs";
import type { ScopedCssVariables } from "./mantine-types";
import { resolveControlGlow } from "./control-glow";

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
      "--infini-color-text": theme.palette.text,
      "--infini-color-text-muted": theme.palette.textMuted,
      "--infini-color-success": theme.palette.success,
      "--infini-color-warning": theme.palette.warning,
      "--infini-color-danger": theme.palette.danger,
      "--infini-color-bg": theme.foundation.background,
      "--infini-color-surface": theme.foundation.surface,
      "--infini-color-sidebar": theme.foundation.sidebarBackground,
      "--infini-color-border": theme.foundation.borderColor,
      "--infini-border-width": `${theme.foundation.borderWidth}px`,
      "--infini-radius": `${theme.foundation.radius}px`,
      "--infini-font-display": theme.typography.en.heading,
      "--infini-font-body": theme.typography.en.body,
      "--infini-font-mono": theme.typography.en.mono,
      "--infini-font-display-weight": `${theme.typography.weights.bold}`,
      "--infini-font-body-weight": `${theme.typography.weights.normal}`,
      "--infini-text-xs": "11px",
      "--infini-text-sm": "12px",
      "--infini-text-base": "14px",
      "--infini-text-lg": "16px",
      "--infini-text-xl": "20px",
      "--infini-text-2xl": "24px",
      "--infini-text-3xl": "32px",
      "--infini-shadow": theme.foundation.shadow,
      "--infini-shadow-sm": theme.foundation.shadowSm,
      "--infini-shadow-lg": theme.foundation.shadowLg,
      "--infini-shadow-hover": theme.foundation.shadowHover,
      "--infini-shadow-pressed": theme.foundation.shadowPressed,
      "--infini-shadow-inset": theme.foundation.shadowInset ?? "none",
      "--infini-shadow-danger": theme.foundation.shadowDanger ?? theme.foundation.shadow,
      "--infini-depth-button": theme.depth.buttonShadow,
      "--infini-depth-button-hover": theme.depth.buttonShadowHover,
      "--infini-depth-button-pressed": theme.depth.buttonShadowPressed,
      "--infini-depth-card": theme.depth.cardShadow,
      "--infini-depth-card-hover": theme.depth.cardShadowHover,
      "--infini-depth-input-inset": theme.depth.inputInsetShadow,
      "--infini-depth-switch": theme.depth.switchShadow,
      "--infini-depth-dropdown": theme.depth.dropdownShadow,
      "--infini-glow-primary": resolveControlGlow(theme, "primary"),
      "--infini-glow-success": resolveControlGlow(theme, "success"),
      "--infini-glow-warning": resolveControlGlow(theme, "warning"),
      "--infini-glow-error": resolveControlGlow(theme, "error"),
      "--infini-glow-info": resolveControlGlow(theme, "info"),
      "--infini-motion-enter": `${theme.motion.enterMs}ms`,
      "--infini-motion-exit": `${theme.motion.exitMs}ms`,
      "--infini-motion-hover": `${theme.motion.hoverDuration}ms`,
      "--infini-motion-press": `${theme.motion.pressMs}ms`,
      "--infini-motion-easing": theme.motion.easing,
      "--infini-motion-distance": `${theme.motion.distancePx}px`,
      "--infini-motion-spring": resolveSpring(theme.motion.bounce, theme.motion.enterMs),
      "--infini-bg-pattern": resolvePattern(theme.foundation.backgroundPattern),
      "--infini-bg-pattern-named": theme.foundation.backgroundPattern,
      "--infini-gradient-ambient": resolveAmbientGradient(theme.palette.primary),
      "--infini-gradient-hero": resolveHeroGradient(theme.palette.primary, theme.palette.secondary),
      "--infini-gradient-card": resolveCardGradient(theme.foundation.surface),
      "--infini-panel-clip": resolvePanelClip(),
      "--infini-overlay-backdrop": theme.overlays.modalBackdrop,
      "--infini-overlay-tone": theme.overlays.toastTone,
      "--infini-corner-accent": resolveCornerAccent(themeId),
      "--infini-table-density": theme.dataUi.density,
      "--infini-row-separator": theme.dataUi.rowSeparator,
      "--infini-status-shape": theme.dataUi.statusShape,
    },
  };
}

function resolveAmbientGradient(primary: string): string {
  return `radial-gradient(circle at 12% 18%, color-mix(in srgb, ${primary} 8%, transparent) 0%, transparent 62%)`;
}

function resolveHeroGradient(primary: string, secondary: string): string {
  return `linear-gradient(135deg, color-mix(in srgb, ${primary} 78%, #ffffff 22%) 0%, color-mix(in srgb, ${secondary} 74%, #ffffff 26%) 100%)`;
}

function resolveCardGradient(surface: string): string {
  return `linear-gradient(135deg, color-mix(in srgb, ${surface} 98%, #ffffff 2%) 0%, transparent 100%)`;
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

function resolvePanelClip(): string {
  // clip-path removed from cards — it creates a containing block that clips badge dots
  // Chamfered corners are now handled via border-image or visual-only pseudo-elements
  return "none";
}

function resolveCornerAccent(themeId: ThemeId): string {
  switch (themeId) {
    case "cyberpunk":
      return "cyber-bracket";
    case "chibi":
      return "chibi-dot";
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

