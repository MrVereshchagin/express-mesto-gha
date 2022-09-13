const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      res.send({ message: err });
    });
};

const getCurrentUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      res.send({ message: err });
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
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.send({ message: err });
    });
};

module.exports = {
  getUsers,
  getCurrentUser,
  createUser,
  updateProfile
};