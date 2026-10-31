---
title: 新增组件
type: guide
status: published
updated: 2026-10-31
---

# 新增组件

## 1. 放哪里

| 类别 | 目录 | 约束 |
| ---- | ---- | ---- |
| primitive | `src/kit/primitives/<name>/` | 通用控件: 不含业务词汇, 固定文案, 接口地址; 只依赖 `kit/demo.ts` |
| pattern | `src/kit/patterns/<name>/` | 由 primitive 组合出的页面范式; 文案/接口/品牌通过属性注入. 目录首次出现时在 `src/architecture.ts` 加对应 zone |

## 2. 一个组件的文件

```
<name>/
├─ index.tsx        # 组件与它的属性类型; 顶部 import "./<name>.css"
├─ <name>.css       # 只用 tokens.css 里的 token
├─ <name>.demo.tsx  # 默认导出 defineDemo(...), 展示站自动收集
└─ <name>.test.tsx  # 有逻辑时才写
```

- `*.demo.tsx` 是展示站的唯一入口: 新增后 `bun run dev` 重新生成清单即可出现在左侧导航, 不改展示站代码
- 每个 demo 至少含默认态, 各变体, 禁用/错误等边界态; 每个 example 配一行 `note` 说明何时用

## 3. 样式约定

- 颜色, 间距, 圆角, 时长, 缓动一律用 `tokens.css` 的 token, 不写十六进制颜色, 字面像素与时长
- 颜色是 `light-dark()` 成对定义的, 组件无需关心明暗; 要新增颜色先在 `tokens.css` 加一对
- 动效见 `motion.css`; 减少动态效果由它统一处理, 组件不再自写 `prefers-reduced-motion`
- 类名带组件前缀(`.btn`, `.select-…`), 不用裸标签选择器

## 4. 代码约定

- 其余属性透传给原生元素, 只暴露调用方真正会变的部分
- 对用户可见的固定句子不写在组件里, 通过属性传入
- 注释用英文, 每个导出的组件写一行用途注释
- 提交前 `bun run ci`
