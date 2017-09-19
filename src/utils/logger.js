const winston = require('winston');

const mode = process.env.NODE_ENV || 'prod';
let level = 'info';
let colorize = false;
if (mode === 'dev') {
  level = 'debug';
  colorize = true;
}

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level,
      colorize,
      prettyPrint: true,
      handleExceptions: true
    })
  ]
});

winston.level = 'debug';

// Public Functions
module.exports = logger;
