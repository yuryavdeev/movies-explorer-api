const validator = require('validator');
const BadRequestError = require('../errors/bad-request');

const checkUrl = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new BadRequestError('- needs URL!');
};

module.exports = { checkUrl };
