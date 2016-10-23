const meow = require('meow')
const updateNotifier = require('update-notifier')
const fs = require('fs')
const semver = require('semver')
const path = require('path')
const chalk = require('chalk')
const exitHook = require('exit-hook')
const osTmpdir = require('os-tmpdir')
const lockfile = require('proper-lockfile')
const filenamify = require('filenamify')

const pkg = require('../package.json')
const run = require('./')

updateNotifier({pkg}).notify()

const cli = meow({
  help: `

        Usage
          borgjs <options>

        Options
          -c, --config         path of a borgjs config file.

        Examples
          borgjs --config=/User/me/borgjs.config.js
    `},
  {
    alias: {
      c: 'config',
      v: 'version'
    },
    default: {},
    string: [
      'config'
    ]
  })

if (!cli.flags.config) {
  console.log(chalk.red('A valid configuration file must be passed'))
  console.log(chalk.yellow('$ borgjs --config=/pour/to/your/borgjs.config.js'))
  console.log(chalk.green(`See ${chalk.bold('https://github.com/vesparny/borgjs#configuration')} for config options`))
  process.exit(1)
}
const config = require(path.resolve(process.cwd(), cli.flags.config))
if (!config.repository) {
  console.log(chalk.red('The "repository" option must be specified in the config file'))
  process.exit(1)
}
const fileLock = path.join(osTmpdir(), filenamify(config.repository, {replacement: '-'}))
if (!fs.existsSync(fileLock)) {
  fs.mkdirSync(fileLock)
}
lockfile.lock(fileLock, (err) => {
  if (err) {
    console.log(chalk.red(err.message))
    console.log(chalk.cyan(`
      There is probably another borgjs runnign process.
      You should either wait for it to finish or remove the following lock file

      ${chalk.yellow(fileLock + '.lock')}
    `))
    process.exit(1)
  }
  if (!semver.satisfies(process.version, '>=4')) {
    console.log(chalk.red('Your node version must be >=4'))
    process.exit(1)
  }
  if (!fs.existsSync(path.resolve(process.cwd(), cli.flags.config))) {
    console.log(chalk.red('The provided config file does not exist'))
    process.exit(1)
  }
  run(config)
  .catch((err) => {
    console.log(chalk.red('An error has occurred: ', err))
    process.exit(1)
  })
})

exitHook(() => {
  fs.rmdirSync(fileLock)
  lockfile.unlock(fileLock, (err) => {
    console.log(chalk.red(`Unable to remove the file lock`), err)
  })
})
