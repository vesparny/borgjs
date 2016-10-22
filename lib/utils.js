const chalk = require('chalk')

function log (...args) {
  console.log(...args)
  console.log(`${chalk.blue('===============================')}`)
}

module.exports = {
  log
}
