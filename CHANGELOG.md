# Changelog

版本遵循 [SemVer](https://semver.org/lang/zh-CN/); 1.0 之前, 次版本号可含不兼容改动

## Unreleased

- 新增 `NavList`(竖排可选项列表): 每项有标题, 可选次要文字, 可选 `leading`/`trailing` 插槽; 有 `href` 的是链接, 没有的是按钮(`onSelect(key)`), 选中项带 `aria-current`; 方向键, Home, End 移动焦点(跳过禁用项); 过长文字省略
- 新增 `lib/theme`(`Theme`, `theme` 信号, `applyTheme(options)`): 把主题写到 `<html data-theme>`(`system` 时移除属性), 存 localStorage(`storageKey` 可注入, 默认 `preact-kit:theme`); 没有 `localStorage` 或 `document` 时不报错; 新增 `ThemeSwitch`(系统/浅色/深色三档的单选组, `showLabels` 显示文字); `kitText` 新增 `theme`/`themeSystem`/`themeLight`/`themeDark`; 展示站改用它, 删除 `gallery/theme.ts`
- `Note` 新增 `action`(行尾操作, 通常是 `Button`); `ErrorNote` 的重试改为用它和 `Button` 的 `text` 变体, 位置从文字后面移到行尾, 删除 `.note-retry`
- `Empty` 新增 `compact`(无插图, 无底色, 间距更小, 用于列表或面板里)
- `Button` 与 `LinkButton` 新增 `variant="text"`(链接式, 任何状态都没有底色, 比 `quiet` 更轻)
- `TextField`, `TextAreaField`, `CheckField`, `NumberField`, `Switch` 可以不用信号: 传 `value` 与 `onValue` 代替 `field`, 二选一(类型上互斥); 新增 `lib/signals` 的 `Bound` 与 `bound`; `TextField` 与 `TextAreaField` 的 `onInput` 由组件自己管理, 传入的会被忽略

## 0.5.0 - 2026-10-31

- 新增 `LinkButton`(按钮外观的链接, 用于跳转或下载), 与 `Button` 同在 `primitives/button`
- 新增 `QueryStatus`(读取未完成时显示骨架或带重试的错误, 有数据后不画); `QueryTable` 改用它

## 0.4.0 - 2026-10-31

- 新增 `TopNav`(顶栏标签, 一条指示线滑向当前页)与 `isCurrentPath`; `kitText` 新增 `mainNavigation`
- 新增 `lib/format`: `formatTime`(本地时间 `YYYY-MM-DD HH:mm:ss`)
- `DataTable` 与 `QueryTable` 新增 `rowAttrs`(给行加 `data-*` 等属性)
- `Section` 与 `Tile` 新增 `class`, 其余属性透传给根元素

## 0.3.0 - 2026-10-31

- **不兼容**: 包名改为 `@altmanlib/preact-kit`, 经 GitHub 安装(`github:altmanlib/preact-kit#v<版本>`), 按子路径导入(`primitives/<名>` `patterns/<名>` `lib/<名>` `texts` `base.css` `tokens.css` `motion.css`), 不再以拷贝 `src/kit/` 的方式使用; `preact` 与 `@preact/signals` 改为 peer 依赖, `@tanstack/preact-query` 为可选 peer
- **不兼容**: `src/assets.d.ts` 移到 `src/kit/assets.d.ts`, 使用方在 `tsconfig.json` 的 `types` 加 `@altmanlib/preact-kit/assets`; 删除 `src/jsx.d.ts`(Preact 11.1 已自带 Popover 属性类型)

## 0.2.0 - 2026-10-31

- 新增 `Switch`, `Tabs`(纯状态, 方向键/Home/End 切换)
- 新增 `Alert`(图标/标题/操作/可关闭), `Spinner`, `Progress`(确定与不确定), `Tag`(可移除), `Avatar`(图片失败或缺失时显示姓名首字), `Card`, `Breadcrumb`, `Accordion`(基于原生 `details`, 默认互斥), `Stack`/`Grid`; `kitText` 新增 `remove`/`breadcrumb`
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
