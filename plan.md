# Comprehensive Audit: Infini Demo + Dev Kit

## Context

CSS override cleanup (R9) is mostly done — `hashed: false` + `cssVar: true` on ConfigProvider, shadow tokens added to adapter. This audit covers remaining bugs, structural issues, missing features, and Demo→DevKit migration opportunities found by reading every file in both repos.

---

## 1. Split ThemeLab.tsx (970 lines → ~10 files)

**File:** `Infini-Demo/src/pages/ThemeLab.tsx`

### What to do
Extract each of the 9 zones into its own component. Move the 12 data constants (`TABLE_DATA`, `CASCADER_OPTIONS`, `TREE_SELECT_OPTIONS`, `TRANSFER_ITEMS`, `COLLAPSE_ITEMS`, `TIMELINE_ITEMS`, `DESCRIPTION_ITEMS`, `TREE_ITEMS`, `MENU_ITEMS`, `DEMO_IMAGE_SRC`, `PALETTE_KEYS`, `MOTION_INTENTS`) into a shared data file.

### How to do it

Create `src/pages/theme-lab/` directory with:

| File | Source lines | Content |
|------|-------------|---------|
| `data.ts` | 56-180 | All `const` arrays + `ZONE_COUNT`, `wcagLabel()` |
| `ZoneHero.tsx` | 298-321 | Theme name, description, signatures |
| `ZoneFoundation.tsx` | 323-379 | Color palette grid + typography scale |
| `ZoneControls.tsx` | 381-460 | Buttons, inputs, form controls (switch/checkbox/radio/slider/rate/datepicker/progress/segmented) |
| `ZoneData.tsx` | 462-526 | Table, tabs+badges, navigation (breadcrumb/steps) |
| `ZoneFeedback.tsx` | 528-579 | Alerts, overlays (modal/drawer/toast), loading+empty states |
| `ZoneGallery.tsx` | 581-728 | Expanded components (4 gallery groups) |
| `ZoneCharts.tsx` | 730-750 | Lazy-loaded ECharts (already a separate `ThemeCharts.tsx`, just wrap the Suspense) |
| `ZoneMotion.tsx` | 752-879 | Motion playground (4 cards) + contracts table |
| `ZoneInternals.tsx` | 881-966 | Primitives grid + control styles grid |
| `ThemeLab.tsx` | new | Thin shell: manages `revealedZones`/`zoneRefs` state, renders all zones |
| `index.ts` | new | `export { ThemeLab } from "./ThemeLab"` |

Each zone component receives a shared props type:
```ts
interface ZoneProps {
  zoneIndex: number;
  revealed: boolean;
  setRef: (node: HTMLElement | null) => void;
  animationStyle: CSSProperties;
}
```

Plus `useThemeSnapshot()` called inside each zone (simpler than prop-drilling the full snapshot).

### What to consider
- `revealedZones` array + `zoneRefs` + IntersectionObserver logic stays in the parent `ThemeLab.tsx` shell — it needs to coordinate across all zones
- `ZoneFeedback` owns its own `modalOpen`, `drawerOpen`, `notification.useNotification()` state — fully self-contained
- `ZoneMotion` owns `playVisible`, `playSlideIn`, `playOverlayOpen`, `isPressingDemo` state
- `ZoneGallery` owns `transferTargetKeys`, `showGallerySkeleton`, `menuSelection` state
- CSS stays in `ThemeLab.css` unchanged — all selectors use `.theme-lab` prefix which still works
- Update `src/pages/index.ts` to re-export from `./theme-lab` instead of `./ThemeLab`

### What could go wrong
- **Import path changes**: `pages/index.ts` currently exports `ThemeLab` from `"./ThemeLab"`. After moving to `theme-lab/`, update to `"./theme-lab"`. `App.tsx` imports from `"./pages"` so it won't break.
- **CSS class scoping**: All CSS uses `.theme-lab` parent selector. As long as the root `<div className="theme-lab">` stays in the shell, child components inherit styling correctly.
- **Ref forwarding**: Zone components need to accept the `ref` callback for IntersectionObserver. Use the `setRef` prop pattern (already used in current code at line 286-288) rather than `forwardRef`.

