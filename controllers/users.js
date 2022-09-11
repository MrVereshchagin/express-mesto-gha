const User = require('../models/user');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      res.send({ message: err });
    });
};

const getCurrentUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      res.send({ message: err });
    });
};

const createUser = (req, res, next) => {
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
    });
};

module.exports = {
  getUsers,
  getCurrentUser,
  createUser,
};