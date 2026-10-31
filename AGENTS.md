# preact-kit

Preact 组件脚手架: 一套带设计 token(含暗色)的通用组件, 加一个自动收集示例的展示站. 可作模板直接复制, 也是新组件的试验场. 栈: Bun + Preact 11 + `@preact/signals`, 无 UI 框架, 手写 CSS


## 开工流程

- 动手前先在仓根 `git fetch` 后 `git status -sb` 看是否 `behind`, 有则先 `git pull --ff-only`; 无法快进时停下来告知用户, 不擅自 merge / rebase. 同一会话内已拉取过的, 不必重复拉取
- 先读 @ROADMAP.md; 有「待决策」且阻塞当前任务时先向用户确认
- 新增组件前先读 @docs/guide/add-component.md
- 能直接解决的小问题顺手处理, 不登记成任务
- 新能力先登记进 ROADMAP

## 开发约定

- 长期主义优先, 不留技术债; 债务当场还或登记进 `ROADMAP.md` 并写触发条件
- primitive 不得含业务词汇/固定文案/接口; 文案, 品牌, 错误码映射一律由调用方注入
- 颜色只出现在 `src/kit/tokens.css`, 且成对写 `light-dark()`; 其他文件只引用 token
- 边界靠 `src/architecture.test.ts` 强制: kit 不得引用 gallery; 新目录出现时在 `src/architecture.ts` 加 zone
- 重复一出现就抽; 旧写法删净, 不留兼容层
- 对外可见的改动(新增/改动/删除组件, 属性变化, token 变化)在提交时写进 `CHANGELOG.md` 的 `## Unreleased`; 不兼容改动标明
- 代码注释用英文; 文档用中文, 只写现行事实
- `docs/` 文档带 front matter 四项(`title`/`type`/`status`/`updated`), `title` 与 `# 标题` 一致, 由 `bun run docs:check` 校验; 本文件与 `README.md`/`ROADMAP.md`/`CHANGELOG.md` 不在其范围内
- 提交前 `bun run ci`; 格式化命令是 `bun run format`

## 常用命令

- `bun run dev`: 生成 demo 清单并启动展示站(默认 `http://localhost:5600`, 端口由 `PORT` 改)
- `bun run gen`: 重新生成 `src/gallery/demos.gen.ts`(已被 git 忽略, `dev` 与 `typecheck` 会先跑)
- `bun run ci`: 格式检查 + 类型检查 + 文档检查 + 测试

## Git 工作流

- 开发分支: `dev`; agent 改动只在该分支
- 远程 `git@github.com:altmanlib/preact-kit.git`(公开, 默认分支 `main`); 在 `dev` 上 agent 可自行决定何时 commit 和 push; `type: summary`, 对应 roadmap 时附编号
- 合并到 `main` 与推送 `main` 均须用户明确确认; 发版与合并都须用户确认后才运行
- 不发版的合并在 `dev` 上运行 `bun run merge-main`(`scripts/merge-main.sh`): `ci` → `main` 快进到 `dev` 并推送 → `dev` 推送
- 发版在 `dev` 上运行 `bun run release <patch|minor|major>`(`scripts/release.sh`): 先检查在 `dev` 且无未提交文件, `CHANGELOG.md` 的 `## Unreleased` 有内容, `gh` 已登录, `ci` 通过; 再在 `main` 上升 `package.json` 的 `version`, 把 Unreleased 的内容移到 `## <版本> - <日期>` 下并提交 `chore: release v<版本>`, 打 `v<版本>` tag → 原子推送 `main` 与 tag → `gh release create`(说明取自该版本的 CHANGELOG 段落) → `dev` 快进回 `main` 并推送. `version` 与版本段落标题只由该命令修改, 不手改
- 版本号遵循 SemVer; 1.0 之前, 新增组件升次版本(minor), 修复升修订版本(patch), 不兼容改动也升 minor 并在 CHANGELOG 标明
