const chalk = require('chalk')
const intoStream = require('into-stream')
const fs = require('fs-extra')

function writeToConsole (...args) {
  console.log(...args)
  console.log(`${chalk.blue('===============================')}`)
}

function writeToLogFile (logFilePath, msg) {
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(logFilePath, {
      flags: 'a'
    })
    intoStream(msg + '\n').pipe(stream)
    intoStream('===============================\n').pipe(stream, {end: false})
    stream.on('finish', () => {
      resolve()
    })
  })
}

module.exports = {
  writeToConsole,
  writeToLogFile
}
