const { notFound } = require('../utils/constants');

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = notFound;
  }
}

module.exports = NotFound;