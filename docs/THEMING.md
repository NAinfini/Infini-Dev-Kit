# Theming Guide

Complete guide to customizing themes in Infini Dev Kit.

---

## Available Themes

Infini Dev Kit includes 6 pre-built theme variants:

| Theme | Description | Best For |
|-------|-------------|----------|
| `default` | Clean, modern design with subtle shadows | General purpose, professional apps |
| `chibi` | Playful, rounded aesthetic with soft colors | Fun, casual, community-focused apps |
| `cyberpunk` | Neon, futuristic style with glitch effects | Gaming, tech, edgy applications |
| `neu-brutalism` | Bold, flat design with hard shadows | Modern, minimalist, design-forward apps |
| `black-gold` | Elegant, luxurious dark theme | Premium, sophisticated applications |
| `red-gold` | Traditional, ceremonial color scheme | Cultural, traditional, formal apps |

---

## Basic Theme Setup

### 1. Create a Theme Bridge (Mantine)

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

### 1b. Other Framework Adapters

```tsx
// shadcn/ui — pure CSS variables
import { buildShadcnVariables, infiniTailwindPreset } from "@infini-dev-kit/adapter-shadcn";
const vars = buildShadcnVariables("cyberpunk");
// Or in tailwind.config.ts: presets: [infiniTailwindPreset("cyberpunk")]

// MUI
import { buildMuiTheme } from "@infini-dev-kit/adapter-mui";
import { ThemeProvider, createTheme } from "@mui/material";
<ThemeProvider theme={createTheme(buildMuiTheme("cyberpunk"))}><App /></ThemeProvider>

// Ant Design v5
import { buildAntdTheme } from "@infini-dev-kit/adapter-antd";
import { ConfigProvider } from "antd";
<ConfigProvider theme={buildAntdTheme("cyberpunk")}><App /></ConfigProvider>

// Radix Themes
import { buildRadixThemeProps, buildRadixCssOverrides } from "@infini-dev-kit/adapter-radix";
import { Theme } from "@radix-ui/themes";
<Theme {...buildRadixThemeProps("cyberpunk")} style={buildRadixCssOverrides("cyberpunk")}><App /></Theme>
```

### 2. Switch Themes Dynamically

```tsx
import { createThemeProviderBridge } from "@infini-dev-kit/theme-core";
import { MantineProvider } from "@mantine/core";
import type { ThemeId } from "@infini-dev-kit/theme-core";

const bridge = createThemeProviderBridge({ defaultTheme: "default" });

function App() {
  return (
    <MantineProvider theme={bridge.mantineTheme}>
      <select onChange={(e) => bridge.controller.setTheme(e.target.value as ThemeId)}>
        <option value="default">Default</option>
        <option value="chibi">Chibi</option>
        <option value="cyberpunk">Cyberpunk</option>
        <option value="neu-brutalism">Neu Brutalism</option>
        <option value="black-gold">Black Gold</option>
        <option value="red-gold">Red Gold</option>
      </select>
      <YourApp />
    </MantineProvider>
  );
}
```

---

## Motion Levels

Control animation intensity across your entire app:

| Level | Description | Use Case |
|-------|-------------|----------|
| `off` | No animations | Accessibility, performance-critical |
| `minimum` | Essential animations only | Reduced motion preference |
| `reduced` | Reduced motion (respects `prefers-reduced-motion`) | Accessibility-aware |
| `full` | All animations enabled | Default, full experience |

### Example

The motion level is controlled through the theme controller, not a provider prop. Components use `useMotionAllowed()` and `useFullMotion()` hooks to gate animations.

### Respecting User Preferences

The system automatically respects the user's `prefers-reduced-motion` system setting when using the `reduced` motion mode.

---

## Customizing Theme Colors

### Using CSS Custom Properties

All themes expose CSS custom properties that you can override:

```css
/* In your global CSS file */
:root {
  /* Primary colors */
  --infini-color-primary: #your-color;
  --infini-color-accent: #your-color;

  /* Background and text */
  --infini-color-bg: #your-bg-color;
  --infini-color-text: #your-text-color;

  /* Semantic colors */
  --infini-color-success: #your-success-color;
  --infini-color-warning: #your-warning-color;
  --infini-color-danger: #your-danger-color;
  --infini-color-info: #your-info-color;

  /* UI elements */
  --infini-color-border: #your-border-color;
  --infini-radius: 8px;
}
```

### Per-Theme Overrides

Override colors for specific themes:

```css
/* Override only for cyberpunk theme */
[data-theme="cyberpunk"] {
  --infini-color-primary: #ff00ff;
  --infini-color-accent: #00ffff;
}

/* Override only for dark themes */
[data-color-scheme="dark"] {
  --infini-color-bg: #0a0a0a;
  --infini-color-text: #f0f0f0;
}
```

---

## Component-Level Customization

### DepthButton Custom Colors

```tsx
<DepthButton
  color="var(--infini-color-custom)"
  shadowColor="rgba(0, 0, 0, 0.3)"
  type="primary"
>
  Custom Button
</DepthButton>
```

### GlowCard Custom Styling

```tsx
<GlowCard
  style={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: '2px solid var(--infini-color-accent)',
  }}
>
  Custom Card
</GlowCard>
```

---

## Typography Customization

Themes include locale-specific font stacks (English, Chinese, Japanese):

### Override Font Families

