---
title: 接入 Zag.js
type: design
status: published
updated: 2026-11-10
---

# 接入 Zag.js

## 1. 目标与范围

用 Zag.js(`@zag-js/preact` 加各组件包)提供复杂交互组件的行为与可访问性, 样式仍由本库 token 提供. 取代 [无样式组件库调研](../record/2026-10-31-headless-library-survey.md) §5 的"不引入"结论

范围: 依赖形态, 封装方式, 样式与定位约定, 新增组件, 现有组件的全面迁移, 布局组件的补全. 不含各组件的属性细节

## 2. 现状与约束

- 原结论的唯一否决理由是"不接受依赖 `preact/compat`". `@zag-js/preact` 1.47.0 确实引用它(`useSyncExternalStore`, 门户 `Portal`, `flushSync`), 但在 Preact 11 下可用: skills-hub 已在生产使用 `menu` `select` `tabs` `toast` `tooltip` `dialog` `file-upload`
- 本次决策放宽该约束: 允许依赖 `preact/compat`. `preact` 本身已是 peer 依赖, `preact/compat` 随它提供, 不新增包
- 现有弹层基于 Popover API 与 CSS anchor positioning, 只在 Chromium 验证过(见 ROADMAP 待决策"浏览器下限"); Zag 用 JS 定位(`@zag-js/popper`), 不依赖这两项
- `MentionInput` 基于 ProseMirror, `Suggest` 要求焦点留在输入框, 二者与 Zag 的 `combobox` 场景不同, 不迁移

## 3. 方案

### 3.1 依赖形态

- `@zag-js/preact` 与用到的 `@zag-js/<组件>` 放 `dependencies`, 版本精确锁定同一个版本号(Zag 各包的 `core`, `utils` 需要保持一份)
- 否决放可选 peer: Zag 包数量多且必须同版本, 让使用方逐个安装并对齐版本的成本高于它带来的体积收益; 按子路径导出, 未导入的组件不进打包
- 否决放必选 peer: 使用方没必要自己管理这些包

### 3.2 封装

- 对外只暴露本库风格的组件: 受控 `value` + `onChange`, 或 `@preact/signals` 的 `field`(与 `lib/signals` 的 `Bound` 一致); 不把 `useMachine`/`connect` 暴露给使用方
- 一个组件一个目录, 文件约定不变(`index.tsx`, `<name>.css`, `<name>.demo.tsx`); 纯逻辑放 `lib/` 并写测试
- 固定文案走 `kit/texts.ts`, 经 Zag 的 `translations` 注入

### 3.3 样式

- 用 Zag 的 `data-part`/`data-state` 属性做选择器, 但仍以组件类名为前缀(`.combobox [data-part="item"]`), 不写裸属性选择器
- 颜色仍只出现在 `tokens.css`; 动效仍遵守 `motion.css`
- 弹层的共用样式沿用 `_shared/popover.css` 的视觉, 定位交给 Zag popper, 不再写 `anchor-name`

### 3.4 新增组件(优先使用 Zag)

- `Combobox`, `DatePicker`/`DateRangePicker`, 多选标签输入(`tags-input`), `Slider`, 通用文件上传(`file-upload`, 作为 `PictureDropzone` 的基础), `Popover`(通用), 页码版 `Pagination`(无需 Zag), `Stepper`(无需 Zag)
- `CommandPalette` 基于 `dialog` 加 `combobox` 或 `listbox`, 先在实施时验证再定

### 3.5 现有组件的迁移

全面迁移: Zag 有对应机器的组件都改由 Zag 驱动, 不并存两套实现(旧写法删净, 不留兼容层)

- `Modal`/`Drawer` → `dialog`; `Dropdown` → `menu`; `Select` → `select`; `Tooltip` → `tooltip`; `Toast` → `toast`; `Tabs` → `tabs`; `Switch` → `switch`; `RadioGroup` → `radio-group`; `Accordion` → `accordion`; `Progress` → `progress`; `NumberField` → `number-input`
- 迁移保持对外属性不变; 属性必须变时按不兼容改动在 CHANGELOG 标明
- 无对应机器的保留自写: `Button`, `Badge`, `Card`, `Tag`, `Avatar`, `Breadcrumb`, `Alert`, `Note`, `Empty`, `Skeleton`, `Spinner`, `Pager`, `DataTable` 等
- 保留不迁移: `Suggest`, `MentionInput`(见 §2)
- 迁移后 `_shared/popover.css`, `lib/anchor`, `lib/roving`, `lib/leaving-dialog` 中不再被引用的部分当场删除
- 分批进行, 每批一个提交, 每批过 `bun run ci` 并在浏览器里实测明暗两套

### 3.6 布局组件

补全从 skills-hub 借鉴的布局原语, 合并进 `primitives/layout`, 保持间距只用 `--space-*` token:

- `Split`: 主区加固定宽度侧栏, 可置于左侧, 窄屏堆叠
- `Spacer`: 在 `direction="row"` 的 `Stack` 里把后续兄弟推到行尾
- `Stack` 的 `wrap` 控制, `Grid` 在窄屏收紧间距
- `Page`: 标题块加正文, 标题与正文的间距由它负责, 正文子元素按 `gap` 堆叠(现有 `PageHead`/`Section` 之上的组合, 不重复造)
- 否决照搬 skills-hub 的独立 `Row`: `Stack direction="row"` 已覆盖

### 3.7 同步修改的文档

- `AGENTS.md` 的"不依赖 `preact/compat`"与依赖清单
- ROADMAP 的"暂缓"与"待决策"
- 调研记录 §5 改为指向本文档
- `docs/guide/add-component.md` §5: 弹层类组件的做法改为 Zag 路径

### 3.6 同步修改的文档

- `AGENTS.md` 的"不依赖 `preact/compat`"与依赖清单
- ROADMAP 的"暂缓"与"待决策"
- 调研记录 §5 改为指向本文档
- `docs/guide/add-component.md` §5: 弹层类组件的做法增加 Zag 路径

## 4. 明确不做

- 不引入 Ark UI(再包一层 React 组件, 与 Zag 重复)
- 不迁移 `Suggest`, `MentionInput`

## 5. 开放项

- 同步使用方: skills-hub 目前自带基于 Zag 的 `ActionMenu` `FilterMenu` `FileDrop`, kit 对应组件就绪后再让它改用 kit
- 未验证: 输入法组字, 触屏, Firefox 与 Safari, 读屏播报; 每个新增组件落地时在浏览器实测, 明暗两套