---

## 2. Remaining CSS Fixes

**File:** `Infini-Demo/src/theme-depth.css`

### 2a. Remaining !important audit

#### What to do
With `hashed: false` now active, all `[data-theme-id] .ant-*` selectors beat antd's `:where()`-wrapped output. Scan theme-depth.css for any remaining non-motion `!important`.

#### Current state
theme-depth.css has **2** `!important` declarations:
- Line 502: `transition: none !important` — inside `@media (prefers-reduced-motion: reduce)`. **Keep** — legitimate a11y.
- Line 510: `transform: none !important` — inside `@media (prefers-reduced-motion: reduce)`. **Keep** — legitimate a11y.

theme-motion.css has **~18** `!important` — all in motion-reduced/motion-off blocks (lines 503-567). **Keep all** — legitimate a11y.

ThemeLab.css line 606: `transform: none !important` in `.theme-lab-motion-reduced`. **Keep** — legitimate a11y.

**Result: No non-motion `!important` remains. This step is already done.**

### 2b. Redundant CSS overrides (tokens now handle)

#### What to do
Compare each `[data-theme-id] .ant-*` rule in theme-depth.css against the tokens already set in `antd-adapter.ts`. If a token sets the same value, the CSS rule is redundant.

#### Rules that are now redundant (safe to remove)

| Lines | Selector | Property | Token that handles it |
|-------|----------|----------|-----------------------|
| 15-17 | `[data-theme-id="default"] .ant-btn` | `box-shadow` | `Button.boxShadow` in base |
| 19-21 | `[data-theme-id="default"] .ant-card` | `box-shadow` | Already set via `theme.foundation.shadow` |

#### Rules that MUST stay (CSS-only effects, no token equivalent)

| Lines | Theme | What | Why no token |
|-------|-------|------|-------------|
| 23-29 | chibi | `.ant-btn-primary` border + background + shadow | Compound: 2px border + specific color + shadow combo. Token sets `colorPrimary` but CSS adds the border style. |
| 31-39 | chibi | `.ant-btn-primary:active/:hover` | State-specific transforms + shadow changes |
| 41-61 | chibi | `.ant-btn-default`, `.ant-btn-dashed` | Border + shadow styling not fully tokenizable |
| 63-67 | chibi | `.ant-input` etc. | `inset` box-shadow — no Input `boxShadow` token in antd |
| 69-71 | chibi | `.ant-card` | Shadow — Card has no `boxShadow` token |
| 73-75 | chibi | `.ant-switch` | Shadow — Switch has no `boxShadow` token |
| 77-79 | cyberpunk | `.ant-btn-primary` | `text-shadow` — no token |
| 81-83 | cyberpunk | `.ant-btn-primary:hover` | Neon glow box-shadow on hover — state-specific |
| 85-110 | cyberpunk | card/input/switch/focus | Background rgba, neon borders, glow shadows — partially tokenizable but CSS handles hover/focus states |
| 112-118 | cyberpunk | table thead, modal | `text-shadow`, `backdrop-filter` — no tokens |
| 121-175 | neu-brutalism | all buttons/inputs/cards/switch/table | Thick borders + offset shadows + hover transforms — CSS-only |
| 181-216 | black-gold | btn gradient, card clip-path, input/switch | `linear-gradient()`, `clip-path` — no tokens |
| 218-230 | red-gold | btn/input shadows | State-specific hover shadows |
| 232-378 | all themes | dropdown/popup/avatar/float-btn/menu/divider | Popup-specific styling, compound selectors |
| 380-493 | all themes | background patterns, decorative pseudo-elements | Demo visual flourishes |

#### What to consider
- Most CSS overrides in theme-depth.css are for effects that **cannot** be expressed as antd tokens (gradients, text-shadow, backdrop-filter, clip-path, state-specific transforms, compound border+shadow combos)
- Only ~2 rules are truly redundant (default theme btn/card shadows)
- The bulk of theme-depth.css is legitimate CSS-only styling

#### What could go wrong
- Removing the default theme shadows (lines 15-21) could cause a subtle visual regression if the token value doesn't exactly match. Verify visually before committing.

