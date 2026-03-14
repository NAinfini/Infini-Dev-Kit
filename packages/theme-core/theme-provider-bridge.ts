import type { EffectiveMotionMode, MotionMode } from "@infini-dev-kit/utils/motion";

import {
  buildScopedCssVariables,
  buildScopedThemeClass,
} from "./tokens/css-generator";
import type { ScopedCssVariables } from "./tokens/css-generator";
import { getMotionContract, type MotionContract, type MotionIntent } from "./motion-contracts";
import { createOverlayService, type OverlayService } from "./overlay-service";
import { createThemeController, type ThemeControllerOptions, type ThemeControllerState } from "./theme-controller";
import { resolveThemeSpec, type ThemeId, type ThemeSpec } from "./theme-specs";

const DEFAULT_SCOPE = "root";

const MOTION_INTENTS: readonly MotionIntent[] = [
  "enter",
  "exit",
  "hover",
  "press",
  "focus",
  "overlay-open",
  "overlay-close",
  "list-update",
];

/**
 * Generic theme composer function signature.
 * The host app provides its own implementation (e.g. Mantine, Chakra, etc.).
 */
export type ThemeComposerFn<T = unknown> = (options: {
  themeId: ThemeId;
  forcedColorScheme?: "light" | "dark";
}) => T;

export interface ThemeProviderBridgeOptions<T = unknown> extends ThemeControllerOptions {
  scope?: string;
  forcedColorScheme?: "light" | "dark";
  /** Host app provides its own theme composer (e.g. composeMantineTheme). */
  themeComposer: ThemeComposerFn<T>;
}

export interface ThemeProviderScopeSnapshot {
  className: string;
  variables: ScopedCssVariables;
}

export interface ThemeProviderMotionSnapshot {
  mode: MotionMode;
  effectiveMode: EffectiveMotionMode;
  contracts: Record<MotionIntent, MotionContract>;
}

export interface ThemeProviderSnapshot<T = unknown> {
  state: ThemeControllerState;
  theme: ThemeSpec;
  composed: T;
  scope: ThemeProviderScopeSnapshot;
  motion: ThemeProviderMotionSnapshot;
}

export interface ThemeProviderBridge<T = unknown> {
  getSnapshot(): ThemeProviderSnapshot<T>;
  subscribe(listener: (snapshot: ThemeProviderSnapshot<T>) => void): () => void;
  setTheme(themeId: ThemeId): void;
  setMotionMode(mode: MotionMode): void;
  exportState(): string;
  importState(serialized: string): void;
  overlays: OverlayService;
}

export function createThemeProviderBridge<T = unknown>(
  options: ThemeProviderBridgeOptions<T>,
): ThemeProviderBridge<T> {
  const controller = createThemeController(options);
  const overlays = createOverlayService();
  const listeners = new Set<(snapshot: ThemeProviderSnapshot<T>) => void>();
  const scopeClassName = buildScopedThemeClass(options.scope ?? DEFAULT_SCOPE);

  controller.subscribe(() => {
    const snapshot = getSnapshot();
    for (const listener of listeners) {
      listener(snapshot);
    }
  });

  function getSnapshot(): ThemeProviderSnapshot<T> {
    const state = controller.getState();
    const theme = resolveThemeSpec(state.themeId);
    const normalizedState: ThemeControllerState = {
      themeId: theme.id,
      motionMode: state.motionMode,
    };
    const effectiveMode = normalizedState.motionMode;
    const contracts = buildMotionContracts(theme.id, normalizedState.motionMode);
    const scopedVariables = applyMotionModeVariables(
      buildScopedCssVariables(theme.id, `.${scopeClassName}`),
      effectiveMode,
      contracts,
    );

    return {
      state: normalizedState,
      theme,
      composed: options.themeComposer({
        themeId: theme.id,
        forcedColorScheme: options.forcedColorScheme,
      }),
      scope: {
        className: scopeClassName,
        variables: scopedVariables,
      },
      motion: {
        mode: normalizedState.motionMode,
        effectiveMode,
        contracts,
      },
    };
  }

  return {
    getSnapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setTheme(themeId) {
      controller.setTheme(themeId);
    },
    setMotionMode(mode) {
      controller.setMotionMode(mode);
    },
    exportState() {
      return controller.exportState();
    },
    importState(serialized) {
      controller.importState(serialized);
    },
    overlays,
  };
}

function buildMotionContracts(
  themeId: ThemeId,
  mode: MotionMode,
): Record<MotionIntent, MotionContract> {
  const contracts = {} as Record<MotionIntent, MotionContract>;

  for (const intent of MOTION_INTENTS) {
    contracts[intent] = getMotionContract(themeId, intent, { mode });
  }

  return contracts;
}

function applyMotionModeVariables(
  scoped: ScopedCssVariables,
  effectiveMode: EffectiveMotionMode,
  contracts: Record<MotionIntent, MotionContract>,
): ScopedCssVariables {
  return {
    ...scoped,
    variables: {
      ...scoped.variables,
      "--infini-motion-enter": `${contracts.enter.durationMs}ms`,
      "--infini-motion-exit": `${contracts.exit.durationMs}ms`,
      "--infini-motion-hover": `${contracts.hover.durationMs}ms`,
      "--infini-motion-press": `${contracts.press.durationMs}ms`,
      "--infini-motion-distance": `${contracts.enter.distancePx}px`,
      "--infini-motion-easing": contracts.enter.easing,
      "--infini-motion-mode": effectiveMode,
    },
  };
}
