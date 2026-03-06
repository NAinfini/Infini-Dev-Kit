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
- **50 motion components** (original 60 minus 12 removed reimplementations + 2 new cards):
  - Buttons: MotionButton, DepthButton, ShimmerButton, LiquidButton, GlitchButton, ProgressButton, SocialButton
  - Cards: TiltCard, GlowCard, RevealCard, LayeredCard, CyberpunkCard, ChibiCard, NeuBrutalCard
  - Text: AnimatedText, GradientText, GlitchText, AnimatedCounter, NumberTicker, ShinyText
  - Inputs/Forms: AnimatedTabs
  - Navigation: MotionBreadcrumb, MotionStepper
  - Feedback: MotionToast, Result
  - Backgrounds: BubbleBackground, GrainyBackground, RippleBackground, MorphingBlob, MatrixCodeRain, ParticleEffect
  - Layout: Marquee, Terminal, ScrollProgress, Parallax, PageTransition, ImageComparison, ImageScanner, AnimatedCodeBlock, StaggerList, RevealOnScroll, ScrollAnimationTrigger
  - Effects: GlitchOverlay, GlassEffect, GlowBorder, GradientBorder, LampHeading, LayoutIndicator, MagneticElement, CustomCursor
- **Infini dispatch layer** — `InfiniButton`, `InfiniCard` auto-select delegate component based on active theme signals
- **Keyboard focus-visible accessibility** — global `:focus-visible` ring via CSS for all interactive elements
- **Theme-adaptive animation props** — extended 8 component interfaces with animation control props (entranceStyle, expandStyle, collapseStyle, etc.) with per-theme defaults

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
