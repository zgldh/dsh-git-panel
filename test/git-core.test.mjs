/**
 * Direct tests for the Git panel Host service. Runs outside the Harness
 * against throwaway repositories: repository resolution, status parsing,
 * diffs, index changes, commits, branch history (parents and ref labels),
 * branch switching, path validation, and the HTTP request handler.
 *
 * Usage: node test/git-core.test.mjs
 */

import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import * as path from 'node:path'

import {
  createGitService,
  discoverSubrepositories,
  normalizeConfig,
  normalizeFileArgument,
  parseStatus,
} from '../index.js'

let passed = 0
const failures = []

/**
 * Run one assertion group and record its outcome.
 * @param label - test name.
 * @param body - async test body.
 */
async function test(label, body) {
  try {
    await body()
    passed += 1
    console.log(`PASS ${label}`)
  } catch (error) {
    failures.push({ label, error })
    console.error(`FAIL ${label}\n  ${error && error.stack ? error.stack.split('\n').join('\n  ') : error}`)
  }
}

/**
 * Run git synchronously, throwing on failure.
 * @param cwd - working directory.
 * @param args - git arguments.
 * @returns stdout.
 */
function git(cwd, args) {
  return execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8', windowsHide: true })
}

/**
 * Create a commit-ready repository.
 * @param directory - repository directory.
 * @returns the directory.
 */
function initRepo(directory) {
  mkdirSync(directory, { recursive: true })
  git(directory, ['init', '--initial-branch=main'])
  git(directory, ['config', 'user.email', 'test@example.com'])
  git(directory, ['config', 'user.name', 'Test User'])
  git(directory, ['config', 'commit.gpgsign', 'false'])
  writeFileSync(path.join(directory, 'tracked.txt'), 'one\ntwo\n')
  git(directory, ['add', 'tracked.txt'])
  git(directory, ['commit', '-m', 'initial commit'])
  return directory
}

const workspace = mkdtempSync(path.join(tmpdir(), 'dsh-git-panel-'))

