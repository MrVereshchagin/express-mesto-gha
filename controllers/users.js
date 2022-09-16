const User = require('../models/user');

const BAD_REQUEST_CODE = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(NOT_FOUND).send({ message: 'Страница не найдена' });
      }
    });
};

const getCurrentUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error('NotValidId'))
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'NotFound' || err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else {
        res.status(BAD_REQUEST_CODE).send({ message: 'Пользователь по указанному _id не найден' });
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
      })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
          }
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные' });
      }
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(BAD_REQUEST_CODE).send({ message: 'Пользователь по указанному _id не найден' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные' });
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