# Changelog

All notable changes to Infini Dev Kit are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- **Architecture restructure** — flattened `frontend/` from 4 levels to 1-2 levels
  - `frontend/theme/` — unified theme system (specs, controller, Mantine adapter, ECharts adapter, motion contracts)
  - `frontend/components/` — all 44 components in one flat directory
  - `frontend/hooks/` — all motion hooks and variants
  - `frontend/provider/` — InfiniProvider, KitApp, ThemeToolbar
- **`getThemeOverrides()` helper** — centralised scattered `if (themeId === "xxx")` checks into a single lookup (`frontend/theme/theme-overrides.ts`)
- **Workspace packages** for backend services:
  - `api-client/` — HTTP API client (extracted from `backend/`)
  - `bot-core/` — platform-agnostic bot framework (extracted from `bots/core/`)
  - `bot-discord/` — Discord.js adapter (extracted from `bots/discord/`)
  - `bot-wechat/` — Wechaty adapter (extracted from `bots/wechat/`)
- **44 motion components** (42 from previous sessions + Result, Statistic merged in):
  - Buttons: MotionButton, DepthButton, ShimmerButton, LiquidButton, GlitchButton, ProgressButton, SocialButton
  - Cards: TiltCard, GlowCard, RevealCard, LayeredCard, CyberpunkCard
  - Text: AnimatedText, GradientText, GlitchText, AnimatedCounter
  - Backgrounds: BubbleBackground, GrainyBackground, RippleBackground, MorphingBlob, MatrixCodeRain
  - Layout: Marquee, Terminal, ScrollProgress, Parallax, PageTransition, ImageComparison, ImageScanner, AnimatedCodeBlock, StaggerList, RevealOnScroll, ScrollAnimationTrigger
  - Effects: GlitchOverlay, GlassEffect, GlowBorder, LampHeading, LoadingSkeleton, ShimmerSkeleton, LayoutIndicator, MagneticElement, CustomCursor
  - Data: Statistic, Result, MotionInputFrame

### Changed
- `frontend/package.json` exports updated to reflect new directory structure
- Dead `./compat` exports removed from `frontend/package.json`
- `tsconfig.json` now includes `api-client/`, `bot-core/`, `bot-discord/`, `bot-wechat/`
- Mantine adapter `resolveSelectRadius()`, `resolveCheckboxRadius()`, tag color mixing now use `getThemeOverrides()` instead of hardcoded `themeId` string checks

### Removed
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
