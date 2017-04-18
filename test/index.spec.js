const test = require('tape')
const m = require('../lib/index')

test('library laods correctly', t => {
  t.ok(typeof m === 'function', 'the main module should export a function')
  m().catch(err => {
    t.ok(typeof err !== 'undefined', 'a valid config object must be passed in')
    t.end()
  })
})
