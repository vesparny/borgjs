const meow = require('meow')
const updateNotifier = require('update-notifier')
const fs = require('fs-extra')
const semver = require('semver')
const path = require('path')
const chalk = require('chalk')
const exitHook = require('exit-hook')
const xdgBaseDir = require('xdg-basedir')

const lockFile = require('./lockfile')
const pkg = require('../package.json')
const run = require('./')

updateNotifier({pkg}).notify()

const cli = meow({
  help: `

        Usage
          borgjs <options>

        Options
          -c, --config          Absolute path of the borgjs config file.

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

fs.ensureDirSync(path.join(xdgBaseDir.config, 'borgjs'))

if (!cli.flags.config) {
  console.log(chalk.red('A valid configuration file must be passed'))
  console.log(chalk.yellow('$ borgjs --config=/pour/to/your/borgjs.config.js'))
  console.log(chalk.green(`See ${chalk.bold('https://github.com/vesparny/borgjs#configuration')} for config options`))
  process.exit(1)
}

const lockFilePath = path.join(xdgBaseDir.config, 'borgjs/borgjs.lock')
lockFile.lock(lockFilePath, (err) => {
  if (err) {
    console.log(chalk.red(`unable to acquire the file lock`), err)
    console.log(chalk.cyan(`
      there is probably another borgjs runnign process.
      If you are sure there is not, you might want to manually remove the lock by deleting the file:
      ${chalk.bold(lockFilePath)}
    `))
    process.exit(1)
  }
  if (!semver.satisfies(process.version, '>=4')) {
    console.log(chalk.red('Your node version must be >=4'))
    process.exit(1)
  }
  if (!fs.existsSync(path.resolve(process.cwd(), cli.flags.config))) {
    console.log(chalk.red('the provided config file does not exist'))
    process.exit(1)
  }
  run(require(path.resolve(process.cwd(), cli.flags.config)))
  .catch((err) => {
    console.log(chalk.red('an error has occurred: ', err))
    process.exit(1)
  })
})

exitHook(() => {
  lockFile.unlock(lockFilePath, (err) => {
    console.log(chalk.red(`unable to remove the file lock`), err)
  })
})
