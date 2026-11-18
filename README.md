# dsh-git-panel

English | [中文](#中文说明)

A VSCode-style Git view for the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web GUI. It lives next to **Chat** and **Trajectory** as a per-Session **Git** tab, so every Session operates on its own working directory — including Git repositories nested inside it.

## Features

- **Source control** — staged and changed file groups, per-file and whole-group stage/unstage, commit message with `Ctrl/Cmd+Enter`, branch switch, ahead/behind counts, refresh, and a unified diff view.
- **Commit graph** — newest commits with branch lanes that never move sideways: a line keeps its column for its whole life and stays straight vertical, merges and joins are short diagonals into the column they link to, and a new branch takes the leftmost free column (or a new right-hand column), so starting a branch never shoves an existing line. That means a freed column can stay empty until a new branch fills it — the same behaviour as the VS Code graph. Scrolling to the bottom loads the next page of older commits automatically, so a long history keeps extending without a separate "load more" click. A lane keeps its colour for the whole branch line instead of changing at merge points, and branch/tag labels take the colour of the commit's lane. Branch refs collapse to the current branch plus a `+N` badge; the full list is in the commit detail.
- **Inline commit details** — click a commit to expand it below the row: author, full local date and time (`toLocaleString`), full hash (copy button), parents, refs, changed files with `+N −M`, and clicking a file opens its diff in the right Sidebar (falling back to an inline patch when that column is unavailable). One commit and one file expand at a time; the graph lanes keep running beside the expanded block, so a line never breaks at a detail.
- **Right-Sidebar diff tab** — a commit file's diff opens as a tab of its own, with the Harness review tab's presentation: syntax highlighting, old/new line numbers, add/delete gutters, hunk headers, and split/unified plus line-wrap toggles that persist, plus the review tab's "open the whole file" button that opens the file in the built-in text preview. The tab address names the repository, commit, and file, so reopening the same file reveals the same tab, another file opens its own, and the tab restores with its content after a page reload.
- **Aligned, resizable columns** — the author/time columns are aligned across rows and can be dragged (invisible 6 px hotspots, double-click resets); widths persist locally.
- **Resizable split** — the 1 px divider between the panes is always visible, highlights on hover, drags between 160 px and 70 % of the view, and resets on double-click.
- **Cascading repository picker** — choose the Session working directory, the repository root, or drill into one directory level at a time; a level is probed only when you expand it, so opening the menu never scans a whole tree (build/dependency directories are skipped).
- **Full-height view** — the view declares the Harness composer overlay, so it covers the column's width handles and the composer floats over it, exactly like the built-in Trajectory tab.
- **State memory** — switching to Chat and back restores the selected repository, commit draft, open tab and file, expanded commit, and scroll positions (per Session, per browser tab).
- **AI prompts, not AI writes** — toolbar **AI** menu (merge branches, review current changes, explain the current branch), a review shortcut beside the source-control title, and **Explain this commit** in the commit detail. Each one generates an editable prompt and writes it into the composer with `inputActions.setDraft`; you press Enter to send. Prompts carry only the repository path, involved branches, and your stated purpose — the agent inspects the repository with its own tools.
- **Bilingual UI** (Chinese/English) and a light/dark theme that follows the host.

## Install

The bundle requires a DeepSeek Harness **Web** profile and `dsh >= 0.2.1-rc.3 < 0.3.0` (`engines.dsh` in `package.json`).

### From this Git repository

```sh
dsh plugin --profile web add github:zgldh/dsh-git-panel
```

Or open **Plugins**, add this repository as a bundle, and enable **Git Panel**.

### From the plugin market index

DSH has no official central marketplace; the supported mechanism is a plugin index — one JSON file served from any static host, which users add under **Plugins → Discover → Add index source**. This repository publishes such an index:

```
https://raw.githubusercontent.com/zgldh/dsh-git-panel/main/index.json
```

Add that URL as an index source, search for **Git Panel**, and install the listed version. The index pins an exact commit, so what you install matches this README.

### Local development

```sh
git clone https://github.com/zgldh/dsh-git-panel
dsh plugin --profile web add link:/path/to/dsh-git-panel
```

Restart `dsh web` once after installing or updating the host half. Client-only changes reload on refresh.

## Configuration

Edit the `git-panel` row in your profile patch (or the bundle's `cordis.patch.yml`):

| Key | Default | Meaning |
| --- | --- | --- |
| `logLimit` | `80` | Commits requested per history page and drawn at first load (10–300). |
| `commitFilesLimit` | `500` | Files listed in a commit detail (50–5000). |
| `includeAllRefs` | `false` | Draw all branches (`git log --all`). Keep `false` for a narrow graph on busy repositories. |
| `browseLimit` | `200` | Maximum subdirectories listed per cascading picker level (1–10000). |
| `skipDirectories` | build/dependency names | Directory names skipped while probing the picker (case-insensitive). |
| `gitTimeoutMs` | `20000` | Timeout for one Git command. |
| `diffMaxChars` | `200000` | Maximum characters returned for one diff. |
| `signCommits` | `false` | Commit with `--no-gpg-sign` to avoid an interactive signing prompt. |
| `allowRoots` | empty | Optional fence: when non-empty, a repository root must live below one of these directories. |

## How it works

- **Host half** `index.js` registers one authenticated POST route `/api/git-ui` on the shared `/api` surface. It resolves a requested directory to its repository root with `git -C <dir> rev-parse --show-toplevel`, probes one picker level with a single `readdir` per child directory (no recursion), runs Git with an argument array (never a shell), validates repository-relative paths, and returns JSON envelopes.
- **Client half** `client.js` is a browser module loaded through the Harness client module loader. It registers the `conversation.view` slot (`id: 'git'`, order 20), reads the Session's working directory from the Session/Workspace snapshots, and renders the view with React (no build step, no JSX).
- **Composer overlay** — the view root carries `data-conversation-composer-overlay`, the Harness conversation-shell contract that makes a view full-height, hides the chat column's width handles, and floats the composer over it (the same contract the built-in Trajectory view declares). The three scrolling lists reserve the composer's live height so their last row stays reachable.
- **Commit history paging** — the Host's `log` action takes a page size and an offset, walks the same `--topo-order` sequence, and fetches one commit beyond the page to report `hasMore`. The Client appends the next page when the commit list is scrolled near its bottom, so the graph grows without re-requesting what it already has.
- **Right-Sidebar diff tab type** — the commit-file diff is a resource type registered through the public extension points (`ctx.sidebarRightTabs.register` with a `dsh-resource://git-commit-diff/…` pattern, the keyed `sidebar.right.pane.tab` and `sidebar.right.pane.tab.title` seats, opened with `ctx.sidebarRight.openResource`). The address encodes repository, commit, and file, so it is the tab identity and survives a reload; the body renders with the shared `@deepseek-ai/dsh-client-ui-primitives` icons, tooltips and code highlighter, and mirrors the review tab's comparison layout, colours, and line-numbering so both surfaces read the same.

## Limitations

- Local operations only: no push/pull/fetch, discard, stash, or merge-conflict resolution.
- Branch switching lists local branches only; Git errors are shown verbatim.
- The commit graph is a simplified layout capped at 10 visible lanes; very branch-heavy histories clip the extra lanes.
- Graph columns are stable, so a column freed by an ended branch can stay empty until a new branch reuses it; this is the price of never moving a live line sideways.
- The picker probes one directory level at a time and lists a directory whenever it can contain nested repositories; a directory that itself holds none can still appear under its parent, and expanding it then shows an empty level.
- A merge commit's detail is compared against its **first parent**, matching GitHub's merge view.
- The commit-file diff needs the Harness right Sidebar (`dsh >= 0.2.1-rc.3` ships it); without that column the plugin falls back to the inline patch.
- Column/split widths and the diff layout choice are stored in `localStorage`; view memory is per Session in `sessionStorage` (per browser tab).
- AI prompts are fill-only: the plugin never sends the message and never triggers a Git write operation. Commit-message generation is not implemented yet.

## Reading the graph

- A lane keeps its column for its whole life; a continuing branch line is always a straight vertical segment.
- A merge or a join is drawn as a short diagonal from the commit dot to the column it links to. The corner of the graph is not a change of branch.
- A newly started branch takes the leftmost free column, or a new right-hand column when every column is busy.
- A branch or tag chip uses the colour of the commit's lane, so a label can be matched to its line at a glance.
- The first parent of a merge keeps the merge commit's own lane and colour; a second parent starts or joins a differently coloured line.
- Scrolling the list to the bottom loads the next page of older commits; the header shows how many are loaded so far.

## Development

```sh
npm test                              # Host Git service tests + bundle checks
node scripts/build-index.mjs          # rebuild index.json
node scripts/build-index.mjs --check  # fail when index.json is stale
```

`scripts/build-index.mjs` validates its output with [`@deepseek-ai/dsh-plugin-market-index`](https://www.npmjs.com/package/@deepseek-ai/dsh-plugin-market-index) when that package is installed (CI installs it). The GitHub workflow rebuilds `index.json` after each push to `main`, so the market entry follows the code.

## License

[MIT](LICENSE) © 2026 zgldh

---

## 中文说明

DeepSeek Harness（DSH）Web GUI 的 VSCode 风格 Git 视图。它作为会话视图标签放在「对话」「轨迹」右边，名字是「Git」，按当前会话的工作目录工作；工作目录下面还有别的 Git 仓库时也能直接切过去。

### 功能

- **源代码管理**：已暂存/更改两组文件、单文件和整组暂存/取消暂存、提交信息（`Ctrl/Cmd+Enter` 提交）、分支切换、领先/落后提交数、刷新、文件 diff。
- **提交图**：分支泳道不会左右移动——每条线在生命周期内固定在自己的列、保持竖直，合并/汇入只画一小段斜线连到目标列，新分支优先占用最左边的空列（没有空列才在最右侧新开一列），所以开新分支不会把已有线挤开。代价是一条线结束后的空列可能暂时空着，直到新分支来填——和 VS Code 的提交图行为一致。滚动到最底部会自动加载下一页更早的提交，长历史不需要手动点“加载更多”。分支泳道颜色跟着分支线走，合并点前后同色，分支名/标签名用所在泳道线的颜色做底色；分支标签压缩成当前分支加 `+N`，完整列表在提交详情里。
- **行内提交详情**：点提交行在下方展开——作者、完整本地时间（`toLocaleString`）、完整 hash（可复制）、父提交、refs、改动文件；点击某个文件会在右侧边栏打开它的 diff（右侧栏不可用时退回行内 patch）。同时只展开一个提交、一个文件；展开区左侧保持轨道线连续，连线不会在详情处断开。
- **右侧栏 diff 标签页**：提交里的文件 diff 以独立标签页打开，表现与 Harness 的变更评审一致：语法高亮、旧/新行号、增删底色与行号边标、hunk 头，「左右对比/单栏对比」和「自动换行」两个开关（选择会记住），以及变更评审同款的「在侧边栏打开整个文件」按钮（打开内置文件预览）。标签页地址里编码了仓库、提交和文件路径，所以再次打开同一个文件是同一个标签页、打开别的文件是新标签页，刷新页面后标签页也能带着内容恢复。
- **列对齐与可拖列宽**：作者/时间列统一对齐，列边界有 6px 隐形热区可拖动，双击复位，宽度记在本地。
- **可拖分栏**：左右分栏之间 1px 细线常显，悬停高亮，拖动范围 160px–视图 70%，双击复位。
- **级联仓库选择**：会话工作目录、仓库根目录，以及逐层下钻的目录；只有展开某一层时才探测该层，打开菜单不会扫整棵树（跳过构建/依赖目录）。
- **占满整列高度**：视图声明了 Harness 的 composer overlay，盖住聊天列两侧的宽度拖拽线，输入框浮在视图上，效果和内置「轨迹」一致。
- **状态记忆**：切到「对话」再切回 Git，会恢复所选仓库、提交草稿、当前标签和选中文件、展开的提交，以及滚动位置（按会话、按浏览器标签页）。
- **AI 只生成 prompt，不代替你操作**：工具栏「AI」菜单（合并分支、评审当前改动、解释当前分支）、源代码管理标题旁的评审按钮、提交详情里的「让 AI 解释这次提交」。生成可编辑的 prompt 并通过 `inputActions.setDraft` 填入输入框，由你按 Enter 发送；prompt 只给仓库路径、涉及分支和你的目的，让 AI 自己用工具查看仓库。
- 中英双语界面，深浅色主题跟随宿主。

### 安装

需要 DSH **Web** profile，`dsh >= 0.2.1-rc.3 < 0.3.0`（`package.json` 的 `engines.dsh`）。

```sh
dsh plugin --profile web add github:zgldh/dsh-git-panel
```

也可以打开 **插件** 页面，把这个仓库添加为 bundle，再启用 **Git 面板**。

**通过插件市场索引安装**：DSH 没有官方中央市场，官方支持的机制是「插件索引」——一个放在任意静态服务器上的 JSON 文件，用户在 **插件 → Discover → 添加索引源** 里添加。本仓库发布了一份这样的索引：

```
https://raw.githubusercontent.com/zgldh/dsh-git-panel/main/index.json
```

把上面的 URL 添加为索引源，搜索「Git 面板」，安装列出的版本即可。索引固定到具体 commit，装到的就是这份 README 描述的代码。

本地开发：

```sh
git clone https://github.com/zgldh/dsh-git-panel
dsh plugin --profile web add link:/path/to/dsh-git-panel
```

安装或更新 Host 部分后重启一次 `dsh web`；只改客户端时刷新页面即可。

### 配置

在 profile patch（或 bundle 的 `cordis.patch.yml`）里改 `git-panel` 行：

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `logLimit` | `80` | 请求并绘制的提交数（10–300）。 |
| `commitFilesLimit` | `500` | 提交详情里最多列出的文件数（50–5000）。 |
| `includeAllRefs` | `false` | 显示所有分支（`git log --all`）。仓库分支多时保持 `false`。 |
| `browseLimit` | `200` | 级联选择器每一层最多列出的子目录数（1–10000）。 |
| `skipDirectories` | 构建/依赖目录 | 探测下级目录时跳过的目录名（大小写不敏感）。 |
| `gitTimeoutMs` | `20000` | 单条 Git 命令超时（毫秒）。 |
| `diffMaxChars` | `200000` | 单次 diff 返回的最大字符数。 |
| `signCommits` | `false` | 提交时带 `--no-gpg-sign`，避免卡在签名提示。 |
| `allowRoots` | 空 | 可选安全围栏：非空时仓库根目录必须落在其中某个目录下。 |

### 实现方式

- **Host 半** `index.js`：在共享 `/api` 上注册一条登录保护的 `POST /api/git-ui` 路由；用 `git -C <dir> rev-parse --show-toplevel` 把目录解析为仓库根目录；选择器每层只做一次 `readdir`（每个子目录一次，不递归）；Git 以参数数组执行、不经过 shell；校验仓库内相对路径；返回 JSON。
- **Client 半** `client.js`：通过 Harness 客户端模块加载器加载的浏览器模块，注册 `conversation.view`（`id: 'git'`，order 20），从 Session/Workspace 快照读工作目录，用 React 渲染（无构建、无 JSX）。
- **Composer overlay**：视图根节点带 `data-conversation-composer-overlay`，这是 Harness 会话外壳的约定：视图占满整列、隐藏聊天列两侧的宽度拖拽线、输入框浮在视图上（内置「轨迹」用的是同一个约定）。三个滚动列表按输入框的实时高度留出底部空间，最后一行仍然够得到。
- **提交历史分页**：Host 的 `log` 动作接收「每页条数」和「偏移量」，在同一个 `--topo-order` 序列上取下一页，并多取一条用于报告 `hasMore`；Client 在提交列表滚动到接近底部时自动追加下一页，不会重复请求已加载的部分。
- **右侧栏标签页类型**：提交文件 diff 是一个通过公开扩展点注册的资源类型（`ctx.sidebarRightTabs.register` + 匹配 `dsh-resource://git-commit-diff/…` 的模式、keyed 槽 `sidebar.right.pane.tab` 与 `sidebar.right.pane.tab.title`，用 `ctx.sidebarRight.openResource` 打开）。地址里编码了仓库、提交和文件，所以它既是标签页身份，也能在刷新后恢复；body 用共享的 `@deepseek-ai/dsh-client-ui-primitives` 里的图标、Tooltip 和代码高亮渲染，并照搬评审标签页的对比布局、配色和行号规则，两处观感一致。

### 限制

- 只做本地操作：没有 push/pull/fetch、丢弃改动、stash、合并冲突处理。
- 分支切换只列本地分支；Git 报错原样显示。
- 提交图是简化布局，最多画 10 条泳道；分支特别多时部分泳道会被截掉。
- 图的列是固定的：一条线结束后它的列可能暂时空着，直到新分支复用；这是「不让活动线左右移动」的代价。
- 选择器逐层探测：一个目录只要可能包含下级仓库就会列出来，因此本身没有仓库的目录也可能出现在上一级，展开后显示为「这一层没有 Git 仓库」。
- 合并提交的详情按**第一父**比较（与 GitHub merge 视图一致）。
- 提交文件 diff 依赖 Harness 的右侧边栏（`dsh >= 0.2.1-rc.3` 自带）；右侧栏不可用时退回行内 patch。
- 列宽/分栏宽度存在 `localStorage`（全局）；diff 布局选择和视图状态也存在 `localStorage`/`sessionStorage`。
- AI 只到「填 prompt」为止：不自动发送、不触发任何 Git 写操作；暂未实现「生成提交信息」。

### 看懂提交图

- 一条泳道在自己的生命周期内固定占用同一列，延续的分支线永远是竖直的。
- 合并或汇入画成从提交圆点连到目标列的短斜线，斜线不是换分支。
- 新开的分支优先占用最左边的空列；所有列都在用时才在最右侧新开一列。
- 分支名/标签名的底色取自该提交所在泳道的颜色，扫一眼就能对应到线。
- 合并提交的第一父继承合并提交自己的泳道和颜色，第二父另外起（或汇入）一条不同颜色的线。
- 列表滚动到底部会自动加载下一页更早的提交，顶部显示已加载的提交数。

### 开发与许可

```sh
npm test                              # Host Git 服务测试 + bundle 检查
node scripts/build-index.mjs          # 重建 index.json
node scripts/build-index.mjs --check  # 校验 index.json 是否过期
```

`scripts/build-index.mjs` 在安装了 `@deepseek-ai/dsh-plugin-market-index` 时会用官方校验器验证输出（CI 会安装）。GitHub workflow 会在每次 push 到 `main` 后重建 `index.json`，市场条目随之更新。

[MIT](LICENSE) © 2026 zgldh
