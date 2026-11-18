/**
 * Static checks for the Git panel bundle: manifest fields, exported display
 * resources, locale parity, the patch row, and the Client module's shape.
 *
 * Usage: node test/check-bundle.mjs
 */

import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
let passed = 0
const failures = []

/**
 * Run one assertion group and record its outcome.
 * @param label - test name.
 * @param body - test body.
 */
async function test(label, body) {
  try {
    await body()
    passed += 1
    console.log(`PASS ${label}`)
  } catch (error) {
    failures.push({ label, error })
    console.error(`FAIL ${label}\n  ${error && error.message ? error.message : error}`)
  }
}

const manifest = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))

await test('manifest declares a publishable ES module bundle', () => {
  assert.equal(manifest.private, undefined)
  assert.equal(manifest.type, 'module')
  assert.equal(manifest.name, 'dsh-git-panel')
  assert.equal(manifest.dsh.bundle.patch, './cordis.patch.yml')
  assert.equal(typeof manifest.license, 'string')
  assert.match(manifest.repository.url, /github\.com\/zgldh\/dsh-git-panel/)
})

await test('manifest declares the DSH compatibility range the market reads', () => {
  assert.equal(typeof manifest.engines.dsh, 'string')
  assert.ok(manifest.engines.dsh.trim().length > 0)
})

await test('manifest declares the Web Client half', () => {
  const client = manifest.dsh.client
  assert.equal(client.platform, 'web')
  assert.equal(client.immediately, true)
  assert.ok(Array.isArray(client.inject))
})

await test('every exported entry point exists on disk', () => {
  for (const [subpath, target] of Object.entries(manifest.exports)) {
    if (subpath.includes('*')) continue
    assert.ok(existsSync(path.join(root, target)), `missing export target for ${subpath}: ${target}`)
  }
  assert.ok(existsSync(path.join(root, 'client.js')), 'missing client.js')
  assert.ok(existsSync(path.join(root, 'index.js')), 'missing index.js')
  assert.ok(existsSync(path.join(root, 'icon.svg')), 'missing icon.svg')
})

await test('the icon is a bounded SVG inside the package', () => {
  const icon = readFileSync(path.join(root, 'icon.svg'))
  assert.ok(icon.byteLength <= 256 * 1024)
  assert.match(icon.toString('utf8', 0, 200), /<svg/)
})

await test('both locale files carry meta title and description', () => {
  for (const locale of ['en', 'zh']) {
    const file = path.join(root, 'locale', `${locale}.json`)
    const parsed = JSON.parse(readFileSync(file, 'utf8'))
    assert.equal(typeof parsed.meta.title, 'string')
    assert.ok(parsed.meta.title.length > 0)
    assert.equal(typeof parsed.meta.description, 'string')
    assert.ok(parsed.meta.description.length > 0)
  }
})

await test('the patch inserts exactly one row naming this package', () => {
  const patch = readFileSync(path.join(root, 'cordis.patch.yml'), 'utf8')
  assert.match(patch, /insert:/)
  assert.match(patch, /id: git-panel/)
  assert.match(patch, /name: 'dsh-git-panel'/)
})

await test('the Client module parses as a plain script', () => {
  execFileSync(process.execPath, ['--check', path.join(root, 'client.js')], { stdio: 'pipe' })
})

await test('the Client module has no ESM syntax and requires only react', () => {
  const source = readFileSync(path.join(root, 'client.js'), 'utf8')
  assert.doesNotMatch(source, /^\s*import\s/m)
  assert.doesNotMatch(source, /^\s*export\s/m)
  const requires = [...source.matchAll(/require\(\s*['"]([^'"]+)['"]\s*\)/g)].map((match) => match[1])
  console.log(`  requires: ${[...new Set(requires)].join(', ')}`)
  for (const request of requires) assert.equal(request, 'react', `unexpected require: ${request}`)
  assert.match(source, /__ModuleLoader__\.load\(/)
  assert.match(source, /inject: \['slots', 'locale'\]|inject: \["slots", "locale"\]/)
})

await test('the Client module registers the Session Git view only', () => {
  const source = readFileSync(path.join(root, 'client.js'), 'utf8')
  assert.match(source, /conversation\.view/)
  assert.match(source, /id: 'git'|id: "git"/)
  assert.match(source, /order: 20/)
  assert.match(source, /git\.view/)
  assert.doesNotMatch(source, /sidebar\.panellist/, 'the Git view must not register a sidebar panel icon')
  assert.doesNotMatch(source, /name: 'main',\s*\n?\s*key:/, 'the Git view must not register a main panel')
  assert.match(source, /api\/git-ui/)
})

await test('the Host module parses and exports the loader contract', async () => {
  execFileSync(process.execPath, ['--check', path.join(root, 'index.js')], { stdio: 'pipe' })
  const host = await import(pathToFileURL(path.join(root, 'index.js')).href)
  assert.equal(typeof host.apply, 'function')
  assert.equal(host.name, 'git-panel')
  assert.deepEqual(host.inject, ['connection'])
  const hostSource = readFileSync(path.join(root, 'index.js'), 'utf8')
  assert.match(hostSource, /\/api\/git-ui/)
})

console.log(`\n${passed} passed, ${failures.length} failed`)
if (failures.length > 0) process.exitCode = 1
