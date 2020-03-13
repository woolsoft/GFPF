const chalk = require('chalk')

const getLoggingDate = () => {
  const d = new Date()
  return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
}

module.exports = {
  warning: message =>
    console.log(chalk.yellow(`[Warning] - ${getLoggingDate()} >> ${message}`)),
  error: message =>
    console.log(chalk.red(`[Error] - ${getLoggingDate()} >> ${message}`)),
  debug: message =>
    console.log(chalk.magenta(`[Debug] - ${getLoggingDate()} >> ${message}`)),
}

