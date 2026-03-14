import { resolveThemeSpec } from "@infini-dev-kit/theme-core";

/**
 * Resolves a CSS variable or `var(--infini-*)` token to a concrete color string.
 * This lives in `frontend/` because it depends on DOM and theme specs — pure color
 * math stays in `utils/color.ts`.
 */
export function resolveColorValue(color: string, seenVars = new Set<string>()): string {
  const trimmed = color.trim();

  if (!isCssVariable(trimmed)) {
    return trimmed;
  }

  const { name, fallback } = parseCssVariable(trimmed);
  if (seenVars.has(name)) {
    throw new Error(`Circular CSS variable color reference: ${color}`);
  }

  const nextSeenVars = new Set(seenVars);
  nextSeenVars.add(name);

  const resolved = readCssVariable(name);
  if (resolved) {
    return resolveColorValue(resolved, nextSeenVars);
  }

  const themeResolved = resolveInfiniThemeToken(name);
  if (themeResolved) {
    return resolveColorValue(themeResolved, nextSeenVars);
  }

  if (fallback) {
    return resolveColorValue(fallback, nextSeenVars);
  }

  throw new Error(`Unable to resolve CSS variable color: ${color}`);
}

function readCssVariable(name: string): string {
  if (typeof document === "undefined" || typeof getComputedStyle !== "function") {
    return "";
  }

  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function resolveInfiniThemeToken(name: string): string | undefined {
  const theme = resolveThemeSpec(readActiveThemeId());

  switch (name) {
    case "--infini-color-primary":
      return theme.palette.primary;
    case "--infini-color-secondary":
      return theme.palette.secondary;
    case "--infini-color-accent":
      return theme.palette.accent;
    case "--infini-color-text":
      return theme.palette.text;
    case "--infini-color-text-muted":
      return theme.palette.textMuted;
    case "--infini-color-success":
      return theme.palette.success;
    case "--infini-color-warning":
      return theme.palette.warning;
    case "--infini-color-danger":
      return theme.palette.danger;
    case "--infini-color-bg":
      return theme.foundation.background;
    case "--infini-color-surface":
      return theme.foundation.surface;
    case "--infini-color-sidebar":
      return theme.foundation.sidebarBackground;
    case "--infini-color-border":
      return theme.foundation.borderColor;
    case "--infini-button-bg-active":
      return theme.button.backgroundActive;
    case "--infini-button-bg-shadow":
      return theme.button.backgroundShadow;
    default:
      return undefined;
  }
}

function readActiveThemeId(): string {
  if (typeof document === "undefined") {
    return "default";
  }

  return document.documentElement.dataset.themeId ?? document.body?.dataset.themeId ?? "default";
}

function isCssVariable(value: string): boolean {
  return value.startsWith("var(") && value.endsWith(")");
}

function parseCssVariable(value: string): { name: string; fallback?: string } {
  const body = value.slice(4, -1).trim();
  const separatorIndex = findTopLevelComma(body);
  const name = (separatorIndex === -1 ? body : body.slice(0, separatorIndex)).trim();

  if (!name.startsWith("--")) {
    throw new Error(`Invalid CSS variable color: ${value}`);
  }

  const fallback = separatorIndex === -1 ? undefined : body.slice(separatorIndex + 1).trim();
  return fallback ? { name, fallback } : { name };
}

function findTopLevelComma(value: string): number {
  let depth = 0;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (character === "(") {
      depth += 1;
      continue;
    }

    if (character === ")") {
      depth = Math.max(0, depth - 1);
      continue;
    }

    if (character === "," && depth === 0) {
      return index;
    }
  }

  return -1;
}
