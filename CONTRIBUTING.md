# Contributing to Infini Dev Kit

Thank you for your interest in contributing. This document outlines the rules and expectations for all contributors. **Read the entire document before submitting any code.**

## Ground rules

1. **No drive-by PRs.** Open an issue first to discuss the change. PRs without a linked issue will be closed.
2. **One concern per PR.** Each pull request must address exactly one feature, bug fix, or refactor. Do not bundle unrelated changes.
3. **Source-first distribution.** This kit ships raw `.ts`/`.tsx` source. Do not add bundler configs (Vite, Rollup, esbuild) or compiled output (`dist/`, `.js`, `.d.ts`).

## Branch strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready, always passes typecheck |
| `feat/<name>` | New component, adapter, or capability |
| `fix/<name>` | Bug fixes |
| `chore/<name>` | Tooling, CI, docs |

- Branch from `main`. Rebase onto `main` before requesting review.
- No merge commits — use **rebase and fast-forward** only.

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) strictly:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Allowed types:** `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`, `perf`, `ci`

**Scope** must be one of: `theme-core`, `adapter-mantine`, `adapter-shadcn`, `adapter-mui`, `adapter-antd`, `adapter-radix`, `react`, `api-client`, `bot-core`, `bot-discord`, `bot-wechat`, `utils`, `build`, `deps`, `docs`

Examples:
```
feat(react): add FloatingActionButton component
fix(adapter-mantine): correct neu-brutalism switch track dimensions
chore(deps): bump mantine to 8.3.16
refactor(theme-core): extract motion spring logic into spring-profiles
feat(adapter-shadcn): add sidebar CSS variable mapping
```

## Code standards

### TypeScript
- **Strict mode** — no `any`, no `@ts-ignore`, no `@ts-expect-error` without a linked issue number.
- All exports must have explicit types. No inferred return types on exported functions.
- `noUnusedLocals` and `noUnusedParameters` are enforced — dead code = build failure.

### React components
- Function components only — no class components.
- Components live in `packages/react/components/`.
- Components must consume static theme tokens via CSS variables (`var(--infini-*)`), not `useThemeSnapshot()`, unless the value is dynamic (mouse position, spring physics, animation state).
- Use `useMotionAllowed()` / `useFullMotion()` to gate animations. Always provide a static fallback when motion is off.

### File naming

| Item | Convention | Example |
|------|-----------|---------|
| Components | `PascalCase.tsx` | `GlowCard.tsx` |
| Hooks | `kebab-case.ts` with `use-` prefix | `use-motion-allowed.ts` |
| Types / data | `kebab-case.ts` | `motion-types.ts` |
| CSS Modules | `PascalCase.module.css` | `GlitchOverlay.module.css` |

## Directory structure

```
infini-dev-kit/
├── packages/
│   ├── theme-core/          # Framework-agnostic theme system
│   ├── adapter-mantine/     # ThemeSpec → Mantine config
│   ├── adapter-shadcn/      # ThemeSpec → shadcn/Tailwind CSS vars
│   ├── adapter-mui/         # ThemeSpec → MUI createTheme() options
│   ├── adapter-antd/        # ThemeSpec → Ant Design v5 tokens
│   ├── adapter-radix/       # ThemeSpec → Radix Themes props
│   ├── react/               # 71 base components + hooks + motion
│   │   ├── components/      # All UI components
│   │   ├── hooks/           # Motion hooks + variants
│   │   └── tests/           # Vitest test files
│   ├── utils/               # Shared pure utilities
│   ├── api-client/          # HTTP API client
│   ├── bot-core/            # Platform-agnostic bot framework
│   ├── bot-discord/         # Discord adapter
│   └── bot-wechat/          # WeChat adapter
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
```

## Adding a new component

1. Create `packages/react/components/YourComponent.tsx`.
2. Export from `packages/react/components/index.ts` (keep alphabetical order).
3. Use `useThemeSnapshot()` only for dynamic values. Prefer CSS variables for static tokens.
4. Gate animations with `useMotionAllowed()` / `useFullMotion()`.
5. Provide a non-animated fallback render path.

## Adding a new theme

1. Create `packages/theme-core/themes/<theme-name>.ts` implementing `ThemeSpec`.
2. Create `packages/theme-core/themes/<ThemeName>Prompt.md` (LLM generation prompt).
3. Register in `packages/theme-core/themes/index.ts`.
4. Add the theme ID to the `ThemeId` union in `packages/theme-core/theme-types.ts`.
5. If the theme needs component-level overrides, add entries in the relevant adapters (`packages/adapter-mantine/theme-overrides.ts`, etc.).

## Adding a new UI framework adapter

1. Create `packages/adapter-<framework>/` directory.
2. Add `package.json` with `@infini-dev-kit/adapter-<framework>` name.
3. Depend on `@infini-dev-kit/theme-core: workspace:*` and `@infini-dev-kit/utils: workspace:*`.
4. Framework lib as `peerDependency` only.
5. Add `tsconfig.json` with references to `../utils` and `../theme-core`.
6. Add path aliases to `tsconfig.base.json`.
7. Follow the 3-layer pattern: types → token mapping → component overrides.

## Adding a new bot adapter

1. Create `packages/bot-<platform>/` directory.
2. Add a `package.json` with `@infini-dev-kit/bot-<platform>` name.
3. Implement the `BotAdapter` interface from `packages/bot-core/adapter-types.ts`.
4. Add the platform SDK as a `peerDependency`.
5. Add `tsconfig.json` with reference to `../bot-core`.
6. Add path alias to `tsconfig.base.json`.
7. Add tests in `packages/bot-<platform>/tests/`.

## Testing

- Run `pnpm typecheck` before pushing — zero errors required.
- Run `pnpm test` — all tests must pass.
- For component changes, visually verify under **at least two themes** and **two motion levels** (`full` and `off`).

## Pull request checklist

Before requesting review, confirm:

- [ ] Issue is linked in the PR description
- [ ] Branch is rebased on latest `main`
- [ ] `pnpm typecheck` passes with zero errors
- [ ] `pnpm test` passes
- [ ] Commit messages follow Conventional Commits
- [ ] No `any`, `@ts-ignore`, `!important`, or hardcoded design values
- [ ] Component tested under >= 2 themes and >= 2 motion levels
- [ ] No unrelated changes included
- [ ] New components export from barrel (`packages/react/components/index.ts`)

## What will get your PR rejected

- Skipping the issue-first rule
- Bundling multiple concerns
- Breaking existing themes or components
- Introducing dependencies without prior discussion
- Ignoring TypeScript strict mode
- Hardcoded styles instead of design tokens / CSS variables
- Missing non-animated fallback in motion components

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
