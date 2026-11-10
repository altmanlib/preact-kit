# Changelog

版本遵循 [SemVer](https://semver.org/lang/zh-CN/); 1.0 之前, 次版本号可含不兼容改动

## Unreleased

- `Field` `TextField` `TextAreaField` 以及共用 `FieldNotes` 的控件: 错误与提示有稳定 `id`, 控件带 `aria-invalid` 与 `aria-describedby`; `.input[aria-invalid="true"]` 使用与数字输入框相同的红色边框
- `TextField` 在 `type="email"` 时默认 `spellcheck={false}` 与 `autocomplete="email"`, 显式传入的属性仍优先生效
- 输入框与组合控件(`.control-box:focus-within`)改用与全局 `:focus-visible` 相同的 2px 环 + 2px 偏移, 焦点环无动画; `CommandPalette` 搜索框补上可见焦点
- `IconButton` 补上禁用样式, 悬停不作用于 `:disabled`
- `DataTable` 的 `.num` 列使用 `tabular-nums`; 标题 `h1` `h2` `h3` 使用 `text-wrap: balance`; 对话框与命令面板的滚动区加 `overscroll-behavior: contain`
- 交互元素在 `base.css` 上使用 `touch-action: manipulation` 并设置点按高亮
- 示例里作为提示的 placeholder 以省略号结尾

## 0.12.0 - 2026-11-10

- 新增 `CopyBlock`: 只读多行 `<pre>`(等宽字体, 保留换行, 长行换行, 过高时滚动), 右上角是 `CopyButton`; 与 `CopyButton`/`CopyField` 同入口(`primitives/actions/copy`); `label` 为无障碍名称(与 `CopyField` 一样必填), 可选 `copyTitle` 与 `class`
- `Button` 与 `LinkButton` 新增 `busy`: 显示小号 `Spinner`, 禁止点击, 宽度保持不变(标签仍占位, 旋转图标叠在上面). `Button` 为 `disabled` + `aria-busy`, 并保留该变体的底色(不像 `disabled` 那样褪成禁用态); `LinkButton` 为 `aria-disabled` + `aria-busy` 并阻止跳转
- `Empty` 的 `compact` 默认改为左对齐(用于列表或面板; 原先继承 `.empty` 的居中). 新增可选 `align`(`start` | `center`); 非 `compact` 仍默认居中

## 0.11.1 - 2026-11-10

- 修复 `LinkButton` hover 字色被 `base.css` 的 `a:hover` 盖掉(`primary`/`danger` 等叠在品牌底上不可读): 全局链接 hover 改为 `a:hover:not(.btn)`

## 0.11.0 - 2026-11-09

- **primitives 按类别分子目录**(不兼容): 导入路径由 `primitives/<名>` 改为 `primitives/<类别>/<名>`, 类别为 `actions` `form` `selection` `overlays` `navigation` `feedback` `data-display` `layout` `foundations`(与展示站侧边栏一致); `primitives/layout` 改为 `primitives/layout/layout`, `primitives/glide` 改为 `primitives/layout/glide`, `primitives/dialog-host` 改为 `primitives/overlays/dialog-host`
- **统一取值方式**(不兼容): 所有承载值的控件都用 `Bound<T>`, 二选一传 `field` 信号或 `value` + `onChange`. `Bound` 的 `onValue` 改名为 `onChange`(`TextField` `TextAreaField` `CheckField` `NumberField` `Switch` `SearchInput`; 包装原生元素的控件不再透传原生的 `onChange` 事件); `Select` `Combobox` `RadioGroup` `Slider` `RangeSlider` `TagsInput` `DatePicker` `DateRangePicker` `Tabs` 新增 `field` 用法; `FileUpload` 的 `files`/`onFiles` 改为 `value`/`onChange`; `Chips` 新增 `field` 用法; `Pager` 的 `page`/`onPage` 改为 `value`/`onChange`; `Select` 的 `onChange`/`field` 类型由 `string` 放宽为 `string | undefined`

- 提取共用部件: `field` 新增 `FieldNotes` 与 `isInvalid`, `select` 新增 `OptionList`(`Select`/`Combobox` 共用), 新增 `lib/zag`(`popupPositioning`, `inputProps`), 对话框共用内部的 `DialogLayer`/`DialogHead`; 新增 `.control-box` 类与 token `--focus-glow`(`TagsInput`, `DatePicker`, `SearchInput` 的输入框外观收并到这里)
- `Modal`/`Drawer` 的内部类名 `.modal-head` `.modal-body` `.drawer-head` 合并为 `.dialog-head` `.dialog-body`(**不兼容**: 依赖这些类名覆盖样式的调用方需要调整)
- `FileUpload` 的提示行顺序改为先 hint 后拒绝原因, 与其他控件一致; 修复 `CommandPalette` 的 `aria-label` 没有写到对话框上

- `IconButton`(含 `CopyButton`/`CopyField` 里的复制图标)按下时不再缩小, 改为填充色略微加深

- **接入 Zag.js**(设计见 `docs/design/2026-11-10-01-zag-adoption.md`): `@zag-js/preact` 与各组件包成为运行时依赖(`dependencies`, 版本精确锁定同一个), 本库允许依赖 `preact/compat`
- `Select`, `Dropdown`, `Tooltip` 改由 Zag 驱动, 属性不变; 弹层由 Zag popper 用 JS 定位(`position: fixed`, 不被滚动祖先裁剪), 不再依赖 CSS anchor positioning; 弹层只有进场动画, 没有退场动画. `Tooltip` 的 `children` 由单个元素放宽为任意内容(**不兼容**: 此前给子元素加的 `aria-describedby` 现在加在外层的 `span` 上)
- `Modal`, `Drawer` 改由 Zag dialog 驱动(焦点陷阱, 滚动锁定, 关闭后焦点归还), 不再用原生 `<dialog>`, 渲染在 `document.body` 的传送门里; 属性不变. 移除 `html.dialog-open` 类. `lib/leaving-dialog` 的 `useLeavingDialog` 改为返回 `{ api, exiting, leave, leaving }`(**不兼容**: 直接使用它的调用方需要调整)
- `Toaster`/`showToast` 改由 Zag toast 驱动: 堆叠, 进出场与暂停由它处理, 堆叠在所有层之上. `showToast` 返回的 id 由 `number` 改为 `string`; `lib/toasts` 的 `toasts` 信号, `removeToast` 移除, 新增 `toaster`(Zag store)与 `toneOf`(**不兼容**)
- `Tabs` 改由 Zag tabs 驱动, 属性不变
- 新增 `Combobox`(输入过滤的单选), `Popover`(通用弹层), `Slider`/`RangeSlider`, `TagsInput`(标签输入: 回车或分隔符添加, 退格删除, 粘贴拆分, 失焦提交, 忽略大小写的去重), `FileUpload`(点击或拖入选文件, 类型/大小/数量限制, 只选不传), `DatePicker`/`DateRangePicker`(值始终是 `YYYY-MM-DD`, 可键入或用日历选, 月与年视图, `min`/`max`, `locale`)
- 新增 `CommandPalette`(搜索并执行的对话框: 焦点留在输入框, 方向键移动高亮, Enter 执行, 分组标题, 可由调用方自己过滤), `SearchInput`(工具栏紧凑过滤框, Esc 清空)
- 布局: `Stack` 新增 `wrap`, 新增 `Spacer` `Split` `Container` `Page`; `Grid` 窄屏收紧间距; 新增 token `--container-sm/md/lg` `--z-dialog`
- **新增运行时依赖** `@internationalized/date`(`DatePicker` 的日期解析); `lib/format` 新增 `formatBytes`; `kit/texts` 新增 `noResults` `showOptions` `today` `fileInvalidType` `fileTooLarge` `fileTooSmall` `tooManyFiles` `fileRejected`

## 0.10.0 - 2026-11-05

- `Toaster` 的默认位置由右下角改为靠近底部居中(**不兼容**: 依赖右下角位置的调用方需自行覆盖 `.toaster` 的定位)
- `Toast` 去掉边框, 按类型换成对应的底色(`--idle-soft` 与新增 token `--toast-ok`/`--toast-warn`/`--toast-bad`, 比 `-soft` 系列饱和, 明暗两套); 进场动画更柔和(更长, 上浮更远, 带轻微缩放)

## 0.9.1 - 2026-11-04

- `Modal` 新增可选的 `footerStart`: 放在表单底栏起始侧, 与取消/确认相对

## 0.9.0 - 2026-11-04

- 新增 `MentionInput`: 提及显示为行内标签(chip)的输入框. 输入触发字符(如 `@`)后列出候选, 选中后把已输入的文字换成一个 chip, chip 整块选中与删除; 输入框里的内容始终是纯文本(`onChange`/`onSubmit` 得到字符串, chip 即其文字, 换行为 `\n`), 粘贴与拖入只保留文本, 不产生标记. Enter 提交, Shift+Enter 换行, 候选列表打开时 Enter/Tab 选择, Esc 关闭; 清空与聚焦经 `handle`. 基于 ProseMirror(组字输入, 撤销, 光标交给它处理), 不依赖 `preact/compat`
- **新增可选 peer 依赖**: `prosemirror-state`, `prosemirror-view`, `prosemirror-model`, `prosemirror-history`, `prosemirror-keymap`, `prosemirror-commands`, 只有用 `MentionInput` 时才需要安装
- `Suggest` 的候选列表抽成内部的 `SuggestList` 与 `useManualPopover`, 与 `MentionInput` 共用; `Suggest` 的对外接口不变

## 0.8.0 - 2026-11-04

- 新增 `Suggest`: 包住一个 `<input>`/`<textarea>`, 光标紧跟触发字符(如 `@`, `#`)时在其下方列出候选; 焦点留在输入框, 方向键移动高亮, Enter/Tab 选择, Esc 关闭, 列表打开时这几个键不会到达输入框自己的处理(Enter 不会同时提交), 输入法组字期间不拦截; 选择后经 `onPick` 交回新值与光标位置, 组件负责把光标放回去; 输入框自动带上 combobox 的 ARIA 属性
- 新增 `lib/suggest`(`findTrigger`, `applyPick`, `suggestAction`): 触发判定(邮箱 `a@b` 与 `@@` 不算, `你好@` 算; 规则可由 `notAfter` 替换), 应用选择, 按键含义, 均为纯函数并有测试

## 0.7.0 - 2026-11-04

- `Toast` 有进出场动画: 进场淡入上浮, 退场淡出并收起高度(其余 toast 不跳位); `dismissToast(id)` 改为只标记 `leaving`, 由 `Toaster` 在退场动画结束后用新增的 `removeToast(id)` 移除, 所以 `toasts` 里的项在退场期间仍在列表中(**不兼容**: 直接读 `toasts` 判断是否已关闭的调用方需改看 `leaving`)
- 新增 `lib/leave`(`afterLeave(element, done)`: 退场动画结束后回调一次, 带超时兜底), `Modal`/`Drawer`/`Toast` 共用
- `Accordion` 展开与收起有高度过渡(`::details-content` 加 `interpolate-size`, 仅 Chromium; 其他浏览器仍是瞬时)
- 新增 token `--press-scale`(0.97): `Button`(`text` 变体除外), `IconButton`, `Chips` 按下时轻微缩小; `Button` 的 hover 过渡补上文字颜色; 弹层列表项(`.pop-item`)的 hover 补上过渡
- 新增 `src/kit/motion.test.ts`: 扫描全部样式表, 除 `tokens.css` 外出现字面时长或曲线即失败; 展示站新增 Motion 页, 并排演示时长与缓动 token

- 弹层(`Dropdown`/`Select`/`Tooltip`)关闭时有退出过渡(淡出加下沉, `--ease-in`), 进入与退出都改用 transition(`@starting-style`); `TopNav` 的 hover 颜色与底色块由 `--duration-enter` 改为 `--duration-fast`
- 动效 token 统一: 新增 `--ease-in`(退出动画用, `Modal` 与 `Drawer` 的退出由 `--ease-out` 改为它), `--ease-linear`, `--duration-spin`(800ms), `--duration-loop`(1200ms); `Spinner`, `Skeleton`, `Progress` 的循环动画改用 token, `Skeleton` 的闪烁周期由 1.4s 变为 1.2s

## 0.6.0 - 2026-11-04

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
