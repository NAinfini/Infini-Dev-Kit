# Quick Start Guide

Get up and running with Infini Dev Kit in 5 minutes.

---

## Installation

Infini Dev Kit is a pnpm workspace monorepo. Add it as a workspace dependency or reference it via path aliases.

```bash
cd Infini-Dev-Kit
pnpm install
```

---

## Step 1: Install Peer Dependencies

```bash
cd your-app

# Required for Mantine adapter
pnpm add react@^19.2.0 react-dom@^19.2.0
pnpm add @mantine/core@^8.3.16 @mantine/notifications@^8.3.16
pnpm add motion@12.23.24 --save-exact

# Or for other frameworks (pick one):
pnpm add @mui/material @emotion/react @emotion/styled   # MUI
pnpm add antd                                            # Ant Design
pnpm add @radix-ui/themes                                # Radix Themes
# shadcn — no extra dependency needed (pure CSS output)
```

**Important**: Use exact version `12.23.24` for motion to avoid type conflicts.

---

## Step 2: Import CSS (Mantine only)

Add to your app entry point (`main.tsx` or `App.tsx`):

```tsx
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
```

---

## Step 3: Set Up Theme

### Mantine

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

### shadcn/ui

```tsx
import { buildShadcnVariables } from "@infini-dev-kit/adapter-shadcn";
// Or use the Tailwind preset:
import { infiniTailwindPreset } from "@infini-dev-kit/adapter-shadcn";
```

### MUI

```tsx
import { buildMuiTheme } from "@infini-dev-kit/adapter-mui";
import { ThemeProvider, createTheme } from "@mui/material";

<ThemeProvider theme={createTheme(buildMuiTheme("cyberpunk"))}>
  <YourApp />
</ThemeProvider>
```

### Ant Design

```tsx
import { buildAntdTheme } from "@infini-dev-kit/adapter-antd";
import { ConfigProvider } from "antd";

<ConfigProvider theme={buildAntdTheme("cyberpunk")}>
  <YourApp />
</ConfigProvider>
```

### Radix Themes

```tsx
import { buildRadixThemeProps, buildRadixCssOverrides } from "@infini-dev-kit/adapter-radix";
import { Theme } from "@radix-ui/themes";

<Theme {...buildRadixThemeProps("cyberpunk")} style={buildRadixCssOverrides("cyberpunk")}>
  <YourApp />
</Theme>
```

---

## Step 4: Use Components

```tsx
import { DepthButton, TiltCard } from "@infini-dev-kit/react";

function YourComponent() {
  return (
    <TiltCard>
      <h2>Welcome to Infini Dev Kit</h2>
      <DepthButton
        type="primary"
        onClick={() => alert("Hello!")}
      >
        Get Started
      </DepthButton>
    </TiltCard>
  );
}
```

---

## Step 5: Configure TypeScript (Optional)

For cleaner imports, add path aliases to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@infini-dev-kit/theme-core": ["../Infini-Dev-Kit/packages/theme-core"],
      "@infini-dev-kit/react": ["../Infini-Dev-Kit/packages/react"],
      "@infini-dev-kit/adapter-mantine": ["../Infini-Dev-Kit/packages/adapter-mantine"],
      "@infini-dev-kit/adapter-shadcn": ["../Infini-Dev-Kit/packages/adapter-shadcn"],
      "@infini-dev-kit/adapter-mui": ["../Infini-Dev-Kit/packages/adapter-mui"],
      "@infini-dev-kit/adapter-antd": ["../Infini-Dev-Kit/packages/adapter-antd"],
      "@infini-dev-kit/adapter-radix": ["../Infini-Dev-Kit/packages/adapter-radix"],
      "@infini-dev-kit/api-client": ["../Infini-Dev-Kit/packages/api-client"],
      "@infini-dev-kit/utils": ["../Infini-Dev-Kit/packages/utils"]
    }
  }
}
```

---

## Next Steps

- **[README.md](../README.md)** — Full documentation and component examples
- **[THEMING.md](./THEMING.md)** — Customize themes and colors
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** — Fix common issues

---

## Common First-Time Issues

### Build Error: "Cannot find module"

**Fix**: Configure TypeScript paths (see Step 5) or use workspace package names.

### Components Look Unstyled (Mantine)

**Fix**: Import Mantine CSS (see Step 2).

### Type Errors with Motion

**Fix**: Install exact motion version `12.23.24` with `--save-exact`.

### Theme Not Applying

**Fix**: Set up the theme bridge correctly (see Step 3).

---

## Example: Complete Minimal App (Mantine)

```tsx
// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "@mantine/core/styles.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

```tsx
// App.tsx
import { createThemeProviderBridge } from "@infini-dev-kit/theme-core";
import { MantineProvider } from "@mantine/core";
import { DepthButton, TiltCard } from "@infini-dev-kit/react";

const bridge = createThemeProviderBridge({ defaultTheme: "cyberpunk" });

function App() {
  return (
    <MantineProvider theme={bridge.mantineTheme}>
      <div style={{ padding: "2rem" }}>
        <TiltCard>
          <h1>Hello Infini Dev Kit!</h1>
          <DepthButton type="primary">Click Me</DepthButton>
        </TiltCard>
      </div>
    </MantineProvider>
  );
}

export default App;
```

---

## Need Help?

1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Review [README.md](../README.md) examples
3. Ask in team Slack/Discord
