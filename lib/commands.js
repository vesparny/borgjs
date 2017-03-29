const execa = require('execa')
const fs = require('fs')
const chalk = require('chalk')
const utils = require('./utils')

module.exports = function setupCommands (config) {
  function runCommandAndWriteToFile (cmd, name) {
    utils.log(`${chalk.yellow('Executing command:')} borg ${name}`)
    cmd.stderr.pipe(process.stdout)
    return cmd.then(res => {
      const msg = `Command run:\n${res.cmd}`
      utils.log(chalk.magenta(msg))
    })
  }

  function create () {
    if (!config.paths || config.paths.length === 0) {
      return Promise.reject(
        new Error(
          'The "paths" option must be specified in the config file, and must contain at least one valid path.'
        )
      )
    }
    const paths = config.paths.filter(fs.existsSync)
    if (!paths || paths.length === 0) {
      return Promise.reject(
        Error('No valid paths found in the "paths" option.')
      )
    }
    if (!config.repository) {
      return Promise.reject(
        new Error(
          'The "repository" option must be specified in the config file.'
        )
      )
    }

    const exclude = config.exclude
      ? config.exclude.reduce(
          (pre, cur) => {
            return pre.concat(['--exclude', cur])
          },
          []
        )
      : []
    const options = config.create && config.create.options
      ? config.create.options
      : []
    return runCommandAndWriteToFile(
      execa(config.borgPath || 'borg', [
        'create',
        '--stats',
        '-v',
        '--list',
        ...options,
        ...exclude,
        `${config.repository}::${config.archivePrefix || ''}${config.archiveName}`,
        ...paths
      ]),
      'create'
    )
  }

  function check () {
    if (!config.check) {
      return Promise.resolve()
    }
    return runCommandAndWriteToFile(
      execa(config.borgPath || 'borg', [
        'check',
        '-v',
        '--show-rc',
        '--debug',
        ...(config.check.options || []),
        config.repository
      ]),
      'check'
    )
  }

  function prune () {
    if (!config.prune) {
      return Promise.resolve()
    }

    const prefix = config.archivePrefix
      ? ['--prefix', config.archivePrefix]
      : []
    return runCommandAndWriteToFile(
      execa(config.borgPath || 'borg', [
        'prune',
        config.repository,
        '-v',
        '--show-rc',
        '--list',
        ...prefix,
        ...(config.prune.options || [])
      ]),
      'prune'
    )
  }

  return {
    check,
    prune,
    create
  }
}
