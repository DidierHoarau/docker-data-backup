const logger = require('./logger');
const config = require('../config/');
const commands = require('./commands');

const LOGTAG = '[remote-storage]';

module.exports = {
  //
  send(serviceName, filePath) {
    return new Promise((resolve, reject) => {
      logger.info(`${LOGTAG} Sending: ${filePath}`);
      const remoteServer = `${config.storage.user}@${config.storage.host}`;
      const mkdirCommand = `ssh -p ${config.storage.port} -o StrictHostKeyChecking=no \
          ${remoteServer} "mkdir -p ${config.storage.folder}/${serviceName}" `;
      const uploadCommand = `scp -P ${config.storage.port} -o StrictHostKeyChecking=no \
          ${filePath} ${remoteServer}:${config.storage.folder}/${serviceName} `;
      commands
        .execute(mkdirCommand)
        .then(() => {
          return commands.execute(uploadCommand);
        })
        .then(() => {
          logger.info(`${LOGTAG} Sending Completed: ${filePath}`);
          resolve();
        })
        .catch(error => {
          logger.info(`${LOGTAG} Sending Failed: ${filePath}: ${error}`);
          reject(error);
        });
    });
  }
};
