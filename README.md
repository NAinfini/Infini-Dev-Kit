# Infini Dev Kit

Private pnpm workspace monorepo — TypeScript toolkit for building Infini ecosystem applications.

> **AI agents:** Read [`AGENTS.md`](./AGENTS.md) first — it has a machine-readable file index, import patterns, and modification guides.

## Quick Start

### Installation

```bash
pnpm install
```

Import via workspace package names:

```typescript
import { DepthButton, TiltCard } from "@infini-dev-kit/react";
import { getThemeSpec, buildScopedCssVariables } from "@infini-dev-kit/theme-core";
import { composeMantineTheme } from "@infini-dev-kit/adapter-mantine";
import { buildShadcnVariables } from "@infini-dev-kit/adapter-shadcn";
import { buildMuiTheme } from "@infini-dev-kit/adapter-mui";
import { buildAntdTheme } from "@infini-dev-kit/adapter-antd";
import { buildRadixThemeProps } from "@infini-dev-kit/adapter-radix";
import { createApiClient } from "@infini-dev-kit/api-client";
import { contrastRatio } from "@infini-dev-kit/utils";
```

### Theme Setup (Mantine)

```tsx
import { createThemeProviderBridge } from "@infini-dev-kit/theme-core";
import { MantineProvider } from "@mantine/core";

const bridge = createThemeProviderBridge({ defaultTheme: "default" });

function App() {
  return (
    <MantineProvider theme={bridge.mantineTheme}>
      <YourApp />
    </MantineProvider>
  );
}
```

### Theme Setup (Other Frameworks)

```tsx
// shadcn/ui — pure CSS variables, no framework dependency
import { buildShadcnVariables, infiniTailwindPreset } from "@infini-dev-kit/adapter-shadcn";

// MUI
import { buildMuiTheme } from "@infini-dev-kit/adapter-mui";
const theme = createTheme(buildMuiTheme("cyberpunk"));

// Ant Design
import { buildAntdTheme } from "@infini-dev-kit/adapter-antd";
<ConfigProvider theme={buildAntdTheme("cyberpunk")} />

// Radix Themes
import { buildRadixThemeProps, buildRadixCssOverrides } from "@infini-dev-kit/adapter-radix";
<Theme {...buildRadixThemeProps("cyberpunk")} style={buildRadixCssOverrides("cyberpunk")} />
```

**Available Themes**: `default`, `chibi`, `cyberpunk`, `neu-brutalism`, `black-gold`, `red-gold`
**Motion Levels**: `off`, `minimum`, `reduced`, `full`

### Components

```tsx
import { DepthButton, TiltCard } from "@infini-dev-kit/react";

<TiltCard>
  <DepthButton type="primary" onClick={handleClick}>Click Me</DepthButton>
</TiltCard>
```

### API Client

```tsx
import { createApiClient } from "@infini-dev-kit/api-client";

const client = createApiClient({
  baseUrl: "https://api.example.com",
  getAuthToken: () => localStorage.getItem("token"),
});

const users = await client.request<User[]>({ method: "GET", path: "/users" });
```

### Bot Framework

```tsx
import { createBot } from "@infini-dev-kit/bot-core";
import { createDiscordAdapter } from "@infini-dev-kit/bot-discord";

const bot = createBot({
  adapter: createDiscordAdapter({ token: process.env.DISCORD_TOKEN }),
});
bot.command("/hello", async (ctx) => ctx.reply("Hello!"));
await bot.start();
```

## Documentation

