// A very basic lockfile implementation based on pid
// https://www.npmjs.com/package/proper-lockfile
// TODO this should probably live in its own module

const fs = require('fs-extra')
const isRunning = require('is-running')

function lock (path, callback) {
  fs.exists(path, (res) => {
    if (res) {
      callback(new Error('lock already exists'))
    } else {
      fs.writeFile(path, process.pid, (err) => {
        if (err) {
          return callback(err)
        }
        callback()
      })
    }
  })
}

function unlock (path, callback) {
  // unlock only if there is no an old process already running
  const file = fs.readFileSync(path, 'utf8')
  const oldProcessPid = parseInt(file, 10)
  const runningProcess = isRunning(oldProcessPid)
  if (runningProcess && process.pid !== oldProcessPid) {
    return callback(new Error('another process is still running'))
  }
  fs.removeSync(path)
}

module.exports = {
  lock,
  unlock
}
