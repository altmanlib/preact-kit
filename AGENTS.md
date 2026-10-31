# preact-kit

Preact 组件脚手架: 一套带设计 token(含暗色)的通用组件, 加一个自动收集示例的展示站. 可作模板直接复制, 也是新组件的试验场. 栈: Bun + Preact 11 + `@preact/signals`, 无 UI 框架, 手写 CSS

## 开发约定

- 新增组件前先读 @docs/guide/add-component.md
- primitive 不得含业务词汇/固定文案/接口; 文案, 品牌, 错误码映射一律由调用方注入
- 颜色只出现在 `src/kit/tokens.css`, 且成对写 `light-dark()`; 其他文件只引用 token
- 边界靠 `src/architecture.test.ts` 强制: kit 不得引用 gallery; 新目录出现时在 `src/architecture.ts` 加 zone
- 重复一出现就抽; 旧写法删净, 不留兼容层
- 代码注释用英文; 文档用中文, 只写现行事实
- `docs/` 文档带 front matter 四项(`title`/`type`/`status`/`updated`), 由 `bun run docs:check` 校验
- 提交前 `bun run ci`; 格式化命令是 `bun run format`

## 常用命令

- `bun run dev`: 生成 demo 清单并启动展示站(默认 `http://localhost:5600`, 端口由 `PORT` 改)
- `bun run gen`: 重新生成 `src/gallery/demos.gen.ts`(已被 git 忽略, `dev` 与 `typecheck` 会先跑)
- `bun run ci`: 格式检查 + 类型检查 + 文档检查 + 测试

## Git 工作流

- 公开仓库 `git@github.com:altmanlib/preact-kit.git`, 默认分支 `main`; agent 可自行 commit, `type: summary`
- push 与发版须用户明确要求
- 发版: 改 `package.json` 的 `version` 与 `CHANGELOG.md` → `bun run ci` → 提交 `chore: release vX.Y.Z` → `git tag vX.Y.Z` → 推送 `main` 与 tag → `gh release create vX.Y.Z --title vX.Y.Z --notes-file <该版本的 CHANGELOG 段落>`
- 版本号遵循 SemVer; 1.0 之前, 新增组件升次版本, 修复升修订版本, 不兼容改动写进 CHANGELOG
