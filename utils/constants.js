const ok = 200;
const created = 201;
const badRequest = 400;
const Unauthorized = 401;
const forbidden = 403;
const notFound = 404;
const conflict = 409;
const serverError = 500;
const MONGO_DUPLICATE_ERROR_CODE = 11000;

module.exports = {
  ok,
  created,
  badRequest,
  Unauthorized,
  forbidden,
  notFound,
  conflict,
  serverError,
  MONGO_DUPLICATE_ERROR_CODE,
};