# ROADMAP

## 已完成

- 骨架: 目录, 展示站(自动收集 demo, 明暗/跟随系统切换), token(`light-dark()`), 边界检查
- primitives: `Button` `Badge` `Note`/`ErrorNote` `Empty` `Skeleton` `Tile`/`Tiles` `Fact`/`Facts` `PageHead`/`Section` `Chips` `SubNav` `Pager` `GlideHeight` `Field`/`TextField`/`TextAreaField`/`CheckField` `IconButton` `CopyButton`/`CopyField` `ConfirmButton` `DataTable`/`QueryTable` `Modal` `Drawer` `DialogProvider`/`useDialog`
- lib: `errors`(`ApiError`/`setErrorTexts`), `http`(`request`/`query`), `signals`(`useFields`/`useOpen`/`set`), `paging`(`usePagedList`, 依赖 `@tanstack/preact-query`), `leaving-dialog`(Modal 与 Drawer 共用的进出场逻辑)
- patterns: `ListPage`
- 固定文案集中在 `kit/texts.ts`, 应用用 `setKitText` 改写; API 错误码文案用 `setErrorTexts` 注册

## 第 3 步: 新增组件

- [ ] `Toast`
- [ ] `Select`
- [ ] `Switch`
- [ ] `Tabs`(纯状态版; 现有 `SubNav` 绑路由)
- [ ] `Dropdown`
- [ ] `Tooltip`(浮层先用 Popover API + CSS anchor positioning 写简版)

## 待办(无顺序)

- 待迁入或新增的通用单元: `TopNav`(滑动指示条), `SecretMask`/`SecretReveal`, `PictureDropzone`(通用文件上传的基础), `Login` 与 `useCodeSender`, `PageRoot`/`SessionGate`(会话外壳), `formatTime`/`downloadFile`
- `ConfirmButton` 目前用浏览器 `confirm()`; 可改为基于 `Modal` 的确认框
- 表单控件: `Radio`/`RadioGroup`, `NumberField`, `DatePicker`/`DateRangePicker`, `Combobox`, 多选标签输入, `Slider`, 表单校验范式
- 反馈: `Spinner`/`Progress`, `Alert`
- 浮层: `Popover`, `ContextMenu`, `CommandPalette`
- 导航: `Breadcrumb`, 页码版 `Pagination`, `Stepper`, `Sidebar` 布局
- 数据展示: `Avatar`, `Tag`, `Card`, `Accordion`, `Timeline`, `Tree`, 表格排序/多选/列显隐/固定列, 虚拟列表
- 图表: 折线/柱/饼
- 布局: `Stack`/`Grid`/`Container`, 响应式断点约定
- 基础: i18n, 图标规范, 可访问性检查(焦点陷阱, 键盘导航), 展示站里的 e2e 冒烟
- patterns: 设置页, 登录页, 成员管理

## 待决策

- Combobox/DatePicker 这类定位与焦点管理复杂的浮层: 自写, 还是引入无样式库再套 token; 做到该项时评估
