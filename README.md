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

It will take care of your backup workflow, sending you status reports through different possible channels.

## Features

* backup creation
* prune old backup according to a set of rules declared in the [configuration file](#configuration).
* check backups for consistency and integrity.
* send success/failure reports via email, push notifications on your phone or native OS notifications.
* lockfile system to prevent concurrent backup process running in the same destination.
* output borg messages to stdout for easy logging.
* highly [configurable](#configuration).
* allow to fully customize borg commands and environment variables.

## Usage CLI

In order to use borgjs, you need to configure borg before.
This is an easy step, just follow the [installation](http://borgbackup.readthedocs.io/en/stable/installation.html) guide on the borg website.

Initialize an empty borg repository (for more details see the borg [quickstart](http://borgbackup.readthedocs.io/en/stable/quickstart.html) guide)

```
$ borg init /path/to/repo
```
Install borgjs globally

```
$ npm i -g borgjs
```

Running a backup is as easy as creating a [borg repository](http://borgbackup.readthedocs.io/en/stable/usage.html#borg-init) and run

```shell
$ borgjs -c /User/me/borgjs.config.js
```
or
```
$ borgjs $(date +%Y-%m-%d-%H%M%S) -c /User/me/borgjs.config.js >> /Users/me/logs/$(date +%Y-%m-%d-%H%M%S).log
```
in case you want to specify the archive name and log to a file (useful if you run in as a cronjob).

```
$ borgjs --help

  A tiny wrapper for BorgBackup to automate your backup workflow

  Usage
  $ borgjs <archive><options>

Options
  -c, --config         config file path

Examples
  # run borgjs
  $ borgjs -c=/User/me/borgjs.config.js

  #run borgjs specifying the archive name, and log output to a file
  $ borgjs $(date +%Y-%m-%d-%H%M%S) -c /path/to/your/borgjs.config.js >> $(date +%Y-%m-%d-%H%M%S).log
```

## Usage API

You can also use borgjs programmatically:

```js
const borgjs = require('borgjs')
const config = {
  repository: '/Users/arny/Desktop/test/',
  paths: [
    '/Volumes/External/'
  ]
}
const archiveName = new Date().toString()

borgjs(config, archiveName)
.then(() => console.log('success'))
.catch((err) => console.log('error', err))
```

## Notifications

borgjs supports a wide range of notifications.

This enables you to always keep an eye on your backups.

Notifications will never contain sensitive informations such as encryption keys of files involved in the backup process.

* **OS native notifications**

![screen shot 2016-10-24 at 17 50 29](https://cloud.githubusercontent.com/assets/82070/19654341/256e3f7e-9a18-11e6-8453-6c11dafddb0b.png)


* **push notifications (via pushbullet)**

![img_2890](https://cloud.githubusercontent.com/assets/82070/19654365/366c6378-9a18-11e6-81cc-ef4271f71e2b.jpg)

* **email notifications**

![screen shot 2016-10-24 at 18 33 35](https://cloud.githubusercontent.com/assets/82070/19654415/6fa3d32e-9a18-11e6-92c0-a32feaa0e0de.png)


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

  // An array of files/directories to exclude from backup
  // exclude: [
  //  '*/node_modules',
  //  '*.DS_Store'
  // ],

  // A prefix for backup archives
  // archivePrefix: 'backup-',

  // Create backup archive
  // Use the options array to pass any options supported by borg create
  // See https://borgbackup.readthedocs.org/en/stable/usage.html#borg-create
  create: {
    options: [
     '--compression', 'lz4',
     '--filter', 'AME?'
    ]
  },
  // Check repo consistency
  // Use the options array to pass any options supported by borg check
  // See https://borgbackup.readthedocs.org/en/stable/usage.html#borg-check
  // check: {
  //  options: []
  // },

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
```

## Automate

A backup is not a backup if it's not automated.

I personally use [cronnix](https://www.macupdate.com/app/mac/7486/cronnix) to schedule my backup sessions on my mac.

<img src="https://cloud.githubusercontent.com/assets/82070/19662868/be07d350-9a39-11e6-88a8-697627d30453.png">

## Recipes

* Borg can store data on any remote host accessible over SSH. If you prefer to store your offsite backup in some other fancy cloud storage, you can always backup to a local target, then upload it anywhere using [rclone](http://rclone.org/)

* I personally use [rsync.net](http://rsync.net/) for my backup, they also apply [dirt cheap](http://www.rsync.net/products/attic.html) pricing model to borg users.
Please note I'm not affiliated with them, I'm just an happy paying customer.

## Change Log

This project adheres to [Semantic Versioning](http://semver.org/).  
Every release, along with the migration instructions, is documented in the [CHANGELOG.md](https://github.com/vesparny/borgjs/blob/master/CHANGELOG.md) file.

## License

MIT
