# ROADMAP

## 已完成

- 骨架: 目录, 展示站(自动收集 demo, 明暗/跟随系统切换), token(`light-dark()`), 边界检查, `Button`

## 第 2 步: 迁入可通用的现有单元


- [ ] `DataTable`/`QueryTable`(查询状态与表格拆开, 不绑 TanStack Query)
- [ ] `Chips`, `Pager`, `PageHead`, `Section`, `Note`, `Tile`, `Fact`, `Badge`, `Empty`
- [ ] `TextField`/`TextAreaField`/`Field`/`CheckField`
- [ ] `Modal`, `Drawer`, `DialogProvider`, `ConfirmButton`
- [ ] `CopyButton`/`CopyField`
- [ ] `lib/`: `signals`(`useFields`/`useOpen`), `http`(请求内核), `paging`

## 第 3 步: 新增组件

- [ ] `Toast`
- [ ] `Select`
- [ ] `Switch`
- [ ] `Tabs`
- [ ] `Dropdown`
- [ ] `Tooltip`(浮层先用 Popover API + CSS anchor positioning 写简版)

## 待办(无顺序)

- 表单控件: `Radio`/`RadioGroup`, `NumberField`, `DatePicker`/`DateRangePicker`, `Combobox`, 多选标签输入, `Slider`, 通用文件上传, 表单校验范式
- 反馈: `Spinner`/`Progress`, 独立 `Skeleton`, `Alert`
- 浮层: `Popover`, `ContextMenu`, `CommandPalette`
- 导航: `Breadcrumb`, 页码版 `Pagination`, `Stepper`, `Sidebar` 布局
- 数据展示: `Avatar`, `Tag`, `Card`, `Accordion`, `Timeline`, `Tree`, 表格排序/多选/列显隐/固定列, 虚拟列表
- 图表: 折线/柱/饼
- 布局: `Stack`/`Grid`/`Container`, 响应式断点约定
- 基础: i18n, 图标规范, 可访问性检查(焦点陷阱, 键盘导航), 展示站里的 e2e 冒烟

## 待决策

- Combobox/DatePicker 这类定位与焦点管理复杂的浮层: 自写, 还是引入无样式库再套 token; 做到该项时评估
