const User = require('../models/user');
const { BAD_REQUEST_CODE, NOT_FOUND, SERVER_ERROR } = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const getCurrentUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error('Пользователя с таким id нет');
      error.statusCode = 404;
      throw error;
    })
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(NOT_FOUND).send({ message: 'Пользователя с таким id нет' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Неверный формат id' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => {
      res.send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error('Пользователя с таким id нет');
      error.statusCode = 404;
      throw error;Пользователя с таким id нет
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(NOT_FOUND).send({ message: 'Пользователя с таким id нет' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error('Пользователя с таким id нет');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(NOT_FOUND).send({ message: 'Пользователя с таким id нет' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports = {
  getUsers,
  getCurrentUser,
  createUser,
  updateProfile,
  updateAvatar,
};