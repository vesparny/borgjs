const execa = require('execa')
const fs = require('fs-extra')
const chalk = require('chalk')

module.exports = function setupCommands (config) {
  function runCommandAndWriteToFile (cmd, name) {
    console.log(chalk.yellow(`Executing command: borg ${chalk.bold(name)}`))
    config.logStream.write(`\n\n## ${name} ##\n\n`)
    cmd.stderr.pipe(config.logStream, {end: false})
    return cmd
  }

  function create () {
    if (!config.repository) {
      return Promise.reject('the "repository" option must be specified in the config file')
    }
    if (!config.paths || config.paths.length === 0) {
      return Promise.reject('the "paths" option must be specified in the config file, and must contain at least one valid path')
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
        ...config.paths.filter(fs.existsSync)
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