---

## 3. Missing Antd Components in ThemeLab

**File:** `Infini-Demo/src/pages/ThemeLab.tsx` (or zone files after split)

### What to do
Add ~8 commonly-used antd components not yet showcased. Each tests distinct styling tokens.

### Components to add

| Component | Zone | What to show | Antd adapter token needed? |
|-----------|------|-------------|---------------------------|
| `InputNumber` | Controls | One default + one with min/max | No — inherits Input tokens |
| `AutoComplete` | Controls | One with placeholder + options | No — inherits Select tokens |
| `TimePicker` | Controls | One default (pairs with DatePicker) | No — inherits DatePicker tokens |
| `Dropdown` | Data | Button with dropdown menu | No — inherits Menu tokens |
| `Statistic` | Data | Two side-by-side (value + suffix) | Yes — add `Statistic` tokens to adapter |
| `Upload` | Gallery | Dragger variant (no actual upload) | No — inherits Button tokens |
| `QRCode` | Gallery | One with theme primary color | Yes — add `QRCode` tokens to adapter |
| `Tour` | Feedback | Button that triggers a 2-step tour | No — inherits Popover tokens |

### How to do it
For each component, add a minimal instance inside the appropriate zone. Example for InputNumber in ZoneControls:
```tsx
<InputNumber className="demo-control-motion" placeholder="Number" min={0} max={100} />
```

For Statistic and QRCode, add component tokens to `antd-adapter.ts` `buildComponentTokens()`:
```ts
// In base object:
Statistic: {
  colorTextHeading: theme.palette.text,
  colorTextDescription: theme.palette.textMuted,
},
QRCode: {
  colorBorder: safeBorder,
  borderRadiusLG: theme.foundation.radius,
},
```

### What to consider
- Don't add Upload with actual file handling — use `beforeUpload={() => false}` to prevent real uploads
- Tour needs ref targets — attach to existing buttons in the zone rather than creating new elements
- Keep each addition to 1-3 lines of JSX

### What could go wrong
- **Bundle size**: Each new antd component import adds to the bundle. InputNumber, AutoComplete, TimePicker are lightweight. QRCode pulls in a canvas library — verify it's acceptable.
- **Tour z-index**: Tour overlay may conflict with the cyberpunk scanline `::after` pseudo-element (z-index: 9999 at theme-depth.css line 385). May need to lower the scanline z-index.

---

## 4. Feature Additions

### 4a. Click-to-copy token values

**File:** `Infini-Demo/src/pages/ThemeLab.tsx` (or `ZoneFoundation.tsx` after split)

#### What to do
Add click-to-copy on palette swatches (hex value) and motion contract table cells.

#### How to do it
Add an `onClick` handler to `.swatch-color` divs:
```tsx
<div
  className="swatch-color"
  style={{ background: color, color: textColor }}
  onClick={() => navigator.clipboard.writeText(color)}
  title={`Click to copy ${color}`}
  role="button"
  tabIndex={0}
>
```

Add brief visual feedback via a `copied` state or CSS `:active` flash.

#### What to consider
- `navigator.clipboard.writeText()` requires secure context (HTTPS or localhost) — works in dev, works in production
- Don't add a toast for every copy — a subtle CSS `:active` opacity change is enough
- Add `cursor: pointer` to `.swatch-color` in ThemeLab.css

#### What could go wrong
- Firefox may block clipboard in some contexts. Wrap in try/catch with silent failure.

### 4b. Theme comparison view

#### What to do
Add a split-screen mode to ThemeLab that renders two themes side-by-side.

#### What to consider
- This is a significant feature — requires rendering two `ConfigProvider` instances with different themes
- Defer to a future round. Not worth the complexity right now.
- **Recommendation: Skip for now.**

### 4c. Token inspector panel

#### What to do
Add a collapsible panel at the bottom of ThemeLab showing the raw theme spec JSON.

#### How to do it
Use antd `Collapse` with a single panel containing `<pre>{JSON.stringify(theme, null, 2)}</pre>` styled with the mono font.

#### What to consider
- Simple to implement, useful for dev kit consumers
- Add after the ThemeLab split (put it in ZoneInternals or as a new zone)

