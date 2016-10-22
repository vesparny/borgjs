const notifier = require('node-notifier')

module.exports = function sendNativeNotification ({subject, logFilePath}, cb) {
  notifier.notify({
    title: 'borgjs',
    'subtitle': subject,
    message: `Log: ${logFilePath}`,
    sound: true
  })
  cb()
}
