class BackupsHistory {
  constructor() {
    this.history = {};
  }

  setSuccessfull(serviceName) {
    if (this.history[serviceName]) {
      this.history[serviceName].lastSuccess = new Date();
    } else {
      this.history[serviceName] = { lastSuccess: new Date() };
    }
  }

  getLastSuccessDate(serviceName) {
    if (this.history[serviceName]) {
      return this.history[serviceName].lastSuccess;
    } else {
      return null;
    }
  }
}

module.exports = new BackupsHistory();