---

## 5. Dev Kit: API Gaps & Missing Functionality

**Files:** `Infini-Dev-Kit/frontend/index.ts`, `Infini-Dev-Kit/utils/index.ts`

### 5a. Exports audit

All modules are properly re-exported. `frontend/index.ts` exports 15 modules. `utils/index.ts` exports 7 modules. No gaps.

### 5b. Missing `antd-variables.ts` and `primitive-builders.ts` dedicated tests

**Files:** `Infini-Dev-Kit/frontend/antd-variables.ts`, `Infini-Dev-Kit/frontend/primitive-builders.ts`

#### What to do
These two modules have no dedicated test files. They may be covered transitively by `primitives.test.ts` and `antd-adapter.test.ts`, but should have their own tests.

#### How to do it
Create `frontend/tests/antd-variables.test.ts`:
- Test `buildScopedCssVariables()` returns expected CSS variable names for each theme
- Test `buildScopedThemeClass()` returns a valid class string

Create `frontend/tests/primitive-builders.test.ts`:
- Test each builder function produces valid `PrimitiveBoxStyle` objects
- Test edge cases (missing optional fields)

#### What to consider
- Run `npx vitest --coverage` first to see if these are already covered transitively
- Only add tests for uncovered paths

#### What could go wrong
- If builders are tightly coupled to theme specs, tests may be brittle. Use snapshot tests sparingly.

---

## 6. Code Migration: Demo → Dev Kit

### 6a. Scroll-reactive CSS variable utility

**From:** `Infini-Demo/src/App.tsx` lines 21-41
**To:** `Infini-Dev-Kit/utils/scroll.ts` (new file)

#### What to do
Extract the scroll→CSS variable sync pattern into a reusable utility.

#### How to do it
```ts
export function createScrollReactiveVar(options?: {
  property?: string;       // default: "--scroll-y"
  target?: HTMLElement;    // default: document.documentElement
}): () => void {
  const prop = options?.property ?? "--scroll-y";
  const el = options?.target ?? document.documentElement;
  const sync = () => el.style.setProperty(prop, window.scrollY.toFixed(2));
  sync();
  window.addEventListener("scroll", sync, { passive: true });
  return () => {
    window.removeEventListener("scroll", sync);
    el.style.removeProperty(prop);
  };
}
```

Then in Demo's `App.tsx`, replace lines 21-41 with:
```ts
import { createScrollReactiveVar } from "@infini-dev-kit/utils/scroll";
// inside useEffect:
return createScrollReactiveVar();
```

#### What to consider
- Add to `utils/index.ts` barrel export
- Add `utils/scroll.test.ts` — mock `window.scrollY` and verify CSS property is set
- The Demo still needs the conditional check (`hasScrollReactiveTheme && motion.effectiveMode === "full"`) — that stays in App.tsx

#### What could go wrong
- SSR environments: `window` and `document` don't exist. Guard with `typeof window !== "undefined"` check.

### 6b. View Transition wrapper

**From:** `Infini-Demo/src/App.tsx` lines 84-104
**To:** `Infini-Dev-Kit/utils/view-transition.ts` (new file)

#### What to do
Extract the `startViewTransition` wrapper with fallback.

#### How to do it
```ts
export function startViewTransition(update: () => void): void {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> };
  };
  if (typeof doc.startViewTransition === "function") {
    try { doc.startViewTransition(update); return; } catch { /* fallback */ }
  }
  update();
}
```

Then in Demo's `App.tsx`, replace lines 84-104 with:
```ts
import { startViewTransition } from "@infini-dev-kit/utils/view-transition";
// in handleThemeChange:
if (!allowAnimatedThemeTransition) { applyTheme(); return; }
startViewTransition(applyTheme);
```

#### What to consider
- Add to `utils/index.ts` barrel export
- The `ViewTransitionCapableDocument` type in App.tsx becomes unnecessary after migration
- Add `utils/view-transition.test.ts` — mock `document.startViewTransition`

#### What could go wrong
- Nothing significant — the fallback is just calling `update()` directly.

### 6c. Theme motion keyframes

