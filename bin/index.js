#!/usr/bin/env node

const meow = require('meow')
const updateNotifier = require('update-notifier')
const fs = require('fs')
const semver = require('semver')
const path = require('path')
const chalk = require('chalk')
const osTmpdir = require('os-tmpdir')
const lockfile = require('proper-lockfile')
const filenamify = require('filenamify')

const pkg = require('../package.json')
const run = require('../lib')

const notifier = updateNotifier({ pkg })
if (notifier.update) {
  notifier.notify()
  console.log(
    `
    ############################################
    ############################################

    ${chalk.blue('An update is available.')}

    ${chalk.yellow('Run "npm i -g borgjs" to update.')}

    ############################################
    ############################################
  `
  )
}

const cli = meow(
  {
    help: `

        Usage
          $ borgjs <archive><options>

          Options
            -c, --config         config file path

          Examples
            # run borgjs
            $ borgjs -c=/User/me/borgjs.config.js

            #run borgjs specifying the archive name, and log output to a file
            $ borgjs $(date +%Y-%m-%d-%H%M%S) -c /path/to/your/borgjs.config.js >> $(date +%Y-%m-%d-%H%M%S).log
    `
  },
  {
    alias: {
      c: 'config',
      v: 'version'
    },
    default: {},
    string: ['config']
  }
)
if (!cli.flags.config) {
  console.log(chalk.red('A valid configuration file must be passed.'))
  console.log(chalk.yellow('$ borgjs -c /path/to/your/borgjs.config.js'))
  console.log(
    chalk.green(
      `See ${chalk.bold(
        'https://github.com/vesparny/borgjs#configuration'
      )} for config options.`
    )
  )
  process.exit(1)
}
if (!fs.existsSync(path.resolve(process.cwd(), cli.flags.config))) {
  console.log(chalk.red('The provided config file does not exist.'))
  process.exit(1)
}
const config = require(path.resolve(process.cwd(), cli.flags.config))
if (!config.repository) {
  console.log(
    chalk.red('The "repository" option must be specified in the config file')
  )
  process.exit(1)
}
const fileLock = path.join(
  osTmpdir(),
  filenamify(config.repository, { replacement: '-' })
)
// ensure the dir exists, otherwise it's impossible to acquire the lock
if (!fs.existsSync(fileLock)) {
  fs.mkdirSync(fileLock)
}
if (fs.existsSync(`${fileLock}.lock`)) {
  if (lockfile.checkSync(fileLock)) {
    console.log(
      chalk.cyan(
        `
      lockfile detected.
      There is probably another borgjs runnign process.

      ${chalk.yellow(fileLock + '.lock')}
    `
      )
    )
    process.exit(1)
  }
}
lockfile.lock(fileLock, err => {
  if (err) {
    console.log(chalk.red(err.message))
    console.log(
      chalk.cyan(
        `
      There is probably another borgjs runnign process.
      You should either wait for it to finish or remove the following lock file.

      ${chalk.yellow(fileLock + '.lock')}
    `
      )
    )
    process.exit(1)
  }
  if (!semver.satisfies(process.version, '>=6')) {
    console.log(chalk.red('Your node version must be >=6.'))
    process.exit(1)
  }

  run(config, cli.input[0])
    .then(() => {
      console.log(chalk.green('Backup succesfully executed.'))
      process.exit(0)
    })
    .catch(err => {
      console.log(chalk.red('An error has occurred: ', err))
      process.exit(1)
    })
})
