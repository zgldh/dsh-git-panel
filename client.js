window.__ModuleLoader__.load({
  id: '@local/dsh-git-panel',
  factory(require) {
    const React = require('react')
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
      'graph.count': '最近 {count} 条提交',
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
      'picker.subrepos': '下级 Git 仓库',
      'picker.loading': '正在查找下级仓库…',
      'picker.empty': '没有找到下级 Git 仓库。',
      'picker.error': '查找下级仓库失败',
      'picker.close': '关闭',

      'time.justNow': '刚刚',
      'time.minutesAgo': '{count} 分钟前',
      'time.hoursAgo': '{count} 小时前',
      'time.daysAgo': '{count} 天前',

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
      'graph.count': '{count} recent commits',
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
      'picker.subrepos': 'Nested Git repositories',
      'picker.loading': 'Looking for nested repositories…',
      'picker.empty': 'No nested Git repository found.',
      'picker.error': 'Failed to look for nested repositories',
      'picker.close': 'Close',

      'time.justNow': 'just now',
      'time.minutesAgo': '{count} min ago',
      'time.hoursAgo': '{count} h ago',
      'time.daysAgo': '{count} d ago',

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
    /** Milliseconds between relative-time refreshes. */
    const CLOCK_MS = 30000
    /** Commit rows requested from the Host half. */
    const LOG_LIMIT = 80
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
    const SPLIT_MIN = 280
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
    const EMPTY_SUBREPOS_ITEMS = Object.freeze([])
    const IDLE_SUBREPOS = Object.freeze({ phase: 'idle', items: EMPTY_SUBREPOS_ITEMS, error: null, repoRoot: null })
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
.dsh-git-pickerList{display:flex;flex-direction:column;gap:1px}
.dsh-git-toolbarCenter{flex:1 1 auto;min-width:0;display:flex;align-items:center;gap:8px;overflow:hidden}
.dsh-git-toolbarActions{flex:none;display:flex;align-items:center;gap:6px}
.dsh-git-aiWrap{position:relative;display:inline-flex;align-items:center}
.dsh-git-aiButton{display:inline-flex;align-items:center;gap:4px;height:26px;padding:0 6px;border:0;border-radius:var(--dsw-radius-sm);background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;line-height:18px;cursor:pointer}
.dsh-git-aiButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.dsh-git-aiButton[aria-expanded="true"]{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.dsh-git-aiButton:disabled{opacity:.45;cursor:default}
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
.dsh-git-groups{flex:1;min-height:0;overflow:auto;padding-bottom:12px;scrollbar-gutter:stable;scrollbar-width:thin;scrollbar-color:color-mix(in srgb, var(--dsw-alias-label-secondary) 35%, transparent) transparent}
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
.dsh-git-graphScroll{flex:1;min-height:0;overflow:auto;scrollbar-gutter:stable;scrollbar-width:thin;scrollbar-color:color-mix(in srgb, var(--dsw-alias-label-secondary) 35%, transparent) transparent}
.dsh-git-graphList{display:flex;flex-direction:column;padding:2px 0}
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
.dsh-git-ref{flex:0 1 auto;min-width:0;display:inline-flex;align-items:center;height:16px;padding:0 5px;border-radius:3px;font-size:10px;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--dsw-alias-label-secondary);background:color-mix(in srgb, var(--dsw-alias-label-secondary) 12%, transparent)}
.dsh-git-ref[data-kind="branch"]{color:var(--dsw-alias-brand-primary);background:color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, transparent)}
.dsh-git-ref[data-kind="head"]{color:var(--dsw-alias-brand-primary);background:color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, transparent)}
.dsh-git-ref[data-kind="tag"]{color:var(--dsw-alias-state-warn-primary);background:color-mix(in srgb, var(--dsw-alias-state-warn-primary) 16%, transparent)}
.dsh-git-refMore{color:var(--dsh-git-faint);background:color-mix(in srgb, var(--dsw-alias-label-secondary) 8%, transparent)}
.dsh-git-ref[data-current="true"]{font-weight:600;background:color-mix(in srgb, var(--dsw-alias-brand-primary) 26%, transparent)}
.dsh-git-subject{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary)}
.dsh-git-author{flex:none;margin-left:-8px;padding-left:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;line-height:18px;color:var(--dsh-git-faint)}
.dsh-git-time{flex:none;margin-left:-8px;padding-left:8px;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;line-height:18px;color:var(--dsh-git-faint);font-variant-numeric:tabular-nums}
.dsh-git-detail{display:flex;flex-direction:column;gap:6px;margin:0 12px 6px 0;padding:8px 10px;border:.5px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-bg-layer-1)}
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
.dsh-git-diffBody{flex:1;min-height:0;overflow:auto;scrollbar-gutter:stable;scrollbar-width:thin;scrollbar-color:color-mix(in srgb, var(--dsw-alias-label-secondary) 35%, transparent) transparent}
.dsh-git-diffPre{margin:0;padding:6px 0;width:max-content;min-width:100%;font-family:var(--dsh-git-mono);font-size:12px;line-height:1.55;tab-size:4}
.dsh-git-diffLine{display:block;padding:0 12px;white-space:pre}
.dsh-git-lineAdd{background:color-mix(in srgb, var(--dsw-alias-state-success-primary) 14%, transparent);color:var(--dsw-alias-state-success-primary)}
.dsh-git-lineDel{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 14%, transparent);color:var(--dsw-alias-state-error-primary)}
.dsh-git-lineMeta{color:var(--dsh-git-faint)}
.dsh-git-linePlain{color:var(--dsw-alias-label-primary)}
.dsh-git-diffNote{margin:0;padding:8px 12px;font-size:11px;line-height:18px;color:var(--dsh-git-faint)}
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
     * Normalize the Host commit list payload.
     * @param value - raw `log` value.
     * @returns the commits that carry a hash.
     */
    function normalizeCommits(value) {
      if (!value || !Array.isArray(value.commits)) return EMPTY_COMMITS
      const commits = []
      for (let index = 0; index < value.commits.length; index += 1) {
        const commit = value.commits[index]
        if (commit === null || typeof commit !== 'object') continue
        if (typeof commit.hash !== 'string' || commit.hash === '') continue
        commits.push(commit)
      }
      return commits
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
     * @returns the badge elements.
     */
    function refBadges(refs, t, collapse = true) {
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
      const badges = shown.map((ref, index) => h('span', {
        key: 'ref-' + index + '-' + ref.name,
        className: 'dsh-git-ref',
        'data-kind': ref.kind,
        'data-current': ref.current ? 'true' : 'false',
        title: refKindLabel(ref.kind, t) + ': ' + ref.name,
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
     * Format an absolute day for a commit outside the relative window.
     * @param seconds - epoch seconds.
     * @returns the `yyyy-mm-dd` day.
     */
    function formatDate(seconds) {
      const date = new Date(seconds * 1000)
      const month = date.getMonth() + 1
      const day = date.getDate()
      return String(date.getFullYear())
        + (month < 10 ? '-0' : '-') + String(month)
        + (day < 10 ? '-0' : '-') + String(day)
    }

    /**
     * Format a commit time relative to now.
     * @param seconds - epoch seconds.
     * @param t - translate function.
     * @param nowMs - current epoch milliseconds.
     * @returns the relative text, or an empty string for a missing time.
     */
    function formatCommitTime(seconds, t, nowMs) {
      const value = Number(seconds)
      if (!Number.isFinite(value) || value <= 0) return ''
      const delta = nowMs - value * 1000
      if (delta < 60000) return t('time.justNow')
      const minutes = Math.floor(delta / 60000)
      if (minutes < 60) return t('time.minutesAgo', { count: minutes })
      const hours = Math.floor(minutes / 60)
      if (hours < 24) return t('time.hoursAgo', { count: hours })
      const days = Math.floor(hours / 24)
      if (days < 30) return t('time.daysAgo', { count: days })
      return formatDate(value)
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
     * S-curve moving a continuing lane sideways between two rows.
     * @param fromLane - lane at the top edge.
     * @param toLane - lane at the bottom edge.
     * @returns the path data.
     */
    function shiftPath(fromLane, toLane) {
      const x1 = laneX(fromLane)
      const x2 = laneX(toLane)
      const midX = (x1 + x2) / 2
      const midY = ROW_HEIGHT / 2
      return 'M' + x1 + ' 0Q' + x1 + ' ' + midY + ' ' + midX + ' ' + midY
        + 'Q' + x2 + ' ' + midY + ' ' + x2 + ' ' + ROW_HEIGHT
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
     * the lane is free. A commit takes the lane that already points at it, else a
     * free lane, else a new right-hand lane. Its first parent inherits that lane;
     * every further parent reuses its lane when one exists and otherwise inserts
     * a new lane directly beside the commit's own, pushing later lanes right.
     *
     * Colours travel with the line, not with the lane index: `laneColors` runs
     * parallel to `lanes` and holds palette indices, so a lane shifted sideways
     * keeps its colour, and only a brand-new branch line draws a new one.
     * @param commits - commits in topological order, newest first.
     * @returns the rows with their geometry, and the widest lane count.
     */
    function buildGraph(commits) {
      const lanes = []
      const laneColors = []
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

        let lane = lanes.indexOf(hash)
        if (lane === -1) {
          lane = lanes.indexOf(null)
          if (lane === -1) {
            lane = lanes.length
            lanes.push(null)
            laneColors.push(null)
          }
        }
        const top = lanes.slice()
        const topColors = laneColors.slice()
        const fromTop = lane < top.length && top[lane] === hash
        const converging = []
        for (let laneIndex = 0; laneIndex < top.length; laneIndex += 1) {
          if (laneIndex !== lane && top[laneIndex] === hash) converging.push(laneIndex)
        }
        for (let mergeIndex = 0; mergeIndex < converging.length; mergeIndex += 1) {
          lanes[converging[mergeIndex]] = null
          laneColors[converging[mergeIndex]] = null
        }

        if (typeof laneColors[lane] !== 'number') laneColors[lane] = allocateColor()
        const dotColor = laneColors[lane]

        lanes[lane] = parents.length > 0 ? parents[0] : null
        if (parents.length === 0) laneColors[lane] = null

        const targets = []
        if (parents.length > 0) targets.push({ lane, order: 0 })
        let inserted = 0
        for (let parentIndex = 1; parentIndex < parents.length; parentIndex += 1) {
          const parent = parents[parentIndex]
          const existing = lanes.indexOf(parent)
          if (existing !== -1) {
            if (typeof laneColors[existing] !== 'number') laneColors[existing] = allocateColor()
            targets.push({ lane: existing, order: parentIndex })
            continue
          }
          const at = lane + 1 + inserted
          lanes.splice(at, 0, parent)
          laneColors.splice(at, 0, allocateColor())
          inserted += 1
          targets.push({ lane: at, order: parentIndex })
        }

        const bottom = lanes.slice()
        const width = Math.max(top.length, bottom.length)
        if (width > laneCount) laneCount = width
        const shapes = []
        if (fromTop) shapes.push({ key: 'top', d: verticalPath(lane, 0, ROW_HEIGHT / 2), colorIndex: dotColor })
        for (let laneIndex = 0; laneIndex < top.length; laneIndex += 1) {
          if (top[laneIndex] === null || top[laneIndex] === undefined) continue
          if (laneIndex === lane) continue
          const lineColor = typeof topColors[laneIndex] === 'number' ? topColors[laneIndex] : dotColor
          if (converging.indexOf(laneIndex) !== -1) {
            shapes.push({ key: 'join-' + laneIndex, d: convergePath(laneIndex, lane), colorIndex: lineColor })
            continue
          }
          const to = laneIndex > lane ? laneIndex + inserted : laneIndex
          shapes.push({
            key: 'lane-' + laneIndex,
            d: to === laneIndex ? verticalPath(laneIndex, 0, ROW_HEIGHT) : shiftPath(laneIndex, to),
            colorIndex: lineColor,
          })
        }
        for (let targetIndex = 0; targetIndex < targets.length; targetIndex += 1) {
          const target = targets[targetIndex]
          // A second parent's edge belongs to that parent's branch line, so it
          // keeps that line's colour; only the first parent continues the dot's line.
          const targetColor = target.lane === lane
            ? dotColor
            : (typeof laneColors[target.lane] === 'number' ? laneColors[target.lane] : dotColor)
          shapes.push({
            key: 'parent-' + target.order,
            d: target.lane === lane
              ? verticalPath(lane, ROW_HEIGHT / 2, ROW_HEIGHT)
              : mergePath(lane, target.lane),
            colorIndex: targetColor,
          })
        }
        rows.push({ commit, lane, width, shapes, dot: { x: laneX(lane), colorIndex: dotColor } })
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
     * Render the repository picker: the Session working directory, the enclosing
     * repository root, and every nested Git repository below the working
     * directory, so subdirectories that are their own repositories stay reachable.
     * @param options - working directory, effective repository, discovery state, copy, and callbacks.
     * @returns the menu element.
     */
    function renderRepoPicker(options) {
      const { t, cwd, repository, state, onChoose, onClose } = options
      const entry = (key, label, target, active) => h('button', {
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
      if (cwd !== null) headRows.push(entry('cwd', t('picker.cwd'), cwd, repository === cwd))
      const repoRoot = state !== null && typeof state.repoRoot === 'string' ? state.repoRoot : null
      if (repoRoot !== null && repoRoot !== cwd) {
        headRows.push(entry('root', t('picker.root'), repoRoot, repository === repoRoot))
      }

      const items = state !== null && Array.isArray(state.items) ? state.items : EMPTY_SUBREPOS_ITEMS
      const subRows = items.map((item, index) => h('button', {
        key: 'sub:' + index,
        type: 'button',
        role: 'menuitem',
        className: 'dsh-git-pickerRow',
        title: item.path,
        onClick: () => { onChoose(item.path) },
      }, [
        h('span', { key: 'label', className: 'dsh-git-pickerLabel' }, item.name),
        h('span', { key: 'path', className: 'dsh-git-pickerPath' }, item.rel !== '' ? item.rel : item.path),
        repository === item.path
          ? h('span', { key: 'dot', className: 'dsh-git-pickerDot', 'aria-hidden': 'true' })
          : null,
      ]))

      const body = []
      if (state === null || state.phase === 'idle' || state.phase === 'loading') {
        body.push(h('p', { key: 'loading', className: 'dsh-git-pickerHint' }, t('picker.loading')))
      } else if (state.phase === 'error') {
        body.push(h('p', { key: 'error', className: 'dsh-git-pickerHint dsh-git-errorText' }, state.error || t('picker.error')))
      } else if (subRows.length === 0) {
        body.push(h('p', { key: 'empty', className: 'dsh-git-pickerHint' }, t('picker.empty')))
      } else {
        body.push(h('div', { key: 'list', className: 'dsh-git-pickerList', role: 'group', 'aria-label': t('picker.subrepos') }, subRows))
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
        h('div', { key: 'subhead', className: 'dsh-git-pickerHeading', 'data-divider': 'true' }, t('picker.subrepos')),
        ...body,
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
      const { row, t, nowMs, graphWidth, columns, expanded, onToggle } = options
      const commit = row.commit !== null && typeof row.commit === 'object' ? row.commit : {}
      const hash = typeof commit.hash === 'string' ? commit.hash : ''
      const short = typeof commit.short === 'string' && commit.short !== '' ? commit.short : shortOf(hash)
      const subject = typeof commit.subject === 'string' ? commit.subject : ''
      const author = typeof commit.author === 'string' ? commit.author : ''
      const when = formatCommitTime(commit.time, t, nowMs)
      const badges = refBadges(commit.refs, t)
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
        nowMs,
        graphWidth,
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
        const when = formatCommitTime(data.time, t, nowMs)
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
            title: data.time > 0 ? formatDate(data.time) : '',
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
        const badges = refBadges(data.refs, t, false)
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
              'aria-expanded': open ? 'true' : 'false',
              title: file.path,
              onClick: () => { onToggleFile(file.path) },
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
        style: { marginLeft: graphWidth + 8 },
      }, children)
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
      const [nowMs, setNowMs] = useState(() => Date.now())
      const [repoOverride, setRepoOverride] = useState(() => (typeof initialView.repoOverride === 'string' && initialView.repoOverride.length > 0 ? initialView.repoOverride : null))
      const [pickerOpen, setPickerOpen] = useState(false)
      const [subrepos, setSubrepos] = useState(IDLE_SUBREPOS)
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
      const aiRef = useRef(null)
      const bodyRef = useRef(null)
      const listRef = useRef(null)
      const busyRef = useRef(false)
      const refreshingRef = useRef(false)
      const loadAbortRef = useRef(null)
      const logAbortRef = useRef(null)
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
      }, [cwd])

      useEffect(() => {
        if (!pickerOpen || cwd === null) return undefined
        const controller = new AbortController()
        setSubrepos({ phase: 'loading', items: EMPTY_SUBREPOS_ITEMS, error: null, repoRoot: null })
        invoke('subrepos', { repo: cwd }, controller.signal).then(
          (value) => {
            if (controller.signal.aborted) return
            const source = value !== null && typeof value === 'object' ? value : {}
            const items = Array.isArray(source.items)
              ? source.items
                .filter((item) => item !== null && typeof item === 'object' && typeof item.path === 'string' && typeof item.name === 'string')
                .map((item) => ({
                  path: item.path,
                  name: item.name,
                  rel: typeof item.rel === 'string' ? item.rel : '',
                }))
              : EMPTY_SUBREPOS_ITEMS
            setSubrepos({
              phase: 'ready',
              items,
              error: null,
              repoRoot: typeof source.repoRoot === 'string' && source.repoRoot.length > 0 ? source.repoRoot : null,
            })
          },
          (failure) => {
            if (controller.signal.aborted || isAbort(failure)) return
            setSubrepos({ phase: 'error', items: EMPTY_SUBREPOS_ITEMS, error: messageOf(failure, translateRef.current), repoRoot: null })
          },
        )
        return () => { controller.abort() }
      }, [pickerOpen, cwd, invoke])

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

      useEffect(() => {
        const timer = setInterval(() => { setNowMs(Date.now()) }, CLOCK_MS)
        return () => { clearInterval(timer) }
      }, [])

      useEffect(() => () => {
        if (loadAbortRef.current !== null) loadAbortRef.current.abort()
        if (logAbortRef.current !== null) logAbortRef.current.abort()
        if (diffAbortRef.current !== null) diffAbortRef.current.abort()
        if (refreshAbortRef.current !== null) refreshAbortRef.current.abort()
        if (detailAbortRef.current !== null) detailAbortRef.current.abort()
        if (patchAbortRef.current !== null) patchAbortRef.current.abort()
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
          setCommits(normalizeCommits(logResult.value))
          setLogPhase('ready')
        } else if (isAbort(logResult.error)) {
          setLogPhase('idle')
        } else {
          setCommits(EMPTY_COMMITS)
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
        try {
          const value = await invoke('log', { repo, limit: LOG_LIMIT }, controller.signal)
          if (controller.signal.aborted || cwdRef.current !== repo) return
          setCommits(normalizeCommits(value))
          setLogPhase('ready')
        } catch (failure) {
          if (isAbort(failure) || controller.signal.aborted) return
          setLogPhase('error')
          setLogError(messageOf(failure, translateRef.current))
        } finally {
          if (logAbortRef.current === controller) logAbortRef.current = null
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
            setCommits(normalizeCommits(results[2].value))
            setLogPhase('ready')
          } else if (!isAbort(results[2].error)) {
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
              state: subrepos,
              onChoose: (next) => {
                setRepoOverride(next)
                setPickerOpen(false)
              },
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
              h('span', { key: 'glyph', 'aria-hidden': 'true' }, sparkGlyph(12)),
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
              nowMs,
              graphWidth,
              columns,
              expanded,
              onToggle: () => { toggleCommit(hash) },
            }),
            expanded
              ? renderCommitDetail({
                detail,
                openFilePatch,
                t,
                nowMs,
                graphWidth,
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
              })
              : null,
          ]))
        }
        return h('div', { key: 'area', className: 'dsh-git-graphArea' }, [
          h('div', {
            key: 'list',
            className: 'dsh-git-graphScroll',
            ref: listRef,
            onScroll: (event) => { scrollMemoryRef.current.graph = event.currentTarget.scrollTop },
          }, h('div', {
            key: 'rows',
            className: 'dsh-git-graphList',
            role: 'list',
            'aria-label': t('graph.title'),
          }, items)),
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
        'data-resizing': resizing ? 'true' : 'false',
      }, [
        h('style', { key: 'style' }, CSS),
        toolbar,
        noticeNode,
        h('div', { key: 'body', className: 'dsh-git-body', ref: bodyRef }, [sidebar, divider, main]),
      ])
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register('git.view', { zh: ZH, en: EN }), 'git-panel: dictionaries')
        const t = ctx.locale.bind('git.view')
        const callHost = (action, params, signal) => postGitAction(action, params, signal, t)

        ctx.slots.inject('conversation.view', () => ctx.slots.register({
          name: 'conversation.view',
          id: 'git',
          order: 20,
          locale: 'git.view',
          label: () => t('view.label'),
          inject: () => ({ call: callHost }),
        }, GitView))
      },
    }
  },
})
