import { resolveMotionPreference, type EffectiveMotionMode, type MotionMode } from "../utils/motion";

import {
  buildScopedCssVariables,
  buildScopedThemeClass,
  composeAntdTheme,
  type AntdAlgorithm,
  type AntdThemeConfig,
  type ScopedCssVariables,
} from "./antd-adapter";
import { getMotionContract, type MotionContract, type MotionIntent } from "./motion-contracts";
import { createOverlayService, type OverlayService } from "./overlay-service";
import { getPrimitiveStyles, type PrimitiveStyles } from "./primitives";
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

export interface ThemeProviderBridgeOptions extends ThemeControllerOptions {
  scope?: string;
  algorithms?: AntdAlgorithm[];
  prefersReducedMotion?: () => boolean;
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

export interface ThemeProviderSnapshot {
  state: ThemeControllerState;
  theme: ThemeSpec;
  antd: AntdThemeConfig;
  primitives: PrimitiveStyles;
  scope: ThemeProviderScopeSnapshot;
  motion: ThemeProviderMotionSnapshot;
}

export interface ThemeProviderBridge {
  getSnapshot(): ThemeProviderSnapshot;
  subscribe(listener: (snapshot: ThemeProviderSnapshot) => void): () => void;
  setTheme(themeId: ThemeId): void;
  setMotionMode(mode: MotionMode): void;
  exportState(): string;
  importState(serialized: string): void;
  overlays: OverlayService;
}

export function createThemeProviderBridge(
  options: ThemeProviderBridgeOptions = {},
): ThemeProviderBridge {
  const controller = createThemeController(options);
  const overlays = createOverlayService();
  const listeners = new Set<(snapshot: ThemeProviderSnapshot) => void>();
  const scopeClassName = buildScopedThemeClass(options.scope ?? DEFAULT_SCOPE);

  controller.subscribe(() => {
    const snapshot = getSnapshot();
    for (const listener of listeners) {
      listener(snapshot);
    }
  });

  function getSnapshot(): ThemeProviderSnapshot {
    const state = controller.getState();
    const theme = resolveThemeSpec(state.themeId);
    const normalizedState: ThemeControllerState = {
      themeId: theme.id,
      motionMode: state.motionMode,
    };
    const prefersReducedMotion = options.prefersReducedMotion?.() ?? false;
    const effectiveMode = resolveMotionPreference(normalizedState.motionMode, prefersReducedMotion);
    const scopedVariables = applyMotionModeVariables(
      buildScopedCssVariables(theme.id, `.${scopeClassName}`),
      effectiveMode,
    );

    return {
      state: normalizedState,
      theme,
      antd: composeAntdTheme({
        themeId: theme.id,
        algorithms: options.algorithms,
      }),
      primitives: getPrimitiveStyles(theme.id),
      scope: {
        className: scopeClassName,
        variables: scopedVariables,
      },
      motion: {
        mode: normalizedState.motionMode,
        effectiveMode,
        contracts: buildMotionContracts(theme.id, normalizedState.motionMode, prefersReducedMotion),
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
  prefersReducedMotion: boolean,
): Record<MotionIntent, MotionContract> {
  const contracts = {} as Record<MotionIntent, MotionContract>;

  for (const intent of MOTION_INTENTS) {
    contracts[intent] = getMotionContract(themeId, intent, { mode, prefersReducedMotion });
  }

  return contracts;
}

function applyMotionModeVariables(
  scoped: ScopedCssVariables,
  effectiveMode: EffectiveMotionMode,
): ScopedCssVariables {
  if (effectiveMode === "full") {
    return scoped;
  }

  return {
    ...scoped,
    variables: {
      ...scoped.variables,
      "--infini-motion-enter": "0ms",
      "--infini-motion-exit": "0ms",
      "--infini-motion-hover": "0ms",
      "--infini-motion-press": "0ms",
      "--infini-motion-distance": "0px",
    },
  };
}
