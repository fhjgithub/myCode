const chalk = require('chalk')

const log = {
  log: console.log,

  log_error: (msg) => console.log(chalk.red(msg)),

  info: (msg) => console.log(chalk.green('➜') + '  ' + msg),

  error: (msg) => console.log(chalk.red('➜') + '  ' + msg),
}

module.exports = log