**From:** `Infini-Demo/src/theme-motion.css` lines 1-224 (keyframe definitions)
**Decision: Keep in Demo.**

#### Why not migrate
- Dev Kit is pure TypeScript — no CSS files shipped
- Keyframes are tightly coupled to Demo's specific animation choreography (stagger-in, reveal, page transitions)
- Consumers would need different keyframes for their own UIs
- Moving them adds packaging complexity for minimal reuse value

#### What to consider
- If a future consumer needs the same keyframes, they can copy from the Demo as a reference
- The keyframe *names* are referenced in theme-motion.css rules (e.g., `animation-name: chibi-bounce-in`) — they're not standalone

---

## 7. File Structure Assessment

### Demo structure — no changes needed (beyond §1 split)
```
src/
  App.tsx           — shell + routing + scroll/transition logic
  main.tsx          — entry point
  index.css         — global resets, view-transition, scrollbar
  theme-depth.css   — per-theme antd component overrides (~510 lines)
  theme-motion.css  — keyframes + motion/a11y overrides (~568 lines)
  pages/
    ThemeLab.tsx    — needs splitting (§1)
    ThemeLab.css    — zone/section layout styles
    ThemeCharts.tsx — lazy-loaded ECharts (clean, 180 lines)
    ApiLab.tsx      — API testing page
    ApiLab.css
    index.ts        — barrel export
  mocks/
    handlers.ts     — MSW request handlers
    browser.ts      — MSW browser setup
```

### Dev Kit structure — no changes needed
```
frontend/
  index.ts              — barrel (15 re-exports)
  react/
    KitApp.tsx          — ConfigProvider + context
    ThemeToolbar.tsx     — theme/motion/page switcher
    index.ts            — barrel
  themes/
    index.ts            — barrel
    default.ts, chibi.ts, cyberpunk.ts, neu-brutalism.ts, black-gold.ts, red-gold.ts
  tests/                — 10 test files
  antd-adapter.ts       — composeAntdTheme() + buildComponentTokens()
  antd-variables.ts     — buildScopedCssVariables()
  antd-types.ts         — type definitions
  echarts-adapter.ts    — buildEChartsTheme()
  motion-contracts.ts   — resolveMotionContracts()
  overlay-service.ts    — overlay management
  primitives.ts         — getPrimitiveStyles()
  primitive-builders.ts — per-theme primitive builders
  primitive-types.ts    — PrimitiveBoxStyle etc.
  theme-controller.ts   — createThemeController()
  theme-provider-bridge.ts — createThemeProviderBridge()
  theme-specs.ts        — getThemeSpec()
  theme-types.ts        — ThemeSpec, ThemeId etc.
utils/
  index.ts              — barrel (7 re-exports)
  color.ts, storage.ts, motion.ts, env.ts, id.ts, types.ts, a11y.ts
  + corresponding .test.ts files
```

---

## Execution Priority

| Priority | Section | Effort | Impact |
|----------|---------|--------|--------|
| 1 | §1 Split ThemeLab | Medium | High — maintainability |
| 2 | §2b Remove 2 redundant CSS rules | Trivial | Low — cleanup |
| 3 | §3 Add missing antd components | Medium | Medium — showcase coverage |
| 4 | §4a Click-to-copy | Small | Medium — developer UX |
| 5 | §6a+6b Migrate scroll/transition utils | Small | Medium — dev kit API |
| 6 | §5b Add missing tests | Small | Low — coverage |
| 7 | §4c Token inspector | Small | Low — nice-to-have |
| Skip | §4b Theme comparison | Large | Low — defer |
| Skip | §6c Keyframe migration | N/A | Keep in Demo |

## Post-Approval: Save Copy

Save this plan as `IMPROVEMENT_PLAN_R10_AUDIT.md` in the Demo repo root.

---

## Verification

After each step:
1. `npm run dev` in Demo — switch all 6 themes
2. Verify buttons, inputs, cards, overlays render correctly per theme
3. Toggle motion modes: full → reduced → off
4. Open modal, drawer, toast in each theme
5. Check browser console for errors
6. For Dev Kit changes: `npx vitest` in Dev Kit repo
