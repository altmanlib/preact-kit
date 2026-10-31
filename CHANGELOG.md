# Changelog

版本遵循 [SemVer](https://semver.org/lang/zh-CN/); 1.0 之前, 次版本号可含不兼容改动

## Unreleased

- 新增 `Switch`, `Tabs`(纯状态, 方向键/Home/End 切换)
- 新增 `lib/roving`: 列表项键盘焦点移动(跳过禁用项)

## 0.1.0 - 2026-10-31

首个版本

- 展示站: 自动收集 `*.demo.tsx`, 明暗与跟随系统三档主题
- 设计 token: `light-dark()` 成对定义, 动效与减少动态效果统一处理
- primitives: `Button` `Badge` `Note`/`ErrorNote` `Empty` `Skeleton` `Tile` `Fact` `PageHead`/`Section` `Chips` `SubNav` `Pager` `GlideHeight` `Field` 系列 `IconButton` `CopyButton`/`CopyField` `ConfirmButton` `DataTable`/`QueryTable` `Modal` `Drawer` `DialogProvider`
- lib: `errors` `http` `signals` `paging` `leaving-dialog`
- patterns: `ListPage`
- 文案集中在 `kit/texts.ts`, 用 `setKitText` 改写
