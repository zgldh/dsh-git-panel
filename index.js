/**
 * Host half of the Git panel bundle.
 *
 * The plugin owns one authenticated POST route (`/api/git-ui`) that the Client
 * half calls for repository status, diffs, staging, commits, branch history,
 * branch switching, and cascading directory browsing for the repository picker.
 * The route belongs to the shared Connection channel, so only an authenticated
 * owner peer (the page's browser session) reaches it.
 *
 * The Client half is a Session view: it passes the Session's working directory
 * as `repo`. The service resolves that path to the enclosing Git repository
 * root, so one installation serves every workspace instead of a fixed list of
 * directories. Every Git invocation is an argument array passed to
 * `git -C <repo>`: no shell, and only absolute existing directories are
 * accepted.
 *
 * @module dsh-git-panel
 */

import { execFile } from 'node:child_process'
import { promises as fs } from 'node:fs'
import * as path from 'node:path'

/** Loader entry name used by the bundle patch. */
export const name = 'git-panel'

/** Required Host services: the shared Connection channel carries the route. */
export const inject = ['connection']

/** Absolute route the Client half posts to, below the shared `/api` channel. */
const ROUTE_PATH = '/api/git-ui'

/** Directory names the cascading repository browse never lists or enters; lowercase. */
const DEFAULT_SKIP_DIRECTORIES = [
  'node_modules',
  'dist',
  'build',
  'out',
  'target',
  'coverage',
  'vendor',
  'venv',
  '__pycache__',
  '.cache',
  '.next',
  '.nuxt',
  '.turbo',
  '.angular',
  '.gradle',
  '.git',
]

/** Defaults for every tunable; the row's `config` overrides them. */
const DEFAULT_CONFIG = {
  gitTimeoutMs: 20000,
  diffMaxChars: 200000,
  logLimit: 80,
  commitFilesLimit: 500,
  signCommits: false,
  allowRoots: [],
  browseLimit: 200,
  skipDirectories: DEFAULT_SKIP_DIRECTORIES,
}

/** Hash of Git's empty tree; the diff base for a root commit. */
const EMPTY_TREE = '4b825dc642cb6eb9a060e54bf8d69288fbee4904'

