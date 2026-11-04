# preact-kit

Preact 组件库: 通用组件 + 设计 token(明暗两套), 经 GitHub 安装; 附带自动收集示例的展示站

## 快速开始

```bash
bun install
bun run dev      # http://localhost:5600
bun run ci       # 格式/类型/文档/测试
```

## 结构

```
src/
├─ kit/
│  ├─ tokens.css  motion.css  base.css   # 设计 token, 动效, 重置
│  ├─ demo.ts  texts.ts  assets.d.ts     # 与展示站的契约; 组件的固定文案(可用 setKitText 改写); 样式导入声明
│  ├─ lib/                               # hook 与工具: errors, http, signals, paging, leaving-dialog, roving, anchor, toasts, number
│  ├─ primitives/<name>/                 # index.tsx + <name>.css + <name>.demo.tsx; _shared/ 放弹层共用样式
│  └─ patterns/<name>/                   # 由 primitives 组合出的页面范式
├─ gallery/                              # 展示站, 自动收集 *.demo.tsx
├─ architecture.ts                       # 谁可以引用谁, architecture.test.ts 强制
└─ server.ts                             # 开发服务
scripts/                                 # demo 清单生成, 文档检查, 发版与合并脚本
docs/                                    # guide/ 操作指南, design/ 功能设计, record/ 调研与决策记录
```

## 使用方式

包名 `@altmanlib/preact-kit`, 不发 npm, 只经 GitHub 安装, 锁精确 tag. 发的是源码(`.ts` `.tsx` `.css`), 使用方须是 Bun 项目

```bash
bun add github:altmanlib/preact-kit#v<版本>
bun add preact @preact/signals    # peer 依赖; 用 lib/paging 或 ListPage 时另加 @tanstack/preact-query, 用 MentionInput 时另加 prosemirror-state prosemirror-view prosemirror-model prosemirror-history prosemirror-keymap prosemirror-commands
```

```tsx
import { Button } from "@altmanlib/preact-kit/primitives/button";
import { ListPage } from "@altmanlib/preact-kit/patterns/list-page";
import { usePagedList } from "@altmanlib/preact-kit/lib/paging";
import { setKitText } from "@altmanlib/preact-kit/texts";
```

- 子路径: `primitives/<名>`, `patterns/<名>`, `lib/<名>`, `texts`, `base.css`, `tokens.css`, `motion.css`; 没有总入口. 组件自己引入自己的样式
- 页面引入 `@altmanlib/preact-kit/base.css`(含 token 与重置); 改品牌在自己的样式里覆盖 token, 文案用 `setKitText` 改写
- `tsconfig.json` 的 `types` 加上 `@altmanlib/preact-kit/assets`(样式文件的导入声明)
- 升级: 改 tag 并 `bun add`, 跑自己的 `ci`; 1.0 之前次版本号可含不兼容改动, 见 [CHANGELOG.md](CHANGELOG.md)
- 依赖: `lucide-preact` 随包安装
- 弹层类组件(`Dropdown`, `Select`, `Suggest`, `MentionInput`, `Tooltip`, `Toast`)依赖 Popover API 与 CSS anchor positioning, 颜色依赖 `light-dark()`; 目前只在 Chromium 上验证过

## 文档

- [docs/guide/add-component.md](docs/guide/add-component.md): 新增组件
- [docs/design/2026-11-04-01-mention-input.md](docs/design/2026-11-04-01-mention-input.md): 提及输入框与候选列表的设计
- [docs/record/2026-10-31-headless-library-survey.md](docs/record/2026-10-31-headless-library-survey.md): 无样式库调研
- [docs/record/2026-10-31-package-distribution.md](docs/record/2026-10-31-package-distribution.md): 作为依赖包分发的决策
- [ROADMAP.md](ROADMAP.md): 组件清单与进度
- [CHANGELOG.md](CHANGELOG.md): 版本记录
- [AGENTS.md](AGENTS.md): 开发约定与发版流程

## 许可

MIT, 见 [LICENSE](LICENSE). `Empty` 的插图改自 [unDraw](https://undraw.co/) "No data"
