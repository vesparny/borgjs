const nodemailer = require('nodemailer')
const chalk = require('chalk')

module.exports = function setupMailer (config) {
  function sendEmailMessage ({subject, body}, cb) {
    var transporter = nodemailer.createTransport({
      port: config.smtpPort,
      host: config.smtpHost,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass
      }
    })
    var mailOptions = {
      from: `"borgjs" <${config.from}>`,
      to: config.to,
      subject: subject,
      html: body
    }

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(chalk.red('error while sending the email'), err)
      }
      console.log(chalk.yellow('email report sent'))
      cb()
    })
  }
  return {
    sendEmailMessage
  }
}
