# Performance

Bundle sizes and rendering benchmarks for Infini Dev Kit.

---

## Bundle Sizes

Source file sizes (brotli-compressed), measured via `pnpm size` using [size-limit](https://github.com/ai/size-limit):

| Package | Size (brotli) | Raw | Limit |
|---------|-------------|-----|-------|
| `theme-core` | — | — | — |
| `adapter-mantine` | — | — | — |
| `adapter-shadcn` | — | — | — |
| `adapter-mui` | — | — | — |
| `adapter-antd` | — | — | — |
| `adapter-radix` | — | — | — |
| `react` | — | — | — |
| `utils` | 5.26 KB | ~18 KB | 25 KB |
| `api-client` | 4.98 KB | ~23 KB | 30 KB |
| `bot-core` | 5.02 KB | ~21 KB | 25 KB |
| `bot-discord` | 5.77 KB | ~22 KB | 25 KB |
| `bot-wechat` | 4.94 KB | ~18 KB | 25 KB |

Run `pnpm size` to regenerate. Limits are defined in `.size-limit.json`.

> Infini Dev Kit is **source-first** — consumers bundle it themselves. These sizes measure raw TypeScript source, not bundled output. Actual bundle impact depends on tree-shaking and which components are imported. Sizes for the new packages (theme-core, adapters, react) will be measured after stabilization.

---

## Render Performance Methodology

Use the [React Profiler API](https://react.dev/reference/react/Profiler) to measure component render performance:

```tsx
import { Profiler } from 'react';

function onRender(id: string, phase: string, actualDuration: number) {
  console.log(`${id} [${phase}]: ${actualDuration.toFixed(2)}ms`);
}

<Profiler id="InfiniTable" onRender={onRender}>
  <InfiniTable data={data} columns={columns} />
</Profiler>
```

### Baseline Targets

These baselines represent the expected render duration for initial mount in a development build. Production builds are typically 2-5x faster.

| Component | Dataset | Target (dev) |
|-----------|---------|-------------|
| `InfiniTable` | 100 rows | < 50ms |
| `InfiniTable` | 1,000 rows | < 200ms |
| `InfiniTable` | 10,000 rows | < 500ms (virtualized) |
| `InfiniKanban` | 50 cards | < 100ms |
| `InfiniKanban` | 200 cards | < 300ms |
| `MediaGallery` | 50 items | < 100ms |
| `MediaGallery` | 200 items | < 250ms (lazy-loaded) |

### Measuring Motion Impact

Compare render times with motion level `full` vs `off`:

```tsx
// Via theme controller
bridge.controller.setMotionLevel('off');
// Re-render and measure
bridge.controller.setMotionLevel('full');
// Re-render and measure
```

Expected overhead from `full` motion: < 15% additional render time for components with entrance animations, negligible for static renders.

---

## Tips

1. **Import only what you use** — barrel imports are tree-shakeable, but explicit imports guarantee minimal inclusion
2. **Virtualize large datasets** — InfiniTable and MediaGallery support virtualization for 1000+ items
3. **Use `off` motion level** for performance-critical views
4. **Profile in production mode** — `NODE_ENV=production` eliminates React dev-mode overhead
