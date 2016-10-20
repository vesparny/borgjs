# 📦 borgjs

**A tiny wrapper for BorgBackup to automate your backup workflow**

[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/borgjs/discussion)
[![npm](https://img.shields.io/npm/v/borgjs.svg)](https://www.npmjs.com/package/borgjs)
[![Travis](https://img.shields.io/travis/vesparny/borgjs.svg)](https://travis-ci.org/vesparny/borgjs)


[![npm](https://img.shields.io/npm/dm/borgjs.svg)](https://npm-stat.com/charts.html?package=borgjs&from=2016-10-17)
[![David](https://img.shields.io/david/vesparny/borgjs.svg)](https://david-dm.org/vesparny/borgjs)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Overview

**Please note borgjs needs you to run node >=4 and has been tested using borg v1.0.7**

borgjs is a nodejs command line tool for [BorgBackup](http://borgbackup.readthedocs.io/en/stable/).

After having tried a lot of backup solutions for my data, I've been using Borg for quite a while. It's rock solid and never let me down.
It supports compression and authenticated encryption.

Backups should be as boring as possible, that's why I've created this tool in order to automate and constantly monitor the whole process, making it a little bit more user friendly.

Instead of writing complex bash scripts you can now just write a [declarative configuration file](#configuration), run borgjs in a crontab and forget about it.

It will take care of your backup workflow, sending you reports and writing detailed log files.

Also the console output looks pretty good.

<img width="849" alt="screen shot 2016-10-20 at 9 02 33 pm" src="https://cloud.githubusercontent.com/assets/82070/19576118/19704f5e-9712-11e6-9403-c4e19d1979d4.png">

## Usage

Install borgjs globally

```shell
npm i -g borgjs
```

Running a backup is as easy as creating a [borg repository](http://borgbackup.readthedocs.io/en/stable/usage.html#borg-init) and run

```shell
borgjs --config=/User/me/borgjs.config.js
```

```bash
borgjs --help

  📦  A tiny wrapper for BorgBackup to automate your backup workflow

  Usage
    $ borgjs <options>

  Options
    -c, --config          path of a borgjs config file.

  Examples
    borgjs --config=/User/me/borgjs.config.js
```

## Features

* backup creation
* prune old backup according to a set of rules declared in the [configuration file](#configuration).
* check backups for consistency and integrity
* send success/failure reports via email, push notifications on your phone or native OS notifications
* lockfile system based on PID in order to avoid concurrent backups to the same destination
* logs to a different file details about the backup session such as borg output and commands executed
* highly [configurable](#configuration)

## Notifications

borgjs supports a wide range of notifications, besides detailed logs creation.

This enables you to always keep an eye on your backups.

Notifications will never contain sensitive informations such as encryption keys of files involved in the backup process.
They will just contain the path of the generated log file and the status (success/error).

* **OS native notifications**

<img width="374" alt="screen shot 2016-10-20 at 8 57 05 pm" src="https://cloud.githubusercontent.com/assets/82070/19576219/6f625b32-9712-11e6-8e55-50c25ff901a0.png">

* **push notifications (via pushbullet)**

![optimized-img_2862](https://cloud.githubusercontent.com/assets/82070/19576378/0fb0c966-9713-11e6-8489-1f7ba70df740.PNG)

* **email notifications**

<img style="border:black" width="672" alt="screen shot 2016-10-20 at 10 23 27 pm" src="https://cloud.githubusercontent.com/assets/82070/19576624/e6f0c2dc-9713-11e6-9fd6-117b3c165df2.png">

## Configuration
```js
module.exports = {
  // Specify an alternative absolute path for the borg executable
  // defaults to the one in $PATH
  // borgPath: '',

  // Borg repository path
  // can be remote or local
  // see http://borgbackup.readthedocs.io/en/stable/usage.html#borg-init
  // e.g. '/Users/me/Desktop/borg_backup' or 'user@myserver.cc:borg_backup'
  repository: '', // MANDATORY

  // An array of absolute paths to include in the backup
  // paths that do not exist will be excluded (useful when a network share is not mounted)
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
  // archivePrefix: 'backup',

  // Type of compression to use when creating archives.
  // See https://borgbackup.readthedocs.org/en/stable/usage.html#borg-create
  // lz4, zlib, lzma
  compression: '',

  // The encryption passphrase that will be used to set BORG_PASSPHRASE env variable
  // necessary to run automated backups with borg if your repository has been created with encryption
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
```

## Automate

A backup is not a backup if it's not automated.

I personally use [cronnix](https://www.macupdate.com/app/mac/7486/cronnix) to schedule my backup sessions on my mac.

I also run it on a headless Raspberry Pi.


<img width="791" alt="screen shot 2016-10-20 at 10 37 01 pm" src="https://cloud.githubusercontent.com/assets/82070/19577018/c5161548-9715-11e6-974d-f465b7cc60e3.png">

## Recipes

* Borg can store data on any remote host accessible over SSH. If you prefer to store your offsite backup in some other fancy cloud storage, you can always backup to a local target, then upload it anywhere using [rclone](http://rclone.org/)

* I personally use [rsync.net](http://rsync.net/) for my backup, they also apply [dirty cheap](http://www.rsync.net/products/attic.html) pricing model to borg users.
Please not I'm not affiliated with them, I'm just an happy paying customer.

## Change Log

This project adheres to [Semantic Versioning](http://semver.org/).  
Every release, along with the migration instructions, is documented in the [CHANGELOG.md](https://github.com/vesparny/borgjs/blob/master/CHANGELOG.md) file.

## License

MIT
