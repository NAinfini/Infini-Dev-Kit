import { MantineProvider, type CSSVariablesResolver } from "@mantine/core";
import { Notifications, notifications } from "@mantine/notifications";
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { createBrowserLocalStorageAdapter } from "../../utils/storage";
import {
  createThemeProviderBridge,
  type ThemeProviderBridge,
  type ThemeProviderSnapshot,
} from "../theme/theme-provider-bridge";

const BridgeContext = createContext<ThemeProviderBridge | null>(null);
const SnapshotContext = createContext<ThemeProviderSnapshot | null>(null);

const bridge = createThemeProviderBridge({
  storage: createBrowserLocalStorageAdapter(),
  prefersReducedMotion: () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
});

export function useBridge(): ThemeProviderBridge {
  const ctx = useContext(BridgeContext);
  if (!ctx) {
    throw new Error("useBridge must be used inside InfiniProvider");
  }
  return ctx;
}

export function useThemeSnapshot(): ThemeProviderSnapshot {
  const ctx = useContext(SnapshotContext);
  if (!ctx) {
    throw new Error("useThemeSnapshot must be used inside InfiniProvider");
  }
  return ctx;
}

function mapToastColor(status: "info" | "success" | "warning" | "error"): string {
  if (status === "success") {
    return "green";
  }
  if (status === "warning") {
    return "yellow";
  }
  if (status === "error") {
    return "red";
  }
  return "blue";
}

export function InfiniProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState(() => bridge.getSnapshot());
  const previousScopeClass = useRef<string | null>(null);

  useEffect(() => bridge.subscribe(setSnapshot), []);

  useEffect(() => {
    return bridge.overlays.register({
      toast(payload) {
        notifications.show({
          title: payload.title,
          message: payload.description,
          color: mapToastColor(payload.status),
          withBorder: true,
          autoClose: payload.status === "error" ? false : 3000,
        });
      },
      async confirm() {
        return false;
      },
    });
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = previousScopeClass.current;

    if (previous && previous !== snapshot.scope.className) {
      root.classList.remove(previous);
    }

    root.classList.add(snapshot.scope.className);
    previousScopeClass.current = snapshot.scope.className;

    root.dataset.themeId = snapshot.state.themeId;
    if (document.body) {
      document.body.dataset.themeId = snapshot.state.themeId;
    }

    return () => {
      if (previousScopeClass.current) {
        root.classList.remove(previousScopeClass.current);
      }
    };
  }, [snapshot.scope.className, snapshot.state.themeId]);

  const cssVariablesResolver = useMemo<CSSVariablesResolver>(
    () => () => ({
      variables: snapshot.scope.variables.variables,
      light: {},
      dark: {},
    }),
    [snapshot.scope.variables.variables],
  );

  return (
    <BridgeContext.Provider value={bridge}>
      <SnapshotContext.Provider value={snapshot}>
        <MantineProvider
          key={`${snapshot.state.themeId}:${snapshot.mantine.colorScheme}`}
          theme={snapshot.mantine.theme}
          cssVariablesSelector={snapshot.scope.variables.selector}
          cssVariablesResolver={cssVariablesResolver}
          forceColorScheme={snapshot.mantine.colorScheme}
          withCssVariables
          withGlobalClasses
        >
          <Notifications position="bottom-right" zIndex={1200} />
          {children}
        </MantineProvider>
      </SnapshotContext.Provider>
    </BridgeContext.Provider>
  );
}

export const KitApp = InfiniProvider;