import notifier = require('node-notifier')

export default function sendNativeNotification ({message}, cb) {
  notifier.notify({
    title: 'borgjs',
    message: message,
    sound: true
  })
  cb()
}
