const bcrypt = require('bcryptjs');

const User = require('../models/user');

const SALT_ROUNDS = 10;
const { generateToken } = require('../helpers/jwt');
const BadRequest = require('../errors/error400');
const NotFound = require('../errors/error404');
const Unauthorized = require('../errors/error401');
const Conflict = require('../errors/error409');

const { ok, created, MONGO_DUPLICATE_ERROR_CODE } = require('../utils/constants');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => new NotFound('Пользователя с таким id нет'))
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

const getCurrentUserProfile = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail(() => new NotFound('Пользователя не существует'))
    .then((user) => {
      res.status(ok).send({ data: user });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt
    .hash(password, SALT_ROUNDS)
    // eslint-disable-next-line arrow-body-style
    .then((hash) => {
      return User.create({
        name,
        about,
        avatar,
        email,
        password: hash, // записываем хеш в базу,
      });
    })
    .then((user) => res.status(created).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new Conflict('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Не авторизован');
      } else {
        return bcrypt
          .compare(password, user.password)
          .then((isPasswordCorrect) => {
            if (!isPasswordCorrect) {
              throw new Unauthorized('Не авторизован');
            } else {
              const token = generateToken({ _id: user._id.toString() });
              res.send({ token });
            }
          }).catch(() => next(new Unauthorized('Некорректный Email или пароль')));
      }
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new NotFound('Пользователя с таким id нет'))
    .then((user) => {
      res.status(ok).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFound('Пользователя с таким id нет'))
    .then((user) => {
      res.status(ok).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getCurrentUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getCurrentUserProfile,
};