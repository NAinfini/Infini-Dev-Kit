# AGENTS.md — Machine-Readable Dev Kit Reference

> **This file is for AI coding agents.** Read this first before modifying any code in this repository.

## Repository Identity

- **Name:** Infini Dev Kit
- **Type:** Private pnpm workspace monorepo, source-first TypeScript toolkit
- **Distribution:** Raw `.ts`/`.tsx` source. No build output. Consumers bundle it themselves.
- **Package manager:** pnpm 10.29.1+
- **TypeScript:** 5.8+ strict mode
- **Test runner:** Vitest
- **Workspace:** `packages/*` (12 packages)

## Commands

```
pnpm install      # install dependencies
pnpm typecheck    # MUST pass with zero errors before any commit
pnpm test         # vitest run — all tests must pass
pnpm build        # tsc build across all packages
```

## File Index

### Root

| File | Purpose |
|------|---------|
| `package.json` | Root workspace config (private, no exports) |
| `tsconfig.base.json` | Shared TS config with path aliases for all 12 packages |
| `pnpm-workspace.yaml` | Workspace definition (`packages/*`) |
| `README.md` | Human-readable documentation |
| `AGENTS.md` | This file — agent-readable reference |
| `CONTRIBUTING.md` | Contribution rules |
| `LICENSE` | MIT |

### packages/theme-core/ — Framework-Agnostic Theme System (`@infini-dev-kit/theme-core`)

| Path | What It Contains |
|------|------------------|
| `index.ts` | Root barrel — re-exports everything |
| `theme-types.ts` | `ThemeId`, `ThemeSpec`, `ThemePalette`, all type definitions |
| `theme-specs.ts` | Theme registry: `getThemeSpec(id)`, `listThemeIds()` |
| `theme-controller.ts` | Headless state machine: `createThemeController()` |
| `theme-provider-bridge.ts` | Orchestrator: controller + adapter → snapshot |
| `theme-transition.ts` | Theme transition utilities |
| `motion-types.ts` | Motion type definitions |
| `motion-contracts.ts` | Motion intent → transition config mapping |
| `spring-profiles.ts` | Spring physics presets per theme |
| `overlay-service.ts` | Framework-agnostic overlay service |
| `tokens/css-generator.ts` | `buildScopedCssVariables()` — 100+ `--infini-*` CSS properties |
| `tokens/font-loader.ts` | `initFonts()`, `loadThemeFonts()`, `loadLocaleFonts()` |
| `tokens/control-glow.ts` | `resolveControlGlow()` |
| `echarts/` | ECharts theme adapter: `buildEChartsTheme()` |
| `themes/` | 6 theme specs: default, chibi, cyberpunk, neu-brutalism, black-gold, red-gold |

### packages/adapter-mantine/ — Mantine Adapter (`@infini-dev-kit/adapter-mantine`)

| Path | What It Contains |
|------|------------------|
| `index.ts` | Barrel export |
| `mantine-types.ts` | `MantineThemeConfig`, `MantineThemeToken`, `ScopedCssVariables` |
| `mantine-variables.ts` | ThemeSpec → Mantine CSS variables (100+ properties) |
| `theme-overrides.ts` | `getThemeOverrides()` — per-theme component overrides |
| `locale-typography.ts` | `applyLocaleTypography()` — locale-specific font application |
| `theme-effects.ts` | Per-theme CSS effect modules |

### packages/adapter-shadcn/ — shadcn/Tailwind Adapter (`@infini-dev-kit/adapter-shadcn`)

| Path | What It Contains |
|------|------------------|
| `index.ts` | Barrel export |
| `shadcn-types.ts` | `ShadcnVariableMap`, `BuildShadcnOptions` |
| `shadcn-variables.ts` | `buildShadcnVariables()`, `hexToHsl()`, `buildShadcnCssBlock()` |
| `tailwind-preset.ts` | `infiniTailwindPreset()` — Tailwind CSS preset |

