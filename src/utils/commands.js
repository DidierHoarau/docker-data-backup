const exec = require('child_process').exec;
const logger = require('./logger');

const LOGTAG = '[commands]';

module.exports = {
  //
  execute: command => {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          logger.error(`${LOGTAG} ${error}`);
          logger.error(`${LOGTAG} ${stdout}`);
          logger.error(`${LOGTAG} ${stderr}`);
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }
};
