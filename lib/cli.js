const meow = require('meow')
const updateNotifier = require('update-notifier')
const fs = require('fs-extra')
const os = require('os')
const semver = require('semver')
const path = require('path')
const chalk = require('chalk')
const exitHook = require('exit-hook')
const lockFile = require('./lockfile')

const pkg = require('../package.json')
const run = require('./')

updateNotifier({pkg}).notify()

const cli = meow({
  help: `
        Usage
          $ borgjs <options>
          -c, --config          Absolute path of the borgjs config file.
        Examples
          $ borgjs --config=/User/me/.borgjs.config.js    # Run backup using a different config file.
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
  console.log(chalk.yellow('$ borgjs --config=/Your/borg.conf.js'))
  console.log(chalk.green(`See ${chalk.bold('https://github.com/vesparny/borgjs#configuration')} for config options`))
  process.exit(1)
}
lockFile.lock(path.join(os.homedir(), '/.borgjs/borgjs.lock'), (err) => {
  if (err) {
    console.log(chalk.red(`Unable to acquire the file lock`), err)
    process.exit(1)
  }
  if (!semver.satisfies(process.version, '>=4.0.0')) {
    console.log(chalk.red('Your node version must be >=4.0.0'))
    process.exit(1)
  }
  if (!fs.existsSync(path.resolve(process.cwd(), cli.flags.config))) {
    console.log(chalk.red('The provided config file does not exist'))
    process.exit(1)
  }
  run(require(path.resolve(process.cwd(), cli.flags.config)))
  .catch((err) => {
    console.log(chalk.red('An error has occurred: ', err))
    process.exit(1)
  })
})

exitHook(() => {
  lockFile.unlock(path.join(os.homedir(), '/.borgjs/borgjs.lock'), (err) => {
    console.log(chalk.red(`Unable to remove the file lock`), err)
  })
})
