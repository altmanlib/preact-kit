# ROADMAP

## 已完成

- 骨架: 目录, 展示站(自动收集 demo, 明暗/跟随系统切换), token(`light-dark()`), 边界检查
- primitives: `Button` `Badge` `Note`/`ErrorNote` `Empty` `Skeleton` `Tile`/`Tiles` `Fact`/`Facts` `PageHead`/`Section` `Chips` `SubNav` `Pager` `GlideHeight` `Field`/`TextField`/`TextAreaField`/`CheckField` `IconButton` `CopyButton`/`CopyField` `ConfirmButton` `DataTable`/`QueryTable` `Modal` `Drawer` `DialogProvider`/`useDialog` `Switch` `Tabs` `Dropdown` `Select` `Suggest` `MentionInput`(设计见 [docs/design/2026-11-04-01-mention-input.md](docs/design/2026-11-04-01-mention-input.md)) `Tooltip` `Toast`/`Toaster` `RadioGroup` `NumberField` `Alert` `Spinner` `Progress` `Tag` `Avatar` `Card` `Breadcrumb` `Accordion` `Stack`/`Grid`
- lib: `errors`(`ApiError`/`setErrorTexts`), `http`(`request`/`query`), `signals`(`useFields`/`useOpen`/`set`), `paging`(`usePagedList`, 依赖 `@tanstack/preact-query`), `leaving-dialog`(Modal 与 Drawer 共用的进出场逻辑), `roving`(列表键盘焦点与首字母定位), `anchor`(弹层与触发器的锚点命名), `toasts`(`showToast` 与队列), `number`(数字文本的解析/步进/修正), `suggest`(触发字符的判定, 应用选择与按键含义)
- primitives 另有 `LinkButton`, `QueryStatus`, `TopNav`(顶栏标签与滑动指示条); `DataTable`/`QueryTable` 的 `rowAttrs`, `Section` 与 `Tile` 的 `class` 及透传属性; lib 另有 `format`(`formatTime`)
- primitives 另有 `NavList`(竖排可选项列表: 标题, 次要文字, 前后插槽, `aria-current`, 方向键/Home/End), `ThemeSwitch`(系统/浅色/深色三档, 绑定 `lib/theme` 的 `theme`); lib 另有 `theme`(`theme` 信号, `applyTheme`: 写 `<html data-theme>`, `system` 时移除, 存 localStorage, key 可注入, 无 `localStorage`/`document` 时降级); 展示站的主题切换用的就是它
- `Note` 的 `action`(行尾操作, `ErrorNote` 的重试基于它), `Empty` 的 `compact`, `Button`/`LinkButton` 的 `text` 变体
- `TextField`/`TextAreaField`/`CheckField`/`NumberField`/`Switch` 两种取值方式二选一: `field` 信号, 或普通受控的 `value` + `onValue`(`lib/signals` 的 `Bound`/`bound`); `Select`/`RadioGroup` 本来就是 `value` + `onChange`
- patterns: `ListPage`
- `ConfirmButton` 用 `Modal` 弹出确认框, `onConfirm` 可返回 Promise
- 固定文案集中在 `kit/texts.ts`, 应用用 `setKitText` 改写; API 错误码文案用 `setErrorTexts` 注册
- 接入 Zag.js(设计见 [docs/design/2026-11-10-01-zag-adoption.md](docs/design/2026-11-10-01-zag-adoption.md)): `Select` `Dropdown` `Tooltip` `Toast` `Modal` `Drawer` `Tabs` 由 Zag 驱动, 新增 `Combobox` `Popover` `Slider`/`RangeSlider` `TagsInput` `FileUpload` `DatePicker`/`DateRangePicker` `CommandPalette` `SearchInput`; 弹层共用样式在 `primitives/_shared/popover.css`(`.popup`), 对话框的层在 `_shared/dialog.css`
- `Suggest`/`MentionInput` 是焦点留在输入框的候选列表(`popover="manual"`, Popover API 与 CSS anchor positioning), 不迁移
- 布局: `primitives/layout` 含 `Stack`(`wrap`) `Spacer` `Grid` `Split` `Container` `Page`; 窄屏断点 760px

## 近期建议(接着做时从这里选)

- 弹层与对话框键盘行为的 e2e 冒烟测试(`bun run ci` 目前不覆盖浏览器行为)
- 迁入原有的通用单元: `SecretMask`/`SecretReveal`, `downloadFile`(见待办)
- skills-hub 改用 preact-kit 的 `Select`/`Dropdown`/`Tooltip`/`Toast`/`Modal`/`Tabs`/`TagsInput`/`FileUpload`/`SearchInput`/`CommandPalette`, 删除它自带的重复实现

## 暂缓(较重, 等用户启动)

- `ContextMenu`, `Tree`, 虚拟列表, 表格排序/多选/列显隐/固定列, 图表(折线/柱/饼), `Sidebar` 布局

## 待办(无顺序)

- 依赖包分发的迁移(决策见 [docs/record/2026-10-31-package-distribution.md](docs/record/2026-10-31-package-distribution.md)): 包改造已完成, 待发版后让使用方改依赖并删除本地重复单元
- 待迁入或新增的通用单元: `SecretMask`/`SecretReveal`, `PictureDropzone`(基于 `FileUpload` 的图片预览), `Login` 与 `useCodeSender`, `PageRoot`/`SessionGate`(会话外壳), `downloadFile`
- 表单: 表单校验范式
- 导航: 页码版 `Pagination`, `Stepper`
- 数据展示: `Timeline`
- 动效: JS 层的交互缓动(拖拽/手势的惯性与回弹, 数值滚动过渡, 弹簧动画); 目前只有 CSS 的时长与曲线 token(`tokens.css`, `motion.css`). 触发条件: 出现需要可拖拽排序或计数展示的组件时, 先确定方案再做
- 基础: i18n, 图标规范, 可访问性检查(焦点陷阱, 键盘导航), 展示站里的 e2e 冒烟(目前弹层的键盘行为只做过手工验证)
- patterns: 设置页, 登录页, 成员管理

## 待决策

- 浏览器下限: Zag 组件用 JS 定位, 只在 Chromium 上验证过; `Suggest`/`MentionInput` 还依赖 Popover API 与 CSS anchor positioning. 需要覆盖其他或更老的浏览器时再验证并加回退
