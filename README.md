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
│  ├─ lib/                               # hook 与请求工具: errors, http, signals, paging, leaving-dialog
│  ├─ primitives/<name>/                 # index.tsx + <name>.css + <name>.demo.tsx
│  └─ patterns/<name>/                   # 由 primitives 组合出的页面范式
├─ gallery/                              # 展示站, 自动收集 *.demo.tsx
└─ server.ts                             # 开发服务
```

## 文档

- [docs/guide/add-component.md](docs/guide/add-component.md): 新增组件
- [ROADMAP.md](ROADMAP.md): 组件清单与进度
- [AGENTS.md](AGENTS.md): 开发约定
