const path = require('path')

module.exports = {
  repository: path.resolve(__dirname, 'test.repo'),
  paths: [
    path.resolve(__dirname, 'data')
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
  prune: {
    options: [
      '--keep-within', '1d'
    ]
  },
  env: {
    // BORG_REMOTE_PATH: 'borg1',
    BORG_PASSPHRASE: 'test'
  },
  onFinish: function (err, data, done) {
    if (err) {
      console.log('An error happened')
    } else {
      console.log(`Archive ${data.archiveName} created.`)
    }
    done()
  }
}
