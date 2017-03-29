const parallel = require('run-parallel')
const dateFormat = require('dateformat')

function run (config, archiveName) {
  if (!config) {
    return Promise.reject(
      new Error('A valid configuration object must be passed in.')
    )
  }
  const sendNativeNotification = require('./nativeNotifications')

  if (config.env) {
    for (let key in config.env) {
      process.env[key] = config.env[key]
    }
  }
  config.archiveName = archiveName ||
    dateFormat(new Date(), 'yyyy-mm-dd-HHMMss')
  const commands = require('./commands')(config)
  const sendMailNotification = require('./mailer')(config.email)
  const sendPushNotifications = require('./pushNotifications')(
    config.pushbullet
  )

  return commands
    .create()
    .then(commands.check)
    .then(commands.prune)
    .then(() => {
      return new Promise(resolve => {
        const notifications = [cb => cb()]
        const subject = '👌   [borgjs] backup succesfully executed'
        const message = `Archive ${config.archiveName} created.`
        const emailMessage = {
          subject,
          body: `
             <div>${message}</div>
           `
        }
        config.sendSuccessMail &&
          notifications.push(cb => sendMailNotification(emailMessage, cb))
        config.pushbullet &&
          notifications.push(cb =>
            sendPushNotifications({ subject, message }, cb))
        config.sendSystemNotification &&
          notifications.push(cb =>
            sendNativeNotification({ subject, message }, cb))
        parallel(notifications, resolve)
      })
    })
    .catch(err => {
      return new Promise((resolve, reject) => {
        const notifications = [cb => cb()]
        const subject = '💣   [borgjs] error while executing backup'
        const message = `Archive ${config.archiveName} failed. Check logs.`
        const emailMessage = {
          subject,
          body: `
            <div>${message}</div>
           `
        }
        config.sendErrorMail &&
          notifications.push(cb => sendMailNotification(emailMessage, cb))
        config.pushbullet &&
          notifications.push(cb =>
            sendPushNotifications({ subject, message }, cb))
        config.sendSystemNotification &&
          notifications.push(cb =>
            sendNativeNotification({ subject, message }, cb))
        parallel(notifications, reject.bind(null, err))
      })
    })
}

module.exports = run
