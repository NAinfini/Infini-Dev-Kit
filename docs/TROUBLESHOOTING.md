# Troubleshooting Guide

Common issues and solutions when using Infini Dev Kit.

---

## Build Issues

### TypeScript Error: "Cannot find module"

**Problem**: Import paths not resolving.

```
Error: Cannot find module '../Infini-Dev-Kit/frontend/components'
```

**Solution**: Ensure TypeScript paths are configured in your `tsconfig.json`:

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
      "@infini-dev-kit/utils": ["../Infini-Dev-Kit/packages/utils"],
      "@infini-dev-kit/bot-core": ["../Infini-Dev-Kit/packages/bot-core"]
    }
  }
}
```

Or use workspace package names directly:

```typescript
import { DepthButton } from "@infini-dev-kit/react";
```

---

### Motion Library Type Errors

**Problem**: Complex union type errors when using motion components.

```
Error: Expression produces a union type that is too complex to represent
```

**Solution**: Ensure **exact** motion version match between Dev Kit and your app:

```bash
# Check Dev Kit version
cd Infini-Dev-Kit
cat package.json | grep motion
# Should show: "motion": "12.23.24"

# Install exact version in your app
cd your-app
pnpm add motion@12.23.24 --save-exact
```

**Important**: Use `--save-exact` to prevent version drift.

---

### Mantine Version Conflicts

**Problem**: Component props don't match or runtime errors.

```
Error: Property 'leftSection' does not exist on type 'ButtonProps'
```

**Solution**: Use Mantine v8.3.16+ to match Dev Kit:

```bash
pnpm add @mantine/core@^8.3.16 @mantine/notifications@^8.3.16
```

**Check compatibility**:
- Dev Kit uses Mantine v8.3.16
- Your app must use Mantine v8.x (v7 is incompatible)

---

### React Version Mismatch

**Problem**: Multiple React instances or hook errors.

```
Error: Invalid hook call. Hooks can only be called inside the body of a function component.
```

**Solution**: Ensure single React instance via package manager resolution:

**pnpm** (recommended):
```json
// package.json
{
  "pnpm": {
    "overrides": {
      "react": "19.2.0",
      "react-dom": "19.2.0"
    }
  }
}
```

**npm**:
```json
// package.json
{
  "overrides": {
    "react": "19.2.0",
    "react-dom": "19.2.0"
  }
}
```

Then reinstall:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## Runtime Issues

### Theme Not Applying

**Problem**: Components render but theme doesn't apply.

**Solution 1**: Set up the theme bridge with `createThemeProviderBridge`:

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

**Solution 2**: Ensure `MantineProvider` wraps your entire app:

```tsx
// MantineProvider already receives the composed theme from bridge
// No need to configure it separately
<MantineProvider theme={bridge.mantineTheme}>
  <App />
</MantineProvider>
```

---

### Animations Not Working

**Problem**: Components render but no animations play.

**Possible Causes**:

1. **Motion level set to "off"**:
   ```tsx
   // Ensure motion is enabled via the theme controller
   // Components use useMotionAllowed() to gate animations
   ```

2. **Browser doesn't support View Transition API**:
   - View Transitions require Chrome 111+, Safari 18+
   - Fallback: animations still work, but theme switching won't have smooth transitions

3. **User has `prefers-reduced-motion` enabled**:
   - Respect user preference by using `motionLevel="reduced"`
   - Or override: `motionLevel="full"` (not recommended)

4. **CSS custom properties not loading**:
   - Check browser console for CSS errors
   - Ensure `--infini-motion-level` is set in `:root`

---

### Components Not Rendering

**Problem**: Components import successfully but don't render.

**Solution 1**: Check for missing peer dependencies:

```bash
# Required peer dependencies
pnpm add react@^19.2.0 react-dom@^19.2.0
pnpm add @mantine/core@^8.3.16
pnpm add motion@12.23.24
```

**Solution 2**: Check browser console for errors:
- Open DevTools (F12)
- Look for red errors in Console tab
- Common issues: missing CSS, failed imports, prop type errors

---

### Styles Not Loading

**Problem**: Components render but look unstyled.

**Solution**: Import Mantine CSS in your app entry point:

```tsx
// main.tsx or App.tsx
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
```

**Note**: The theme bridge handles theme CSS injection, but Mantine base styles must be imported manually.

---

## Performance Issues

### Bundle Size Too Large

**Problem**: App bundle is huge after adding Dev Kit.

**Solution 1**: Ensure tree-shaking is enabled:

```typescript
// Good - imports only what you need
import { DepthButton } from "@infini-dev-kit/react";

