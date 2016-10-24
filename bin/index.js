#!/usr/bin/env node

try {
  require('../dist/cli')
} catch (e) {
  console.log('\nCompiled bin not available, falling back to require(\'../lib/cli.js\')\n')
  require('../lib/cli')
}
