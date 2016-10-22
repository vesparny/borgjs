const chalk = require('chalk')
const moment = require('moment')
const parallel = require('run-parallel')

const utils = require('./utils')

function run (config) {
  if (!config) {
    return Promise.reject(new Error('a valid configuration object must be passed in'))
  }
  const sendNativeNotification = require('./nativeNotifications')
  const archiveName = moment().format('YYYY-MM-DD-HH-mm-ss')

  if (config.passphrase) {
    process.env.BORG_PASSPHRASE = config.passphrase
  }
  config.archiveName = archiveName
  const commands = require('./commands')(config)
  const sendMailNotification = require('./mailer')(config.email)
  const sendPushNotifications = require('./pushNotifications')(config.pushbullet)

  return commands
    .create()
    .then(commands.check)
    .then(commands.prune)
    .then(() => {
      const subject = '👌   [borgjs] backup succesfully executed'
      utils.log(chalk.green(subject))
      return new Promise(resolve => {
        const notifications = [(cb) => cb()]
        const message = {
          subject,
          body: `
             <b>A backup has been executed</b>
           `
        }
        config.sendSuccessMail && notifications.push((cb) => sendMailNotification(message, cb))
        config.pushbullet && notifications.push((cb) => sendPushNotifications(message, cb))
        config.sendSystemNotification && notifications.push((cb) => sendNativeNotification({subject}, cb))
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
           `
        }
        config.sendErrorMail && notifications.push((cb) => sendMailNotification(message, cb))
        config.pushbullet && notifications.push((cb) => sendPushNotifications(message, cb))
        config.sendSystemNotification && notifications.push((cb) => sendNativeNotification({subject}, cb))
        parallel(notifications, () => {
          utils.log(err.message).then(reject.bind(null, err))
        })
      })
    })
}

module.exports = run
