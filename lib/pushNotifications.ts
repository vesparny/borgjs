import request = require('request')
import parallel = require('run-parallel')
import chalk = require('chalk')

const baseUri = 'https://api.pushbullet.com/v2'

export default function (config) {

    interface DoRequest {
    method: string,
    uri: string,
    data?: any
  }

  function doRequest (options: DoRequest, cb) {
    request({
      method: options.method,
      uri: baseUri + options.uri,
      formData: options.data,
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
}
