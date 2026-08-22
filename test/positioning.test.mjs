import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import test from 'node:test'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

function loadPositioningHelpers() {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..')
  const source = readFileSync(join(root, 'lib', 'client.js'), 'utf8')
  let definition = null
  const sandbox = {
    __DSH_MODEL_QUOTA_TEST__: true,
    console,
    window: {
      innerWidth: 1280,
      innerHeight: 800,
      __ModuleLoader__: { load(value) { definition = value } },
    },
  }
  sandbox.globalThis = sandbox
  vm.createContext(sandbox)
  vm.runInContext(source, sandbox, { filename: 'lib/client.js' })
  assert.ok(definition, 'client module definition was not registered')

  const noop = () => undefined
  const React = {
    createElement: noop,
    Fragment: Symbol('Fragment'),
    useState: noop,
    useEffect: noop,
    useMemo: noop,
    useCallback: noop,
    useRef: noop,
  }
  const exports = definition.factory(id => {
    if (id === 'react') return React
    if (id === '@deepseek-ai/dsh-client-ui-primitives') return { Tooltip: noop }
    throw new Error(`Unexpected client dependency: ${id}`)
  })
  assert.ok(exports.__test, 'test helpers were not exposed')
  return { helpers: exports.__test, sandbox }
}

test('a bottom-right panel keeps its right and bottom offsets across size changes', () => {
  const { helpers } = loadPositioningHelpers()
  const collapsed = { left: 950, right: 1262, top: 750, bottom: 792, width: 312, height: 42 }
  const position = helpers.anchorModelQuotaPosition(collapsed)

  assert.deepEqual({ ...position }, { anchorX: 'right', anchorY: 'bottom', x: 18, y: 8 })
  assert.deepEqual({ ...helpers.modelQuotaPositionStyle(position) }, {
    left: 'auto', right: '18px', top: 'auto', bottom: '8px',
  })

  const expandedNode = {
    getBoundingClientRect: () => ({ width: 360, height: 390 }),
  }
  const clamped = helpers.clampModelQuotaPosition(position, expandedNode)
  assert.equal(clamped.anchorX, 'right')
  assert.equal(clamped.anchorY, 'bottom')
  assert.equal(clamped.x, 18)
  assert.equal(clamped.y, 8)
})

test('legacy top-left coordinates remain readable and can migrate to edge anchors', () => {
  const { helpers } = loadPositioningHelpers()
  const legacyNode = { getBoundingClientRect: () => ({ width: 312, height: 42 }) }
  const legacy = helpers.clampModelQuotaPosition({ x: 950, y: 750 }, legacyNode)
  assert.equal(helpers.isAnchoredModelQuotaPosition(legacy), false)

  const migrated = helpers.anchorModelQuotaPosition({
    left: legacy.x,
    right: legacy.x + 312,
    top: legacy.y,
    bottom: legacy.y + 42,
    width: 312,
    height: 42,
  })
  assert.equal(migrated.anchorX, 'right')
  assert.equal(migrated.anchorY, 'bottom')
})