// Bad - imports everything
import * as DevKit from "@infini-dev-kit/react";
```

**Solution 2**: Lazy load heavy components:

```tsx
import { lazy, Suspense } from 'react';

// Lazy load ECharts-based components
const ThemeCharts = lazy(() =>
  import("@infini-dev-kit/react").then(m => ({
    default: m.ThemeCharts
  }))
);

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeCharts />
    </Suspense>
  );
}
```

**Solution 3**: Check bundle analysis:

```bash
# Install bundle analyzer
pnpm add -D vite-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'vite-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }),
  ],
});

# Build and view report
pnpm build
```

**Expected sizes**:
- Motion library: ~100KB
- Mantine: ~300KB
- ECharts (if used): ~500KB
- Dev Kit components: ~200KB

---

### Slow Theme Switching

**Problem**: Theme switch causes lag or jank.

**Solution 1**: Reduce motion level via the theme controller.

**Solution 2**: Disable View Transitions (instant switch):

```tsx
// In your theme switcher
function switchTheme(newTheme: ThemeId) {
  // Disable transitions temporarily
  document.documentElement.style.setProperty('--infini-motion-level', '0');
  setTheme(newTheme);

  // Re-enable after switch
  setTimeout(() => {
    document.documentElement.style.setProperty('--infini-motion-level', '3');
  }, 100);
}
```

**Solution 3**: Optimize component re-renders:

```tsx
// Memoize expensive components
const ExpensiveComponent = memo(function ExpensiveComponent() {
  // ...
});
```

---

### High Memory Usage

**Problem**: Animations cause memory leaks or high memory usage.

**Solution 1**: Ensure components unmount properly:

```tsx
// Good - cleanup in useEffect
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer); // Cleanup
}, []);
```

**Solution 2**: Limit concurrent animations by using the reduced motion mode.

**Solution 3**: Check for event listener leaks:

```tsx
// Good - remove listeners on unmount
useEffect(() => {
  const handler = () => {};
  window.addEventListener('scroll', handler);
  return () => window.removeEventListener('scroll', handler);
}, []);
```

---

## Integration Issues

### API Client Not Working

**Problem**: API requests fail or don't send auth tokens.

**Solution 1**: Verify `getAuthToken` function:

```typescript
const client = createApiClient({
  baseUrl: 'https://api.example.com',
  getAuthToken: () => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Debug
    return token;
  },
});
```

**Solution 2**: Check CORS configuration:

```typescript
// Server must allow your origin
Access-Control-Allow-Origin: https://your-app.com
Access-Control-Allow-Headers: Authorization, Content-Type
```

**Solution 3**: Verify retry configuration:

```typescript
const client = createApiClient({
  baseUrl: 'https://api.example.com',
  retry: {
    retries: 2,
    baseDelayMs: 150,
  },
});
```

---

### Bot Framework Not Connecting

**Problem**: Bot doesn't connect to Discord/WeChat.

**Solution 1**: Verify environment variables:

```bash
# .env
DISCORD_TOKEN=your_token_here
DISCORD_CLIENT_ID=your_client_id
```

**Solution 2**: Check bot permissions:

```typescript
// Discord - ensure bot has required intents
const adapter = createDiscordAdapter({
  token: process.env.DISCORD_TOKEN,
  intents: [
    'Guilds',
    'GuildMessages',
    'MessageContent', // Required for reading messages
  ],
});
```

**Solution 3**: Enable debug logging:

```typescript
const bot = createBot({
  adapter,
  middleware: [
    loggerMiddleware({ level: 'debug' }), // Enable debug logs
  ],
});
```

---

## Browser Compatibility

### View Transition API Not Supported

**Problem**: Theme switching doesn't animate smoothly.

**Browser Support**:
- ✅ Chrome 111+
- ✅ Edge 111+
- ✅ Safari 18+
- ❌ Firefox (not yet supported)

**Solution**: Graceful degradation is built-in. Themes still switch, just without smooth transitions.

**Manual Fallback**:

```typescript
// Check support
if (!document.startViewTransition) {
  console.warn('View Transitions not supported');
  // Theme still works, just no animation
}
```

---

### CSS `color-mix()` Not Supported

**Problem**: Colors don't blend properly in older browsers.

**Browser Support**:
- ✅ Chrome 111+
- ✅ Safari 16.2+
- ❌ Older browsers

**Solution**: Use fallback colors:

```css
/* Fallback for older browsers */
.button {
  background: #3b82f6; /* Fallback */
  background: color-mix(in srgb, var(--infini-color-primary) 80%, white); /* Modern */
}
```

---

## Getting Help

### Before Asking for Help

1. ✅ Check this troubleshooting guide
2. ✅ Check [README.md](../README.md) for basic usage
3. ✅ Check [THEMING.md](./THEMING.md) for theme customization
4. ✅ Search existing issues in Guild Management repo
6. ✅ Check browser console for errors (F12)
7. ✅ Verify all peer dependencies are installed

### How to Report Issues

When reporting issues, include:

1. **Environment**:
   - Node version: `node --version`
   - Package manager: `pnpm --version`
   - Browser: Chrome 120, Safari 17, etc.
   - OS: Windows 11, macOS 14, etc.

2. **Versions**:
   ```bash
   # Check installed versions
   pnpm list react @mantine/core motion
   ```

3. **Error message**:
   - Full error from console
   - Stack trace if available

4. **Minimal reproduction**:
   - Simplest code that reproduces the issue
   - Steps to reproduce

5. **Expected vs actual behavior**:
   - What you expected to happen
   - What actually happened

### Contact

- **Internal**: Ask in team Slack/Discord
- **Issues**: Create issue in Guild Management repo
- **Urgent**: Contact Dev Kit maintainers directly

---

## Common Gotchas

### 1. Forgetting Theme Bridge Setup

```tsx
// ❌ Wrong - no theme bridge, theme won't apply
function App() {
  return <DepthButton>Click</DepthButton>;
}

