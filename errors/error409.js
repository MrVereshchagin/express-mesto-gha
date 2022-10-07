const { conflict } = require('../utils/constants');

class Conflict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = conflict;
  }
}

module.exports = Conflict;