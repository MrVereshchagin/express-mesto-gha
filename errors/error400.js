const { badRequest } = require('../utils/constants');

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = badRequest;
  }
}

module.exports = BadRequest;