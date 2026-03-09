# Changelog

All notable changes to Infini Dev Kit are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- **Architecture restructure** — flattened `frontend/` from 4 levels to 1-2 levels
  - `frontend/theme/` — unified theme system (specs, controller, Mantine adapter, ECharts adapter, motion contracts)
  - `frontend/components/` — 50 base components in one flat directory
  - `frontend/components/infini/` — dispatch wrappers (`InfiniButton`, `InfiniCard`) and dispatch hooks
  - `frontend/hooks/` — all motion hooks and variants
  - `frontend/provider/` — InfiniProvider, KitApp, ThemeToolbar
- **`colorScheme` on ThemeSpec** — each theme now declares `"light" | "dark"` directly; removed hardcoded `DARK_THEMES` set
- **Semantic Mantine color slots** — `infini-primary`, `infini-accent`, `infini-success`, `infini-warning`, `infini-danger` mapped to real theme colors; standard Mantine names (`red`, `green`, `blue`, `yellow`, `cyan`) aliased to match
- **Switch toggle states** — unchecked = danger (red), checked = success (green), via Mantine CSS variables (`--switch-bg`, `--switch-color`)
- **Canonical CSS variables** — `--infini-color-border`, `--infini-color-danger` emitted by theme system
- **i18n typography** — `ThemeTypography` restructured to `en`/`zh`/`ja` locale-specific font stacks with `weights`, `sizes`, `lineHeights`
- **`getThemeOverrides()` helper** — centralised scattered `if (themeId === "xxx")` checks into a single lookup (`frontend/theme/theme-overrides.ts`)
- **Workspace packages** for backend services:
  - `api-client/` — HTTP API client (extracted from `backend/`)
  - `bot-core/` — platform-agnostic bot framework (extracted from `bots/core/`)
  - `bot-discord/` — Discord.js adapter (extracted from `bots/discord/`)
  - `bot-wechat/` — Wechaty adapter (extracted from `bots/wechat/`)
- **74 base components + 2 dispatch wrappers** across 13 categories:
  - Buttons (7): MotionButton, DepthButton, ShimmerButton, LiquidButton, GlitchButton, ProgressButton, SocialButton
  - Cards (8): TiltCard, GlowCard, RevealCard, LayeredCard, FlipCard, CyberpunkCard, ChibiCard, NeuBrutalCard
  - Text (4): AnimatedText, GradientText, GlitchText, ShinyText
  - Data Display (11): NumberTicker, AnimatedCounter, ScrollProgress, RingsProgress, InfiniStatCard, InfiniTimeline, InfiniTable, InfiniDataGrid, InfiniCalendar, InfiniKanban, MediaGallery
  - Controls (9): DepthToggle, InfiniColorPicker, InfiniTagInput, InfiniDateRangePicker, InfiniForm, TipTapEditor, LayoutIndicator, AvailabilityGridEditor, ImageGridEditor
  - Layout (9): GlassEffect, Marquee, PageTransition, Parallax, StaggerList, InfiniAppShell, InfiniPageHeader, InfiniSplitView, InfiniResponsiveGrid
  - Effects (10): GlitchOverlay, RevealOnScroll, ScrollAnimationTrigger, CustomCursor, ImageComparison, ImageScanner, LampHeading, MagneticElement, InfiniConfetti, InfiniTransitionGroup
  - Backgrounds (6): BubbleBackground, GrainyBackground, RippleBackground, MorphingBlob, MatrixCodeRain, ParticleEffect
  - Code (2): AnimatedCodeBlock, Terminal
  - Borders (2): GlowBorder, GradientBorder
  - Navigation (3): AnimatedTabs, SelectStepper, CommandPalette
  - Feedback (3): Result, InfiniSkeleton, ErrorBoundary
- **Infini dispatch layer** — `InfiniButton`, `InfiniCard` auto-select delegate component based on active theme signals
- **Keyboard focus-visible accessibility** — global `:focus-visible` ring via CSS for all interactive elements
- **Theme-adaptive animation props** — extended 8 component interfaces with animation control props (entranceStyle, expandStyle, collapseStyle, etc.) with per-theme defaults

### Added (Props Refactor)
- **`forwardRef` on all components** — every exported component (except `ErrorBoundary` class component and `CommandPalette` modal portal) now accepts a forwarded `ref` via `React.forwardRef`
- **`{...rest}` spread on all components** — consumers can now pass `id`, `data-*`, `aria-*`, `role`, `tabIndex`, `onKeyDown`, and any other HTML attribute directly
- **`style` merge on all components** — consumer `style` prop is merged with computed styles (`{ ...computed, ...style }`) so inline overrides work
- **`className` merge via `clsx`** — consumer `className` is merged with internal classes
- **`MotionSafeProps<T>` type** — new helper type in `motion-types.ts` that omits Motion-conflicting React handlers (`onDrag`, `onDragStart`, `onDragEnd`, `onDragOver`, `onAnimationStart`, `onAnimationEnd`, `onAnimationIteration`) from `ComponentPropsWithoutRef<T>`
- **Shared base types** in `shared-types.ts` — `DivProps`, `ButtonProps`, `SpanProps`, `CanvasProps`, `FormProps`, `AnchorProps` (all Motion-safe)
- **Internal refs merged via `useMergedRef`** from `@mantine/hooks` — components with internal refs (e.g. `Parallax`, `MagneticElement`, `InfiniConfetti`) now correctly merge forwarded + internal refs
- **`onClick` upgraded to `MouseEventHandler`** — all `onClick?: () => void` signatures replaced with `MouseEventHandler<HTMLElement>` for proper event access
- **New component props:**
  - `InfiniCard` — `padding` prop (eliminates wrapper div boilerplate)
  - `InfiniButton` — `size` prop (`"sm" | "md" | "lg"`)
  - `GlitchButton` — `loading` prop
  - `LiquidButton` — `before` / `after` icon slots
  - `ProgressButton` — `before` / `after` icon slots
  - `SocialButton` — `loading` prop
