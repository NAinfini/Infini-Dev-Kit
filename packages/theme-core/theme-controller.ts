import type { MotionMode } from "@infini-dev-kit/utils/motion";
import type { StorageAdapter } from "@infini-dev-kit/utils/storage";
import { type ThemeId, listThemeIds } from "./theme-specs";

export interface ThemeControllerState {
  themeId: ThemeId;
  motionMode: MotionMode;
}

export interface ThemeController {
  getState(): ThemeControllerState;
  setTheme(themeId: ThemeId): void;
  setMotionMode(motionMode: MotionMode): void;
  subscribe(listener: (state: ThemeControllerState) => void): () => void;
  exportState(): string;
  importState(serialized: string): void;
}

export interface ThemeControllerOptions {
  defaultState?: Partial<ThemeControllerState>;
  controlledState?: ThemeControllerState;
  onChange?: (next: ThemeControllerState) => void;
  storage?: StorageAdapter;
  storageKey?: string;
  prefersReducedMotion?: () => boolean;
}

interface SerializedThemeState {
  version: 1;
  state: ThemeControllerState;
}

const STORAGE_VERSION = 1;
const DEFAULT_STORAGE_KEY = "infini-dev-kit.theme";
const DEFAULT_STATE: ThemeControllerState = {
  themeId: "default",
  motionMode: "full",
};

const VALID_MOTION_MODES: ReadonlySet<MotionMode> = new Set([
  "full",
  "reduced",
  "minimum",
  "off",
]);

const VALID_THEME_IDS: ReadonlySet<ThemeId> = new Set(listThemeIds());

export function createThemeController(
  options: ThemeControllerOptions = {},
): ThemeController {
  const storageKey = options.storageKey ?? DEFAULT_STORAGE_KEY;
  const listeners = new Set<(state: ThemeControllerState) => void>();

  let uncontrolledState = resolveInitialState(options, storageKey);

  function getState(): ThemeControllerState {
    return options.controlledState ?? uncontrolledState;
  }

  function apply(next: ThemeControllerState): void {
    if (options.controlledState) {
      options.onChange?.(next);
      notify(next);
      return;
    }

    uncontrolledState = next;
    options.onChange?.(next);
    persistState(options.storage, storageKey, next);
    notify(next);
  }

  function notify(next: ThemeControllerState): void {
    for (const listener of listeners) {
      listener(next);
    }
  }

  return {
    getState,
    setTheme(themeId) {
      if (!VALID_THEME_IDS.has(themeId)) {
        return;
      }
      apply({
        ...getState(),
        themeId,
      });
    },
    setMotionMode(motionMode) {
      if (!VALID_MOTION_MODES.has(motionMode)) {
        return;
      }
      apply({
        ...getState(),
        motionMode,
      });
    },
    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
    exportState() {
      return serializeState(getState());
    },
    importState(serialized) {
      const next = parseSerializedState(serialized);
      apply(next.state);
    },
  };
}

function resolveInitialState(
  options: ThemeControllerOptions,
  storageKey: string,
): ThemeControllerState {
  if (options.controlledState) {
    return options.controlledState;
  }

  const defaultState: ThemeControllerState = {
    ...DEFAULT_STATE,
    ...options.defaultState,
  };

  if (!options.defaultState?.motionMode && options.prefersReducedMotion?.()) {
    defaultState.motionMode = "reduced";
  }

  if (!options.storage) {
    return defaultState;
  }

  const raw = options.storage.getItem(storageKey);
  if (!raw) {
    return defaultState;
  }

  const migrated = migrateLegacyMotionMode(raw);

  if (migrated && migrated !== raw) {
    options.storage.setItem(storageKey, migrated);
  }

  try {
    const parsed = parseSerializedState(migrated ?? raw);
    return parsed.state;
  } catch {
    return defaultState;
  }
}

function migrateLegacyMotionMode(serialized: string): string | undefined {
  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized) as unknown;
  } catch {
    return undefined;
  }
  if (!parsed || typeof parsed !== "object") {
    return undefined;
  }

  const payload = parsed as {
    version?: unknown;
    state?: {
      themeId?: unknown;
      motionMode?: unknown;
    };
  };

  if (payload.version !== STORAGE_VERSION) {
    return undefined;
  }

  if (!payload.state || typeof payload.state !== "object") {
    return undefined;
  }

  if (payload.state.motionMode === "system") {
    payload.state.motionMode = "full";
    return JSON.stringify(payload);
  }

  return undefined;
}

function persistState(
  storage: StorageAdapter | undefined,
  key: string,
  state: ThemeControllerState,
): void {
  if (!storage) {
    return;
  }

  storage.setItem(key, serializeState(state));
}

function serializeState(state: ThemeControllerState): string {
  const payload: SerializedThemeState = {
    version: STORAGE_VERSION,
    state,
  };

  return JSON.stringify(payload);
}

function parseSerializedState(serialized: string): SerializedThemeState {
  const parsed = JSON.parse(serialized) as unknown;

  if (!isSerializedThemeState(parsed)) {
    throw new Error("Invalid theme state payload");
  }

  return parsed;
}

function isSerializedThemeState(value: unknown): value is SerializedThemeState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as {
    version?: unknown;
    state?: { themeId?: unknown; motionMode?: unknown };
  };

  if (payload.version !== STORAGE_VERSION) {
    return false;
  }

  if (!payload.state || typeof payload.state !== "object") {
    return false;
  }

  if (typeof payload.state.themeId !== "string") {
    return false;
  }

  if (!VALID_THEME_IDS.has(payload.state.themeId as ThemeId)) {
    return false;
  }

  if (typeof payload.state.motionMode !== "string") {
    return false;
  }

  return VALID_MOTION_MODES.has(payload.state.motionMode as MotionMode);
}