### packages/adapter-mui/ — MUI Adapter (`@infini-dev-kit/adapter-mui`)

| Path | What It Contains |
|------|------------------|
| `index.ts` | Barrel export |
| `mui-types.ts` | `MuiThemeConfig`, `MuiPaletteColor` |
| `mui-tokens.ts` | `buildMuiTheme()` — ThemeSpec → MUI `ThemeOptions` |
| `mui-overrides.ts` | `getMuiOverrides()` — per-theme component overrides |

### packages/adapter-antd/ — Ant Design Adapter (`@infini-dev-kit/adapter-antd`)

| Path | What It Contains |
|------|------------------|
| `index.ts` | Barrel export |
| `antd-types.ts` | `AntdThemeConfig`, `AntdSeedToken` |
| `antd-tokens.ts` | `buildAntdTheme()`, `buildAntdSeedTokens()` |
| `antd-overrides.ts` | `getAntdOverrides()` — per-theme component overrides |

### packages/adapter-radix/ — Radix Themes Adapter (`@infini-dev-kit/adapter-radix`)

| Path | What It Contains |
|------|------------------|
| `index.ts` | Barrel export |
| `radix-types.ts` | `RadixThemeProps`, `RadixAccentColor`, `RadixCssOverrides` |
| `radix-tokens.ts` | `buildRadixThemeProps()`, `buildRadixCssOverrides()` |
| `radix-overrides.ts` | `getRadixOverrides()` — per-theme component variant hints |

### packages/react/ — React Components & Hooks (`@infini-dev-kit/react`)

| Path | What It Contains |
|------|------------------|
| `index.ts` | Root barrel — re-exports components, hooks, utils |
| `components/` | 71 base components (categorized) |
| `hooks/` | Motion hooks (useMotionAllowed, useThemeSpring, useThemeTransition, etc.) |
| `utils/` | React-specific utilities |
| `tests/` | Vitest test files |

### packages/api-client/ — HTTP Client (`@infini-dev-kit/api-client`)

| File | Purpose |
|------|---------|
| `api-client.ts` | `createApiClient(options)` — fetch-based HTTP client |
| `index.ts` | Barrel export |

### packages/bot-core/ — Bot Framework (`@infini-dev-kit/bot-core`)

| File | Purpose |
|------|---------|
| `bot.ts` | `createBot(options)` — compose adapter + middleware + commands |
| `adapter-types.ts` | `BotAdapter` interface — implement this for new platforms |
| `middleware.ts` | `composeMiddleware()` — Koa-style pipeline |
| `command-router.ts` | `createCommandRouter()` — text command routing |
| `message-types.ts` | `BotMessage`, `BotMessagePayload` types |
| `built-in/` | logger, rate-limit, filter, error-boundary middleware |

### packages/bot-discord/, packages/bot-wechat/ — Platform Adapters

Each implements `BotAdapter` from `packages/bot-core/adapter-types.ts`.

### packages/utils/ — Shared Utilities (`@infini-dev-kit/utils`)

| File | Key Exports |
|------|-------------|
| `a11y.ts` | Focus tracking, reduced motion detection |
| `color.ts` | `contrastRatio()`, `pickReadableTextColor()`, `hoverColor()`, `activeColor()` |
| `env.ts` | `isBrowser()`, `isServer()` |
| `error.ts` | `toError()` — coerce unknown to Error |
| `id.ts` | `createRequestId()`, `createTraceId()`, `createSpanId()` |
| `lru-map.ts` | `LRUMap<K,V>` — bounded LRU cache |
| `motion.ts` | `MotionMode`, `EffectiveMotionMode` type definitions |
| `scroll.ts` | Scroll lock utilities |
| `storage.ts` | `createBrowserLocalStorageAdapter()`, `createMemoryStorageAdapter()` |
| `types.ts` | `Result<T,E>`, `Option<T>`, `Brand<T,B>`, `DeepPartial<T>` |
| `view-transition.ts` | View Transition API wrapper |

