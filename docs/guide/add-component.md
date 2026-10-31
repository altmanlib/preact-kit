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
| primitive | `src/kit/primitives/<name>/` | 通用控件: 不含业务词汇, 固定文案, 接口地址; 只依赖 `kit/demo.ts`, `kit/texts.ts`, `kit/lib`, 以及其他 primitive(如 `Pager` 用 `Button`) |
| pattern | `src/kit/patterns/<name>/` | 由 primitive 与 lib 组合出的页面范式; 文案/列定义/取数通过属性注入 |
| lib | `src/kit/lib/` | 没有自己标记的 hook 与工具; 只依赖 `kit/texts.ts` |

- `src/kit/primitives/_shared/` 放几个组件共用的样式(目前是弹层的 `popover.css`), 不是组件, 没有 demo
- 新增顶层目录时在 `src/architecture.ts` 加对应 zone

## 2. 一个组件的文件

```
<name>/
├─ index.tsx        # 组件与它的属性类型; 顶部 import "./<name>.css"
├─ <name>.css       # 只用 tokens.css 里的 token
├─ <name>.demo.tsx  # 默认导出 defineDemo(...), 展示站自动收集
└─ <name>.test.ts   # 组件目录里的纯逻辑(如 avatar/initials.ts)才写; 通用逻辑放 lib/ 并写测试
```

- `*.demo.tsx` 是展示站的唯一入口: 新增后 `bun run dev` 重新生成清单即可出现在左侧导航, 不改展示站代码
- 每个 demo 至少含默认态, 各变体, 禁用/错误等边界态; 每个 example 配一行 `note` 说明何时用

## 3. 样式约定

- 颜色, 间距, 圆角, 时长, 缓动一律用 `tokens.css` 的 token, 不写十六进制颜色, 字面像素与时长
- 颜色是 `light-dark()` 成对定义的, 组件无需关心明暗; 要新增颜色先在 `tokens.css` 加一对
- 动效见 `motion.css`; 减少动态效果由它统一处理, 组件不再自写 `prefers-reduced-motion`
- 类名带组件前缀(`.btn`, `.tile-…`), 不用裸标签选择器(`.input` 是表单控件共用的类, 原生 `select` 也加它)
- 同优先级的规则谁生效取决于样式表的打包顺序, 不能依赖; 需要覆盖共用类时提高优先级(如 `.pop.tooltip`)

## 4. 代码约定

- 其余属性透传给原生元素, 只暴露调用方真正会变的部分
- 组件自带的固定句子(取消, 确认, 关闭, 重试…)放 `kit/texts.ts`, 应用用 `setKitText` 改写; 与某个用法相关的句子通过属性传入
- 有状态的 demo 把状态写成 demo 文件里的小组件, 不在 `render` 里直接用 hook
- 在展示站里需要整列宽度的 demo 用 `<div class="demo-stack">` 包起来
- 注释用英文, 每个导出的组件写一行用途注释

## 5. 弹层类组件

`Dropdown`, `Select`, `Tooltip`, `Toast` 的做法, 新增同类组件照此:

- 用浏览器的 Popover API: 元素带 `popover="auto"`(点外面与 Esc 关闭)或 `"manual"`(自己控制), 触发按钮用 `popovertarget`, 状态变化在 `onToggle` 里读 `event.newState`; 这些属性的类型在 `src/jsx.d.ts`
- 定位用 CSS anchor positioning: `useAnchor()`(`kit/lib/anchor.ts`)给出弹层 `id` 与锚点名, 触发器写 `style="anchor-name: …"`, 弹层写 `style="position-anchor: …"`, 样式用 `_shared/popover.css` 的 `.pop`(菜单项与列表项用 `.pop-item`)
- 列表里的方向键, Home, End, 跳过禁用项与首字母定位用 `kit/lib/roving.ts`
- 弹层在顶层渲染, 不会被 `Modal`/`Drawer` 压住

## 6. 验证与提交

- `bun run ci`(格式, 类型, 文档, 测试)
- 交互类组件(键盘, 焦点, 弹层, 对话框)在展示站里实测: 键盘操作, 明暗两套, 打开与关闭后的焦点位置; 目前没有自动化的浏览器测试
- 对外可见的改动在 `CHANGELOG.md` 的 `## Unreleased` 加一条; 提交到 `dev`, 发版流程见 `AGENTS.md`
