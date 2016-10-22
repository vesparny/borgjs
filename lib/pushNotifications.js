const PushBullet = require('pushbullet')
const parallel = require('run-parallel')
const chalk = require('chalk')

module.exports = function setupPushNotification (config) {
  return function sendPushNotification ({subject, body}, cb) {
    var pusher = new PushBullet(config.accessToken)
    pusher.devices({active: true}, (err, res) => {
      if (err) {
        console.log(chalk.red('error while retrieving devices for push notification'), err)
      }
      const notifications = res.devices.map((el) => {
        return function (cb) {
          pusher.note(el.iden, subject, body, (err, res) => {
            if (err) {
              console.log(chalk.red('error while sending push notification'), err)
            } else {
              console.log(chalk.yellow(`push notification sent to ${el.nickname}`))
            }
            cb()
          })
        }
      })
      parallel(notifications, cb)
    })
  }
}
