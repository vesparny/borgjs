const notifier = require('node-notifier')

module.exports = function sendNativeNotification ({subject}, cb) {
  notifier.notify({
    title: 'borgjs',
    'subtitle': subject,
    message: `NOPE`,
    sound: true
  })
  cb()
}
