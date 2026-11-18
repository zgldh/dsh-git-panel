#!/usr/bin/env node
/**
 * Generate the plugin-market index (`index.json`) for this bundle.
 *
 * The index is format 1 of `@deepseek-ai/dsh-plugin-market-index`: the single
 * JSON file DSH's Discover tab reads. This repository lists itself as one Git
 * source pinned to the commit that last changed the package, so installing the
 * listed version installs exactly the code this README documents.
 *
 * Usage:
 *   node scripts/build-index.mjs           # write index.json
 *   node scripts/build-index.mjs --check   # fail when index.json is stale
 *
 * The validator is optional locally: set DSH_PLUGIN_MARKET_INDEX to a path or
 * module name, or install `@deepseek-ai/dsh-plugin-market-index`. CI installs
 * it before running this script.
 */

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const checkOnly = process.argv.includes('--check')
const indexPath = path.join(root, 'index.json')
const indexUrl = 'https://raw.githubusercontent.com/zgldh/dsh-git-panel/main/index.json'

/**
 * Run one Git command in the repository.
 * @param {string[]} args - Git arguments.
 * @returns {string} trimmed stdout.
 */
function git(args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
}

/**
 * Read one locale file.
 * @param {'en'|'zh'} locale - locale id.
 * @returns {{ meta: { title: string, description: string } }} parsed metadata.
 */
function readLocale(locale) {
  return JSON.parse(readFileSync(path.join(root, 'locale', `${locale}.json`), 'utf8'))
}

const manifest = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
const english = readLocale('en')
const chinese = readLocale('zh')
const repositoryUrl = manifest.repository.url.replace(/^git\+/, '').replace(/\.git$/, '')
const version = manifest.version
const enginesDsh = manifest.engines && manifest.engines.dsh
if (typeof enginesDsh !== 'string' || enginesDsh.trim().length === 0) {
  throw new Error('package.json must declare engines.dsh; the market refuses versions without it')
}

// The listed version is the commit that last changed the package payload, so a
// later index-only commit does not change what the index tells clients to install.
const commit = git(['log', '-1', '--format=%H', '--', 'package.json', 'index.js', 'client.js', 'cordis.patch.yml', 'icon.svg', 'locale'])
if (commit === '') throw new Error('no commit touches the package payload yet; commit the bundle first')
const publishTimestamp = Number(git(['show', '-s', '--format=%ct', commit]))
if (!Number.isInteger(publishTimestamp)) throw new Error(`unreadable committer time for ${commit}`)

const index = {
  format: 1,
  title: { en: 'DSH Git Panel', zh: 'Git 面板' },
  description: {
    en: 'VSCode-style Git view for every DeepSeek Harness Session: source control, commit graph, and AI prompts for merge and review.',
    zh: 'DeepSeek Harness 每个会话可用的 VSCode 风格 Git 视图：源码管理、提交图，以及合并/评审用的 AI prompt。',
  },
  metadata: {
    categories: {
      'developer-tools': {
        title: { en: 'Developer tools', zh: '开发工具' },
      },
    },
  },
  plugins: [
    {
      name: manifest.name,
      title: { en: english.meta.title, zh: chinese.meta.title },
      description: { en: english.meta.description, zh: chinese.meta.description },
      icon: 'icon.svg',
      author: manifest.author && typeof manifest.author.name === 'string' ? manifest.author.name : 'zgldh',
      homepage: manifest.homepage,
      repository: { url: repositoryUrl },
      metadata: {
        category: 'developer-tools',
        keywords: Array.isArray(manifest.keywords) ? manifest.keywords : [],
      },
      'dist-tags': { latest: version },
      versions: [
        {
          version,
          publishTimestamp,
          source: { type: 'git', url: repositoryUrl, commit },
          engines: { dsh: enginesDsh },
        },
      ],
    },
  ],
}

/**
 * Load the market-index validator when this machine has it installed.
 * @returns {Promise<{ parseMarketIndex: Function } | null>} the validator module, or null.
 */
async function loadValidator() {
  const candidates = []
  if (process.env.DSH_PLUGIN_MARKET_INDEX) candidates.push(process.env.DSH_PLUGIN_MARKET_INDEX)
  candidates.push('@deepseek-ai/dsh-plugin-market-index')
  for (const candidate of candidates) {
    const specifier = candidate.startsWith('.') || path.isAbsolute(candidate) ? pathToFileURL(path.resolve(root, candidate)).href : candidate
    try {
      return await import(specifier)
    } catch {
      // Try the next candidate; validation is optional outside CI.
    }
  }
  return null
}

const validator = await loadValidator()
if (validator !== null) {
  validator.parseMarketIndex(index, indexUrl)
  console.log(`validated index for ${manifest.name}@${version} at ${commit}`)
} else {
  console.warn('market-index validator not installed; skipping validation (CI installs it)')
}

const serialized = `${JSON.stringify(index, null, 2)}\n`
if (checkOnly) {
  const current = existsSync(indexPath) ? readFileSync(indexPath, 'utf8') : ''
  if (current !== serialized) {
    console.error('index.json is stale; run `node scripts/build-index.mjs` and commit the result')
    process.exitCode = 1
  } else {
    console.log('index.json is up to date')
  }
} else {
  writeFileSync(indexPath, serialized)
  console.log(`wrote ${path.relative(root, indexPath)}`)
}