/** One user-facing operation failure with a stable code. */
class RequestError extends Error {
  /**
   * @param code - stable machine-readable code.
   * @param message - text the panel shows as-is.
   */
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

/**
 * Read one config value, failing loud on a wrong type or range.
 * @param input - raw row config object.
 * @param key - field name.
 * @param fallback - default used when the field is absent.
 * @param check - predicate answering whether a present value is accepted.
 * @param expected - description of the accepted value, used in the message.
 * @returns the accepted value.
 */
function readConfigField(input, key, fallback, check, expected) {
  if (!(key in input) || input[key] === undefined || input[key] === null) return fallback
  const value = input[key]
  if (!check(value)) {
    throw new Error(`git-panel configuration error: "${key}" must be ${expected}, got ${JSON.stringify(value)}`)
  }
  return value
}

/**
 * Normalize the row config into the values the service reads.
 * @param input - raw row config object; absent fields take defaults.
 * @returns frozen resolved configuration.
 * @throws when a present field has a wrong type or range.
 */
export function normalizeConfig(input) {
  const source = input !== null && typeof input === 'object' && !Array.isArray(input) ? input : {}
  const isInteger = (min, max) => (value) => Number.isInteger(value) && value >= min && value <= max
  const isStringList = (value) => Array.isArray(value) && value.every((item) => typeof item === 'string')

  const allowRoots = readConfigField(source, 'allowRoots', DEFAULT_CONFIG.allowRoots, isStringList, 'a list of directory paths')
  const skipDirectories = readConfigField(source, 'skipDirectories', DEFAULT_CONFIG.skipDirectories, isStringList, 'a list of directory names')
  return Object.freeze({
    gitTimeoutMs: readConfigField(source, 'gitTimeoutMs', DEFAULT_CONFIG.gitTimeoutMs, isInteger(1000, 120000), 'an integer between 1000 and 120000'),
    diffMaxChars: readConfigField(source, 'diffMaxChars', DEFAULT_CONFIG.diffMaxChars, isInteger(10000, 2000000), 'an integer between 10000 and 2000000'),
    logLimit: readConfigField(source, 'logLimit', DEFAULT_CONFIG.logLimit, isInteger(10, 300), 'an integer between 10 and 300'),
    commitFilesLimit: readConfigField(source, 'commitFilesLimit', DEFAULT_CONFIG.commitFilesLimit, isInteger(50, 5000), 'an integer between 50 and 5000'),
    signCommits: readConfigField(source, 'signCommits', DEFAULT_CONFIG.signCommits, (value) => typeof value === 'boolean', 'a boolean'),
    browseLimit: readConfigField(source, 'browseLimit', DEFAULT_CONFIG.browseLimit, isInteger(1, 10000), 'an integer between 1 and 10000'),
    skipDirectories: Object.freeze(skipDirectories.map((entry) => entry.toLowerCase())),
    allowRoots: Object.freeze(allowRoots.map((entry) => path.resolve(entry))),
  })
}

/**
 * Answer whether one path is the parent or lies below it.
 * @param parent - absolute parent path.
 * @param child - absolute candidate path.
 * @returns true when `child` is `parent` or below it, compared lexically.
 */
function isWithin(parent, child) {
  const relative = path.relative(parent, child)
  if (relative === '') return true
  return !relative.startsWith('..') && !path.isAbsolute(relative)
}

/**
 * Strip a trailing carriage return from one git field.
 * @param value - raw field.
 * @returns the field without a trailing CR.
 */
function trimLine(value) {
  return value.replace(/\r$/, '')
}

/**
 * Parse `git status --porcelain=v1 -z --branch` output.
 * @param stdout - NUL-separated porcelain records, branch header first.
 * @returns the branch facts and one entry per changed path.
 */
export function parseStatus(stdout) {
  const records = stdout.split('\0')
  let branch = null
  let upstream = null
  let ahead = 0
  let behind = 0
  let detached = false
  let unborn = false
  const files = []

  for (let index = 0; index < records.length; index += 1) {
    const record = records[index]
    if (record.length === 0) continue
    if (record.startsWith('## ')) {
      const header = trimLine(record.slice(3))
      const tracking = /\[(.+?)\]$/.exec(header)
      const body = tracking ? header.slice(0, tracking.index).trimEnd() : header
      if (tracking) {
        const aheadMatch = /ahead (\d+)/.exec(tracking[1])
        const behindMatch = /behind (\d+)/.exec(tracking[1])
        ahead = aheadMatch ? Number(aheadMatch[1]) : 0
        behind = behindMatch ? Number(behindMatch[1]) : 0
      }
      if (body.startsWith('No commits yet on ')) {
        unborn = true
        branch = body.slice('No commits yet on '.length).trim()
        continue
      }
      if (body === 'HEAD (no branch)' || body === 'HEAD') {
        detached = true
        continue
      }
      const separator = body.indexOf('...')
      if (separator === -1) {
        branch = body
      } else {
        branch = body.slice(0, separator)
        upstream = body.slice(separator + 3)
      }
      continue
    }
    const indexCode = record[0] === undefined ? ' ' : record[0]
    const worktreeCode = record[1] === undefined ? ' ' : record[1]
    const filePath = record.slice(3)
    if (indexCode === 'R' || indexCode === 'C') {
      // With -z the rename's original path is the next record; it is not a
      // changed path of its own.
      index += 1
    }
    files.push({
      path: filePath,
      status: indexCode + worktreeCode,
      staged: indexCode !== ' ' && indexCode !== '?',
      unstaged: worktreeCode !== ' ' && worktreeCode !== '?',
      untracked: indexCode === '?' && worktreeCode === '?',
    })
  }

  return { branch, upstream, ahead, behind, detached, unborn, files }
}

/**
 * Run one Git command in a repository.
 * @param repo - absolute directory passed to `git -C`.
 * @param args - Git arguments after the implicit `-C <repo>`.
 * @param options - `timeout` in milliseconds.
 * @returns exit code plus captured output; never rejects for a Git failure.
 */
export async function runGit(repo, args, options = {}) {
  const timeout = Number.isInteger(options.timeout) ? options.timeout : DEFAULT_CONFIG.gitTimeoutMs
  return await new Promise((resolve) => {
    try {
      execFile(
        'git',
        ['-C', repo, '-c', 'core.quotepath=false', ...args],
        {
          cwd: repo,
          windowsHide: true,
          timeout,
          maxBuffer: 64 * 1024 * 1024,
          encoding: 'utf8',
          env: {
            ...process.env,
            GIT_TERMINAL_PROMPT: '0',
            GCM_INTERACTIVE: 'never',
            GIT_OPTIONAL_LOCKS: '0',
          },
        },
        (error, stdout, stderr) => {
          const stdoutText = typeof stdout === 'string' ? stdout : ''
          const stderrText = typeof stderr === 'string' ? stderr : ''
          if (error === null || error === undefined) {
            resolve({ code: 0, stdout: stdoutText, stderr: stderrText, message: '' })
            return
          }
          const exitCode = typeof error.code === 'number' ? error.code : -1
          let message
          if (error.killed) message = `git ${args[0] ?? ''} timed out after ${timeout} ms`.trim()
          else if (exitCode === -1) message = `cannot run git: ${stderrText.trim() || error.message}`
          else message = stderrText.trim() || stdoutText.trim() || error.message
          resolve({ code: exitCode, stdout: stdoutText, stderr: stderrText, message })
        },
      )
    } catch (error) {
      resolve({ code: -1, stdout: '', stderr: '', message: `cannot run git: ${String(error)}` })
    }
  })
}

/**
 * Turn one failed command into the operation error the panel shows.
 * @param result - failed runGit result.
 * @param action - human description of the attempted operation.
 * @returns the error to throw.
 */
function gitFailure(result, action) {
  return new RequestError('git_failed', `${action} failed: ${result.message}`)
}

/**
 * Read the working tree status of one repository.
 * @param repo - absolute repository root.
 * @param config - resolved configuration.
 * @returns branch facts and changed files.
 * @throws when git itself fails.
 */
export async function readStatus(repo, config) {
  const result = await runGit(repo, ['status', '--porcelain=v1', '-z', '--branch', '--untracked-files=normal'], {
    timeout: config.gitTimeoutMs,
  })
  if (result.code !== 0) throw gitFailure(result, 'git status')
  const parsed = parseStatus(result.stdout)
  return {
    root: repo,
    branch: parsed.branch,
    upstream: parsed.upstream,
    ahead: parsed.ahead,
    behind: parsed.behind,
    detached: parsed.detached,
    unborn: parsed.unborn,
    files: parsed.files,
  }
}

/**
 * Parse one ref record from `git for-each-ref`.
 * @param line - one tab-separated record.
 * @returns the ref label, or undefined for a line that cannot be parsed.
 */
function parseRefLine(line) {
  const [fullRef, objectName, peeledName, shortName] = line.split('\t')
  if (fullRef === undefined || objectName === undefined) return undefined
  let kind = 'branch'
  if (fullRef.startsWith('refs/remotes/')) kind = 'remote'
  else if (fullRef.startsWith('refs/tags/')) kind = 'tag'
  const name = (shortName !== undefined && shortName.length > 0 ? shortName : fullRef).replace(/\r$/, '')
  if (kind === 'remote' && /\/HEAD$/.test(fullRef)) return undefined
  const hash = (peeledName !== undefined && peeledName.length > 0 ? peeledName : objectName).replace(/\r$/, '')
  return { hash, name, kind }
}

/**
 * Resolve the requested history scope.
 * @param branch - optional branch or remote-tracking branch name from the request.
 * @returns the validated ref name, or null when every ref in the repository is shown.
 * @throws when the name is malformed.
 */
function normalizeLogScope(branch) {
  if (typeof branch !== 'string') return null
  const name = branch.trim()
  if (name === '') return null
  if (!/^[A-Za-z0-9._/-]+$/.test(name) || name.startsWith('-') || name.endsWith('/')) {
    throw new RequestError('bad_request', '`branch` must be a branch or remote-tracking branch name.')
  }
  return name
}

/**
 * Read one page of the recent commit history with parents and ref labels.
 *
 * Pagination is by position in the same `--topo-order` walk: the client asks for
 * the next page with `offset = commits already loaded`, and the Host fetches one
 * commit beyond the page to report whether older history remains. The scope is
 * either the whole repository (every ref, the default) or one branch / remote-
 * tracking branch.
 * @param repo - absolute repository root.
 * @param limit - page size; clamped into the configured range.
 * @param offset - commits to skip from the start of the history.
 * @param config - resolved configuration.
 * @param branch - branch or remote-tracking ref to scope the history to; absent shows all refs.
 * @returns the head facts, the page of commits newest first, and whether older commits remain.
 * @throws when git fails for a reason other than an unborn branch.
 */
export async function readLog(repo, limit, offset, config, branch) {
  const requested = Number.isInteger(limit) ? limit : config.logLimit
  const count = Math.min(Math.max(requested, 1), config.logLimit)
  const skip = Number.isInteger(offset) && offset > 0 ? offset : 0
  const scope = normalizeLogScope(branch)
  const format = '%H%x1f%h%x1f%P%x1f%an%x1f%at%x1f%s%x1e'
  const args = ['log', '-n', String(count + 1)]
  if (skip > 0) args.push('--skip', String(skip))
  args.push('--topo-order', '--no-color', `--pretty=format:${format}`)
  if (scope === null) {
    args.push('--all')
  } else {
    const local = await runGit(repo, ['rev-parse', '--verify', '--quiet', `refs/heads/${scope}`], { timeout: config.gitTimeoutMs })
    if (local.code !== 0) {
      const remote = await runGit(repo, ['rev-parse', '--verify', '--quiet', `refs/remotes/${scope}`], { timeout: config.gitTimeoutMs })
      if (remote.code !== 0) {
        throw new RequestError('unknown_branch', `No branch or remote-tracking ref named ${scope}.`)
      }
    }
    args.push(scope)
  }
  const result = await runGit(repo, args, {
    timeout: config.gitTimeoutMs,
  })

  const commits = []
  if (result.code !== 0) {
    if (!/does not have any commits|unknown revision|bad revision|not a git repository|bad default revision/i.test(result.message)) {
      throw gitFailure(result, 'git log')
    }
  } else {
    for (const chunk of result.stdout.split('\x1e')) {
      const trimmed = chunk.replace(/^\r?\n/, '')
      if (trimmed.length === 0) continue
      const fields = trimmed.split('\x1f')
      if (fields.length < 6) continue
      commits.push({
        hash: fields[0],
        short: fields[1],
        parents: fields[2].length === 0 ? [] : fields[2].split(' '),
        author: fields[3],
        time: Number(fields[4]),
        subject: fields.slice(5).join('\x1f'),
        refs: [],
      })
    }
  }
  const hasMore = commits.length > count
  if (hasMore) commits.length = count

  const { byHash, branch: currentBranch } = await readRefMap(repo, config)
  for (const commit of commits) {
    commit.refs = refsForHash(byHash, currentBranch, commit.hash)
  }
  if (currentBranch === null && commits.length > 0) {
    const headResult = await runGit(repo, ['rev-parse', 'HEAD'], { timeout: config.gitTimeoutMs })
    const headHash = headResult.code === 0 ? trimLine(headResult.stdout).trim() : ''
    const headCommit = commits.find((commit) => commit.hash === headHash)
    if (headCommit !== undefined) headCommit.refs = [...headCommit.refs, { name: 'HEAD', kind: 'head' }]
  }

  return { head: { branch: currentBranch, detached: currentBranch === null }, commits, hasMore }
}

/**
 * Read every local branch, remote-tracking branch, and tag label by commit hash.
 * @param repo - absolute repository root.
 * @param config - resolved configuration.
 * @returns labels by full commit hash plus the checked-out branch (null when detached).
 */
async function readRefMap(repo, config) {
  const refsResult = await runGit(
    repo,
    ['for-each-ref', '--format=%(refname)%09%(objectname)%09%(*objectname)%09%(refname:short)', 'refs/heads', 'refs/remotes', 'refs/tags'],
    { timeout: config.gitTimeoutMs },
  )
  const byHash = new Map()
  if (refsResult.code === 0) {
    for (const line of refsResult.stdout.split('\n')) {
      const parsed = parseRefLine(line)
      if (parsed === undefined) continue
      const bucket = byHash.get(parsed.hash)
      const ref = { name: parsed.name, kind: parsed.kind }
      if (bucket === undefined) byHash.set(parsed.hash, [ref])
      else bucket.push(ref)
    }
  }
  const symbolic = await runGit(repo, ['symbolic-ref', '--short', '--quiet', 'HEAD'], { timeout: config.gitTimeoutMs })
  const branch = symbolic.code === 0 ? trimLine(symbolic.stdout).trim() : null
  return { byHash, branch }
}

/**
 * Attach ref labels to one commit hash, marking the checked-out branch.
 * @param refsByHash - label map from {@link readRefMap}.
 * @param branch - checked-out branch, or null when detached.
 * @param hash - full commit hash.
 * @returns refs for this commit, possibly empty.
 */
function refsForHash(refsByHash, branch, hash) {
  const refs = refsByHash.get(hash)
  if (refs === undefined) return []
  return refs.map((ref) => (ref.kind === 'branch' && branch !== null && ref.name === branch ? { ...ref, current: true } : ref))
}

/**
 * List local branches, remote-tracking branches, and the current one.
 * @param repo - absolute repository root.
 * @param config - resolved configuration.
 * @returns current branch name (null when detached), local branch names, and remote-tracking names.
 * @throws when git fails.
 */
export async function readBranches(repo, config) {
  const refs = await runGit(repo, ['for-each-ref', '--format=%(refname)%09%(refname:short)', 'refs/heads', 'refs/remotes'], { timeout: config.gitTimeoutMs })
  if (refs.code !== 0) throw gitFailure(refs, 'git for-each-ref')
  const current = await runGit(repo, ['symbolic-ref', '--quiet', '--short', 'HEAD'], { timeout: config.gitTimeoutMs })
  const locals = []
  const remotes = []
  for (const line of refs.stdout.split('\n')) {
    const [fullRef, shortRef] = line.split('\t')
    if (fullRef === undefined || shortRef === undefined) continue
    // Symbolic remote refs (a remote's HEAD) shorten to the bare remote name;
    // they name a remote, not a branch, so the picker does not list them.
    if (/\/HEAD$/.test(fullRef)) continue
    const name = trimLine(shortRef).trim()
    if (name === '') continue
    const bucket = fullRef.startsWith('refs/remotes/') ? remotes : locals
    if (bucket.includes(name)) continue
    bucket.push(name)
  }
  return {
    current: current.code === 0 ? trimLine(current.stdout).trim() : null,
    locals,
    remotes,
  }
}

/**
 * Resolve one request hash to a full commit id.
 * @param repo - absolute repository root.
 * @param hash - short or full commit id from the request.
 * @param config - resolved configuration.
 * @returns the full commit hash.
 * @throws when the id is malformed or names no commit.
 */
async function resolveCommit(repo, hash, config) {
  if (typeof hash !== 'string' || !/^[0-9a-fA-F]{4,40}$/.test(hash)) {
    throw new RequestError('bad_request', '`hash` must be a 4-40 character hexadecimal commit id.')
  }
  const result = await runGit(repo, ['rev-parse', '--verify', '--quiet', `${hash}^{commit}`], { timeout: config.gitTimeoutMs })
  const resolved = trimLine(result.stdout).trim()
  if (result.code !== 0 || resolved.length === 0) {
    throw new RequestError('unknown_commit', `Unknown commit: ${hash}`)
  }
  return resolved
}

/**
 * Read one commit's metadata, ref labels, and changed files.
 *
 * A merge commit is compared against its first parent; a root commit against
 * Git's empty tree, so both cases list files instead of returning nothing.
 * Rename detection is disabled so the `--name-status` and `--numstat` records
 * line up one to one.
 * @param repo - absolute repository root.
 * @param hash - short or full commit id.
 * @param config - resolved configuration.
 * @returns commit metadata and its file changes.
 * @throws when the commit cannot be resolved or git fails.
 */
export async function readCommitDetail(repo, hash, config) {
  const sha = await resolveCommit(repo, hash, config)
  const meta = await runGit(
    repo,
    ['show', '-s', '--no-color', '--pretty=format:%H%x1f%h%x1f%an%x1f%ae%x1f%at%x1f%P%x1f%s%x1f%b', sha],
    { timeout: config.gitTimeoutMs },
  )
  if (meta.code !== 0) throw gitFailure(meta, 'git show')
  const fields = meta.stdout.split('\x1f')
  if (fields.length < 7) throw new RequestError('internal', 'Unexpected git show output.')
  const parents = fields[5].length === 0 ? [] : fields[5].split(' ').filter((parent) => parent.length > 0)
  const base = parents.length > 0 ? parents[0] : EMPTY_TREE

  const numstat = await runGit(repo, ['diff', '--no-renames', '--numstat', base, sha, '--'], { timeout: config.gitTimeoutMs })
  const nameStatus = await runGit(repo, ['diff', '--no-renames', '--name-status', base, sha, '--'], { timeout: config.gitTimeoutMs })
  if (numstat.code !== 0) throw gitFailure(numstat, 'git diff --numstat')
  if (nameStatus.code !== 0) throw gitFailure(nameStatus, 'git diff --name-status')

  const stats = numstat.stdout.split('\n').map((line) => trimLine(line)).filter((line) => line.length > 0)
  const statuses = nameStatus.stdout.split('\n').map((line) => trimLine(line)).filter((line) => line.length > 0)
  const files = []
  for (let index = 0; index < statuses.length; index += 1) {
    const record = statuses[index].split('\t')
    const status = record[0].charAt(0)
    const filePath = record.length > 1 ? record[record.length - 1] : ''
    if (filePath.length === 0) continue
    let additions = null
    let deletions = null
    const statRecord = stats[index]
    if (statRecord !== undefined) {
      const parts = statRecord.split('\t')
      additions = parts[0] === '-' ? null : Number(parts[0])
      deletions = parts[1] === '-' ? null : Number(parts[1])
      if (!Number.isFinite(additions)) additions = null
      if (!Number.isFinite(deletions)) deletions = null
    }
    files.push({ path: filePath, status, additions, deletions })
  }

  const { byHash, branch } = await readRefMap(repo, config)
  const refs = refsForHash(byHash, branch, sha)
  if (branch === null) {
    const headResult = await runGit(repo, ['rev-parse', 'HEAD'], { timeout: config.gitTimeoutMs })
    const headHash = headResult.code === 0 ? trimLine(headResult.stdout).trim() : ''
    if (headHash === sha) refs.push({ name: 'HEAD', kind: 'head' })
  }

  const truncatedFiles = files.length > config.commitFilesLimit
  return {
    hash: sha,
    short: fields[1],
    author: fields[2],
    authorEmail: fields[3],
    time: Number(fields[4]),
    subject: fields[6],
    body: fields.slice(7).join('\x1f').replace(/\r$/, ''),
    parents,
    refs,
    files: truncatedFiles ? files.slice(0, config.commitFilesLimit) : files,
    truncatedFiles,
  }
}

/**
 * Read one file's patch within one commit.
 * @param repo - absolute repository root.
 * @param hash - short or full commit id.
 * @param filePath - repository-relative path already validated.
 * @param config - resolved configuration.
 * @returns the unified diff and whether it was truncated.
 * @throws when the commit cannot be resolved or git fails.
 */
export async function readCommitDiff(repo, hash, filePath, config) {
  const sha = await resolveCommit(repo, hash, config)
  const meta = await runGit(repo, ['show', '-s', '--no-color', '--pretty=format:%P', sha], { timeout: config.gitTimeoutMs })
  if (meta.code !== 0) throw gitFailure(meta, 'git show')
  const parents = trimLine(meta.stdout).trim().split(' ').filter((parent) => parent.length > 0)
  const base = parents.length > 0 ? parents[0] : EMPTY_TREE
  const result = await runGit(
    repo,
    ['diff', '--no-color', '--no-ext-diff', '--no-textconv', '--no-renames', base, sha, '--', filePath],
    { timeout: config.gitTimeoutMs },
  )
  if (result.code !== 0) throw gitFailure(result, 'git diff')
  let diff = result.stdout
  let truncated = false
  if (diff.length > config.diffMaxChars) {
    diff = `${diff.slice(0, config.diffMaxChars)}\n... (truncated)\n`
    truncated = true
  }
  return { diff, truncated }
}

/**
 * Browse one directory one level deep, for the cascading repository picker.
 *
 * The picker asks for one level at a time: expanding a directory sends another
 * browse request naming that directory, so a workspace holding dozens of nested
 * repositories is never walked at once. Only direct subdirectories are
 * reported. A subdirectory is listed when it is itself a repository (it holds a
 * `.git` entry, either a directory or a worktree file) or when it holds at least
 * one subdirectory that can be descended into; a plain leaf directory is a dead
 * end for the picker and is left out. Each subdirectory needs a single
 * `readdir` to answer both flags, never a recursive walk. Hidden directories and
 * the configured build/dependency directories are skipped, and the result count
 * stops at `config.browseLimit`.
 * @param base - absolute existing directory to read; it need not be a repository.
 * @param config - resolved configuration.
 * @returns the browsed directory, the enclosing repository root (or null when the
 *   directory is outside every repository), whether the directory itself holds a
 *   `.git` entry, its listed direct subdirectories, and whether the list stopped
 *   at the configured limit.
 */
export async function browseDirectory(base, config) {
  const dir = path.resolve(base)
  const topLevel = await runGit(dir, ['rev-parse', '--show-toplevel'], { timeout: config.gitTimeoutMs })
  const reported = trimLine(topLevel.stdout).trim()
  const repoRoot = topLevel.code === 0 && reported.length > 0 ? path.resolve(reported) : null

  let children
  try {
    children = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    // An unreadable directory still answers the enclosing repository question.
    children = []
  }
  const isRepo = children.some((child) => child.name === '.git')
  const candidates = children
    .filter((child) => child.isDirectory())
    .filter((child) => !child.name.startsWith('.'))
    .filter((child) => !config.skipDirectories.includes(child.name.toLowerCase()))
    .sort((left, right) => left.name.localeCompare(right.name))

  const entries = []
  let truncated = false
  for (const child of candidates) {
    if (entries.length >= config.browseLimit) {
      truncated = true
      break
    }
    const childPath = path.join(dir, child.name)
    let grandchildren
    try {
      grandchildren = await fs.readdir(childPath, { withFileTypes: true })
    } catch {
      continue
    }
    const childIsRepo = grandchildren.some((entry) => entry.name === '.git')
    const hasChildren = grandchildren.some(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith('.') &&
        !config.skipDirectories.includes(entry.name.toLowerCase()),
    )
    if (!childIsRepo && !hasChildren) continue
    entries.push({ name: child.name, path: childPath, isRepo: childIsRepo, hasChildren })
  }

  return { dir, repoRoot, isRepo, entries, truncated }
}

/**
 * Read one file's unified diff.
 *
 * An untracked file has no diff against the index, so its current text is
 * returned as added lines; that is the only way the panel can show it without
 * a separate endpoint.
 * @param repo - absolute repository root.
 * @param filePath - repository-relative path already validated.
 * @param staged - read the index-against-HEAD diff when true, else worktree.
 * @param config - resolved configuration.
 * @returns the diff text, whether it was truncated, and whether it is untracked.
 * @throws when git fails.
 */
export async function readDiff(repo, filePath, staged, config) {
  if (!staged) {
    const tracked = await runGit(repo, ['ls-files', '--error-unmatch', '--', filePath], { timeout: config.gitTimeoutMs })
    if (tracked.code !== 0) {
      const absolute = path.join(repo, ...filePath.split('/'))
      let text = ''
      try {
        const stat = await fs.stat(absolute)
        if (stat.isFile() && stat.size <= 5 * 1024 * 1024) {
          const buffer = await fs.readFile(absolute)
          text = buffer.includes(0) ? '' : buffer.toString('utf8')
        }
      } catch {
        text = ''
      }
      let synthesized = ''
      let truncated = false
      for (const line of text.split('\n')) {
        const piece = `+${line}\n`
        if (synthesized.length + piece.length > config.diffMaxChars) {
          truncated = true
          break
        }
        synthesized += piece
      }
      if (synthesized.endsWith('\n') && text.endsWith('\n')) synthesized = synthesized.slice(0, -1)
      return { diff: synthesized, truncated, untracked: true }
    }
  }

  const args = ['diff', '--no-color', '--no-ext-diff', '--no-textconv']
  if (staged) args.push('--cached')
  args.push('--', filePath)
  const result = await runGit(repo, args, { timeout: config.gitTimeoutMs })
  if (result.code !== 0) throw gitFailure(result, 'git diff')
  let diff = result.stdout
  let truncated = false
  if (diff.length > config.diffMaxChars) {
    diff = `${diff.slice(0, config.diffMaxChars)}\n... (truncated)\n`
    truncated = true
  }
  return { diff, truncated, untracked: false }
}

/**
 * Parse and validate one repository-relative path from a request.
 * @param value - candidate path.
 * @returns the validated path with forward slashes.
 * @throws when the path is empty, absolute, or escapes its repository.
 */
export function normalizeFileArgument(value) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new RequestError('bad_request', '`path` must be a non-empty string.')
  }
  if (value.includes('\0')) throw new RequestError('bad_request', '`path` contains a NUL byte.')
  if (path.isAbsolute(value)) throw new RequestError('forbidden', '`path` must be relative to the repository.')
  const segments = value.split(/[\\/]+/).filter((segment) => segment.length > 0 && segment !== '.')
  if (segments.includes('..')) throw new RequestError('forbidden', '`path` must stay inside the repository.')
  return segments.join('/')
}

