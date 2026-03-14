import { type ThemeId } from "@infini-dev-kit/theme-core";
import type { ScopedCssVariables } from "./mantine-types";
export declare function buildScopedThemeClass(scope: string): string;
export declare function buildScopedCssVariables(themeId: ThemeId, selector: string): ScopedCssVariables;
export declare function sanitizeScope(scope: string): string;