- **New components:**
  - `InfiniForm` — generic forwardRef form wrapper with `.Field` and `.Submit` statics
  - `ImageGridEditor` — grid-based image editor control
  - `InfiniDataGrid` — generic data grid with sorting/pagination
  - `InfiniCalendar` — theme-aware calendar control
  - `InfiniKanban` — kanban board with drag support
  - `MediaGallery` — media gallery with image/video/audio support
  - `InfiniStatCard` — stat display card
  - `InfiniTimeline` — timeline component
  - `InfiniSkeleton` — skeleton loading placeholder
  - `InfiniAppShell` — app shell layout wrapper
  - `InfiniPageHeader` — page header with breadcrumbs
  - `InfiniSplitView` — resizable split pane layout
  - `InfiniResponsiveGrid` — responsive grid layout
  - `InfiniColorPicker` — color picker control
  - `InfiniTagInput` — tag input control
  - `InfiniDateRangePicker` — date range picker
  - `FlipCard` — 3D flip card
  - `RingsProgress` — ring progress indicator
  - `AvailabilityGridEditor` — availability grid editor
  - `TipTapEditor` — TipTap rich text editor wrapper
  - `SelectStepper` — step-by-step select wizard
  - `CommandPalette` — Cmd+K command palette modal

### Changed
- `frontend/package.json` exports updated to reflect new directory structure
- Dead `./compat` exports removed from `frontend/package.json`
- `tsconfig.json` now includes `api-client/`, `bot-core/`, `bot-discord/`, `bot-wechat/`
- Mantine adapter `resolveSelectRadius()`, `resolveCheckboxRadius()`, tag color mixing now use `getThemeOverrides()` instead of hardcoded `themeId` string checks
- `InfiniInput` and all theme-adaptive `Infini*` passthrough wrappers removed; consumers now use base motion components directly
- **Token rename** — `colorError` → `colorDanger` in `MantineThemeToken` and adapter for consistency with `ThemePalette.danger`
- **Typography access** — all consumers migrated from `typography.display` / `typography.body` / `typography.mono` to `typography.en.heading` / `typography.en.body` / `typography.en.mono`; legacy aliases removed from `ThemeTypography`
- **Motion config** — `hoverMs` → `hoverDuration`, `overshoot` → `bounce`; deprecated aliases removed from `ThemeMotionConfig`
- **ChibiCard whileTap** — removed `y: 0` snap (caused visible flash), now only `scale: 0.97`

### Removed
- **12 components that reimplemented Mantine** — replaced by direct Mantine usage:
  - MotionTooltip (use Mantine `Tooltip`)
  - ConfirmDialog (use `modals.openConfirmModal()`)
  - MotionAccordion (use Mantine `Accordion`)
  - SidebarCollapse (use Mantine `AppShell.Navbar`)
  - FloatingLabelInput (use Mantine `TextInput`)
  - MotionInputFrame (use Mantine `Input.Wrapper`)
  - HoverCard (use Mantine `HoverCard`)
  - LoadingSkeleton (use Mantine `Skeleton`)
  - ShimmerSkeleton (use Mantine `Skeleton`)
  - Statistic (unused)
  - MotionPagination (use Mantine `Pagination`)
  - ProgressRing (use Mantine `RingProgress`)
- **Legacy `theme-configs/` directory** — 7 dead files (index.ts + 6 theme configs), replaced by `composeMantineTheme()` pipeline
- **Backward-compat CSS variable aliases** — `--infini-border-color` and `--infini-color-error` removed; use `--infini-color-border` and `--infini-color-danger`
- **Legacy typography aliases** — `display`, `body`, `mono`, `displayWeight`, `bodyWeight` removed from `ThemeTypography`
- **Legacy motion aliases** — `hoverMs`, `overshoot` removed from `ThemeMotionConfig`
- **`portalConfirm()`** — removed from overlay service; use `modals.openConfirmModal()` directly
- Old `backend/` directory (replaced by `api-client/`)
- Old `bots/` directory (replaced by `bot-core/`, `bot-discord/`, `bot-wechat/`)
- Old nested structure: `frontend/react/motion/components/`, `frontend/theme-specs/`, `frontend/mantine/`, `frontend/echarts/`, `frontend/motion/`
- Duplicate `.js` files from `utils/` (only `.ts` source remains)

## [0.1.0] - 2025-05-01

### Added
- Initial release
- Theme system with 6 themes: default, chibi, cyberpunk, neu-brutalism, black-gold, red-gold
- Mantine adapter (`composeMantineTheme()`)
- ECharts adapter (`buildEChartsTheme()`)
- Motion contracts and spring profiles
- Overlay service (toast/confirm)
- HTTP API client with retry, auth, RFC 7807 error parsing
- Bot framework with Discord and WeChat adapters
- Shared utilities: color, a11y, id, storage, env, types, scroll, motion, view-transition