try {
  await test('normalizeConfig defaults and validation', () => {
    const config = normalizeConfig({})
    assert.equal(config.logLimit, 80)
    assert.equal(config.signCommits, false)
    assert.equal(config.includeAllRefs, false)
    assert.equal(config.subrepoDepth, 3)
    assert.equal(config.subrepoLimit, 50)
    assert.ok(config.skipDirectories.includes('node_modules'))
    assert.deepEqual(config.allowRoots, [])
    assert.throws(() => normalizeConfig({ logLimit: 1 }), /logLimit/)
    assert.throws(() => normalizeConfig({ subrepoDepth: 0 }), /subrepoDepth/)
    assert.throws(() => normalizeConfig({ allowRoots: 'nope' }), /allowRoots/)
  })

  await test('sub-repositories below a plain directory are discovered within the bounds', async () => {
    const base = path.join(workspace, 'subrepo-base')
    const inner = initRepo(path.join(base, 'group', 'inner-repo'))
    const shallow = initRepo(path.join(base, 'shallow-repo'))
    const skipped = initRepo(path.join(base, 'node_modules', 'hidden-repo'))
    const hidden = initRepo(path.join(base, '.hidden', 'hidden-repo'))
    const deep = initRepo(path.join(base, 'a', 'b', 'c', 'deep-repo'))
    mkdirSync(path.join(base, 'plain-dir'), { recursive: true })

    const config = normalizeConfig({ subrepoDepth: 2 })
    const result = await discoverSubrepositories(base, config)
    const found = result.items.map((item) => item.path).sort()
    assert.deepEqual(found, [path.resolve(shallow), path.resolve(inner)].sort())
    assert.equal(result.items.every((item) => item.rel !== ''), true)
    assert.equal(result.base, path.resolve(base))
    assert.equal(result.repoRoot, null)
    assert.equal(result.truncated, false)
    assert.equal(found.includes(path.resolve(skipped)), false)
    assert.equal(found.includes(path.resolve(hidden)), false)
    assert.equal(found.includes(path.resolve(deep)), false)

    const limited = await discoverSubrepositories(base, normalizeConfig({ subrepoDepth: 4, subrepoLimit: 1 }))
    assert.equal(limited.items.length, 1)
    assert.equal(limited.truncated, true)
  })

  await test('the subrepo service reports the enclosing repository and nested repositories', async () => {
    const localRepo = initRepo(path.join(workspace, 'subrepo-service'))
    const nested = initRepo(path.join(localRepo, 'tools', 'nested-repo'))
    const inside = await createGitService({}).subrepos(path.join(localRepo, 'tools'))
    assert.equal(inside.repoRoot, path.resolve(localRepo))
    assert.equal(inside.items.some((item) => item.path === path.resolve(nested)), true)
    const outside = await createGitService({}).subrepos(path.join(workspace, 'subrepo-base'))
    assert.equal(outside.repoRoot, null)
    await assert.rejects(() => createGitService({}).subrepos(path.join(workspace, 'missing')), /目录不存在/)
  })

  await test('parseStatus handles staged, modified, deleted, untracked, and tracking records', () => {
    const parsed = parseStatus('## main...origin/main [ahead 2, behind 1]\0A  staged.txt\0 M modified.txt\0 D deleted.txt\0?? new.txt\0')
    assert.equal(parsed.branch, 'main')
    assert.equal(parsed.upstream, 'origin/main')
    assert.equal(parsed.ahead, 2)
    assert.equal(parsed.behind, 1)
    assert.deepEqual(parsed.files.map((file) => file.path), ['staged.txt', 'modified.txt', 'deleted.txt', 'new.txt'])
    assert.equal(parsed.files[0].staged, true)
    assert.equal(parsed.files[1].unstaged, true)
    assert.equal(parsed.files[3].untracked, true)
  })

  const repo = initRepo(path.join(workspace, 'repo'))
  const service = createGitService({})

  await test('a repository subdirectory resolves to the repository root', async () => {
    const nested = path.join(repo, 'src', 'nested')
    mkdirSync(nested, { recursive: true })
    assert.equal(await service.requireRepository(repo), path.resolve(repo))
    assert.equal(await service.requireRepository(nested), path.resolve(repo))
  })

  await test('a non-repository directory is reported as such', async () => {
    const plain = path.join(workspace, 'plain')
    mkdirSync(plain, { recursive: true })
    await assert.rejects(() => service.requireRepository(plain), /不是 Git 仓库/)
    await assert.rejects(() => service.requireRepository(path.join(workspace, 'missing')), /目录不存在/)
  })

  await test('status reports a clean tracked repository with its root', async () => {
    const status = await service.status(repo)
    assert.equal(status.root, path.resolve(repo))
    assert.equal(status.branch, 'main')
    assert.equal(status.detached, false)
    assert.equal(status.files.length, 0)
  })

  await test('status exposes a modified tracked file as unstaged', async () => {
    writeFileSync(path.join(repo, 'tracked.txt'), 'one\ntwo changed\n')
    const status = await service.status(repo)
    assert.equal(status.files.length, 1)
    assert.equal(status.files[0].path, 'tracked.txt')
    assert.equal(status.files[0].unstaged, true)
    assert.equal(status.files[0].staged, false)
  })

  await test('diff returns worktree, staged, and untracked text', async () => {
    const worktree = await service.diff(repo, 'tracked.txt', false)
    assert.equal(worktree.untracked, false)
    assert.match(worktree.diff, /-two/)
    assert.match(worktree.diff, /\+two changed/)

    await service.stage(repo, ['tracked.txt'])
    const staged = await service.diff(repo, 'tracked.txt', true)
    assert.match(staged.diff, /\+two changed/)

    writeFileSync(path.join(repo, 'new-file.txt'), 'alpha\nbeta\n')
    const untracked = await service.diff(repo, 'new-file.txt', false)
    assert.equal(untracked.untracked, true)
    assert.match(untracked.diff, /^\+alpha$/m)
  })

  await test('stage, unstage, stageAll, and unstageAll move paths through the index', async () => {
    let status = await service.unstage(repo, ['tracked.txt'])
    assert.equal(status.files.find((file) => file.path === 'tracked.txt').unstaged, true)

    status = await service.stageAll(repo)
    assert.equal(status.files.every((file) => file.staged), true)
    status = await service.unstageAll(repo)
    assert.equal(status.files.every((file) => !file.staged), true)
    assert.equal(status.files.length, 2)
  })

  await test('commit creates a commit and cleans the tracked part of the tree', async () => {
    await service.stage(repo, ['tracked.txt', 'new-file.txt'])
    const result = await service.commit(repo, 'second commit')
    assert.match(result.hash, /^[0-9a-f]{40}$/)
    assert.equal(result.short.length >= 7, true)
    assert.equal(result.status.files.length, 0)
    assert.equal(result.subject, 'second commit')
  })

  await test('log returns commits, parents, and branch ref labels', async () => {
    const result = await service.log(repo, 20)
    assert.equal(result.head.branch, 'main')
    assert.equal(result.head.detached, false)
    assert.equal(result.commits.length, 2)
    assert.equal(result.commits[0].subject, 'second commit')
    assert.equal(result.commits[1].subject, 'initial commit')
    assert.deepEqual(result.commits[1].parents, [])
    assert.equal(result.commits[0].parents.length, 1)
    const refs = result.commits[0].refs
    assert.equal(refs.some((ref) => ref.name === 'main' && ref.kind === 'branch' && ref.current === true), true)
  })

  await test('log labels local, remote, and tag refs', async () => {
    const head = git(repo, ['rev-parse', 'HEAD']).trim()
    git(repo, ['branch', 'feature'])
    git(repo, ['update-ref', 'refs/remotes/origin/main', head])
    git(repo, ['symbolic-ref', 'refs/remotes/origin/HEAD', 'refs/remotes/origin/main'])
    git(repo, ['tag', 'v1.0'])
    git(repo, ['tag', '-a', 'v1.1', '-m', 'annotated'])
    const result = await service.log(repo, 20)
    const refs = result.commits[0].refs
    assert.equal(refs.some((ref) => ref.name === 'feature' && ref.kind === 'branch'), true)
    assert.equal(refs.some((ref) => ref.name === 'origin/main' && ref.kind === 'remote'), true)
    assert.equal(refs.some((ref) => ref.name === 'v1.0' && ref.kind === 'tag'), true)
    assert.equal(refs.some((ref) => ref.name === 'v1.1' && ref.kind === 'tag'), true)
    assert.equal(refs.some((ref) => ref.name === 'origin'), false, 'the symbolic origin/HEAD pseudo-ref must not be listed')
  })

  await test('the log follows the checked-out branch unless includeAllRefs is set', async () => {
    const branchy = initRepo(path.join(workspace, 'branchy'))
    git(branchy, ['switch', '-c', 'side'])
    writeFileSync(path.join(branchy, 'side.txt'), 'side\n')
    git(branchy, ['add', 'side.txt'])
    git(branchy, ['commit', '-m', 'side commit'])
    git(branchy, ['switch', 'main'])

    const headOnly = await createGitService({}).log(branchy, 20)
    assert.equal(headOnly.commits.length, 1)
    assert.equal(headOnly.commits[0].subject, 'initial commit')

    const allRefs = await createGitService({ includeAllRefs: true }).log(branchy, 20)
    assert.equal(allRefs.commits.length, 2)
    assert.equal(allRefs.commits.some((commit) => commit.subject === 'side commit'), true)
  })

  await test('a merge commit reports two parents', async () => {
    git(repo, ['switch', 'feature'])
    writeFileSync(path.join(repo, 'feature.txt'), 'feature\n')
    git(repo, ['add', 'feature.txt'])
    git(repo, ['commit', '-m', 'feature commit'])
    git(repo, ['switch', 'main'])
    writeFileSync(path.join(repo, 'main.txt'), 'main\n')
    git(repo, ['add', 'main.txt'])
    git(repo, ['commit', '-m', 'main commit'])
    git(repo, ['merge', '--no-ff', 'feature', '-m', 'merge feature'])
    const result = await service.log(repo, 10)
    assert.equal(result.commits[0].subject, 'merge feature')
    assert.equal(result.commits[0].parents.length, 2)
  })

  await test('commit detail reports metadata, parents, refs, and file changes', async () => {
    const head = git(repo, ['rev-parse', 'HEAD']).trim()
    const detail = await service.commitDetail(repo, head.slice(0, 7))
    assert.equal(detail.hash, head)
    assert.equal(detail.subject, 'merge feature')
    assert.equal(detail.author, 'Test User')
    assert.equal(typeof detail.time, 'number')
    assert.equal(detail.parents.length, 2)
    assert.equal(detail.refs.some((ref) => ref.name === 'main' && ref.current === true), true)
    const changed = detail.files.map((file) => file.path).sort()
    assert.deepEqual(changed, ['feature.txt'])
    assert.equal(detail.files.every((file) => file.status === 'A'), true)
    assert.equal(detail.files.every((file) => file.additions === 1 && file.deletions === 0), true)
    assert.equal(detail.truncatedFiles, false)
  })

  await test('commit detail handles a root commit against the empty tree', async () => {
    const root = git(repo, ['rev-list', '--max-parents=0', 'HEAD']).trim()
    const detail = await service.commitDetail(repo, root)
    assert.deepEqual(detail.parents, [])
    assert.equal(detail.files.some((file) => file.path === 'tracked.txt' && file.status === 'A'), true)
  })

  await test('commit patch returns one file diff and rejects unknown commits', async () => {
    const head = git(repo, ['rev-parse', 'HEAD']).trim()
    const patch = await service.commitDiff(repo, head, 'feature.txt')
    assert.match(patch.diff, /\+feature/)
    assert.equal(patch.truncated, false)
    await assert.rejects(() => service.commitDetail(repo, 'deadbeef'), /Unknown commit/)
    await assert.rejects(() => service.commitDetail(repo, 'not-a-hash'), /hexadecimal/)
  })

  await test('branches lists local branches and switch changes the current one', async () => {
    const listed = await service.branches(repo)
    assert.deepEqual(listed.locals.sort(), ['feature', 'main'].sort())
    assert.equal(listed.current, 'main')

    const switched = await service.switchBranch(repo, 'feature')
    assert.equal(switched.branch, 'feature')
    assert.equal(switched.status.branch, 'feature')
    assert.equal((await service.branches(repo)).current, 'feature')
    await assert.rejects(() => service.switchBranch(repo, 'missing-branch'), /No local branch named missing-branch/)
    await service.switchBranch(repo, 'main')
  })

  await test('path validation rejects absolute and escaping paths', async () => {
    assert.equal(normalizeFileArgument('src/index.js'), 'src/index.js')
    assert.equal(normalizeFileArgument('.\\src\\index.js'), 'src/index.js')
    assert.throws(() => normalizeFileArgument('../outside.txt'), /inside the repository/)
    assert.throws(() => normalizeFileArgument(path.join(workspace, 'absolute.txt')), /relative/)
  })

  await test('allowRoots fences a repository outside the listed directories', async () => {
    const other = initRepo(path.join(workspace, 'other'))
    const fenced = createGitService({ allowRoots: [path.join(workspace, 'repo')] })
    await assert.rejects(() => fenced.status(other), /outside allowRoots/)
    assert.equal((await createGitService({ allowRoots: [workspace] }).status(other)).branch, 'main')
  })

  await test('the HTTP handler answers success and failure envelopes', async () => {
    const okResponse = await service.handle(
      new Request('http://127.0.0.1/api/git-ui', {
        method: 'POST',
        body: JSON.stringify({ action: 'status', repo }),
      }),
    )
    assert.equal(okResponse.status, 200)
    const okBody = await okResponse.json()
    assert.equal(okBody.ok, true)
    assert.equal(okBody.value.branch, 'main')

    const badJson = await service.handle(
      new Request('http://127.0.0.1/api/git-ui', { method: 'POST', body: '{not json' }),
    )
    assert.equal(badJson.status, 400)

    const badAction = await service.handle(
      new Request('http://127.0.0.1/api/git-ui', { method: 'POST', body: JSON.stringify({ action: 'nope' }) }),
    )
    const badActionBody = await badAction.json()
    assert.equal(badActionBody.ok, false)
    assert.equal(badActionBody.error.code, 'unknown_action')

    const notRepo = await service.handle(
      new Request('http://127.0.0.1/api/git-ui', {
        method: 'POST',
        body: JSON.stringify({ action: 'status', repo: path.join(workspace, 'plain') }),
      }),
    )
    const notRepoBody = await notRepo.json()
    assert.equal(notRepoBody.ok, false)
    assert.equal(notRepoBody.error.code, 'not_a_repository')
  })

  await test('an unborn repository stages, unstages, and commits', async () => {
    const unbornRepo = path.join(workspace, 'unborn')
    mkdirSync(unbornRepo, { recursive: true })
    git(unbornRepo, ['init', '--initial-branch=main'])
    git(unbornRepo, ['config', 'user.email', 'test@example.com'])
    git(unbornRepo, ['config', 'user.name', 'Test User'])
    writeFileSync(path.join(unbornRepo, 'first.txt'), 'first\n')

    const unbornStatus = await service.status(unbornRepo)
    assert.equal(unbornStatus.unborn, true)
    assert.equal(unbornStatus.branch, 'main')
    assert.equal((await service.log(unbornRepo, 5)).commits.length, 0)

    await service.stage(unbornRepo, ['first.txt'])
    await service.unstage(unbornRepo, ['first.txt'])
    const afterUnstage = await service.status(unbornRepo)
    assert.equal(afterUnstage.files[0].untracked, true)

    await service.stageAll(unbornRepo)
    const committed = await service.commit(unbornRepo, 'first commit')
    assert.equal(committed.status.unborn, false)
    assert.equal((await service.log(unbornRepo, 5)).commits.length, 1)
  })
} finally {
  rmSync(workspace, { recursive: true, force: true })
}

console.log(`\n${passed} passed, ${failures.length} failed`)
if (failures.length > 0) process.exitCode = 1
