const dateformat = require('dateformat');
const dockerode = require('dockerode');
const fse = require('fs-extra');
const _ = require('lodash');
const config = require('../config');
const backupsHistory = require('./backups-history');
const commands = require('./commands');
const logger = require('./logger');
const remoteStorage = require('./remote-storage');

const docker = new dockerode({ socketPath: '/var/run/docker.sock' });
const LOGTAG = '[backups]';

class Backups {
  //
  start() {
    logger.info(`${LOGTAG} Starting backup`);
    docker.listContainers((err, containers) => {
      if (err) {
        logger.error(`${LOGTAG} Error: ${err}`);
        setTimeout(() => this.start(), config.checkInterval);
        return;
      }
      _.forEach(containers, container => {
        const backupConfig = extractBackupConfig(container);
        if (backupConfig && isTimeToBackup(backupConfig)) {
          backupContainer(container, backupConfig);
        }
      });
      setTimeout(() => this.start(), config.checkInterval);
    });
  }
}

module.exports = new Backups();

function backupContainer(container, backupConfig) {
  logger.info(`${LOGTAG} Doing Backup: ${container.Names[0]}`);
  const folderName = `${dateformat(new Date(), 'yyyymmdd-hhMMss')}_${backupConfig.name}`;
  const folderPath = `${config.folders.tmp}/${folderName}`;
  Promise.resolve()
    .then(() => {
      return fse.ensureDir(`${folderPath}/command`);
    })
    .then(() => {
      return fse.ensureDir(`${folderPath}/files`);
    })
    .then(() => {
      return commands.execute(
        `cd ${folderPath}/command && docker exec ${container.Id} ${backupConfig.command} > ./output`
      );
    })
    .then(() => {
      if (backupConfig.file) {
        return commands.execute(`cd ${folderPath}/files && docker cp ${container.Id}:${backupConfig.file} .`);
      } else {
        return Promise.resolve();
      }
    })
    .then(() => {
      return commands.execute(`cd ${config.folders.tmp} && tar czf ${folderName}.tar.gz ${folderName}`);
    })
    .then(() => {
      return pause(1000);
    })
    .then(() => {
      return fse.remove(folderPath);
    })
    .then(() => {
      return remoteStorage.send(backupConfig.name, `${folderPath}.tar.gz`);
    })
    .then(() => {
      backupsHistory.setSuccessfull(backupConfig.name);
      return pause(1000);
    })
    .then(() => {
      return fse.remove(`${folderPath}.tar.gz`);
    })
    .then(() => {
      logger.info(`${LOGTAG} Backup Done: ${container.Names[0]}`);
    })
    .catch(error => {
      logger.info(`${LOGTAG} Backup Error: ${container.Names[0]}: ${error}`);
    });
}

function isTimeToBackup(backupConfig) {
  const lastBackup = backupsHistory.getLastSuccessDate(backupConfig.name);
  if (!lastBackup) {
    return true;
  }
  const age = new Date().getTime() - lastBackup.getTime();
  if (age > backupConfig.maxAge) {
    return true;
  }
  return false;
}

function extractBackupConfig(container) {
  const backupConfig = {};
  if (container.Labels[config.labels.name]) {
    backupConfig.name = container.Labels[config.labels.name];
  } else {
    return null;
  }
  if (container.Labels[config.labels.maxAge]) {
    backupConfig.maxAge = container.Labels[config.labels.maxAge];
  } else {
    backupConfig.maxAge = 3600 * 24 * 1000;
  }
  if (container.Labels[config.labels.command]) {
    backupConfig.command = container.Labels[config.labels.command];
  } else {
    return null;
  }
  if (container.Labels[config.labels.file]) {
    backupConfig.file = container.Labels[config.labels.file];
  }
  return backupConfig;
}

function pause(delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}
