const { serverError } = require('../utils/constants');

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = serverError;
  }
}

module.exports = ServerError;