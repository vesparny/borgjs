const execa = require('execa')
const fs = require('fs')
const chalk = require('chalk')
const utils = require('./utils')

module.exports = function setupCommands (config) {
  function runCommandAndWriteToFile (cmd, name) {
    utils.log(chalk.yellow(`Executing command: borg ${chalk.bold(name)}`))
    cmd.stderr.pipe(process.stdout)
    return cmd.then((res) => {
      const msg = `Command run:\n${res.cmd}`
      utils.log(chalk.magenta(msg))
    })
  }

  function create () {
    if (!config.paths || config.paths.length === 0) {
      return Promise.reject(new Error('The "paths" option must be specified in the config file, and must contain at least one valid path'))
    }
    const paths = config.paths.filter(fs.existsSync)
    if (!paths || paths.length === 0) {
      return Promise.reject(Error('No valid paths found in the "paths" option'))
    }
    if (!config.repository) {
      return Promise.reject(new Error('The "repository" option must be specified in the config file'))
    }

    const exclude = config.exclude
    ? config.exclude.reduce((pre, cur) => {
      return pre.concat(['--exclude', cur])
    }, [])
    : []

    const compression = config.compression
      ? ['--compression', config.compression]
      : []
    return runCommandAndWriteToFile(execa(
        config.borgPath || 'borg',
        ['create',
        ...compression,
        '--stats', '-v', '--list', '--filter', 'AME?',
        '--checkpoint-interval', '120',
        `${config.repository}::${config.archivePrefix ? config.archivePrefix + '-' : ''}${config.archiveName}`,
        ...exclude,
        ...paths
        ]
      ), 'create')
  }

  function check () {
    if (!config.check) {
      return Promise.resolve()
    }
    return runCommandAndWriteToFile(execa(
        config.borgPath || 'borg',
        ['check', '-v', '--show-rc',
        config.repository]
      ), 'check')
  }

  function prune () {
    if (!config.prune) {
      return Promise.resolve()
    }

    const prefix = config.archivePrefix
    ? ['--prefix', config.prefix]
    : []
    const prune = config.prune
    ? Object.keys(config.prune).reduce((pre, cur) => {
      return pre.concat([cur.length > 1 ? '--' + cur : '-' + cur, config.prune[cur]])
    }, [])
    : []
    return runCommandAndWriteToFile(execa(
          config.borgPath || 'borg',
          ['prune',
           '-v', '--show-rc',
           config.repository,
           ...prefix,
           ...prune]
        ), 'prune')
  }

  return {
    check,
    prune,
    create
  }
}
