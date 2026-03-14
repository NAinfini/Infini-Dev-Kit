# Infini Dev Kit

**中文（默认）** | [English](./README_en.md)

Infini 体系内部使用的私有 pnpm 工作区 monorepo，提供主题内核、React 组件、框架适配层、API 客户端、机器人基础能力与通用工具。

默认文档语言：中文。

> AI 代理先读 [`AGENTS.md`](./AGENTS.md)。

## 预览

当前 README 使用来自 `Infini-Demo` 的最新中文界面截图：

| 主题实验室 · Default | 主题实验室 · Cyberpunk | API 实验室 |
| --- | --- | --- |
| ![主题实验室 Default](./docs/images/theme-lab-default-zh.png) | ![主题实验室 Cyberpunk](./docs/images/theme-lab-cyberpunk-zh.png) | ![API 实验室](./docs/images/api-lab-zh.png) |

## 仓库定位

`Infini-Dev-Kit` 不是单一 UI 包，而是一层可复用的平台基础：

- `packages/theme-core`
  主题规范、主题注册、主题桥接、字体加载、CSS 变量生成、动效契约。
- `packages/adapter-*`
  把 `ThemeSpec` 映射到 Mantine、shadcn、MUI、Ant Design、Radix Themes。
- `packages/react`
  共享 React 组件、hooks、动效封装与若干前端工具。
- `packages/api-client`
  可复用的 HTTP 客户端与错误模型。
- `packages/bot-core`、`packages/bot-discord`、`packages/bot-wechat`
  机器人抽象与平台适配。
- `packages/utils`
  颜色、存储、ID、滚动、环境判断、类型工具等纯函数能力。

## 快速开始

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
```

## 常用导入

```ts
import {
  buildScopedCssVariables,
  createThemeProviderBridge,
  getThemeSpec,
  listThemeIds,
  loadThemeFonts,
} from "@infini-dev-kit/theme-core";

import {
  applyLocaleTypography,
  buildScopedCssVariables as buildMantineScopedCssVariables,
  getThemeOverrides,
} from "@infini-dev-kit/adapter-mantine";

import {
  AnimatedTabs,
  CrystalPrismButton,
  DepthButton,
  ScrollProgress,
  SoftClayButton,
} from "@infini-dev-kit/react";

import { createApiClient } from "@infini-dev-kit/api-client";
import { createBot } from "@infini-dev-kit/bot-core";
import { contrastRatio, createBrowserLocalStorageAdapter } from "@infini-dev-kit/utils";
```

## 主题能力

当前内置主题：

- `default`
- `chibi`
- `cyberpunk`
- `neu-brutalism`
- `black-gold`
- `red-gold`

当前动效等级：

- `off`
- `minimum`
- `reduced`
- `full`

`theme-core` 负责输出主题状态、字体、动效和 CSS 变量；具体框架如何消费这些变量，由各适配层或上层应用决定。

## 包一览

| 包名 | 作用 |
| --- | --- |
| `@infini-dev-kit/theme-core` | 无框架主题内核、字体、CSS 变量、动效契约 |
| `@infini-dev-kit/adapter-mantine` | Mantine 主题变量、局部变量生成、排版辅助 |
| `@infini-dev-kit/adapter-shadcn` | shadcn / Tailwind 变量映射 |
| `@infini-dev-kit/adapter-mui` | MUI 主题映射 |
| `@infini-dev-kit/adapter-antd` | Ant Design 主题映射 |
| `@infini-dev-kit/adapter-radix` | Radix Themes 属性与覆写 |
| `@infini-dev-kit/react` | React 组件、hooks、动效封装 |
| `@infini-dev-kit/utils` | 纯工具函数与类型工具 |
| `@infini-dev-kit/api-client` | API 客户端与错误模型 |
| `@infini-dev-kit/bot-core` | 机器人基础抽象 |
| `@infini-dev-kit/bot-discord` | Discord 适配 |
| `@infini-dev-kit/bot-wechat` | Wechaty 适配 |

## 工作区结构

```text
Infini-Dev-Kit/
├── packages/
│   ├── theme-core/
│   ├── adapter-mantine/
│   ├── adapter-shadcn/
│   ├── adapter-mui/
│   ├── adapter-antd/
│   ├── adapter-radix/
│   ├── react/
│   ├── utils/
│   ├── api-client/
│   ├── bot-core/
│   ├── bot-discord/
│   └── bot-wechat/
├── docs/
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## 常用命令

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm lint
```

## 相关文档

- [快速开始](./docs/QUICK-START.md)
- [主题说明](./docs/THEMING.md)
- [国际化说明](./docs/I18N.md)
- [性能说明](./docs/PERFORMANCE.md)
- [故障排查](./docs/TROUBLESHOOTING.md)
- [更新日志](./CHANGELOG.md)

## 约束

1. 以 workspace 包名作为正式导入面，不在 README 中鼓励内部路径导入。
2. 先跑 `pnpm typecheck`，再谈完成。
3. 主题定义保持数据化，运行时逻辑留在 `theme-core`、适配层或消费端。
4. README 默认使用中文；如果后续补英文版本，中文仍作为主入口。

## 许可证

[MIT](./LICENSE)
