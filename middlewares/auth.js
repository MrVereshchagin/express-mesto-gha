const { checkToken } = require('../helpers/jwt');

const Unauthorized = require('../errors/error401');

const isAuthorized = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    next(new Unauthorized('Авторизуйтесь для доступа'));

    return;
  }

  let payload;
  const token = auth.replace('Bearer ', '');
  try {
    payload = checkToken(token);
  } catch (err) {
    // eslint-disable-next-line consistent-return
    return next(new Unauthorized('Необходима авторизация'));
  }
  req.user = payload;
  next();
};

module.exports = { isAuthorized };