## How to Use This Kit

### Consuming in an app

```tsx
// 1. Set up theme bridge with your preferred adapter
import { createThemeProviderBridge } from "@infini-dev-kit/theme-core";

// Mantine
import { composeMantineTheme } from "@infini-dev-kit/adapter-mantine";
import { MantineProvider } from "@mantine/core";
const bridge = createThemeProviderBridge({ defaultTheme: "default" });
<MantineProvider theme={bridge.mantineTheme}>{/* app */}</MantineProvider>

// shadcn/ui — inject CSS variables
import { buildShadcnVariables } from "@infini-dev-kit/adapter-shadcn";
const vars = buildShadcnVariables("cyberpunk");

// MUI
import { buildMuiTheme } from "@infini-dev-kit/adapter-mui";
import { ThemeProvider, createTheme } from "@mui/material";
<ThemeProvider theme={createTheme(buildMuiTheme("cyberpunk"))}>{/* app */}</ThemeProvider>

// Ant Design
import { buildAntdTheme } from "@infini-dev-kit/adapter-antd";
import { ConfigProvider } from "antd";
<ConfigProvider theme={buildAntdTheme("cyberpunk")}>{/* app */}</ConfigProvider>

// Radix Themes
import { buildRadixThemeProps, buildRadixCssOverrides } from "@infini-dev-kit/adapter-radix";
import { Theme } from "@radix-ui/themes";
<Theme {...buildRadixThemeProps("cyberpunk")} style={buildRadixCssOverrides("cyberpunk")}>{/* app */}</Theme>

// 2. Use components
import { GlowCard, DepthButton } from "@infini-dev-kit/react";
<GlowCard><DepthButton onClick={() => {}}>Click me</DepthButton></GlowCard>

// 3. Switch themes programmatically
bridge.controller.setTheme("cyberpunk");
```

### Using the API client

```ts
import { createApiClient } from "@infini-dev-kit/api-client";

const api = createApiClient({
  baseUrl: "https://api.example.com",
  getAuthToken: () => localStorage.getItem("token"),
});

const users = await api.request<User[]>({ method: "GET", path: "/users" });
```

### Using the bot framework

```ts
import { createBot } from "@infini-dev-kit/bot-core";
import { createDiscordAdapter } from "@infini-dev-kit/bot-discord";

const bot = createBot({
  adapter: createDiscordAdapter({ token: process.env.DISCORD_TOKEN }),
  commandPrefix: "!",
});

bot.command({ name: "ping", handler: async (ctx) => ctx.reply("pong") });
await bot.start();
```

## How to Modify This Kit

### Add a component

1. **Create file** at `packages/react/components/YourComponent.tsx`
2. **Export** from `packages/react/components/index.ts` (keep alphabetical)
3. **Run** `pnpm typecheck` — must pass

Component rules:
- Import theme via CSS variables (`var(--infini-*)`) for static tokens
- Import motion hooks from `"../hooks/use-motion-allowed"` and `"../hooks/use-theme-transition"`
- Gate animations with `useMotionAllowed()` / `useFullMotion()`
- Always render a non-animated fallback when motion is off

### Add a theme

1. Add ID to `ThemeId` union in `packages/theme-core/theme-types.ts`
2. Create spec in `packages/theme-core/themes/<name>.ts`
3. Register in `packages/theme-core/theme-specs.ts`
4. Add overrides in `packages/adapter-mantine/theme-overrides.ts` if needed
5. Optionally add overrides in other adapters (`adapter-antd`, `adapter-mui`, `adapter-radix`)

### Add a UI framework adapter

1. Create `packages/adapter-<framework>/` directory
2. Add `package.json` with `@infini-dev-kit/adapter-<framework>` name
3. Depend on `@infini-dev-kit/theme-core: workspace:*` and `@infini-dev-kit/utils: workspace:*`
4. Framework lib as `peerDependency` only
5. Add `tsconfig.json` with references to `../utils` and `../theme-core`
6. Add path aliases to `tsconfig.base.json`
7. Implement the 3-layer pattern: types → token mapping → component overrides

