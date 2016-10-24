const notifier = require('node-notifier')

module.exports = function sendNativeNotification ({subject, message}, cb) {
  notifier.notify({
    title: 'borgjs',
    'subtitle': subject,
    message: message,
    sound: true
  })
  cb()
}
