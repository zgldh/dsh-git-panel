window.__ModuleLoader__.load({
  id: 'dsh-git-panel',
  factory(require) {
    const React = require('react')
    const primitives = require('@deepseek-ai/dsh-client-ui-primitives')
    const h = React.createElement
    const { useCallback, useEffect, useMemo, useRef, useState } = React

    /** Simplified Chinese copy; the key set is shared verbatim by {@link EN}. */
    const ZH = {
      'view.label': 'Git',
      'tabs.label': '视图标签',
      'tabs.close': '关闭 {name}',

      'sourceControl.title': '源代码管理',
      'sourceControl.total': '共 {count} 项更改',

      'commit.placeholder': '提交信息（Ctrl+Enter 提交到 “{branch}”）',
      'commit.placeholderDetached': '提交信息（Ctrl+Enter 提交）',
      'commit.action': '提交',
      'commit.busy': '提交中…',
      'commit.success': '已提交 {short} {subject}',

      'staged.title': '已暂存',
      'changes.title': '更改',
      'staged.unstageAll': '全部取消暂存',
      'changes.stageAll': '全部暂存',
      'file.stage': '暂存 {path}',
      'file.unstage': '取消暂存 {path}',
      'file.open': '查看 {path} 的更改',
      'empty.clean': '没有检测到更改。',

      'graph.title': '提交图',
      'graph.count': '已加载 {count} 条提交',
      'graph.loadingMore': '正在加载更多提交…',
      'graph.moreError': '加载更多提交失败',
      'graph.branch': '本地分支',
      'graph.remote': '远程分支',
      'graph.tag': '标签',
      'graph.head': 'HEAD',
      'graph.empty': '还没有提交记录。',
      'graph.error': '提交图加载失败',

      'diff.staged': '已暂存',
      'diff.unstaged': '未暂存',
      'diff.close': '关闭 diff',
      'diff.loading': '正在加载 diff…',
      'diff.error': 'diff 加载失败',
      'diff.empty': '这个文件没有可显示的 diff。',
      'diff.untrackedEmpty': '未跟踪文件，暂无 diff。',
      'diff.truncated': '已截断',
      'diff.truncatedLines': '只显示前 {count} 行',
      'diff.binary': '二进制文件，无法显示改动',
      'diff.created': '新建的文件',
      'diff.deleted': '删除的文件',
      'diff.unchanged': '两侧内容相同',
      'review.split': '切换为左右对比',
      'review.unified': '切换为单栏对比',
      'review.splitAria': '左右对比',
      'review.wrap': '开启自动换行',
      'review.nowrap': '关闭自动换行',
      'review.wrapAria': '自动换行',
      'commitDiff.title': '提交文件变更',
      'commitDiff.missing': '缺少打开这个 diff 的参数。',
      'commitDiff.stale': '这个标签页由旧版本打开，请从提交详情里重新点击文件。',

      'toolbar.refresh': '刷新',
      'toolbar.busy': '正在更新…',
      'toolbar.branch': '切换分支',
      'toolbar.detached': 'detached HEAD',
      'toolbar.aheadBehind': '领先 {ahead} 个提交，落后 {behind} 个提交',
      'toolbar.aheadBehindText': '↑{ahead} ↓{behind}',
      'toolbar.upstream': '跟踪 {upstream}',

      'branch.switched': '已切换到 {branch}',
      'branch.detachedOption': '（detached）',

      'state.resolvingCwd': '正在确定当前会话的工作目录…',
      'state.noCwd': '当前会话还没有工作目录。',
      'state.notRepository': '当前工作目录不是 Git 仓库',
      'state.notRepoHint': '点上方路径可以切换到下级目录里的 Git 仓库。',
      'state.loading': '正在加载…',
      'state.error': '加载失败',
      'state.retry': '重试',

      'picker.aria': '切换仓库目录',
      'picker.label': '仓库目录',
      'picker.cwd': '会话工作目录',
      'picker.root': '仓库根目录',
      'picker.children': '下级目录',
      'picker.loading': '正在探测下级目录…',
      'picker.empty': '这一层没有 Git 仓库。',
      'picker.error': '探测下级目录失败',
      'picker.expand': '展开 {name}',
      'picker.collapse': '收起 {name}',
      'picker.choose': '切换到 {path}',
      'picker.close': '关闭',

      'notice.dismiss': '关闭提示',
      'error.unknown': '操作失败',
      'error.http': '请求失败（HTTP {status}）',
      'error.invalidBody': '响应格式不正确',

      'status.modified': '已修改',
      'status.added': '新增',
      'status.deleted': '已删除',
      'status.renamed': '重命名',
      'status.copied': '复制',
      'status.unmerged': '有冲突',
      'status.typeChanged': '类型变更',
      'status.untracked': '未跟踪',

      'detail.title': '提交详情',
      'detail.copy': '复制',
      'detail.copied': '已复制提交 hash',
      'detail.copyFailed': '复制失败',
      'detail.parents': '父提交',
      'detail.files': '改动文件',
      'detail.loading': '正在加载提交详情…',
      'detail.error': '提交详情加载失败',
      'detail.empty': '这次提交没有改动文件。',
      'detail.filesTruncated': '文件列表已截断',
      'detail.fileStats': '新增 {add} 行，删除 {del} 行',
      'detail.explain': '让 AI 解释这次提交',

      'columns.author': '作者列宽度',
      'columns.time': '时间列宽度',
      'split.label': '调整源代码管理宽度',

      'ai.action': 'AI',
      'ai.menu': 'AI 操作',
      'ai.merge': '合并分支…',
      'ai.review': '评审当前改动',
      'ai.explainBranch': '解释当前分支',
      'ai.filled': '已填入输入框，按 Enter 发送',
      'ai.fillFailed': '没有可写入的输入框',
      'ai.reviewButton': '让 AI 评审这些改动',
      'ai.mergeTitle': '合并分支',
      'ai.mergeSource': '来源分支',
      'ai.mergeTarget': '目标分支',
      'ai.mergeNote': '补充说明（可选）',
      'ai.mergeEmpty': '没有可用的分支。',
      'ai.mergeSame': '来源分支与目标分支相同。',
      'ai.mergeCancel': '取消',
      'ai.mergeFill': '填入输入框',
      'ai.promptMerge': '仓库：{root}\n目标分支：{target}\n来源分支：{source}\n任务：把来源分支合并到目标分支。请先自己检查两个分支的差异与冲突风险，给出执行计划；在我确认前不要执行任何写操作。',
      'ai.promptMergeNote': '\n补充说明：{note}',
      'ai.promptReview': '仓库：{root}\n任务：评审当前工作区里未提交的改动，指出风险点和建议。请先自己查看 git status 和 diff；在我确认前不要执行任何写操作。',
      'ai.promptBranch': '仓库：{root}\n任务：解释当前分支最近的提交在做什么，并指出可能的风险。请先自己查看 git log 和 diff。',
      'ai.promptCommit': '仓库：{root}\n提交：{short}（{subject}）\n任务：解释这次提交改了什么、为什么，以及可能的影响。请先自己查看该提交的 diff。',
    }

    /** English copy; every key of {@link ZH} appears here with the same spelling. */
    const EN = {
      'view.label': 'Git',
      'tabs.label': 'Views',
      'tabs.close': 'Close {name}',

      'sourceControl.title': 'Source Control',
      'sourceControl.total': '{count} changes',

      'commit.placeholder': 'Commit message (Ctrl+Enter commits to “{branch}”)',
      'commit.placeholderDetached': 'Commit message (Ctrl+Enter commits)',
      'commit.action': 'Commit',
      'commit.busy': 'Committing…',
      'commit.success': 'Committed {short} {subject}',

      'staged.title': 'Staged',
      'changes.title': 'Changes',
      'staged.unstageAll': 'Unstage all',
      'changes.stageAll': 'Stage all',
      'file.stage': 'Stage {path}',
      'file.unstage': 'Unstage {path}',
      'file.open': 'Open changes of {path}',
      'empty.clean': 'No changes detected.',

      'graph.title': 'Commit graph',
      'graph.count': '{count} commits loaded',
      'graph.loadingMore': 'Loading more commits…',
      'graph.moreError': 'Failed to load more commits',
      'graph.branch': 'Branch',
      'graph.remote': 'Remote',
      'graph.tag': 'Tag',
      'graph.head': 'HEAD',
      'graph.empty': 'No commits yet.',
      'graph.error': 'Failed to load the commit graph',

      'diff.staged': 'Staged',
      'diff.unstaged': 'Unstaged',
      'diff.close': 'Close diff',
      'diff.loading': 'Loading diff…',
      'diff.error': 'Failed to load the diff',
      'diff.empty': 'No diff to show for this file.',
      'diff.untrackedEmpty': 'Untracked file: no diff yet.',
      'diff.truncated': 'Truncated',
      'diff.truncatedLines': 'Showing the first {count} lines',
      'diff.binary': 'Binary file; changes cannot be shown',
      'diff.created': 'Created file',
      'diff.deleted': 'Deleted file',
      'diff.unchanged': 'Both sides hold the same lines',
      'review.split': 'Switch to split view',
      'review.unified': 'Switch to unified view',
      'review.splitAria': 'Split view',
      'review.wrap': 'Enable line wrap',
      'review.nowrap': 'Disable line wrap',
      'review.wrapAria': 'Line wrap',
      'commitDiff.title': 'Commit file changes',
      'commitDiff.missing': 'Missing parameters for this diff.',
      'commitDiff.stale': 'This tab was opened by an older version; click the file in the commit detail again.',

      'toolbar.refresh': 'Refresh',
      'toolbar.busy': 'Updating…',
      'toolbar.branch': 'Switch branch',
      'toolbar.detached': 'detached HEAD',
      'toolbar.aheadBehind': '{ahead} commits ahead, {behind} behind',
      'toolbar.aheadBehindText': '↑{ahead} ↓{behind}',
      'toolbar.upstream': 'tracking {upstream}',

      'branch.switched': 'Switched to {branch}',
      'branch.detachedOption': '(detached)',

      'state.resolvingCwd': 'Determining the working directory of this session…',
      'state.noCwd': 'This session has no working directory yet.',
      'state.notRepository': 'The working directory is not a Git repository',
      'state.notRepoHint': 'Use the path above to switch to a Git repository in a subdirectory.',
      'state.loading': 'Loading…',
      'state.error': 'Failed to load',
      'state.retry': 'Retry',

      'picker.aria': 'Switch repository directory',
      'picker.label': 'Repository directory',
      'picker.cwd': 'Session working directory',
      'picker.root': 'Repository root',
      'picker.children': 'Subdirectories',
      'picker.loading': 'Probing subdirectories…',
      'picker.empty': 'No Git repository in this level.',
      'picker.error': 'Failed to probe subdirectories',
      'picker.expand': 'Expand {name}',
      'picker.collapse': 'Collapse {name}',
      'picker.choose': 'Switch to {path}',
      'picker.close': 'Close',

      'notice.dismiss': 'Dismiss message',
      'error.unknown': 'Request failed',
      'error.http': 'Request failed (HTTP {status})',
      'error.invalidBody': 'Invalid response body',

      'status.modified': 'Modified',
      'status.added': 'Added',
      'status.deleted': 'Deleted',
      'status.renamed': 'Renamed',
      'status.copied': 'Copied',
      'status.unmerged': 'Unmerged',
      'status.typeChanged': 'Type changed',
      'status.untracked': 'Untracked',

      'detail.title': 'Commit details',
      'detail.copy': 'Copy',
      'detail.copied': 'Commit hash copied',
      'detail.copyFailed': 'Copy failed',
      'detail.parents': 'Parents',
      'detail.files': 'Changed files',
      'detail.loading': 'Loading commit details…',
      'detail.error': 'Failed to load the commit details',
      'detail.empty': 'This commit changed no files.',
      'detail.filesTruncated': 'File list truncated',
      'detail.fileStats': '{add} additions, {del} deletions',
      'detail.explain': 'Ask AI to explain this commit',

      'columns.author': 'Author column width',
      'columns.time': 'Time column width',
      'split.label': 'Resize source control',

      'ai.action': 'AI',
      'ai.menu': 'AI actions',
      'ai.merge': 'Merge branches…',
      'ai.review': 'Review current changes',
      'ai.explainBranch': 'Explain the current branch',
      'ai.filled': 'Filled into the input; press Enter to send',
      'ai.fillFailed': 'No input box available',
      'ai.reviewButton': 'Ask AI to review these changes',
      'ai.mergeTitle': 'Merge branches',
      'ai.mergeSource': 'Source branch',
      'ai.mergeTarget': 'Target branch',
      'ai.mergeNote': 'Additional notes (optional)',
      'ai.mergeEmpty': 'No branches available.',
      'ai.mergeSame': 'The source and target branches are the same.',
      'ai.mergeCancel': 'Cancel',
      'ai.mergeFill': 'Fill into input',
      'ai.promptMerge': 'Repository: {root}\nTarget branch: {target}\nSource branch: {source}\nTask: merge the source branch into the target branch. Inspect the differences and conflict risks between the two branches yourself first, then give an execution plan; do not perform any write operation until I confirm.',
      'ai.promptMergeNote': '\nAdditional notes: {note}',
      'ai.promptReview': 'Repository: {root}\nTask: review the uncommitted changes in the working tree and point out risks and suggestions. Run git status and git diff yourself first; do not perform any write operation until I confirm.',
      'ai.promptBranch': 'Repository: {root}\nTask: explain what the recent commits on the current branch are doing and point out possible risks. Run git log and git diff yourself first.',
      'ai.promptCommit': 'Repository: {root}\nCommit: {short} ({subject})\nTask: explain what this commit changed, why, and what its impact may be. Inspect that commit diff yourself first.',
    }

    /** Milliseconds between silent status polls while a repository is open. */
    const STATUS_POLL_MS = 8000
    /** Milliseconds a notice stays visible before it dismisses itself. */
    const NOTICE_MS = 5000
    /** Commit rows requested from the Host half. */
    const LOG_LIMIT = 80
    /** Right-Sidebar tab kind of the commit-file diff page. */
    const COMMIT_DIFF_KIND = 'git-commit-diff'
    /** Implementation id of that tab type; also the key its body and chip title register under. */
    const COMMIT_DIFF_TAB_ID = 'dsh-git-panel:commit-diff'
    /** Horizontal distance between two graph lanes, in pixels. */
    const LANE_WIDTH = 12
    /** Height of one commit row, in pixels. */
    const ROW_HEIGHT = 26
    /** Narrowest commit-graph column, in pixels. */
    const GRAPH_MIN_WIDTH = 16
    /** Lanes beyond this count are clipped; the row would otherwise lose its text columns. */
    const GRAPH_MAX_LANES = 10
    /** Branch-line palette; fixed because the graph is a drawn figure, not text. */
    const LANE_COLORS = [
      '#4c9aff',
      '#f2a33c',
      '#5cc98d',
      '#e0567a',
      '#a78bfa',
      '#3fc1c9',
      '#e5c07b',
      '#ef7d57',
      '#7aa2f7',
      '#c678dd',
    ]
    /** Porcelain letters the row badge renders verbatim. */
    const BADGE_LETTERS = 'MADRCUT?'
    /** Message fragments the Host uses for a working directory outside Git. */
    const NOT_REPOSITORY_MARKS = ['不是 Git 仓库', 'Not a Git repository']
    /** Unified-diff header prefixes rendered in the muted style. */
    const DIFF_META_PREFIXES = [
      'diff --git',
      'diff --cc',
      'index ',
      'old mode',
      'new mode',
      'new file mode',
      'deleted file mode',
      'similarity index',
      'dissimilarity index',
      'rename from',
      'rename to',
      'copy from',
      'copy to',
      '--- ',
      '+++ ',
      '\\',
      'Binary files',
    ]
    /** Class name per classified diff line. */
    const DIFF_LINE_CLASS = {
      add: 'dsh-git-lineAdd',
      del: 'dsh-git-lineDel',
      meta: 'dsh-git-lineMeta',
      plain: 'dsh-git-linePlain',
    }
    /** Narrowest author/time column, in pixels. */
    const COLUMN_MIN = 60
    /** Widest author/time column, in pixels. */
    const COLUMN_MAX = 240
    /** Default author column width, in pixels. */
    const AUTHOR_WIDTH_DEFAULT = 110
    /** Default time column width, in pixels. */
    const TIME_WIDTH_DEFAULT = 84
    /** Keyboard step of one author/time column, in pixels. */
    const COLUMN_STEP = 8
    /** Width kept for the commit message when both trailing columns are dragged wide. */
    const SUBJECT_MIN_WIDTH = 160
    /** Right padding of one commit row, in pixels; the column handles are measured from it. */
    const ROW_PADDING_RIGHT = 12
    /** Width reserved for the short hash column and the gaps leading up to it, in pixels. */
    const ROW_LEAD_RESERVE = 74
    /** Classic scrollbar width the commit list always reserves (see `.dsh-git-graphScroll`). */
    const SCROLLBAR_GUTTER = 10
    /** Storage key of the author/time column widths. */
    const COLUMNS_STORAGE_KEY = 'dsh.git.columns'
    /** Default source-control pane width, in pixels. */
    const SPLIT_DEFAULT = 340
    /** Narrowest source-control pane, in pixels. */
    const SPLIT_MIN = 160
    /** Largest source-control pane, as a fraction of the view width. */
    const SPLIT_MAX_RATIO = 0.7
    /** Keyboard step of the split divider, in pixels. */
    const SPLIT_STEP = 12
    /** Storage key of the source-control pane width. */
    const SPLIT_STORAGE_KEY = 'dsh.git.split'
    /** Prefix of the per-Session view memory kept in this browser tab. */
    const VIEW_STORAGE_PREFIX = 'dsh.git.view.'

    const EMPTY_FILES = Object.freeze([])
    const EMPTY_COMMITS = Object.freeze([])
    const EMPTY_BRANCHES = Object.freeze({ current: null, locals: Object.freeze([]) })
    const IDLE_DIFF = Object.freeze({ phase: 'idle', data: null, error: null })
    const IDLE_DETAIL = Object.freeze({ phase: 'idle', hash: null, data: null, error: null })
    const IDLE_PATCH = Object.freeze({ phase: 'idle', path: null, data: null, error: null })
    /** No child directory was probed yet for a path. */
    const EMPTY_BROWSE_ENTRIES = Object.freeze([])
    /** No lane continues below a graph row. */
    const EMPTY_LANES = Object.freeze([])
    /** Stand-in snapshots keep the selector hooks callable when the kit omits them. */
    const EMPTY_SESSION_STATE = Object.freeze({ byId: {}, phase: 'ready' })
    const EMPTY_WORKSPACE_STATE = Object.freeze({ items: EMPTY_FILES, phase: 'ready' })

    /** Styles owned by this view; every class name carries the `dsh-git-` prefix. */
    const CSS = `
.dsh-git-view{
  --dsh-git-hover:color-mix(in srgb, var(--dsw-alias-label-primary) 6%, transparent);
  --dsh-git-selected:color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent);
  --dsh-git-faint:color-mix(in srgb, var(--dsw-alias-label-secondary) 70%, transparent);
  --dsh-git-mono:ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  position:relative;
  display:flex;
  flex-direction:column;
  flex:1 1 0;
  width:100%;
  min-width:0;
  height:100%;
  min-height:0;
  overflow:hidden;
  color:var(--dsw-alias-label-primary);
  background:var(--dsw-alias-bg-base);
  font-size:13px;
  line-height:1.5;
}
.dsh-git-view *,.dsh-git-view *::before,.dsh-git-view *::after{box-sizing:border-box}
.dsh-git-view :focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.dsh-git-view[data-resizing="true"]{user-select:none;cursor:col-resize}
.dsh-git-toolbar{flex:none;display:flex;align-items:center;gap:10px;height:40px;padding:0 10px;border-bottom:.5px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base)}
.dsh-git-toolbarRepo{flex:0 1 34%;min-width:0;display:flex;align-items:center;gap:6px;position:relative}
.dsh-git-toolbarGlyph{flex:none;display:inline-flex;align-items:center;color:var(--dsw-alias-brand-primary)}
.dsh-git-repoButton{display:inline-flex;align-items:center;gap:4px;min-width:0;max-width:100%;height:28px;padding:0 4px 0 8px;border:0;border-radius:var(--dsw-radius-sm);background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:13px;line-height:20px;cursor:pointer}
.dsh-git-repoButton:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.dsh-git-repoButton:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.dsh-git-repoButton>svg{flex:none;color:var(--dsw-alias-label-tertiary)}
.dsh-git-toolbarRoot{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;line-height:20px;color:inherit}
.dsh-git-chevron{flex:none;display:inline-flex;align-items:center;color:var(--dsw-alias-label-tertiary);transition:transform .15s ease}
.dsh-git-chevron[data-open="true"]{transform:rotate(180deg)}
.dsh-git-menuSurface{padding:4px;border:0;border-radius:var(--dsw-radius-lg);background:var(--dsw-menu-surface-fill);-webkit-backdrop-filter:var(--dsw-menu-backdrop-filter);backdrop-filter:var(--dsw-menu-backdrop-filter);box-shadow:var(--dsw-elevation-prominent);--dsw-elevation-stroke-color:var(--dsw-alias-border-l1);z-index:1100;max-height:calc(100vh - 120px);overflow:auto}
.dsh-git-picker{position:absolute;top:calc(100% + 4px);left:0;display:flex;flex-direction:column;gap:2px;min-width:240px;max-width:min(420px,84vw)}
.dsh-git-pickerHeader{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:2px 4px 4px 8px}
.dsh-git-pickerHeaderText{font-size:11px;line-height:15px;color:var(--dsw-alias-label-tertiary)}
.dsh-git-pickerClose{flex:none;display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;padding:0;border:0;border-radius:var(--dsw-radius-xs);background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer}
.dsh-git-pickerClose:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.dsh-git-pickerSection{display:flex;flex-direction:column;gap:1px}
.dsh-git-pickerHeading{display:flex;align-items:center;gap:8px;padding:6px 8px;font-size:11px;line-height:15px;color:var(--dsw-alias-label-tertiary)}
.dsh-git-pickerHeading[data-divider="true"]{margin-top:2px;border-top:.5px solid var(--dsw-alias-border-l2)}
.dsh-git-pickerRow{display:flex;align-items:center;gap:6px;width:100%;min-width:0;min-height:34px;padding:6px 8px;border:0;border-radius:var(--dsw-radius-md);background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;text-align:left;cursor:pointer}
.dsh-git-pickerRow:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dsh-git-pickerLabel{flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary)}
.dsh-git-pickerPath{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary)}
.dsh-git-pickerDot{flex:none;width:8px;height:8px;border-radius:50%;background:var(--dsw-alias-state-success-primary)}
.dsh-git-pickerHint{margin:0;padding:6px 8px;font-size:11px;line-height:15px;color:var(--dsw-alias-label-tertiary)}
.dsh-git-pickerHintNested{margin:0;padding:2px 8px 6px 8px;font-size:11px;line-height:15px;color:var(--dsw-alias-label-tertiary)}
.dsh-git-pickerChildren{display:flex;flex-direction:column;gap:1px}
.dsh-git-pickerBranch{display:flex;align-items:center;gap:2px;min-width:0}
.dsh-git-pickerBranch .dsh-git-pickerRow{flex:1;min-width:0;width:auto}
.dsh-git-pickerDisclosure{flex:none;display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;padding:0;border:0;border-radius:4px;background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer}
.dsh-git-pickerDisclosure:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.dsh-git-pickerDisclosure svg{transition:transform .15s ease;transform:rotate(-90deg)}
.dsh-git-pickerDisclosure[data-open="true"] svg{transform:rotate(0)}
.dsh-git-pickerDisclosure[data-empty="true"]{visibility:hidden;pointer-events:none}
.dsh-git-toolbarCenter{flex:1 1 auto;min-width:0;display:flex;align-items:center;gap:8px;overflow:hidden}
.dsh-git-toolbarActions{flex:none;display:flex;align-items:center;gap:6px}
.dsh-git-aiWrap{position:relative;display:inline-flex;align-items:center}
.dsh-git-aiButton{display:inline-flex;align-items:center;gap:4px;height:26px;padding:0 6px;border:0;border-radius:var(--dsw-radius-sm);background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;line-height:18px;cursor:pointer}
.dsh-git-aiButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.dsh-git-aiButton[aria-expanded="true"]{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.dsh-git-aiButton:disabled{opacity:.45;cursor:default}
.dsh-git-aiGlyph{flex:none;display:inline-flex;align-items:center;justify-content:center}
.dsh-git-menu{position:absolute;top:calc(100% + 4px);right:0;display:flex;flex-direction:column;gap:2px;min-width:200px;max-width:min(360px,86vw)}
.dsh-git-menuItem{display:flex;align-items:center;gap:6px;width:100%;min-width:0;min-height:34px;padding:6px 8px;border:0;border-radius:var(--dsw-radius-md);background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;text-align:left;cursor:pointer}
.dsh-git-menuItem:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.dsh-git-menuItem:disabled{opacity:.5;cursor:default}
.dsh-git-mergePopover{position:absolute;top:calc(100% + 4px);right:0;z-index:1200;display:flex;flex-direction:column;gap:8px;width:min(360px,86vw);padding:12px;border:0;border-radius:var(--dsw-radius-lg);background:var(--dsw-specific-menu, var(--dsw-menu-surface-fill));-webkit-backdrop-filter:var(--dsw-menu-backdrop-filter);backdrop-filter:var(--dsw-menu-backdrop-filter);box-shadow:var(--dsw-elevation-prominent);--dsw-elevation-stroke-color:var(--dsw-alias-border-l1)}
.dsh-git-mergeTitle{margin:0;font-size:13px;font-weight:600;line-height:20px;color:var(--dsw-alias-label-primary)}
.dsh-git-mergeGrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.dsh-git-mergeField{display:flex;flex-direction:column;gap:4px;min-width:0}
.dsh-git-mergeLabel{font-size:11px;line-height:15px;color:var(--dsw-alias-label-tertiary)}
.dsh-git-mergeGrid .dsh-git-select{width:100%;max-width:none}
.dsh-git-mergePopover .dsh-git-mergeNote{min-height:52px}
.dsh-git-mergeHint{margin:0;font-size:11px;line-height:15px}
.dsh-git-mergeActions{display:flex;justify-content:flex-end;gap:8px}
.dsh-git-toolbarBusy{flex:none;display:inline-flex;align-items:center;color:var(--dsw-alias-label-secondary)}
.dsh-git-select{flex:none;height:26px;max-width:220px;padding:0 6px;border:.5px solid var(--dsw-alias-border-l1);border-radius:6px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px}
.dsh-git-select:hover:not(:disabled){border-color:var(--dsw-alias-border-l2)}
.dsh-git-select:disabled{opacity:.5;cursor:default}
.dsh-git-chip{flex:none;display:inline-flex;align-items:center;height:20px;padding:0 7px;border:.5px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsh-git-hover);color:var(--dsw-alias-label-secondary);font-size:11px;line-height:18px;white-space:nowrap}
.dsh-git-chipWarn{color:var(--dsw-alias-state-warn-primary);border-color:color-mix(in srgb, var(--dsw-alias-state-warn-primary) 40%, transparent);background:color-mix(in srgb, var(--dsw-alias-state-warn-primary) 12%, transparent)}
.dsh-git-ahead{flex:none;font-size:11px;line-height:18px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums;white-space:nowrap}
.dsh-git-upstream{flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;line-height:18px;color:var(--dsh-git-faint)}
.dsh-git-iconButton{flex:none;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;padding:0;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:13px;line-height:1;cursor:pointer}
.dsh-git-iconButton:hover:not(:disabled){background:var(--dsh-git-hover);color:var(--dsw-alias-label-primary)}
.dsh-git-iconButton:disabled{opacity:.45;cursor:default}
.dsh-git-iconButtonSm{width:20px;height:20px}
.dsh-git-spinner{display:inline-block;width:13px;height:13px;border:1.5px solid;border-color:color-mix(in srgb, currentColor 25%, transparent);border-top-color:currentColor;border-radius:50%;animation:dsh-git-spin .7s linear infinite}
@keyframes dsh-git-spin{to{transform:rotate(360deg)}}
.dsh-git-notice{flex:none;display:flex;align-items:flex-start;gap:8px;margin:8px 10px 0;padding:6px 6px 6px 10px;border:.5px solid;border-radius:6px;font-size:12px;line-height:18px}
.dsh-git-noticeSuccess{color:var(--dsw-alias-state-success-primary);border-color:color-mix(in srgb, var(--dsw-alias-state-success-primary) 40%, transparent);background:color-mix(in srgb, var(--dsw-alias-state-success-primary) 12%, transparent)}
.dsh-git-noticeError{color:var(--dsw-alias-state-error-primary);border-color:color-mix(in srgb, var(--dsw-alias-state-error-primary) 40%, transparent);background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent)}
.dsh-git-noticeText{flex:1;min-width:0;overflow-wrap:anywhere}
.dsh-git-noticeClose{flex:none;display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;padding:0;border:0;border-radius:4px;background:transparent;color:inherit;cursor:pointer;opacity:.8}
.dsh-git-noticeClose:hover{opacity:1;background:color-mix(in srgb, currentColor 14%, transparent)}
.dsh-git-body{flex:1;min-height:0;display:flex;overflow:hidden}
.dsh-git-side{flex:none;min-height:0;display:flex;flex-direction:column;background:var(--dsw-specific-sidebar-fill)}
.dsh-git-divider{flex:none;position:relative;width:6px;padding:0;border:0;background:transparent;cursor:col-resize}
.dsh-git-divider::before{content:'';position:absolute;top:0;bottom:0;left:50%;width:1px;transform:translateX(-50%);background:var(--dsw-alias-border-l2)}
.dsh-git-divider:hover::before,.dsh-git-divider:focus-visible::before,.dsh-git-divider[data-dragging="true"]::before{width:2px;background:var(--dsw-alias-brand-primary)}
.dsh-git-sideHead{flex:none;display:flex;align-items:center;gap:8px;padding:12px 12px 8px}
.dsh-git-sideTitle{flex:none;margin:0;font-size:12px;font-weight:600;line-height:20px;letter-spacing:.02em}
.dsh-git-count{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:var(--dsh-git-hover);color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:500;font-variant-numeric:tabular-nums}
.dsh-git-commit{flex:none;display:flex;flex-direction:column;gap:6px;padding:0 12px 10px;border-bottom:.5px solid var(--dsw-alias-border-l1)}
.dsh-git-textarea{display:block;width:100%;min-height:60px;padding:6px 8px;border:.5px solid var(--dsw-alias-border-l1);border-radius:6px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;line-height:18px;resize:vertical}
.dsh-git-textarea::placeholder{color:var(--dsh-git-faint)}
.dsh-git-textarea:hover:not(:disabled){border-color:var(--dsw-alias-border-l2)}
.dsh-git-textarea:focus{border-color:var(--dsw-alias-brand-primary);outline:none}
.dsh-git-textarea:disabled{opacity:.6;cursor:default}
.dsh-git-commitActions{display:flex;justify-content:flex-end}
.dsh-git-primary{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:26px;padding:0 14px;border:0;border-radius:6px;background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-bg-base);font:inherit;font-size:12px;font-weight:500;cursor:pointer}
.dsh-git-primary:hover:not(:disabled){opacity:.9}
.dsh-git-primary:disabled{opacity:.45;cursor:default}
.dsh-git-groups{flex:1;min-height:0;overflow:auto;padding-bottom:calc(var(--dsh-composer-height, 152px) + 16px);scrollbar-gutter:stable;scrollbar-width:thin;scrollbar-color:color-mix(in srgb, var(--dsw-alias-label-secondary) 35%, transparent) transparent}
.dsh-git-group{display:flex;flex-direction:column}
.dsh-git-groupHead{display:flex;align-items:center;gap:6px;padding:6px 8px 4px 10px}
.dsh-git-groupTitle{min-width:0;margin:0;display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;line-height:16px;letter-spacing:.04em;text-transform:uppercase;color:var(--dsw-alias-label-secondary)}
.dsh-git-spacer{flex:1;min-width:0}
.dsh-git-files{display:flex;flex-direction:column}
.dsh-git-file{display:flex;align-items:center;gap:6px;height:24px;padding:0 6px 0 10px;cursor:pointer}
.dsh-git-file:hover{background:var(--dsh-git-hover)}
.dsh-git-file[aria-selected="true"]{background:var(--dsh-git-selected)}
.dsh-git-fileMain{flex:1;min-width:0;display:flex;align-items:center;gap:6px;padding:0;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}
.dsh-git-fileName{flex:none;max-width:70%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;line-height:18px}
.dsh-git-fileDir{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;line-height:18px;color:var(--dsh-git-faint)}
.dsh-git-fileAction{flex:none;display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;padding:0;border:0;border-radius:4px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:13px;line-height:1;cursor:pointer;opacity:0}
.dsh-git-file:hover .dsh-git-fileAction,.dsh-git-file:focus-within .dsh-git-fileAction{opacity:1}
.dsh-git-fileAction:hover:not(:disabled){background:color-mix(in srgb, var(--dsw-alias-label-primary) 12%, transparent);color:var(--dsw-alias-label-primary)}
.dsh-git-file .dsh-git-fileAction:disabled,.dsh-git-file:hover .dsh-git-fileAction:disabled{opacity:.35;cursor:default}
.dsh-git-badge{flex:none;display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;border-radius:3px;font-family:var(--dsh-git-mono);font-size:10px;font-weight:700;line-height:1;color:var(--dsh-git-badge-color, var(--dsw-alias-label-secondary));background:color-mix(in srgb, var(--dsh-git-badge-color, var(--dsw-alias-label-secondary)) 18%, transparent)}
.dsh-git-badge[data-kind="M"]{--dsh-git-badge-color:var(--dsw-alias-state-warn-primary)}
.dsh-git-badge[data-kind="A"]{--dsh-git-badge-color:var(--dsw-alias-state-success-primary)}
.dsh-git-badge[data-kind="?"]{--dsh-git-badge-color:var(--dsw-alias-state-success-primary)}
.dsh-git-badge[data-kind="D"]{--dsh-git-badge-color:var(--dsw-alias-state-error-primary)}
.dsh-git-badge[data-kind="U"]{--dsh-git-badge-color:var(--dsw-alias-state-error-primary)}
.dsh-git-badge[data-kind="R"]{--dsh-git-badge-color:var(--dsw-alias-brand-primary)}
.dsh-git-badge[data-kind="C"]{--dsh-git-badge-color:var(--dsw-alias-brand-primary)}
.dsh-git-badge[data-kind="T"]{--dsh-git-badge-color:var(--dsw-alias-state-idle-primary)}
.dsh-git-empty{margin:0;padding:8px 12px;font-size:12px;line-height:18px;color:var(--dsh-git-faint)}
.dsh-git-main{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;background:var(--dsw-alias-bg-base)}
.dsh-git-tabs{flex:none;display:flex;align-items:stretch;height:36px;padding:0 4px;border-bottom:.5px solid var(--dsw-alias-border-l1);overflow:hidden}
.dsh-git-tabItem{display:flex;align-items:stretch;min-width:0;max-width:260px}
.dsh-git-tab{display:inline-flex;align-items:center;gap:6px;min-width:0;height:36px;padding:0 10px;border:0;border-bottom:2px solid transparent;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;white-space:nowrap;cursor:pointer}
.dsh-git-tab:hover{background:var(--dsh-git-hover);color:var(--dsw-alias-label-primary)}
.dsh-git-tab[aria-selected="true"]{color:var(--dsw-alias-label-primary);border-bottom-color:var(--dsw-alias-brand-primary)}
.dsh-git-tabLabel{min-width:0;overflow:hidden;text-overflow:ellipsis}
.dsh-git-tabClose{flex:none;display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;margin:9px 2px 0 0;padding:0;border:0;border-radius:4px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer}
.dsh-git-tabClose:hover{background:var(--dsh-git-hover);color:var(--dsw-alias-label-primary)}
.dsh-git-pane{flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden}
.dsh-git-graphHead{flex:none;display:flex;align-items:center;gap:8px;padding:6px 12px;border-bottom:.5px solid var(--dsw-alias-border-l1);font-size:11px;line-height:16px;color:var(--dsh-git-faint)}
.dsh-git-graphArea{position:relative;flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden}
.dsh-git-graphScroll{flex:1;min-height:0;overflow:auto;padding-bottom:calc(var(--dsh-composer-height, 152px) + 16px);scrollbar-gutter:stable;scrollbar-width:thin;scrollbar-color:color-mix(in srgb, var(--dsw-alias-label-secondary) 35%, transparent) transparent}
.dsh-git-graphList{display:flex;flex-direction:column;padding:2px 0}
.dsh-git-graphMore{display:flex;align-items:center;gap:8px;padding:8px 12px;font-size:11px;line-height:18px;color:var(--dsh-git-faint)}
.dsh-git-colHandles{position:absolute;top:0;bottom:0;left:0;pointer-events:none;z-index:3}
.dsh-git-colHandle{position:absolute;top:0;bottom:0;width:6px;pointer-events:auto;cursor:col-resize}
.dsh-git-colHandle::before{content:'';position:absolute;top:0;bottom:0;left:50%;width:1px;transform:translateX(-50%);background:transparent}
.dsh-git-colHandle:hover::before,.dsh-git-colHandle:focus-visible::before,.dsh-git-colHandle[data-dragging="true"]::before{background:var(--dsw-alias-brand-primary)}
.dsh-git-commitItem{display:flex;flex-direction:column}
.dsh-git-commitRow{display:flex;align-items:center;gap:8px;height:26px;padding:0 12px 0 2px;font-size:12px;line-height:18px;overflow:hidden;cursor:pointer}
.dsh-git-commitRow:hover{background:var(--dsh-git-hover)}
.dsh-git-commitRow[data-expanded="true"]{background:var(--dsw-alias-interactive-bg-hover)}
.dsh-git-graphCell{flex:none;display:inline-flex;align-items:center;height:26px}
.dsh-git-graphSvg{display:block}
.dsh-git-hash{flex:none;font-family:var(--dsh-git-mono);font-size:11px;color:var(--dsh-git-faint)}
.dsh-git-refs{flex:0 1 auto;min-width:0;max-width:220px;display:flex;align-items:center;gap:4px;overflow:hidden}
.dsh-git-ref{flex:0 1 auto;min-width:0;display:inline-flex;align-items:center;height:16px;padding:0 5px;border-radius:3px;font-size:10px;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--dsw-alias-label-primary);border:.5px solid color-mix(in srgb, var(--dsh-git-ref-color, var(--dsw-alias-label-secondary)) 55%, transparent);background:color-mix(in srgb, var(--dsh-git-ref-color, var(--dsw-alias-label-secondary)) 22%, transparent)}
.dsh-git-refMore{color:var(--dsh-git-faint);border-color:transparent;background:color-mix(in srgb, var(--dsw-alias-label-secondary) 8%, transparent)}
.dsh-git-ref[data-current="true"]{font-weight:600;background:color-mix(in srgb, var(--dsh-git-ref-color, var(--dsw-alias-brand-primary)) 38%, transparent)}
.dsh-git-subject{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary)}
.dsh-git-author{flex:none;margin-left:-8px;padding-left:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;line-height:18px;color:var(--dsh-git-faint)}
.dsh-git-time{flex:none;margin-left:-8px;padding-left:8px;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;line-height:18px;color:var(--dsh-git-faint);font-variant-numeric:tabular-nums}
.dsh-git-detail{display:flex;flex-direction:column;gap:6px;margin:0 12px 0 8px;padding:8px 10px;border:.5px solid var(--dsw-alias-border-l1);border-top:0;border-radius:0 0 var(--dsw-radius-sm) var(--dsw-radius-sm);background:var(--dsw-alias-bg-layer-1)}
.dsh-git-detailRow{display:flex;align-items:stretch;min-width:0;margin-bottom:6px;position:relative}
.dsh-git-detailGraph{flex:none;margin-left:2px;position:relative;align-self:stretch}
.dsh-git-detailLane{position:absolute;top:0;bottom:-6px;width:1.5px;pointer-events:none}
.dsh-git-detailHead{display:flex;align-items:center;flex-wrap:wrap;gap:6px;font-size:11px;line-height:18px;color:var(--dsw-alias-label-secondary)}
.dsh-git-detailAuthor{color:var(--dsw-alias-label-primary)}
.dsh-git-detailSep{color:var(--dsw-alias-label-tertiary)}
.dsh-git-detailTime{font-variant-numeric:tabular-nums}
.dsh-git-detailHashPart{display:inline-flex;align-items:center;gap:4px;min-width:0}
.dsh-git-detailHash{font-family:var(--dsh-git-mono);font-size:11px;color:var(--dsw-alias-label-secondary);overflow-wrap:anywhere}
.dsh-git-detailCopy{flex:none;height:18px;padding:0 6px;border:.5px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-xs);background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:10px;line-height:16px;cursor:pointer}
.dsh-git-detailCopy:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.dsh-git-detailParents{font-family:var(--dsh-git-mono);font-size:10px;line-height:18px;color:var(--dsw-alias-label-tertiary)}
.dsh-git-detailAi{margin-left:auto}
.dsh-git-detailFiles{display:flex;flex-direction:column;gap:1px}
.dsh-git-detailFileItem{display:flex;flex-direction:column}
.dsh-git-detailFile{display:flex;align-items:center;gap:6px;width:100%;min-width:0;min-height:24px;padding:2px 6px;border:0;border-radius:var(--dsw-radius-xs);background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;line-height:18px;text-align:left;cursor:pointer}
.dsh-git-detailFile:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dsh-git-detailFilePath{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--dsh-git-mono);font-size:11px}
.dsh-git-detailStats{flex:none;display:flex;gap:4px;font-family:var(--dsh-git-mono);font-size:10px;line-height:18px;color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums}
.dsh-git-detailAdd{color:var(--dsw-alias-state-success-primary)}
.dsh-git-detailDel{color:var(--dsw-alias-state-error-primary)}
.dsh-git-detailPatch{display:flex;flex-direction:column;max-height:280px;margin:2px 0 4px 18px;overflow:hidden;border-left:.5px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-xs);background:var(--dsw-alias-bg-base)}
.dsh-git-detailPatchState{flex-direction:row;align-items:center;gap:6px;padding:6px 10px;font-size:11px;line-height:18px;color:var(--dsh-git-faint)}
.dsh-git-detailStateText{min-width:0;overflow-wrap:anywhere}
.dsh-git-detailNote{margin:0;padding:4px 10px;font-size:11px;line-height:16px;color:var(--dsh-git-faint)}
.dsh-git-diff{flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden}
.dsh-git-diffHead{flex:none;display:flex;align-items:center;gap:8px;height:32px;padding:0 8px 0 12px;border-bottom:.5px solid var(--dsw-alias-border-l1)}
.dsh-git-diffTag{flex:none;display:inline-flex;align-items:center;height:18px;padding:0 6px;border:.5px solid var(--dsw-alias-border-l1);border-radius:9px;background:var(--dsh-git-hover);color:var(--dsw-alias-label-secondary);font-size:10px;line-height:16px;white-space:nowrap}
.dsh-git-diffPath{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--dsh-git-mono);font-size:11px;color:var(--dsw-alias-label-secondary)}
.dsh-git-diffBody{flex:1;min-height:0;overflow:auto;padding-bottom:calc(var(--dsh-composer-height, 152px) + 16px);scrollbar-gutter:stable;scrollbar-width:thin;scrollbar-color:color-mix(in srgb, var(--dsw-alias-label-secondary) 35%, transparent) transparent}
.dsh-git-diffPre{margin:0;padding:6px 0;width:max-content;min-width:100%;font-family:var(--dsh-git-mono);font-size:12px;line-height:1.55;tab-size:4}
.dsh-git-diffLine{display:block;padding:0 12px;white-space:pre}
.dsh-git-lineAdd{background:color-mix(in srgb, var(--dsw-alias-state-success-primary) 14%, transparent);color:var(--dsw-alias-state-success-primary)}
.dsh-git-lineDel{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 14%, transparent);color:var(--dsw-alias-state-error-primary)}
.dsh-git-lineMeta{color:var(--dsh-git-faint)}
.dsh-git-linePlain{color:var(--dsw-alias-label-primary)}
.dsh-git-diffNote{margin:0;padding:8px 12px;font-size:11px;line-height:18px;color:var(--dsh-git-faint)}
.dsh-git-sidebarTab{flex:1 1 0;width:100%;height:100%;min-width:0;min-height:0;display:flex;flex-direction:column;overflow:hidden;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.5;--dsh-git-diff-empty-fill:color-mix(in srgb, var(--dsw-alias-interactive-bg-hover) 50%, transparent)}
.dsh-git-sidebarTabHeader{flex:none;display:flex;align-items:center;gap:6px;height:38px;padding:0 6px 0 8px;border-bottom:.5px solid var(--dsw-alias-border-l3)}
.dsh-git-sidebarTabPath{flex:0 1 auto;min-width:0;overflow:hidden;display:flex;align-items:center}
.dsh-git-sidebarTabCounts{flex:none;display:flex;align-items:center;gap:6px;font-family:var(--dsh-git-mono);font-size:11px;line-height:16px;font-variant-numeric:tabular-nums}
.dsh-git-sidebarTabAdd{color:var(--dsw-alias-state-success-primary)}
.dsh-git-sidebarTabDel{color:var(--dsw-alias-state-error-primary)}
.dsh-git-sidebarTabSpacer{flex:1;min-width:0}
.dsh-git-sidebarTabTool{flex:none;display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;padding:0;border:0;border-radius:4px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer}
.dsh-git-sidebarTabTool:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.dsh-git-sidebarTabTool[aria-pressed="true"]{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.dsh-git-compareIcon{transition:transform .15s ease}
.dsh-git-sidebarTabTool[aria-pressed="true"] .dsh-git-compareIcon{transform:rotate(90deg)}
.dsh-git-sidebarTabMeta{flex:none;margin:0;padding:6px 16px 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;line-height:16px;color:var(--dsh-git-faint)}
.dsh-git-diffBody{flex:1;min-height:0;overflow:auto;padding:8px 0 16px;font:var(--dsw-font-markdown-code-block);display:flex;flex-direction:column;scrollbar-gutter:stable}
.dsh-git-diffBody[data-view="unified"]:not([data-wrap="true"]){display:grid;grid-template-columns:minmax(max-content,100%);align-content:start}
.dsh-git-diffStatus{margin:0;padding:16px;display:flex;align-items:center;gap:12px;font-size:13px;color:var(--dsw-alias-label-secondary)}
.dsh-git-diffNote{margin:0;padding:4px 16px 8px;font-size:12px;color:var(--dsw-alias-label-tertiary)}
.dsh-git-diffHunk{margin-bottom:8px}
.dsh-git-diffHunkHeader{white-space:pre;padding:4px 16px;color:var(--dsw-alias-label-tertiary)}
.dsh-git-diffLine{box-sizing:border-box;white-space:pre;display:grid;grid-template-columns:3.5em 3.5em 1.2em minmax(0,1fr);min-height:22px;line-height:22px}
.dsh-git-diffNumber{color:var(--dsw-alias-label-tertiary);text-align:right;user-select:none;padding-right:8px}
.dsh-git-diffSign{text-align:center;user-select:none}
.dsh-git-diffText{padding-right:16px;min-width:0;display:block}
.dsh-git-diffColumns{flex:auto;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);min-height:0}
.dsh-git-diffColumn{min-width:0;overflow-x:scroll;overscroll-behavior:none;display:grid;grid-template-columns:minmax(max-content,100%);align-content:start}
.dsh-git-diffColumn+.dsh-git-diffColumn{border-left:.5px solid var(--dsw-alias-border-l3)}
.dsh-git-diffSideLine{box-sizing:border-box;white-space:pre;display:grid;grid-template-columns:3.5em max-content;width:max-content;min-width:100%;min-height:22px;line-height:22px}
.dsh-git-diffSplitLine{white-space:pre;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);min-height:22px;line-height:22px}
.dsh-git-diffCell{box-sizing:border-box;display:grid;grid-template-columns:3.5em minmax(0,1fr);min-width:0}
.dsh-git-diffCell+.dsh-git-diffCell{border-left:.5px solid var(--dsw-alias-border-l3)}
.dsh-git-diffBody[data-wrap="true"] .dsh-git-diffLine,.dsh-git-diffBody[data-wrap="true"] .dsh-git-diffSplitLine{white-space:pre-wrap}
.dsh-git-diffBody[data-wrap="true"] .dsh-git-diffText{overflow-wrap:anywhere}
.dsh-git-diffAdd{--dsh-git-diff-gutter:var(--dsw-alias-file-diff-added-gutter);--dsh-git-diff-marker:var(--dsw-alias-file-diff-added-marker);background:var(--dsw-alias-file-diff-added-bg)}
.dsh-git-diffDel{--dsh-git-diff-gutter:var(--dsw-alias-file-diff-deleted-gutter);--dsh-git-diff-marker:var(--dsw-alias-file-diff-deleted-marker);background:var(--dsw-alias-file-diff-deleted-bg)}
.dsh-git-diffAdd .dsh-git-diffNumber,.dsh-git-diffDel .dsh-git-diffNumber{background:var(--dsh-git-diff-gutter);color:var(--dsh-git-diff-marker)}
.dsh-git-diffAdd .dsh-git-diffNumber:first-child,.dsh-git-diffDel .dsh-git-diffNumber:first-child{box-shadow:inset 3px 0 0 var(--dsh-git-diff-marker)}
.dsh-git-diffAdd .dsh-git-diffSign,.dsh-git-diffDel .dsh-git-diffSign{color:var(--dsh-git-diff-marker)}
.dsh-git-diffContext .dsh-git-diffText{color:var(--dsw-alias-label-secondary)}
.dsh-git-diffEmpty{background:var(--dsh-git-diff-empty-fill)}
.dsh-git-diffTitle{display:inline-flex;align-items:center;gap:4px;min-width:0}
.dsh-git-state{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:32px 24px;text-align:center;color:var(--dsh-git-faint)}
.dsh-git-stateTitle{margin:0;font-size:13px;font-weight:500;line-height:20px;color:var(--dsw-alias-label-primary)}
.dsh-git-stateText{margin:0;max-width:52ch;font-size:12px;line-height:18px;overflow-wrap:anywhere}
.dsh-git-stateHint{margin:2px 0 0;max-width:52ch;font-size:11px;line-height:16px;color:var(--dsh-git-faint)}
.dsh-git-errorText{color:var(--dsw-alias-state-error-primary)}
.dsh-git-miniButton{display:inline-flex;align-items:center;justify-content:center;height:24px;padding:0 10px;border:.5px solid var(--dsw-alias-border-l1);border-radius:6px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;cursor:pointer}
.dsh-git-miniButton:hover:not(:disabled){background:var(--dsh-git-hover);border-color:var(--dsw-alias-border-l2)}
.dsh-git-view ::-webkit-scrollbar{width:10px;height:10px}
.dsh-git-view ::-webkit-scrollbar-track{background:transparent}
.dsh-git-view ::-webkit-scrollbar-thumb{border:2px solid transparent;border-radius:5px;background-clip:padding-box;background-color:color-mix(in srgb, var(--dsw-alias-label-secondary) 35%, transparent)}
.dsh-git-view ::-webkit-scrollbar-thumb:hover{background-color:color-mix(in srgb, var(--dsw-alias-label-secondary) 55%, transparent)}
`

    /**
     * Report whether a thrown value is an aborted request.
     * @param failure - thrown value.
     * @returns true for an AbortError.
     */
    function isAbort(failure) {
      return Boolean(failure) && failure.name === 'AbortError'
    }

    /**
     * Read a displayable message out of a thrown value.
     * @param failure - thrown value.
     * @param t - translate function.
     * @returns the message text.
     */
    function messageOf(failure, t) {
      if (failure && typeof failure.message === 'string' && failure.message !== '') return failure.message
      const text = String(failure === null || failure === undefined ? '' : failure)
      return text === '' ? t('error.unknown') : text
    }

    /**
     * Report whether a failure message means "this directory is not a Git repository".
     * @param message - Host failure message.
     * @returns true when the Host refused the directory as a repository.
     */
    function isNotRepository(message) {
      if (typeof message !== 'string') return false
      for (let index = 0; index < NOT_REPOSITORY_MARKS.length; index += 1) {
        if (message.indexOf(NOT_REPOSITORY_MARKS[index]) !== -1) return true
      }
      return false
    }

    /**
     * Clamp a number into an inclusive range.
     * @param value - candidate value.
     * @param min - lower bound.
     * @param max - upper bound.
     * @returns the clamped value.
     */
    function clamp(value, min, max) {
      if (value < min) return min
      if (value > max) return max
      return value
    }

    /**
     * Shorten a full commit hash for display.
     * @param hash - full or already short hash.
     * @returns the first seven characters.
     */
    function shortOf(hash) {
      return typeof hash === 'string' ? hash.slice(0, 7) : ''
    }

    /**
     * Read one stored column width.
     * @param parsed - parsed storage value.
     * @param key - column name.
     * @param fallback - width used when the stored value is missing or invalid.
     * @returns the clamped width.
     */
    function readColumnWidth(parsed, key, fallback) {
      const value = parsed !== null && typeof parsed === 'object' ? parsed[key] : undefined
      if (!Number.isFinite(value)) return fallback
      return clamp(Math.round(value), COLUMN_MIN, COLUMN_MAX)
    }

    /**
     * Load the stored author/time column widths.
     * @returns the widths; an unreadable store falls back to the defaults.
     */
    function readColumnWidths() {
      const fallback = { author: AUTHOR_WIDTH_DEFAULT, time: TIME_WIDTH_DEFAULT }
      try {
        const raw = window.localStorage.getItem(COLUMNS_STORAGE_KEY)
        if (raw === null) return fallback
        const parsed = JSON.parse(raw)
        return {
          author: readColumnWidth(parsed, 'author', AUTHOR_WIDTH_DEFAULT),
          time: readColumnWidth(parsed, 'time', TIME_WIDTH_DEFAULT),
        }
      } catch {
        // A blocked or corrupt store still has to render; the defaults are the only safe answer.
        return fallback
      }
    }

    /**
     * Load the stored source-control pane width.
     * @returns the width; an unreadable store falls back to the default.
     */
    function readSplitWidth() {
      try {
        const raw = window.localStorage.getItem(SPLIT_STORAGE_KEY)
        if (raw === null) return SPLIT_DEFAULT
        const value = Number(raw)
        if (!Number.isFinite(value)) return SPLIT_DEFAULT
        return Math.max(SPLIT_MIN, Math.round(value))
      } catch {
        // A blocked store must not stop the view from mounting.
        return SPLIT_DEFAULT
      }
    }

    /**
     * Persist one layout value, ignoring a refused write.
     * @param key - storage key.
     * @param text - serialized value.
     */
    function writeStorage(key, text) {
      try {
        window.localStorage.setItem(key, text)
      } catch {
        // Layout persistence is a convenience; a refused write keeps the current width.
      }
    }

    /**
     * Read the view memory of one Session.
     * @param sessionId - Session identity, or undefined before one is bound.
     * @returns the stored fields; an absent or unreadable record is an empty object.
     */
    function readViewState(sessionId) {
      if (typeof sessionId !== 'string' || sessionId === '') return {}
      try {
        const raw = window.sessionStorage.getItem(VIEW_STORAGE_PREFIX + sessionId)
        if (raw === null) return {}
        const parsed = JSON.parse(raw)
        return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
      } catch {
        // Navigation memory is a convenience; an unreadable record only loses it.
        return {}
      }
    }

    /**
     * Persist the view memory of one Session in this browser tab.
     * @param sessionId - Session identity.
     * @param value - JSON-safe state snapshot.
     */
    function writeViewState(sessionId, value) {
      if (typeof sessionId !== 'string' || sessionId === '') return
      try {
        window.sessionStorage.setItem(VIEW_STORAGE_PREFIX + sessionId, JSON.stringify(value))
      } catch {
        // A blocked or full store only loses the navigation memory.
      }
    }

    /**
     * Call one `git-ui` action on the Host half.
     * @param action - action name.
     * @param params - action parameters.
     * @param signal - abort signal for the request.
     * @param t - translate function for transport failures.
     * @returns the parsed action value.
     */
    async function postGitAction(action, params, signal, t) {
      const url = new URL('api/git-ui', document.baseURI)
      let response
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ action, ...(params || {}) }),
          credentials: 'same-origin',
          signal,
        })
      } catch (failure) {
        if (isAbort(failure)) throw failure
        throw new Error(messageOf(failure, t))
      }
      if (!response.ok) throw new Error(t('error.http', { status: response.status }))
      let payload
      try {
        payload = await response.json()
      } catch {
        throw new Error(t('error.invalidBody'))
      }
      if (payload === null || typeof payload !== 'object') throw new Error(t('error.invalidBody'))
      if (payload.ok !== true) {
        const failure = payload.error
        const message = failure && typeof failure.message === 'string' && failure.message !== ''
          ? failure.message
          : t('error.unknown')
        throw new Error(message)
      }
      return payload.value
    }

    /**
     * Normalize the Host status payload so every rendered field has a usable type.
     * @param value - raw status value.
     * @returns the normalized status, or null when the value is not an object.
     */
    function normalizeStatus(value) {
      if (value === null || typeof value !== 'object' || Array.isArray(value)) return null
      const files = []
      if (Array.isArray(value.files)) {
        for (let index = 0; index < value.files.length; index += 1) {
          const file = value.files[index]
          if (file === null || typeof file !== 'object') continue
          if (typeof file.path !== 'string' || file.path === '') continue
          files.push({
            path: file.path,
            status: typeof file.status === 'string' ? file.status : '',
            staged: file.staged === true,
            unstaged: file.unstaged === true,
            untracked: file.untracked === true,
          })
        }
      }
      return {
        root: typeof value.root === 'string' ? value.root : '',
        branch: typeof value.branch === 'string' && value.branch !== '' ? value.branch : null,
        detached: value.detached === true,
        unborn: value.unborn === true,
        upstream: typeof value.upstream === 'string' && value.upstream !== '' ? value.upstream : null,
        ahead: Number.isFinite(value.ahead) ? value.ahead : 0,
        behind: Number.isFinite(value.behind) ? value.behind : 0,
        files,
      }
    }

    /**
     * Normalize the Host branch list payload.
     * @param value - raw `branches` value.
     * @returns the current branch and the local branch names.
     */
    function normalizeBranches(value) {
      const locals = []
      if (value && Array.isArray(value.locals)) {
        for (let index = 0; index < value.locals.length; index += 1) {
          const name = value.locals[index]
          if (typeof name === 'string' && name !== '' && locals.indexOf(name) === -1) locals.push(name)
        }
      }
      return {
        current: value && typeof value.current === 'string' && value.current !== '' ? value.current : null,
        locals,
      }
    }

    /**
     * Normalize the Host commit page payload.
     * @param value - raw `log` value.
     * @returns the commits that carry a hash, and whether older commits remain.
     */
    function normalizeLog(value) {
      if (!value || !Array.isArray(value.commits)) return { commits: EMPTY_COMMITS, hasMore: false }
      const commits = []
      for (let index = 0; index < value.commits.length; index += 1) {
        const commit = value.commits[index]
        if (commit === null || typeof commit !== 'object') continue
        if (typeof commit.hash !== 'string' || commit.hash === '') continue
        commits.push(commit)
      }
      return { commits, hasMore: value.hasMore === true }
    }

    /**
     * Normalize one ref badge.
     * @param ref - raw ref value.
     * @returns the badge, or null when the value carries no usable name.
     */
    function normalizeRef(ref) {
      if (ref === null || typeof ref !== 'object') return null
      if (typeof ref.name !== 'string' || ref.name === '') return null
      return {
        name: ref.name,
        kind: typeof ref.kind === 'string' && ref.kind !== '' ? ref.kind : 'branch',
        current: ref.current === true,
      }
    }

    /**
     * Normalize the Host `commitDetail` payload.
     * @param value - raw detail value.
     * @returns the detail with every rendered field typed, or null when the value is not an object.
     */
    function normalizeCommitDetail(value) {
      if (value === null || typeof value !== 'object' || Array.isArray(value)) return null
      const hash = typeof value.hash === 'string' ? value.hash : ''
      const parents = []
      if (Array.isArray(value.parents)) {
        for (let index = 0; index < value.parents.length; index += 1) {
          const parent = value.parents[index]
          if (typeof parent !== 'string' || parent === '') continue
          parents.push(parent)
        }
      }
      const refs = []
      if (Array.isArray(value.refs)) {
        for (let index = 0; index < value.refs.length; index += 1) {
          const ref = normalizeRef(value.refs[index])
          if (ref !== null) refs.push(ref)
        }
      }
      const files = []
      if (Array.isArray(value.files)) {
        for (let index = 0; index < value.files.length; index += 1) {
          const file = value.files[index]
          if (file === null || typeof file !== 'object') continue
          if (typeof file.path !== 'string' || file.path === '') continue
          files.push({
            path: file.path,
            status: typeof file.status === 'string' && file.status !== '' ? file.status : '?',
            additions: Number.isFinite(file.additions) ? file.additions : null,
            deletions: Number.isFinite(file.deletions) ? file.deletions : null,
          })
        }
      }
      return {
        hash,
        short: typeof value.short === 'string' && value.short !== '' ? value.short : shortOf(hash),
        author: typeof value.author === 'string' ? value.author : '',
        authorEmail: typeof value.authorEmail === 'string' ? value.authorEmail : '',
        time: Number.isFinite(value.time) ? value.time : 0,
        subject: typeof value.subject === 'string' ? value.subject : '',
        parents,
        refs,
        files,
        truncatedFiles: value.truncatedFiles === true,
      }
    }

    /**
     * Split diff text into rendered lines without the trailing newline's empty tail.
     * @param text - unified diff text.
     * @returns one entry per rendered line.
     */
    function splitLines(text) {
      if (typeof text !== 'string' || text === '') return []
      const lines = text.split('\n')
      while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop()
      for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index]
        if (line.length > 0 && line.charCodeAt(line.length - 1) === 13) lines[index] = line.slice(0, -1)
      }
      return lines
    }

    /**
     * Classify one diff line for styling.
     * @param line - raw diff line.
     * @returns one of `add`, `del`, `meta`, `plain`.
     */
    function diffLineKind(line) {
      const text = typeof line === 'string' ? line : ''
      if (text.slice(0, 2) === '@@') return 'meta'
      for (let index = 0; index < DIFF_META_PREFIXES.length; index += 1) {
        const prefix = DIFF_META_PREFIXES[index]
        if (text.slice(0, prefix.length) === prefix) return 'meta'
      }
      if (text.charAt(0) === '+') return 'add'
      if (text.charAt(0) === '-') return 'del'
      return 'plain'
    }

    /**
     * Build the rendered diff lines and their trailing notes.
     * @param value - `{ diff, truncated, untracked }` payload.
     * @param t - translate function.
     * @param keyPrefix - React key prefix for the returned nodes.
     * @returns the nodes of one diff body.
     */
    function diffNodes(value, t, keyPrefix) {
      const nodes = []
      const source = value !== null && value !== undefined && typeof value === 'object' ? value : {}
      const lines = splitLines(source.diff)
      if (lines.length === 0) {
        nodes.push(h('p', {
          key: keyPrefix + '-empty',
          className: 'dsh-git-diffNote',
        }, source.untracked === true ? t('diff.untrackedEmpty') : t('diff.empty')))
      } else {
        nodes.push(h('pre', { key: keyPrefix + '-pre', className: 'dsh-git-diffPre' }, lines.map((line, index) => h('span', {
          key: index,
          className: 'dsh-git-diffLine ' + DIFF_LINE_CLASS[diffLineKind(line)],
        }, line === '' ? ' ' : line))))
      }
      if (source.truncated === true) {
        nodes.push(h('p', { key: keyPrefix + '-truncated', className: 'dsh-git-diffNote' }, t('diff.truncated')))
      }
      return nodes
    }

    /**
     * Derive the one-letter badge from a porcelain XY status.
     * @param status - two-character porcelain status, such as `' M'`, `'M '`, or `'??'`.
     * @returns the badge letter.
     */
    function deriveBadge(status) {
      const text = typeof status === 'string' ? status : ''
      const trimmed = text.trim()
      if (trimmed === '') return '?'
      const head = text.charAt(0)
      const tail = text.charAt(1)
      const candidate = head !== '' && head !== ' ' ? head : tail
      if (candidate !== '' && BADGE_LETTERS.indexOf(candidate) !== -1) return candidate
      return trimmed.charAt(0)
    }

    /**
     * Map a badge letter to its translated status name key.
     * @param letter - badge letter.
     * @returns dictionary key of the status name.
     */
    function statusKeyOf(letter) {
      if (letter === 'M') return 'status.modified'
      if (letter === 'A') return 'status.added'
      if (letter === 'D') return 'status.deleted'
      if (letter === 'R') return 'status.renamed'
      if (letter === 'C') return 'status.copied'
      if (letter === 'U') return 'status.unmerged'
      if (letter === 'T') return 'status.typeChanged'
      return 'status.untracked'
    }

    /**
     * Split a repository-relative path into its file name and its directory.
     * @param path - repository-relative path.
     * @returns the last segment and the leading directory, without a trailing separator.
     */
    function splitPath(path) {
      const text = typeof path === 'string' ? path : ''
      const slash = text.lastIndexOf('/')
      const backslash = text.lastIndexOf('\\')
      const cut = slash > backslash ? slash : backslash
      if (cut === -1) return { name: text, dir: '' }
      return { name: text.slice(cut + 1), dir: text.slice(0, cut) }
    }

    /**
     * Map a commit ref kind to its translated label.
     * @param kind - ref kind reported by the Host.
     * @param t - translate function.
     * @returns the badge description.
     */
    function refKindLabel(kind, t) {
      if (kind === 'tag') return t('graph.tag')
      if (kind === 'remote') return t('graph.remote')
      if (kind === 'head') return t('graph.head')
      return t('graph.branch')
    }

    /**
     * Build the ref badges of one commit.
     * @param refs - ref values reported by the Host.
     * @param t - translate function.
     * @param collapse - keep only the current ref (or the first) and a count of the rest.
     * @param colorIndex - palette index of the commit's lane; the badges take its colour.
     * @returns the badge elements.
     */
    function refBadges(refs, t, collapse = true, colorIndex = null) {
      const normalized = []
      if (Array.isArray(refs)) {
        for (let index = 0; index < refs.length; index += 1) {
          const ref = normalizeRef(refs[index])
          if (ref !== null) normalized.push(ref)
        }
      }
      if (normalized.length === 0) return []
      const shown = collapse
        ? [normalized.find((ref) => ref.current === true) || normalized[0]]
        : normalized
      const laneTint = typeof colorIndex === 'number' && Number.isFinite(colorIndex)
        ? laneColor(colorIndex)
        : null
      const badges = shown.map((ref, index) => h('span', {
        key: 'ref-' + index + '-' + ref.name,
        className: 'dsh-git-ref',
        'data-kind': ref.kind,
        'data-current': ref.current ? 'true' : 'false',
        title: refKindLabel(ref.kind, t) + ': ' + ref.name,
        style: laneTint === null ? undefined : { '--dsh-git-ref-color': laneTint },
      }, ref.name))
      const hidden = normalized.length - shown.length
      if (hidden > 0) {
        badges.push(h('span', {
          key: 'ref-more',
          className: 'dsh-git-ref dsh-git-refMore',
          title: normalized.map((ref) => refKindLabel(ref.kind, t) + ': ' + ref.name).join('\n'),
        }, '+' + hidden))
      }
      return badges
    }

    /**
     * Format a commit time with the browser's own date and time formatting.
     * @param seconds - epoch seconds.
     * @returns the locale-formatted date and time, or an empty string for a missing time.
     */
    function formatCommitTime(seconds) {
      const value = Number(seconds)
      if (!Number.isFinite(value) || value <= 0) return ''
      return new Date(value * 1000).toLocaleString()
    }

    /**
     * Horizontal center of one graph lane.
     * @param lane - lane index.
     * @returns the x coordinate in pixels.
     */
    function laneX(lane) {
      return lane * LANE_WIDTH + LANE_WIDTH / 2
    }

    /**
     * Straight vertical segment inside one lane.
     * @param lane - lane index.
     * @param fromY - start y.
     * @param toY - end y.
     * @returns the path data.
     */
    function verticalPath(lane, fromY, toY) {
      const x = laneX(lane)
      return 'M' + x + ' ' + fromY + 'L' + x + ' ' + toY
    }

    /**
     * Curve from the top edge of one lane into the commit dot.
     * @param fromLane - lane the line arrives from.
     * @param toLane - lane carrying the dot.
     * @returns the path data.
     */
    function convergePath(fromLane, toLane) {
      const x1 = laneX(fromLane)
      const x2 = laneX(toLane)
      const midY = ROW_HEIGHT / 2
      if (x1 === x2) return 'M' + x1 + ' 0L' + x1 + ' ' + midY
      return 'M' + x1 + ' 0Q' + x1 + ' ' + midY + ' ' + x2 + ' ' + midY
    }

    /**
     * Curve from the commit dot into a parent lane at the bottom edge.
     * @param fromLane - lane carrying the dot.
     * @param toLane - lane carrying the parent.
     * @returns the path data.
     */
    function mergePath(fromLane, toLane) {
      const x1 = laneX(fromLane)
      const x2 = laneX(toLane)
      const midX = (x1 + x2) / 2
      const startY = ROW_HEIGHT / 2
      const midY = (ROW_HEIGHT * 3) / 4
      return 'M' + x1 + ' ' + startY + 'Q' + x1 + ' ' + midY + ' ' + midX + ' ' + midY
        + 'Q' + x2 + ' ' + midY + ' ' + x2 + ' ' + ROW_HEIGHT
    }

    /**
     * Assign every commit a graph lane and the line segments its row draws.
     *
     * A lane holds the hash of the commit its line is heading for, or null when
     * the column is free. Columns never move: a line keeps its column for as long
     * as it is live, so continuing lines are straight vertical segments and only
     * a merge or a join edge bends towards the column it links to. A commit takes
     * the lane that already points at it; its first parent inherits that lane.
     * Every further parent reuses its lane when one exists and otherwise takes the
     * leftmost free column, or a new right-hand column when none is free, so
     * starting a branch never shoves an existing line sideways.
     *
     * Colours travel with the line, not with the lane index: `laneColors` runs
     * parallel to `lanes` and holds palette indices, so a lane keeps its colour
     * for its whole life, and only a brand-new branch line draws a new one.
     * @param commits - commits in topological order, newest first.
     * @returns the rows with their geometry, and the widest lane count.
     */
    function buildGraph(commits) {
      let lanes = []
      let laneColors = []
      const rows = []
      const list = Array.isArray(commits) ? commits : []
      const palette = LANE_COLORS.length
      let laneCount = 1

      /** Smallest palette index no live lane holds, else one past the used count. */
      const allocateColor = () => {
        const used = new Array(palette).fill(false)
        let usedCount = 0
        for (let index = 0; index < laneColors.length; index += 1) {
          const color = laneColors[index]
          if (typeof color !== 'number' || color < 0 || color >= palette) continue
          if (used[color]) continue
          used[color] = true
          usedCount += 1
        }
        for (let index = 0; index < palette; index += 1) {
          if (!used[index]) return index
        }
        return (usedCount + 1) % palette
      }

      for (let index = 0; index < list.length; index += 1) {
        const commit = list[index]
        const hash = commit !== null && typeof commit === 'object' && typeof commit.hash === 'string' ? commit.hash : ''
        const parents = []
        if (commit !== null && typeof commit === 'object' && Array.isArray(commit.parents)) {
          for (let parentIndex = 0; parentIndex < commit.parents.length; parentIndex += 1) {
            const parent = commit.parents[parentIndex]
            if (typeof parent !== 'string' || parent === '' || parent === hash) continue
            if (parents.indexOf(parent) === -1) parents.push(parent)
          }
        }

        const top = lanes.slice()
        const topColors = laneColors.slice()
        const inherited = top.indexOf(hash)
        let lane = inherited
        if (lane === -1) {
          lane = top.indexOf(null)
          if (lane === -1) lane = top.length
        }
        let dotColor = topColors[lane]
        if (typeof dotColor !== 'number') dotColor = allocateColor()
        /** Colour a continuing lane keeps across the row. */
        const colorOfTop = (topIndex) => (typeof topColors[topIndex] === 'number' ? topColors[topIndex] : allocateColor())

        // Columns stay where they are: continuing lanes are copied unchanged, so
        // their lines remain vertical. This commit's own column keeps the first
        // parent, lanes that also point at this commit end here, and extra parents
        // take a free column when one exists instead of pushing lines aside.
        const bottom = top.slice()
        const bottomColors = topColors.slice()
        while (bottom.length <= lane) {
          bottom.push(null)
          bottomColors.push(null)
        }
        for (let topIndex = 0; topIndex < top.length; topIndex += 1) {
          if (topIndex === lane || top[topIndex] !== hash) continue
          bottom[topIndex] = null
          bottomColors[topIndex] = null
        }
        bottom[lane] = parents.length > 0 ? parents[0] : null
        bottomColors[lane] = parents.length > 0 ? dotColor : null

        const targets = []
        if (parents.length > 0) targets.push({ lane, order: 0, colorIndex: dotColor })
        for (let parentIndex = 1; parentIndex < parents.length; parentIndex += 1) {
          const parent = parents[parentIndex]
          let target = bottom.indexOf(parent)
          if (target === -1) {
            target = bottom.indexOf(null)
            if (target === -1) {
              target = bottom.length
              bottom.push(null)
              bottomColors.push(null)
            }
            bottom[target] = parent
            bottomColors[target] = allocateColor()
          }
          if (typeof bottomColors[target] !== 'number') bottomColors[target] = allocateColor()
          targets.push({ lane: target, order: parentIndex, colorIndex: bottomColors[target] })
        }

        if (bottom.length > laneCount) laneCount = bottom.length
        const shapes = []
        if (inherited !== -1) shapes.push({ key: 'top', d: verticalPath(lane, 0, ROW_HEIGHT / 2), colorIndex: dotColor })
        for (let topIndex = 0; topIndex < top.length; topIndex += 1) {
          if (topIndex === lane) continue
          if (top[topIndex] === null || top[topIndex] === undefined) continue
          const lineColor = colorOfTop(topIndex)
          if (top[topIndex] === hash) {
            shapes.push({ key: 'join-' + topIndex, d: convergePath(topIndex, lane), colorIndex: lineColor })
            continue
          }
          shapes.push({ key: 'lane-' + topIndex, d: verticalPath(topIndex, 0, ROW_HEIGHT), colorIndex: lineColor })
        }
        for (let targetIndex = 0; targetIndex < targets.length; targetIndex += 1) {
          const target = targets[targetIndex]
          const targetColor = typeof target.colorIndex === 'number' ? target.colorIndex : dotColor
          shapes.push({
            key: 'parent-' + target.order,
            d: target.order === 0
              ? verticalPath(lane, ROW_HEIGHT / 2, ROW_HEIGHT)
              : mergePath(lane, target.lane),
            colorIndex: targetColor,
          })
        }
        const below = []
        for (let columnIndex = 0; columnIndex < bottom.length; columnIndex += 1) {
          if (bottom[columnIndex] === null || typeof bottomColors[columnIndex] !== 'number') continue
          below.push({ lane: columnIndex, colorIndex: bottomColors[columnIndex] })
        }
        rows.push({
          commit,
          lane,
          width: bottom.length,
          shapes,
          dot: { x: laneX(lane), colorIndex: dotColor },
          below,
        })
        lanes = bottom
        laneColors = bottomColors
      }
      return { rows, laneCount }
    }

    /**
     * Map a palette index to its hexadecimal colour.
     * @param index - palette index stored by {@link buildGraph}.
     * @returns the colour the SVG paints.
     */
    function laneColor(index) {
      if (!Number.isFinite(index)) return LANE_COLORS[0]
      return LANE_COLORS[((index % LANE_COLORS.length) + LANE_COLORS.length) % LANE_COLORS.length]
    }

    /**
     * Render a Git branch glyph.
     * @param edge - square edge in pixels.
     * @returns the SVG element.
     */
    function branchGlyph(edge) {
      return h('svg', {
        width: edge,
        height: edge,
        viewBox: '0 0 20 20',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.6,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
        focusable: 'false',
      }, [
        h('circle', { key: 'head', cx: 5.5, cy: 4.5, r: 2 }),
        h('circle', { key: 'base', cx: 5.5, cy: 15.5, r: 2 }),
        h('circle', { key: 'branch', cx: 14.5, cy: 7.5, r: 2 }),
        h('path', { key: 'trunk', d: 'M5.5 6.5v7' }),
        h('path', { key: 'link', d: 'M5.5 10.5c0-2.4 2.6-3 7-3' }),
      ])
    }

    /**
     * Render a refresh glyph.
     * @param edge - square edge in pixels.
     * @returns the SVG element.
     */
    function refreshGlyph(edge) {
      return h('svg', {
        width: edge,
        height: edge,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
        focusable: 'false',
      }, [
        h('path', { key: 'top', d: 'M23 4v6h-6' }),
        h('path', { key: 'bottom', d: 'M1 20v-6h6' }),
        h('path', { key: 'arcTop', d: 'M3.51 9a9 9 0 0 1 14.85-3.36L23 10' }),
        h('path', { key: 'arcBottom', d: 'M20.49 15a9 9 0 0 1-14.85 3.36L1 14' }),
      ])
    }

    /**
     * Render a close glyph.
     * @param edge - square edge in pixels.
     * @returns the SVG element.
     */
    function closeGlyph(edge) {
      return h('svg', {
        width: edge,
        height: edge,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        'aria-hidden': 'true',
        focusable: 'false',
      }, [
        h('path', { key: 'a', d: 'M18 6 6 18' }),
        h('path', { key: 'b', d: 'm6 6 12 12' }),
      ])
    }

    /**
     * Render a sparkle glyph for the AI entries.
     * @param edge - square edge in pixels.
     * @returns the SVG element.
     */
    function sparkGlyph(edge) {
      return h('svg', {
        width: edge,
        height: edge,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
        focusable: 'false',
      }, [
        h('path', { key: 'cross', d: 'M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4' }),
        h('path', { key: 'star', d: 'M6.4 6.4l2.6 2.6M15 15l2.6 2.6M17.6 6.4L15 9M9 15l-2.6 2.6' }),
      ])
    }

    /**
     * Render one centered state block.
     * @param options - key, optional spinner, title, text, error tone, and retry action.
     * @returns the state element.
     */
    function renderState(options) {
      const children = []
      if (options.spinner === true) {
        children.push(h('span', { key: 'spin', className: 'dsh-git-spinner', 'aria-hidden': 'true' }))
      }
      if (typeof options.title === 'string' && options.title !== '') {
        children.push(h('p', { key: 'title', className: 'dsh-git-stateTitle' }, options.title))
      }
      if (typeof options.text === 'string' && options.text !== '') {
        children.push(h('p', {
          key: 'text',
          className: options.error === true ? 'dsh-git-stateText dsh-git-errorText' : 'dsh-git-stateText',
        }, options.text))
      }
      if (typeof options.hint === 'string' && options.hint !== '') {
        children.push(h('p', { key: 'hint', className: 'dsh-git-stateHint' }, options.hint))
      }
      if (typeof options.retryLabel === 'string' && typeof options.onRetry === 'function') {
        children.push(h('button', {
          key: 'retry',
          type: 'button',
          className: 'dsh-git-miniButton',
          onClick: options.onRetry,
        }, options.retryLabel))
      }
      return h('div', { key: options.key, className: 'dsh-git-state' }, children)
    }

    /**
     * Render the small downward chevron of the repository button.
     * @param edge - square edge in pixels.
     * @returns the SVG element.
     */
    function chevronGlyph(edge) {
      return h('svg', {
        width: edge,
        height: edge,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
        focusable: 'false',
      }, [h('path', { key: 'chevron', d: 'm6 9 6 6 6-6' })])
    }

    /**
     * Render the cascading repository picker: the Session working directory, the
     * enclosing repository root, and one directory level at a time. A directory
     * probes its children only when the reader expands it, so opening the menu
     * never scans a whole tree; a repository row selects that repository and a
     * chevron beside it drills into its own subdirectories.
     * @param options - working directory, effective repository, probed levels, copy, and callbacks.
     * @returns the menu element.
     */
    function renderRepoPicker(options) {
      const { t, cwd, repository, root, nodes, expanded, onChoose, onToggle, onRetry, onClose } = options

      const headRow = (key, label, target, active) => h('button', {
        key,
        type: 'button',
        role: 'menuitem',
        className: 'dsh-git-pickerRow',
        title: target,
        onClick: () => { onChoose(target) },
      }, [
        h('span', { key: 'label', className: 'dsh-git-pickerLabel' }, label),
        h('span', { key: 'path', className: 'dsh-git-pickerPath' }, target),
        active
          ? h('span', { key: 'dot', className: 'dsh-git-pickerDot', 'aria-hidden': 'true' })
          : null,
      ])

      const headRows = []
      if (cwd !== null) headRows.push(headRow('cwd', t('picker.cwd'), cwd, repository === cwd))
      const repoRoot = root !== null && typeof root.repoRoot === 'string' && root.repoRoot !== '' ? root.repoRoot : null
      if (repoRoot !== null && repoRoot !== cwd) {
        headRows.push(headRow('root', t('picker.root'), repoRoot, repository === repoRoot))
      }

      /** Rows of one probed level, including a loading, empty, or failed state. */
      const levelRows = (path, depth) => {
        const indent = { paddingLeft: 6 + depth * 12 }
        const node = nodes[path]
        if (node === undefined || node.phase === 'loading') {
          return [h('p', { key: 'level-loading:' + path, className: 'dsh-git-pickerHintNested', style: indent }, t('picker.loading'))]
        }
        if (node.phase === 'error') {
          return [h('div', { key: 'level-error:' + path, className: 'dsh-git-pickerHintNested', style: indent }, [
            h('span', { key: 'text' }, node.error === null ? t('picker.error') : node.error),
            h('button', {
              key: 'retry',
              type: 'button',
              className: 'dsh-git-miniButton',
              onClick: () => { onRetry(path) },
            }, t('state.retry')),
          ])]
        }
        if (node.entries.length === 0) {
          return [h('p', { key: 'level-empty:' + path, className: 'dsh-git-pickerHintNested', style: indent }, t('picker.empty'))]
        }
        const rows = []
        for (let index = 0; index < node.entries.length; index += 1) {
          const entry = node.entries[index]
          const open = expanded[entry.path] === true
          const disclosureLabel = open
            ? t('picker.collapse', { name: entry.name })
            : t('picker.expand', { name: entry.name })
          rows.push(h('div', { key: 'node:' + entry.path, className: 'dsh-git-pickerChildren' }, [
            h('div', { key: 'branch', className: 'dsh-git-pickerBranch', style: indent }, [
              h('button', {
                key: 'disclosure',
                type: 'button',
                className: 'dsh-git-pickerDisclosure',
                'data-open': open ? 'true' : 'false',
                'data-empty': entry.hasChildren ? 'false' : 'true',
                tabIndex: entry.hasChildren ? 0 : -1,
                'aria-label': disclosureLabel,
                title: disclosureLabel,
                onClick: () => { onToggle(entry.path) },
              }, chevronGlyph(12)),
              h('button', {
                key: 'row',
                type: 'button',
                role: 'menuitem',
                className: 'dsh-git-pickerRow',
                title: entry.isRepo ? t('picker.choose', { path: entry.path }) : entry.path,
                'aria-expanded': entry.hasChildren ? (open ? 'true' : 'false') : undefined,
                onClick: () => {
                  if (entry.isRepo) onChoose(entry.path)
                  else onToggle(entry.path)
                },
              }, [
                h('span', { key: 'label', className: 'dsh-git-pickerLabel' }, entry.name),
                entry.isRepo
                  ? h('span', { key: 'path', className: 'dsh-git-pickerPath' }, t('picker.root'))
                  : null,
                repository === entry.path
                  ? h('span', { key: 'dot', className: 'dsh-git-pickerDot', 'aria-hidden': 'true' })
                  : null,
              ]),
            ]),
            open
              ? h('div', { key: 'children', className: 'dsh-git-pickerChildren' }, levelRows(entry.path, depth + 1))
              : null,
          ]))
        }
        return rows
      }

      return h('div', {
        key: 'picker',
        className: 'dsh-git-menuSurface dsh-git-picker',
        role: 'menu',
        'aria-label': t('picker.label'),
      }, [
        h('div', { key: 'head', className: 'dsh-git-pickerHeader' }, [
          h('span', { key: 'text', className: 'dsh-git-pickerHeaderText' }, t('picker.label')),
          h('button', {
            key: 'close',
            type: 'button',
            className: 'dsh-git-pickerClose',
            'aria-label': t('picker.close'),
            title: t('picker.close'),
            onClick: onClose,
          }, closeGlyph(12)),
        ]),
        h('div', { key: 'section', className: 'dsh-git-pickerSection' }, headRows),
        h('div', { key: 'subhead', className: 'dsh-git-pickerHeading', 'data-divider': 'true' }, t('picker.children')),
        cwd === null
          ? null
          : h('div', { key: 'tree', className: 'dsh-git-pickerChildren', role: 'group', 'aria-label': t('picker.children') }, levelRows(cwd, 0)),
      ])
    }

    /**
     * Render one changed file row.
     * @param options - file, group side, selection, busy flag, copy, and handlers.
     * @returns the row element.
     */
    function renderFileRow(options) {
      const { file, staged, selected, busy, t, onOpen, onToggle } = options
      const letter = deriveBadge(file.status)
      const parts = splitPath(file.path)
      const actionLabel = staged ? t('file.unstage', { path: file.path }) : t('file.stage', { path: file.path })
      return h('div', {
        key: (staged ? 'staged:' : 'changed:') + file.path,
        className: 'dsh-git-file',
        role: 'option',
        'aria-selected': selected ? 'true' : 'false',
        title: file.path,
      }, [
        h('button', {
          key: 'main',
          type: 'button',
          className: 'dsh-git-fileMain',
          'aria-label': t('file.open', { path: file.path }),
          onClick: onOpen,
        }, [
          h('span', {
            key: 'badge',
            className: 'dsh-git-badge',
            'data-kind': letter,
            title: t(statusKeyOf(letter)),
            'aria-hidden': 'true',
          }, letter),
          h('span', { key: 'name', className: 'dsh-git-fileName' }, parts.name),
          parts.dir === '' ? null : h('span', { key: 'dir', className: 'dsh-git-fileDir' }, parts.dir),
        ]),
        h('button', {
          key: 'action',
          type: 'button',
          className: 'dsh-git-fileAction',
          disabled: busy,
          'aria-label': actionLabel,
          title: actionLabel,
          onClick: onToggle,
        }, staged ? '−' : '+'),
      ])
    }

    /**
     * Render one staged or changed group with its bulk action.
     * @param options - group key, heading, files, side, bulk action, selection, and handlers.
     * @returns the group section.
     */
    function renderChangeGroup(options) {
      const {
        groupKey,
        title,
        files,
        actionLabel,
        actionGlyph,
        onAction,
        busy,
        staged,
        selection,
        t,
        onOpen,
        onToggle,
      } = options
      const rows = files.map((file) => renderFileRow({
        file,
        staged,
        selected: selection !== null && selection.staged === staged && selection.path === file.path,
        busy,
        t,
        onOpen: () => { onOpen(file, staged) },
        onToggle: () => { onToggle(file, staged) },
      }))
      return h('section', { key: groupKey, className: 'dsh-git-group', 'aria-label': title }, [
        h('header', { key: 'head', className: 'dsh-git-groupHead' }, [
          h('h3', { key: 'title', className: 'dsh-git-groupTitle' }, [
            h('span', { key: 'text' }, title),
            h('span', { key: 'count', className: 'dsh-git-count' }, String(files.length)),
          ]),
          h('span', { key: 'spacer', className: 'dsh-git-spacer' }),
          h('button', {
            key: 'all',
            type: 'button',
            className: 'dsh-git-iconButton dsh-git-iconButtonSm',
            disabled: busy || files.length === 0,
            'aria-label': actionLabel,
            title: actionLabel,
            onClick: onAction,
          }, actionGlyph),
        ]),
        h('div', {
          key: 'files',
          className: 'dsh-git-files',
          role: 'listbox',
          'aria-label': title,
          'aria-multiselectable': 'false',
        }, rows),
      ])
    }

    /**
     * Render one commit row with its graph column and fixed trailing columns.
     * @param options - graph row, copy, current clock, graph width, column widths, and expansion state.
     * @returns the row element.
     */
    function renderCommitRow(options) {
      const { row, t, graphWidth, columns, expanded, onToggle } = options
      const commit = row.commit !== null && typeof row.commit === 'object' ? row.commit : {}
      const hash = typeof commit.hash === 'string' ? commit.hash : ''
      const short = typeof commit.short === 'string' && commit.short !== '' ? commit.short : shortOf(hash)
      const subject = typeof commit.subject === 'string' ? commit.subject : ''
      const author = typeof commit.author === 'string' ? commit.author : ''
      const when = formatCommitTime(commit.time)
      const badges = refBadges(commit.refs, t, true, row.dot.colorIndex)
      const graph = h('svg', {
        className: 'dsh-git-graphSvg',
        width: graphWidth,
        height: ROW_HEIGHT,
        viewBox: '0 0 ' + graphWidth + ' ' + ROW_HEIGHT,
        'aria-hidden': 'true',
        focusable: 'false',
      }, [
        ...row.shapes.map((shape) => h('path', {
          key: shape.key,
          d: shape.d,
          fill: 'none',
          stroke: laneColor(shape.colorIndex),
          strokeWidth: 1.5,
          strokeLinecap: 'round',
        })),
        h('circle', {
          key: 'dot',
          cx: row.dot.x,
          cy: ROW_HEIGHT / 2,
          r: 3,
          fill: laneColor(row.dot.colorIndex),
          stroke: 'var(--dsw-alias-bg-base)',
          strokeWidth: 1,
        }),
      ])
      return h('div', {
        key: 'row',
        className: 'dsh-git-commitRow',
        role: 'button',
        tabIndex: 0,
        'aria-expanded': expanded ? 'true' : 'false',
        'data-expanded': expanded ? 'true' : 'false',
        onClick: onToggle,
        onKeyDown: (event) => {
          if (event.target !== event.currentTarget) return
          if (event.key !== 'Enter' && event.key !== ' ') return
          event.preventDefault()
          onToggle()
        },
      }, [
        h('span', { key: 'graph', className: 'dsh-git-graphCell' }, graph),
        h('span', { key: 'hash', className: 'dsh-git-hash', title: hash }, short),
        badges.length === 0 ? null : h('span', { key: 'refs', className: 'dsh-git-refs' }, badges),
        h('span', { key: 'subject', className: 'dsh-git-subject', title: subject }, subject),
        h('span', {
          key: 'author',
          className: 'dsh-git-author',
          title: author,
          style: { width: columns.author },
        }, author),
        h('span', {
          key: 'time',
          className: 'dsh-git-time',
          title: when,
          style: { width: columns.time },
        }, when),
      ])
    }

    /**
     * Render the inline commit-detail panel shown under an expanded row.
     * @param options - detail state, patch state, copy, clock, geometry, and handlers.
     * @returns the panel element.
     */
    function renderCommitDetail(options) {
      const {
        detail,
        openFilePatch,
        t,
        refColor,
        onOpenFile,
        onCopy,
        onRetry,
        onToggleFile,
        onRetryFile,
        onExplain,
      } = options
      const children = []
      if (detail.phase === 'loading' || detail.phase === 'idle') {
        children.push(h('div', { key: 'loading', className: 'dsh-git-detailHead' }, [
          h('span', { key: 'spin', className: 'dsh-git-spinner', 'aria-hidden': 'true' }),
          h('span', { key: 'text' }, t('detail.loading')),
        ]))
      } else if (detail.phase === 'error') {
        children.push(h('div', { key: 'error', className: 'dsh-git-detailHead' }, [
          h('span', { key: 'text', className: 'dsh-git-detailStateText dsh-git-errorText' }, detail.error === null ? t('detail.error') : detail.error),
          h('button', {
            key: 'retry',
            type: 'button',
            className: 'dsh-git-miniButton',
            onClick: onRetry,
          }, t('state.retry')),
        ]))
      } else if (detail.phase === 'ready' && detail.data !== null) {
        const data = detail.data
        const when = formatCommitTime(data.time)
        const parts = []
        if (data.author !== '') {
          parts.push(h('span', {
            key: 'author',
            className: 'dsh-git-detailAuthor',
            title: data.authorEmail === '' ? data.author : data.author + ' <' + data.authorEmail + '>',
          }, data.author))
        }
        if (when !== '') {
          parts.push(h('span', {
            key: 'time',
            className: 'dsh-git-detailTime',
            title: when,
          }, when))
        }
        if (data.hash !== '') {
          parts.push(h('span', { key: 'hash', className: 'dsh-git-detailHashPart' }, [
            h('span', { key: 'text', className: 'dsh-git-detailHash', title: data.hash }, data.hash),
            h('button', {
              key: 'copy',
              type: 'button',
              className: 'dsh-git-detailCopy',
              onClick: (event) => { event.stopPropagation(); onCopy(data.hash) },
            }, t('detail.copy')),
          ]))
        }
        if (data.parents.length > 0) {
          const parentText = data.parents.map(shortOf).join(' ')
          parts.push(h('span', {
            key: 'parents',
            className: 'dsh-git-detailParents',
            title: data.parents.join('\n'),
          }, t('detail.parents') + ' ' + parentText))
        }
        const headChildren = []
        for (let index = 0; index < parts.length; index += 1) {
          if (index > 0) {
            headChildren.push(h('span', { key: 'sep-' + index, className: 'dsh-git-detailSep', 'aria-hidden': 'true' }, '·'))
          }
          headChildren.push(parts[index])
        }
        const badges = refBadges(data.refs, t, false, refColor)
        for (let index = 0; index < badges.length; index += 1) headChildren.push(badges[index])
        headChildren.push(h('button', {
          key: 'ai',
          type: 'button',
          className: 'dsh-git-miniButton dsh-git-detailAi',
          onClick: (event) => { event.stopPropagation(); onExplain(data) },
        }, t('detail.explain')))
        children.push(h('div', { key: 'head', className: 'dsh-git-detailHead' }, headChildren))

        const fileRows = []
        for (let index = 0; index < data.files.length; index += 1) {
          const file = data.files[index]
          const letter = file.status
          const open = openFilePatch !== null && openFilePatch.path === file.path
          const binary = file.additions === null && file.deletions === null
          const stats = binary
            ? h('span', { key: 'stats', className: 'dsh-git-detailStats' }, '—')
            : h('span', {
              key: 'stats',
              className: 'dsh-git-detailStats',
              title: t('detail.fileStats', {
                add: file.additions === null ? 0 : file.additions,
                del: file.deletions === null ? 0 : file.deletions,
              }),
            }, [
              h('span', { key: 'add', className: 'dsh-git-detailAdd' }, '+' + (file.additions === null ? 0 : file.additions)),
              h('span', { key: 'del', className: 'dsh-git-detailDel' }, '−' + (file.deletions === null ? 0 : file.deletions)),
            ])
          fileRows.push(h('div', { key: 'file-' + index, className: 'dsh-git-detailFileItem' }, [
            h('button', {
              key: 'row',
              type: 'button',
              className: 'dsh-git-detailFile',
              'aria-expanded': typeof onOpenFile === 'function' ? undefined : (open ? 'true' : 'false'),
              title: file.path,
              onClick: () => {
                // The right Sidebar is the primary surface; the inline patch is
                // the fallback for a Harness without that column.
                if (typeof onOpenFile === 'function') onOpenFile(file.path)
                else onToggleFile(file.path)
              },
            }, [
              h('span', {
                key: 'badge',
                className: 'dsh-git-badge',
                'data-kind': letter,
                title: t(statusKeyOf(letter)),
                'aria-hidden': 'true',
              }, letter),
              h('span', { key: 'path', className: 'dsh-git-detailFilePath' }, file.path),
              stats,
            ]),
            open ? renderCommitPatch({ state: openFilePatch, t, onRetry: onRetryFile }) : null,
          ]))
        }
        if (fileRows.length === 0) {
          children.push(h('p', { key: 'empty', className: 'dsh-git-detailNote' }, t('detail.empty')))
        } else {
          children.push(h('div', {
            key: 'files',
            className: 'dsh-git-detailFiles',
            role: 'group',
            'aria-label': t('detail.files'),
          }, fileRows))
        }
        if (data.truncatedFiles) {
          children.push(h('p', { key: 'truncated', className: 'dsh-git-detailNote' }, t('detail.filesTruncated')))
        }
      }
      return h('div', {
        key: 'detail',
        className: 'dsh-git-detail',
        role: 'region',
        'aria-label': t('detail.title'),
      }, children)
    }

    /**
     * Render the lane lines that run beside an expanded commit detail.
     *
     * The expanded row's own SVG ends at the row edge, so without these the graph
     * looks cut where a detail is open. The lanes painted here are exactly the
     * ones the next row's top edge continues.
     * @param row - graph row produced by {@link buildGraph}.
     * @returns the absolutely positioned line elements.
     */
    function renderDetailLanes(row) {
      const lanes = Array.isArray(row.below) ? row.below : EMPTY_LANES
      return lanes.map((entry) => h('span', {
        key: 'detail-lane-' + entry.lane,
        className: 'dsh-git-detailLane',
        style: { left: (laneX(entry.lane) - 0.75) + 'px', backgroundColor: laneColor(entry.colorIndex) },
        'aria-hidden': 'true',
      }))
    }

    /**
     * Render one inline commit-file patch with its loading and failure states.
     * @param options - patch state, copy, and retry handler.
     * @returns the patch element.
     */
    function renderCommitPatch(options) {
      const { state, t, onRetry } = options
      if (state === null) return null
      if (state.phase === 'loading' || state.phase === 'idle') {
        return h('div', { key: 'patch', className: 'dsh-git-detailPatch dsh-git-detailPatchState' }, [
          h('span', { key: 'spin', className: 'dsh-git-spinner', 'aria-hidden': 'true' }),
          h('span', { key: 'text' }, t('diff.loading')),
        ])
      }
      if (state.phase === 'error') {
        return h('div', { key: 'patch', className: 'dsh-git-detailPatch dsh-git-detailPatchState' }, [
          h('span', {
            key: 'text',
            className: 'dsh-git-detailStateText dsh-git-errorText',
          }, state.error === null ? t('diff.error') : state.error),
          h('button', {
            key: 'retry',
            type: 'button',
            className: 'dsh-git-miniButton',
            onClick: onRetry,
          }, t('state.retry')),
        ])
      }
      return h('div', { key: 'patch', className: 'dsh-git-detailPatch' }, [
        h('div', { key: 'body', className: 'dsh-git-diffBody' }, diffNodes(state.data, t, 'commit-patch')),
      ])
    }

    /**
     * Build the right-Sidebar address of one commit file's diff.
     *
     * A resource address is the tab's whole identity: it is what deduplicates
     * opens and what lets the tab restore after a reload, since navigation
     * parameters are not persisted with the layout.
     * @param repo - absolute repository path.
     * @param hash - full commit hash.
     * @param path - repository-relative file path.
     * @returns the `dsh-resource://git-commit-diff/…` address.
     */
    function commitDiffAddress(repo, hash, path) {
      const segments = String(path).split('/').map((segment) => encodeURIComponent(segment))
      return 'dsh-resource://git-commit-diff/' + encodeURIComponent(repo) + '/' + encodeURIComponent(hash) + '/' + segments.join('/')
    }

    /**
     * Read the target back out of a commit-file diff address.
     * @param address - the tab's address.
     * @returns the repository, commit, file path, and whether the address uses this type's shape.
     */
    function parseCommitDiffAddress(address) {
      const text = typeof address === 'string' ? address : ''
      const prefix = 'dsh-resource://git-commit-diff/'
      if (text.slice(0, prefix.length) !== prefix) return { repo: '', hash: '', path: '', recognized: false }
      const segments = text.slice(prefix.length).split('/')
      const decode = (value) => {
        try {
          return decodeURIComponent(value)
        } catch {
          return ''
        }
      }
      return {
        repo: segments.length > 0 ? decode(segments[0]) : '',
        hash: segments.length > 1 ? decode(segments[1]) : '',
        path: segments.length > 2 ? segments.slice(2).map(decode).join('/') : '',
        recognized: true,
      }
    }

    /**
     * Read the target of the commit-diff tab from its persistent address.
     * @param useTabInfo - the tab's framework-bound information hook.
     * @returns the repository, commit, path, and display copy.
     */
    function readCommitDiffTarget(useTabInfo) {
      const info = typeof useTabInfo === 'function' ? useTabInfo() : null
      const tab = info !== null && info !== undefined && typeof info === 'object' ? info.tab : null
      const navigation = tab !== null && tab !== undefined && typeof tab === 'object' ? tab.navigation : null
      const address = navigation !== null && navigation !== undefined && typeof navigation === 'object' && typeof navigation.address === 'string'
        ? navigation.address
        : (tab !== null && tab !== undefined && typeof tab === 'object' && typeof tab.contentId === 'string' ? tab.contentId : '')
      const target = parseCommitDiffAddress(address)
      const revision = navigation !== null && navigation !== undefined && typeof navigation === 'object' && Number.isFinite(navigation.revision)
        ? navigation.revision
        : 0
      return {
        repo: target.repo,
        hash: target.hash,
        path: target.path,
        recognized: target.recognized,
        revision,
      }
    }

    /** Maximum diff lines rendered in one Sidebar tab, matching the review tab's budget. */
    const DIFF_MAX_RENDERED_LINES = 5000
    /** Storage key of the Sidebar diff layout choices. */
    const DIFF_VIEW_STORAGE_KEY = 'dsh.git.diffView'

    /**
     * Parse one unified diff into the comparison model the Harness review tab
     * uses: numbered hunks plus created/deleted/binary markers.
     * @param text - unified diff text.
     * @returns the hunks and the file-level markers.
     */
    function parseUnifiedDiff(text) {
      const hunks = []
      let current = null
      let created = false
      let deleted = false
      let binary = false
      const lines = splitLines(text)
      for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index]
        if (line.slice(0, 2) === '@@') {
          const match = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/.exec(line)
          if (match !== null) {
            current = {
              oldStart: Number(match[1]),
              oldLines: match[2] === undefined ? 1 : Number(match[2]),
              newStart: Number(match[3]),
              newLines: match[4] === undefined ? 1 : Number(match[4]),
              lines: [],
            }
            hunks.push(current)
            continue
          }
        }
        if (line.charAt(0) === '\\') continue
        if (line.indexOf('new file mode') === 0) { created = true; continue }
        if (line.indexOf('deleted file mode') === 0) { deleted = true; continue }
        if (line.indexOf('Binary files') === 0) { binary = true; continue }
        if (line.slice(0, 10) === 'diff --git') { current = null; continue }
        if (current === null) continue
        const sign = line.charAt(0)
        if (sign !== ' ' && sign !== '+' && sign !== '-') continue
        current.lines.push(line)
      }
      return { hunks, created, deleted, binary }
    }

    /**
     * Number a hunk's lines: context on both sides, deletions old, additions new.
     * @param hunk - a parsed hunk.
     * @returns the numbered rows.
     */
    function diffHunkRows(hunk) {
      let oldNumber = hunk.oldStart
      let newNumber = hunk.newStart
      const rows = []
      for (let index = 0; index < hunk.lines.length; index += 1) {
        const line = hunk.lines[index]
        const text = line.slice(1)
        if (line.charAt(0) === '+') {
          rows.push({ kind: 'add', old: null, new: newNumber, text })
          newNumber += 1
          continue
        }
        if (line.charAt(0) === '-') {
          rows.push({ kind: 'del', old: oldNumber, new: null, text })
          oldNumber += 1
          continue
        }
        rows.push({ kind: 'context', old: oldNumber, new: newNumber, text })
        oldNumber += 1
        newNumber += 1
      }
      return rows
    }

    /**
     * Pair a hunk's lines for the side-by-side view: each run of deletions is
     * aligned with the run of additions that follows it, row by row.
     * @param hunk - a parsed hunk.
     * @returns the paired rows.
     */
    function diffSplitRows(hunk) {
      const rows = []
      let deletions = []
      let additions = []
      const flush = () => {
        const count = Math.max(deletions.length, additions.length)
        for (let at = 0; at < count; at += 1) {
          const row = {}
          if (deletions[at] !== undefined) row.left = deletions[at]
          if (additions[at] !== undefined) row.right = additions[at]
          rows.push(row)
        }
        deletions = []
        additions = []
      }
      const numbered = diffHunkRows(hunk)
      for (let index = 0; index < numbered.length; index += 1) {
        const row = numbered[index]
        if (row.kind === 'del') {
          deletions.push({ no: row.old, text: row.text, kind: 'del' })
          continue
        }
        if (row.kind === 'add') {
          additions.push({ no: row.new, text: row.text, kind: 'add' })
          continue
        }
        flush()
        rows.push({
          left: { no: row.old, text: row.text, kind: 'context' },
          right: { no: row.new, text: row.text, kind: 'context' },
        })
      }
      flush()
      return rows
    }

    /**
     * The kind a paired row carries, for styling the row.
     * @param row - one paired row.
     * @returns `del`, `add`, or `context`.
     */
    function diffSplitRowKind(row) {
      if (row.left !== undefined && row.left.kind === 'del') return 'del'
      if (row.right !== undefined && row.right.kind === 'add') return 'add'
      return 'context'
    }

    /**
     * Rebuild one hunk's header from its numbers.
     * @param hunk - a parsed hunk.
     * @returns the `@@ -a,b +c,d @@` line.
     */
    function diffHunkHeader(hunk) {
      return '@@ -' + hunk.oldStart + ',' + hunk.oldLines + ' +' + hunk.newStart + ',' + hunk.newLines + ' @@'
    }

    /**
     * Cut the rendered hunks at the line budget.
     * @param hunks - parsed hunks.
     * @returns the kept hunks and whether anything was cut.
     */
    function diffRenderedHunks(hunks) {
      let budget = DIFF_MAX_RENDERED_LINES
      const kept = []
      for (let index = 0; index < hunks.length; index += 1) {
        const hunk = hunks[index]
        if (budget === 0) return { hunks: kept, truncated: true }
        kept.push(hunk.lines.length <= budget ? hunk : Object.assign({}, hunk, { lines: hunk.lines.slice(0, budget) }))
        budget -= Math.min(budget, hunk.lines.length)
      }
      return { hunks: kept, truncated: kept.some((hunk, at) => hunk !== hunks[at]) }
    }

    /**
     * Highlight one side of a hunk, keyed by line number.
     * @param rows - numbered rows.
     * @param side - `old` or `new`.
     * @param highlighter - the primitives highlighter.
     * @returns spans by line number, or undefined when highlighting is unavailable.
     */
    function diffHighlightedSide(rows, side, highlighter) {
      const source = []
      for (let index = 0; index < rows.length; index += 1) {
        const no = rows[index][side]
        if (no === null || no === undefined) continue
        source.push({ no, text: rows[index].text })
      }
      if (source.length === 0) return new Map()
      const highlighted = highlighter(source.map((line) => line.text).join('\n'))
      if (highlighted === undefined || highlighted === null) return undefined
      const result = new Map()
      for (let index = 0; index < source.length; index += 1) {
        result.set(source[index].no, highlighted[index] === undefined ? [] : highlighted[index])
      }
      return result
    }

    /**
     * Highlight both sides of one hunk.
     * @param hunk - a parsed hunk.
     * @param highlighter - the primitives highlighter.
     * @returns spans by side and line number.
     */
    function diffHunkHighlights(hunk, highlighter) {
      const rows = diffHunkRows(hunk)
      return {
        old: diffHighlightedSide(rows, 'old', highlighter),
        new: diffHighlightedSide(rows, 'new', highlighter),
      }
    }

    /**
     * Render one diff text cell, with the highlighter's spans when it produced any.
     * @param props - cell text and optional spans.
     * @returns the text element.
     */
    function DiffText(props) {
      const spans = props.spans
      if (spans === undefined || spans === null) {
        return h('span', { key: 'text', className: 'dsh-git-diffText' }, props.text)
      }
      return h('span', { key: 'text', className: 'dsh-git-diffText', 'data-diff-code': 'true' },
        spans.map((span, index) => h('span', { key: index, style: span.style }, span.text)))
    }

    /**
     * Render one hunk in the single-column layout.
     * @param hunk - a rendered hunk.
     * @param position - hunk index, for keys.
     * @param highlighted - spans by side and line number.
     * @returns the hunk section.
     */
    function renderUnifiedHunk(hunk, position, highlighted) {
      const numbered = diffHunkRows(hunk)
      const rows = []
      for (let index = 0; index < numbered.length; index += 1) {
        const row = numbered[index]
        const spans = row.kind === 'add'
          ? (highlighted.new === undefined ? undefined : highlighted.new.get(row.new))
          : (highlighted.old === undefined ? undefined : highlighted.old.get(row.old))
        rows.push(h('div', {
          key: 'line-' + index,
          className: 'dsh-git-diffLine dsh-git-diff' + (row.kind === 'add' ? 'Add' : row.kind === 'del' ? 'Del' : 'Context'),
          'data-diff-line': row.kind,
        }, [
          h('span', { key: 'oldNo', className: 'dsh-git-diffNumber' }, row.old === null ? '' : String(row.old)),
          h('span', { key: 'newNo', className: 'dsh-git-diffNumber' }, row.new === null ? '' : String(row.new)),
          h('span', { key: 'sign', className: 'dsh-git-diffSign' }, row.kind === 'add' ? '+' : row.kind === 'del' ? '-' : ' '),
          h(DiffText, { key: 'text', text: row.text, spans }),
        ]))
      }
      return h('section', { key: 'hunk-' + position, className: 'dsh-git-diffHunk' }, [
        h('div', { key: 'header', className: 'dsh-git-diffHunkHeader', 'data-diff-hunk-header': 'true' }, diffHunkHeader(hunk)),
        ...rows,
      ])
    }

    /**
     * Render one hunk in the wrapped side-by-side layout.
     * @param hunk - a rendered hunk.
     * @param position - hunk index, for keys.
     * @param highlighted - spans by side and line number.
     * @returns the hunk section.
     */
    function renderWrappedSplitHunk(hunk, position, highlighted) {
      const paired = diffSplitRows(hunk)
      const rows = []
      const cell = (side, entry, spans) => h('span', {
        key: side,
        className: 'dsh-git-diffCell ' + (entry === undefined ? 'dsh-git-diffEmpty' : 'dsh-git-diff' + (entry.kind === 'add' ? 'Add' : entry.kind === 'del' ? 'Del' : 'Context')),
      }, [
        h('span', { key: 'no', className: 'dsh-git-diffNumber' }, entry === undefined ? '' : String(entry.no)),
        h(DiffText, { key: 'text', text: entry === undefined ? '' : entry.text, spans }),
      ])
      for (let index = 0; index < paired.length; index += 1) {
        const row = paired[index]
        const left = row.left
        const right = row.right
        rows.push(h('div', {
          key: 'row-' + index,
          className: 'dsh-git-diffSplitLine',
          'data-diff-line': diffSplitRowKind(row),
        }, [
          cell('left', left, left === undefined ? undefined : (highlighted.old === undefined ? undefined : highlighted.old.get(left.no))),
          cell('right', right, right === undefined ? undefined : (highlighted.new === undefined ? undefined : highlighted.new.get(right.no))),
        ]))
      }
      return h('section', { key: 'hunk-' + position, className: 'dsh-git-diffHunk' }, [
        h('div', { key: 'header', className: 'dsh-git-diffHunkHeader', 'data-diff-hunk-header': 'true' }, diffHunkHeader(hunk)),
        ...rows,
      ])
    }

    /**
     * Render the side-by-side view without wrapping: two columns that scroll
     * together on both axes, one fixed-height row per pair.
     * @param props - rendered hunks and their highlights.
     * @returns the two-column body.
     */
    function SidebarSplitColumns(props) {
      const hunks = props.hunks
      const highlights = props.highlights
      const paired = useMemo(() => hunks.map((hunk) => ({ header: diffHunkHeader(hunk), rows: diffSplitRows(hunk) })), [hunks])
      const columns = useRef({ left: null, right: null })
      const offsets = useRef({ left: { scrollLeft: 0, scrollTop: 0 }, right: { scrollLeft: 0, scrollTop: 0 } })
      const follow = (side) => (event) => {
        const peer = side === 'left' ? 'right' : 'left'
        const other = columns.current[peer]
        if (other === null) return
        const axes = ['scrollLeft', 'scrollTop']
        for (let index = 0; index < axes.length; index += 1) {
          const axis = axes[index]
          const value = event.currentTarget[axis]
          if (offsets.current[side][axis] === value) continue
          offsets.current[side][axis] = value
          other[axis] = value
          offsets.current[peer][axis] = value
        }
      }
      const renderColumn = (side) => h('div', {
        key: side,
        className: 'dsh-git-diffColumn',
        'data-diff-side': side,
        ref: (element) => { columns.current[side] = element },
        onScroll: follow(side),
      }, paired.map((hunk, position) => h('section', { key: position, className: 'dsh-git-diffHunk' }, [
        h('div', { key: 'header', className: 'dsh-git-diffHunkHeader', 'data-diff-hunk-header': 'true' }, hunk.header),
        ...hunk.rows.map((row, at) => {
          const entry = row[side]
          const sideHighlights = side === 'left'
            ? (highlights[position] === undefined ? undefined : highlights[position].old)
            : (highlights[position] === undefined ? undefined : highlights[position].new)
          const spans = entry === undefined ? undefined : (sideHighlights === undefined ? undefined : sideHighlights.get(entry.no))
          return h('div', {
            key: at,
            className: 'dsh-git-diffSideLine ' + (entry === undefined ? 'dsh-git-diffEmpty' : 'dsh-git-diff' + (entry.kind === 'add' ? 'Add' : entry.kind === 'del' ? 'Del' : 'Context')),
            'data-diff-line': diffSplitRowKind(row),
          }, [
            h('span', { key: 'no', className: 'dsh-git-diffNumber' }, entry === undefined ? '' : String(entry.no)),
            h(DiffText, { key: 'text', text: entry === undefined ? '' : entry.text, spans }),
          ])
        }),
      ])))
      return h('div', { key: 'columns', className: 'dsh-git-diffColumns' }, ['left', 'right'].map(renderColumn))
    }

    /**
     * Render a parsed commit diff with the review tab's layout choices and notes.
     * @param props - parsed diff, file path, layout choices, and copy.
     * @returns the scrollable diff body.
     */
    function SidebarDiffView(props) {
      const t = props.t
      const parsed = props.parsed
      const rendered = useMemo(() => diffRenderedHunks(parsed.hunks), [parsed.hunks])
      const highlighter = primitives.useCodeHighlighter(primitives.languageForPath(props.path))
      const highlights = useMemo(() => rendered.hunks.map((hunk) => diffHunkHighlights(hunk, highlighter)), [rendered.hunks, highlighter])
      const hunks = rendered.hunks
      let hasAdd = false
      let hasDel = false
      for (let index = 0; index < hunks.length; index += 1) {
        for (let lineIndex = 0; lineIndex < hunks[index].lines.length; lineIndex += 1) {
          const sign = hunks[index].lines[lineIndex].charAt(0)
          if (sign === '+') hasAdd = true
          if (sign === '-') hasDel = true
        }
      }
      const oneSided = hasAdd !== hasDel
      const split = props.split && !oneSided
      const notes = []
      if (parsed.created === true) notes.push(t('diff.created'))
      else if (parsed.deleted === true) notes.push(t('diff.deleted'))
      else if (hunks.length === 0) notes.push(t('diff.unchanged'))
      if (rendered.truncated) notes.push(t('diff.truncatedLines', { count: String(DIFF_MAX_RENDERED_LINES) }))
      const children = notes.map((text, index) => h('p', { key: 'note-' + index, className: 'dsh-git-diffNote' }, text))
      if (parsed.binary === true) {
        children.push(h('p', { key: 'binary', className: 'dsh-git-diffNote' }, t('diff.binary')))
      } else if (split && !props.wrap) {
        children.push(h(SidebarSplitColumns, { key: 'columns', hunks, highlights }))
      } else {
        for (let index = 0; index < hunks.length; index += 1) {
          children.push(split
            ? renderWrappedSplitHunk(hunks[index], index, highlights[index])
            : renderUnifiedHunk(hunks[index], index, highlights[index]))
        }
      }
      return h('div', {
        key: 'body',
        className: 'dsh-git-diffBody',
        'data-view': split ? 'split' : 'unified',
        'data-wrap': props.wrap ? 'true' : 'false',
      }, children)
    }

    /**
     * Read the persisted Sidebar diff layout choices.
     * @returns the split and wrap flags.
     */
    function readDiffViewPrefs() {
      try {
        const raw = window.localStorage.getItem(DIFF_VIEW_STORAGE_KEY)
        if (raw === null) return { split: false, wrap: false }
        const parsed = JSON.parse(raw)
        if (parsed === null || typeof parsed !== 'object') return { split: false, wrap: false }
        return { split: parsed.split === true, wrap: parsed.wrap === true }
      } catch {
        // A blocked or unreadable store only loses the layout choice.
        return { split: false, wrap: false }
      }
    }

    /**
     * Persist the Sidebar diff layout choices.
     * @param value - the split and wrap flags.
     */
    function writeDiffViewPrefs(value) {
      try {
        window.localStorage.setItem(DIFF_VIEW_STORAGE_KEY, JSON.stringify({ split: value.split === true, wrap: value.wrap === true }))
      } catch {
        // A blocked or full store only loses the layout choice.
      }
    }

    /**
     * Right-Sidebar tab body showing one commit file's diff.
     *
     * It is a page type of its own, so opening another file navigates this tab
     * instead of stacking duplicates. Layout, controls, line numbering, colours
     * and syntax highlighting follow the Harness review tab: single column or
     * side by side, with an optional line wrap.
     * @param props - locale copy, the injected diff loader, and the tab information hook.
     * @returns the tab body.
     */
    function CommitDiffTab(props) {
      const t = typeof props.t === 'function' ? props.t : fallbackTranslate
      const target = readCommitDiffTarget(props.useTabInfo)
      const loadDiffRef = useRef(props.loadCommitDiff)
      loadDiffRef.current = props.loadCommitDiff
      const translateRef = useRef(t)
      translateRef.current = t
      const [state, setState] = useState({ phase: 'idle', data: null, error: null })
      const [attempt, setAttempt] = useState(0)
      const [prefs, setPrefs] = useState(readDiffViewPrefs)

      useEffect(() => {
        if (target.repo === '' || target.hash === '' || target.path === '') {
          const key = target.recognized === false ? 'commitDiff.stale' : 'commitDiff.missing'
          setState({ phase: 'error', data: null, error: translateRef.current(key) })
          return undefined
        }
        const controller = new AbortController()
        setState({ phase: 'loading', data: null, error: null })
        const loader = loadDiffRef.current
        Promise.resolve(typeof loader === 'function' ? loader({ repo: target.repo, hash: target.hash, path: target.path }, controller.signal) : null).then(
          (value) => {
            if (controller.signal.aborted) return
            setState({
              phase: 'ready',
              data: value !== null && typeof value === 'object' ? value : { diff: '', truncated: false, untracked: false },
              error: null,
            })
          },
          (failure) => {
            if (controller.signal.aborted || isAbort(failure)) return
            setState({ phase: 'error', data: null, error: messageOf(failure, translateRef.current) })
          },
        )
        return () => { controller.abort() }
      }, [target.repo, target.hash, target.path, target.recognized, target.revision, attempt])

      const togglePref = (key) => {
        setPrefs((current) => {
          const next = { split: current.split, wrap: current.wrap }
          next[key] = !current[key]
          writeDiffViewPrefs(next)
          return next
        })
      }

      const parsed = useMemo(() => {
        if (state.phase !== 'ready' || state.data === null) return { hunks: [], created: false, deleted: false, binary: false }
        return parseUnifiedDiff(typeof state.data.diff === 'string' ? state.data.diff : '')
      }, [state])

      const counts = useMemo(() => {
        let add = 0
        let del = 0
        for (let hunkIndex = 0; hunkIndex < parsed.hunks.length; hunkIndex += 1) {
          const lines = parsed.hunks[hunkIndex].lines
          for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
            const sign = lines[lineIndex].charAt(0)
            if (sign === '+') add += 1
            else if (sign === '-') del += 1
          }
        }
        return { add, del }
      }, [parsed])

      const tools = [
        h(primitives.Tooltip, {
          key: 'split',
          label: t(prefs.split ? 'review.unified' : 'review.split'),
          side: 'bottom',
          delayMs: 500,
        }, h('button', {
          type: 'button',
          className: 'dsh-git-sidebarTabTool',
          'aria-pressed': prefs.split,
          'aria-label': t('review.splitAria'),
          'data-review-tool': 'split',
          onClick: () => { togglePref('split') },
        }, h(primitives.IconCompareSplitOutlineRegular, { className: 'dsh-git-compareIcon' }))),
        h(primitives.Tooltip, {
          key: 'wrap',
          label: t(prefs.wrap ? 'review.nowrap' : 'review.wrap'),
          side: 'bottom',
          delayMs: 500,
        }, h('button', {
          type: 'button',
          className: 'dsh-git-sidebarTabTool',
          'aria-pressed': prefs.wrap,
          'aria-label': t('review.wrapAria'),
          'data-review-tool': 'wrap',
          onClick: () => { togglePref('wrap') },
        }, prefs.wrap ? h(primitives.IconNowrapFillRegular, {}) : h(primitives.IconWrapFillRegular, {}))),
      ]

      const children = [
        h('div', { key: 'header', className: 'dsh-git-sidebarTabHeader' }, [
          h('span', { key: 'path', className: 'dsh-git-sidebarTabPath' }, h(primitives.PathLabel, { path: target.path })),
          state.phase === 'ready'
            ? h('span', { key: 'counts', className: 'dsh-git-sidebarTabCounts' }, [
              h('span', { key: 'add', className: 'dsh-git-sidebarTabAdd' }, '+' + String(counts.add)),
              h('span', { key: 'del', className: 'dsh-git-sidebarTabDel' }, '−' + String(counts.del)),
            ])
            : null,
          h('span', { key: 'spacer', className: 'dsh-git-sidebarTabSpacer' }),
          ...tools,
        ]),
        target.hash === ''
          ? null
          : h('p', { key: 'meta', className: 'dsh-git-sidebarTabMeta' }, shortOf(target.hash)),
      ]
      if (state.phase === 'idle' || state.phase === 'loading') {
        children.push(h('p', { key: 'loading', className: 'dsh-git-diffStatus', role: 'status' }, t('diff.loading')))
      } else if (state.phase === 'error') {
        children.push(h('div', { key: 'error', className: 'dsh-git-diffStatus' }, [
          h('span', { key: 'text' }, state.error === null ? t('diff.error') : state.error),
          h('button', {
            key: 'retry',
            type: 'button',
            className: 'dsh-git-miniButton',
            onClick: () => { setAttempt((value) => value + 1) },
          }, t('state.retry')),
        ]))
      } else {
        children.push(h(SidebarDiffView, {
          key: 'diff',
          parsed,
          path: target.path,
          split: prefs.split,
          wrap: prefs.wrap,
          t,
        }))
      }

      return h('section', {
        key: 'root',
        className: 'dsh-git-view dsh-git-sidebarTab',
        'aria-label': t('commitDiff.title'),
      }, [
        h('style', { key: 'style' }, CSS),
        ...children,
      ])
    }

    /**
     * Chip title of the commit-diff tab: the changed file's name and type icon.
     * @param props - locale copy and the tab information hook.
     * @returns the chip content.
     */
    function CommitDiffTitle(props) {
      const t = typeof props.t === 'function' ? props.t : fallbackTranslate
      const target = readCommitDiffTarget(props.useTabInfo)
      const name = splitPath(target.path).name
      if (name === '') return h('span', { key: 'title', className: 'dsh-git-tabLabel' }, t('commitDiff.title'))
      return h('span', { key: 'title', className: 'dsh-git-diffTitle' }, [
        h(primitives.FileTypeIcon, { key: 'icon', kind: primitives.classifyFileType(name), size: 16 }),
        name,
      ])
    }

    /**
     * Render the two invisible column resize handles over the commit list.
     * @param options - current widths, copy, and pointer/keyboard/reset handlers.
     * @returns the handle overlay.
     */
    function renderColumnHandles(options) {
      const { columns, dragging, t, onStart, onStep, onReset } = options
      const handle = (kind, width, right) => h('div', {
        key: kind,
        className: 'dsh-git-colHandle',
        role: 'separator',
        'aria-orientation': 'vertical',
        'aria-label': kind === 'author' ? t('columns.author') : t('columns.time'),
        'aria-valuenow': width,
        'aria-valuemin': COLUMN_MIN,
        'aria-valuemax': COLUMN_MAX,
        tabIndex: 0,
        'data-dragging': dragging === kind ? 'true' : 'false',
        style: { right },
        onPointerDown: (event) => { event.preventDefault(); onStart(kind, event) },
        onKeyDown: (event) => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
          event.preventDefault()
          onStep(kind, event.key === 'ArrowLeft' ? COLUMN_STEP : -COLUMN_STEP)
        },
        onDoubleClick: () => { onReset(kind) },
      })
      return h('div', {
        key: 'handles',
        className: 'dsh-git-colHandles',
        style: { right: SCROLLBAR_GUTTER },
      }, [
        handle('time', columns.time, ROW_PADDING_RIGHT + columns.time - 3),
        handle('author', columns.author, ROW_PADDING_RIGHT + columns.time + columns.author - 3),
      ])
    }

    /** Fallback translate function for a missing locale seat. */
    function fallbackTranslate(key) {
      return key
    }

    /** Stand-in selector hook used when the slot kit omits `useSessions`. */
    function useSessionsFallback(selector) {
      return selector(EMPTY_SESSION_STATE)
    }

    /** Stand-in selector hook used when the slot kit omits `useWorkspaces`. */
    function useWorkspacesFallback(selector) {
      return selector(EMPTY_WORKSPACE_STATE)
    }

    /**
     * Render the Git view: source control on the left, commit graph or file diff on the right.
     * @param props - localized `t`, the injected Host `call`, the session id, the input actions, and selector hooks.
     * @returns the view element.
     */
    function GitView(props) {
      const t = typeof props.t === 'function' ? props.t : fallbackTranslate
      const sessionId = props.sessionId
      const inputActions = props.inputActions
      const openCommitDiff = typeof props.openCommitDiff === 'function' ? props.openCommitDiff : null

      const useSessions = typeof props.useSessions === 'function' ? props.useSessions : useSessionsFallback
      const useWorkspaces = typeof props.useWorkspaces === 'function' ? props.useWorkspaces : useWorkspacesFallback

      const sessionCwd = useSessions(useCallback((state) => {
        const row = state && state.byId && sessionId !== undefined ? state.byId[sessionId] : undefined
        return row && typeof row.cwd === 'string' && row.cwd.length > 0 ? row.cwd : null
      }, [sessionId]))
      const workspacePath = useWorkspaces(useCallback((state) => {
        const items = state && Array.isArray(state.items) ? state.items : EMPTY_FILES
        for (let index = 0; index < items.length; index += 1) {
          const item = items[index]
          if (item === null || typeof item !== 'object') continue
          if (!Array.isArray(item.sessionIds) || item.sessionIds.indexOf(sessionId) === -1) continue
          return typeof item.path === 'string' && item.path.length > 0 ? item.path : null
        }
        return null
      }, [sessionId]))
      const sessionPhase = useSessions(useCallback((state) => (state ? state.phase : undefined), []))
      const workspacePhase = useWorkspaces(useCallback((state) => (state ? state.phase : undefined), []))
      const cwd = sessionCwd || workspacePath
      const cwdSettled = (sessionPhase === undefined || sessionPhase === 'ready')
        && (workspacePhase === undefined || workspacePhase === 'ready')

      /** View memory restored when the reader switches back to this Session's Git tab. */
      const initialView = useMemo(() => readViewState(sessionId), [sessionId])

      const [phase, setPhase] = useState('idle')
      const [error, setError] = useState(null)
      const [status, setStatus] = useState(null)
      const [branches, setBranches] = useState(EMPTY_BRANCHES)
      const [commits, setCommits] = useState(EMPTY_COMMITS)
      const [logPhase, setLogPhase] = useState('idle')
      const [logError, setLogError] = useState(null)
      const [logHasMore, setLogHasMore] = useState(false)
      const [logMorePhase, setLogMorePhase] = useState('idle')
      const [logMoreError, setLogMoreError] = useState(null)
      const [busy, setBusy] = useState(false)
      const [committing, setCommitting] = useState(false)
      const [refreshing, setRefreshing] = useState(false)
      const [message, setMessage] = useState(() => (typeof initialView.message === 'string' ? initialView.message : ''))
      const [tab, setTab] = useState(() => (initialView.tab === 'diff' && initialView.selection !== null && typeof initialView.selection === 'object' && typeof initialView.selection.path === 'string' ? 'diff' : 'graph'))
      const [selection, setSelection] = useState(() => {
        const saved = initialView.selection
        if (saved === null || typeof saved !== 'object') return null
        if (typeof saved.path !== 'string' || saved.path === '') return null
        return { path: saved.path, staged: saved.staged === true }
      })
      const [diff, setDiff] = useState(IDLE_DIFF)
      const [notice, setNotice] = useState(null)
      const [repoOverride, setRepoOverride] = useState(() => (typeof initialView.repoOverride === 'string' && initialView.repoOverride.length > 0 ? initialView.repoOverride : null))
      const [pickerOpen, setPickerOpen] = useState(false)
      const [browseNodes, setBrowseNodes] = useState(() => ({}))
      const [expandedPaths, setExpandedPaths] = useState(() => ({}))
      const [columns, setColumns] = useState(readColumnWidths)
      const [columnDrag, setColumnDrag] = useState(null)
      const [splitWidth, setSplitWidth] = useState(readSplitWidth)
      const [splitMax, setSplitMax] = useState(SPLIT_DEFAULT)
      const [splitDrag, setSplitDrag] = useState(null)
      const [expandedHash, setExpandedHash] = useState(() => (typeof initialView.expandedHash === 'string' && initialView.expandedHash.length > 0 ? initialView.expandedHash : null))
      const [detail, setDetail] = useState(IDLE_DETAIL)
      const [openFilePatch, setOpenFilePatch] = useState(IDLE_PATCH)
      const [aiMenuOpen, setAiMenuOpen] = useState(false)
      const [mergeOpen, setMergeOpen] = useState(false)
      const [mergeSource, setMergeSource] = useState('')
      const [mergeTarget, setMergeTarget] = useState('')
      const [mergeNote, setMergeNote] = useState('')

      /** Repository the view operates on: the Session working directory unless the picker chose a nested one. */
      const repository = repoOverride !== null ? repoOverride : cwd
      const resizing = columnDrag !== null || splitDrag !== null

      const callRef = useRef(props.call)
      const translateRef = useRef(t)
      const cwdRef = useRef(repository)
      const pickerRef = useRef(null)
      const pickerAbortRef = useRef(null)
      const aiRef = useRef(null)
      const bodyRef = useRef(null)
      const listRef = useRef(null)
      const busyRef = useRef(false)
      const refreshingRef = useRef(false)
      const loadAbortRef = useRef(null)
      const logAbortRef = useRef(null)
      const logMoreAbortRef = useRef(null)
      const logMoreBusyRef = useRef(false)
      const logPhaseRef = useRef('idle')
      const logHasMoreRef = useRef(false)
      const commitsRef = useRef(EMPTY_COMMITS)
      const diffAbortRef = useRef(null)
      const refreshAbortRef = useRef(null)
      const detailAbortRef = useRef(null)
      const patchAbortRef = useRef(null)
      const columnsRef = useRef(columns)
      const splitValueRef = useRef(splitWidth)
      const graphWidthRef = useRef(GRAPH_MIN_WIDTH)
      const sideScrollRef = useRef(null)
      const firstLoadRef = useRef(true)
      const latestViewRef = useRef(null)
      const restoreAppliedRef = useRef(false)
      const scrollMemoryRef = useRef({
        graph: Number.isFinite(initialView.graphScrollTop) ? Math.max(0, initialView.graphScrollTop) : 0,
        side: Number.isFinite(initialView.sideScrollTop) ? Math.max(0, initialView.sideScrollTop) : 0,
      })

      const graph = useMemo(() => buildGraph(commits), [commits])
      const graphWidth = Math.max(GRAPH_MIN_WIDTH, Math.min(graph.laneCount, GRAPH_MAX_LANES) * LANE_WIDTH)

      useEffect(() => {
        callRef.current = props.call
      }, [props.call])

      useEffect(() => {
        translateRef.current = t
      }, [t])

      useEffect(() => {
        cwdRef.current = repository
      }, [repository])

      useEffect(() => {
        logPhaseRef.current = logPhase
      }, [logPhase])

      useEffect(() => {
        logHasMoreRef.current = logHasMore
      }, [logHasMore])

      useEffect(() => {
        commitsRef.current = commits
      }, [commits])

      useEffect(() => {
        graphWidthRef.current = graphWidth
      }, [graphWidth])

      const invoke = useCallback((action, params, signal) => {
        const call = callRef.current
        if (typeof call !== 'function') {
          return Promise.reject(new Error(translateRef.current('error.unknown')))
        }
        return call(action, params, signal)
      }, [])

      const showNotice = useCallback((tone, text) => {
        setNotice({ tone, text })
      }, [])

      /** Collapse the inline commit details and drop their requests. */
      const clearDetail = useCallback(() => {
        if (detailAbortRef.current !== null) {
          detailAbortRef.current.abort()
          detailAbortRef.current = null
        }
        if (patchAbortRef.current !== null) {
          patchAbortRef.current.abort()
          patchAbortRef.current = null
        }
        setExpandedHash(null)
        setDetail(IDLE_DETAIL)
        setOpenFilePatch(IDLE_PATCH)
      }, [])

      const persistColumns = useCallback(() => {
        writeStorage(COLUMNS_STORAGE_KEY, JSON.stringify(columnsRef.current))
      }, [])

      const persistSplit = useCallback(() => {
        writeStorage(SPLIT_STORAGE_KEY, String(splitValueRef.current))
      }, [])

      const applyColumnWidth = useCallback((kind, raw) => {
        const current = columnsRef.current
        const other = kind === 'author' ? current.time : current.author
        let max = COLUMN_MAX
        const node = listRef.current
        if (node !== null) {
          const width = node.getBoundingClientRect().width
          if (width > 0) {
            const available = width - SCROLLBAR_GUTTER - ROW_PADDING_RIGHT
              - graphWidthRef.current - ROW_LEAD_RESERVE - SUBJECT_MIN_WIDTH
            max = Math.max(COLUMN_MIN, Math.min(COLUMN_MAX, available - other))
          }
        }
        const next = clamp(Math.round(raw), COLUMN_MIN, max)
        if (next === current[kind]) return
        const updated = { author: current.author, time: current.time }
        updated[kind] = next
        columnsRef.current = updated
        setColumns(updated)
      }, [])

      const applySplitWidth = useCallback((raw) => {
        let max = Number.POSITIVE_INFINITY
        const node = bodyRef.current
        if (node !== null) {
          const width = node.getBoundingClientRect().width
          if (width > 0) max = Math.max(SPLIT_MIN, Math.round(width * SPLIT_MAX_RATIO))
        }
        const next = clamp(Math.round(raw), SPLIT_MIN, max)
        if (next === splitValueRef.current) return
        splitValueRef.current = next
        setSplitWidth(next)
      }, [])

      /** Write one prompt into the current Session input box without sending it. */
      const fillDraft = useCallback((text) => {
        const actions = inputActions
        if (actions === null || actions === undefined || typeof actions.setDraft !== 'function') {
          showNotice('error', t('ai.fillFailed'))
          return
        }
        try {
          actions.setDraft(text)
        } catch (failure) {
          showNotice('error', messageOf(failure, t))
          return
        }
        showNotice('success', t('ai.filled'))
      }, [inputActions, showNotice, t])

      useEffect(() => {
        setRepoOverride(null)
        setPickerOpen(false)
        setBrowseNodes({})
        setExpandedPaths({})
      }, [cwd])

      /** Probe one directory level of the picker; the request rides the picker's abort signal. */
      const loadPickerLevel = useCallback((path) => {
        const controller = pickerAbortRef.current
        const signal = controller === null ? undefined : controller.signal
        setBrowseNodes((current) => ({
          ...current,
          [path]: { phase: 'loading', entries: EMPTY_BROWSE_ENTRIES, error: null, repoRoot: null, isRepo: false },
        }))
        invoke('browse', { dir: path }, signal).then(
          (value) => {
            if (signal !== undefined && signal.aborted) return
            const source = value !== null && typeof value === 'object' ? value : {}
            const entries = Array.isArray(source.entries)
              ? source.entries
                .filter((item) => item !== null && typeof item === 'object' && typeof item.path === 'string' && typeof item.name === 'string')
                .map((item) => ({
                  path: item.path,
                  name: item.name,
                  isRepo: item.isRepo === true,
                  hasChildren: item.hasChildren === true,
                }))
              : EMPTY_BROWSE_ENTRIES
            setBrowseNodes((current) => ({
              ...current,
              [path]: {
                phase: 'ready',
                entries,
                error: null,
                repoRoot: typeof source.repoRoot === 'string' && source.repoRoot.length > 0 ? source.repoRoot : null,
                isRepo: source.isRepo === true,
              },
            }))
          },
          (failure) => {
            if ((signal !== undefined && signal.aborted) || isAbort(failure)) return
            setBrowseNodes((current) => ({
              ...current,
              [path]: {
                phase: 'error',
                entries: EMPTY_BROWSE_ENTRIES,
                error: messageOf(failure, translateRef.current),
                repoRoot: null,
                isRepo: false,
              },
            }))
          },
        )
      }, [invoke])

      useEffect(() => {
        if (!pickerOpen || cwd === null) return undefined
        const controller = new AbortController()
        pickerAbortRef.current = controller
        setBrowseNodes({})
        setExpandedPaths({})
        loadPickerLevel(cwd)
        return () => {
          controller.abort()
          if (pickerAbortRef.current === controller) pickerAbortRef.current = null
        }
      }, [pickerOpen, cwd, loadPickerLevel])

      /** Expand or collapse one directory row; the first expansion probes that level. */
      const togglePickerPath = useCallback((path) => {
        const open = expandedPaths[path] === true
        setExpandedPaths((current) => {
          const next = { ...current }
          if (open) delete next[path]
          else next[path] = true
          return next
        })
        const node = browseNodes[path]
        if (!open && (node === undefined || node.phase === 'error')) loadPickerLevel(path)
      }, [browseNodes, expandedPaths, loadPickerLevel])

      useEffect(() => {
        if (!pickerOpen) return undefined
        const onPointerDown = (event) => {
          const container = pickerRef.current
          if (container !== null && event.target instanceof Node && container.contains(event.target)) return
          setPickerOpen(false)
        }
        const onKeyDown = (event) => {
          if (event.key === 'Escape') setPickerOpen(false)
        }
        document.addEventListener('pointerdown', onPointerDown)
        document.addEventListener('keydown', onKeyDown)
        return () => {
          document.removeEventListener('pointerdown', onPointerDown)
          document.removeEventListener('keydown', onKeyDown)
        }
      }, [pickerOpen])

      useEffect(() => {
        if (!aiMenuOpen && !mergeOpen) return undefined
        const onPointerDown = (event) => {
          const container = aiRef.current
          if (container !== null && event.target instanceof Node && container.contains(event.target)) return
          setAiMenuOpen(false)
          setMergeOpen(false)
        }
        const onKeyDown = (event) => {
          if (event.key !== 'Escape') return
          setAiMenuOpen(false)
          setMergeOpen(false)
        }
        document.addEventListener('pointerdown', onPointerDown)
        document.addEventListener('keydown', onKeyDown)
        return () => {
          document.removeEventListener('pointerdown', onPointerDown)
          document.removeEventListener('keydown', onKeyDown)
        }
      }, [aiMenuOpen, mergeOpen])

      useEffect(() => {
        if (notice === null) return undefined
        const timer = setTimeout(() => { setNotice(null) }, NOTICE_MS)
        return () => { clearTimeout(timer) }
      }, [notice])

      useEffect(() => () => {
        if (loadAbortRef.current !== null) loadAbortRef.current.abort()
        if (logAbortRef.current !== null) logAbortRef.current.abort()
        if (diffAbortRef.current !== null) diffAbortRef.current.abort()
        if (refreshAbortRef.current !== null) refreshAbortRef.current.abort()
        if (detailAbortRef.current !== null) detailAbortRef.current.abort()
        if (patchAbortRef.current !== null) patchAbortRef.current.abort()
        if (pickerAbortRef.current !== null) pickerAbortRef.current.abort()
      }, [])

      useEffect(() => {
        if (columnDrag === null) return undefined
        const onMove = (event) => {
          applyColumnWidth(columnDrag.kind, columnDrag.startWidth + (columnDrag.startX - event.clientX))
        }
        const onUp = () => {
          setColumnDrag(null)
          persistColumns()
        }
        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerup', onUp)
        window.addEventListener('pointercancel', onUp)
        return () => {
          window.removeEventListener('pointermove', onMove)
          window.removeEventListener('pointerup', onUp)
          window.removeEventListener('pointercancel', onUp)
        }
      }, [columnDrag, applyColumnWidth, persistColumns])

      useEffect(() => {
        if (splitDrag === null) return undefined
        const onMove = (event) => {
          applySplitWidth(splitDrag.startWidth + (event.clientX - splitDrag.startX))
        }
        const onUp = () => {
          setSplitDrag(null)
          persistSplit()
        }
        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerup', onUp)
        window.addEventListener('pointercancel', onUp)
        return () => {
          window.removeEventListener('pointermove', onMove)
          window.removeEventListener('pointerup', onUp)
          window.removeEventListener('pointercancel', onUp)
        }
      }, [splitDrag, applySplitWidth, persistSplit])

      useEffect(() => {
        const node = bodyRef.current
        if (node === null) return undefined
        const measure = () => {
          const width = node.getBoundingClientRect().width
          if (!(width > 0)) return
          setSplitMax(Math.max(SPLIT_MIN, Math.round(width * SPLIT_MAX_RATIO)))
          applySplitWidth(splitValueRef.current)
        }
        measure()
        window.addEventListener('resize', measure)
        return () => { window.removeEventListener('resize', measure) }
      }, [applySplitWidth])

      const loadRepository = useCallback(async (repo, signal) => {
        setPhase('loading')
        setError(null)
        setStatus(null)
        setBranches(EMPTY_BRANCHES)
        setCommits(EMPTY_COMMITS)
        setLogPhase('loading')
        setLogError(null)
        setLogHasMore(false)
        setLogMorePhase('idle')
        setLogMoreError(null)
        logMoreBusyRef.current = false
        if (logMoreAbortRef.current !== null) {
          logMoreAbortRef.current.abort()
          logMoreAbortRef.current = null
        }
        const settle = (promise) => promise.then(
          (value) => ({ ok: true, value }),
          (failure) => ({ ok: false, error: failure }),
        )
        const results = await Promise.all([
          settle(invoke('status', { repo }, signal)),
          settle(invoke('branches', { repo }, signal)),
          settle(invoke('log', { repo, limit: LOG_LIMIT }, signal)),
        ])
        if (signal.aborted) return
        const statusResult = results[0]
        if (!statusResult.ok) {
          if (isAbort(statusResult.error)) return
          const message = messageOf(statusResult.error, translateRef.current)
          setLogPhase('idle')
          if (isNotRepository(message)) {
            setPhase('not-repo')
            setError(message)
            return
          }
          setPhase('error')
          setError(message)
          showNotice('error', message)
          return
        }
        const nextStatus = normalizeStatus(statusResult.value)
        if (nextStatus === null) {
          setPhase('error')
          setError(translateRef.current('error.invalidBody'))
          setLogPhase('idle')
          return
        }
        setStatus(nextStatus)
        setPhase('ready')
        const branchesResult = results[1]
        if (branchesResult.ok) {
          setBranches(normalizeBranches(branchesResult.value))
        } else if (!isAbort(branchesResult.error)) {
          showNotice('error', messageOf(branchesResult.error, translateRef.current))
        }
        const logResult = results[2]
        if (logResult.ok) {
          const page = normalizeLog(logResult.value)
          setCommits(page.commits)
          setLogHasMore(page.hasMore)
          setLogPhase('ready')
        } else if (isAbort(logResult.error)) {
          setLogPhase('idle')
        } else {
          setCommits(EMPTY_COMMITS)
          setLogHasMore(false)
          setLogPhase('error')
          setLogError(messageOf(logResult.error, translateRef.current))
        }
      }, [invoke, showNotice])

      const reloadLog = useCallback(async (repo) => {
        if (logAbortRef.current !== null) logAbortRef.current.abort()
        const controller = new AbortController()
        logAbortRef.current = controller
        setLogPhase('loading')
        setLogError(null)
        setLogHasMore(false)
        setLogMorePhase('idle')
        setLogMoreError(null)
        logMoreBusyRef.current = false
        if (logMoreAbortRef.current !== null) {
          logMoreAbortRef.current.abort()
          logMoreAbortRef.current = null
        }
        try {
          const value = await invoke('log', { repo, limit: LOG_LIMIT }, controller.signal)
          if (controller.signal.aborted || cwdRef.current !== repo) return
          const page = normalizeLog(value)
          setCommits(page.commits)
          setLogHasMore(page.hasMore)
          setLogPhase('ready')
        } catch (failure) {
          if (isAbort(failure) || controller.signal.aborted) return
          setLogPhase('error')
          setLogError(messageOf(failure, translateRef.current))
        } finally {
          if (logAbortRef.current === controller) logAbortRef.current = null
        }
      }, [invoke])

      /** Append the next page of commits when the graph is scrolled to its bottom. */
      const loadMoreLog = useCallback(async () => {
        const repo = cwdRef.current
        if (repo === null || logMoreBusyRef.current || !logHasMoreRef.current) return
        if (logPhaseRef.current !== 'ready') return
        logMoreBusyRef.current = true
        if (logMoreAbortRef.current !== null) logMoreAbortRef.current.abort()
        const controller = new AbortController()
        logMoreAbortRef.current = controller
        setLogMorePhase('loading')
        setLogMoreError(null)
        try {
          const value = await invoke('log', {
            repo,
            limit: LOG_LIMIT,
            offset: commitsRef.current.length,
          }, controller.signal)
          if (controller.signal.aborted || cwdRef.current !== repo) return
          const page = normalizeLog(value)
          const known = new Set()
          for (let index = 0; index < commitsRef.current.length; index += 1) {
            known.add(commitsRef.current[index].hash)
          }
          const appended = []
          for (let index = 0; index < page.commits.length; index += 1) {
            const commit = page.commits[index]
            if (known.has(commit.hash)) continue
            appended.push(commit)
          }
          if (appended.length > 0) setCommits((current) => current.concat(appended))
          setLogHasMore(page.hasMore && appended.length > 0)
          setLogMorePhase('idle')
        } catch (failure) {
          if (isAbort(failure) || controller.signal.aborted) return
          setLogMorePhase('error')
          setLogMoreError(messageOf(failure, translateRef.current))
        } finally {
          if (logMoreAbortRef.current === controller) logMoreAbortRef.current = null
          logMoreBusyRef.current = false
        }
      }, [invoke])

      const loadDiff = useCallback(async (repo, target) => {
        if (diffAbortRef.current !== null) diffAbortRef.current.abort()
        const controller = new AbortController()
        diffAbortRef.current = controller
        setDiff({ phase: 'loading', data: null, error: null })
        try {
          const value = await invoke('diff', { repo, path: target.path, staged: target.staged }, controller.signal)
          if (controller.signal.aborted || cwdRef.current !== repo) return
          setDiff({
            phase: 'ready',
            data: value !== null && typeof value === 'object' ? value : { diff: '', truncated: false, untracked: false },
            error: null,
          })
        } catch (failure) {
          if (isAbort(failure) || controller.signal.aborted) return
          setDiff({ phase: 'error', data: null, error: messageOf(failure, translateRef.current) })
        } finally {
          if (diffAbortRef.current === controller) diffAbortRef.current = null
        }
      }, [invoke])

      const loadCommitDetail = useCallback(async (repo, hash) => {
        if (detailAbortRef.current !== null) detailAbortRef.current.abort()
        if (patchAbortRef.current !== null) {
          patchAbortRef.current.abort()
          patchAbortRef.current = null
        }
        const controller = new AbortController()
        detailAbortRef.current = controller
        setOpenFilePatch(IDLE_PATCH)
        setDetail({ phase: 'loading', hash, data: null, error: null })
        try {
          const value = await invoke('commitDetail', { repo, hash }, controller.signal)
          if (controller.signal.aborted || cwdRef.current !== repo) return
          const data = normalizeCommitDetail(value)
          if (data === null) {
            setDetail({ phase: 'error', hash, data: null, error: translateRef.current('error.invalidBody') })
            return
          }
          setDetail({ phase: 'ready', hash, data, error: null })
        } catch (failure) {
          if (isAbort(failure) || controller.signal.aborted) return
          setDetail({ phase: 'error', hash, data: null, error: messageOf(failure, translateRef.current) })
        } finally {
          if (detailAbortRef.current === controller) detailAbortRef.current = null
        }
      }, [invoke])

      const loadCommitPatch = useCallback(async (repo, hash, path) => {
        if (patchAbortRef.current !== null) patchAbortRef.current.abort()
        const controller = new AbortController()
        patchAbortRef.current = controller
        setOpenFilePatch({ phase: 'loading', path, data: null, error: null })
        try {
          const value = await invoke('commitDiff', { repo, hash, path }, controller.signal)
          if (controller.signal.aborted || cwdRef.current !== repo) return
          setOpenFilePatch({
            phase: 'ready',
            path,
            data: value !== null && typeof value === 'object' ? value : { diff: '', truncated: false },
            error: null,
          })
        } catch (failure) {
          if (isAbort(failure) || controller.signal.aborted) return
          setOpenFilePatch({ phase: 'error', path, data: null, error: messageOf(failure, translateRef.current) })
        } finally {
          if (patchAbortRef.current === controller) patchAbortRef.current = null
        }
      }, [invoke])

      useEffect(() => {
        if (loadAbortRef.current !== null) {
          loadAbortRef.current.abort()
          loadAbortRef.current = null
        }
        if (logAbortRef.current !== null) {
          logAbortRef.current.abort()
          logAbortRef.current = null
        }
        if (diffAbortRef.current !== null) {
          diffAbortRef.current.abort()
          diffAbortRef.current = null
        }
        const firstLoad = firstLoadRef.current
        firstLoadRef.current = false
        if (!firstLoad) {
          // A different repository has different files and history; start clean.
          clearDetail()
          setSelection(null)
          setDiff(IDLE_DIFF)
          setTab('graph')
          scrollMemoryRef.current = { graph: 0, side: 0 }
        }
        if (repository === null) {
          setPhase('idle')
          setError(null)
          setStatus(null)
          setBranches(EMPTY_BRANCHES)
          setCommits(EMPTY_COMMITS)
          setLogPhase('idle')
          setLogError(null)
          setSelection(null)
          setDiff(IDLE_DIFF)
          setTab('graph')
          setMessage('')
          return undefined
        }
        const controller = new AbortController()
        loadAbortRef.current = controller
        if (!firstLoad) setMessage('')
        void loadRepository(repository, controller.signal)
        return () => {
          controller.abort()
          if (loadAbortRef.current === controller) loadAbortRef.current = null
        }
      }, [repository, loadRepository, clearDetail])

      // Restore once the Session identity is bound. The slot can render this view
      // before sessionId reaches the element; writing then would overwrite the
      // memory with defaults, so the first write waits for this restore.
      useEffect(() => {
        if (restoreAppliedRef.current) return
        if (typeof sessionId !== 'string' || sessionId === '') return
        restoreAppliedRef.current = true
        const saved = readViewState(sessionId)
        if (typeof saved.repoOverride === 'string' && saved.repoOverride.length > 0) setRepoOverride(saved.repoOverride)
        if (typeof saved.message === 'string') setMessage(saved.message)
        if (typeof saved.expandedHash === 'string' && saved.expandedHash.length > 0) setExpandedHash(saved.expandedHash)
        if (saved.selection !== null && typeof saved.selection === 'object'
          && typeof saved.selection.path === 'string' && saved.selection.path !== '') {
          setSelection({ path: saved.selection.path, staged: saved.selection.staged === true })
          setTab(saved.tab === 'diff' ? 'diff' : 'graph')
        }
        scrollMemoryRef.current = {
          graph: Number.isFinite(saved.graphScrollTop) ? Math.max(0, saved.graphScrollTop) : scrollMemoryRef.current.graph,
          side: Number.isFinite(saved.sideScrollTop) ? Math.max(0, saved.sideScrollTop) : scrollMemoryRef.current.side,
        }
      }, [sessionId])

      // Keep the per-Session view memory in this browser tab: switching to the
      // Conversation view and back restores the same repository, draft, tab,
      // expanded commit, and scroll offsets.
      useEffect(() => {
        if (!restoreAppliedRef.current) return
        writeViewState(sessionId, {
          repoOverride,
          message,
          tab,
          selection,
          expandedHash,
          graphScrollTop: scrollMemoryRef.current.graph,
          sideScrollTop: scrollMemoryRef.current.side,
        })
      }, [sessionId, repoOverride, message, tab, selection, expandedHash])

      latestViewRef.current = { repoOverride, message, tab, selection, expandedHash }

      // The scroll offsets change without a render, so persist them on unmount.
      useEffect(() => () => {
        const latest = latestViewRef.current
        if (latest === null) return
        writeViewState(sessionId, {
          ...latest,
          graphScrollTop: scrollMemoryRef.current.graph,
          sideScrollTop: scrollMemoryRef.current.side,
        })
      }, [sessionId])

      // Restore the open file diff after the repository data has arrived.
      useEffect(() => {
        if (phase !== 'ready' || tab !== 'diff' || selection === null || diff.phase !== 'idle') return undefined
        const repository = cwdRef.current
        if (repository === null) return undefined
        void loadDiff(repository, selection)
        return undefined
      }, [phase, tab, selection, diff.phase, loadDiff])

      // Restore the expanded commit after the log has arrived.
      useEffect(() => {
        if (phase !== 'ready' || logPhase !== 'ready' || expandedHash === null || detail.phase !== 'idle') return undefined
        const repository = cwdRef.current
        if (repository === null) return undefined
        void loadCommitDetail(repository, expandedHash)
        return undefined
      }, [phase, logPhase, expandedHash, detail.phase, loadCommitDetail])

      // Restore the two scroll offsets once their content is mounted.
      useEffect(() => {
        if (phase !== 'ready' || logPhase !== 'ready') return undefined
        const frame = requestAnimationFrame(() => {
          if (listRef.current !== null) listRef.current.scrollTop = scrollMemoryRef.current.graph
          if (sideScrollRef.current !== null) sideScrollRef.current.scrollTop = scrollMemoryRef.current.side
        })
        return () => cancelAnimationFrame(frame)
      }, [phase, logPhase])

      useEffect(() => {
        if (repository === null || phase !== 'ready') return undefined
        const polled = repository
        let disposed = false
        let active = null
        const tick = async () => {
          if (disposed || busyRef.current || refreshingRef.current) return
          const controller = new AbortController()
          active = controller
          try {
            const value = await invoke('status', { repo: polled }, controller.signal)
            if (disposed || controller.signal.aborted || cwdRef.current !== polled) return
            const next = normalizeStatus(value)
            if (next !== null) setStatus(next)
          } catch (failure) {
            // A silent poll: the manual refresh reports the same failure to the reader.
            if (isAbort(failure)) return
          } finally {
            if (active === controller) active = null
          }
        }
        const timer = setInterval(() => { void tick() }, STATUS_POLL_MS)
        return () => {
          disposed = true
          clearInterval(timer)
          if (active !== null) active.abort()
        }
      }, [repository, phase, invoke])

      useEffect(() => {
        if (selection === null || status === null) return
        const files = status.files
        let present = false
        for (let index = 0; index < files.length; index += 1) {
          const file = files[index]
          if (file.path !== selection.path) continue
          if (selection.staged ? file.staged === true : file.unstaged === true || file.untracked === true) present = true
          break
        }
        if (present) return
        if (diffAbortRef.current !== null) {
          diffAbortRef.current.abort()
          diffAbortRef.current = null
        }
        setSelection(null)
        setDiff(IDLE_DIFF)
        setTab('graph')
      }, [status, selection])

      const refreshAll = async () => {
        const repository = cwdRef.current
        if (repository === null || refreshingRef.current || busyRef.current) return
        refreshingRef.current = true
        setRefreshing(true)
        setLogMorePhase('idle')
        setLogMoreError(null)
        logMoreBusyRef.current = false
        if (logMoreAbortRef.current !== null) {
          logMoreAbortRef.current.abort()
          logMoreAbortRef.current = null
        }
        if (refreshAbortRef.current !== null) refreshAbortRef.current.abort()
        const controller = new AbortController()
        refreshAbortRef.current = controller
        const settle = (promise) => promise.then(
          (value) => ({ ok: true, value }),
          (failure) => ({ ok: false, error: failure }),
        )
        try {
          const results = await Promise.all([
            settle(invoke('status', { repo: repository }, controller.signal)),
            settle(invoke('branches', { repo: repository }, controller.signal)),
            settle(invoke('log', { repo: repository, limit: LOG_LIMIT }, controller.signal)),
          ])
          if (controller.signal.aborted || cwdRef.current !== repository) return
          const statusResult = results[0]
          if (!statusResult.ok) {
            if (isAbort(statusResult.error)) return
            const failureMessage = messageOf(statusResult.error, translateRef.current)
            if (isNotRepository(failureMessage)) {
              setPhase('not-repo')
              setError(failureMessage)
              return
            }
            showNotice('error', failureMessage)
            return
          }
          const nextStatus = normalizeStatus(statusResult.value)
          if (nextStatus === null) {
            showNotice('error', translateRef.current('error.invalidBody'))
            return
          }
          setStatus(nextStatus)
          setPhase('ready')
          if (results[1].ok) setBranches(normalizeBranches(results[1].value))
          if (results[2].ok) {
            const page = normalizeLog(results[2].value)
            setCommits(page.commits)
            setLogHasMore(page.hasMore)
            setLogPhase('ready')
          } else if (!isAbort(results[2].error)) {
            setLogHasMore(false)
            setLogPhase('error')
            setLogError(messageOf(results[2].error, translateRef.current))
          }
        } finally {
          if (refreshAbortRef.current === controller) refreshAbortRef.current = null
          refreshingRef.current = false
          setRefreshing(false)
        }
      }

      const retryRepository = () => {
        const repository = cwdRef.current
        if (repository === null) return
        if (loadAbortRef.current !== null) loadAbortRef.current.abort()
        const controller = new AbortController()
        loadAbortRef.current = controller
        void loadRepository(repository, controller.signal)
      }

      const retryLog = () => {
        const repository = cwdRef.current
        if (repository === null) return
        void reloadLog(repository)
      }

      const retryDiff = () => {
        const repository = cwdRef.current
        if (repository === null || selection === null) return
        void loadDiff(repository, selection)
      }

      const runBusy = async (task) => {
        if (busyRef.current) return
        busyRef.current = true
        setBusy(true)
        try {
          await task()
        } finally {
          busyRef.current = false
          setBusy(false)
        }
      }

      const changeIndex = async (action, paths) => {
        const repository = cwdRef.current
        if (repository === null || busyRef.current) return
        await runBusy(async () => {
          try {
            const params = paths === null ? { repo: repository } : { repo: repository, paths }
            const value = await invoke(action, params)
            if (cwdRef.current !== repository) return
            const next = normalizeStatus(value)
            if (next !== null) setStatus(next)
          } catch (failure) {
            showNotice('error', messageOf(failure, translateRef.current))
          }
        })
      }

      const submitCommit = async () => {
        const repository = cwdRef.current
        const text = message.trim()
        if (repository === null || text === '' || busyRef.current) return
        if (status === null || status.files.filter((file) => file.staged === true).length === 0) return
        await runBusy(async () => {
          setCommitting(true)
          try {
            const result = await invoke('commit', { repo: repository, message: text })
            if (cwdRef.current !== repository) return
            setMessage('')
            const next = normalizeStatus(result ? result.status : null)
            if (next !== null) setStatus(next)
            const short = result && typeof result.short === 'string' ? result.short : ''
            const subject = result && typeof result.subject === 'string' ? result.subject : ''
            showNotice('success', translateRef.current('commit.success', { short, subject }))
            setTab('graph')
            await reloadLog(repository)
          } catch (failure) {
            showNotice('error', messageOf(failure, translateRef.current))
          } finally {
            setCommitting(false)
          }
        })
      }

      const changeBranch = async (branch) => {
        const repository = cwdRef.current
        if (repository === null || busyRef.current) return
        if (typeof branch !== 'string' || branch === '') return
        const current = status !== null && typeof status.branch === 'string' ? status.branch : null
        if (branch === current) return
        await runBusy(async () => {
          try {
            const result = await invoke('switch', { repo: repository, branch })
            if (cwdRef.current !== repository) return
            const next = normalizeStatus(result ? result.status : null)
            if (next !== null) setStatus(next)
            const applied = result && typeof result.branch === 'string' && result.branch !== '' ? result.branch : branch
            showNotice('success', translateRef.current('branch.switched', { branch: applied }))
            setTab('graph')
            await reloadLog(repository)
          } catch (failure) {
            showNotice('error', messageOf(failure, translateRef.current))
          }
        })
      }

      const openFile = (file, staged) => {
        const repository = cwdRef.current
        if (repository === null) return
        clearDetail()
        const target = { path: file.path, staged }
        setSelection(target)
        setTab('diff')
        void loadDiff(repository, target)
      }

      const closeDiff = () => {
        if (diffAbortRef.current !== null) {
          diffAbortRef.current.abort()
          diffAbortRef.current = null
        }
        clearDetail()
        setSelection(null)
        setDiff(IDLE_DIFF)
        setTab('graph')
      }

      const selectGraphTab = () => {
        clearDetail()
        setTab('graph')
        const repository = cwdRef.current
        if (repository !== null) void reloadLog(repository)
      }

      const selectDiffTab = () => {
        clearDetail()
        setTab('diff')
      }

      const toggleCommit = (hash) => {
        if (typeof hash !== 'string' || hash === '') return
        if (expandedHash === hash) {
          clearDetail()
          return
        }
        const repository = cwdRef.current
        if (repository === null) return
        setExpandedHash(hash)
        void loadCommitDetail(repository, hash)
      }

      const retryCommitDetail = () => {
        const repository = cwdRef.current
        if (repository === null || expandedHash === null) return
        void loadCommitDetail(repository, expandedHash)
      }

      const toggleCommitFile = (path) => {
        const repository = cwdRef.current
        if (repository === null || expandedHash === null) return
        if (openFilePatch.path === path) {
          if (patchAbortRef.current !== null) {
            patchAbortRef.current.abort()
            patchAbortRef.current = null
          }
          setOpenFilePatch(IDLE_PATCH)
          return
        }
        void loadCommitPatch(repository, expandedHash, path)
      }

      const retryCommitPatch = () => {
        const repository = cwdRef.current
        if (repository === null || expandedHash === null || openFilePatch.path === null) return
        void loadCommitPatch(repository, expandedHash, openFilePatch.path)
      }

      const copyHash = async (hash) => {
        const clipboard = typeof navigator === 'undefined' ? undefined : navigator.clipboard
        if (clipboard === undefined || clipboard === null || typeof clipboard.writeText !== 'function') {
          showNotice('error', t('detail.copyFailed'))
          return
        }
        try {
          await clipboard.writeText(hash)
        } catch {
          // The clipboard refuses in insecure contexts and without permission; both are the same to the reader.
          showNotice('error', t('detail.copyFailed'))
          return
        }
        showNotice('success', t('detail.copied'))
      }

      const files = status !== null && Array.isArray(status.files) ? status.files : EMPTY_FILES
      const stagedFiles = files.filter((file) => file.staged === true)
      const changedFiles = files.filter((file) => file.unstaged === true || file.untracked === true)
      const totalChanges = stagedFiles.length + changedFiles.length
      const detached = status !== null && status.detached === true
      const currentBranch = status !== null && typeof status.branch === 'string' && status.branch !== ''
        ? status.branch
        : null
      const rootPath = status !== null && status.root !== '' ? status.root : (repository === null ? '' : repository)
      const upstream = status !== null ? status.upstream : null
      const ahead = status !== null && Number.isFinite(status.ahead) ? status.ahead : 0
      const behind = status !== null && Number.isFinite(status.behind) ? status.behind : 0
      const branchOptions = []
      for (let index = 0; index < branches.locals.length; index += 1) {
        const name = branches.locals[index]
        if (name !== currentBranch) branchOptions.push(name)
      }
      if (currentBranch !== null) branchOptions.unshift(currentBranch)
      const allBranches = []
      for (let index = 0; index < branches.locals.length; index += 1) {
        const name = branches.locals[index]
        if (name !== '' && allBranches.indexOf(name) === -1) allBranches.push(name)
      }
      if (currentBranch !== null && allBranches.indexOf(currentBranch) === -1) allBranches.unshift(currentBranch)
      const commitPlaceholder = detached || currentBranch === null
        ? t('commit.placeholderDetached')
        : t('commit.placeholder', { branch: currentBranch })
      const canCommit = phase === 'ready' && message.trim() !== '' && stagedFiles.length > 0 && !busy
      const loading = phase === 'loading' || refreshing
      const aiEnabled = phase === 'ready'
      const promptRoot = rootPath

      const openAiMenu = () => {
        if (!aiEnabled) return
        setMergeOpen(false)
        setAiMenuOpen((open) => !open)
      }

      const openMergePopover = () => {
        if (!aiEnabled) return
        const target = currentBranch !== null ? currentBranch : (allBranches.length > 0 ? allBranches[0] : '')
        let source = allBranches.length > 0 ? allBranches[0] : ''
        for (let index = 0; index < allBranches.length; index += 1) {
          if (allBranches[index] !== target) {
            source = allBranches[index]
            break
          }
        }
        if (allBranches.length === 0) source = ''
        setMergeSource(source)
        setMergeTarget(target)
        setMergeNote('')
        setAiMenuOpen(false)
        setMergeOpen(true)
      }

      const closeMergePopover = () => {
        setMergeOpen(false)
      }

      const fillMergePrompt = () => {
        if (mergeSource === '' || mergeTarget === '') return
        if (mergeSource === mergeTarget) return
        const base = t('ai.promptMerge', { root: promptRoot, source: mergeSource, target: mergeTarget })
        const note = mergeNote.trim()
        fillDraft(note === '' ? base : base + t('ai.promptMergeNote', { note }))
        setMergeOpen(false)
      }

      const mergeSameBranch = mergeSource !== '' && mergeSource === mergeTarget

      const toolbar = h('header', { key: 'toolbar', className: 'dsh-git-toolbar' }, [
        h('span', { key: 'repo', className: 'dsh-git-toolbarRepo', ref: pickerRef }, [
          h('span', { key: 'glyph', className: 'dsh-git-toolbarGlyph', 'aria-hidden': 'true' }, branchGlyph(14)),
          h('button', {
            key: 'switch',
            type: 'button',
            className: 'dsh-git-repoButton',
            'aria-haspopup': 'menu',
            'aria-expanded': pickerOpen,
            'aria-label': t('picker.aria'),
            title: rootPath,
            onClick: () => { setPickerOpen((open) => !open) },
          }, [
            h('span', { key: 'path', className: 'dsh-git-toolbarRoot' }, rootPath === '' ? t('state.noCwd') : rootPath),
            h('span', {
              key: 'chevron',
              className: 'dsh-git-chevron',
              'data-open': pickerOpen ? 'true' : 'false',
              'aria-hidden': 'true',
            }, chevronGlyph(12)),
          ]),
          pickerOpen
            ? renderRepoPicker({
              t,
              cwd,
              repository,
              root: cwd === null ? null : (browseNodes[cwd] === undefined ? null : browseNodes[cwd]),
              nodes: browseNodes,
              expanded: expandedPaths,
              onChoose: (next) => {
                setRepoOverride(next)
                setPickerOpen(false)
              },
              onToggle: (path) => { togglePickerPath(path) },
              onRetry: (path) => { loadPickerLevel(path) },
              onClose: () => { setPickerOpen(false) },
            })
            : null,
        ]),
        h('div', { key: 'center', className: 'dsh-git-toolbarCenter' }, [
          h('select', {
            key: 'branch',
            className: 'dsh-git-select',
            value: currentBranch === null ? '' : currentBranch,
            disabled: busy || branchOptions.length === 0,
            'aria-label': t('toolbar.branch'),
            title: t('toolbar.branch'),
            onChange: (event) => { void changeBranch(event.target.value) },
          }, [
            currentBranch === null
              ? h('option', { key: '__detached', value: '', disabled: true }, t('branch.detachedOption'))
              : null,
            ...branchOptions.map((name, index) => h('option', { key: name + ':' + index, value: name }, name)),
          ]),
          detached
            ? h('span', { key: 'detached', className: 'dsh-git-chip dsh-git-chipWarn' }, t('toolbar.detached'))
            : null,
          ahead === 0 && behind === 0
            ? null
            : h('span', {
              key: 'ahead',
              className: 'dsh-git-ahead',
              title: t('toolbar.aheadBehind', { ahead, behind }),
            }, t('toolbar.aheadBehindText', { ahead, behind })),
          upstream === null
            ? null
            : h('span', {
              key: 'upstream',
              className: 'dsh-git-upstream',
              title: t('toolbar.upstream', { upstream }),
            }, t('toolbar.upstream', { upstream })),
          busy
            ? h('span', {
              key: 'busy',
              className: 'dsh-git-toolbarBusy',
              role: 'status',
              'aria-label': t('toolbar.busy'),
            }, h('span', { key: 'spin', className: 'dsh-git-spinner', 'aria-hidden': 'true' }))
            : null,
        ]),
        h('div', { key: 'actions', className: 'dsh-git-toolbarActions' }, [
          h('span', { key: 'ai', className: 'dsh-git-aiWrap', ref: aiRef }, [
            h('button', {
              key: 'button',
              type: 'button',
              className: 'dsh-git-aiButton',
              disabled: !aiEnabled,
              'aria-haspopup': 'menu',
              'aria-expanded': aiMenuOpen,
              'aria-label': t('ai.menu'),
              title: t('ai.menu'),
              onClick: openAiMenu,
            }, [
              h('span', { key: 'glyph', className: 'dsh-git-aiGlyph', 'aria-hidden': 'true' }, sparkGlyph(12)),
              h('span', { key: 'text' }, t('ai.action')),
              h('span', {
                key: 'chevron',
                className: 'dsh-git-chevron',
                'data-open': aiMenuOpen ? 'true' : 'false',
                'aria-hidden': 'true',
              }, chevronGlyph(10)),
            ]),
            aiMenuOpen
              ? h('div', {
                key: 'menu',
                className: 'dsh-git-menuSurface dsh-git-menu',
                role: 'menu',
                'aria-label': t('ai.menu'),
              }, [
                h('button', {
                  key: 'merge',
                  type: 'button',
                  role: 'menuitem',
                  className: 'dsh-git-menuItem',
                  onClick: openMergePopover,
                }, t('ai.merge')),
                h('button', {
                  key: 'review',
                  type: 'button',
                  role: 'menuitem',
                  className: 'dsh-git-menuItem',
                  onClick: () => {
                    setAiMenuOpen(false)
                    fillDraft(t('ai.promptReview', { root: promptRoot }))
                  },
                }, t('ai.review')),
                h('button', {
                  key: 'branch',
                  type: 'button',
                  role: 'menuitem',
                  className: 'dsh-git-menuItem',
                  onClick: () => {
                    setAiMenuOpen(false)
                    fillDraft(t('ai.promptBranch', { root: promptRoot }))
                  },
                }, t('ai.explainBranch')),
              ])
              : null,
            mergeOpen
              ? h('div', {
                key: 'merge',
                className: 'dsh-git-mergePopover',
                role: 'dialog',
                'aria-label': t('ai.mergeTitle'),
              }, [
                h('p', { key: 'title', className: 'dsh-git-mergeTitle' }, t('ai.mergeTitle')),
                allBranches.length === 0
                  ? h('p', { key: 'empty', className: 'dsh-git-mergeHint' }, t('ai.mergeEmpty'))
                  : h('div', { key: 'grid', className: 'dsh-git-mergeGrid' }, [
                    h('label', { key: 'source', className: 'dsh-git-mergeField' }, [
                      h('span', { key: 'label', className: 'dsh-git-mergeLabel' }, t('ai.mergeSource')),
                      h('select', {
                        key: 'select',
                        className: 'dsh-git-select',
                        value: mergeSource,
                        'aria-label': t('ai.mergeSource'),
                        onChange: (event) => { setMergeSource(event.target.value) },
                      }, allBranches.map((name, index) => h('option', { key: name + ':' + index, value: name }, name))),
                    ]),
                    h('label', { key: 'target', className: 'dsh-git-mergeField' }, [
                      h('span', { key: 'label', className: 'dsh-git-mergeLabel' }, t('ai.mergeTarget')),
                      h('select', {
                        key: 'select',
                        className: 'dsh-git-select',
                        value: mergeTarget,
                        'aria-label': t('ai.mergeTarget'),
                        onChange: (event) => { setMergeTarget(event.target.value) },
                      }, allBranches.map((name, index) => h('option', { key: name + ':' + index, value: name }, name))),
                    ]),
                  ]),
                h('textarea', {
                  key: 'note',
                  className: 'dsh-git-textarea dsh-git-mergeNote',
                  rows: 2,
                  value: mergeNote,
                  placeholder: t('ai.mergeNote'),
                  'aria-label': t('ai.mergeNote'),
                  onChange: (event) => { setMergeNote(event.target.value) },
                }),
                mergeSameBranch
                  ? h('p', { key: 'same', className: 'dsh-git-mergeHint dsh-git-errorText' }, t('ai.mergeSame'))
                  : null,
                h('div', { key: 'actions', className: 'dsh-git-mergeActions' }, [
                  h('button', {
                    key: 'cancel',
                    type: 'button',
                    className: 'dsh-git-miniButton',
                    onClick: closeMergePopover,
                  }, t('ai.mergeCancel')),
                  h('button', {
                    key: 'fill',
                    type: 'button',
                    className: 'dsh-git-primary',
                    disabled: allBranches.length === 0 || mergeSource === '' || mergeTarget === '' || mergeSameBranch,
                    onClick: fillMergePrompt,
                  }, t('ai.mergeFill')),
                ]),
              ])
              : null,
          ]),
          h('button', {
            key: 'refresh',
            type: 'button',
            className: 'dsh-git-iconButton',
            disabled: loading || busy || repository === null,
            'aria-label': t('toolbar.refresh'),
            title: t('toolbar.refresh'),
            onClick: () => { void refreshAll() },
          }, loading
            ? h('span', { key: 'spin', className: 'dsh-git-spinner', 'aria-hidden': 'true' })
            : refreshGlyph(14)),
        ]),
      ])

      const noticeNode = notice === null ? null : h('div', {
        key: 'notice',
        className: notice.tone === 'success' ? 'dsh-git-notice dsh-git-noticeSuccess' : 'dsh-git-notice dsh-git-noticeError',
        role: notice.tone === 'success' ? 'status' : 'alert',
      }, [
        h('span', { key: 'text', className: 'dsh-git-noticeText' }, notice.text),
        h('button', {
          key: 'close',
          type: 'button',
          className: 'dsh-git-noticeClose',
          'aria-label': t('notice.dismiss'),
          title: t('notice.dismiss'),
          onClick: () => { setNotice(null) },
        }, closeGlyph(12)),
      ])

      const commitBox = h('div', { key: 'commit', className: 'dsh-git-commit' }, [
        h('textarea', {
          key: 'input',
          className: 'dsh-git-textarea',
          rows: 3,
          value: message,
          placeholder: commitPlaceholder,
          'aria-label': commitPlaceholder,
          disabled: busy || phase !== 'ready',
          onChange: (event) => { setMessage(event.target.value) },
          onKeyDown: (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
              event.preventDefault()
              void submitCommit()
            }
          },
        }),
        h('div', { key: 'actions', className: 'dsh-git-commitActions' }, [
          h('button', {
            key: 'submit',
            type: 'button',
            className: 'dsh-git-primary',
            disabled: !canCommit,
            onClick: () => { void submitCommit() },
          }, committing ? t('commit.busy') : t('commit.action')),
        ]),
      ])

      const sidebar = h('aside', {
        key: 'side',
        className: 'dsh-git-side',
        'aria-label': t('sourceControl.title'),
        style: { width: splitWidth },
      }, [
        h('div', { key: 'head', className: 'dsh-git-sideHead' }, [
          h('h2', { key: 'title', className: 'dsh-git-sideTitle' }, t('sourceControl.title')),
          phase === 'ready'
            ? h('button', {
              key: 'ai',
              type: 'button',
              className: 'dsh-git-iconButton dsh-git-iconButtonSm',
              'aria-label': t('ai.reviewButton'),
              title: t('ai.reviewButton'),
              onClick: () => { fillDraft(t('ai.promptReview', { root: promptRoot })) },
            }, sparkGlyph(14))
            : null,
          h('span', { key: 'spacer', className: 'dsh-git-spacer' }),
          totalChanges > 0
            ? h('span', {
              key: 'count',
              className: 'dsh-git-count',
              'aria-label': t('sourceControl.total', { count: totalChanges }),
            }, String(totalChanges))
            : null,
        ]),
        commitBox,
        phase === 'ready'
          ? h('div', {
            key: 'groups',
            className: 'dsh-git-groups',
            ref: sideScrollRef,
            onScroll: (event) => { scrollMemoryRef.current.side = event.currentTarget.scrollTop },
          }, [
            renderChangeGroup({
              groupKey: 'staged',
              title: t('staged.title'),
              files: stagedFiles,
              actionLabel: t('staged.unstageAll'),
              actionGlyph: '−',
              onAction: () => { void changeIndex('unstageAll', null) },
              busy,
              staged: true,
              selection,
              t,
              onOpen: openFile,
              onToggle: (file) => { void changeIndex('unstage', [file.path]) },
            }),
            renderChangeGroup({
              groupKey: 'changed',
              title: t('changes.title'),
              files: changedFiles,
              actionLabel: t('changes.stageAll'),
              actionGlyph: '+',
              onAction: () => { void changeIndex('stageAll', null) },
              busy,
              staged: false,
              selection,
              t,
              onOpen: openFile,
              onToggle: (file) => { void changeIndex('stage', [file.path]) },
            }),
            totalChanges === 0 ? h('p', { key: 'clean', className: 'dsh-git-empty' }, t('empty.clean')) : null,
          ])
          : h('div', {
            key: 'groups',
            className: 'dsh-git-groups',
            ref: sideScrollRef,
            onScroll: (event) => { scrollMemoryRef.current.side = event.currentTarget.scrollTop },
          }),
      ])

      const divider = h('div', {
        key: 'divider',
        className: 'dsh-git-divider',
        role: 'separator',
        'aria-orientation': 'vertical',
        'aria-label': t('split.label'),
        'aria-valuenow': splitWidth,
        'aria-valuemin': SPLIT_MIN,
        'aria-valuemax': splitMax,
        'data-dragging': splitDrag !== null ? 'true' : 'false',
        tabIndex: 0,
        onPointerDown: (event) => {
          event.preventDefault()
          setSplitDrag({ startX: event.clientX, startWidth: splitValueRef.current })
        },
        onKeyDown: (event) => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
          event.preventDefault()
          applySplitWidth(splitValueRef.current + (event.key === 'ArrowLeft' ? -SPLIT_STEP : SPLIT_STEP))
          persistSplit()
        },
        onDoubleClick: () => {
          applySplitWidth(SPLIT_DEFAULT)
          persistSplit()
        },
      })

      const tabs = h('div', {
        key: 'tabs',
        className: 'dsh-git-tabs',
        role: 'tablist',
        'aria-label': t('tabs.label'),
      }, [
        h('div', { key: 'graph', className: 'dsh-git-tabItem' }, [
          h('button', {
            key: 'tab',
            type: 'button',
            role: 'tab',
            className: 'dsh-git-tab',
            'aria-selected': tab === 'graph' ? 'true' : 'false',
            onClick: selectGraphTab,
          }, h('span', { key: 'label', className: 'dsh-git-tabLabel' }, t('graph.title'))),
        ]),
        selection === null
          ? null
          : h('div', { key: 'file', className: 'dsh-git-tabItem' }, [
            h('button', {
              key: 'tab',
              type: 'button',
              role: 'tab',
              className: 'dsh-git-tab',
              'aria-selected': tab === 'diff' ? 'true' : 'false',
              title: selection.path,
              onClick: selectDiffTab,
            }, h('span', { key: 'label', className: 'dsh-git-tabLabel' }, splitPath(selection.path).name)),
            h('button', {
              key: 'close',
              type: 'button',
              className: 'dsh-git-tabClose',
              'aria-label': t('tabs.close', { name: splitPath(selection.path).name }),
              title: t('tabs.close', { name: splitPath(selection.path).name }),
              onClick: closeDiff,
            }, closeGlyph(12)),
          ]),
      ])

      const graphBody = (() => {
        if (logPhase === 'loading') {
          return renderState({ key: 'log-loading', spinner: true, title: t('state.loading') })
        }
        if (logPhase === 'error') {
          return renderState({
            key: 'log-error',
            title: t('graph.error'),
            text: logError,
            error: true,
            retryLabel: t('state.retry'),
            onRetry: retryLog,
          })
        }
        if (graph.rows.length === 0) {
          return renderState({ key: 'log-empty', title: t('graph.empty') })
        }
        const items = []
        for (let index = 0; index < graph.rows.length; index += 1) {
          const row = graph.rows[index]
          const commit = row.commit !== null && typeof row.commit === 'object' ? row.commit : {}
          const hash = typeof commit.hash === 'string' ? commit.hash : ''
          const expanded = expandedHash !== null && expandedHash === hash
          items.push(h('div', {
            key: 'commit-' + hash + '-' + index,
            className: 'dsh-git-commitItem',
            role: 'listitem',
          }, [
            renderCommitRow({
              row,
              t,
              graphWidth,
              columns,
              expanded,
              onToggle: () => { toggleCommit(hash) },
            }),
            expanded
              ? h('div', { key: 'expanded', className: 'dsh-git-detailRow' }, [
                h('div', {
                  key: 'graph',
                  className: 'dsh-git-detailGraph',
                  style: { width: graphWidth },
                  'aria-hidden': 'true',
                }, renderDetailLanes(row)),
                renderCommitDetail({
                  detail,
                  openFilePatch,
                  t,
                  refColor: row.dot.colorIndex,
                  onOpenFile: openCommitDiff === null ? null : (path) => {
                    if (repository === null) return
                    openCommitDiff({ repo: repository, hash, path })
                  },
                  onCopy: (value) => { void copyHash(value) },
                  onRetry: retryCommitDetail,
                  onToggleFile: toggleCommitFile,
                  onRetryFile: retryCommitPatch,
                  onExplain: (data) => {
                    fillDraft(t('ai.promptCommit', {
                      root: promptRoot,
                      short: data.short !== '' ? data.short : shortOf(data.hash),
                      subject: data.subject,
                    }))
                  },
                }),
              ])
              : null,
          ]))
        }
        const footer = []
        if (logMorePhase === 'loading') {
          footer.push(h('div', { key: 'more-loading', className: 'dsh-git-graphMore', role: 'status' }, [
            h('span', { key: 'spin', className: 'dsh-git-spinner', 'aria-hidden': 'true' }),
            h('span', { key: 'text' }, t('graph.loadingMore')),
          ]))
        } else if (logMorePhase === 'error') {
          footer.push(h('div', { key: 'more-error', className: 'dsh-git-graphMore' }, [
            h('span', { key: 'text', className: 'dsh-git-errorText' }, logMoreError === null ? t('graph.moreError') : logMoreError),
            h('button', {
              key: 'retry',
              type: 'button',
              className: 'dsh-git-miniButton',
              onClick: () => { void loadMoreLog() },
            }, t('state.retry')),
          ]))
        }
        return h('div', { key: 'area', className: 'dsh-git-graphArea' }, [
          h('div', {
            key: 'list',
            className: 'dsh-git-graphScroll',
            ref: listRef,
            onScroll: (event) => {
              const node = event.currentTarget
              scrollMemoryRef.current.graph = node.scrollTop
              if (node.scrollTop + node.clientHeight >= node.scrollHeight - 160) void loadMoreLog()
            },
          }, h('div', {
            key: 'rows',
            className: 'dsh-git-graphList',
            role: 'list',
            'aria-label': t('graph.title'),
          }, items.concat(footer))),
          renderColumnHandles({
            columns,
            dragging: columnDrag === null ? null : columnDrag.kind,
            t,
            onStart: (kind, event) => {
              setColumnDrag({ kind, startX: event.clientX, startWidth: columnsRef.current[kind] })
            },
            onStep: (kind, delta) => {
              applyColumnWidth(kind, columnsRef.current[kind] + delta)
              persistColumns()
            },
            onReset: (kind) => {
              const defaults = { author: AUTHOR_WIDTH_DEFAULT, time: TIME_WIDTH_DEFAULT }
              applyColumnWidth(kind, defaults[kind])
              persistColumns()
            },
          }),
        ])
      })()

      const graphPane = h('div', { key: 'graph-pane', className: 'dsh-git-pane' }, [
        h('div', { key: 'head', className: 'dsh-git-graphHead' }, t('graph.count', { count: commits.length })),
        graphBody,
      ])

      const diffPane = (() => {
        if (selection === null) return graphPane
        const head = h('div', { key: 'head', className: 'dsh-git-diffHead' }, [
          h('span', { key: 'tag', className: 'dsh-git-diffTag' }, selection.staged ? t('diff.staged') : t('diff.unstaged')),
          h('span', { key: 'path', className: 'dsh-git-diffPath', title: selection.path }, selection.path),
          h('button', {
            key: 'close',
            type: 'button',
            className: 'dsh-git-iconButton',
            'aria-label': t('diff.close'),
            title: t('diff.close'),
            onClick: closeDiff,
          }, closeGlyph(14)),
        ])
        if (diff.phase === 'loading' || diff.phase === 'idle') {
          return h('div', { key: 'diff-pane', className: 'dsh-git-diff' }, [
            head,
            renderState({ key: 'diff-loading', spinner: true, title: t('diff.loading') }),
          ])
        }
        if (diff.phase === 'error') {
          return h('div', { key: 'diff-pane', className: 'dsh-git-diff' }, [
            head,
            renderState({
              key: 'diff-error',
              title: t('diff.error'),
              text: diff.error,
              error: true,
              retryLabel: t('state.retry'),
              onRetry: retryDiff,
            }),
          ])
        }
        const body = h('div', { key: 'body', className: 'dsh-git-diffBody' }, diffNodes(diff.data, t, 'diff'))
        return h('div', { key: 'diff-pane', className: 'dsh-git-diff' }, [head, body])
      })()

      const content = (() => {
        if (cwd === null) {
          return renderState({
            key: 'cwd',
            title: cwdSettled ? t('state.noCwd') : t('state.resolvingCwd'),
          })
        }
        if (phase === 'loading' || phase === 'idle') {
          return renderState({ key: 'loading', spinner: true, title: t('state.loading') })
        }
        if (phase === 'not-repo') {
          return renderState({
            key: 'not-repo',
            title: t('state.notRepository'),
            text: rootPath,
            hint: t('state.notRepoHint'),
            retryLabel: t('state.retry'),
            onRetry: retryRepository,
          })
        }
        if (phase === 'error') {
          return renderState({
            key: 'error',
            title: t('state.error'),
            text: error,
            error: true,
            retryLabel: t('state.retry'),
            onRetry: retryRepository,
          })
        }
        return tab === 'diff' && selection !== null ? diffPane : graphPane
      })()

      const main = h('div', { key: 'main', className: 'dsh-git-main' }, [tabs, content])

      return h('section', {
        className: 'dsh-git-view',
        'aria-label': t('view.label'),
        // Asks the conversation shell to float the composer over this view and
        // to drop the column's width handles, exactly like the built-in
        // Trajectory tab (see ui-conversation's `:has()` rules).
        'data-conversation-composer-overlay': '',
        'data-resizing': resizing ? 'true' : 'false',
      }, [
        h('style', { key: 'style' }, CSS),
        toolbar,
        noticeNode,
        h('div', { key: 'body', className: 'dsh-git-body', ref: bodyRef }, [sidebar, divider, main]),
      ])
    }

    return {
      inject: ['slots', 'locale', 'sidebarRight', 'sidebarRightTabs'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register('git.view', { zh: ZH, en: EN }), 'git-panel: dictionaries')
        const t = ctx.locale.bind('git.view')
        const callHost = (action, params, signal) => postGitAction(action, params, signal, t)
        const loadCommitDiff = (params, signal) => callHost('commitDiff', params, signal)

        // Commit-file diffs are a right-Sidebar resource type of this bundle: the
        // address names the repository, commit, and file, so the tab deduplicates
        // opens and restores after a page reload.
        ctx.effect(() => ctx.sidebarRightTabs.register({
          id: COMMIT_DIFF_TAB_ID,
          kind: COMMIT_DIFF_KIND,
          patterns: ['dsh-resource://git-commit-diff/[\\s\\S]+'],
          priority: 'extension',
          title: (address) => {
            const target = parseCommitDiffAddress(address)
            const name = splitPath(target.path).name
            return name === '' ? t('commitDiff.title') : name
          },
        }), 'git-panel: commit diff tab type')
        ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({
          name: 'sidebar.right.pane.tab',
          key: COMMIT_DIFF_TAB_ID,
          locale: 'git.view',
          inject: () => ({ loadCommitDiff }),
        }, CommitDiffTab)), 'git-panel: commit diff tab body')
        ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab.title', () => ctx.slots.register({
          name: 'sidebar.right.pane.tab.title',
          key: COMMIT_DIFF_TAB_ID,
          locale: 'git.view',
        }, CommitDiffTitle)), 'git-panel: commit diff tab title')

        ctx.slots.inject('conversation.view', () => ctx.slots.register({
          name: 'conversation.view',
          id: 'git',
          order: 20,
          locale: 'git.view',
          label: () => t('view.label'),
          inject: () => ({
            call: callHost,
            openCommitDiff: (params) => {
              ctx.sidebarRight.openResource(
                commitDiffAddress(params.repo, params.hash, params.path),
                { kind: COMMIT_DIFF_KIND },
              )
            },
          }),
        }, GitView))
      },
    }
  },
})
