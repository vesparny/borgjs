module.exports = {
  repository: '',
  paths: [ // MANDATORY
    //  '/Users/me',
    //  '/etc
  ],
  create: {
    options: [
      '--compression', 'lz4',
      '--filter', 'AME?'
    ]
  },
   check: {
   options: []
   },

  // Retention policy for pruning old backups
  // Use the options array to pass any options supported by borg prune
  // https://borgbackup.readthedocs.org/en/stable/usage.html#borg-prune for details.
 //  prune: {
 //   options: [
 //    '-d', 30,
 //    '-w', 30,
 //    '--keep-within', '31d'
 //   ]
 // }

  // Set the following environment variables
  // See https://borgbackup.readthedocs.io/en/stable/usage.html#environment-variables
  env: {
    BORG_REMOTE_PATH: 'borg1',
    BORG_PASSPHRASE: 'passphrase'
  },

  // Email configuration
  // See https://github.com/nodemailer/nodemailer options
  //  email: {
  //    from: 'me@site.net',
  //    to: 'you@site.net',
  //    smtpHost: 'smtp.mailgun.org',
  //    smtpPort: 587,
  //    user: 'postmaster@lalala.mailgun.org',
  //    pass: 'mypass',
  //    secure: false
  //  },

  // Send an email on success (the 'email' section must be configured)

  // sendSuccessMail: true,

  // Send an email on error (the 'email' section must be configured)
  // sendErrorMail: true,

  // Send native Desktop notifications on success/error
  sendSystemNotification: true

  // Send push notifications on success/error to your devices connected to pushbullet
  // See https://www.pushbullet.com/
  // pushbullet: {
  //  accessToken: 'your pushbullet access token'
  // }
}
