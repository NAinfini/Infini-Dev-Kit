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

**Scope** must be one of: `theme`, `components`, `hooks`, `provider`, `api-client`, `bot-core`, `bot-discord`, `bot-wechat`, `utils`, `build`, `deps`, `docs`

Examples:
```
feat(components): add FloatingActionButton component
fix(theme): correct neu-brutalism switch track dimensions
chore(deps): bump mantine to 7.19.0
refactor(hooks): extract motion spring logic into useThemeSpring
```

## Code standards

### TypeScript
- **Strict mode** — no `any`, no `@ts-ignore`, no `@ts-expect-error` without a linked issue number.
- All exports must have explicit types. No inferred return types on exported functions.
- `noUnusedLocals` and `noUnusedParameters` are enforced — dead code = build failure.

### React components
- Function components only — no class components.
- All component props must be defined in `frontend/theme/motion-types.ts`.
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
├── frontend/
│   ├── theme/            # Theme specs, controller, Mantine/ECharts adapters
│   ├── components/       # 50 base components (flat) + infini/ dispatch layer
│   │   └── infini/       # 19 Infini* auto-dispatch wrappers + theme-defaults
│   ├── hooks/            # ALL hooks + variants/
│   ├── provider/         # InfiniProvider, KitApp, ThemeToolbar
│   ├── overlays/         # Toast/confirm service
│   └── tests/            # Vitest test files
├── api-client/           # HTTP API client
├── bot-core/             # Platform-agnostic bot framework
├── bot-discord/          # Discord adapter
├── bot-wechat/           # WeChat adapter
└── utils/                # Shared pure utilities
```

## Adding a new component

1. Create `frontend/components/YourComponent.tsx`.
2. Define props in `frontend/theme/motion-types.ts`.
3. Export from `frontend/components/index.ts` (keep alphabetical order).
4. Use `useThemeSnapshot()` only for dynamic values. Prefer CSS variables for static tokens.
5. Gate animations with `useMotionAllowed()` / `useFullMotion()`.
6. Provide a non-animated fallback render path.
7. Update `CHANGELOG.md` under `[Unreleased]`.

## Adding a new theme

1. Create `frontend/theme/themes/<theme-name>.ts` implementing `ThemeSpec`.
2. Create `frontend/theme/themes/<ThemeName>Prompt.md` (LLM generation prompt).
3. Register in `frontend/theme/themes/index.ts`.
4. Add the theme ID to the `ThemeId` union in `frontend/theme/theme-types.ts`.
5. Add a theme-effects CSS Module in `frontend/theme/mantine/theme-effects/<theme-name>.module.css`.
6. If the theme needs component-level overrides (e.g. different switch dimensions), add an entry in `frontend/theme/theme-overrides.ts`.

## Adding a new bot adapter

1. Create `bot-<platform>/` directory at the repo root.
2. Add a `package.json` with `@infini-dev-kit/bot-<platform>` name.
3. Implement the `BotAdapter` interface from `bot-core/adapter-types.ts`.
4. Add the platform SDK as a `peerDependency`.
5. Add to `tsconfig.json` `include` array.
6. Add tests in `bot-<platform>/tests/`.

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
- [ ] `CHANGELOG.md` updated under `[Unreleased]`
- [ ] No unrelated changes included
- [ ] New components export from barrel (`frontend/components/index.ts`)
- [ ] New types defined in `frontend/theme/motion-types.ts`

## What will get your PR rejected

- Skipping the issue-first rule
- Bundling multiple concerns
- Breaking existing themes or components
- Introducing dependencies without prior discussion
- Ignoring TypeScript strict mode
- Hardcoded styles instead of design tokens / CSS variables
- Nested subdirectories inside `frontend/components/` (except `infini/`)
- Missing non-animated fallback in motion components
- Incomplete changelog entry

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
