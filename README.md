# Infini Dev Kit

Private monorepo TypeScript toolkit for building Infini ecosystem applications.

> **AI agents:** Read [`AGENTS.md`](./AGENTS.md) first — it has a machine-readable file index, import patterns, and modification guides.

## Quick Reference

| Package | Path | Purpose |
|---------|------|---------|
| `@infini-dev-kit/frontend` | `frontend/` | Theme system, 74 base components + 2 Infini dispatch wrappers, Mantine/ECharts adapters |
| `@infini-dev-kit/utils` | `utils/` | Color, storage, a11y, types (`Result<T,E>`, `Option<T>`), env |
| `@infini-dev-kit/api-client` | `api-client/` | HTTP API client with retry, auth, RFC 7807 errors |
| `@infini-dev-kit/bot-core` | `bot-core/` | Platform-agnostic bot framework |
| `@infini-dev-kit/bot-discord` | `bot-discord/` | Discord.js adapter |
| `@infini-dev-kit/bot-wechat` | `bot-wechat/` | Wechaty adapter |

## Prerequisites

- Node.js (ES2022 compatible)
- pnpm 10.29.1+
- TypeScript 5.8+

```bash
pnpm install
pnpm build      # type-check only (tsc --noEmit)
pnpm test       # vitest run
pnpm typecheck  # alias for build
```

## Architecture

```
infini-dev-kit/
├── frontend/                 # UI layer (@infini-dev-kit/frontend)
│   ├── theme/                # Theme system
│   │   ├── theme-types.ts    # ThemeSpec, ThemeId, all type definitions
│   │   ├── theme-specs.ts    # Theme registry + getThemeSpec()
│   │   ├── theme-controller.ts    # Headless state machine
│   │   ├── theme-provider-bridge.ts  # Orchestrator
│   │   ├── theme-overrides.ts # Per-theme component overrides
│   │   ├── motion-contracts.ts    # Motion intent → transition mapping
│   │   ├── motion-types.ts   # Component props + motion types
│   │   ├── spring-profiles.ts     # Spring physics presets
│   │   ├── mantine/          # Mantine theme adapter
│   │   ├── echarts/          # ECharts theme adapter
│   │   └── themes/           # 6 theme definitions
│   ├── components/           # 74 base components (categorized) + infini/ dispatch layer
│   │   ├── buttons/          # 7 button variants
│   │   ├── cards/            # 8 card variants
│   │   ├── text/             # 4 text effects
│   │   ├── data-display/     # 11 data display components
│   │   ├── controls/         # 9 form controls
│   │   ├── layout/           # 9 layout components
│   │   ├── effects/          # 10 visual effects
│   │   ├── backgrounds/      # 6 background effects
│   │   ├── code/             # 2 code display components
│   │   ├── borders/          # 2 border effects
│   │   ├── navigation/       # 3 navigation components
│   │   ├── feedback/         # 3 feedback components
│   │   └── infini/           # dispatch wrappers + dispatch hooks
│   ├── hooks/                # Motion hooks + variants/
│   ├── provider/             # InfiniProvider, KitApp, ThemeToolbar
│   ├── overlays/             # Toast/confirm service
│   └── tests/                # Vitest tests
├── api-client/               # HTTP API client
│   ├── api-client.ts         # createApiClient()
│   └── index.ts
├── bot-core/                 # Bot framework
│   ├── bot.ts                # createBot()
│   ├── adapter-types.ts      # BotAdapter interface
│   ├── middleware.ts          # Koa-style middleware
│   ├── command-router.ts     # Command routing
│   └── built-in/             # logger, rate-limit, filter, error-boundary
├── bot-discord/              # Discord.js adapter
├── bot-wechat/               # Wechaty adapter
├── utils/                    # Shared utilities
│   ├── color.ts              # WCAG contrast, hex↔rgb
│   ├── storage.ts            # Memory/localStorage/cookie adapters
│   ├── types.ts              # Result<T,E>, Option<T>, Brand<T,B>
│   └── ...
├── examples/                 # Theme showcase examples
├── package.json
└── tsconfig.json
```

---

## Frontend (`frontend/`)

Theme-driven UI layer with Mantine integration.

### Exports

| Path | Purpose |
|------|---------|
| `frontend/theme` | Theme specs, controller, Mantine/ECharts adapters, motion contracts |
| `frontend/components` | 74 base components + 2 Infini dispatch wrappers (all `forwardRef` + `{...rest}`) |
| `frontend/hooks` | Motion hooks (useMotionAllowed, useThemeSpring, useThemeTransition) |
| `frontend/provider` | InfiniProvider, KitApp, ThemeToolbar |
| `frontend/overlays` | Toast/confirm overlay service |

### Components (74 base + 2 wrappers)

All components use `forwardRef` + `{...rest}` spread + `style` merge + `className` merge via `clsx`. Props extend `MotionSafeProps<T>` (omits Motion-conflicting React handlers). Internal refs merged via `useMergedRef`.

