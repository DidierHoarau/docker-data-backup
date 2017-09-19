const fse = require("fs-extra");
const logger = require("./utils/logger");
const config = require("./config");
const backups = require("./utils/backups")

const LOGTAG = "[app]";

logger.info(`${LOGTAG} ====== Starting docker-data-backup ======`);
fse
  .remove(config.folders.tmp)
  .then(() => {
    return fse.ensureDir(config.folders.tmp);
  })
  .then(() => {
    backups.start();
  });
