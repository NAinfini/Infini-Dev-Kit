# AGENTS.md — Machine-Readable Dev Kit Reference

> **This file is for AI coding agents.** Read this first before modifying any code in this repository.

## Repository Identity

- **Name:** Infini Dev Kit
- **Type:** Private monorepo, source-first TypeScript toolkit
- **Distribution:** Raw `.ts`/`.tsx` source. No build output. Consumers bundle it themselves.
- **Package manager:** pnpm 10.29.1+
- **TypeScript:** 5.8+ strict mode, `tsc --noEmit` only
- **Test runner:** Vitest

## Commands

```
pnpm typecheck    # MUST pass with zero errors before any commit
pnpm test         # vitest run — all tests must pass
pnpm install      # install dependencies
```

## File Index

### Root

| File | Purpose |
|------|---------|
| `package.json` | Root workspace config (private, no exports) |
| `tsconfig.json` | Single tsconfig covering all packages |
| `README.md` | Human-readable documentation |
| `AGENTS.md` | This file — agent-readable reference |
| `CONTRIBUTING.md` | Contribution rules |
| `CHANGELOG.md` | Version history |
| `LICENSE` | MIT |

### frontend/ — UI Kit (`@infini-dev-kit/frontend`)

| Path | What It Contains |
|------|------------------|
| `frontend/index.ts` | Root barrel — re-exports everything |
| `frontend/package.json` | Package config with subpath exports |
| **frontend/theme/** | **Theme system (all theme logic lives here)** |
| `frontend/theme/theme-types.ts` | `ThemeId`, `ThemeSpec`, `ThemePalette`, all type definitions |
| `frontend/theme/theme-specs.ts` | Theme registry: `getThemeSpec(id)`, `listThemeIds()` |
| `frontend/theme/theme-controller.ts` | Headless state machine: `createThemeController()` |
| `frontend/theme/theme-provider-bridge.ts` | Orchestrator: controller + Mantine + motion → snapshot |
| `frontend/theme/theme-overrides.ts` | `getThemeOverrides(theme)` — centralised per-theme overrides |
| `frontend/theme/motion-types.ts` | **All component prop interfaces** (read this to understand component APIs) |
| `frontend/theme/motion-contracts.ts` | Motion intent → transition config mapping |
| `frontend/theme/spring-profiles.ts` | Spring physics presets per theme |
| `frontend/theme/themes/` | 6 theme specs: default, chibi, cyberpunk, neu-brutalism, black-gold, red-gold |
| `frontend/theme/themes/rich-config.ts` | Builder helpers for theme specs |
| `frontend/theme/mantine/` | Mantine adapter: `composeMantineTheme()`, CSS variables, component tokens |
| `frontend/theme/mantine/theme-configs/` | Per-theme MantineThemeOverride objects |
| `frontend/theme/mantine/theme-effects/` | Per-theme CSS Modules (decorative effects) |
| `frontend/theme/echarts/` | ECharts adapter: `buildEChartsTheme()` |
| **frontend/components/** | **44 components (all flat in one directory)** |
| `frontend/components/index.ts` | Barrel export — alphabetically sorted |
| **frontend/hooks/** | **All motion hooks** |
| `frontend/hooks/use-motion-allowed.ts` | `useMotionAllowed()`, `useFullMotion()`, `useEffectiveMotionMode()` |
| `frontend/hooks/use-theme-transition.ts` | `useThemeTransition(intent)` — returns motion transition config |
| `frontend/hooks/use-theme-spring.ts` | `useThemeSpring(intent)` — returns spring config |
| `frontend/hooks/use-animated-counter.ts` | `useAnimatedCounter(value)` — animated number |
| `frontend/hooks/use-gesture-feedback.ts` | `useGestureFeedback()` — hover/press feedback |
| `frontend/hooks/transition-utils.ts` | `resolveThemeTransition()` — pure function |
| `frontend/hooks/variants/` | Framer Motion variant presets (button, input, page, overlay, etc.) |
| **frontend/provider/** | **React provider layer** |
| `frontend/provider/InfiniProvider.tsx` | Root provider: wraps MantineProvider, provides theme context |
| `frontend/provider/KitApp.tsx` | Alias for InfiniProvider |
| `frontend/provider/ThemeToolbar.tsx` | Dev toolbar for switching themes/motion modes |
| **frontend/overlays/** | Toast/confirm service |
| `frontend/tests/` | Vitest test files |

### api-client/ — HTTP Client (`@infini-dev-kit/api-client`)

| File | Purpose |
|------|---------|
| `api-client/api-client.ts` | `createApiClient(options)` — fetch-based HTTP client |
| `api-client/index.ts` | Barrel export |

### bot-core/ — Bot Framework (`@infini-dev-kit/bot-core`)

| File | Purpose |
|------|---------|
| `bot-core/bot.ts` | `createBot(options)` — compose adapter + middleware + commands |
| `bot-core/adapter-types.ts` | `BotAdapter` interface — implement this for new platforms |
| `bot-core/middleware.ts` | `composeMiddleware()` — Koa-style pipeline |
| `bot-core/command-router.ts` | `createCommandRouter()` — text command routing |
| `bot-core/message-types.ts` | `BotMessage`, `BotMessagePayload` types |
| `bot-core/conversation-types.ts` | Conversation/session type definitions |
| `bot-core/user-types.ts` | Bot user type definitions |
| `bot-core/built-in/` | logger, rate-limit, filter, error-boundary middleware |

### bot-discord/, bot-wechat/ — Platform Adapters

Each implements `BotAdapter` from `bot-core/adapter-types.ts`.

### utils/ — Shared Utilities (`@infini-dev-kit/utils`)

| File | Key Exports |
|------|-------------|
| `utils/a11y.ts` | Focus tracking, reduced motion detection |
| `utils/color.ts` | `contrastRatio()`, `pickReadableTextColor()`, `hoverColor()`, `activeColor()` |
| `utils/env.ts` | `isBrowser()`, `isServer()` |
| `utils/id.ts` | `createRequestId()`, `createTraceId()`, `createSpanId()` — ID generation |
| `utils/motion.ts` | `MotionMode`, `EffectiveMotionMode` type definitions |
| `utils/scroll.ts` | Scroll lock utilities |
| `utils/storage.ts` | `createBrowserLocalStorageAdapter()`, `createMemoryStorageAdapter()` |
| `utils/types.ts` | `Result<T,E>`, `Option<T>`, `Brand<T,B>`, `DeepPartial<T>` |
| `utils/view-transition.ts` | View Transition API wrapper |

### examples/ — Theme Showcase Examples

| Directory | Purpose |
|-----------|---------|
| `examples/chibi-theme/` | Chibi theme demo |
| `examples/cyberpunk-theme/` | Cyberpunk theme demo |
| `examples/motion-showcase/` | Motion system showcase |
| `examples/neu-brutalism-theme/` | Neu-brutalism theme demo |

## How to Use This Kit

### Consuming in an app

```tsx
// 1. Wrap your app with InfiniProvider
import { InfiniProvider } from "@infini-dev-kit/frontend/provider";
import "@infini-dev-kit/frontend/theme/mantine/mantine-residual.css";

function App() {
  return <InfiniProvider>{/* your app */}</InfiniProvider>;
}

