# preact-kit

Preact 组件库 `@altmanlib/preact-kit`: 一套带设计 token(含暗色)的通用组件, 经 GitHub 安装(不发 npm, 发源码, 使用方为 Bun 项目), 加一个自动收集示例的展示站. 栈: Bun + Preact 11 + `@preact/signals`, 无 UI 框架, 手写 CSS

## 文档索引

- @docs/guide/add-component.md: 新增组件(目录, 文件, 样式与代码约定, 弹层与验证)
- @docs/guide/theming.md: 自定义主题色(覆盖一对 `--ink`, 可选覆盖中性色)
- @docs/design/2026-11-04-01-mention-input.md: 提及输入框与候选列表(`Suggest`, `MentionInput`)的方案与取舍
- @docs/design/2026-11-10-01-zag-adoption.md: 接入 Zag.js 的方案: 依赖形态, 封装与样式约定, 现有组件的迁移, 布局组件
- @docs/design/2026-11-10-02-e2e-smoke.md: 浏览器冒烟测试(`status: draft`, 待用户确认依赖与范围后才开工)
- @docs/record/2026-10-31-headless-library-survey.md: 无样式库调研(原"不引入 Zag.js"的结论已被上一条取代)
- @docs/record/2026-10-31-package-distribution.md: 作为 GitHub 依赖包分发的决策与已验证事实
- @ROADMAP.md: 已完成, 暂缓, 待办, 待决策与近期建议
- @CHANGELOG.md: 版本记录, `## Unreleased` 记录下个版本的内容

## 开工流程

- 动手前先在仓根 `git fetch` 后 `git status -sb` 看是否 `behind`, 有则先 `git pull --ff-only`; 分叉则 `git rebase @{u}`, 无冲突后 `git push --force-with-lease`; rebase 冲突则停下告知用户(可 `git rebase --abort`), 不擅自继续. 同一会话内已同步过的, 不必重复
- 先读 @ROADMAP.md; 有「待决策」且阻塞当前任务时先向用户确认
- 新增组件前先读 @docs/guide/add-component.md
- 能直接解决的小问题顺手处理, 不登记成任务
- 新能力先登记进 ROADMAP
- 大功能先写设计文档, 再动手. 满足任一条算大功能: 新增或替换依赖(含可选 peer); 改公开接口的约定(契约, 序列化形式); 涉及键盘, 焦点, 输入法等交互约定的新组件; 有被否决的备选需要留痕; 预计不止一个任务. 设计放 `docs/design/YYYY-MM-DD-NN-slug.md`, `status: draft`, 骨架: 目标与范围/现状与约束/方案/明确不做/开放项, 只写方案与取舍, 不写实施细节, 经用户确认后才开工. 实施中方案变了先改文档再改代码; 完成后在同一提交里修订: 删去实施细节(文件, 函数, 样式变量, 像素等代码里看得出的内容), 只留核心决策, 理由, 否决项, 触发条件与已知取舍, 改 `published`. 普通新增组件与小改动不写设计文档, 按 `docs/guide/add-component.md` 做
- 设计文档按功能拆文件, 不回流成一份总览

## 开发约定

- 长期主义优先, 不留技术债; 债务当场还或登记进 `ROADMAP.md` 并写触发条件
- primitive 不得含业务词汇/固定文案/接口; 文案, 品牌, 错误码映射一律由调用方注入
- 颜色只出现在 `src/kit/tokens.css`, 且成对写 `light-dark()`; 其他文件只引用 token
- 边界靠 `src/architecture.test.ts` 强制: kit 不得引用 gallery; 新目录出现时在 `src/architecture.ts` 加 zone
- 重复一出现就抽; 旧写法删净, 不留兼容层
- 对外可见的改动(新增/改动/删除组件, 属性变化, token 变化)在提交时写进 `CHANGELOG.md` 的 `## Unreleased`; 不兼容改动标明
- 本仓是公开仓库: 文档, 代码, demo 数据与提交信息里不出现用户的业务项目信息(项目名, 业务词汇, 域名), 示例数据用通用内容
- 对外入口是 `package.json` 的 `exports`(按子路径: `primitives/*` `patterns/*` `lib/*` `texts`, 三个 CSS 与 `assets`); 新增顶层目录或入口文件名不同的单元时同步 `exports`; `sideEffects` 保持 `["**/*.css"]`
- `preact` 与 `@preact/signals` 是 peer 依赖(同时在 devDependencies), `@tanstack/preact-query` 与 `prosemirror-*` 是可选 peer; 新增运行时依赖时先判断放 `dependencies` 还是 peer
- 新增依赖用 `bun add`; 现有运行时依赖有 `lucide-preact` 与 `@zag-js/*`, 以及 peer 的 `preact`, `@preact/signals`, `@tanstack/preact-query`(仅 `lib/paging` 与 `ListPage` 用)和 `prosemirror-state`, `-view`, `-model`, `-history`, `-keymap`, `-commands`(仅 `MentionInput` 用; ProseMirror 要求同一棵依赖树里 model/state/view 各只有一份, 所以放 peer)
- 复杂交互组件(弹层, 对话框, 选择, 日期, 滑块等)用 Zag.js(`@zag-js/preact` + 各组件包, 在 `dependencies`, 版本精确锁定为同一个); 允许依赖 `preact/compat`; 对外只暴露 `value`/`onChange` 或 signals 的组件, 不暴露 `useMachine`/`connect`; 样式用 `data-part`/`data-state` 选择器, 并以组件类名为前缀; 无对应 Zag 机器的组件与 `Suggest`/`MentionInput` 保持自写
- 弹层的类名样式写成 `.popup.<名>`(Zag 弹层)或 `.pop.<名>`(`Suggest`/`MentionInput` 的 popover)以压过共用的类, 不依赖样式表的打包顺序
- 交互类组件(键盘, 焦点, 弹层, 对话框)除 `bun run ci` 外, 要在浏览器里实测, 明暗两套都看; 纯逻辑放在 `lib/` 或组件目录的 `.ts` 里并写测试
- 写文件与 `git commit` 不要在同一批并行执行, 先写完再 `bun run format` 与 `bun run ci`, 再提交
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
