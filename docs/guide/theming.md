---
title: 自定义主题色
type: guide
status: published
updated: 2026-11-11
---

# 自定义主题色

品牌色集中在一个 token: `--ink`. 它必须是一对 `light-dark()`, 分别给浅色与深色方案. 填充、悬停、浅底与焦点环都从它派生, 使用方通常只需覆盖这一对.

页面仍先引入 `@altmanlib/preact-kit/base.css`(含 `tokens.css`). 在自己的样式里、在 `:root` 上覆盖即可, 不必改库里的文件.

```css
:root {
  --ink: light-dark(#1d4ed8, #8fb0ff);
}
```

覆盖时请继续写 `light-dark(浅色, 深色)`. 构建会把 `light-dark()` 降成 `--buncss-light` / `--buncss-dark` 回退, 并且 `:root[data-theme="light|dark"]` 仍能强制一侧, 与 `ThemeSwitch` 兼容. 派生 token 读的是 `var(--ink)`, 所以运行时改 `--ink` 也会带动它们.

## 派生关系

| Token | 角色 |
| ---- | ---- |
| `--ink` | 文字链接、焦点环、描边; 也是 `--accent` 与 `--focus` 的源 |
| `--ink-fill` / `--ink-fill-hover` | 实心底(主按钮、选中日、开关打开). 浅色方案下与 `--ink` 相同; 深色方案下是更深的 `color-mix`, 好让 `--on-ink`(白色)达到 4.5:1 |
| `--ink-hover` | 链接与文字按钮的悬停色 |
| `--accent-soft` | 浅品牌底(选中项、提示) |

深色方案里, 同一个紫(或你覆盖的色)无法既在 `--surface` 上当链接达到 4.5:1, 又在白字底下当填充达到 4.5:1, 所以文字与填充被拆成 `--ink` 与 `--ink-fill`. 只改 `--ink` 时这两条都会跟着变; 若只要单独调整填充, 再覆盖 `--ink-fill` 与 `--ink-fill-hover`.

不要直接给组件写死颜色. 颜色只应出现在 `tokens.css` 或使用方覆盖 token 的样式里.

## 中性色(可选)

`--bg`、`--surface`、`--surface-sunken`、`--card-shell`、`--card-shell-hover`、`--card-inner`、`--surface-hover`、`--surface-press`、`--line`、`--line-strong`、`--line-hover`、`--text`、`--muted`、`--text-invert`、`--disabled-ink`、`--backdrop`、`--shadow-color` 是第二组可覆盖的 token. 它们略带紫色倾向, 与默认品牌一致. 换了远离紫色的 `--ink` 后, 若希望表面也脱离紫调, 请把这一组一起覆盖; 只换品牌时可以不动它们.

阴影由 `--shadow-color` 派生, 覆盖这一项即可带动 `--shadow`、`--shadow-bar`、`--shadow-lift`.

## 对比度

覆盖 `--ink` 时请在两种方案下自测:

- `--ink` 叠在 `--surface` 与 `--bg` 上(链接与焦点环) ≥ 4.5:1
- `--ink` 叠在 `--accent-soft` 上 ≥ 4.5:1
- `--on-ink`(默认白)叠在 `--ink-fill` 与 `--ink-fill-hover` 上 ≥ 4.5:1

浅色一侧的 `--ink` 需要足够深, 深色一侧需要足够浅. 展示站 Foundations 下的 Theming 页提供蓝 / 绿 / 橙预设, 可用来确认“只改一个变量”是否生效.