### Add a utility

1. Create `packages/utils/<name>.ts` — must be a pure function, no side effects
2. Export from `packages/utils/index.ts`
3. Add tests in `packages/utils/tests/<name>.test.ts`

### Add a bot adapter

1. Create `packages/bot-<platform>/` directory
2. Add `package.json` with `@infini-dev-kit/bot-<platform>` name
3. Implement `BotAdapter` from `packages/bot-core/adapter-types.ts`
4. Add `tsconfig.json` with reference to `../bot-core`
5. Add path alias to `tsconfig.base.json`

## Dependency Direction (No Circular Imports)

```
packages/utils/          ← everything can import from utils
  ↑
packages/theme-core/     ← adapters, react import from theme-core
  ↑
packages/adapter-*/      ← leaf nodes (one per UI framework)
packages/react/          ← imports from theme-core, adapter-mantine, utils

packages/api-client/     ← standalone, no cross-imports
packages/bot-core/       ← standalone, imports from utils only
packages/bot-discord/    ← imports from bot-core only
packages/bot-wechat/     ← imports from bot-core only
```

## Import Path Patterns

```ts
// From any package — use workspace package names
import { getThemeSpec, type ThemeId } from "@infini-dev-kit/theme-core";
import { buildScopedCssVariables } from "@infini-dev-kit/theme-core";
import { DepthButton, TiltCard } from "@infini-dev-kit/react";
import { contrastRatio } from "@infini-dev-kit/utils";
import { buildMuiTheme } from "@infini-dev-kit/adapter-mui";

// Within a package — use relative imports
import type { ShadcnVariableMap } from "./shadcn-types";
```

## Constraints

- **No `any`** — use `unknown` + narrowing
- **No unused code** — `noUnusedLocals` and `noUnusedParameters` enforced
- **No bundler config** — source-first, consumers bundle
- **No `.js` output** — only `.ts`/`.tsx` source files
- **No mock/fallback paths** — let errors surface explicitly
- **No `@ts-ignore`** — fix the type, don't suppress it
- **Adapters are pure mapping layers** — framework libs are peerDependencies only
- **theme-core has zero React/Mantine dependencies** — keep it framework-agnostic

## Agent Workflow Rules

When modifying this codebase, you **must** follow these practices:

### Track every file you touch

- Before making changes, list all files you intend to modify.
- After making changes, verify every modified file compiles (`pnpm typecheck`).
- If you move or rename a file, search the entire codebase for imports referencing the old path and update them all.
- When adding a new export, update the relevant barrel `index.ts` file.

### Verify before declaring done

- Run `pnpm typecheck` — must show zero new errors.
- If you modified a component, confirm the barrel export in `packages/react/components/index.ts` is correct.
- If you added a file, confirm it is included by the package's `tsconfig.json` `include` globs.

### Keep files in sync

These files must stay consistent with each other:

| When you change... | Also update... |
|---------------------|---------------|
| A component file | `packages/react/components/index.ts` barrel |
| Component props | `packages/react/motion-types.ts` |
| A theme spec | `packages/theme-core/theme-specs.ts` registry, `theme-types.ts` ThemeId union |
| Theme overrides | `packages/adapter-mantine/theme-overrides.ts` (and other adapters) |
| A hook file | `packages/react/hooks/index.ts` barrel |
| A utility file | `packages/utils/index.ts` barrel |
| A new package | `tsconfig.base.json` path aliases, `AGENTS.md` file index, `README.md` package table |

### No orphaned files

- Every `.ts`/`.tsx` file must be reachable from a barrel `index.ts`.
- Every theme must be registered in `packages/theme-core/theme-specs.ts`.
- Delete files completely when removing — do not leave dead imports or commented-out references.

