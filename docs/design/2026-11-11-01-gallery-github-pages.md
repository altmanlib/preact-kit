---
title: 展示站 GitHub Pages 预览
type: design
status: published
updated: 2026-11-11
---

# 展示站 GitHub Pages 预览

## 1. 目标与范围

发版后自动把展示站静态产物发到 GitHub Pages, 用公开 URL 预览当前版本的组件效果

范围: 仅 gallery 的静态构建与按 tag 部署. 不改组件对外契约, 不改本地 `dev` 方式

## 2. 现状与约束

- 展示站是纯前端 SPA, 无 API; 路由已是 hash, 适合静态托管
- 发版脚本会打 `v*` tag 并推送; 仓库公开
- 项目页地址是 `https://altmanlib.github.io/preact-kit/`, 资源不在站点根路径

## 3. 方案

- 对 gallery 的 HTML 入口做 `Bun.build` 静态构建; `publicPath` 固定为 `/preact-kit/`
- 推送 `v*` tag 时由 GitHub Actions 构建并部署 Pages
- 仓库 Pages 源为 GitHub Actions

## 4. 明确不做

- 不在每次推 `main` / `dev` 时部署, 只跟发版 tag
- 不提交静态产物到分支
- 不改客户端路由为 history path
- 暂不配自定义域名; 若以后挂到根路径, 再把 `publicPath` 改为 `/`
- 日常 `ci` 不跑静态构建; 只在 Pages workflow 里构建. 若发版前常踩构建失败再考虑纳入 `ci`

## 5. 已知取舍

- `github-pages` 环境默认只允许 `main` 分支部署; 按 tag 发版时须另加 `v*` tag 策略, 否则 build 过、deploy 会被环境保护拒绝
