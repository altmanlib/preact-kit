---
title: 作为依赖包分发的决策
type: record
status: draft
updated: 2026-10-31
---

# 作为依赖包分发的决策

把 `src/kit/` 从「拷贝进项目的模板」改为「通过 GitHub 安装的依赖包」, 让使用方不再各自维护一份重复的通用组件. 本文记录决策与已验证的事实; 落地后以 README 与 AGENTS.md 为准

## 1. 决策

| # | 决策 | 内容 |
|---|---|---|
| D1 | 渠道 | 只走 GitHub, 不发 npm. 使用方写 `"@altmanlib/preact-kit": "github:altmanlib/preact-kit#v<版本>"` |
| D2 | 包名 | `@altmanlib/preact-kit` |
| D3 | 形态 | 发源码, 不构建; `exports` 指向 `src/kit/**` 的 `.ts` `.tsx` `.css`. 使用方限定为 Bun 项目 |
| D4 | 范围 | 只导出 `src/kit/`; 展示站, 服务端, 测试, demo 不暴露 |
| D5 | 依赖 | `preact` 与 `@preact/signals` 放 `peerDependencies`; `lucide-preact` 放 `dependencies`; `@tanstack/preact-query` 仅 `lib/paging` 与 `ListPage` 使用, 放可选 peer |
| D6 | 发布 | 沿用 `bun run release`(打 tag 并 `gh release create`); 去掉 `private: true`, 补 `sideEffects`, `homepage`, `bugs` |
| D7 | 定位 | 从「复制模板」改为「依赖包 + 展示站」; 文档中「可作模板直接复制」一律删除 |
| D8 | 版本 | 1.0 前 minor 可含不兼容改动; 使用方锁精确 tag, 升级时自行 `bun add` 并跑 `ci` |
| D9 | 边界 | 仓库公开, 不含业务信息; 带业务色彩的单元(登录, 会话外壳, 品牌插画等)留在使用方 |

## 2. 已验证的事实

- 在没有 `git` 的环境里, `bun add github:altmanlib/preact-kit#v0.2.0` 可正常安装, `bun.lock` 记录提交哈希与校验值, 不需要装 git 或配置认证
- `src/kit/` 没有统一入口文件, 组件按目录组织(`primitives/<名>/index.tsx`), 所以 `exports` 要按子路径写
- 组件自己 `import "./xxx.css"`, 使用方只需在页面额外引入 `base.css`(它 `@import` 了 `tokens.css`); 经包路径引用 `<link href="@altmanlib/preact-kit/base.css">` 与 JS 里 `import` 样式, `bun build` 均能打包, `light-dark()` 被降级为变量写法
- 使用方用 TS 时还需要 `src/jsx.d.ts`(Popover 属性)与 `src/assets.d.ts`(样式导入声明)

## 3. `exports` 形态

按子路径, 一类一条通配:

- `./primitives/*` → `./src/kit/primitives/*/index.tsx`
- `./patterns/*` → `./src/kit/patterns/*/index.tsx`
- `./lib/*` → `./src/kit/lib/*.ts`
- `./texts` → `./src/kit/texts.ts`
- `./base.css` `./tokens.css` `./motion.css` → `./src/kit/*.css`
- `./package.json`

类型补充文件(`jsx.d.ts` `assets.d.ts`)的交付方式见 §4

## 4. 落地前待定

- `jsx.d.ts` 与 `assets.d.ts` 怎么交付: 放进 `src/kit/` 并让使用方在 `tsconfig` 的 `include` 或 `types` 里引用, 还是改成包内 `import type` 自带
- `sideEffects` 的写法: 组件自带 CSS 导入, 必须把 `*.css` 列为有副作用, 否则会被摇掉
- `exports` 通配在 Bun 与 `tsc`(`moduleResolution: bundler`)下的实际行为需各验证一次
- 首个包版本号: 沿用 0.x 升 minor

## 5. 迁移顺序

1. 逐文件对比使用方的本地通用单元与 `src/kit/`, 把通用且更新的部分补进本仓, 去掉业务词汇
2. 本仓改好 `package.json` 与文档, 发新版
3. 使用方改依赖, 删除本地重复文件
4. 其他有同类代码的项目再逐个迁