- **[QUICK-START.md](./docs/QUICK-START.md)** — Getting started guide
- **[THEMING.md](./docs/THEMING.md)** — Theme customization guide
- **[TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** — Common issues and solutions
- **[CHANGELOG.md](./CHANGELOG.md)** — Version history and breaking changes

## Package Reference

| Package | Path | Purpose |
|---------|------|---------|
| `@infini-dev-kit/theme-core` | `packages/theme-core/` | Framework-agnostic theme system (ThemeSpec, CSS variables, fonts, motion) |
| `@infini-dev-kit/adapter-mantine` | `packages/adapter-mantine/` | ThemeSpec → Mantine theme config |
| `@infini-dev-kit/adapter-shadcn` | `packages/adapter-shadcn/` | ThemeSpec → shadcn/Tailwind CSS variables (HSL) |
| `@infini-dev-kit/adapter-mui` | `packages/adapter-mui/` | ThemeSpec → MUI `createTheme()` options |
| `@infini-dev-kit/adapter-antd` | `packages/adapter-antd/` | ThemeSpec → Ant Design v5 design tokens |
| `@infini-dev-kit/adapter-radix` | `packages/adapter-radix/` | ThemeSpec → Radix Themes props + CSS overrides |
| `@infini-dev-kit/react` | `packages/react/` | 71 base components, hooks, motion utilities |
| `@infini-dev-kit/utils` | `packages/utils/` | Color, storage, a11y, types (`Result<T,E>`, `Option<T>`), env |
| `@infini-dev-kit/api-client` | `packages/api-client/` | HTTP API client with retry, auth, RFC 7807 errors |
| `@infini-dev-kit/bot-core` | `packages/bot-core/` | Platform-agnostic bot framework |
| `@infini-dev-kit/bot-discord` | `packages/bot-discord/` | Discord.js adapter |
| `@infini-dev-kit/bot-wechat` | `packages/bot-wechat/` | Wechaty adapter |

## Prerequisites

- Node.js (ES2022 compatible)
- pnpm 10.29.1+
- TypeScript 5.8+

```bash
pnpm install
pnpm typecheck  # tsc --noEmit across all packages
pnpm test       # vitest run
pnpm build      # tsc build across all packages
```

## Architecture

```
infini-dev-kit/
├── packages/
│   ├── theme-core/              # Framework-agnostic theme system
│   │   ├── theme-types.ts       # ThemeSpec, ThemeId, all type definitions
│   │   ├── theme-specs.ts       # Theme registry + getThemeSpec()
│   │   ├── theme-controller.ts  # Headless state machine
│   │   ├── theme-provider-bridge.ts  # Orchestrator
│   │   ├── motion-contracts.ts  # Motion intent → transition mapping
│   │   ├── spring-profiles.ts   # Spring physics presets
│   │   ├── tokens/              # CSS variable generation, font loading
│   │   ├── echarts/             # ECharts theme adapter
│   │   └── themes/              # 6 theme definitions
│   ├── adapter-mantine/         # ThemeSpec → Mantine theme config
│   ├── adapter-shadcn/          # ThemeSpec → shadcn/Tailwind CSS vars (HSL)
│   ├── adapter-mui/             # ThemeSpec → MUI createTheme() options
│   ├── adapter-antd/            # ThemeSpec → Ant Design v5 tokens
│   ├── adapter-radix/           # ThemeSpec → Radix Themes props
│   ├── react/                   # 71 base components + hooks + motion
│   │   ├── components/          # All UI components
│   │   ├── hooks/               # Motion hooks + variants
│   │   └── tests/               # Vitest tests
│   ├── utils/                   # Shared pure utilities
│   ├── api-client/              # HTTP API client
│   ├── bot-core/                # Platform-agnostic bot framework
│   ├── bot-discord/             # Discord.js adapter
│   └── bot-wechat/              # Wechaty adapter
├── pnpm-workspace.yaml
├── tsconfig.base.json           # Shared TS config with path aliases
└── package.json                 # Root workspace scripts
```

---

## Adapter Pattern

The theme system is split into a framework-agnostic core (`theme-core`) and per-framework adapters. Each adapter transforms `ThemeSpec` into the target framework's theme format.

| Adapter | Output | Peer Dependency |
|---------|--------|----------------|
| `adapter-mantine` | `MantineThemeOverride` + CSS variables | `@mantine/core ^8.0.0` |
| `adapter-shadcn` | HSL CSS variables + Tailwind preset | none (pure CSS) |
| `adapter-mui` | MUI `ThemeOptions` for `createTheme()` | `@mui/material ^6.0.0` |
| `adapter-antd` | Ant Design v5 seed + component tokens | `antd ^5.0.0` |
| `adapter-radix` | Radix `<Theme>` props + CSS overrides | `@radix-ui/themes ^3.0.0` |

---

## React Components (`packages/react/`)

71 base components + hooks. All use `forwardRef` + `{...rest}` spread + `style`/`className` merge via `clsx`.

**Buttons (3):** DepthButton, ProgressButton, SocialButton
**Cards (8):** TiltCard, GlowCard, RevealCard, LayeredCard, FlipCard, CyberpunkCard, ChibiCard, NeuBrutalCard
**Text (4):** AnimatedText, GradientText, GlitchText, ShinyText
**Data Display (11):** NumberTicker, AnimatedCounter, ScrollProgress, RingsProgress, InfiniStatCard, InfiniTimeline, InfiniTable, InfiniDataGrid, InfiniCalendar, InfiniKanban, MediaGallery
**Controls (9):** DepthToggle, InfiniColorPicker, InfiniTagInput, InfiniDateRangePicker, InfiniForm, TipTapEditor, LayoutIndicator, AvailabilityGridEditor, ImageGridEditor
**Layout (9):** GlassEffect, Marquee, PageTransition, Parallax, StaggerList, InfiniAppShell, InfiniPageHeader, InfiniSplitView, InfiniResponsiveGrid
**Effects (11):** GlitchOverlay, PowerGlitch, RevealOnScroll, ScrollAnimationTrigger, CustomCursor, ImageComparison, ImageScanner, LampHeading, MagneticElement, InfiniConfetti, InfiniTransitionGroup
**Backgrounds (6):** BubbleBackground, GrainyBackground, RippleBackground, MorphingBlob, MatrixCodeRain, ParticleEffect
**Code (2):** AnimatedCodeBlock, Terminal
**Borders (2):** GlowBorder, GradientBorder
**Navigation (3):** AnimatedTabs, SelectStepper, CommandPalette
**Feedback (3):** Result, InfiniSkeleton, ErrorBoundary

---

## API Client (`packages/api-client/`)

```typescript
import { createApiClient } from "@infini-dev-kit/api-client";
```

| Option | Type | Purpose |
|--------|------|---------|
| `baseUrl` | `string` | Prepended to all request paths |
| `getAuthToken` | `() => string \| null` | Auto-injects `Authorization: Bearer` |
| `retry` | `Partial<RetryOptions>` | Default: 2 retries, GET/HEAD only |
| `timeoutMs` | `number` | Default 15000ms |
| `dedupe` | `boolean` | Optional GET in-flight dedupe |

Errors are `ApiClientError` with kind: `http`, `network`, `timeout`, `aborted`, `parse`.

---

## Bot Framework (`packages/bot-core/`, `bot-discord/`, `bot-wechat/`)

```typescript
import { createBot } from "@infini-dev-kit/bot-core";
```

Built-in middleware: error-boundary, filter, logger, rate-limiter.

| Package | Peer Dependency |
|---------|----------------|
| `@infini-dev-kit/bot-discord` | `discord.js ^14.16.0` |
| `@infini-dev-kit/bot-wechat` | `wechaty ^1.20.0` |

---

## Utils (`packages/utils/`)

Shared pure utilities. No framework dependencies.

| Module | Key Exports |
|--------|-------------|
| `color.ts` | `contrastRatio()`, `readableTextColor()`, hex↔RGB |
| `error.ts` | `toError()` — coerce unknown to Error |
| `id.ts` | `createRequestId()`, `createTraceId()`, `createSpanId()` |
| `lru-map.ts` | `LRUMap<K,V>` — bounded LRU cache |
| `storage.ts` | `memoryStorage()`, `browserStorage()`, `cookieStorage()` |
| `types.ts` | `Result<T,E>`, `Option<T>`, `Brand<T,B>`, `DeepPartial<T>` |
| `a11y.ts` | Focus-visible tracking, motion reduction |
| `env.ts` | Environment detection |
| `motion.ts` | Motion mode detection |
| `scroll.ts` | Scroll lock, smooth scroll |
| `view-transition.ts` | View Transition API wrapper |

## Rules

1. **Type-check before commit.** `pnpm typecheck` — zero errors.
2. **No bundler config.** Source-first — consumers handle bundling.
3. **All exports through barrel `index.ts` files.** No internal path imports.
4. **No `any`.** Use `unknown` + type narrowing.
5. **Theme specs are data.** No runtime logic in theme files.
6. **No mock/simulation paths.** Let failures surface explicitly.
7. **No circular imports.** Dependency direction: `utils` ← `theme-core` ← `adapter-*` ← `react`.
8. **Adapters are pure mapping layers.** Framework libs are peerDependencies only.

## License

[MIT](./LICENSE)
