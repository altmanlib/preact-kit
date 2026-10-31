# ROADMAP

## 已完成

- 骨架: 目录, 展示站(自动收集 demo, 明暗/跟随系统切换), token(`light-dark()`), 边界检查
- primitives: `Button` `Badge` `Note`/`ErrorNote` `Empty` `Skeleton` `Tile`/`Tiles` `Fact`/`Facts` `PageHead`/`Section` `Chips` `SubNav` `Pager` `GlideHeight` `Field`/`TextField`/`TextAreaField`/`CheckField` `IconButton` `CopyButton`/`CopyField` `ConfirmButton` `DataTable`/`QueryTable` `Modal` `Drawer` `DialogProvider`/`useDialog` `Switch` `Tabs` `Dropdown` `Select` `Tooltip` `Toast`/`Toaster` `RadioGroup` `NumberField` `Alert` `Spinner` `Progress` `Tag` `Avatar` `Card` `Breadcrumb` `Accordion` `Stack`/`Grid`
- lib: `errors`(`ApiError`/`setErrorTexts`), `http`(`request`/`query`), `signals`(`useFields`/`useOpen`/`set`), `paging`(`usePagedList`, 依赖 `@tanstack/preact-query`), `leaving-dialog`(Modal 与 Drawer 共用的进出场逻辑), `roving`(列表键盘焦点与首字母定位), `anchor`(弹层与触发器的锚点命名), `toasts`(`showToast` 与队列), `number`(数字文本的解析/步进/修正)
- patterns: `ListPage`
- `ConfirmButton` 用 `Modal` 弹出确认框, `onConfirm` 可返回 Promise
- 固定文案集中在 `kit/texts.ts`, 应用用 `setKitText` 改写; API 错误码文案用 `setErrorTexts` 注册
- 弹层(`Dropdown`/`Select`/`Tooltip`/`Toast`)基于 Popover API 与 CSS anchor positioning, 共用样式在 `primitives/_shared/popover.css`

## 近期建议(接着做时从这里选)

- 弹层与对话框键盘行为的 e2e 冒烟测试(`bun run ci` 目前不覆盖浏览器行为)
- 迁入原有的通用单元: `TopNav`, `SecretMask`/`SecretReveal`, `formatTime`/`downloadFile`(见待办)
- 决定是否引入 Zag.js(见待决策); 决定后再做 `Combobox`/`DatePicker`

## 暂缓(较重, 等用户启动)

- `Combobox`, `DatePicker`/`DateRangePicker`, 多选标签输入, `Slider`: 先决定是否引入 Zag.js, 见待决策
- `CommandPalette`, `ContextMenu`, `Tree`, 虚拟列表, 表格排序/多选/列显隐/固定列, 图表(折线/柱/饼), `Sidebar` 布局

## 待办(无顺序)

- 依赖包分发的迁移(决策见 [docs/record/2026-10-31-package-distribution.md](docs/record/2026-10-31-package-distribution.md)): 包改造已完成, 待发版后让使用方改依赖并删除本地重复单元
- 待迁入或新增的通用单元: `TopNav`(滑动指示条), `SecretMask`/`SecretReveal`, `PictureDropzone`(通用文件上传的基础), `Login` 与 `useCodeSender`, `PageRoot`/`SessionGate`(会话外壳), `formatTime`/`downloadFile`
- 表单: 表单校验范式
- 浮层: `Popover`(通用)
- 导航: 页码版 `Pagination`, `Stepper`
- 数据展示: `Timeline`
- 布局: `Container`, 响应式断点约定
- 基础: i18n, 图标规范, 可访问性检查(焦点陷阱, 键盘导航), 展示站里的 e2e 冒烟(目前弹层的键盘行为只做过手工验证)
- patterns: 设置页, 登录页, 成员管理

## 待决策

- `Combobox`/`DatePicker` 这类定位与焦点管理更复杂的组件: 是否引入 Zag.js(候选对比、验证与取舍见 [docs/record/2026-10-31-headless-library-survey.md](docs/record/2026-10-31-headless-library-survey.md)); 若引入, 先做 `Combobox` 还是 `DatePicker`
- 浏览器下限: 弹层依赖 Popover API 与 CSS anchor positioning, 只在 Chromium 上验证过; 需要覆盖其他或更老的浏览器时再验证并加回退
