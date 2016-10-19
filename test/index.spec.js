const test = require('tape')
const m = require('../lib/index')

test('library laods correctly', t => {
  t.ok(typeof m === 'function', 'the main module should export a function')
  t.throws(m, 'a config object must be passed in')
  t.end()
})