// 2. Use components anywhere inside the provider
import { GlowCard, DepthButton } from "@infini-dev-kit/frontend/components";
import { useThemeSnapshot } from "@infini-dev-kit/frontend/provider";

function MyPage() {
  const { theme } = useThemeSnapshot();
  return (
    <GlowCard>
      <DepthButton onClick={() => {}}>Click me</DepthButton>
    </GlowCard>
  );
}

// 3. Switch themes programmatically
import { useBridge } from "@infini-dev-kit/frontend/provider";

function ThemeSwitcher() {
  const bridge = useBridge();
  return <button onClick={() => bridge.setTheme("cyberpunk")}>Go Cyber</button>;
}
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

1. **Define props** in `frontend/theme/motion-types.ts`
2. **Create file** at `frontend/components/YourComponent.tsx`
3. **Export** from `frontend/components/index.ts` (keep alphabetical)
4. **Run** `pnpm typecheck` — must pass

Component rules:
- Import theme via `useThemeSnapshot()` from `"../provider/InfiniProvider"`
- Import motion hooks from `"../hooks/use-motion-allowed"` and `"../hooks/use-theme-transition"`
- Import prop types from `"../theme/motion-types"`
- Gate animations with `useMotionAllowed()` / `useFullMotion()`
- Always render a non-animated fallback when motion is off

### Add a theme

