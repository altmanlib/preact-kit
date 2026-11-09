---
title: 新增组件
type: guide
status: published
updated: 2026-11-04
---

# 新增组件

## 1. 放哪里

| 类别 | 目录 | 约束 |
| ---- | ---- | ---- |
| primitive | `src/kit/primitives/<group>/<name>/` | 通用控件: 不含业务词汇, 固定文案, 接口地址; 只依赖 `kit/demo.ts`, `kit/texts.ts`, `kit/lib`, 以及其他 primitive(如 `Pager` 用 `Button`) |
| pattern | `src/kit/patterns/<name>/` | 由 primitive 与 lib 组合出的页面范式; 文案/列定义/取数通过属性注入 |
| lib | `src/kit/lib/` | 没有自己标记的 hook 与工具; 只依赖 `kit/texts.ts` |

- `<group>` 是展示站侧边栏的类别(`src/gallery/groups.ts`)对应的目录: `actions` `form` `selection` `overlays` `navigation` `feedback` `data-display` `layout` `foundations`; 新组件放进最贴近的一组, 同步在 `groups.ts` 登记; 对外路径是 `primitives/<group>/<name>`
- `src/kit/primitives/_shared/` 放几个组件共用的样式与内部部件(弹层的 `popover.css`, 对话框的 `dialog.css` 与 `dialog-layer.tsx`), 不对外导出, 没有 demo
- 表单控件的提示行用 `field` 的 `FieldNotes`, 无效状态用 `isInvalid`; 不是原生 `<input>` 、由多个元素组成的输入框加 `control-box` 类(边框, 悬停, 聚焦光晕, 无效与禁用的外观, 子元素 `<input>` 自动变素), 组件自己只写布局
- 新增顶层目录时在 `src/architecture.ts` 加对应 zone

## 2. 一个组件的文件

```
<name>/
├─ index.tsx        # 组件与它的属性类型; 顶部 import "./<name>.css"
├─ <name>.css       # 只用 tokens.css 里的 token
├─ <name>.demo.tsx  # 默认导出 defineDemo(...), 展示站自动收集
└─ <name>.test.ts   # 组件目录里的纯逻辑(如 data-display/avatar/initials.ts)才写; 通用逻辑放 lib/ 并写测试
```

- `*.demo.tsx` 是展示站的唯一入口: 新增后 `bun run dev` 重新生成清单即可出现在左侧导航, 不改展示站代码
- 每个 demo 至少含默认态, 各变体, 禁用/错误等边界态; 每个 example 配一行 `note` 说明何时用

## 3. 样式约定

- 颜色, 间距, 圆角, 时长, 缓动一律用 `tokens.css` 的 token, 不写十六进制颜色, 字面像素与时长
- 颜色是 `light-dark()` 成对定义的, 组件无需关心明暗; 要新增颜色先在 `tokens.css` 加一对
- 动效见 `motion.css` 头部的用法表(进入 `--ease-out`, 退出 `--ease-in`, 循环动画用 `--duration-spin`/`--duration-loop`, 按下用 `--press-scale`; 字面时长与曲线会让 `src/kit/motion.test.ts` 失败); 减少动态效果由它统一处理, 组件不再自写 `prefers-reduced-motion`
- 类名带组件前缀(`.btn`, `.tile-…`), 不用裸标签选择器(`.input` 是表单控件共用的类, 原生 `select` 也加它)
- 同优先级的规则谁生效取决于样式表的打包顺序, 不能依赖; 需要覆盖共用类时提高优先级(如 `.popup.tooltip`)

## 4. 代码约定

- 其余属性透传给原生元素, 只暴露调用方真正会变的部分
- 承载值的控件一律用 `lib/signals` 的 `Bound<T>`: 调用方二选一传 `field`(信号)或 `value` + `onChange`, 组件内用 `bound<T, Own>(props)` 拿到 `value`/`set`/`rest`; 不自己起 `onValue`/`onPage`/`files` 之类的名字. 包装原生元素时, 把原生的 `value`/`onChange` 从属性类型里去掉(Preact 的 input 属性是联合类型, 需逐个成员 `Omit`, 参见 `field/index.tsx` 的 `OmitEach`)
- 组件自带的固定句子(取消, 确认, 关闭, 重试…)放 `kit/texts.ts`, 应用用 `setKitText` 改写; 与某个用法相关的句子通过属性传入
- 有状态的 demo 把状态写成 demo 文件里的小组件, 不在 `render` 里直接用 hook
- 在展示站里需要整列宽度的 demo 用 `<div class="demo-stack">` 包起来
- 注释用英文, 每个导出的组件写一行用途注释

## 5. 交互类组件(Zag)

弹层, 对话框, 选择, 日期, 滑块这类组件用 Zag.js 提供行为与可访问性, 样式仍是本库的; 新增同类组件照此:

- 机器包用 `bun add --exact @zag-js/<组件>`, 版本与已有的 `@zag-js/*` 保持一致; 组件里 `useMachine(machine, props)` 加 `connect(service, normalizeProps)`(`@zag-js/preact`), 把 `api.get<部件>Props()` 展开到对应元素上; 对外只给 `value`/`onChange`, 不暴露机器
- 弹层的定位交给 Zag popper: `positioning: popupPositioning(placement)`(`lib/zag.ts`, `fixed` 让它不被滚动祖先裁剪); 选项列表用 `selection/select/option-list.tsx` 的 `OptionList`, 渲染成 `<div class="popup-positioner" {...api.getPositionerProps()}><div class="popup" {...api.getContentProps()}>`, 样式用 `_shared/popover.css` 的 `.popup`(菜单项与列表项用 `.pop-item`, 高亮与禁用看 `data-highlighted`/`data-disabled`)
- 用 `data-part`/`data-state` 属性选择状态, 选择器以组件类名为前缀; 弹层只有进场动画
- 对话类(`Modal`, `Drawer`, `CommandPalette`)用 `lib/leaving-dialog` 的 `useLeavingDialog`: 组件挂载即打开, 退场动画挂在 `data-state="closed"` 上, 结束后才调 `onClose`; 层、标题行与正文用 `_shared/dialog-layer.tsx` 的 `DialogLayer`/`DialogHead` 与 `.dialog-body`(内部用 `createPortal` 渲染到 `document.body`)
- Zag 对 `input` 的 `role` 类型比 Preact 宽, 展开 `getInputProps()` 时用 `lib/zag.ts` 的 `inputProps()`
- 当没有对应的原生控件能给出同等的键盘与读屏行为时才用 Zag; 原生 `<input type="checkbox">`, `<input type="radio">`, `<details>` 已经足够的保持原生
- 焦点留在输入框的候选列表(`Suggest`, `MentionInput`)不用 Zag, 基于 Popover API 与 CSS anchor positioning, 用 `primitives/selection/suggest/list.tsx` 的 `SuggestList` 与 `useManualPopover`: 弹层是 `popover="manual"`, 在列表上按下不抢走输入框焦点, 按键在输入框一侧处理, 输入法组字期间(`isComposing`, `keyCode 229`)不拦截按键

## 6. 验证与提交

- `bun run ci`(格式, 类型, 文档, 测试)
- 交互类组件(键盘, 焦点, 弹层, 对话框)在展示站里实测: 键盘操作, 明暗两套, 打开与关闭后的焦点位置; 目前没有自动化的浏览器测试; 输入法组字这类行为无法在无头浏览器里模拟, 需要在真机上用输入法试一次
- 对外可见的改动在 `CHANGELOG.md` 的 `## Unreleased` 加一条; 提交到 `dev`, 发版流程见 `AGENTS.md`
