const request = require('request')
const parallel = require('run-parallel')
const chalk = require('chalk')

const baseUri = 'https://api.pushbullet.com/v2'

module.exports = function (config) {
  return function sendPushNotification ({subject, message}, cb) {
    getDevices((err, res, body) => {
      if (err || res.statusCode !== 200) {
        console.log(chalk.red('Error while retrieving devices for push notification.'), err)
        return cb()
      }
      const notifications = JSON.parse(body)
        .devices
        .filter((d) => d.active)
        .map((el) => {
          return function (cb) {
            sendPush({type: 'note', device_iden: el.iden, title: subject, body: message}, (err, res, body) => {
              if (err || res.statusCode !== 200) {
                console.log(chalk.red('Error while sending push notification.'), err)
              } else {
                console.log(chalk.yellow(`Push notification sent to ${el.nickname}.`))
              }
              cb()
            })
          }
        })
      parallel(notifications, cb)
    })
  }

  function doRequest ({method, uri, data}, cb) {
    request({
      method: method,
      uri: baseUri + uri,
      formData: data,
      headers: {
        'Access-Token': config.accessToken
      }
    }, cb)
  }

  function getDevices (cb) {
    doRequest({
      method: 'GET',
      uri: '/devices'
    }, cb)
  }

  function sendPush (data, cb) {
    doRequest({
      method: 'POST',
      uri: '/pushes',
      data: data
    }, cb)
  }
}