// ✅ Correct
const bridge = createThemeProviderBridge({ defaultTheme: "default" });

function App() {
  return (
    <MantineProvider theme={bridge.mantineTheme}>
      <DepthButton>Click</DepthButton>
    </MantineProvider>
  );
}
```

### 2. Using Caret (^) for motion version

```json
// ❌ Wrong - version may drift
"motion": "^12.23.24"

// ✅ Correct - exact version
"motion": "12.23.24"
```

### 3. Importing from wrong path

```tsx
// ❌ Wrong - imports internal files
import { DepthButton } from "@infini-dev-kit/react/components/buttons/DepthButton";

// ✅ Correct - use barrel export
import { DepthButton } from "@infini-dev-kit/react";
```

### 4. Not importing Mantine CSS

```tsx
// ❌ Wrong - components look unstyled
import { DepthButton } from "@infini-dev-kit/react";

// ✅ Correct - import Mantine CSS first
import "@mantine/core/styles.css";
import { DepthButton } from "@infini-dev-kit/react";
```

### 5. Mixing Mantine v7 and v8

```json
// ❌ Wrong - version mismatch
"@mantine/core": "^7.17.8"  // Your app
// Dev Kit uses v8.3.16

// ✅ Correct - match versions
"@mantine/core": "^8.3.16"
```

---

## Quick Fixes Checklist

When something doesn't work, try these in order:

- [ ] Clear node_modules and reinstall: `rm -rf node_modules pnpm-lock.yaml && pnpm install`
- [ ] Check browser console for errors (F12)
- [ ] Verify theme bridge is set up and MantineProvider wraps your app
- [ ] Verify Mantine CSS is imported
- [ ] Check motion version is exact: `12.23.24`
- [ ] Check Mantine version is v8: `^8.3.16`
- [ ] Check React version is v19: `^19.2.0`
- [ ] Restart dev server
- [ ] Clear browser cache (Ctrl+Shift+R)
- [ ] Try in incognito/private window
- [ ] Try in different browser

If none of these work, see "Getting Help" section above.