**Buttons (7):** MotionButton, DepthButton, ShimmerButton, LiquidButton, GlitchButton, ProgressButton, SocialButton

**Cards (8):** TiltCard, GlowCard, RevealCard, LayeredCard, FlipCard, CyberpunkCard, ChibiCard, NeuBrutalCard

**Text (4):** AnimatedText, GradientText, GlitchText, ShinyText

**Data Display (11):** NumberTicker, AnimatedCounter, ScrollProgress, RingsProgress, InfiniStatCard, InfiniTimeline, InfiniTable, InfiniDataGrid, InfiniCalendar, InfiniKanban, MediaGallery

**Controls (9):** DepthToggle, InfiniColorPicker, InfiniTagInput, InfiniDateRangePicker, InfiniForm, TipTapEditor, LayoutIndicator, AvailabilityGridEditor, ImageGridEditor

**Layout (9):** GlassEffect, Marquee, PageTransition, Parallax, StaggerList, InfiniAppShell, InfiniPageHeader, InfiniSplitView, InfiniResponsiveGrid

**Effects (10):** GlitchOverlay, RevealOnScroll, ScrollAnimationTrigger, CustomCursor, ImageComparison, ImageScanner, LampHeading, MagneticElement, InfiniConfetti, InfiniTransitionGroup

**Backgrounds (6):** BubbleBackground, GrainyBackground, RippleBackground, MorphingBlob, MatrixCodeRain, ParticleEffect

**Code (2):** AnimatedCodeBlock, Terminal

**Borders (2):** GlowBorder, GradientBorder

**Navigation (3):** AnimatedTabs, SelectStepper, CommandPalette

**Feedback (3):** Result, InfiniSkeleton, ErrorBoundary

**Infini dispatch wrappers** (`components/infini/`): `InfiniButton`, `InfiniCard` (theme-based delegate selection).

### Available Themes

| Theme ID | Description |
|----------|-------------|
| `default` | Clean, professional defaults |
| `chibi` | Soft, rounded, pastel |
| `cyberpunk` | Dark, neon, glitch effects |
| `neu-brutalism` | Bold borders, offset shadows, raw |
| `black-gold` | Dark luxury, gold accents |
| `red-gold` | Imperial red with gold accents |

### Peer Dependencies

| Package | Version |
|---------|---------|
| `react` | `^19.0.0` |
| `react-dom` | `^19.0.0` |
| `@mantine/core` | `^7.17.8` |
| `@mantine/hooks` | `^7.17.8` |
| `@mantine/notifications` | `^7.17.8` |
| `motion` | `^12.23.24` |

---

## API Client (`api-client/`)

HTTP API client built on `fetch`.

```typescript
import { createApiClient } from "api-client";
```

| Option | Type | Purpose |
|--------|------|---------|
| `baseUrl` | `string` | Prepended to all request paths |
| `getAuthToken` | `() => string \| null` | Auto-injects `Authorization: Bearer` |
| `retry` | `Partial<RetryOptions>` | Default: 2 retries, GET/HEAD only |
| `timeoutMs` | `number` | Default 15000ms |
| `dedupe` | `boolean` | Optional GET in-flight dedupe for equivalent static requests |

Errors are `ApiClientError` with kind: `http`, `network`, `timeout`, `aborted`, `parse`.

---

## Bot Framework (`bot-core/`, `bot-discord/`, `bot-wechat/`)

Multi-platform bot framework using the adapter pattern.

```typescript
import { createBot } from "bot-core";
```

Built-in middleware: error-boundary, filter, logger, rate-limiter.

`createBot()` supports both middleware and plugin composition:
- `bot.use(async (ctx, next) => { ... })`
- `bot.use((bot) => () => cleanup())`

Command definitions support metadata for:
- `permissions`
- `cooldownMs`
- typed `args` schema (`string`, `number`, `boolean`, `user`, `channel`)

Adapter lifecycle events now include:
- `disconnect`
- `reconnecting`
- `reconnected`

| Package | Peer Dependency |
|---------|----------------|
| `@infini-dev-kit/bot-discord` | `discord.js ^14.16.0` |
| `@infini-dev-kit/bot-wechat` | `wechaty ^1.20.0` |

---

## Utils (`utils/`)

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

---

## Rules

1. **Type-check before commit.** `pnpm typecheck` — zero errors.
2. **No bundler config.** Source-first — consumers handle bundling.
3. **All exports through barrel files.** No internal path imports.
4. **No `any`.** Use `unknown` + type narrowing.
5. **Base components go flat in `frontend/components/`.** The only subdirectory is `infini/` (auto-dispatch wrappers).
6. **Theme specs are data.** No runtime logic in theme files.
7. **No mock/simulation paths.** Let failures surface explicitly.
8. **No circular imports.** `utils` ← everything else.

## License

[MIT](./LICENSE)
