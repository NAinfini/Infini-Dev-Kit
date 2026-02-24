import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { App, ConfigProvider, theme as antdTheme } from "antd";

import { createBrowserLocalStorageAdapter } from "../../utils/storage";
import {
  createThemeProviderBridge,
  type ThemeProviderBridge,
  type ThemeProviderSnapshot,
} from "../theme-provider-bridge";

const DARK_THEMES = new Set(["cyberpunk", "black-gold", "red-gold"]);

const BridgeContext = createContext<ThemeProviderBridge | null>(null);
const SnapshotContext = createContext<ThemeProviderSnapshot | null>(null);

export function useBridge(): ThemeProviderBridge {
  const ctx = useContext(BridgeContext);
  if (!ctx) throw new Error("useBridge must be used inside KitApp");
  return ctx;
}

export function useThemeSnapshot(): ThemeProviderSnapshot {
  const ctx = useContext(SnapshotContext);
  if (!ctx) throw new Error("useThemeSnapshot must be used inside KitApp");
  return ctx;
}

const bridge = createThemeProviderBridge({
  storage: createBrowserLocalStorageAdapter(),
  prefersReducedMotion: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
});

export function KitApp({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState(() => bridge.getSnapshot());
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => bridge.subscribe(setSnapshot), []);

  useLayoutEffect(() => {
    if (!styleRef.current) {
      styleRef.current = document.createElement("style");
      document.head.appendChild(styleRef.current);
    }
    const { selector, variables } = snapshot.scope.variables;
    const rules = Object.entries(variables)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join("\n");
    styleRef.current.textContent = `${selector} {\n${rules}\n}`;
  }, [snapshot]);

  useLayoutEffect(() => {
    document.documentElement.className = snapshot.scope.className;
    document.documentElement.dataset.themeId = snapshot.state.themeId;
    document.body.dataset.themeId = snapshot.state.themeId;
  }, [snapshot.scope.className, snapshot.state.themeId]);

  const { token, components } = snapshot.antd;
  const algorithm = DARK_THEMES.has(snapshot.state.themeId)
    ? [antdTheme.darkAlgorithm]
    : [antdTheme.defaultAlgorithm];

  return (
    <BridgeContext.Provider value={bridge}>
      <SnapshotContext.Provider value={snapshot}>
        <ConfigProvider theme={{ token, components, algorithm, cssVar: true, hashed: false }}>
          <App>{children}</App>
        </ConfigProvider>
      </SnapshotContext.Provider>
    </BridgeContext.Provider>
  );
}
