# Changelog

版本遵循 [SemVer](https://semver.org/lang/zh-CN/); 1.0 之前, 次版本号可含不兼容改动

## Unreleased

- 新增 `Switch`, `Tabs`(纯状态, 方向键/Home/End 切换)
- **不兼容**: `ConfirmButton` 改为弹出 `Modal` 确认(原来是浏览器 `confirm()`); `onConfirm` 可返回 Promise, 新增 `title`/`confirmLabel`/`error` 属性, `danger` 按钮得到 `danger` 确认按钮
- `Modal` 新增 `submitVariant`; 没有输入框的表单对话框首次聚焦在提交按钮上
- 新增 `RadioGroup`(带说明/禁用项/错误), `NumberField`(文本型, ± 步进与上下方向键, 失焦时按 `min`/`max` 修正); 新增 `lib/number`; `kitText` 新增 `confirmTitle`/`increase`/`decrease`
- 新增 `Toast`: `showToast()` 在任何地方调用, `Toaster` 挂载一次; 位于顶层, 不会被 Modal/Drawer 压住; `kitText` 新增 `notifications`
- 新增 `lib/roving`: 列表项键盘焦点移动(跳过禁用项)与首字母定位
- 新增 `Dropdown`(动作菜单), `Select`(单选列表, 可带 `name` 随表单提交), `Tooltip`; 基于 Popover API 与 CSS anchor positioning, 无需 JS 定位

## 0.1.0 - 2026-10-31

首个版本

- 展示站: 自动收集 `*.demo.tsx`, 明暗与跟随系统三档主题
- 设计 token: `light-dark()` 成对定义, 动效与减少动态效果统一处理
- primitives: `Button` `Badge` `Note`/`ErrorNote` `Empty` `Skeleton` `Tile` `Fact` `PageHead`/`Section` `Chips` `SubNav` `Pager` `GlideHeight` `Field` 系列 `IconButton` `CopyButton`/`CopyField` `ConfirmButton` `DataTable`/`QueryTable` `Modal` `Drawer` `DialogProvider`
- lib: `errors` `http` `signals` `paging` `leaving-dialog`
- patterns: `ListPage`
- 文案集中在 `kit/texts.ts`, 用 `setKitText` 改写
