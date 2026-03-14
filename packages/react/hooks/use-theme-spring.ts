import { useMemo, useSyncExternalStore } from "react";

import type { SpringProfile } from "../motion-types";
import { getSpringProfile } from "@infini-dev-kit/theme-core";
import type { ThemeId } from "@infini-dev-kit/theme-core";

function getThemeIdFromDOM(): ThemeId {
  if (typeof document === "undefined") return "default";
  return (document.documentElement.dataset.themeId as ThemeId) ?? "default";
}

function subscribeToThemeId(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme-id"] });
  return () => observer.disconnect();
}

export function useThemeId(): ThemeId {
  return useSyncExternalStore(subscribeToThemeId, getThemeIdFromDOM, () => "default" as const);
}

export function useThemeSpring(): SpringProfile {
  const themeId = useThemeId();
  return useMemo(() => getSpringProfile(themeId), [themeId]);
}
