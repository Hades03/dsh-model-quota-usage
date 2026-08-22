import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const patch = readFileSync(join(root, 'cordis.patch.yml'), 'utf8')
const readme = readFileSync(join(root, 'README.md'), 'utf8')

assert.equal(pkg.name, 'dsh-model-quota-usage')
assert.equal(pkg.version, '1.1.0')
assert.equal(pkg.license, 'MIT')
assert.equal(pkg.dsh?.client?.platform, 'web')
assert.equal(pkg.dsh?.bundle?.patch, './cordis.patch.yml')
assert.equal(pkg.repository?.url, 'git+https://github.com/Hades03/dsh-model-quota-usage.git')
assert.equal(pkg.homepage, 'https://github.com/Hades03/dsh-model-quota-usage#readme')
assert.deepEqual(pkg.dshhub?.permissions?.network, ['https://api.deepseek.com'])
assert.match(pkg.dshhub?.compatibility?.dsh ?? '', /^>=0\.1\.1-rc\.2$/)
assert.match(patch, /id:\s*model-quota-usage/)
assert.match(patch, /name:\s*dsh-model-quota-usage/)
assert.doesNotMatch(readme, /\[TODO[:\]]/i)

for (const file of readdirSync(join(root, 'lib')).filter(name => name.endsWith('.js'))) {
  const result = spawnSync(process.execPath, ['--check', join(root, 'lib', file)], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr || `${file} failed syntax validation`)
}

console.log('Release checks passed.')
