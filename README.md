# 📦 borgjs
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Travis](https://img.shields.io/travis/vesparny/borgjs.svg)](https://travis-ci.org/vesparny/borgjs)
[![npm](https://img.shields.io/npm/dm/borgjs.svg)](https://npm-stat.com/charts.html?package=borgjs&from=2016-10-17)
[![npm](https://img.shields.io/npm/v/borgjs.svg)](https://www.npmjs.com/package/borgjs)
[![David](https://img.shields.io/david/vesparny/borgjs.svg)](https://david-dm.org/vesparny/borgjs)

## configuration
```js
module.exports = {
  // Specify an alternative absolute path for the borg executable
  // defaults to the one in PATH
  // borgPath: '',

  // Borg repository path
  // can be remote or local
  // e.g. '/Users/me/Desktop/borg_backup' or 'user@myserver.cc:borg_backup'
  repository: '', // MANDATORY

  // An array of absolute paths to include in the backup
  // paths that do not exist will be excluded (Useful when a network share is not mounted)
  paths: [ // MANDATORY
    //  '/Users/me',
    //  '/etc
  ],

  // The logs dir absolute path
  // defaults to ~/.borgjs/logs
  // logsDir: '',

  // An array of files/directories to exclude from backup
  // exclude: [
  //  '*/node_modules',
  //  '*.DS_Store'
  // ],

  // A prefix for backup archives
  //  archivePrefix: 'backup',

  // Type of compression to use when creating archives. See
  // https://borgbackup.readthedocs.org/en/stable/usage.html#borg-create
  // lz4, zlib, lzma
  compression: '',

  // The encryption passphrase that will be used to set BORG_PASSPHRASE env variable
  // necessary to run automated backups with borg
  //  passphrase: '',

  // Check repo consistency
  // See https://borgbackup.readthedocs.org/en/stable/usage.html#borg-check
  check: true,

  // Retention policy for pruning old backups
  // https://borgbackup.readthedocs.org/en/stable/usage.html#borg-prune for details.
  // prune: {
  //    H: 10,
  //    d: 7,
  //    w: 4,
  //    m: 6,
  //    y: 1,
  //    'keep-within': '31d'
  // },

  // Email sender configuration
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
  sendSuccessMail: true,

  // Send an email on error (the 'email' section must be configured)
  sendErrorMail: true,

  // send native Desktop notifications on success/error
  sendSystemNotification: true
}
```