1. Add ID to `ThemeId` union in `frontend/theme/theme-types.ts`
2. Create spec in `frontend/theme/themes/<name>.ts` (use `rich-config.ts` builders)
3. Register in `frontend/theme/themes/index.ts`
4. Register in `frontend/theme/theme-specs.ts`
5. Add Mantine config in `frontend/theme/mantine/theme-configs/<name>.ts`
6. Add effects CSS in `frontend/theme/mantine/theme-effects/<name>.module.css`
7. Add overrides in `frontend/theme/theme-overrides.ts` if needed

### Add a utility

1. Create `utils/<name>.ts` — must be a pure function, no side effects
2. Export from `utils/index.ts`
3. Add tests in `utils/tests/<name>.test.ts`

### Add a bot adapter

1. Create `bot-<platform>/` at repo root
2. Add `package.json` with `@infini-dev-kit/bot-<platform>`
3. Implement `BotAdapter` from `bot-core/adapter-types.ts`
4. Add to `tsconfig.json` `include` array

## Dependency Direction (No Circular Imports)

```
utils/          ← everything can import from utils
  ↑
frontend/theme/ ← components, hooks, provider import from theme
  ↑
frontend/hooks/ ← components import from hooks
  ↑
frontend/provider/ ← components import from provider (for useThemeSnapshot)
  ↑
frontend/components/ ← leaf nodes, import from theme + hooks + provider

api-client/     ← standalone, no cross-imports
bot-core/       ← standalone, imports from utils only
bot-discord/    ← imports from bot-core only
bot-wechat/     ← imports from bot-core only
```

## Import Path Patterns (for components in frontend/components/)

```ts
// Theme types
import type { YourProps } from "../theme/motion-types";

// Theme snapshot (for dynamic values only)
import { useThemeSnapshot } from "../provider/InfiniProvider";

// Motion gating
import { useMotionAllowed, useFullMotion } from "../hooks/use-motion-allowed";

// Transition config
import { useThemeTransition } from "../hooks/use-theme-transition";

// Spring config
import { useThemeSpring } from "../hooks/use-theme-spring";

// Variants
import { getButtonVariants } from "../hooks/variants/button-variants";

// Theme spec types (rare — prefer useThemeSnapshot)
import type { ThemeId } from "../theme/theme-specs";
```

## Constraints

- **No `any`** — use `unknown` + narrowing
- **No unused code** — `noUnusedLocals` and `noUnusedParameters` enforced
- **No bundler config** — source-first, consumers bundle
- **No `.js` output** — only `.ts`/`.tsx` source files
- **No subdirectories inside `frontend/components/`** — keep flat
- **No mock/fallback paths** — let errors surface explicitly
- **No `@ts-ignore`** — fix the type, don't suppress it
- **Components must have a non-animated fallback** — check `useMotionAllowed()`

## Agent Workflow Rules

When modifying this codebase, you **must** follow these practices:

### Track every file you touch

- Before making changes, list all files you intend to modify.
- After making changes, verify every modified file compiles (`pnpm typecheck`).
- If you move or rename a file, search the entire codebase for imports referencing the old path and update them all. Use grep for `from ".*<old-filename>"` to find every reference.
- When adding a new export, update the relevant barrel `index.ts` file.

### Verify before declaring done

- Run `pnpm typecheck` — must show zero new errors.
- If you modified a component, confirm the barrel export in `frontend/components/index.ts` is correct.
- If you modified types in `motion-types.ts`, check that all components importing that type still compile.
- If you added a file, confirm it is included by `tsconfig.json` `include` globs.

### Keep files in sync

These files must stay consistent with each other:

| When you change... | Also update... |
|---------------------|---------------|
| A component file | `frontend/components/index.ts` barrel |
| Component props | `frontend/theme/motion-types.ts` |
| A theme spec | `frontend/theme/theme-specs.ts` registry, `theme-types.ts` ThemeId union |
| Theme overrides | `frontend/theme/theme-overrides.ts` |
| A hook file | `frontend/hooks/index.ts` barrel |
| A utility file | `utils/index.ts` barrel |
| Directory structure | `tsconfig.json` include, `package.json` exports, `AGENTS.md` file index, `README.md` architecture diagram |

### No orphaned files

- Every `.ts`/`.tsx` file must be reachable from a barrel `index.ts`.
- Every component must have its props defined in `motion-types.ts`.
- Every theme must be registered in `theme-specs.ts`.
- Delete files completely when removing — do not leave dead imports, empty re-exports, or commented-out references.

