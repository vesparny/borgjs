import chalk = require('chalk')

function log (message, ...rest) {
  console.log(message, ...rest)
  console.log(`${chalk.blue('===============================')}`)
}

export {
  log
}