/**
 * Parse a list of repository-relative paths.
 * @param value - raw request field.
 * @returns validated paths, possibly empty.
 */
function normalizeFileList(value) {
  if (value === undefined) return []
  if (!Array.isArray(value)) throw new RequestError('bad_request', '`paths` must be a list of paths.')
  return value.map((item) => normalizeFileArgument(item))
}

/**
 * Resolve one directory request field to an absolute path and stat it.
 *
 * Both the repository operations and the cascading browse read a directory from
 * the request body, so the shape checks live here once.
 * @param value - request field carrying a directory path.
 * @param field - name of the request field, used in error messages.
 * @returns the resolved absolute path and its stat result.
 * @throws when the value is not a non-empty string, contains a NUL byte, or names
 *   nothing on disk.
 */
async function resolveExistingPath(value, field) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new RequestError('bad_request', `\`${field}\` must be a non-empty path.`)
  }
  if (value.includes('\0')) throw new RequestError('bad_request', `\`${field}\` contains a NUL byte.`)
  const candidate = path.resolve(value.trim())
  try {
    return { candidate, stat: await fs.stat(candidate) }
  } catch {
    throw new RequestError('not_found', `目录不存在：${candidate}`)
  }
}

/**
 * Build the request-serving service for one resolved configuration.
 * @param configInput - raw row config.
 * @returns the service with one request handler and direct operations.
 */
