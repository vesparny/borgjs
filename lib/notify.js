const notifier = require('node-notifier')

module.exports = function notify (subtitle, logFilePath) {
  notifier.notify({
    title: 'Borg backup script',
    'subtitle': subtitle,
    message: `Log: ${logFilePath}`,
    sound: true
  })
}
