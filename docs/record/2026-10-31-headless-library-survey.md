---
title: 无样式组件库调研
type: record
status: published
updated: 2026-11-04
---

# 无样式组件库调研

为 `Combobox`, `DatePicker`/`DateRangePicker`, 多选标签输入, `Slider` 这类定位与焦点管理复杂的组件, 评估是否引入无样式(headless)库, 以及引入哪一个. 结论见 §5

## 1. 评估口径

- 能在 Preact 11 下使用, 且不依赖 `preact/compat`(含库内部对它的引用)
- 只提供行为与可访问性, 样式由本项目 token 提供
- 按组件拆包, 不用的组件不进打包
- 覆盖 ROADMAP 里待做的复杂组件, 不只是 Combobox

## 2. 候选(版本与数据取自 2026-10-31 的 npm 元数据)

| 方案 | 版本 | 框架绑定 | 说明 |
| ---- | ---- | -------- | ---- |
| Zag.js(`@zag-js/preact` + `@zag-js/<组件>`) | 1.47.0, 最近发布 2026-10-26 | 有 Preact 官方适配器, peer 依赖 `preact>=10`; 另有 React/Vue/Solid/Svelte 适配器 | MIT; 状态机加 `connect` 得到各部分的属性; 同套含 `combobox`/`date-picker`/`tags-input`/`slider`/`popover`/`tooltip`/`menu`/`select` |
| Ark UI | 5.40.0 | React 组件(底层是 Zag) | 在 Preact 里要多一层 compat |
| Downshift(`useCombobox`) | 9.4.0 | peer 依赖只有 React | 只覆盖 Combobox/Select 一类 |
| React Aria Components | 1.22.1 | peer 依赖只有 React | 覆盖面广, 未压缩体积约 6.9MB |
| Headless UI | 2.2.10 | peer 依赖只有 React | 组件数量少 |
| Base UI | 1.0.0-rc.0 | peer 依赖只有 React | 尚是候选发布版 |
| Radix UI(各 `react-*` 包) | 如 popover 1.3.1 | peer 依赖只有 React | 无 Combobox |
| 自己写 | - | - | 在现有 Popover 基础上, Combobox 约百余行 |

## 3. 验证

在 `/tmp` 的独立项目里验证, 未改动本仓库: Preact 11.1.0, `@zag-js/preact` 与 `@zag-js/combobox` 1.47.0, Bun 1.4.4 的 HTML 开发服务器, Chromium

- 约 30 行实现一个带过滤的 Combobox
- 输入 `ap` 后列表为 Apple, Apricot, Grape
- ArrowDown 再 Enter 选中 Apple, 取值与输入框同步
- 控制台无报错
- `@zag-js/preact` 内部引用 `preact/compat`(`useSyncExternalStore`, 门户), 在 Preact 11.1.0 下可用

未验证: 输入法组合输入, 触屏, Firefox 与 Safari, 日期选择器, 标签输入, 滑块, 读屏播报

## 4. 取舍

引入 Zag 的收益:

- 有 Preact 官方适配器, 且一套覆盖多个待做的复杂组件
- `DatePicker` 涉及日历计算, 区域与范围, 自写成本高于 Combobox
- 只提供行为与属性, 样式用 token, 明暗主题不受影响

引入 Zag 的代价:

- 新增依赖: `@zag-js/preact` 加用到的组件包及其间接依赖(core, popper, dismissable 等)
- 样式通过 `data-part`/`data-state` 属性选择, 与现有 `.pop-item` 的类名风格不同
- Zag 的定位是 JS(`@zag-js/popper`), 与本项目现有弹层的 CSS anchor 定位并存
- API 是状态机加 `connect`, 与本项目基于 signal 的组件风格不同, 需要封装一层

## 5. 结论

不引入 Zag.js, 也不引入其他候选. 原因: 本项目不接受依赖 `preact/compat`; Zag 的 Preact 适配器内部引用它(§3), 其余候选只有 React 绑定, 在 Preact 里同样要经 compat

复杂组件(`Combobox`, `DatePicker`/`DateRangePicker`, 多选标签输入, `Slider`)在 Popover API 与 CSS anchor positioning 之上自写, 复用 `lib/roving`, `lib/anchor` 与 `lib/suggest`; `Suggest` 已按此实现

例外: `MentionInput`(提及显示为 chip)基于 ProseMirror 的 `prosemirror-*` 包, 它们是纯 JS, 不绑定任何框架, 不经 `preact/compat`; 选型与取舍见 [2026-11-04-01-mention-input.md](../design/2026-11-04-01-mention-input.md)