```css
:root {
  /* English fonts */
  --infini-font-heading: 'Your Heading Font', sans-serif;
  --infini-font-body: 'Your Body Font', sans-serif;
  --infini-font-mono: 'Your Mono Font', monospace;

  /* Chinese fonts */
  --infini-font-zh-heading: 'Your Chinese Font', sans-serif;
  --infini-font-zh-body: 'Your Chinese Font', sans-serif;

  /* Japanese fonts */
  --infini-font-ja-heading: 'Your Japanese Font', sans-serif;
  --infini-font-ja-body: 'Your Japanese Font', sans-serif;
}
```

### Font Sizes

```css
:root {
  --infini-font-size-xs: 0.75rem;
  --infini-font-size-sm: 0.875rem;
  --infini-font-size-md: 1rem;
  --infini-font-size-lg: 1.125rem;
  --infini-font-size-xl: 1.25rem;
  --infini-font-size-2xl: 1.5rem;
  --infini-font-size-3xl: 1.875rem;
  --infini-font-size-4xl: 2.25rem;
}
```

---

## Advanced: Creating Custom Themes

### 1. Define Theme Spec

Create a new theme spec file:

```typescript
// packages/theme-core/themes/my-theme.ts
import type { ThemeSpec } from "../theme-types";

export const myTheme: ThemeSpec = {
  id: 'my-theme',
  name: 'My Custom Theme',
  colorScheme: 'light', // or 'dark'

  palette: {
    primary: '#your-primary',
    accent: '#your-accent',
    bg: '#ffffff',
    text: '#000000',
    success: '#00ff00',
    warning: '#ffaa00',
    danger: '#ff0000',
    info: '#0088ff',
    border: '#e0e0e0',
  },

  typography: {
    en: {
      heading: { family: 'Your Font', weights: [400, 600, 700] },
      body: { family: 'Your Font', weights: [400, 500] },
      mono: { family: 'Mono Font', weights: [400] },
    },
    // ... zh, ja
  },

  motion: {
    hoverDuration: 200,
    pressDuration: 150,
    bounce: 0.3,
    // ... other motion config
  },

  effects: {
    shadowIntensity: 0.15,
    glowIntensity: 0.5,
    blurRadius: 8,
  },
};
```

### 2. Register Theme

Add to theme registry in `packages/theme-core/theme-specs.ts`:

```typescript
import { myTheme } from "./themes/my-theme";

const THEME_REGISTRY = {
  default: defaultTheme,
  chibi: chibiTheme,
  cyberpunk: cyberpunkTheme,
  'neu-brutalism': neuBrutalismTheme,
  'black-gold': blackGoldTheme,
  'red-gold': redGoldTheme,
  'my-theme': myTheme, // Add your theme
} as const;
```

### 3. Use Custom Theme

```tsx
const bridge = createThemeProviderBridge({ defaultTheme: 'my-theme' });

// Use bridge.mantineTheme in your MantineProvider
```

---

## Theme-Specific Component Behavior

Some components adapt their behavior based on the active theme:

### Dispatch Layer

`InfiniMenu` automatically selects the appropriate component variant based on the active theme:

```tsx
// Automatically uses theme-appropriate menu style
<InfiniMenu>Content</InfiniMenu>
```

### Manual Component Selection

Use base components directly for full control:

```tsx
import { CyberpunkCard, NeuBrutalCard } from "@infini-dev-kit/react";

// Always use cyberpunk style regardless of theme
<CyberpunkCard>Content</CyberpunkCard>

// Always use neu-brutal style regardless of theme
<NeuBrutalCard>Content</NeuBrutalCard>
```

---

## Best Practices

1. **Start with a base theme** — Customize from an existing theme rather than building from scratch
2. **Use CSS custom properties** — Override colors via CSS for easy theme switching
3. **Test in all themes** — Ensure your customizations work across all theme variants
4. **Respect motion preferences** — Use `reduced` motion level for accessibility
5. **Maintain contrast ratios** — Ensure text remains readable (WCAG AA: 4.5:1 minimum)
6. **Document custom themes** — Keep a record of your color choices and rationale

---

## Troubleshooting

### Theme Not Applying

**Problem**: Components render but theme doesn't apply.

**Solution**: Ensure theme bridge is set up and `MantineProvider` wraps your entire app:

```tsx
// ✅ Correct
const bridge = createThemeProviderBridge({ defaultTheme: "default" });
<MantineProvider theme={bridge.mantineTheme}>
  <App />
</MantineProvider>

// ❌ Wrong - MantineProvider inside app, not wrapping it
<App>
  <MantineProvider theme={bridge.mantineTheme}>
    <Content />
  </MantineProvider>
</App>
```

### Colors Not Updating

**Problem**: CSS custom property overrides not working.

**Solution**: Ensure your CSS is loaded after Mantine's CSS:

```tsx
// In your main file
import '@mantine/core/styles.css'; // Mantine first
import './your-custom-styles.css'; // Your overrides second
```

### Motion Not Working

**Problem**: Animations don't play.

**Solution**: Check motion level and browser support:

```tsx
// Ensure motion is enabled via the theme controller
// Components use useMotionAllowed() / useFullMotion() to gate animations

// Check browser support for View Transition API
if (!document.startViewTransition) {
  console.warn('View Transitions not supported');
}
```

---

## Related Documentation

- [README.md](../README.md) — Getting started guide
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) — Common issues and solutions
