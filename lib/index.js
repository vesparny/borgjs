const chalk = require('chalk')
const moment = require('moment')
const fs = require('fs-extra')
const parallel = require('run-parallel')
const path = require('path')
const xdgBaseDir = require('xdg-basedir')

const utils = require('./utils')

function run (config) {
  if (!config) {
    return Promise.reject(new Error('a valid configuration object must be passed in'))
  }
  const nativeNotifications = require('./nativeNotifications')
  const archiveName = moment().format('YYYY-MM-DD-HH-mm-ss')

  if (config.passphrase) {
    process.env.BORG_PASSPHRASE = config.passphrase
  }
  const logsPath = path.resolve(config.logsDir || path.join(xdgBaseDir.config, '/borgjs/logs'))
  fs.ensureDirSync(logsPath)
  config.logFilePath = path.resolve(logsPath, `borg-${archiveName}.log`)
  config.archiveName = archiveName

  const commands = require('./commands')(config)
  const mailer = require('./mailer')(config.email)
  const pushNotifications = require('./pushNotifications')(config.pushbullet)

  return commands
    .create()
    .then(commands.check)
    .then(commands.prune)
    .then(() => {
      const subject = '👌   [borgjs] backup succesfully executed'
      utils.writeToConsole(chalk.green(subject))
      return new Promise(resolve => {
        const notifications = [(cb) => cb()]
        const message = {
          subject,
          body: `
             <b>A backup has been executed</b>
             <p>A log file has been stored to: ${config.logFilePath}</p>
           `
        }
        config.sendSuccessMail && notifications.push((cb) => mailer.sendEmailMessage(message, cb))
        config.pushbullet && notifications.push((cb) => pushNotifications.sendPushNotification(message, cb))
        config.sendSystemNotification && notifications.push((cb) => nativeNotifications({subject, logFilePath: config.logFilePath}, cb))
        parallel(notifications, resolve)
      })
    })
    .catch(err => {
      const subject = '💣   [borgjs] error while executing backup'
      return new Promise((resolve, reject) => {
        const notifications = [(cb) => cb()]
        const message = {
          subject,
          body: `
             <b>An error has occurred</b>
             <p>A log file has been stored to: ${config.logFilePath}</p>
             <p>Command executed: ${err.cmd}</p>
           `
        }
        config.sendErrorMail && notifications.push((cb) => mailer.sendEmailMessage(message, cb))
        config.pushbullet && notifications.push((cb) => pushNotifications.sendPushNotification(message, cb))
        config.sendSystemNotification && notifications.push((cb) => nativeNotifications({subject, logFilePath: config.logFilePath}, cb))
        parallel(notifications, () => {
          utils.writeToLogFile(config.logFilePath, err.message).then(reject.bind(null, err))
        })
      })
    })
}

module.exports = run
