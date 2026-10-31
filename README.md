# preact-kit

Preact 组件脚手架: 通用组件 + 设计 token(明暗两套) + 自动收集示例的展示站

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
│  ├─ demo.ts  texts.ts                  # 与展示站的契约; 组件的固定文案(可用 setKitText 改写)
│  ├─ lib/                               # hook 与工具: errors, http, signals, paging, leaving-dialog, roving, anchor, toasts, number
│  ├─ primitives/<name>/                 # index.tsx + <name>.css + <name>.demo.tsx; _shared/ 放弹层共用样式
│  └─ patterns/<name>/                   # 由 primitives 组合出的页面范式
├─ gallery/                              # 展示站, 自动收集 *.demo.tsx
├─ architecture.ts                       # 谁可以引用谁, architecture.test.ts 强制
└─ server.ts                             # 开发服务
scripts/                                 # demo 清单生成, 文档检查, 发版与合并脚本
docs/                                    # guide/ 操作指南, record/ 调研与决策记录
```

## 使用方式

复制代码形态: 把 `src/kit/` 拷进自己的项目, 在页面引入 `kit/base.css`, 按需引用组件; 改品牌只改 `tokens.css`; 文案用 `setKitText` 改写. 展示站(`src/gallery/`)与 `scripts/gen-demos.ts` 可不带走

- 运行时依赖: `preact`, `@preact/signals`, `lucide-preact`; `lib/paging` 与 `ListPage` 另需 `@tanstack/preact-query`
- 弹层类组件(`Dropdown`, `Select`, `Tooltip`, `Toast`)依赖 Popover API 与 CSS anchor positioning, 颜色依赖 `light-dark()`; 目前只在 Chromium 上验证过
- 复制时带上 `src/jsx.d.ts`(Popover 属性的类型补充)与 `src/assets.d.ts`(样式文件的导入声明)

## 文档

- [docs/guide/add-component.md](docs/guide/add-component.md): 新增组件
- [docs/record/2026-10-31-headless-library-survey.md](docs/record/2026-10-31-headless-library-survey.md): 无样式库调研
- [ROADMAP.md](ROADMAP.md): 组件清单与进度
- [CHANGELOG.md](CHANGELOG.md): 版本记录
- [AGENTS.md](AGENTS.md): 开发约定与发版流程

## 许可

MIT, 见 [LICENSE](LICENSE). `Empty` 的插图改自 [unDraw](https://undraw.co/) "No data"
