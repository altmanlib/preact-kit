---
title: 接入 Zag.js
type: design
status: published
updated: 2026-11-10
---

# 接入 Zag.js

## 1. 目标与范围

用 Zag.js(`@zag-js/preact` 加各组件包)提供复杂交互组件的行为与可访问性, 样式仍由本库 token 提供. 取代 [无样式组件库调研](../record/2026-10-31-headless-library-survey.md) 原先"不引入"的结论

范围: 依赖形态, 封装与样式约定, 哪些组件由 Zag 驱动, 布局组件的补全. 不含各组件的属性细节

## 2. 决策

### 2.1 放宽"不依赖 `preact/compat`"

原结论的唯一否决理由是本库不接受 `preact/compat`. `@zag-js/preact` 内部引用它(`useSyncExternalStore`, 门户, `flushSync`), 在 Preact 11 下可用. 本次放宽该约束: 组件可以依赖 `preact/compat`(随 `preact` 提供, 不新增包), 对话框与 Toaster 经 `createPortal` 渲染到 `document.body`

### 2.2 依赖形态

- `@zag-js/*` 与 `@internationalized/date`(`DatePicker` 的日期解析)放 `dependencies`, Zag 各包版本精确锁定为同一个(`core`, `utils` 需要保持一份)
- 否决放可选 peer: Zag 包多且必须同版本, 让使用方逐个安装并对齐的成本高于体积收益; 按子路径导出, 未导入的组件不进打包
- 否决 Ark UI: 它是 Zag 之上的 React 组件, 在 Preact 里多一层 compat 且与 Zag 重复

### 2.3 封装与样式

- 对外只暴露本库风格的组件(`value`/`onChange` 或 signals), 不暴露 `useMachine`/`connect`
- 状态用 `data-part`/`data-state` 选择器, 以组件类名为前缀; 颜色只在 `tokens.css`
- 弹层定位交给 Zag popper(JS), `strategy: "fixed"` 使其不被滚动祖先裁剪; 弹层只有进场动画, 没有退场动画(Zag 关闭时即隐藏内容); 对话框的退场动画靠保持渲染到动画结束

### 2.4 由 Zag 驱动的范围

- 迁移: `Modal` `Drawer`(`dialog`), `Dropdown`(`menu`), `Select`, `Tooltip`, `Toast`, `Tabs`; 旧实现删净, 不并存
- 新增: `Combobox`, `Popover`, `Slider`/`RangeSlider`, `TagsInput`, `FileUpload`, `DatePicker`/`DateRangePicker`; `CommandPalette` 在 `dialog` 之上自写列表(焦点留在输入框, 不用 `combobox` 的弹层)
- 保留原生, 不迁移: `Switch`(`<input role="switch">`), `RadioGroup`(原生单选), `Accordion`(`<details>`), `Progress`, `NumberField`(`lib/number` 有测试的解析与步进). 原生控件已给出同等的键盘, 表单与读屏行为, 换成 Zag 没有收益, 还会失去无脚本与原生表单提交的行为. 触发条件: 出现原生做不到的需求(如自定义滚轮, 复杂格式化)再迁
- 保留自写: `Suggest`, `MentionInput`(焦点必须留在输入框, 与 Zag 的 `combobox` 场景不同), 以及无对应机器的 `Button` `Badge` `Card` 等

### 2.5 布局组件

从 skills-hub 借鉴并合并进 `primitives/layout`, 间距只用 `--space-*`: `Split`(主区加固定侧栏, 窄屏堆叠), `Spacer`, `Container`, `Page`(`PageHead` 加正文堆叠), `Stack` 的 `wrap`, `Grid` 窄屏收紧间距. 窄屏断点统一 760px. 否决独立的 `Row`: `Stack direction="row"` 已覆盖. 新增类名带 `layout-` 前缀, 避免与使用方自带的 `.page` `.split` 冲突

## 3. 已知取舍

- Zag 输入框(`Combobox`, `TagsInput`, `DatePicker`)每次输入同步写回, 两次输入事件间隔不足约 5ms 时会丢字符; 人手输入与粘贴不受影响, 只有脚本零间隔注入会触发
- 弹层没有退场动画
- Zag 的 `date-picker` 键入的是区域格式(如 `11/15/2026`), 对外的值始终是 `YYYY-MM-DD`; 用 `name` 提交时写入的是 ISO 值的隐藏输入, 范围写入 `<name>-start` 与 `<name>-end`
- 未验证: 输入法组字(`CommandPalette` 已在 Enter 上避让), 触屏, Firefox 与 Safari, 读屏播报; 与原先一样只在 Chromium 上实测
