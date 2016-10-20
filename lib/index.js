const chalk = require('chalk')
const moment = require('moment')
const fs = require('fs-extra')
const path = require('path')
const os = require('os')

function run (config) {
  const notify = require('./notify')
  const archiveName = moment().format('YYYY-MM-DD-HH-mm-ss')

  if (config.passphrase) {
    process.env.BORG_PASSPHRASE = config.passphrase
  }
  const logsPath = path.resolve(config.logsDir || path.join(os.homedir() + '/.borgjs/logs'))
  fs.ensureDirSync(logsPath)
  const logFilePath = path.resolve(logsPath, `borg-${archiveName}.log`)
  config.logStream = fs.createWriteStream(logFilePath, {flags: 'a'})
  config.archiveName = archiveName

  const commands = require('./commands')(config)
  const mailer = require('./mailer')(config.email)

  return commands
    .create()
    .then(commands.check)
    .then(commands.prune)
    .then(() => {
      const msg = '👌   [Borgjs] backup succesfully executed'
      config.sendSystemNotification && notify(msg, logFilePath)
      console.log(chalk.green(msg))
      return new Promise(resolve => {
        if (config.sendSuccessMail) {
          mailer.sendMessage({
            subject: msg,
            body: `
               <b>A backup has been executed</b>
               <p>A log file has been stored to: ${logFilePath}</p>
             `
          }, () => {
            resolve()
          })
        } else {
          resolve()
        }
      })
    })
    .catch(err => {
      config.sendSystemNotification && notify('💣 An Error has occurred', logFilePath)
      return new Promise((resolve, reject) => {
        if (config.sendErrorMail) {
          mailer.sendMessage({
            subject: '💣   [Borgjs] error while executing backup',
            body: `
               <b>An error has occurred</b>
               <p>A log file has been stored to: ${logFilePath}</p>
               <p>Command executed: ${err.cmd}</p>
             `
          }, () => {
            reject(err)
          })
        } else {
          reject(err)
        }
      })
    })
}

module.exports = run
