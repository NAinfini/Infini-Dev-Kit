import type { EffectiveMotionMode, MotionMode } from "../../utils/motion";

import {
  buildScopedCssVariables,
  buildScopedThemeClass,
  composeMantineTheme,
  type MantineColorSchemePreference,
  type MantineThemeConfig,
  type ScopedCssVariables,
} from "./mantine/mantine-adapter";
import { getMotionContract, type MotionContract, type MotionIntent } from "./motion-contracts";
import { createOverlayService, type OverlayService } from "../overlays/overlay-service";
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
  forcedColorScheme?: MantineColorSchemePreference;
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
  mantine: MantineThemeConfig;
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
      mantine: composeMantineTheme({
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
