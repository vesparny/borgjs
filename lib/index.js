const dateFormat = require('dateformat')

function run (config, archiveName) {
  if (!config) {
    return Promise.reject(
      new Error('A valid configuration object must be passed in.')
    )
  }

  if (config.env) {
    for (let key in config.env) {
      process.env[key] = config.env[key]
    }
  }
  config.archiveName = archiveName ||
    dateFormat(new Date(), 'yyyy-mm-dd-HHMMss')
  const commands = require('./commands')(config)

  return commands
    .create()
    .then(commands.check)
    .then(commands.prune)
    .then(() => {
      return new Promise(resolve => {
        if (config.onFinish && typeof config.onFinish === 'function') {
          config.onFinish(resolve)
          return
        }
        resolve()
      })
    })
    .catch(err => {
      return new Promise((resolve, reject) => {
        if (config.onFinish && typeof config.onFinish === 'function') {
          config.onFinish(reject.bind(null, err))
          return
        }
        reject(err)
      })
    })
}

module.exports = run
