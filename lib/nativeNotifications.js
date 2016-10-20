const notifier = require('node-notifier')

module.exports = function notify ({subject, logFilePath}, cb) {
  notifier.notify({
    title: 'borgjs',
    'subtitle': subject,
    message: `Log: ${logFilePath}`,
    sound: true
  })
  cb()
}