export function createGitService(configInput) {
  const config = normalizeConfig(configInput)

  /**
   * Resolve one absolute directory to the enclosing Git repository root.
   * @param value - absolute working directory from the request.
   * @returns the repository root reported by `git rev-parse --show-toplevel`.
   */
  async function requireRepository(value) {
    const { candidate, stat } = await resolveExistingPath(value, 'repo')
    if (!stat.isDirectory()) throw new RequestError('not_a_repository', `不是 Git 仓库：${candidate}`)
    const topLevel = await runGit(candidate, ['rev-parse', '--show-toplevel'], { timeout: config.gitTimeoutMs })
    const reported = trimLine(topLevel.stdout).trim()
    if (topLevel.code !== 0 || reported.length === 0) {
      throw new RequestError('not_a_repository', `不是 Git 仓库：${candidate}`)
    }
    const root = path.resolve(reported)
    if (config.allowRoots.length > 0 && !config.allowRoots.some((allowed) => isWithin(allowed, root))) {
      throw new RequestError('forbidden', `Repository is outside allowRoots: ${root}`)
    }
    return root
  }

  /**
   * Validate one directory from a request and resolve it to an absolute path.
   *
   * Unlike {@link requireRepository} the directory need not be a repository: the
   * picker also browses plain parents that only hold repositories.
   * @param value - absolute directory from the request.
   * @returns the resolved absolute path.
   * @throws when the value is malformed, missing, not a directory, or fenced by `allowRoots`.
   */
  async function requireDirectory(value) {
    const { candidate, stat } = await resolveExistingPath(value, 'dir')
    if (!stat.isDirectory()) throw new RequestError('not_found', `不是目录：${candidate}`)
    if (config.allowRoots.length > 0 && !config.allowRoots.some((allowed) => isWithin(allowed, candidate))) {
      throw new RequestError('forbidden', `Directory is outside allowRoots: ${candidate}`)
    }
    return candidate
  }

  /**
   * Browse one directory one level deep for the cascading repository picker.
   * @param value - absolute directory from the request; it need not be a repository.
   * @returns the direct subdirectories with their repository and drill-down flags.
   */
  async function browse(value) {
    return await browseDirectory(await requireDirectory(value), config)
  }

  /**
   * Stage or unstage paths, then return the refreshed status.
   * @param repoArg - repository request field.
   * @param pathsArg - path list request field.
   * @param method - Git subcommand name.
   * @returns status after the change.
   */
  async function applyIndexChange(repoArg, pathsArg, method) {
    const repo = await requireRepository(repoArg)
    const paths = normalizeFileList(pathsArg)
    if (paths.length === 0) throw new RequestError('bad_request', '`paths` must name at least one file.')
    let result
    if (method === 'add') {
      result = await runGit(repo, ['add', '--', ...paths], { timeout: config.gitTimeoutMs })
    } else {
      result = await runGit(repo, ['restore', '--staged', '--', ...paths], { timeout: config.gitTimeoutMs })
      if (result.code !== 0) {
        result = await runGit(repo, ['reset', 'HEAD', '--', ...paths], { timeout: config.gitTimeoutMs })
      }
    }
    if (result.code !== 0) throw gitFailure(result, method === 'add' ? 'git add' : 'git restore --staged')
    return await readStatus(repo, config)
  }

  /**
   * Stage every change in the repository.
   * @param repoArg - repository request field.
   * @returns status after staging.
   */
  async function stageAll(repoArg) {
    const repo = await requireRepository(repoArg)
    const result = await runGit(repo, ['add', '-A', '--'], { timeout: config.gitTimeoutMs })
    if (result.code !== 0) throw gitFailure(result, 'git add -A')
    return await readStatus(repo, config)
  }

  /**
   * Unstage every staged change in the repository.
   * @param repoArg - repository request field.
   * @returns status after unstaging.
   */
  async function unstageAll(repoArg) {
    const repo = await requireRepository(repoArg)
    let result = await runGit(repo, ['restore', '--staged', '--', '.'], { timeout: config.gitTimeoutMs })
    if (result.code !== 0) {
      result = await runGit(repo, ['reset', 'HEAD', '--', '.'], { timeout: config.gitTimeoutMs })
    }
    if (result.code !== 0) {
      // An unborn branch has no HEAD to reset to; removing the index entries
      // is the only way to unstage a repository with no commits.
      result = await runGit(repo, ['rm', '--cached', '-r', '--', '.'], { timeout: config.gitTimeoutMs })
    }
    if (result.code !== 0) throw gitFailure(result, 'git restore --staged')
    return await readStatus(repo, config)
  }

  /**
   * Switch to one existing local branch.
   * @param repoArg - repository request field.
   * @param branchArg - branch name request field.
   * @returns the branch now checked out and the refreshed status.
   */
  async function switchBranch(repoArg, branchArg) {
    const repo = await requireRepository(repoArg)
    const branch = typeof branchArg === 'string' ? branchArg.trim() : ''
    if (branch.length === 0) throw new RequestError('bad_request', '`branch` must not be empty.')
    const branches = await readBranches(repo, config)
    if (!branches.locals.includes(branch)) {
      throw new RequestError('unknown_branch', `No local branch named ${branch}.`)
    }
    let result = await runGit(repo, ['switch', '--no-guess', branch], { timeout: config.gitTimeoutMs })
    if (result.code !== 0 && /not a git command|unknown option/i.test(result.message)) {
      result = await runGit(repo, ['checkout', branch], { timeout: config.gitTimeoutMs })
    }
    if (result.code !== 0) throw gitFailure(result, 'git switch')
    return { branch, status: await readStatus(repo, config) }
  }

  /**
   * Commit the staged changes with one message.
   * @param repoArg - repository request field.
   * @param messageArg - commit message request field.
   * @returns the created commit and the refreshed status.
   */
  async function commit(repoArg, messageArg) {
    const repo = await requireRepository(repoArg)
    const message = typeof messageArg === 'string' ? messageArg.trim() : ''
    if (message.length === 0) throw new RequestError('bad_request', 'Commit message must not be empty.')
    const args = ['commit', '-m', message]
    if (!config.signCommits) args.push('--no-gpg-sign')
    const result = await runGit(repo, args, { timeout: config.gitTimeoutMs })
    if (result.code !== 0) throw gitFailure(result, 'git commit')
    const full = await runGit(repo, ['rev-parse', 'HEAD'], { timeout: config.gitTimeoutMs })
    const short = await runGit(repo, ['rev-parse', '--short=7', 'HEAD'], { timeout: config.gitTimeoutMs })
    const status = await readStatus(repo, config)
    return {
      hash: full.code === 0 ? trimLine(full.stdout).trim() : '',
      short: short.code === 0 ? trimLine(short.stdout).trim() : '',
      subject: message.split('\n')[0].slice(0, 200),
      status,
    }
  }

  /**
   * Dispatch one parsed request payload.
   * @param payload - parsed JSON body.
   * @returns the action's result value.
   */
  async function dispatch(payload) {
    const action = payload.action
    switch (action) {
      case 'status':
        return await readStatus(await requireRepository(payload.repo), config)
      case 'diff':
        return await readDiff(
          await requireRepository(payload.repo),
          normalizeFileArgument(payload.path),
          payload.staged === true,
          config,
        )
      case 'stage':
        return await applyIndexChange(payload.repo, payload.paths, 'add')
      case 'unstage':
        return await applyIndexChange(payload.repo, payload.paths, 'restore')
      case 'stageAll':
        return await stageAll(payload.repo)
      case 'unstageAll':
        return await unstageAll(payload.repo)
      case 'commit':
        return await commit(payload.repo, payload.message)
      case 'log':
        return await readLog(await requireRepository(payload.repo), payload.limit, payload.offset, config, payload.branch)
      case 'branches':
        return await readBranches(await requireRepository(payload.repo), config)
      case 'switch':
        return await switchBranch(payload.repo, payload.branch)
      case 'browse':
        return await browse(payload.dir)
      case 'commitDetail':
        return await readCommitDetail(await requireRepository(payload.repo), payload.hash, config)
      case 'commitDiff':
        return await readCommitDiff(
          await requireRepository(payload.repo),
          payload.hash,
          normalizeFileArgument(payload.path),
          config,
        )
      default:
        throw new RequestError('unknown_action', `Unknown action: ${String(action)}`)
    }
  }

  /**
   * Answer one POST from the Client half.
   * @param request - Fetch request carrying a JSON body.
   * @returns JSON response; operation failures use `{ ok: false, error }`.
   */
  async function handle(request) {
    let payload
    try {
      const text = await request.text()
      payload = text.length === 0 ? null : JSON.parse(text)
    } catch {
      return jsonResponse({ ok: false, error: { code: 'bad_request', message: 'Request body must be JSON.' } }, 400)
    }
    if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
      return jsonResponse({ ok: false, error: { code: 'bad_request', message: 'Request body must be a JSON object.' } }, 400)
    }
    try {
      return jsonResponse({ ok: true, value: await dispatch(payload) })
    } catch (error) {
      if (error instanceof RequestError) {
        return jsonResponse({ ok: false, error: { code: error.code, message: error.message } })
      }
      const message = error instanceof Error ? error.message : String(error)
      return jsonResponse({ ok: false, error: { code: 'internal', message } })
    }
  }

  return {
    config,
    handle,
    status: async (repo) => await readStatus(await requireRepository(repo), config),
    diff: async (repo, filePath, staged) =>
      await readDiff(await requireRepository(repo), normalizeFileArgument(filePath), staged === true, config),
    stage: async (repo, paths) => await applyIndexChange(repo, paths, 'add'),
    unstage: async (repo, paths) => await applyIndexChange(repo, paths, 'restore'),
    stageAll,
    unstageAll,
    commit,
    log: async (repo, limit, offset, branch) => await readLog(await requireRepository(repo), limit, offset, config, branch),
    branches: async (repo) => await readBranches(await requireRepository(repo), config),
    switchBranch,
    browse,
    commitDetail: async (repo, hash) => await readCommitDetail(await requireRepository(repo), hash, config),
    commitDiff: async (repo, hash, filePath) =>
      await readCommitDiff(await requireRepository(repo), hash, normalizeFileArgument(filePath), config),
    requireRepository,
  }
}

/**
 * Serialize one JSON response.
 * @param body - JSON-safe body.
 * @param status - HTTP status.
 * @returns the Fetch response.
 */
function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })
}

/**
 * Register the `/api/git-ui` route on the shared Connection channel.
 * @param ctx - plugin context carrying `connection`.
 * @param config - raw row config.
 */
export function apply(ctx, config) {
  const service = createGitService(config)
  ctx.connection.fetch.register({
    path: ROUTE_PATH,
    methods: ['POST'],
    requestBody: 'buffered',
    fetch: (request) => service.handle(request),
  })
}
